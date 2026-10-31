import { requireOptionalNativeModule } from "expo";

type SpeechModule = typeof import("expo-speech");

let speech: SpeechModule | null | undefined;

// 음성 모듈이 들어 있지 않은 이전 빌드에서도 앱이 멈추지 않도록, 네이티브 모듈이 있을 때만 불러온다
function getSpeech() {
  if (speech === undefined) {
    speech = requireOptionalNativeModule("ExpoSpeech")
      ? // eslint-disable-next-line @typescript-eslint/no-require-imports
        (require("expo-speech") as SpeechModule)
      : null;
  }
  return speech;
}

export const isSpeechAvailable = () => getSpeech() !== null;

/** 영어 단어를 기기 음성으로 읽어준다 */
export function speakWord(text: string) {
  const module = getSpeech();
  if (!module || !text.trim()) return;
  void module.stop();
  module.speak(text, { language: "en-US", rate: 0.9 });
}
