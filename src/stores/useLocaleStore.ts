import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { AppLocale } from "@/utils/rtl";
import { syncNativeRtl, localeIsRtl } from "@/utils/rtl";

const STORAGE_KEY = "@phingo/ui_locale";

interface LocaleState {
  ready: boolean;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

function persistLocale(locale: AppLocale) {
  void AsyncStorage.setItem(STORAGE_KEY, locale).catch(() => {});
}

export const useLocaleStore = create<LocaleState>((set) => ({
  ready: false,
  locale: "ku",
  setLocale: (locale) => {
    persistLocale(locale);
    syncNativeRtl(localeIsRtl(locale));
    set({ locale });
  },
}));

async function hydrate() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const locale: AppLocale = saved === "en" ? "en" : "ku";
    syncNativeRtl(localeIsRtl(locale));
    useLocaleStore.setState({ ready: true, locale });
  } catch {
    useLocaleStore.setState({ ready: true, locale: "ku" });
  }
}

void hydrate();
