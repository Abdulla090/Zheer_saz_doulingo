import { appStorage } from "../lib/app-storage";
import { create } from "zustand";

const STORAGE_KEY = "selectedFont";
export const DEFAULT_FONT = "Rabar_044";

interface FontState {
  selectedFont: string;
  ready: boolean;
  setFont: (font: string) => void;
}

// The app now uses one bundled typeface. Normalize older installations that
// still have a previously selected Rabar font persisted on-device.
if (appStorage.getItemSync(STORAGE_KEY) !== DEFAULT_FONT) {
  appStorage.setItemSync(STORAGE_KEY, DEFAULT_FONT);
}

export const useFontStore = create<FontState>((set) => ({
  selectedFont: DEFAULT_FONT,
  ready: true,
  // Kept as a compatibility no-op for older callers; font changes are no
  // longer user-configurable.
  setFont: () => {
    set({ selectedFont: DEFAULT_FONT });
  },
}));

