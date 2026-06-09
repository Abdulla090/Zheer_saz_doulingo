import { appStorage } from "../lib/app-storage";
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

const savedOnboarding = appStorage.getItemSync(STORAGE_KEY) === "1";

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ready: true,
  completed: savedOnboarding,
  replayNonce: 0,

  completeOnboarding: () => {
    set({ completed: true });
    appStorage.setItemSync(STORAGE_KEY, "1");
    router.replace("/(tabs)");
  },

  replayOnboarding: async () => {
    appStorage.removeItemSync(STORAGE_KEY);
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

