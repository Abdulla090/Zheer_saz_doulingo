import type { LessonPathMode } from "@/data/lesson-content";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.app.progress";
const DAILY_GOAL_XP = 15;

export type LastActivity =
  | {
      kind: "lesson";
      mode: "street" | "normal" | "kids";
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
  /** Kids English path — next lesson path index (0-based). */
  kidsNextLessonPathIndex: number;
  totalXp: number;
  dailyXp: number;
  dailyGoalXp: number;
  streakDays: number;
  lastActiveDate: string | null;
  lastActivity: LastActivity | null;
};

const DEFAULT_PROGRESS: ProgressSnapshot = {
  nextLessonPathIndex: 0,
  normalNextLessonPathIndex: 0,
  kidsNextLessonPathIndex: 0,
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

    const nextLessonPathIndex =
      mode === "street" && pathIndex >= cur.nextLessonPathIndex
        ? pathIndex + 1
        : cur.nextLessonPathIndex;
    const normalNextLessonPathIndex =
      mode === "normal" && pathIndex >= cur.normalNextLessonPathIndex
        ? pathIndex + 1
        : cur.normalNextLessonPathIndex;
    const kidsNextLessonPathIndex =
      mode === "kids" && pathIndex >= cur.kidsNextLessonPathIndex
        ? pathIndex + 1
        : cur.kidsNextLessonPathIndex;

    const next: ProgressSnapshot = {
      nextLessonPathIndex,
      normalNextLessonPathIndex,
      kidsNextLessonPathIndex,
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
    set({ ...DEFAULT_PROGRESS, pathScrollAfterLesson: null });
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
      kidsNextLessonPathIndex:
        parsed.kidsNextLessonPathIndex ?? DEFAULT_PROGRESS.kidsNextLessonPathIndex,
      dailyGoalXp: DAILY_GOAL_XP,
    };
    merged.dailyXp = rollDailyXp(merged.dailyXp, merged.lastActiveDate);
    merged.lastActivity = merged.lastActivity ?? null;
    useProgressStore.setState({ ...merged, ready: true });
  } catch {
    useProgressStore.setState({ ready: true });
  }
}

void hydrateProgress();
