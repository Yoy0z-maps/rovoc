import { Word } from "@/types/word";

export function getRandomItems(arr: Word[], count: number): Word[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function createQuiz(
  words: Word[]
): { question: string; options: string[]; answer: string } | null {
  if (words.length < 4) return null;

  const selected = getRandomItems(words, 4);
  const [target, ...rest] = selected;

  const countMeaning = target.meanings.length;
  const correctMeaning =
    countMeaning > 1
      ? target.meanings[Math.floor(Math.random() * countMeaning)].definition
      : target.meanings[0].definition;

  const options = [
    correctMeaning,
    ...rest.map((word) => word.meanings[0].definition),
  ].sort(() => Math.random() - 0.5);

  return {
    question: target.text,
    options,
    answer: correctMeaning,
  };
}
