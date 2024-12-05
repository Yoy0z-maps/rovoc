import { Text, View, StyleSheet } from "react-native";

// Expo Vector Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SocialLoginButton from "@/components/auth/SocialLoginButton";

export default function AuthPage() {
  return (
    <View style={styles.container}>
      <Text>Auth Page</Text>
      <SocialLoginButton
        iconColor="#111111"
        iconName="chat"
        iconComponent={MaterialCommunityIcons}
        buttonText="Login with Kakao"
        buttonColor="#FEE500"
        textColor="#111111"
      />
      <SocialLoginButton
        iconColor="white"
        iconName="apple1"
        iconComponent={AntDesign}
        buttonText="Login with Apple"
        buttonColor="#111111"
        textColor="white"
      />
      <SocialLoginButton
        iconColor="white"
        iconName="wechat"
        iconComponent={AntDesign}
        buttonText="Login with WeChat"
        buttonColor="#09B83E"
        textColor="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonFont: {
    fontFamily: "Pretendard-Regular",
    fontSize: 18,
  },
  kakaoButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    gap: 15,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#FEE500",
  },
  appleButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    gap: 15,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#111111",
  },
  wechatButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    gap: 15,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#09B83E",
  },
});
