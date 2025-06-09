import React, { useState, useEffect } from "react";
import { Pressable, Image, Text, StyleSheet, Dimensions } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useTranslation } from "react-i18next";
import { setUser } from "@/utils/user";

const { width } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID,
    redirectUri: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo);
    }
  }, [userInfo]);

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
    <Pressable
      style={styles.container}
      onPress={() => promptAsync()}
      disabled={!request}
    >
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
