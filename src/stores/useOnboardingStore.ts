import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "@phingo/onboarding_complete";
const PATH_KEY = "@phingo/preferred_path";

type PathMode = "street" | "normal";

interface OnboardingState {
  ready: boolean;
  completed: boolean;
  preferredPath: PathMode;
  completeOnboarding: (path?: PathMode) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ready: false,
  completed: false,
  preferredPath: "street",
  completeOnboarding: (path) => {
    const mode = path ?? "street";
    void AsyncStorage.multiSet([
      [STORAGE_KEY, "1"],
      [PATH_KEY, mode],
    ]).catch(() => {});
    set({ completed: true, preferredPath: mode });
  },
}));

async function hydrate() {
  try {
    const [[, done], [, path]] = await AsyncStorage.multiGet([
      STORAGE_KEY,
      PATH_KEY,
    ]);
    useOnboardingStore.setState({
      ready: true,
      completed: done === "1",
      preferredPath: path === "normal" ? "normal" : "street",
    });
  } catch {
    useOnboardingStore.setState({ ready: true });
  }
}

void hydrate();

export function getPreferredPathFromStore(): PathMode {
  return useOnboardingStore.getState().preferredPath;
}
