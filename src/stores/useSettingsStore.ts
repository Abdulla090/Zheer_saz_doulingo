import { appStorage } from "@/lib/app-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.app.settings";

type PathMode = "street" | "normal" | "kids";

interface SettingsState {
  ready: boolean;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  pathMode: PathMode;
  nativeLang: string;
  targetLang: string;
  setHapticsEnabled: (v: boolean) => void;
  setSoundsEnabled: (v: boolean) => void;
  setPathMode: (mode: PathMode) => void;
  setNativeLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
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
      nativeLang: "ku",
      targetLang: "en",
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
      nativeLang: typeof parsed.nativeLang === "string" ? parsed.nativeLang : "ku",
      targetLang: typeof parsed.targetLang === "string" ? parsed.targetLang : "en",
    };
  } catch {
    return {
      hapticsEnabled: true,
      soundsEnabled: true,
      pathMode: "normal" as PathMode,
      nativeLang: "ku",
      targetLang: "en",
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

  setNativeLang: (nativeLang) => {
    set({ nativeLang });
    persist({ nativeLang });
  },

  setTargetLang: (targetLang) => {
    set({ targetLang });
    persist({ targetLang });
  },
}));

