import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { t } from "i18next";
import { registerPushToken } from "@/lib/session";
import { updateSettings, useLibrary } from "@/store/library";
import { getStreak, toDateKey } from "@/utils/date";

const REMINDER_PREFIX = "rovoca-study-reminder-";
// 앱을 며칠 열지 않아도 알림이 오도록 일주일치를 미리 예약한다
const REMINDER_DAYS = 7;
const REMINDER_CHANNEL_ID = "study-reminders";

// 안드로이드 13 이상은 알림 채널이 있어야 권한 요청 창이 뜨고, 채널별로 알림을 끌 수 있다
async function ensureReminderChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: t("reminder.channel"),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function cancelStudyReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((notification) => notification.identifier.startsWith(REMINDER_PREFIX))
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
  );
}

export async function isNotificationPermissionGranted() {
  try {
    return (await Notifications.getPermissionsAsync()).status === "granted";
  } catch {
    return false;
  }
}

/**
 * 프로필에서 학습 알림을 켜고 끈다. 켤 때는 권한을 다시 묻고,
 * 설정 앱에서 거부해 둔 상태라 물을 수 없으면 "denied"를 돌려준다.
 */
export async function setStudyReminderEnabled(enabled: boolean) {
  if (!enabled) {
    updateSettings({ reminderEnabled: false });
    await refreshStudyReminders();
    return "disabled" as const;
  }

  try {
    await ensureReminderChannel();
    let { status, canAskAgain } = await Notifications.getPermissionsAsync();
    if (status !== "granted" && canAskAgain) {
      updateSettings({ notificationPermissionAsked: true });
      ({ status } = await Notifications.requestPermissionsAsync());
      if (status === "granted") void registerPushToken();
    }
    if (status !== "granted") return "denied" as const;
  } catch {
    return "denied" as const;
  }

  updateSettings({ reminderEnabled: true });
  await refreshStudyReminders();
  return "enabled" as const;
}

/**
 * "아직 오늘 복습하지 않았어요" 알림을 기기에 예약한다 (로그인 없이 동작).
 * 오늘 이미 학습했으면 내일부터 예약한다.
 */
export async function refreshStudyReminders({ askPermission = false } = {}) {
  try {
    const { settings, progress } = useLibrary.getState();
    await cancelStudyReminders();
    if (!settings.reminderEnabled) return;

    await ensureReminderChannel();
    const permission = await Notifications.getPermissionsAsync();
    if (permission.status !== "granted") {
      if (
        !askPermission ||
        settings.notificationPermissionAsked ||
        !permission.canAskAgain
      ) {
        return;
      }
      updateSettings({ notificationPermissionAsked: true });
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;
      void registerPushToken();
    }

    const today = toDateKey();
    const studiedToday = progress.studyDates.includes(today);
    const streak = getStreak(progress.studyDates, today);
    const now = new Date();
    let isFirst = true;

    for (let offset = 0; offset < REMINDER_DAYS; offset++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + offset,
        settings.reminderHour
      );
      if (date <= now || (offset === 0 && studiedToday)) continue;

      // 가장 가까운 알림에는 이어가고 있는 연속 기록을 알려준다
      const body =
        isFirst && streak > 0
          ? t("reminder.bodyStreak", { count: streak })
          : t("reminder.body");
      isFirst = false;

      await Notifications.scheduleNotificationAsync({
        identifier: `${REMINDER_PREFIX}${offset}`,
        content: { title: t("reminder.title"), body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: REMINDER_CHANNEL_ID,
        },
      });
    }
  } catch (error) {
    console.warn("Unable to schedule study reminders:", error);
  }
}
