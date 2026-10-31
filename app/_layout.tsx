"use client";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import Toast from "react-native-toast-message";

import ToastSuccess from "@/components/toast/ToastSuccess";
import ToastError from "@/components/toast/ToastError";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppState, Platform } from "react-native";
import initI18n from "@/i18n/i18n";
import { syncIfStale } from "@/lib/sync";
import { refreshStudyReminders } from "@/lib/reminder";
import { useLibrary } from "@/store/library";

import * as Notifications from "expo-notifications";

const toastConfig = {
  ToastSuccess: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <ToastSuccess text1={text1} text2={text2} />
  ),

  ToastError: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <ToastError text1={text1} text2={text2} />
  ),
};

const key = "0eb5e8ec68637741e8154aa38486d9f9";
if (Platform.OS !== "web") {
  void initializeKakaoSDK(key).catch((error) => {
    console.error("Unable to initialize the Kakao SDK:", error);
  });
}
// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync().catch(() => undefined);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    void initI18n().catch((error) => {
      console.error("Unable to restore the saved language:", error);
    });
  }, []);

  // 앱으로 돌아올 때: 동기화가 오래됐으면 동기화하고, 날짜가 바뀌었을 수 있으니 알림을 다시 예약한다
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState !== "active" || !useLibrary.getState().hydrated) return;
      syncIfStale();
      void refreshStudyReminders();
    });
    return () => subscription.remove();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    //SourceHanSans: require("../assets/fonts/SourceHanSans.ttc"), // 中文
    "Pretendard-Black": require("../assets/fonts/Pretendard-Black.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-Light": require("../assets/fonts/Pretendard-Light.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Thin": require("../assets/fonts/Pretendard-Thin.otf"),
    PressStart2P: require("../assets/fonts/PressStart2P.ttf"),
    NeoDunggeunmo: require("../assets/fonts/neodgm.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(mainTabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="webview"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="notice" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="quiz" options={{ headerShown: false }} />
          <Stack.Screen name="hangman" options={{ headerShown: false }} />
          <Stack.Screen name="shooting" options={{ headerShown: false }} />
          <Stack.Screen name="sentence" options={{ headerShown: false }} />
          <Stack.Screen name="[bookcase]" options={{ headerShown: false }} />
          <Stack.Screen name="license" options={{ headerShown: false }} />
          <Stack.Screen name="wrong-notes" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast config={toastConfig} />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
