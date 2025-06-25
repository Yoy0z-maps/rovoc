import { Pressable } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  // i18n
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    if (language === "ko") {
      i18n.changeLanguage("ko");
    } else {
      i18n.changeLanguage("en");
    }
  };

  return (
    <Pressable
      style={{ position: "absolute", top: 60, right: 40 }}
      onPress={() => changeLanguage(i18n.language === "ko" ? "en" : "ko")}
    >
      <Ionicons name="language-outline" size={30} color="black" />
    </Pressable>
  );
}
