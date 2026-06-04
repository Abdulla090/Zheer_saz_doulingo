import { appStorage } from "@/lib/app-storage";
import { create } from "zustand";
import type { AppLocale } from "@/i18n";

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
    void appStorage.setItem(STORAGE_KEY, locale);
    set({ locale });
  },
}));

async function hydrateLocale() {
  try {
    const saved = await appStorage.getItem(STORAGE_KEY);
    const locale: AppLocale = saved === "ku" ? "ku" : "en";
    useLocaleStore.setState({ locale, ready: true });
  } catch {
    useLocaleStore.setState({ ready: true });
  }
}

void hydrateLocale();
