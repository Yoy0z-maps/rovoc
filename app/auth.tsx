import { View, StyleSheet, Dimensions } from "react-native";

// Expo Vector Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import Logo from "@/components/auth/Logo";
import { useTranslation } from "react-i18next";
import * as SecureStore from "expo-secure-store";

import * as AppleAuthentication from "expo-apple-authentication";
import { login } from "@react-native-kakao/user";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";

const { width } = Dimensions.get("window");

export default function AuthPage() {
  // i18n
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleKakaoLogin = async () => {
    try {
      const kakao_res = await login();
      console.log(kakao_res);
      const rovoca_res = await fetch(API_SERVER_ADDRESS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "kakao",
          result: kakao_res,
        }),
      });
      console.log(rovoca_res);
      const user_json = await rovoca_res.json();
      await SecureStore.setItemAsync("user", JSON.stringify(user_json));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(credential);
      const rovoca_res = await fetch(API_SERVER_ADDRESS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "apple",
          result: credential,
        }),
      });
      console.log(rovoca_res);
      const user_json = await rovoca_res.json();
      await SecureStore.setItemAsync("user", JSON.stringify(user_json));
      // signed in
    } catch (error) {
      if (
        error instanceof Error &&
        (error as any).code === "ERR_REQUEST_CANCELED"
      ) {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.socialLoginButtonContainer}>
        <SocialLoginButton
          onPress={handleKakaoLogin}
          iconColor="#111111"
          iconName="chat"
          iconComponent={MaterialCommunityIcons}
          buttonText={t("auth.kakaotalk")}
          buttonColor="#FEE500"
          textColor="#111111"
        />
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ width: width - 100, height: 50 }}
          onPress={handleAppleLogin}
        />
        <SocialLoginButton
          onPress={() => {
            console.log("naver");
          }}
          iconColor="white"
          iconName="wechat"
          iconComponent={AntDesign}
          buttonText={t("auth.wechat")}
          buttonColor="#2DB400"
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
