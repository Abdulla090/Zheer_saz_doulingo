import { appStorage } from "../lib/app-storage";
import { Alert, DevSettings, I18nManager, Platform } from "react-native";
import { create } from "zustand";
import * as Updates from "expo-updates";
import { getLanguageDirection } from "../i18n/direction";

const UI_LANG_KEY = "twino.app.uiLanguage";
const SOURCE_LANG_KEY = "twino.app.sourceLanguage";
const TARGET_LANG_KEY = "twino.app.targetLanguage";

interface LocaleState {
  selectedUiLanguage: string;
  selectedSourceLanguage: string;
  selectedTargetLanguage: string;
  locale: string;
  ready: boolean;
  setUiLanguage: (languageCode: string) => void;
  setLocale: (locale: string) => void;
  setLanguagePair: (source: string, target: string) => void;
}

const defaultSource = appStorage.getItemSync(SOURCE_LANG_KEY) || "ku";
const defaultTarget = appStorage.getItemSync(TARGET_LANG_KEY) || "en";
const defaultUi = appStorage.getItemSync(UI_LANG_KEY) || defaultSource;

let rtlReloadPending = false;

/** Global mirroring belongs to app chrome only; lesson content sets its own direction. */
export function applyUiLanguageDirection(languageCode: string) {
  const shouldBeRtl = getLanguageDirection(languageCode) === "rtl";

  // Web direction is applied live by the root layout using document.dir.
  // Reloading through expo-updates here creates a loop because I18nManager's
  // native RTL flag does not persist across browser page loads.
  if (Platform.OS === "web") return;

  if (I18nManager.isRTL === shouldBeRtl || rtlReloadPending) return;

  rtlReloadPending = true;
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(shouldBeRtl);

  setTimeout(() => {
    if (__DEV__ && DevSettings?.reload) {
      DevSettings.reload();
      return;
    }
    Updates.reloadAsync().catch(() => {
      rtlReloadPending = false;
      Alert.alert(
        "Restart Required",
        "Please restart the app to fully apply the language layout changes.",
      );
    });
  }, 150);
}

export const useLocaleStore = create<LocaleState>((set) => ({
  selectedUiLanguage: defaultUi,
  selectedSourceLanguage: defaultSource,
  selectedTargetLanguage: defaultTarget,
  locale: defaultUi, // Alias for legacy UI-language code
  ready: true,
  setUiLanguage: (languageCode: string) => {
    appStorage.setItemSync(UI_LANG_KEY, languageCode);
    set({ selectedUiLanguage: languageCode, locale: languageCode });
    applyUiLanguageDirection(languageCode);
  },
  setLocale: (languageCode: string) => {
    // Legacy alias retained for callers that mean the app interface language.
    appStorage.setItemSync(UI_LANG_KEY, languageCode);
    set({ selectedUiLanguage: languageCode, locale: languageCode });
    applyUiLanguageDirection(languageCode);
  },
  setLanguagePair: (source, target) => {
    // The current product chooses its UI language alongside the learner's source
    // language, but the three values remain distinct in state and rendering APIs.
    appStorage.setItemSync(UI_LANG_KEY, source);
    appStorage.setItemSync(SOURCE_LANG_KEY, source);
    appStorage.setItemSync(TARGET_LANG_KEY, target);
    set({
      selectedUiLanguage: source,
      selectedSourceLanguage: source,
      selectedTargetLanguage: target,
      locale: source,
    });
    applyUiLanguageDirection(source);
  },
}));

