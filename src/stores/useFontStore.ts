import { create } from 'zustand';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'selectedFont';
const DEFAULT_FONT = 'Rabar_011';

interface FontState {
  selectedFont: string;
  ready: boolean; // true once the persisted value has been loaded
  setFont: (font: string) => void;
}

export const useFontStore = create<FontState>((set) => ({
  selectedFont: DEFAULT_FONT,
  ready: false,
  setFont: (font: string) => {
    // Persist to the right storage for the platform
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, font);
      }
    } else {
      AsyncStorage.setItem(STORAGE_KEY, font).catch(() => {});
    }
    set({ selectedFont: font });
  },
}));

// ── Hydration on startup ──────────────────────────────────────────────
// Called once when the module is first imported.
async function hydrate() {
  try {
    let saved: string | null = null;

    if (Platform.OS === 'web') {
      saved = typeof localStorage !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    } else {
      saved = await AsyncStorage.getItem(STORAGE_KEY);
    }

    useFontStore.setState({
      selectedFont: saved ?? DEFAULT_FONT,
      ready: true,
    });
  } catch {
    useFontStore.setState({ ready: true });
  }
}

hydrate();
