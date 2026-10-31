import type { Word } from "@/types/word";
import { isHangmanPlayable } from "./hangmanUtils";
import { isQuizPlayable } from "./quizUtils";
import { isShootingPlayable } from "./shootingUtils";

export type GameId = "hangman" | "quiz" | "shooting";

// 게임에 낼 단어 범위: 전체, 오답 노트, 즐겨찾기 단어, 특정 단어장
export type GameSource = "all" | "wrong" | "important" | `book:${string}`;

type GameWord = Word & {
  wordbookId: string;
  review: { inWrongNote: boolean };
};

// 게임을 시작하려면 필요한 최소 단어 수 (퀴즈는 보기 4개를 만들어야 함)
export const MIN_GAME_WORDS: Record<GameId, number> = {
  hangman: 1,
  quiz: 4,
  shooting: 1,
};

const PLAYABLE: Record<GameId, (word: Word) => boolean> = {
  hangman: (word) => isHangmanPlayable(word.text),
  quiz: isQuizPlayable,
  shooting: isShootingPlayable,
};

export const bookSource = (wordbookId: string): GameSource => `book:${wordbookId}`;

export function parseGameSource(value: unknown): GameSource {
  if (value === "wrong" || value === "important") return value;
  if (typeof value === "string" && value.startsWith("book:") && value.length > 5) {
    return value as GameSource;
  }
  return "all";
}

export function selectGameWords<T extends GameWord>(
  words: readonly T[],
  game: GameId,
  source: GameSource
): T[] {
  const inSource = (word: T) => {
    if (source === "all") return true;
    if (source === "wrong") return word.review.inWrongNote;
    if (source === "important") return word.is_important;
    return word.wordbookId === source.slice("book:".length);
  };
  return words.filter((word) => inSource(word) && PLAYABLE[game](word));
}
