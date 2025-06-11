"use client";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";

import { getKeyHashAndroid } from "@react-native-kakao/core";

import { jwtDecode } from "jwt-decode";
import { getAccessToken, refreshToken } from "@/utils/token";
import ToastSuccess from "@/components/toast/ToastSuccess";
import ToastError from "@/components/toast/ToastError";

const toastConfig = {
  ToastSuccess: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <ToastSuccess text1={text1} text2={text2} />
  ),

  ToastError: ({ text1, text2 }: { text1?: string; text2?: string }) => (
    <ToastError text1={text1} text2={text2} />
  ),
};

const key = "0eb5e8ec68637741e8154aa38486d9f9";
console.log("init");
console.log(key);
initializeKakaoSDK(key || "");
getKeyHashAndroid().then(console.log);
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    //SourceHanSans: require("../assets/fonts/SourceHanSans.ttc"), // 中文
    "Pretendard-Black": require("../assets/fonts/Pretendard-Black.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    "Pretendard-Light": require("../assets/fonts/Pretendard-Light.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Thin": require("../assets/fonts/Pretendard-Thin.otf"),
    PressStart2P: require("../assets/fonts/PressStart2P.ttf"),
  });

  // 토큰 유효성 검사
  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();
      if (!token) {
        return;
      }
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.log("Token expired");
        refreshToken();
        console.log("Token refreshed");
        return;
      } else {
        console.log("Token valid");
        return;
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(mainTabs)" options={{ headerShown: false }} />
        <Stack.Screen name="webview" />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="notice" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen name="hangman" options={{ headerShown: false }} />
        <Stack.Screen name="sentence" options={{ headerShown: false }} />
        <Stack.Screen name="[bookcase]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast config={toastConfig} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
