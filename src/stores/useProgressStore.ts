import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "phingo.app.progress";
const DAILY_GOAL_XP = 15;

export type ProgressSnapshot = {
  nextLessonPathIndex: number;
  totalXp: number;
  dailyXp: number;
  dailyGoalXp: number;
  streakDays: number;
  lastActiveDate: string | null;
};

const DEFAULT_PROGRESS: ProgressSnapshot = {
  nextLessonPathIndex: 0,
  totalXp: 0,
  dailyXp: 0,
  dailyGoalXp: DAILY_GOAL_XP,
  streakDays: 0,
  lastActiveDate: null,
};

interface ProgressState extends ProgressSnapshot {
  ready: boolean;
  recordLessonComplete: (pathIndex: number, xpEarned: number) => void;
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

  recordLessonComplete: (pathIndex, xpEarned) => {
    const cur = get();
    const { streakDays, lastActiveDate } = applyStreak(
      cur.lastActiveDate,
      cur.streakDays,
    );
    const dailyXp = rollDailyXp(cur.dailyXp, cur.lastActiveDate) + xpEarned;
    const nextLessonPathIndex =
      pathIndex >= cur.nextLessonPathIndex
        ? pathIndex + 1
        : cur.nextLessonPathIndex;

    const next: ProgressSnapshot = {
      nextLessonPathIndex,
      totalXp: cur.totalXp + xpEarned,
      dailyXp,
      dailyGoalXp: DAILY_GOAL_XP,
      streakDays,
      lastActiveDate,
    };

    set(next);
    void persistProgress(next);
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
      dailyGoalXp: DAILY_GOAL_XP,
    };
    merged.dailyXp = rollDailyXp(merged.dailyXp, merged.lastActiveDate);
    useProgressStore.setState({ ...merged, ready: true });
  } catch {
    useProgressStore.setState({ ready: true });
  }
}

void hydrateProgress();
