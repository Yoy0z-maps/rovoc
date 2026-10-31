import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import type { Meaning } from "@/types/word";
import { createId } from "@/utils/id";
import { toDateKey } from "@/utils/date";
import { applyReview, createReviewState } from "@/utils/srs";
import {
  deleteAllWordbookImages,
  deleteWordbookImage,
} from "@/utils/wordbookImage";
import type {
  LocalWord,
  LocalWordbook,
  Progress,
  Settings,
  SyncInfo,
} from "./types";

type LibraryData = {
  wordbooks: Record<string, LocalWordbook>;
  words: Record<string, LocalWord>;
  progress: Progress;
  settings: Settings;
  sync: SyncInfo;
};

export type SyncStatus = {
  state: "idle" | "syncing" | "error";
  error: string | null;
  failedItems: number;
};

type LibraryState = LibraryData & {
  hydrated: boolean;
  loggedIn: boolean;
  syncStatus: SyncStatus;
};

// 데이터 종류별로 키를 나눠 저장한다 (한 키가 너무 커지면 안드로이드에서 읽지 못할 수 있음)
const DATA_KEYS = ["wordbooks", "words", "progress", "settings", "sync"] as const;
type DataKey = (typeof DATA_KEYS)[number];
const storageKey = (key: DataKey) => `rovoca.${key}.v1`;

const MAX_STUDY_DATES = 400;

const defaultData = (): LibraryData => ({
  wordbooks: {},
  words: {},
  progress: { score: 0, pendingScore: 0, studyDates: [] },
  settings: {
    reminderEnabled: true,
    reminderHour: 20,
    notificationPermissionAsked: false,
  },
  sync: { lastSyncedAt: null, account: null },
});

export const useLibrary = create<LibraryState>()(() => ({
  ...defaultData(),
  hydrated: false,
  loggedIn: false,
  syncStatus: { state: "idle", error: null, failedItems: 0 },
}));

const { getState, setState } = useLibrary;

// ---------- 저장 ----------

const pendingKeys = new Set<DataKey>();
let persistTimer: ReturnType<typeof setTimeout> | null = null;
// 저장된 데이터를 읽지 못했으면, 기본값으로 덮어쓰지 않도록 저장을 멈춘다
let persistenceDisabled = false;

export async function flushLibrary() {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  if (persistenceDisabled || pendingKeys.size === 0) return;

  const state = getState();
  const keys = [...pendingKeys];
  pendingKeys.clear();
  try {
    await AsyncStorage.multiSet(
      keys.map((key) => [storageKey(key), JSON.stringify(state[key])])
    );
  } catch (error) {
    console.error("Unable to save local data:", error);
    for (const key of keys) pendingKeys.add(key);
  }
}

useLibrary.subscribe((state, prev) => {
  if (!state.hydrated || !prev.hydrated) return;
  for (const key of DATA_KEYS) {
    if (state[key] !== prev[key]) pendingKeys.add(key);
  }
  if (pendingKeys.size > 0 && !persistTimer) {
    persistTimer = setTimeout(() => void flushLibrary(), 300);
  }
});

AppState.addEventListener("change", (appState) => {
  if (appState !== "active") void flushLibrary();
});

let hydrating: Promise<void> | null = null;

export function hydrateLibrary() {
  if (!hydrating) hydrating = loadLibrary();
  return hydrating;
}

async function loadLibrary() {
  const defaults = defaultData();
  const loaded: Partial<LibraryData> = {};
  try {
    const entries = await AsyncStorage.multiGet(DATA_KEYS.map(storageKey));
    for (const [index, key] of DATA_KEYS.entries()) {
      const raw = entries[index]?.[1];
      if (!raw) continue;
      try {
        loaded[key] = JSON.parse(raw);
      } catch {
        // 손상된 데이터는 덮어쓰기 전에 따로 보관해 둔다
        await AsyncStorage.setItem(`${storageKey(key)}.corrupt`, raw).catch(
          () => undefined
        );
      }
    }
  } catch (error) {
    console.error("Unable to load local data:", error);
    persistenceDisabled = true;
  }

  setState({
    wordbooks: loaded.wordbooks ?? defaults.wordbooks,
    words: loaded.words ?? defaults.words,
    progress: { ...defaults.progress, ...loaded.progress },
    settings: { ...defaults.settings, ...loaded.settings },
    sync: { ...defaults.sync, ...loaded.sync },
    hydrated: true,
  });
}

// ---------- 변경 알림 (로그인 상태면 동기화 예약) ----------

let changeListener: (() => void) | null = null;

export function setLocalChangeListener(listener: (() => void) | null) {
  changeListener = listener;
}

const notifyChange = () => changeListener?.();
const nowIso = () => new Date().toISOString();

function updateWordbookEntry(
  id: string,
  update: (book: LocalWordbook) => LocalWordbook
) {
  setState((state) => {
    const book = state.wordbooks[id];
    return book ? { wordbooks: { ...state.wordbooks, [id]: update(book) } } : {};
  });
}

function updateWordEntry(id: string, update: (word: LocalWord) => LocalWord) {
  setState((state) => {
    const word = state.words[id];
    return word ? { words: { ...state.words, [id]: update(word) } } : {};
  });
}

// ---------- 단어장 ----------

export function createWordbook(input: {
  name: string;
  description: string;
  imageFile?: string | null;
}) {
  const id = createId();
  const book: LocalWordbook = {
    id,
    remoteId: null,
    rev: 1,
    syncedRev: 0,
    deleted: false,
    name: input.name,
    description: input.description,
    imageFile: input.imageFile ?? null,
    imageDirty: !!input.imageFile,
    remoteImagePath: null,
    is_important: false,
    created_at: nowIso(),
    views: 0,
  };
  setState((state) => ({ wordbooks: { ...state.wordbooks, [id]: book } }));
  notifyChange();
  return id;
}

export function editWordbook(
  id: string,
  patch: { name?: string; description?: string; imageFile?: string }
) {
  const previousImage = getState().wordbooks[id]?.imageFile ?? null;
  const imageChanged =
    patch.imageFile !== undefined && patch.imageFile !== previousImage;

  updateWordbookEntry(id, (book) => ({
    ...book,
    ...patch,
    imageDirty: book.imageDirty || imageChanged,
    rev: book.rev + 1,
  }));
  if (imageChanged) deleteWordbookImage(previousImage);
  notifyChange();
}

export function toggleWordbookImportant(id: string) {
  updateWordbookEntry(id, (book) => ({
    ...book,
    is_important: !book.is_important,
    rev: book.rev + 1,
  }));
  notifyChange();
}

export function deleteWordbook(id: string) {
  const book = getState().wordbooks[id];
  if (!book) return;

  setState((state) => {
    const wordbooks = { ...state.wordbooks };
    const words = { ...state.words };
    // 서버에서는 단어장을 지우면 단어도 함께 지워지므로 기기에서도 바로 지운다
    for (const word of Object.values(state.words)) {
      if (word.wordbookId === id) delete words[word.id];
    }
    if (book.remoteId) {
      wordbooks[id] = { ...book, deleted: true, rev: book.rev + 1 };
    } else {
      delete wordbooks[id];
    }
    return { wordbooks, words };
  });
  deleteWordbookImage(book.imageFile);
  notifyChange();
}

// 조회 수는 기기에서만 센다 (서버에 올리지 않음)
export function countWordbookView(id: string) {
  updateWordbookEntry(id, (book) => ({ ...book, views: book.views + 1 }));
}

// ---------- 단어 ----------

export function createWord(
  wordbookId: string,
  input: { text: string; meanings: Meaning[] }
) {
  const id = createId();
  const word: LocalWord = {
    id,
    remoteId: null,
    rev: 1,
    syncedRev: 0,
    deleted: false,
    wordbookId,
    text: input.text,
    meanings: input.meanings,
    is_important: false,
    created_at: nowIso(),
    review: createReviewState(toDateKey()),
  };
  setState((state) => ({ words: { ...state.words, [id]: word } }));
  notifyChange();
  return id;
}

export function editWord(
  id: string,
  patch: { text?: string; meanings?: Meaning[] }
) {
  updateWordEntry(id, (word) => ({ ...word, ...patch, rev: word.rev + 1 }));
  notifyChange();
}

export function toggleWordImportant(id: string) {
  updateWordEntry(id, (word) => ({
    ...word,
    is_important: !word.is_important,
    rev: word.rev + 1,
  }));
  notifyChange();
}

export function deleteWord(id: string) {
  setState((state) => {
    const word = state.words[id];
    if (!word) return {};
    const words = { ...state.words };
    if (word.remoteId) words[id] = { ...word, deleted: true, rev: word.rev + 1 };
    else delete words[id];
    return { words };
  });
  notifyChange();
}

// ---------- 학습 기록 (기기에만 저장) ----------

export function recordAnswer(wordId: string, correct: boolean) {
  updateWordEntry(wordId, (word) => ({
    ...word,
    review: applyReview(word.review, correct, toDateKey()),
  }));
}

export function removeFromWrongNote(wordId: string) {
  updateWordEntry(wordId, (word) => ({
    ...word,
    review: { ...word.review, inWrongNote: false },
  }));
}

export function addScore(delta: number) {
  if (!delta) return;
  setState((state) => ({
    progress: {
      ...state.progress,
      score: state.progress.score + delta,
      pendingScore: state.progress.pendingScore + delta,
    },
  }));
  notifyChange();
}

/** 오늘 처음 학습한 경우 true */
export function markStudied() {
  const today = toDateKey();
  if (getState().progress.studyDates.includes(today)) return false;
  setState((state) => ({
    progress: {
      ...state.progress,
      studyDates: [...state.progress.studyDates, today].slice(-MAX_STUDY_DATES),
    },
  }));
  notifyChange();
  return true;
}

export function updateSettings(patch: Partial<Settings>) {
  setState((state) => ({ settings: { ...state.settings, ...patch } }));
}

// ---------- 계정 ----------

export function setLoggedIn(loggedIn: boolean) {
  setState({ loggedIn });
}

/**
 * 다른 계정으로 로그인할 때 이전 계정과의 연결을 끊는다.
 * 기기 데이터는 남기고, 다음 동기화 때 새 계정에 새로 올린다.
 */
export function unlinkFromAccount() {
  setState((state) => {
    const wordbooks: Record<string, LocalWordbook> = {};
    for (const book of Object.values(state.wordbooks)) {
      if (book.deleted) continue;
      wordbooks[book.id] = {
        ...book,
        remoteId: null,
        remoteImagePath: null,
        imageDirty: !!book.imageFile,
      };
    }
    const words: Record<string, LocalWord> = {};
    for (const word of Object.values(state.words)) {
      if (word.deleted) continue;
      words[word.id] = { ...word, remoteId: null };
    }
    // 점수는 이전 계정의 서버 점수이므로 옮기지 않는다 (아직 올리지 않은 점수만 새 계정에 반영)
    return { wordbooks, words, sync: { lastSyncedAt: null, account: null } };
  });
}

/** 기기에 저장된 단어·단어장·학습 기록을 모두 지운다 (설정은 유지) */
export function clearLibrary() {
  deleteAllWordbookImages();
  const defaults = defaultData();
  setState({
    wordbooks: defaults.wordbooks,
    words: defaults.words,
    progress: defaults.progress,
    sync: defaults.sync,
  });
}
