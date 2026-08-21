import { appStorage } from "../lib/app-storage";
import { create } from "zustand";
import type { RealAnalysis } from "../data/voice-tutor-types";
import {
  DEFAULT_MASCOT_ID,
  isMascotId,
  type MascotId,
} from "../constants/mascots";
import {
  DEFAULT_PATH_MODE,
  resolvePathMode,
  type PathMode,
} from "../constants/path-availability";
import { isUserSex, type UserSex } from "../constants/user-profile";

const STORAGE_KEY = "twino.app.settings";

/** Canonical home is `constants/path-availability`; re-exported for existing importers. */
export type { PathMode } from "../constants/path-availability";
export type AppTheme = "light" | "dark" | "system";

const DEFAULT_APP_THEME: AppTheme = "dark";

function resolveAppTheme(value: unknown): AppTheme {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : DEFAULT_APP_THEME;
}

interface SettingsState {
  ready: boolean;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  pathMode: PathMode;
  theme: AppTheme;
  nativeLang: string;
  targetLang: string;
  userName: string;
  userAge: string;
  userSex: UserSex | null;
  englishLevel: number;
  learningGoal: string;
  tutorVoice: string;
  avatarUrl: string;
  selectedMascotId: MascotId;
  isPremium: boolean;
  subscriptionTier: string | null;
  // ── Voice tutor state ──
  knownWords: string[];
  wordsInProgress: string[];
  lastAnalysis: RealAnalysis | null;
  tutorOnboardingComplete: boolean;
  setHapticsEnabled: (v: boolean) => void;
  setSoundsEnabled: (v: boolean) => void;
  setPathMode: (mode: PathMode) => void;
  setTheme: (theme: AppTheme) => void;
  setNativeLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setUserName: (name: string) => void;
  setUserAge: (age: string) => void;
  setUserSex: (sex: UserSex) => void;
  setEnglishLevel: (level: number) => void;
  setLearningGoal: (goal: string) => void;
  setTutorVoice: (voice: string) => void;
  setAvatarUrl: (url: string) => void;
  setSelectedMascotId: (mascotId: MascotId) => void;
  setIsPremium: (isPremium: boolean) => void;
  setSubscriptionTier: (tier: string | null) => void;
  // ── Voice tutor setters ──
  addKnownWords: (words: string[]) => void;
  addWordsInProgress: (words: string[]) => void;
  setLastAnalysis: (analysis: RealAnalysis | null) => void;
  setTutorOnboardingComplete: (v: boolean) => void;
}

function persist(partial: Partial<SettingsState>) {
  try {
    const raw = appStorage.getItemSync(STORAGE_KEY);
    const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    appStorage.setItemSync(
      STORAGE_KEY,
      JSON.stringify({ ...prev, ...partial }),
    );
  } catch {
    /* noop */
  }
}

const savedSettingsRaw = appStorage.getItemSync(STORAGE_KEY);
const initialSettings = (() => {
  if (!savedSettingsRaw) {
    return {
      hapticsEnabled: true,
      soundsEnabled: true,
      pathMode: DEFAULT_PATH_MODE,
      theme: DEFAULT_APP_THEME,
      nativeLang: "ku",
      targetLang: "en",
      userName: "",
      userAge: "",
      userSex: null,
      englishLevel: 2,
      learningGoal: "conversations",
      tutorVoice: "Aoede",
      avatarUrl: "",
      selectedMascotId: DEFAULT_MASCOT_ID,
      customMascot: null,
      isPremium: false,
      subscriptionTier: null,
      knownWords: [],
      wordsInProgress: [],
      lastAnalysis: null,
      tutorOnboardingComplete: false,
    };
  }
  try {
    const parsed = JSON.parse(savedSettingsRaw) as Partial<SettingsState>;
    // A path paused after this preference was written must not resurrect it.
    const savedMode: PathMode = resolvePathMode(parsed.pathMode ?? null);
    return {
      hapticsEnabled: parsed.hapticsEnabled !== false,
      soundsEnabled: parsed.soundsEnabled !== false,
      pathMode: savedMode,
      // Dark is the product default, but keep every explicit saved choice.
      theme: resolveAppTheme(parsed.theme),
      nativeLang: typeof parsed.nativeLang === "string" ? parsed.nativeLang : "ku",
      targetLang: typeof parsed.targetLang === "string" ? parsed.targetLang : "en",
      userName: typeof parsed.userName === "string" ? parsed.userName : "",
      userAge: typeof parsed.userAge === "string" ? parsed.userAge : "",
      userSex: isUserSex(parsed.userSex) ? parsed.userSex : null,
      englishLevel:
        typeof parsed.englishLevel === "number" && [2, 4, 6, 8, 10].includes(parsed.englishLevel)
          ? parsed.englishLevel
          : 2,
      learningGoal:
        typeof parsed.learningGoal === "string" ? parsed.learningGoal : "conversations",
      tutorVoice: typeof parsed.tutorVoice === "string" ? parsed.tutorVoice : "Aoede",
      avatarUrl: typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : "",
      selectedMascotId: isMascotId(parsed.selectedMascotId)
        ? parsed.selectedMascotId
        : DEFAULT_MASCOT_ID,
      isPremium: parsed.isPremium === true,
      subscriptionTier: typeof parsed.subscriptionTier === "string" ? parsed.subscriptionTier : null,
      knownWords: Array.isArray((parsed as any).knownWords) ? (parsed as any).knownWords : [],
      wordsInProgress: Array.isArray((parsed as any).wordsInProgress) ? (parsed as any).wordsInProgress : [],
      lastAnalysis: (parsed as any).lastAnalysis ?? null,
      tutorOnboardingComplete: Boolean((parsed as any).tutorOnboardingComplete),
    };
  } catch {
    return {
      hapticsEnabled: true,
      soundsEnabled: true,
      pathMode: DEFAULT_PATH_MODE,
      theme: DEFAULT_APP_THEME,
      nativeLang: "ku",
      targetLang: "en",
      userName: "",
      userAge: "",
      userSex: null,
      englishLevel: 2,
      learningGoal: "conversations",
      tutorVoice: "Aoede",
      avatarUrl: "",
      selectedMascotId: DEFAULT_MASCOT_ID,
      isPremium: false,
      subscriptionTier: null,
      knownWords: [],
      wordsInProgress: [],
      lastAnalysis: null,
      tutorOnboardingComplete: false,
    };
  }
})();

export const useSettingsStore = create<SettingsState>((set) => ({
  ...initialSettings,
  ready: true,

  setHapticsEnabled: (hapticsEnabled) => {
    set({ hapticsEnabled });
    persist({ hapticsEnabled });
  },

  setSoundsEnabled: (soundsEnabled) => {
    set({ soundsEnabled });
    persist({ soundsEnabled });
  },

  setPathMode: (pathMode) => {
    // Coerce here too: LessonScreen and deep links both call this with whatever
    // mode they were handed, so a paused path must never reach storage.
    const safeMode = resolvePathMode(pathMode);
    set({ pathMode: safeMode });
    persist({ pathMode: safeMode });
  },

  setTheme: (theme) => {
    set({ theme });
    persist({ theme });
  },

  setNativeLang: (nativeLang) => {
    set({ nativeLang });
    persist({ nativeLang });
  },

  setTargetLang: (targetLang) => {
    set({ targetLang });
    persist({ targetLang });
  },

  setUserName: (userName) => {
    set({ userName });
    persist({ userName });
  },

  setUserAge: (userAge) => {
    set({ userAge });
    persist({ userAge });
  },

  setUserSex: (userSex) => {
    set({ userSex });
    persist({ userSex });
  },

  setEnglishLevel: (englishLevel) => {
    set({ englishLevel });
    persist({ englishLevel });
  },

  setLearningGoal: (learningGoal) => {
    set({ learningGoal });
    persist({ learningGoal });
  },

  setTutorVoice: (tutorVoice) => {
    set({ tutorVoice });
    persist({ tutorVoice });
  },

  setAvatarUrl: (avatarUrl) => {
    set({ avatarUrl });
    persist({ avatarUrl });
  },

  setSelectedMascotId: (selectedMascotId) => {
    set({ selectedMascotId });
    persist({ selectedMascotId });
  },

  setIsPremium: (isPremium) => {
    set({ isPremium });
    persist({ isPremium });
  },

  setSubscriptionTier: (subscriptionTier) => {
    set({ subscriptionTier });
    persist({ subscriptionTier });
  },

  // ── Voice tutor setters ──

  addKnownWords: (words) => {
    const cur = useSettingsStore.getState().knownWords;
    const merged = [...new Set([...cur, ...words])];
    set({ knownWords: merged });
    persist({ knownWords: merged } as any);
  },

  addWordsInProgress: (words) => {
    const cur = useSettingsStore.getState().wordsInProgress;
    const merged = [...new Set([...cur, ...words])];
    set({ wordsInProgress: merged });
    persist({ wordsInProgress: merged } as any);
  },

  setLastAnalysis: (lastAnalysis) => {
    set({ lastAnalysis });
    persist({ lastAnalysis } as any);
  },

  setTutorOnboardingComplete: (tutorOnboardingComplete) => {
    set({ tutorOnboardingComplete });
    persist({ tutorOnboardingComplete } as any);
  },
}));
