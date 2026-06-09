import { appStorage } from "../lib/app-storage";
import { create } from "zustand";

const STORAGE_KEY = "selectedFont";
const DEFAULT_FONT = "Rabar_011";

interface FontState {
  selectedFont: string;
  ready: boolean;
  setFont: (font: string) => void;
}

const savedFont = appStorage.getItemSync(STORAGE_KEY) ?? DEFAULT_FONT;

export const useFontStore = create<FontState>((set) => ({
  selectedFont: savedFont,
  ready: true,
  setFont: (font: string) => {
    appStorage.setItemSync(STORAGE_KEY, font);
    set({ selectedFont: font });
  },
}));

