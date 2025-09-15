import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { deleteToken, getAccessToken, refreshToken } from "@/utils/token";
import { jwtDecode } from "jwt-decode";
import LottieView from "lottie-react-native";
import { fetchRecentWords } from "@/utils/word";
import { postUserExpoPushToken, updateUserActivity } from "@/utils/user";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

async function getPushTokenOnDevice(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("[EXPO-NOTIFICATIONS] skip: not a real device");
    return null;
  }

  const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
  return pushToken;
}

export default function Index() {
  const router = useRouter();

  const checkToken = async (token: string) => {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      try {
        const newToken = await refreshToken();
        return newToken;
      } catch (error) {
        await deleteToken();
        router.replace("/auth");
        return null;
      }
    } else {
      return token;
    }
  };

  const initialize = async () => {
    const token = await getAccessToken();
    const pushToken = await getPushTokenOnDevice();

    if (token) {
      await updateUserActivity({ token });
      await postUserExpoPushToken({
        accessToken: token,
        pushToken: pushToken || "",
      });
      const accessToken = await checkToken(token);
      if (!accessToken) return;

      await fetchRecentWords(accessToken);
      router.replace("/(mainTabs)");
    } else {
      router.replace("/auth");
    }
  };

  useEffect(() => {
    initialize();
  }, []);

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
