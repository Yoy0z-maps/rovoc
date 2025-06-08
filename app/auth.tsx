import { View, Pressable } from "react-native";

import Logo from "@/components/auth/Logo";
import { useTranslation } from "react-i18next";

import { router } from "expo-router";
import { useState } from "react";
import GoogleLogin from "@/components/auth/GoogleLoginButton";
import KakaoLoginButton from "@/components/auth/KakaoLoginButton";
import AppleLoginButton from "@/components/auth/AppleLoginButton";

export default function AuthPage() {
  // i18n
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const [count, setCount] = useState(0);
  const handleCount = () => {
    setCount(count + 1);
    if (count === 4) {
      router.push("/(mainTabs)");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Pressable onPress={handleCount}>
        <Logo />
      </Pressable>
      <View
        style={{
          marginBottom: 90,
          gap: 5,
        }}
      >
        <KakaoLoginButton />
        <AppleLoginButton />
        <GoogleLogin />
        {/* <SocialLoginButton
          onPress={() => {
            console.log("naver");
            router.push("/(mainTabs)");
          }}
          iconColor="white"
          iconName="wechat"
          iconComponent={AntDesign}
          buttonText={t("auth.wechat")}
          buttonColor="#2DB400"
          textColor="white"
        /> */}
      </View>
    </View>
  );
}
