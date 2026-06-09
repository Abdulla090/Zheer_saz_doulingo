import type { LastActivity } from "../../stores/useProgressStore";

export type HomeQuestId = "dailyXp" | "lessonToday" | "practiceToday";

export type HomeQuestProgress = {
  id: HomeQuestId;
  progress: number;
  progressLabel: string;
  done: boolean;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function activityIsToday(at: string | undefined): boolean {
  if (!at) return false;
  return at.slice(0, 10) === todayIso();
}

/** Daily quest rows derived from persisted progress (no placeholder numbers). */
export function buildHomeDailyQuests(input: {
  dailyXp: number;
  dailyGoalXp: number;
  lastActivity: LastActivity | null;
}): HomeQuestProgress[] {
  const { dailyXp, dailyGoalXp, lastActivity } = input;
  const goal = Math.max(dailyGoalXp, 1);

  const xpDone = dailyXp >= goal;
  const lessonDone =
    lastActivity?.kind === "lesson" && activityIsToday(lastActivity.at);
  const practiceDone =
    lastActivity?.kind === "game" && activityIsToday(lastActivity.at);

  return [
    {
      id: "dailyXp",
      progress: Math.min(1, dailyXp / goal),
      progressLabel: `${dailyXp} / ${goal}`,
      done: xpDone,
    },
    {
      id: "lessonToday",
      progress: lessonDone ? 1 : 0,
      progressLabel: lessonDone ? "1 / 1" : "0 / 1",
      done: lessonDone,
    },
    {
      id: "practiceToday",
      progress: practiceDone ? 1 : 0,
      progressLabel: practiceDone ? "1 / 1" : "0 / 1",
      done: practiceDone,
    },
  ];
}
