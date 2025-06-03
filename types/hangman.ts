type GameState = {
  word: string;
  revealed: string[];
  usedLetters: string[];
  wrongCount: number;
  maxWrong: number;
  isGameOver: boolean;
  isWin: boolean | null;
};
