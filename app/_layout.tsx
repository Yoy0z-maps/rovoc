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

getKeyHashAndroid().then(console.log);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
initializeKakaoSDK(process.env.NATIVE_APP_KEY || "");

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
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="notice" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="[game]" />
        <Stack.Screen name="[bookcase]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
