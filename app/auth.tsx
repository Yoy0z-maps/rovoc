import { View, StyleSheet } from "react-native";

// Expo Vector Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Logo from "@/components/auth/Logo";

export default function AuthPage() {
  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.socialLoginButtonContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  socialLoginButtonContainer: {
    marginBottom: 90,
    gap: 5,
  },
});
