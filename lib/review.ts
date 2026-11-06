import { AppState } from "react-native";
import * as StoreReview from "expo-store-review";
import { updateSettings, useLibrary } from "@/store/library";
import { shouldRequestReview } from "./reviewPrompt";

// 결과 화면이 먼저 보이고 나서 팝업이 뜨도록 잠깐 기다린다
const PROMPT_DELAY_MS = 1500;

// 한 번 실행하는 동안에는 한 번만 요청한다
let promptScheduled = false;

function markPrompted() {
  const { reviewPrompt } = useLibrary.getState().settings;
  updateSettings({
    reviewPrompt: {
      ...reviewPrompt,
      positiveMoments: 0,
      lastPromptAt: new Date().toISOString(),
    },
  });
}

async function requestReviewNow() {
  try {
    if (AppState.currentState !== "active") return false;
    if (!(await StoreReview.isAvailableAsync())) return false;
    await StoreReview.requestReview();
    markPrompted();
    return true;
  } catch {
    return false;
  }
}

/**
 * 게임을 좋은 결과로 끝냈을 때 부른다.
 * 기준(학습일·좋은 결과 횟수·마지막 요청 이후 기간)을 채우면 앱 평가 팝업을 띄운다.
 */
export function recordPositiveMoment() {
  const { hydrated, settings, progress } = useLibrary.getState();
  if (!hydrated) return;

  const reviewPrompt = {
    ...settings.reviewPrompt,
    positiveMoments: settings.reviewPrompt.positiveMoments + 1,
  };
  updateSettings({ reviewPrompt });

  if (
    promptScheduled ||
    !shouldRequestReview(reviewPrompt, progress.studyDates.length, new Date())
  ) {
    return;
  }
  promptScheduled = true;
  setTimeout(() => {
    void requestReviewNow().then((shown) => {
      // 앱이 백그라운드였거나 팝업을 띄울 수 없었으면 다음 기회에 다시 시도한다
      if (!shown) promptScheduled = false;
    });
  }, PROMPT_DELAY_MS);
}
