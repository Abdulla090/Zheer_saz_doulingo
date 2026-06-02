import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.app.settings";

type PathMode = "street" | "normal" | "kids";

interface SettingsState {
  ready: boolean;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  pathMode: PathMode;
  setHapticsEnabled: (v: boolean) => void;
  setSoundsEnabled: (v: boolean) => void;
  setPathMode: (mode: PathMode) => void;
}

function persist(partial: Partial<SettingsState>) {
  AsyncStorage.getItem(STORAGE_KEY)
    .then((raw) => {
      const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      return AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...prev, ...partial }),
      );
    })
    .catch(() => {});
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ready: false,
  hapticsEnabled: true,
  soundsEnabled: true,
  pathMode: "normal",

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
}));

async function hydrateSettings() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      useSettingsStore.setState({ ready: true });
      return;
    }
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    const savedMode: PathMode =
      parsed.pathMode === "street" || parsed.pathMode === "kids"
        ? parsed.pathMode
        : "normal";
    useSettingsStore.setState({
      hapticsEnabled: parsed.hapticsEnabled !== false,
      soundsEnabled: parsed.soundsEnabled !== false,
      pathMode: savedMode,
      ready: true,
    });
  } catch {
    useSettingsStore.setState({ ready: true });
  }
}

void hydrateSettings();
