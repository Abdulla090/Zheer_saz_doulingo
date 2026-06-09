import { appStorage } from "../lib/app-storage";
import { Alert, DevSettings, I18nManager } from "react-native";
import { create } from "zustand";
import type { AppLocale } from "../i18n";

const STORAGE_KEY = "phingo.app.locale";

interface LocaleState {
  locale: AppLocale;
  ready: boolean;
  setLocale: (locale: AppLocale) => void;
}

const savedLocale = (appStorage.getItemSync(STORAGE_KEY) === "ku" ? "ku" : "en") as AppLocale;

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: savedLocale,
  ready: true,
  setLocale: (locale) => {
    appStorage.setItemSync(STORAGE_KEY, locale);
    set({ locale });
    
    const isRTL = locale === "ku";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      setTimeout(() => {
        if (__DEV__ && DevSettings && DevSettings.reload) {
          DevSettings.reload();
        } else {
          Alert.alert(
            "Restart Required",
            "Please restart the app to fully apply the language layout changes."
          );
        }
      }, 150);
    }
  },
}));

