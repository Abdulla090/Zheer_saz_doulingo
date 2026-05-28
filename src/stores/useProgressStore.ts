import type { LessonPathMode } from "@/data/lesson-content";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.app.progress";
const DAILY_GOAL_XP = 15;

export type LastActivity =
  | {
      kind: "lesson";
      mode: "street" | "normal";
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
  /** Street Kurdish path — next lesson path index (0-based). */
  nextLessonPathIndex: number;
  /** Normal English path — next lesson path index (0-based). */
  normalNextLessonPathIndex: number;
  totalXp: number;
  dailyXp: number;
  dailyGoalXp: number;
  streakDays: number;
  lastActiveDate: string | null;
  lastActivity: LastActivity | null;
  /** True if user scored ≥80% on a lesson today (resets each calendar day). */
  scoredEightyToday: boolean;
};

const DEFAULT_PROGRESS: ProgressSnapshot = {
  nextLessonPathIndex: 0,
  normalNextLessonPathIndex: 0,
  totalXp: 0,
  dailyXp: 0,
  dailyGoalXp: DAILY_GOAL_XP,
  streakDays: 0,
  lastActiveDate: null,
  lastActivity: null,
  scoredEightyToday: false,
};

interface ProgressState extends ProgressSnapshot {
  ready: boolean;
  recordLessonComplete: (
    pathIndex: number,
    xpEarned: number,
    mode?: LessonPathMode,
    label?: string,
    accuracyPercent?: number,
  ) => void;
  recordGamePlayed: (label: string, gameId?: string) => void;
  resetProgress: () => void;
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

async function persistProgress(state: ProgressSnapshot) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* noop */
  }
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  ...DEFAULT_PROGRESS,
  ready: false,

  recordLessonComplete: (pathIndex, xpEarned, mode = "street", label, accuracyPercent) => {
    const cur = get();
    const { streakDays, lastActiveDate } = applyStreak(
      cur.lastActiveDate,
      cur.streakDays,
    );
    const dailyXp = rollDailyXp(cur.dailyXp, cur.lastActiveDate) + xpEarned;
    const sameDay = cur.lastActiveDate === lastActiveDate;
    const hitEighty =
      accuracyPercent !== undefined && accuracyPercent >= 80;
    const scoredEightyToday = sameDay
      ? cur.scoredEightyToday || hitEighty
      : hitEighty;

    const nextLessonPathIndex =
      mode === "street" && pathIndex >= cur.nextLessonPathIndex
        ? pathIndex + 1
        : cur.nextLessonPathIndex;
    const normalNextLessonPathIndex =
      mode === "normal" && pathIndex >= cur.normalNextLessonPathIndex
        ? pathIndex + 1
        : cur.normalNextLessonPathIndex;

    const next: ProgressSnapshot = {
      nextLessonPathIndex,
      normalNextLessonPathIndex,
      totalXp: cur.totalXp + xpEarned,
      dailyXp,
      dailyGoalXp: DAILY_GOAL_XP,
      streakDays,
      lastActiveDate,
      lastActivity: {
        kind: "lesson",
        mode: mode === "normal" ? "normal" : "street",
        label: label ?? `Lesson ${pathIndex + 1}`,
        at: new Date().toISOString(),
      },
      scoredEightyToday,
    };

    set(next);
    void persistProgress(next);
    void import("@/services/home-widget-sync").then((m) => m.syncHomeWidget());
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
    void persistProgress(next);
    void import("@/services/home-widget-sync").then((m) => m.syncHomeWidget());
  },

  resetProgress: () => {
    set({ ...DEFAULT_PROGRESS });
    void persistProgress(DEFAULT_PROGRESS);
  },
}));

async function hydrateProgress() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      useProgressStore.setState({ ready: true });
      return;
    }
    const parsed = JSON.parse(raw) as Partial<ProgressSnapshot>;
    const merged: ProgressSnapshot = {
      ...DEFAULT_PROGRESS,
      ...parsed,
      normalNextLessonPathIndex:
        parsed.normalNextLessonPathIndex ?? DEFAULT_PROGRESS.normalNextLessonPathIndex,
      dailyGoalXp: DAILY_GOAL_XP,
    };
    merged.dailyXp = rollDailyXp(merged.dailyXp, merged.lastActiveDate);
    merged.lastActivity = merged.lastActivity ?? null;
    merged.scoredEightyToday =
      merged.lastActiveDate === todayIso() ? (merged.scoredEightyToday ?? false) : false;
    useProgressStore.setState({ ...merged, ready: true });
  } catch {
    useProgressStore.setState({ ready: true });
  }
}

void hydrateProgress();
