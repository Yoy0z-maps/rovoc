import React, { useCallback, useEffect } from "react";
import { Pressable, Image, Text, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { socialLogin } from "@/utils/user";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { AuthProvider } from "@/types/user";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function GoogleLogin() {
  const { t } = useTranslation();
  const router = useRouter();
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
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return;
      if (!response.data.idToken) {
        throw new Error("Google did not return an ID token.");
      }
      await socialLogin(AuthProvider.GOOGLE, {
        idToken: response.data.idToken,
      });
      router.replace("/(mainTabs)");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  }, [router]);

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
