import { appStorage } from "../lib/app-storage";
import { router } from "expo-router";
import { create } from "zustand";

const STORAGE_KEY = "twino.onboarding.completed";

interface OnboardingState {
  ready: boolean;
  completed: boolean;
  replayNonce: number;
  completeOnboarding: (nextRoute?: string) => void;
  replayOnboarding: () => Promise<void>;
  /** @deprecated Use replayOnboarding */
  resetOnboarding: () => Promise<void>;
}

const savedOnboardingValue = appStorage.getItemSync(STORAGE_KEY);
// Show onboarding on every platform until the user completes it.
// Only an explicit "true" means the flow was finished.
const savedOnboarding = savedOnboardingValue === "true";

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ready: true,
  completed: savedOnboarding,
  replayNonce: 0,

  completeOnboarding: (nextRoute = "/(tabs)") => {
    appStorage.setItemSync(STORAGE_KEY, "true");
    set({ completed: true });
    router.replace(nextRoute as any);
  },

  replayOnboarding: async () => {
    // Navigate to onboarding first, then flip state after a tick so the
    // old screen tree unmounts gracefully (prevents Android crash).
    router.replace("/onboarding" as any);
    setTimeout(() => {
      appStorage.setItemSync(STORAGE_KEY, "false");
      set({ completed: false });
    }, 50);
  },

  resetOnboarding: async () => {
    get().replayOnboarding();
  },
}));
