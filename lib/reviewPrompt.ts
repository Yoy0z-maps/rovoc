import type { ReviewPromptState } from "@/store/types";

/**
 * 앱 평가 팝업을 띄우는 기준.
 * 앱을 며칠 써 보고 게임에서 좋은 결과를 몇 번 낸 사용자에게만, 기분 좋은 순간에 가끔 묻는다.
 * (iOS는 1년에 최대 3번만 실제로 보여주므로 간격을 넉넉하게 둔다)
 */
export const REVIEW_PROMPT_RULES = {
  minStudyDays: 3, // 서로 다른 날 3일 이상 학습
  minPositiveMoments: 3, // 마지막 요청 이후 좋은 결과로 끝낸 게임 3판 이상
  cooldownDays: 120, // 마지막 요청(또는 직접 리뷰 페이지 열기) 후 120일 동안은 묻지 않음
  minAnswers: 5, // 좋은 결과로 치려면 5문제 이상 풀어야 함
  minAccuracy: 0.8, // 정답률 80% 이상
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** 이번 판이 평가를 부탁하기 좋은 결과인지 */
export function isPositiveGameResult(correct: number, total: number) {
  return (
    total >= REVIEW_PROMPT_RULES.minAnswers &&
    correct / total >= REVIEW_PROMPT_RULES.minAccuracy
  );
}

export function shouldRequestReview(
  state: ReviewPromptState,
  studyDays: number,
  now: Date
) {
  if (studyDays < REVIEW_PROMPT_RULES.minStudyDays) return false;
  if (state.positiveMoments < REVIEW_PROMPT_RULES.minPositiveMoments) return false;
  if (!state.lastPromptAt) return true;

  const last = Date.parse(state.lastPromptAt);
  if (Number.isNaN(last)) return true;
  return now.getTime() - last >= REVIEW_PROMPT_RULES.cooldownDays * DAY_MS;
}
