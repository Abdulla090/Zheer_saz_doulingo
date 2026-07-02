/** Shared payload for iOS (expo-widgets) and Android home screen widgets. */
export type TwinoHomeWidgetPayload = {
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

export const WIDGET_SNAPSHOT_KEY = "twino.widget.snapshot";

export const ANDROID_WIDGET_NAME = "TwinoHome";

export type PhingoHomeWidgetPayload = TwinoHomeWidgetPayload;
