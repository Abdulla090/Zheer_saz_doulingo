import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { AppLocale } from "@/i18n";
import { Platform } from "react-native";

const STORAGE_KEY = "phingo.app.locale";

interface LocaleState {
  locale: AppLocale;
  ready: boolean;
  setLocale: (locale: AppLocale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: "en",
  ready: false,
  setLocale: (locale) => {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, locale);
    } else {
      void AsyncStorage.setItem(STORAGE_KEY, locale);
    }
    set({ locale });
  },
}));

async function hydrateLocale() {
  try {
    let saved: string | null = null;
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      saved = localStorage.getItem(STORAGE_KEY);
    } else {
      saved = await AsyncStorage.getItem(STORAGE_KEY);
    }
    const locale: AppLocale = saved === "ku" ? "ku" : "en";
    useLocaleStore.setState({ locale, ready: true });
  } catch {
    useLocaleStore.setState({ ready: true });
  }
}

void hydrateLocale();
