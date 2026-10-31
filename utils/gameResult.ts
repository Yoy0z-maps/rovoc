export type GameAnswer = {
  wordId: string;
  text: string;
  meaning: string;
  correct: boolean;
};

export type WordResult = {
  wordId: string;
  text: string;
  meaning: string;
  correct: number;
  wrong: number;
};

/** 이번 판의 답을 단어별로 모은다 (처음 나온 순서 유지) */
export function summarizeAnswers(answers: readonly GameAnswer[]): WordResult[] {
  const results = new Map<string, WordResult>();
  for (const answer of answers) {
    const result = results.get(answer.wordId) ?? {
      wordId: answer.wordId,
      text: answer.text,
      meaning: answer.meaning,
      correct: 0,
      wrong: 0,
    };
    if (answer.correct) result.correct += 1;
    else result.wrong += 1;
    results.set(answer.wordId, result);
  }
  return [...results.values()];
}

export function countAnswers(answers: readonly GameAnswer[]) {
  const correct = answers.filter((answer) => answer.correct).length;
  return { correct, wrong: answers.length - correct };
}

/** 퀴즈·행맨 점수: 맞히면 +1, 틀리면 -10 */
export const quizScoreChange = (correct: number, wrong: number) =>
  correct - wrong * 10;
