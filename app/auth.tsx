import { View, Pressable, Platform } from "react-native";

import Logo from "@/components/auth/Logo";

import { router } from "expo-router";
import { useState } from "react";
import GoogleLogin from "@/components/auth/GoogleLoginButton";
import KakaoLoginButton from "@/components/auth/KakaoLoginButton";
import AppleLoginButton from "@/components/auth/AppleLoginButton";
import NaverLoginButton from "@/components/auth/NaverLoginButton";
import LanguageSelector from "@/components/auth/LanguageSelector";

export default function AuthPage() {
  const deviceType = Platform.OS;
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
        backgroundColor: "#fefefe",
      }}
    >
      <LanguageSelector />
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
        {deviceType === "ios" && <AppleLoginButton />}
        {deviceType === "android" && <GoogleLogin />}
        {/* <NaverLoginButton /> */}
      </View>
    </View>
  );
}
