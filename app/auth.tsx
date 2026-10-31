import {
  View,
  Pressable,
  Platform,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import Logo from "@/components/auth/Logo";

import { router } from "expo-router";
import { useState } from "react";
import GoogleLogin from "@/components/auth/GoogleLoginButton";
import KakaoLoginButton from "@/components/auth/KakaoLoginButton";
import AppleLoginButton from "@/components/auth/AppleLoginButton";
import LanguageSelector from "@/components/auth/LanguageSelector";
import { AuthResponse } from "@/types/user";
import {
  AccountSwitchChoice,
  completeLogin,
  isDifferentAccount,
} from "@/lib/session";

// 로그인은 클라우드 백업·동기화를 위한 선택 사항이다 (로그인하지 않아도 앱을 쓸 수 있음)
export default function AuthPage() {
  const deviceType = Platform.OS;
  const { t } = useTranslation();
  const [syncing, setSyncing] = useState(false);

  const close = () =>
    router.canGoBack() ? router.back() : router.replace("/(mainTabs)");

  const askAccountSwitch = () =>
    new Promise<AccountSwitchChoice>((resolve) => {
      Alert.alert(t("auth.switch.title"), t("auth.switch.message"), [
        {
          text: t("auth.switch.replace"),
          style: "destructive",
          onPress: () => resolve("replace"),
        },
        { text: t("auth.switch.merge"), onPress: () => resolve("merge") },
      ]);
    });

  const handleLoggedIn = async (auth: AuthResponse) => {
    const choice = isDifferentAccount(auth) ? await askAccountSwitch() : "merge";
    setSyncing(true);
    const result = await completeLogin(auth, choice);
    setSyncing(false);
    if (!result.ok) {
      Toast.show({ type: "ToastError", text1: t("auth.syncFailed") });
    }
    close();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.topBar}>
        <Pressable onPress={close} hitSlop={12}>
          <AntDesign name="close" size={24} color="#111" />
        </Pressable>
      </SafeAreaView>
      <LanguageSelector />
      <Logo />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t("auth.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.subtitle")}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <KakaoLoginButton onLoggedIn={handleLoggedIn} />
        {deviceType === "ios" && <AppleLoginButton onLoggedIn={handleLoggedIn} />}
        {deviceType === "android" && <GoogleLogin onLoggedIn={handleLoggedIn} />}
        <Pressable onPress={close} style={styles.laterButton}>
          <Text style={styles.laterText}>{t("auth.later")}</Text>
        </Pressable>
      </View>

      {syncing && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#2988F6" />
          <Text style={styles.overlayText}>{t("auth.syncing")}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fefefe",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 24,
    paddingTop: 16,
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: "Pretendard-Bold",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 60,
    gap: 5,
    alignItems: "center",
  },
  laterButton: {
    marginTop: 8,
    padding: 8,
  },
  laterText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
    textDecorationLine: "underline",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  overlayText: {
    fontSize: 15,
    fontFamily: "Pretendard-Medium",
    color: "#111",
  },
});
