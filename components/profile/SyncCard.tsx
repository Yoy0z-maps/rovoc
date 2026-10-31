import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { syncNow } from "@/lib/sync";
import { useLibrary } from "@/store/library";

// 로그인 상태와 마지막 동기화 결과를 보여주고, 로그인 또는 지금 동기화로 이어준다
export default function SyncCard() {
  const { t, i18n } = useTranslation();
  const loggedIn = useLibrary((state) => state.loggedIn);
  const syncStatus = useLibrary((state) => state.syncStatus);
  const lastSyncedAt = useLibrary((state) => state.sync.lastSyncedAt);
  const syncing = loggedIn && syncStatus.state === "syncing";

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(i18n.language === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  let status: string;
  let isError = false;
  if (!loggedIn) {
    status = t("profile.sync.loggedOut");
  } else if (syncing) {
    status = t("profile.sync.syncing");
  } else if (syncStatus.state === "error") {
    status = t("profile.sync.error", { error: syncStatus.error });
    isError = true;
  } else if (syncStatus.failedItems > 0) {
    status = t("profile.sync.failedItems", { count: syncStatus.failedItems });
    isError = true;
  } else if (lastSyncedAt) {
    status = t("profile.sync.lastSynced", { time: formatTime(lastSyncedAt) });
  } else {
    status = t("profile.sync.never");
  }

  const handlePress = async () => {
    if (!loggedIn) {
      router.push("/auth");
      return;
    }
    const result = await syncNow();
    if (result.ok && result.failedItems === 0) {
      Toast.show({ type: "ToastSuccess", text1: t("profile.sync.done") });
    } else if (!result.ok) {
      Toast.show({
        type: "ToastError",
        text1: t("profile.sync.error", { error: result.error }),
      });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name={loggedIn ? "cloud-done-outline" : "cloud-offline-outline"}
          size={24}
          color={loggedIn ? "#2988F6" : "#767676"}
        />
        <Text style={styles.title}>{t("profile.sync.title")}</Text>
      </View>
      <Text style={[styles.status, isError && styles.errorText]}>{status}</Text>
      <Pressable
        style={[styles.button, syncing && styles.buttonDisabled]}
        disabled={syncing}
        onPress={() => void handlePress()}
      >
        {syncing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {loggedIn ? t("profile.menu.sync") : t("profile.menu.login")}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 10,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 18, fontFamily: "Pretendard-SemiBold", color: "#111" },
  status: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
    color: "#555",
  },
  errorText: { color: "#F05650" },
  button: {
    marginTop: 4,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#2988F6",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 15, fontFamily: "Pretendard-Medium", color: "#fff" },
});
