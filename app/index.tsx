import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { getAccessToken, refreshToken } from "@/utils/token";
import { jwtDecode } from "jwt-decode";
import LottieView from "lottie-react-native";
import { fetchRecentWords } from "@/utils/word";
import { updateUserActivity } from "@/utils/user";

export default function Index() {
  const router = useRouter();

  const checkToken = async (token: string) => {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      console.log("Token expired");
      const newToken = await refreshToken();
      console.log("Token refreshed");
      return newToken;
    } else {
      console.log("Token valid");
      return token;
    }
  };

  const initialize = async () => {
    const token = await getAccessToken();
    if (token) {
      await updateUserActivity({ token });
      const accessToken = await checkToken(token);
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
