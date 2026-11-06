import { requireOptionalNativeModule } from "expo";

type RovocaWidgetModule = {
  setData(json: string): void;
};

// Expo Go·웹·테스트에는 네이티브 모듈이 없으므로 그때는 아무것도 하지 않는다
const nativeModule =
  requireOptionalNativeModule<RovocaWidgetModule>("RovocaWidget");

/** 위젯이 읽는 데이터를 저장하고 화면에 있는 위젯을 다시 그린다 */
export function setWidgetData(json: string) {
  nativeModule?.setData(json);
}
