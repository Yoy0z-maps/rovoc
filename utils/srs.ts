import { addDays, toDateKey } from "./date";

export type ReviewState = {
  due: string; // 다음 복습일 (YYYY-MM-DD)
  interval: number; // 복습 간격(일)
  ease: number;
  reps: number; // 복습 간격을 늘린 횟수 (틀리면 0)
  correctStreak: number; // 연속으로 맞힌 횟수 (오답 노트에서 빼는 기준)
  lapses: number;
  correct: number;
  wrong: number;
  inWrongNote: boolean;
  lastReviewedAt: string | null;
};

// 오답 노트에 들어간 단어는 연속으로 이만큼 맞히면 빠진다
export const WRONG_NOTE_CLEAR_STREAK = 2;

export function createReviewState(today = toDateKey()): ReviewState {
  return {
    due: today,
    interval: 0,
    ease: 2.5,
    reps: 0,
    correctStreak: 0,
    lapses: 0,
    correct: 0,
    wrong: 0,
    inWrongNote: false,
    lastReviewedAt: null,
  };
}

/**
 * 간단한 SM-2 방식 간격 반복.
 * 맞히면 복습 간격을 1일 → 3일 → 이전 간격 × ease로 늘리고,
 * 틀리면 오늘 다시 복습하도록 되돌리고 오답 노트에 넣는다.
 */
export function applyReview(
  state: ReviewState,
  correct: boolean,
  today = toDateKey()
): ReviewState {
  if (!correct) {
    return {
      ...state,
      due: today,
      interval: 0,
      ease: Math.max(1.3, state.ease - 0.2),
      reps: 0,
      correctStreak: 0,
      lapses: state.lapses + 1,
      wrong: state.wrong + 1,
      inWrongNote: true,
      lastReviewedAt: today,
    };
  }

  const correctStreak = state.correctStreak + 1;
  const answered: ReviewState = {
    ...state,
    correct: state.correct + 1,
    correctStreak,
    inWrongNote: state.inWrongNote && correctStreak < WRONG_NOTE_CLEAR_STREAK,
    lastReviewedAt: today,
  };

  // 같은 날 게임에서 여러 번 맞혀도 복습 간격은 하루에 한 번만 늘린다
  if (state.lastReviewedAt === today && state.reps > 0) return answered;

  const reps = state.reps + 1;
  const interval =
    reps === 1 ? 1 : reps === 2 ? 3 : Math.round(state.interval * state.ease);
  return {
    ...answered,
    reps,
    interval,
    ease: Math.min(3, state.ease + 0.05),
    due: addDays(today, interval),
  };
}

export const isDue = (state: ReviewState, today = toDateKey()) =>
  state.due <= today;
