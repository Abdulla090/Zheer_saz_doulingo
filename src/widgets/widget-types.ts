/** Shared payload for iOS (expo-widgets) and Android home screen widgets. */
export type PhingoHomeWidgetPayload = {
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

export const ANDROID_WIDGET_NAME = "PhingoHome";
