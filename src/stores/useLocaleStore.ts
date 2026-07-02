import { appStorage } from "../lib/app-storage";
import { Alert, DevSettings, I18nManager } from "react-native";
import { create } from "zustand";
import { LANGUAGES } from "../config/languages";
import * as Updates from "expo-updates";

const SOURCE_LANG_KEY = "twino.app.sourceLanguage";
const TARGET_LANG_KEY = "twino.app.targetLanguage";

interface LocaleState {
  selectedSourceLanguage: string;
  selectedTargetLanguage: string;
  locale: string;
  ready: boolean;
  setLocale: (locale: string) => void;
  setLanguagePair: (source: string, target: string) => void;
}

const defaultSource = appStorage.getItemSync(SOURCE_LANG_KEY) || "ku";
const defaultTarget = appStorage.getItemSync(TARGET_LANG_KEY) || "en";

export const useLocaleStore = create<LocaleState>((set) => ({
  selectedSourceLanguage: defaultSource,
  selectedTargetLanguage: defaultTarget,
  locale: defaultSource, // Alias for legacy code
  ready: true,
  setLocale: (locale: string) => { // Alias for legacy code
    appStorage.setItemSync(SOURCE_LANG_KEY, locale);
    set((state) => ({ 
      selectedSourceLanguage: locale, 
      locale, 
      selectedTargetLanguage: state.selectedTargetLanguage 
    }));
    // We also need to run RTL logic here to not break legacy
    const sourceLangDef = LANGUAGES[locale];
    const isRTL = sourceLangDef ? sourceLangDef.rtl : false;
    
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      setTimeout(() => {
        if (__DEV__ && DevSettings && DevSettings.reload) {
          DevSettings.reload();
        } else {
          Updates.reloadAsync().catch(() => {
            Alert.alert(
              "Restart Required",
              "Please restart the app to fully apply the language layout changes."
            );
          });
        }
      }, 150);
    }
  },
  setLanguagePair: (source, target) => {
    appStorage.setItemSync(SOURCE_LANG_KEY, source);
    appStorage.setItemSync(TARGET_LANG_KEY, target);
    set({ selectedSourceLanguage: source, selectedTargetLanguage: target });
    
    const sourceLangDef = LANGUAGES[source];
    const isRTL = sourceLangDef ? sourceLangDef.rtl : false;
    
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      setTimeout(() => {
        if (__DEV__ && DevSettings && DevSettings.reload) {
          DevSettings.reload();
        } else {
          Updates.reloadAsync().catch(() => {
            Alert.alert(
              "Restart Required",
              "Please restart the app to fully apply the language layout changes."
            );
          });
        }
      }, 150);
    }
  },
}));

