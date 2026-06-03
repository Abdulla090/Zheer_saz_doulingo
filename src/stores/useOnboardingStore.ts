import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";

const STORAGE_KEY = "phingo.onboarding.completed";

interface OnboardingState {
  ready: boolean;
  completed: boolean;
  replayNonce: number;
  completeOnboarding: () => void;
  replayOnboarding: () => Promise<void>;
  /** @deprecated Use replayOnboarding */
  resetOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ready: false,
  completed: false,
  replayNonce: 0,

  completeOnboarding: () => {
    set({ completed: true });
    void AsyncStorage.setItem(STORAGE_KEY, "1").catch(() => {});
    router.replace("/(tabs)");
  },

  replayOnboarding: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set((s) => ({
      completed: false,
      replayNonce: s.replayNonce + 1,
    }));
    router.replace("/onboarding");
  },

  resetOnboarding: async () => {
    await get().replayOnboarding();
  },
}));

async function hydrateOnboarding() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    useOnboardingStore.setState({
      completed: raw === "1",
      ready: true,
    });
  } catch {
    useOnboardingStore.setState({ ready: true });
  }
}

void hydrateOnboarding();
