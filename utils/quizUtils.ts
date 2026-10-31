import { Word } from "@/types/word";
import { shuffle } from "./shuffle";

// 단어 → 뜻 고르기, 또는 뜻 → 단어 고르기
export type QuizMode = "wordToMeaning" | "meaningToWord";

export type Quiz = {
  wordId: string;
  word: string; // 출제한 단어 (발음 듣기용)
  question: string;
  options: string[];
  answer: string;
};

const getDefinitions = (word: Word) =>
  (word.meanings ?? [])
    .map((meaning) => meaning.definition?.trim())
    .filter((definition): definition is string => Boolean(definition));

const normalizeText = (text: string) => text.trim().toLowerCase();

export function isQuizPlayable(word: Word) {
  return Boolean(word.text?.trim()) && getDefinitions(word).length > 0;
}

/**
 * usedWordIds에 없는 단어로 4지선다 문제를 만든다. 더 낼 문제가 없으면 null.
 */
export function createQuiz(
  words: Word[],
  usedWordIds: ReadonlySet<string> = new Set(),
  mode: QuizMode = "wordToMeaning"
): Quiz | null {
  const playableWords = words.filter(isQuizPlayable);
  const availableWords = playableWords.filter(
    (word) => !usedWordIds.has(word.id)
  );
  if (availableWords.length === 0) return null;

  const target =
    availableWords[Math.floor(Math.random() * availableWords.length)];
  const targetDefinitions = getDefinitions(target);
  const definition =
    targetDefinitions[Math.floor(Math.random() * targetDefinitions.length)];

  if (mode === "meaningToWord") {
    // 같은 단어이거나 같은 뜻을 가진 단어는 오답 보기에서 제외한다 (정답이 두 개가 되지 않도록)
    const targetText = normalizeText(target.text);
    const distractors: string[] = [];
    for (const word of shuffle(playableWords)) {
      if (distractors.length === 3) break;
      const text = word.text.trim();
      if (
        normalizeText(text) === targetText ||
        distractors.some((option) => normalizeText(option) === normalizeText(text)) ||
        getDefinitions(word).includes(definition)
      ) {
        continue;
      }
      distractors.push(text);
    }
    const answer = target.text.trim();
    return {
      wordId: target.id,
      word: answer,
      question: definition,
      options: shuffle([answer, ...distractors]),
      answer,
    };
  }

  // 정답과 같은 뜻이나 이미 고른 뜻은 오답 보기에서 제외한다.
  // (같은 보기가 두 번 나오거나, 오답을 눌렀는데 정답으로 처리되는 문제 방지)
  const distractors: string[] = [];
  for (const word of shuffle(playableWords)) {
    if (distractors.length === 3) break;
    if (word.id === target.id) continue;
    const candidate = getDefinitions(word).find(
      (option) =>
        !targetDefinitions.includes(option) && !distractors.includes(option)
    );
    if (candidate) distractors.push(candidate);
  }

  return {
    wordId: target.id,
    word: target.text,
    question: target.text,
    options: shuffle([definition, ...distractors]),
    answer: definition,
  };
}
