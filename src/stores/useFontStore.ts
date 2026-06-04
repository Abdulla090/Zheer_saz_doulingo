import { appStorage } from "@/lib/app-storage";
import { create } from "zustand";

const STORAGE_KEY = "selectedFont";
const DEFAULT_FONT = "Rabar_011";

interface FontState {
  selectedFont: string;
  ready: boolean;
  setFont: (font: string) => void;
}

export const useFontStore = create<FontState>((set) => ({
  selectedFont: DEFAULT_FONT,
  ready: false,
  setFont: (font: string) => {
    void appStorage.setItem(STORAGE_KEY, font);
    set({ selectedFont: font });
  },
}));

async function hydrate() {
  try {
    const saved = await appStorage.getItem(STORAGE_KEY);
    useFontStore.setState({
      selectedFont: saved ?? DEFAULT_FONT,
      ready: true,
    });
  } catch {
    useFontStore.setState({ ready: true });
  }
}

void hydrate();
