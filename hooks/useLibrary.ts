import { useMemo } from "react";
import { useLibrary } from "@/store/library";
import type { LocalWord, LocalWordbook } from "@/store/types";
import type { Wordbook } from "@/types/wordbooks";
import { getStreak, toDateKey } from "@/utils/date";
import { isDue } from "@/utils/srs";
import { resolveWordbookImage } from "@/utils/wordbookImage";

const byCreatedAt = (a: { created_at: string }, b: { created_at: string }) =>
  a.created_at.localeCompare(b.created_at);

const toWordbook = (book: LocalWordbook, wordCount: number): Wordbook => ({
  id: book.id,
  name: book.name,
  description: book.description,
  is_important: book.is_important,
  created_at: book.created_at,
  image: resolveWordbookImage(book.imageFile),
  views: book.views,
  word_count: wordCount,
});

export function useActiveWords(): LocalWord[] {
  const words = useLibrary((state) => state.words);
  return useMemo(
    () => Object.values(words).filter((word) => !word.deleted).sort(byCreatedAt),
    [words]
  );
}

export function useWordbooks(): Wordbook[] {
  const wordbooks = useLibrary((state) => state.wordbooks);
  // 게임 중 학습 기록이 바뀔 때마다 단어장 목록을 새로 만들지 않도록, 단어 수만 문자열로 구독한다
  const wordCountsKey = useLibrary((state) => {
    const counts: Record<string, number> = {};
    for (const word of Object.values(state.words)) {
      if (!word.deleted) counts[word.wordbookId] = (counts[word.wordbookId] ?? 0) + 1;
    }
    return JSON.stringify(counts);
  });

  return useMemo(() => {
    const counts = JSON.parse(wordCountsKey) as Record<string, number>;
    return Object.values(wordbooks)
      .filter((book) => !book.deleted)
      .sort(byCreatedAt)
      .map((book) => toWordbook(book, counts[book.id] ?? 0));
  }, [wordbooks, wordCountsKey]);
}

export function useWordsInBook(wordbookId?: string) {
  const words = useActiveWords();
  return useMemo(
    () => (wordbookId ? words.filter((word) => word.wordbookId === wordbookId) : []),
    [words, wordbookId]
  );
}

export function useWordsOnDate(dateKey?: string) {
  const words = useActiveWords();
  return useMemo(
    () =>
      dateKey
        ? words.filter((word) => toDateKey(new Date(word.created_at)) === dateKey)
        : [],
    [words, dateKey]
  );
}

/** 오늘 복습할 단어 (오답 노트 단어 → 복습일이 오래된 단어 → 최근 추가한 단어 순) */
export function useDueWords(limit: number) {
  const words = useActiveWords();
  return useMemo(() => {
    const today = toDateKey();
    return words
      .filter((word) => word.meanings.length > 0 && isDue(word.review, today))
      .sort(
        (a, b) =>
          Number(b.review.inWrongNote) - Number(a.review.inWrongNote) ||
          a.review.due.localeCompare(b.review.due) ||
          b.created_at.localeCompare(a.created_at)
      )
      .slice(0, limit);
  }, [words, limit]);
}

export function useWrongNoteWords() {
  const words = useActiveWords();
  return useMemo(() => words.filter((word) => word.review.inWrongNote), [words]);
}

export function useStudyStats() {
  const progress = useLibrary((state) => state.progress);
  const wordbooks = useWordbooks();
  const words = useActiveWords();
  return useMemo(
    () => ({
      score: progress.score,
      streak: getStreak(progress.studyDates),
      studiedToday: progress.studyDates.includes(toDateKey()),
      wordCount: words.length,
      wordbookCount: wordbooks.length,
    }),
    [progress, wordbooks.length, words.length]
  );
}
