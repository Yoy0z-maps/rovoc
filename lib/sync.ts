import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { authFetch, ensureOk } from "@/lib/api";
import { ApiError, isTemporaryFailure } from "@/lib/errors";
import {
  setLocalChangeListener,
  setLoggedIn,
  useLibrary,
} from "@/store/library";
import { isDirty, LocalWord, LocalWordbook } from "@/store/types";
import { toDateKey } from "@/utils/date";
import { getAccessToken } from "@/utils/token";
import {
  deleteWordbookImage,
  downloadWordbookImage,
  resolveWordbookImage,
} from "@/utils/wordbookImage";
import {
  ImageDownload,
  imagePath,
  mergeRemoteSnapshot,
  mergeServerStreak,
  RemoteSnapshot,
  RemoteWord,
  RemoteWordbook,
} from "./syncMerge";

const { getState, setState } = useLibrary;

const CONCURRENCY = 4;
const AUTO_SYNC_DELAY_MS = 3000;
const STALE_AFTER_MS = 5 * 60 * 1000;
const JSON_HEADERS = { "Content-Type": "application/json" };

export type SyncResult =
  | { ok: true; failedItems: number }
  | { ok: false; error: string };

let running: Promise<SyncResult> | null = null;
let rerunRequested = false;
let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * 기기 데이터를 서버와 동기화한다 (서버 → 기기 병합 후, 기기 변경분 업로드).
 * 이미 진행 중이면 그 결과를 돌려주고, 끝난 뒤 한 번 더 실행한다.
 */
export function syncNow(): Promise<SyncResult> {
  if (running) {
    rerunRequested = true;
    return running;
  }
  running = runSync().finally(() => {
    running = null;
    if (rerunRequested) {
      rerunRequested = false;
      scheduleSync(0);
    }
  });
  return running;
}

/** 로그인 상태일 때만, 잠시 뒤에 동기화한다 (연속 수정은 한 번에 올림) */
export function scheduleSync(delay = AUTO_SYNC_DELAY_MS) {
  if (!getState().loggedIn) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    void syncNow();
  }, delay);
}

/** 마지막 동기화가 오래됐으면 동기화한다 (앱이 다시 활성화될 때 등) */
export function syncIfStale() {
  const { loggedIn, sync } = getState();
  if (!loggedIn) return;
  const lastSyncedAt = sync.lastSyncedAt ? Date.parse(sync.lastSyncedAt) : 0;
  if (Date.now() - lastSyncedAt > STALE_AFTER_MS) void syncNow();
}

setLocalChangeListener(() => scheduleSync());

async function runSync(): Promise<SyncResult> {
  if (!(await getAccessToken())) {
    setLoggedIn(false);
    return { ok: false, error: "Not signed in." };
  }

  setState({ syncStatus: { state: "syncing", error: null, failedItems: 0 } });
  try {
    const snapshot = await fetchRemoteSnapshot();
    const downloads = applySnapshot(snapshot);
    await downloadImages(downloads);
    const failedItems = await pushChanges();
    await syncAccount();

    setState((state) => ({
      sync: { ...state.sync, lastSyncedAt: new Date().toISOString() },
      syncStatus: { state: "idle", error: null, failedItems },
    }));
    return { ok: true, failedItems };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // 세션이 거부되어 토큰이 지워졌으면 로그아웃 상태로 바꾼다 (기기 데이터는 그대로)
    if (!(await getAccessToken())) setLoggedIn(false);
    setState({ syncStatus: { state: "error", error: message, failedItems: 0 } });
    return { ok: false, error: message };
  }
}

// ---------- 서버 → 기기 ----------

type Page<T> = { count?: number; next?: string | null; results?: T[] };

async function getJson<T>(path: string): Promise<T> {
  const response = await authFetch(path);
  await ensureOk(response);
  return response.json() as Promise<T>;
}

// DRF가 주는 next 주소는 프록시 뒤에서 http로 만들어질 수 있으므로 경로만 사용한다
const toApiPath = (url: string) =>
  url.startsWith(API_SERVER_ADDRESS)
    ? url.slice(API_SERVER_ADDRESS.length)
    : url.replace(/^https?:\/\/[^/]+/, "");

async function fetchAllWordbooks() {
  // 서버는 15개씩 페이지를 나눠 주므로 끝까지 따라간다
  const items: RemoteWordbook[] = [];
  let next: string | null = "/word/wordbooks/";
  let count: number | undefined;
  for (let page = 0; next && page < 500; page++) {
    const data: Page<RemoteWordbook> | RemoteWordbook[] = await getJson(next);
    if (Array.isArray(data)) {
      items.push(...data);
      count = data.length;
      break;
    }
    items.push(...(data.results ?? []));
    count = data.count;
    next = data.next ? toApiPath(data.next) : null;
  }

  const unique = new Map(
    items.map((book) => [String(book.id), { ...book, id: String(book.id) }])
  );
  return {
    wordbooks: [...unique.values()],
    complete: count === undefined || unique.size === count,
  };
}

async function fetchRemoteSnapshot(): Promise<RemoteSnapshot> {
  const { wordbooks, complete } = await fetchAllWordbooks();
  const wordsByBook: Record<string, RemoteWord[]> = {};

  await runWithConcurrency(wordbooks, CONCURRENCY, async (book) => {
    try {
      // 단어장 하나의 단어를 페이지 없이 한 번에 받는 API
      const data = await getJson<{ words?: RemoteWord[] }>(
        `/word/wordbooks/id/?wordbook=${encodeURIComponent(book.id)}`
      );
      wordsByBook[book.id] = (data.words ?? []).map((word) => ({
        ...word,
        id: String(word.id),
        wordbook: String(word.wordbook),
      }));
    } catch (error) {
      if (isTemporaryFailure(error) || isSessionError(error)) throw error;
      // 받지 못한 단어장은 이번에는 병합하지 않는다 (삭제로 오해하지 않도록)
    }
  });

  return { wordbooks, wordbooksComplete: complete, wordsByBook };
}

function applySnapshot(snapshot: RemoteSnapshot) {
  let downloads: ImageDownload[] = [];
  let removedImageFiles: string[] = [];
  // 받아오는 동안 기기에서 수정한 내용이 사라지지 않도록, 최신 상태를 기준으로 한 번에 병합한다
  setState((state) => {
    const result = mergeRemoteSnapshot(
      { wordbooks: state.wordbooks, words: state.words },
      snapshot,
      toDateKey()
    );
    downloads = result.imageDownloads;
    removedImageFiles = result.removedImageFiles;
    return { wordbooks: result.wordbooks, words: result.words };
  });
  for (const fileName of removedImageFiles) deleteWordbookImage(fileName);
  return downloads;
}

async function downloadImages(downloads: ImageDownload[]) {
  await runWithConcurrency(downloads, CONCURRENCY, async (download) => {
    try {
      const fileName = await downloadWordbookImage(download.url);
      let replaced = null as string | null;
      let applied = false;
      setState((state) => {
        const book = state.wordbooks[download.wordbookId];
        if (!book || book.imageDirty) return {};
        applied = true;
        replaced = book.imageFile;
        return {
          wordbooks: {
            ...state.wordbooks,
            [book.id]: { ...book, imageFile: fileName, remoteImagePath: download.path },
          },
        };
      });
      deleteWordbookImage(applied ? replaced : fileName);
    } catch (error) {
      // 다음 동기화 때 다시 시도한다
      console.warn("Unable to download wordbook image:", error);
    }
  });
}

// ---------- 기기 → 서버 ----------

const isSessionError = (error: unknown) =>
  error instanceof ApiError && error.status === 401;

async function pushChanges() {
  let failedItems = 0;
  const onItemError = (error: unknown) => {
    // 네트워크 끊김·세션 만료는 동기화를 멈추고, 항목별 오류는 건너뛴 뒤 다음 동기화 때 다시 시도한다
    if (isTemporaryFailure(error) || isSessionError(error)) throw error;
    failedItems += 1;
    console.warn("Unable to sync item:", error);
  };

  for (const book of Object.values(getState().wordbooks)) {
    try {
      await pushWordbook(book);
    } catch (error) {
      onItemError(error);
    }
  }

  const words = Object.values(getState().words).filter(
    (word) => word.deleted || !word.remoteId || isDirty(word)
  );
  await runWithConcurrency(words, CONCURRENCY, async (word) => {
    try {
      await pushWord(word);
    } catch (error) {
      onItemError(error);
    }
  });

  return failedItems;
}

async function deleteRemote(path: string) {
  const response = await authFetch(path, { method: "DELETE" });
  if (response.status === 404) return; // 이미 지워짐
  await ensureOk(response);
}

function wordbookRequestBody(book: LocalWordbook, uploadImage: boolean) {
  if (!uploadImage || !book.imageFile) {
    return {
      headers: JSON_HEADERS,
      body: JSON.stringify({
        name: book.name,
        description: book.description,
        is_important: book.is_important,
      }),
    };
  }

  const formData = new FormData();
  formData.append("name", book.name);
  formData.append("description", book.description);
  formData.append("is_important", String(book.is_important));
  const extension = book.imageFile.split(".").pop()?.toLowerCase() ?? "jpg";
  formData.append("image", {
    uri: resolveWordbookImage(book.imageFile),
    type: `image/${extension === "jpg" ? "jpeg" : extension}`,
    name: book.imageFile,
  } as unknown as Blob);
  return { body: formData };
}

async function pushWordbook(book: LocalWordbook) {
  if (book.deleted) {
    if (book.remoteId) await deleteRemote(`/word/wordbooks/${book.remoteId}/`);
    setState((state) => {
      const current = state.wordbooks[book.id];
      if (!current?.deleted) return {};
      const wordbooks = { ...state.wordbooks };
      delete wordbooks[book.id];
      return { wordbooks };
    });
    return;
  }
  if (book.remoteId && !isDirty(book)) return;

  const uploadImage = book.imageDirty && !!book.imageFile;
  const response = await authFetch(
    book.remoteId ? `/word/wordbooks/${book.remoteId}/` : "/word/wordbooks/",
    { method: book.remoteId ? "PATCH" : "POST", ...wordbookRequestBody(book, uploadImage) }
  );
  await ensureOk(response);
  const saved = (await response.json()) as RemoteWordbook;
  const remoteId = String(saved.id);

  let exists = false;
  setState((state) => {
    const current = state.wordbooks[book.id];
    if (!current) return {};
    exists = true;
    return {
      wordbooks: {
        ...state.wordbooks,
        [book.id]: {
          ...current,
          remoteId,
          syncedRev: book.rev,
          // 올리는 동안 이미지를 또 바꿨으면 다음 동기화 때 다시 올린다
          imageDirty: uploadImage && current.rev === book.rev ? false : current.imageDirty,
          remoteImagePath: uploadImage ? imagePath(saved.image) : current.remoteImagePath,
        },
      },
    };
  });
  // 올리는 동안 기기에서 지운 단어장이면 서버에서도 지운다
  if (!exists && !book.remoteId) await deleteRemote(`/word/wordbooks/${remoteId}/`);
}

async function pushWord(word: LocalWord) {
  const book = getState().wordbooks[word.wordbookId];

  if (word.deleted) {
    // 단어장이 지워졌으면 서버에서 단어도 함께 지워진다
    if (word.remoteId && book?.remoteId && !book.deleted) {
      await deleteRemote(`/word/words/${word.remoteId}/`);
    }
    setState((state) => {
      if (!state.words[word.id]?.deleted) return {};
      const words = { ...state.words };
      delete words[word.id];
      return { words };
    });
    return;
  }
  // 단어장이 아직 서버에 없으면 다음 동기화 때 올린다
  if (!book?.remoteId || book.deleted) return;
  if (word.remoteId && !isDirty(word)) return;

  const response = await authFetch(
    word.remoteId ? `/word/words/${word.remoteId}/` : "/word/words/",
    {
      method: word.remoteId ? "PATCH" : "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        wordbook: book.remoteId,
        text: word.text,
        meanings: word.meanings,
        is_important: word.is_important,
      }),
    }
  );
  await ensureOk(response);
  const saved = (await response.json()) as RemoteWord;
  const remoteId = String(saved.id);

  let exists = false;
  setState((state) => {
    const current = state.words[word.id];
    if (!current) return {};
    exists = true;
    return {
      words: { ...state.words, [word.id]: { ...current, remoteId, syncedRev: word.rev } },
    };
  });
  if (!exists && !word.remoteId) await deleteRemote(`/word/words/${remoteId}/`);
}

// ---------- 점수 · 출석 · 계정 정보 ----------

type MeResponse = {
  id: number;
  social_id: string | number;
  provider: string;
  nickname: string;
  profile_image: string | null;
  score: number;
  streak: number;
  last_active_date: string | null;
};

async function syncAccount() {
  const pendingScore = getState().progress.pendingScore;
  if (pendingScore !== 0) {
    const response = await authFetch("/users/user/score/", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ score_change: pendingScore }),
    });
    await ensureOk(response);
    setState((state) => ({
      progress: {
        ...state.progress,
        pendingScore: state.progress.pendingScore - pendingScore,
      },
    }));
  }

  const today = toDateKey();
  if (getState().progress.studyDates.includes(today)) {
    const response = await authFetch("/users/user/activity/", { method: "POST" });
    await ensureOk(response);
  }

  const me = await getJson<MeResponse>("/users/user/me/");
  setState((state) => ({
    sync: {
      ...state.sync,
      account: {
        id: me.id,
        nickname: me.nickname,
        profile_image: me.profile_image,
        social_id: String(me.social_id),
        provider: me.provider,
      },
    },
    progress: {
      ...state.progress,
      score: me.score + state.progress.pendingScore,
      studyDates: mergeServerStreak(
        state.progress.studyDates,
        me.streak,
        me.last_active_date,
        today
      ),
    },
  }));
}

// ---------- 유틸 ----------

async function runWithConcurrency<T>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<void>
) {
  let index = 0;
  let failure: unknown = null;
  const worker = async () => {
    while (failure === null && index < items.length) {
      const item = items[index++];
      try {
        await task(item);
      } catch (error) {
        failure = error;
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  if (failure !== null) throw failure;
}
