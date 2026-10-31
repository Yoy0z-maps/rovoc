import * as Haptics from "expo-haptics";

// 햅틱을 지원하지 않는 기기에서는 조용히 무시한다
const ignore = () => undefined;

export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(ignore);
};

export const hapticWarning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(ignore);
};

export const hapticError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(ignore);
};

export const hapticTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(ignore);
};
