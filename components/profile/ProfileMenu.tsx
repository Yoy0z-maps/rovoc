import { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  AppState,
  Linking,
  Switch,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileMenuTopItem from "./ProfileMenuTopItem";
import ProfileMenuBottomItem from "./ProfileMenuBottomItem";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/i18n/i18n";
import Constants from "expo-constants";
import * as StoreReview from "expo-store-review";
import Toast from "react-native-toast-message";
import { deleteAccount, logout } from "@/lib/session";
import {
  isNotificationPermissionGranted,
  setStudyReminderEnabled,
} from "@/lib/reminder";
import { useLibrary } from "@/store/library";

export default function ProfileMenu() {
  const { t, i18n } = useTranslation();
  const version = Constants.expoConfig?.version ?? "1.2.0";
  const loggedIn = useLibrary((state) => state.loggedIn);
  const reminderEnabled = useLibrary((state) => state.settings.reminderEnabled);
  const reminderHour = useLibrary((state) => state.settings.reminderHour);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const reminderOn = reminderEnabled && permissionGranted;

  // 설정 앱에서 알림 권한을 바꾸고 돌아올 수 있으므로, 화면에 올 때마다 다시 확인한다
  const checkPermission = useCallback(() => {
    void isNotificationPermissionGranted().then(setPermissionGranted);
  }, []);
  useFocusEffect(checkPermission);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkPermission();
    });
    return () => subscription.remove();
  }, [checkPermission]);

  const openWebPage = (url: string) => {
    router.push({
      pathname: "/webview",
      params: { url: encodeURIComponent(url) },
    });
  };

  const requestReview = async () => {
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
      } else {
        Alert.alert("Review unavailable", "Store review is not available on this device.");
      }
    } catch {
      Alert.alert("Review unavailable", "Please try again later.");
    }
  };

  const toggleReminder = async (enabled: boolean) => {
    const result = await setStudyReminderEnabled(enabled);
    if (result === "enabled") setPermissionGranted(true);
    if (result === "denied") {
      Alert.alert(t("profile.menu.reminder"), t("profile.reminderDenied"), [
        { text: t("profile.logoutConfirm.cancel"), style: "cancel" },
        {
          text: t("profile.openSettings"),
          onPress: () => void Linking.openSettings(),
        },
      ]);
    }
  };

  const confirmLogout = () => {
    Alert.alert(t("profile.logoutConfirm.title"), t("profile.logoutConfirm.message"), [
      { text: t("profile.logoutConfirm.cancel"), style: "cancel" },
      {
        text: t("profile.logoutConfirm.confirm"),
        style: "destructive",
        onPress: () => void logout(),
      },
    ]);
  };

  const confirmDeleteUser = () => {
    Alert.alert(t("profile.deleteConfirm.title"), t("profile.deleteConfirm.message"), [
      { text: t("profile.deleteConfirm.cancel"), style: "cancel" },
      {
        text: t("profile.deleteConfirm.confirm"),
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              await deleteAccount();
              Toast.show({ type: "ToastSuccess", text1: t("profile.deleteConfirm.done") });
            } catch (error) {
              Alert.alert(
                t("profile.deleteConfirm.failed"),
                error instanceof Error ? error.message : "Please try again."
              );
            }
          })();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        {/* 학습 알림 (로그인 없이 기기에서 예약) */}
        <View style={styles.reminderRow}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <View style={styles.reminderTextContainer}>
            <Text style={styles.reminderLabel}>{t("profile.menu.reminder")}</Text>
            <Text style={styles.reminderDescription}>
              {reminderOn
                ? t("profile.reminderOn", { hour: reminderHour })
                : t("profile.reminderOff")}
            </Text>
          </View>
          <Switch
            value={reminderOn}
            onValueChange={(value) => void toggleReminder(value)}
            trackColor={{ true: "#2988F6" }}
          />
        </View>
        <ProfileMenuTopItem
          icon={<AntDesign name="customer-service" size={24} color="black" />}
          label={t("profile.menu.terms")}
          onPress={() => openWebPage("https://yoy0z-maps.com/rovoca/terms")}
        />
        <ProfileMenuTopItem
          icon={<MaterialIcons name="policy" size={24} color="black" />}
          label={t("profile.menu.privacy")}
          onPress={() => openWebPage("https://yoy0z-maps.com/rovoca/privacy")}
        />
        <ProfileMenuTopItem
          icon={
            <MaterialCommunityIcons name="license" size={24} color="black" />
          }
          label={t("profile.menu.license")}
          onPress={() => {
            router.push("/license");
          }}
        />
        <ProfileMenuTopItem
          icon={<MaterialIcons name="coffee" size={24} color="black" />}
          label={t("profile.menu.support")}
          onPress={() => openWebPage("https://buymeacoffee.com/yoy0zmaps")}
        />
        <Image
          source={require("@/assets/images/rovoca-gray.png")}
          style={styles.rovocaImage}
        />
        <Text style={styles.versionText}>
          Rovoca V{version} © 2026. All rights reserved.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <ProfileMenuBottomItem
          icon={<MaterialIcons name="rate-review" size={24} color="black" />}
          label={t("profile.menu.review")}
          onPress={() => void requestReview()}
        />
        <ProfileMenuBottomItem
          icon={<Ionicons name="language-outline" size={24} color="black" />}
          label={t("profile.menu.language")}
          onPress={() => {
            void changeLanguage(i18n.language === "ko" ? "en" : "ko");
          }}
        />
        {loggedIn ? (
          <>
            <ProfileMenuBottomItem
              icon={<MaterialIcons name="logout" size={24} color="black" />}
              label={t("profile.menu.logout")}
              onPress={confirmLogout}
            />
            <ProfileMenuBottomItem
              icon={<AntDesign name="user-delete" size={24} color="black" />}
              label={t("profile.menu.delete")}
              onPress={confirmDeleteUser}
            />
          </>
        ) : (
          <ProfileMenuBottomItem
            icon={<MaterialIcons name="login" size={24} color="black" />}
            label={t("profile.menu.loginShort")}
            onPress={() => router.push("/auth")}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  topContainer: {
    flexDirection: "column",
    padding: 24,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  reminderTextContainer: { flex: 1, gap: 2 },
  reminderLabel: { fontSize: 18, fontFamily: "Pretendard-Regular" },
  reminderDescription: {
    fontSize: 13,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  bottomContainer: {
    alignContent: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    textAlign: "center",
    marginTop: 12,
    color: "#777",
  },
  rovocaImage: {
    marginTop: 5,
    width: 80,
    height: 80,
    alignSelf: "center",
  },
});
