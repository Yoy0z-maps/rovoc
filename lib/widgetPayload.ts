import type { LocalWord, LocalWordbook } from "@/store/types";

/**
 * 홈·잠금화면 위젯이 읽는 데이터.
 * 어떤 단어를 보여줄지는 위젯마다 설정(단어장)이 다르므로 위젯 쪽에서 고른다.
 */
export type WidgetWord = {
  id: string;
  text: string;
  part: string;
  meaning: string;
  example: string;
  wordbookId: string;
  wrong: boolean; // 오답 노트에 있는 단어
};

export type WidgetWordbook = {
  id: string;
  name: string;
};

export type WidgetPayload = {
  version: 1;
  wordbooks: WidgetWordbook[];
  words: WidgetWord[];
};

// 위젯은 메모리 제한이 작아서 저장하는 단어 수와 글자 수를 제한한다
export const MAX_WIDGET_WORDS = 3000;
const MAX_TEXT_LENGTH = 200;

const clip = (text: string | undefined) => {
  const trimmed = (text ?? "").trim();
  return trimmed.length > MAX_TEXT_LENGTH
    ? `${trimmed.slice(0, MAX_TEXT_LENGTH - 1)}…`
    : trimmed;
};

export function buildWidgetPayload(
  wordbooks: Record<string, LocalWordbook>,
  words: Record<string, LocalWord>
): WidgetPayload {
  const activeBooks = Object.values(wordbooks)
    .filter((book) => !book.deleted)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const bookIds = new Set(activeBooks.map((book) => book.id));

  // 개수 제한에 걸려도 오답 노트 단어는 빠지지 않도록 먼저 넣고, 나머지는 최근 단어부터 넣는다
  const activeWords = Object.values(words)
    .filter((word) => !word.deleted && bookIds.has(word.wordbookId))
    .sort(
      (a, b) =>
        Number(b.review.inWrongNote) - Number(a.review.inWrongNote) ||
        b.created_at.localeCompare(a.created_at)
    )
    .slice(0, MAX_WIDGET_WORDS);

  return {
    version: 1,
    wordbooks: activeBooks.map((book) => ({ id: book.id, name: book.name })),
    words: activeWords.map((word) => {
      const meaning = word.meanings[0];
      return {
        id: word.id,
        text: clip(word.text),
        part: clip(meaning?.part),
        meaning: clip(meaning?.definition),
        example: clip(meaning?.example),
        wordbookId: word.wordbookId,
        wrong: word.review.inWrongNote,
      };
    }),
  };
}
