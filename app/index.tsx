import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function Index() {
  const router = useRouter();

  // 로그인 페이지에서 로그인 후, 글러벌 상태 관리를 해서 인증 상태 관리하고 상태 변경에 따라 네비게이션 트리거 필요
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        router.replace("/(mainTabs)");
      } else {
        router.replace("/auth");
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
