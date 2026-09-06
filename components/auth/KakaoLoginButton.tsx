import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, Pressable, Dimensions } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { login } from "@react-native-kakao/user";
import { socialLogin } from "@/utils/user";
import { AuthProvider } from "@/types/user";

const { width } = Dimensions.get("window");

export default function KakaoLoginButton() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleKakaoLogin = async () => {
    try {
      const kakao_res = await login();
      await socialLogin(AuthProvider.KAKAO, kakao_res);
      router.replace("/(mainTabs)");
    } catch (error) {
      console.error("Kakao login failed:", error);
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
