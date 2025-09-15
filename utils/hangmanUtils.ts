import { Word } from "@/types/word";

// 타입 가정: Voca = { id: string; name: string; meaning: ... }

let shuffledWords: Word[] = [];
let currentIndex = 0;

export function initGame(words: Word[]) {
  shuffledWords = shuffleArray(words);
  currentIndex = 0;
  return shuffleArray;
}

function shuffleArray<T>(arr: T[]): T[] {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
