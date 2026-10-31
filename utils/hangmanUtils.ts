export const MAX_WRONG_GUESSES = 6;

// 키보드로 맞힐 수 있는 글자(A-Z)만 가리고, 공백·하이픈 등은 처음부터 보여준다.
const isGuessable = (character: string) => /[A-Z]/.test(character);

export function isHangmanPlayable(text?: string | null) {
  return /[a-z]/i.test(text ?? "");
}

export function maskWord(word: string, guessedLetters: readonly string[]) {
  return Array.from(word, (character) =>
    isGuessable(character) && !guessedLetters.includes(character)
      ? "_"
      : character
  );
}

export function isWordSolved(word: string, guessedLetters: readonly string[]) {
  return Array.from(word).every(
    (character) => !isGuessable(character) || guessedLetters.includes(character)
  );
}
