import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, Pressable, Dimensions } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { login } from "@react-native-kakao/user";
import { setUser } from "@/utils/user";

const { width } = Dimensions.get("window");

export default function KakaoLoginButton() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleKakaoLogin = async () => {
    try {
      const kakao_res = await login();
      console.log(kakao_res);
      const rovoca_res = await fetch(
        `${API_SERVER_ADDRESS}/users/auth/social-login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: "kakao",
            result: kakao_res,
          }),
        }
      );
      console.log(rovoca_res);
      const user_json = await rovoca_res.json();
      await setUser(user_json);
      router.push("/(mainTabs)");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={handleKakaoLogin}
      style={[styles.button, { backgroundColor: "#FEE500" }]}
    >
      <MaterialCommunityIcons
        name="chat"
        size={18}
        color="#111111"
        style={styles.icon}
      />
      <Text style={[styles.buttonText, { color: "#111111" }]}>
        {t("auth.kakaotalk")}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width - 100,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 6,
    position: "relative",
  },
  buttonText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 18,
    textAlign: "center",
  },
  icon: {
    marginRight: 5,
  },
});
