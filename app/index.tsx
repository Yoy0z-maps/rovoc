import { useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { deleteToken, getAccessToken, refreshToken } from "@/utils/token";
import { jwtDecode } from "jwt-decode";
import LottieView from "lottie-react-native";
import { fetchRecentWords } from "@/utils/word";
import {
  getUserData,
  postUserExpoPushToken,
  updateUserActivity,
} from "@/utils/user";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

async function getPushTokenOnDevice(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("[EXPO-NOTIFICATIONS] skip: not a real device");
    return null;
  }

  try {
    return (await Notifications.getExpoPushTokenAsync()).data;
  } catch (error) {
    console.warn("Unable to get an Expo push token:", error);
    return null;
  }
}

async function getValidatedAccessToken(token: string): Promise<string | null> {
  let candidate = token;
  let shouldRefresh = false;

  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    shouldRefresh = !decoded.exp || decoded.exp <= Date.now() / 1000 + 30;
  } catch {
    shouldRefresh = true;
  }

  try {
    if (shouldRefresh) {
      candidate = await refreshToken();
    }
    await getUserData({ token: candidate });
    return candidate;
  } catch {
    if (!shouldRefresh) {
      try {
        candidate = await refreshToken();
        await getUserData({ token: candidate });
        return candidate;
      } catch {
        // The stored AWS session cannot be used with the new GCP signing key.
      }
    }

    await deleteToken();
    return null;
  }
}

export default function Index() {
  const router = useRouter();

  const initialize = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      router.replace("/auth");
      return;
    }

    const accessToken = await getValidatedAccessToken(token);
    if (!accessToken) {
      router.replace("/auth");
      return;
    }

    const pushToken = await getPushTokenOnDevice();
    const startupTasks: Promise<unknown>[] = [
      updateUserActivity({ token: accessToken }),
      fetchRecentWords(accessToken),
    ];
    if (pushToken) {
      startupTasks.push(postUserExpoPushToken({ accessToken, pushToken }));
    }
    await Promise.allSettled(startupTasks);
    router.replace("/(mainTabs)");
  }, [router]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <LottieView
        source={require("@/assets/lottie/Loading.json")}
        autoPlay
        loop
        style={{ width: 220, height: 200 }}
      />
    </View>
  );
}
