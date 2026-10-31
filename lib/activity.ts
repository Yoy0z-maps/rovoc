import { refreshStudyReminders } from "@/lib/reminder";
import { markStudied, useLibrary } from "@/store/library";

/**
 * 학습 활동(단어 추가, 복습, 게임)을 기록한다.
 * 오늘 처음 학습했으면 연속 학습일을 늘리고 오늘 알림을 내일로 미룬다.
 * 알림 권한은 이때 처음 묻는다 (앱을 처음 열자마자 묻지 않도록).
 */
export function recordStudy() {
  const firstToday = markStudied();
  const { notificationPermissionAsked } = useLibrary.getState().settings;
  if (firstToday || !notificationPermissionAsked) {
    void refreshStudyReminders({ askPermission: true });
  }
}
