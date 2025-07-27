import { View, StyleSheet, Text, Dimensions, Image } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileMenuTopItem from "./ProfileMenuTopItem";
import ProfileMenuBottomItem from "./ProfileMenuBottomItem";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { deleteUser } from "@/utils/user";
import { deleteToken, getAccessToken } from "@/utils/token";
import { changeLanguage } from "i18next";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ProfileMenu() {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <ProfileMenuTopItem
          icon={<AntDesign name="customerservice" size={24} color="black" />}
          label={t("profile.menu.terms")}
          onPress={() => {}}
        />
        <ProfileMenuTopItem
          icon={<MaterialIcons name="policy" size={24} color="black" />}
          label={t("profile.menu.privacy")}
          onPress={() => {
            router.push({
              pathname: "/webview",
              params: {
                url: encodeURIComponent(
                  "https://yoy0z-maps.com/rovoca/privacy"
                ),
                title: "Privacy Policy",
              },
            });
          }}
        />
        <ProfileMenuTopItem
          icon={
            <MaterialCommunityIcons name="license" size={24} color="black" />
          }
          label={t("profile.menu.license")}
          onPress={() => {
            router.push("/license");
          }}
        />
        <ProfileMenuTopItem
          icon={<MaterialIcons name="coffee" size={24} color="black" />}
          label={t("profile.menu.support")}
          onPress={() => {
            router.push({
              pathname: "/webview",
              params: {
                url: encodeURIComponent("https://buymeacoffee.com/yoy0zmaps"),
                title: "Donate",
              },
            });
          }}
        />
        <Image
          source={require("@/assets/images/rovoca-gray.png")}
          style={styles.rovocaImage}
        />
        <Text style={styles.versionText}>
          Rovoca V1.0.0@ Copyright 2025. All rights reserved.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <ProfileMenuBottomItem
          icon={<MaterialIcons name="rate-review" size={24} color="black" />}
          label={t("profile.menu.review")}
          onPress={() => {}}
        />
        <ProfileMenuBottomItem
          icon={<Ionicons name="language-outline" size={24} color="black" />}
          label={t("profile.menu.language")}
          onPress={() => {
            changeLanguage(i18n.language === "ko" ? "en" : "ko");
          }}
        />
        <ProfileMenuBottomItem
          icon={<MaterialIcons name="logout" size={24} color="black" />}
          label={t("profile.menu.logout")}
          onPress={async () => {
            await deleteToken();
            router.replace("/auth");
          }}
        />
        <ProfileMenuBottomItem
          icon={<AntDesign name="deleteuser" size={24} color="black" />}
          label={t("profile.menu.delete")}
          onPress={async () => {
            const token = await getAccessToken();
            if (token) {
              await deleteUser(token);
              router.replace("/auth");
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    left: 24,
    position: "absolute",
    width: screenWidth - 48,
    bottom: 40,
  },
  topContainer: {
    flexDirection: "column",
    padding: 24,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: screenHeight * 0.45,
  },
  bottomContainer: {
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    height: screenHeight * 0.1,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    textAlign: "center",
    marginTop: "auto",
    color: "#777",
  },
  rovocaImage: {
    marginTop: 15,
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});
