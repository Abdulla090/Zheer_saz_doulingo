import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import { useLocaleStore } from "../stores/useLocaleStore";

import en from "./en.json";
import ku from "./ku.json";
import es from "./es.json";
import ru from "./ru.json";
import ar from "./ar.json";

export const resources = {
  en: { translation: en },
  ku: { translation: ku },
  es: { translation: es },
  ru: { translation: ru },
  ar: { translation: ar },
};

// Initialize i18next
const initI18n = () => {
  const savedLocale = useLocaleStore.getState().selectedSourceLanguage || "en";
  const appLocale = savedLocale === "ku" ? "en" : savedLocale;
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: appLocale,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

// Subscribe to store changes to update i18n language
useLocaleStore.subscribe((state, prevState) => {
  if (state.selectedSourceLanguage !== prevState?.selectedSourceLanguage) {
    const appLang = state.selectedSourceLanguage === "ku" ? "en" : state.selectedSourceLanguage;
    i18n.changeLanguage(appLang);
  }
});

export type AppLocale = string;
export type I18nKey = string;

export function translate(locale: string, key: string): string {
  return i18n.t(key, { lng: locale }) as string;
}

export default i18n;
