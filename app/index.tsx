import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { getAccessToken, refreshToken } from "@/utils/token";
import { jwtDecode } from "jwt-decode";

export default function Index() {
  const router = useRouter();

  const checkToken = async (token: string) => {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      console.log("Token expired");
      await refreshToken();
      console.log("Token refreshed");
      return;
    } else {
      console.log("Token valid");
      return;
    }
  };

  const checkLogin = async () => {
    const token = await getAccessToken();
    if (token) {
      await checkToken(token);
      router.replace("/(mainTabs)");
    } else {
      router.replace("/auth");
    }
  };

  // 로그인 페이지에서 로그인 후, 글러벌 상태 관리를 해서 인증 상태 관리하고 상태 변경에 따라 네비게이션 트리거 필요
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#2988F6" />
    </View>
  );
}
