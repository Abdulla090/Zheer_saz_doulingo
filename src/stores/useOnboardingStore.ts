import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.onboarding.completed";

interface OnboardingState {
  ready: boolean;
  completed: boolean;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ready: false,
  completed: false,

  completeOnboarding: () => {
    set({ completed: true });
    void AsyncStorage.setItem(STORAGE_KEY, "1").catch(() => {});
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
