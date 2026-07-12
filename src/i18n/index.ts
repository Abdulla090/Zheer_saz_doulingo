/* eslint-disable import/no-named-as-default-member */
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
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
  const savedLocale = useLocaleStore.getState().selectedUiLanguage || "en";
  const appLocale = savedLocale;
  
  i18next
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
  if (state.selectedUiLanguage !== prevState?.selectedUiLanguage) {
    const appLang = state.selectedUiLanguage;
    i18next.changeLanguage(appLang);
  }
});

export type AppLocale = string;
export type I18nKey = string;

export function translate(locale: string, key: string): string {
  return i18next.t(key, { lng: locale }) as string;
}

export default i18next;
