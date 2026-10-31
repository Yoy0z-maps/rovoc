import type { Meaning } from "@/types/word";
import { isDirty, LocalWord, LocalWordbook } from "@/store/types";
import { createReviewState } from "@/utils/srs";
import { createId } from "@/utils/id";
import { addDays } from "@/utils/date";

export type RemoteWordbook = {
  id: string;
  name: string;
  description: string;
  is_important: boolean;
  created_at: string;
  image: string | null;
  views: number;
};

export type RemoteWord = {
  id: string;
  wordbook: string;
  text: string;
  meanings: Meaning[];
  is_important: boolean;
  created_at: string;
};

export type RemoteSnapshot = {
  wordbooks: RemoteWordbook[];
  // 단어장 목록을 빠짐없이 받았는지 (아니면 "서버에서 삭제됨"으로 판단하지 않는다)
  wordbooksComplete: boolean;
  // 단어 목록을 받는 데 성공한 단어장만 들어 있다
  wordsByBook: Record<string, RemoteWord[]>;
};

export type ImageDownload = { wordbookId: string; url: string; path: string };

export type MergeResult = {
  wordbooks: Record<string, LocalWordbook>;
  words: Record<string, LocalWord>;
  imageDownloads: ImageDownload[];
  removedImageFiles: string[];
};

// 서명된 이미지 URL은 요청마다 쿼리가 바뀌므로 경로만 비교한다
export const imagePath = (url: string | null | undefined) =>
  url ? url.split("?")[0] : null;

// 서버의 기본 이미지는 받지 않고 앱에 들어 있는 기본 이미지를 쓴다
const isCustomImage = (path: string | null): path is string =>
  !!path && !path.includes("rovoca/default");

const normalizeText = (text: string) => text.trim().toLowerCase();

export const normalizeMeanings = (meanings: unknown): Meaning[] =>
  Array.isArray(meanings)
    ? meanings.map((meaning) => ({
        part: String(meaning?.part ?? ""),
        definition: String(meaning?.definition ?? ""),
        example: String(meaning?.example ?? ""),
      }))
    : [];

/**
 * 서버에서 받은 데이터를 기기 데이터에 합친다.
 * - 기기에서 아직 올리지 않은 변경이 있으면 기기 쪽을 우선한다 (이후 업로드 단계에서 서버에 반영).
 * - 서버에만 있는 데이터는 기기에 추가하되, 아직 연결되지 않은 같은 이름의 단어장/단어가 있으면 합친다.
 * - 목록을 빠짐없이 받은 경우에만 "서버에서 삭제됨"으로 판단해 기기에서도 지운다.
 */
export function mergeRemoteSnapshot(
  local: {
    wordbooks: Record<string, LocalWordbook>;
    words: Record<string, LocalWord>;
  },
  remote: RemoteSnapshot,
  today: string
): MergeResult {
  const wordbooks = { ...local.wordbooks };
  const words = { ...local.words };
  const imageDownloads: ImageDownload[] = [];
  const removedImageFiles: string[] = [];

  const wordsInBook = (bookId: string) =>
    Object.values(words).filter((word) => word.wordbookId === bookId);

  const removeBook = (bookId: string) => {
    const imageFile = wordbooks[bookId]?.imageFile;
    if (imageFile) removedImageFiles.push(imageFile);
    delete wordbooks[bookId];
    for (const word of wordsInBook(bookId)) delete words[word.id];
  };

  const queueImage = (book: LocalWordbook, remoteImage: string | null) => {
    const path = imagePath(remoteImage);
    if (book.imageDirty || path === book.remoteImagePath) return;
    if (isCustomImage(path) && remoteImage) {
      imageDownloads.push({ wordbookId: book.id, url: remoteImage, path });
    } else if (!isCustomImage(path) && book.imageFile) {
      // 다른 기기에서 이미지를 기본 이미지로 되돌림
      removedImageFiles.push(book.imageFile);
      wordbooks[book.id] = { ...wordbooks[book.id], imageFile: null, remoteImagePath: path };
    }
  };

  // 1. 이미 서버와 연결된 단어장 갱신
  const remoteBooks = new Map(remote.wordbooks.map((book) => [String(book.id), book]));
  const mappedRemoteBooks = new Set<string>();

  for (const book of Object.values(local.wordbooks)) {
    if (!book.remoteId) continue;
    const remoteBook = remoteBooks.get(book.remoteId);

    if (!remoteBook) {
      if (!remote.wordbooksComplete) {
        mappedRemoteBooks.add(book.remoteId);
        continue;
      }
      if (book.deleted || !isDirty(book)) {
        removeBook(book.id); // 다른 기기에서 삭제됨
      } else {
        // 이 기기에서 수정한 단어장은 단어와 함께 다시 올린다
        wordbooks[book.id] = { ...book, remoteId: null, imageDirty: !!book.imageFile };
        for (const word of wordsInBook(book.id)) {
          if (word.deleted) delete words[word.id];
          else words[word.id] = { ...word, remoteId: null };
        }
      }
      continue;
    }

    mappedRemoteBooks.add(book.remoteId);
    if (book.deleted) continue;
    if (!isDirty(book)) {
      wordbooks[book.id] = {
        ...book,
        name: remoteBook.name,
        description: remoteBook.description ?? "",
        is_important: !!remoteBook.is_important,
      };
    }
    queueImage(wordbooks[book.id], remoteBook.image);
  }

  // 2. 서버에만 있는 단어장 추가 (같은 이름의 연결 안 된 단어장이 있으면 합침)
  for (const remoteBook of remote.wordbooks) {
    const remoteId = String(remoteBook.id);
    if (mappedRemoteBooks.has(remoteId)) continue;
    mappedRemoteBooks.add(remoteId);

    const match = Object.values(wordbooks).find(
      (book) =>
        !book.remoteId &&
        !book.deleted &&
        normalizeText(book.name) === normalizeText(remoteBook.name)
    );
    if (match) {
      wordbooks[match.id] = { ...match, remoteId };
      continue;
    }

    const id = createId();
    wordbooks[id] = {
      id,
      remoteId,
      rev: 0,
      syncedRev: 0,
      deleted: false,
      name: remoteBook.name,
      description: remoteBook.description ?? "",
      imageFile: null,
      imageDirty: false,
      remoteImagePath: null,
      is_important: !!remoteBook.is_important,
      created_at: remoteBook.created_at,
      views: remoteBook.views ?? 0,
    };
    queueImage(wordbooks[id], remoteBook.image);
  }

  // 3. 단어 (단어 목록을 받은 단어장만)
  const localBookByRemoteId = new Map(
    Object.values(wordbooks)
      .filter((book) => book.remoteId && !book.deleted)
      .map((book) => [book.remoteId as string, book])
  );

  for (const [remoteBookId, remoteWords] of Object.entries(remote.wordsByBook)) {
    const book = localBookByRemoteId.get(String(remoteBookId));
    if (!book) continue;

    const remoteWordsById = new Map(remoteWords.map((word) => [String(word.id), word]));
    const mappedRemoteWords = new Set<string>();
    const unlinkedByText = new Map<string, LocalWord>();

    for (const word of wordsInBook(book.id)) {
      if (!word.remoteId) {
        if (!word.deleted) unlinkedByText.set(normalizeText(word.text), word);
        continue;
      }
      const remoteWord = remoteWordsById.get(word.remoteId);
      if (!remoteWord) {
        if (word.deleted || !isDirty(word)) delete words[word.id];
        else words[word.id] = { ...word, remoteId: null };
        continue;
      }
      mappedRemoteWords.add(word.remoteId);
      if (word.deleted || isDirty(word)) continue;
      words[word.id] = {
        ...word,
        text: remoteWord.text,
        meanings: normalizeMeanings(remoteWord.meanings),
        is_important: !!remoteWord.is_important,
      };
    }

    for (const remoteWord of remoteWords) {
      const remoteId = String(remoteWord.id);
      if (mappedRemoteWords.has(remoteId)) continue;

      const key = normalizeText(remoteWord.text);
      const match = unlinkedByText.get(key);
      if (match) {
        unlinkedByText.delete(key);
        words[match.id] = { ...match, remoteId };
        continue;
      }

      const id = createId();
      words[id] = {
        id,
        remoteId,
        rev: 0,
        syncedRev: 0,
        deleted: false,
        wordbookId: book.id,
        text: remoteWord.text,
        meanings: normalizeMeanings(remoteWord.meanings),
        is_important: !!remoteWord.is_important,
        created_at: remoteWord.created_at,
        review: createReviewState(today),
      };
    }
  }

  return { wordbooks, words, imageDownloads, removedImageFiles };
}

/**
 * 서버의 연속 출석 기록을 기기 학습일에 합친다.
 * (서버 streak은 last_active_date까지 이어진 일수이므로, 아직 이어지고 있을 때만 반영)
 */
export function mergeServerStreak(
  studyDates: string[],
  streak: number,
  lastActiveDate: string | null,
  today: string,
  maxDates = 400
) {
  if (!lastActiveDate || streak <= 0 || lastActiveDate < addDays(today, -1)) {
    return studyDates;
  }
  const dates = new Set(studyDates);
  const before = dates.size;
  for (let i = 0; i < Math.min(streak, maxDates); i++) {
    dates.add(addDays(lastActiveDate, -i));
  }
  if (dates.size === before) return studyDates;
  return [...dates].sort().slice(-maxDates);
}
