import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.app.settings";

interface SettingsState {
  ready: boolean;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  pathMode: "street" | "normal";
  setHapticsEnabled: (v: boolean) => void;
  setSoundsEnabled: (v: boolean) => void;
  setPathMode: (mode: "street" | "normal") => void;
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
  pathMode: "street",

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
    useSettingsStore.setState({
      hapticsEnabled: parsed.hapticsEnabled !== false,
      soundsEnabled: parsed.soundsEnabled !== false,
      pathMode: parsed.pathMode === "normal" ? "normal" : "street",
      ready: true,
    });
  } catch {
    useSettingsStore.setState({ ready: true });
  }
}

void hydrateSettings();
