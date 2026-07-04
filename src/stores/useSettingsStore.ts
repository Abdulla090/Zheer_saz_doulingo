import { appStorage } from "../lib/app-storage";
import { create } from "zustand";

const STORAGE_KEY = "twino.app.settings";

export type PathMode = "street" | "normal" | "kids" | "custom";
export type AppTheme = "light" | "dark" | "system";

interface SettingsState {
  ready: boolean;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  pathMode: PathMode;
  theme: AppTheme;
  nativeLang: string;
  targetLang: string;
  userName: string;
  userAge: string;
  englishLevel: number;
  setHapticsEnabled: (v: boolean) => void;
  setSoundsEnabled: (v: boolean) => void;
  setPathMode: (mode: PathMode) => void;
  setTheme: (theme: AppTheme) => void;
  setNativeLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setUserName: (name: string) => void;
  setUserAge: (age: string) => void;
  setEnglishLevel: (level: number) => void;
}

function persist(partial: Partial<SettingsState>) {
  try {
    const raw = appStorage.getItemSync(STORAGE_KEY);
    const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    appStorage.setItemSync(
      STORAGE_KEY,
      JSON.stringify({ ...prev, ...partial }),
    );
  } catch {
    /* noop */
  }
}

const savedSettingsRaw = appStorage.getItemSync(STORAGE_KEY);
const initialSettings = (() => {
  if (!savedSettingsRaw) {
    return {
      hapticsEnabled: true,
      soundsEnabled: true,
      pathMode: "normal" as PathMode,
      theme: "light" as AppTheme,
      nativeLang: "ku",
      targetLang: "en",
      userName: "",
      userAge: "",
      englishLevel: 5,
    };
  }
  try {
    const parsed = JSON.parse(savedSettingsRaw) as Partial<SettingsState>;
    const savedMode: PathMode =
      parsed.pathMode === "street" || parsed.pathMode === "kids"
        ? parsed.pathMode
        : "normal";
    return {
      hapticsEnabled: parsed.hapticsEnabled !== false,
      soundsEnabled: parsed.soundsEnabled !== false,
      pathMode: savedMode,
      theme: (parsed.theme === "dark" || parsed.theme === "system" ? parsed.theme : "light") as AppTheme,
      nativeLang: typeof parsed.nativeLang === "string" ? parsed.nativeLang : "ku",
      targetLang: typeof parsed.targetLang === "string" ? parsed.targetLang : "en",
      userName: typeof parsed.userName === "string" ? parsed.userName : "",
      userAge: typeof parsed.userAge === "string" ? parsed.userAge : "",
      englishLevel: typeof parsed.englishLevel === "number" ? parsed.englishLevel : 5,
    };
  } catch {
    return {
      hapticsEnabled: true,
      soundsEnabled: true,
      pathMode: "normal" as PathMode,
      theme: "light" as AppTheme,
      nativeLang: "ku",
      targetLang: "en",
      userName: "",
      userAge: "",
      englishLevel: 5,
    };
  }
})();

export const useSettingsStore = create<SettingsState>((set) => ({
  ...initialSettings,
  ready: true,

  setHapticsEnabled: (hapticsEnabled) => {
    set({ hapticsEnabled });
    persist({ hapticsEnabled });
  },

  setSoundsEnabled: (soundsEnabled) => {
    set({ soundsEnabled });
    persist({ soundsEnabled });
  },

  setPathMode: (pathMode) => {
    set({ pathMode });
    persist({ pathMode });
  },

  setTheme: (theme) => {
    set({ theme });
    persist({ theme });
  },

  setNativeLang: (nativeLang) => {
    set({ nativeLang });
    persist({ nativeLang });
  },

  setTargetLang: (targetLang) => {
    set({ targetLang });
    persist({ targetLang });
  },

  setUserName: (userName) => {
    set({ userName });
    persist({ userName });
  },

  setUserAge: (userAge) => {
    set({ userAge });
    persist({ userAge });
  },

  setEnglishLevel: (englishLevel) => {
    set({ englishLevel });
    persist({ englishLevel });
  },
}));

