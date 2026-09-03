import type { LessonPathMode } from "../data/types";
import { appStorage } from "../lib/app-storage";
import { create } from "zustand";

import { migrateProgress } from "../lib/migrate-progress";
import { useLocaleStore } from "./useLocaleStore";

const STORAGE_KEY = "twino.app.progress";
const DAILY_GOAL_XP = 15;

export type LastActivity =
  | {
      kind: "lesson";
      mode: LessonPathMode;
      label: string;
      at: string;
    }
  | {
      kind: "game";
      label: string;
      gameId?: string;
      at: string;
    };

export type ProgressSnapshot = {
  /** Map of "{source}-{target}" to their street path index */
  pathIndexes: Record<string, number>;
  /** Map of "{source}-{target}" to their normal path index */
  normalPathIndexes: Record<string, number>;
  /** Map of "{source}-{target}" to their kids path index */
  kidsPathIndexes: Record<string, number>;

  totalXp: number;
  dailyXp: number;
  dailyGoalXp: number;
  streakDays: number;
  lastActiveDate: string | null;
  lastActivity: LastActivity | null;
};

const DEFAULT_PROGRESS: ProgressSnapshot = {
  pathIndexes: {},
  normalPathIndexes: {},
  kidsPathIndexes: {},
  totalXp: 0,
  dailyXp: 0,
  dailyGoalXp: DAILY_GOAL_XP,
  streakDays: 0,
  lastActiveDate: null,
  lastActivity: null,
};

interface ProgressState extends ProgressSnapshot {
  ready: boolean;
  /** After a lesson, scroll the matching path to the new current node. */
  pathScrollAfterLesson: LessonPathMode | null;
  requestPathScrollAfterLesson: (mode: LessonPathMode) => void;
  consumePathScrollAfterLesson: () => void;
  recordLessonComplete: (
    pathIndex: number,
    xpEarned: number,
    mode?: LessonPathMode,
    label?: string,
  ) => void;
  recordGamePlayed: (label: string, gameId?: string) => void;
  awardXp: (xpEarned: number, label: string) => void;
  resetProgress: () => void;
  initializeNormalProgress: (langPair: string, initialIndex: number) => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function applyStreak(
  lastActiveDate: string | null,
  streakDays: number,
): { streakDays: number; lastActiveDate: string } {
  const today = todayIso();
  if (lastActiveDate === today) {
    return { streakDays, lastActiveDate: today };
  }
  if (!lastActiveDate) {
    return { streakDays: 1, lastActiveDate: today };
  }
  const prev = new Date(`${lastActiveDate}T12:00:00`);
  const now = new Date(`${today}T12:00:00`);
  const diffDays = Math.round(
    (now.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays === 1) {
    return { streakDays: streakDays + 1, lastActiveDate: today };
  }
  return { streakDays: 1, lastActiveDate: today };
}

function rollDailyXp(dailyXp: number, lastActiveDate: string | null): number {
  return lastActiveDate === todayIso() ? dailyXp : 0;
}

function persistProgress(state: ProgressSnapshot) {
  try {
    appStorage.setItemSync(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

// Run migration before initialization
migrateProgress();

const savedRaw = appStorage.getItemSync(STORAGE_KEY);
const initialProgress: ProgressSnapshot = (() => {
  if (!savedRaw) return DEFAULT_PROGRESS;
  try {
    const parsed = JSON.parse(savedRaw) as Partial<ProgressSnapshot>;
    const merged: ProgressSnapshot = {
      ...DEFAULT_PROGRESS,
      ...parsed,
      pathIndexes: parsed.pathIndexes ?? DEFAULT_PROGRESS.pathIndexes,
      normalPathIndexes: parsed.normalPathIndexes ?? DEFAULT_PROGRESS.normalPathIndexes,
      kidsPathIndexes: parsed.kidsPathIndexes ?? DEFAULT_PROGRESS.kidsPathIndexes,
      dailyGoalXp: DAILY_GOAL_XP,
    };
    merged.dailyXp = rollDailyXp(merged.dailyXp, merged.lastActiveDate);
    merged.lastActivity = merged.lastActivity ?? null;
    return merged;
  } catch {
    return DEFAULT_PROGRESS;
  }
})();

export const useProgressStore = create<ProgressState>((set, get) => ({
  ...initialProgress,
  ready: true,
  pathScrollAfterLesson: null,

  requestPathScrollAfterLesson: (mode) => {
    set({ pathScrollAfterLesson: mode });
  },

  consumePathScrollAfterLesson: () => {
    set({ pathScrollAfterLesson: null });
  },

  recordLessonComplete: (pathIndex, xpEarned, mode = "street", label) => {
    const cur = get();
    const { streakDays, lastActiveDate } = applyStreak(
      cur.lastActiveDate,
      cur.streakDays,
    );
    const dailyXp = rollDailyXp(cur.dailyXp, cur.lastActiveDate) + xpEarned;
    
    // Get current language pair
    const localeState = useLocaleStore.getState();
    const langPair = `${localeState.selectedSourceLanguage}-${localeState.selectedTargetLanguage}`;

    const currentStreetIndex = cur.pathIndexes[langPair] || 0;
    const currentNormalIndex = cur.normalPathIndexes[langPair] || 0;
    const currentKidsIndex = cur.kidsPathIndexes[langPair] || 0;

    const nextStreetIndex =
      mode === "street" && pathIndex >= currentStreetIndex
        ? pathIndex + 1
        : currentStreetIndex;
        
    const nextNormalIndex =
      mode === "normal" && pathIndex >= currentNormalIndex
        ? pathIndex + 1
        : currentNormalIndex;
        
    const nextKidsIndex =
      mode === "kids" && pathIndex >= currentKidsIndex
        ? pathIndex + 1
        : currentKidsIndex;

    const next: ProgressSnapshot = {
      ...cur,
      pathIndexes: { ...cur.pathIndexes, [langPair]: nextStreetIndex },
      normalPathIndexes: { ...cur.normalPathIndexes, [langPair]: nextNormalIndex },
      kidsPathIndexes: { ...cur.kidsPathIndexes, [langPair]: nextKidsIndex },
      totalXp: cur.totalXp + xpEarned,
      dailyXp,
      dailyGoalXp: DAILY_GOAL_XP,
      streakDays,
      lastActiveDate,
      lastActivity: {
        kind: "lesson",
        mode,
        label: label ?? `Lesson ${pathIndex + 1}`,
        at: new Date().toISOString(),
      },
    };

    set(next);
    persistProgress(next);
    void import("../services/home-widget-sync").then((m) => m.syncHomeWidget());
  },

  recordGamePlayed: (label, gameId) => {
    const cur = get();
    const next: ProgressSnapshot = {
      ...cur,
      lastActivity: {
        kind: "game",
        label,
        gameId,
        at: new Date().toISOString(),
      },
    };
    set(next);
    persistProgress(next);
    void import("../services/home-widget-sync").then((m) => m.syncHomeWidget());
  },

  awardXp: (xpEarned, label) => {
    const cur = get();
    const { streakDays, lastActiveDate } = applyStreak(
      cur.lastActiveDate,
      cur.streakDays,
    );
    const dailyXp = rollDailyXp(cur.dailyXp, cur.lastActiveDate) + xpEarned;
    const next: ProgressSnapshot = {
      ...cur,
      totalXp: cur.totalXp + xpEarned,
      dailyXp,
      streakDays,
      lastActiveDate,
      lastActivity: {
        kind: "game",
        label,
        gameId: "slang_quiz",
        at: new Date().toISOString(),
      },
    };
    set(next);
    persistProgress(next);
    void import("../services/home-widget-sync").then((m) => m.syncHomeWidget());
  },

  resetProgress: () => {
    set({ ...DEFAULT_PROGRESS, pathScrollAfterLesson: null });
    persistProgress(DEFAULT_PROGRESS);
  },

  initializeNormalProgress: (langPair, initialIndex) => {
    const cur = get();
    const currentNormalIndex = cur.normalPathIndexes[langPair] || 0;
    if (currentNormalIndex < initialIndex) {
      const next: ProgressSnapshot = {
        ...cur,
        normalPathIndexes: {
          ...cur.normalPathIndexes,
          [langPair]: initialIndex,
        },
      };
      set(next);
      persistProgress(next);
      void import("../services/home-widget-sync").then((m) => m.syncHomeWidget());
    }
  },
}));

/*
 * Progress for the active language pair.
 *
 * Every subscription here is a selector on purpose. `useLocaleStore()` with no
 * selector subscribes the caller to the whole locale store, so an unrelated
 * field changing — the UI language, the ready flag — re-rendered the path
 * screens and, through them, every mounted row.
 */
export function useCurrentProgress() {
  const sourceLanguage = useLocaleStore((s) => s.selectedSourceLanguage);
  const targetLanguage = useLocaleStore((s) => s.selectedTargetLanguage);
  const langPair = `${sourceLanguage}-${targetLanguage}`;

  const pathIndexes = useProgressStore((s) => s.pathIndexes);
  const normalPathIndexes = useProgressStore((s) => s.normalPathIndexes);
  const kidsPathIndexes = useProgressStore((s) => s.kidsPathIndexes);

  return {
    nextLessonPathIndex: pathIndexes[langPair] || 0,
    normalNextLessonPathIndex: normalPathIndexes[langPair] || 0,
    kidsNextLessonPathIndex: kidsPathIndexes[langPair] || 0,
  };
}

export function getCurrentProgress() {
  const localeState = useLocaleStore.getState();
  const langPair = `${localeState.selectedSourceLanguage}-${localeState.selectedTargetLanguage}`;
  
  const snap = useProgressStore.getState();

  return {
    nextLessonPathIndex: snap.pathIndexes[langPair] || 0,
    normalNextLessonPathIndex: snap.normalPathIndexes[langPair] || 0,
    kidsNextLessonPathIndex: snap.kidsPathIndexes[langPair] || 0,
  };
}

