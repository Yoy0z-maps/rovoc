import React, { useState, useCallback, useEffect } from "react";
import { Pressable, Image, Text, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { setUser } from "@/utils/user";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const { width } = Dimensions.get("window");

export default function GoogleLogin() {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "323791863136-r56tlsb1k9eunero324c8klpuq4asbc3.apps.googleusercontent.com",
      scopes: ["email", "profile"],
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    console.log("handleGoogleLogin");
    try {
      // Google Play Services 확인 (Android)
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      console.log("Google Sign In error:", error);
    }
  }, []);

  async function fetchUserInfo(token: string) {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setUserInfo(user);
      await setUser(user);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }

  return (
    <Pressable style={styles.container} onPress={handleGoogleLogin}>
      <Image
        source={require("@/assets/images/google.png")}
        style={styles.image}
      />
      <Text style={styles.text}>{t("auth.google")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 100,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 6,
    position: "relative",
    backgroundColor: "#e6e6e6",
  },
  image: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
    color: "#000",
  },
});
