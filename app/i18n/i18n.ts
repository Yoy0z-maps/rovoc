/* eslint-disable import/no-named-as-default-member */
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";

import en from "./locales/en.json";
import ko from "./locales/ko.json";
import ch from "./locales/ch.json";

const resources = {
  en: { translation: en },
  ko: { translation: ko },
  ch: { translation: ch },
};
const normalizeLanguage = (language?: string | null) => {
  if (language === "ko") return "ko";
  if (language === "zh" || language === "ch") return "ch";
  return "en";
};

const deviceLanguage = normalizeLanguage(
  Localization.getLocales()?.[0]?.languageCode
);

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: deviceLanguage,
  fallbackLng: "en",
  initImmediate: false,
  interpolation: {
    escapeValue: false,
  },
});

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem("i18next");
  const language = normalizeLanguage(savedLanguage ?? deviceLanguage);
  if (language !== i18n.language) {
    await i18n.changeLanguage(language);
  }
};

// 언어 변경 함수 추가
export const changeLanguage = async (language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  await AsyncStorage.setItem("i18next", normalizedLanguage);
  await i18n.changeLanguage(normalizedLanguage);
};

export default initI18n;
