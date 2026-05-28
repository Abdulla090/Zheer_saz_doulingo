/** Shared snapshot pushed to every Phingo home-screen widget. */
export type PhingoWidgetPayload = {
  streak: number;
  dailyXp: number;
  dailyGoalXp: number;
  streetPercent: number;
  normalPercent: number;
  streetLabel: string;
  normalLabel: string;
  nextTitle: string;
  nextSubtitle: string;
  recentTitle: string;
  recentSubtitle: string;
};

export const WIDGET_SNAPSHOT_KEY = "phingo.widget.snapshot";

export const WIDGET_IDS = [
  "PhingoStreak",
  "PhingoDailyXp",
  "PhingoNextLesson",
  "PhingoProgress",
] as const;

export type PhingoWidgetId = (typeof WIDGET_IDS)[number];
