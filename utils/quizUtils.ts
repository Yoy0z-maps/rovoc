import { Word } from "@/types/word";

export function getRandomItems(arr: Word[], count: number): Word[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function createQuiz(
  words: Word[],
  usedWords: Set<string> = new Set(),
  setShowResult?: (show: boolean) => void
): { question: string; options: string[]; answer: string } | null {
  // 사용되지 않은 단어들만 필터링 (문제용)
  const availableWords = words.filter(word => !usedWords.has(word.text));

  if (availableWords.length === 0) {
    if (setShowResult) setShowResult(true);
    return {
      question: "No more words available",
      options: [],
      answer: "",
    };
  }

  // 문제로 사용할 단어 선택 (사용되지 않은 단어에서)
  const target = getRandomItems(availableWords, 1)[0];

  const countMeaning = target.meanings.length;
  const correctMeaning =
    countMeaning > 1
      ? target.meanings[Math.floor(Math.random() * countMeaning)].definition
      : target.meanings[0].definition;

  // 옵션용 단어들은 전체 단어 목록에서 선택 (문제로 사용된 단어 제외)
  const optionWords = words.filter(word => word.text !== target.text);
  const selectedOptions = getRandomItems(optionWords, 3);

  const options = [
    correctMeaning,
    ...selectedOptions.map((word) => word.meanings[0].definition),
  ].sort(() => Math.random() - 0.5);

  return {
    question: target.text,
    options,
    answer: correctMeaning,
  };
}
