import { AppState } from "react-native";
import { setWidgetData } from "@/modules/rovoca-widget";
import { useLibrary } from "@/store/library";
import { buildWidgetPayload } from "./widgetPayload";

// 게임 중에는 답할 때마다 오답 노트가 바뀌므로 잠시 모았다가 한 번에 저장한다
const WIDGET_SYNC_DELAY_MS = 2000;

let started = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let lastJson: string | null = null;

function pushWidgetData() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  const { wordbooks, words } = useLibrary.getState();
  const json = JSON.stringify(buildWidgetPayload(wordbooks, words));
  if (json === lastJson) return;
  try {
    setWidgetData(json);
    lastJson = json;
  } catch (error) {
    console.error("Unable to update widget data:", error);
  }
}

function scheduleWidgetData() {
  if (!timer) timer = setTimeout(pushWidgetData, WIDGET_SYNC_DELAY_MS);
}

/** 단어·단어장이 바뀔 때마다 위젯이 읽는 데이터를 새로 저장한다 */
export function startWidgetSync() {
  if (started) return;
  started = true;

  useLibrary.subscribe((state, prev) => {
    if (!state.hydrated) return;
    if (!prev.hydrated || state.words !== prev.words || state.wordbooks !== prev.wordbooks) {
      scheduleWidgetData();
    }
  });

  // 앱을 내리면 타이머가 멈출 수 있으므로 남은 변경을 바로 저장한다
  AppState.addEventListener("change", (appState) => {
    if (appState !== "active" && timer) pushWidgetData();
  });

  if (useLibrary.getState().hydrated) pushWidgetData();
}
