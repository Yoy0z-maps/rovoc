import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import ko from "./locales/ko.json";
import ch from "./locales/ch.json";

const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ch: { translation: ch },
};

const detectLanguage = async () => {
  const storedLanguage = await AsyncStorage.getItem("language");
  if (storedLanguage) return storedLanguage;

  return Localization.locale.split("-")[0] || "en";
};

// i18n 초기화
detectLanguage().then((language) => {
  i18next.use(initReactI18next).init({
    resources,
    lng: language, // 초기 언어
    fallbackLng: "en", // 언어 리소스 없을 경우 영어로
    interpolation: {
      escapeValue: false, // XSS 방지
    },
  });
});

export default i18next;
