import { appStorage } from "../lib/app-storage";
import { Platform } from "react-native";

import { useProgressStore, getCurrentProgress } from "../stores/useProgressStore";
import { useLocaleStore } from "../stores/useLocaleStore";
import { getPathProgressSummary } from "../utils/path-progress";
import {
  buildLessonRouteForMode,
  getCurrentLessonMeta,
} from "../utils/lesson-navigation";
import {
  WIDGET_SNAPSHOT_KEY,
  type TwinoHomeWidgetPayload,
} from "../widgets/widget-types";

async function persistSnapshot(payload: TwinoHomeWidgetPayload): Promise<void> {
  try {
    await appStorage.setItem(WIDGET_SNAPSHOT_KEY, JSON.stringify(payload));
  } catch {
    /* noop */
  }
}

function buildPayload(): TwinoHomeWidgetPayload {
  const s = useProgressStore.getState();
  const currentProgress = getCurrentProgress();
  const locale = useLocaleStore.getState().locale;
  const summary = getPathProgressSummary(
    currentProgress.nextLessonPathIndex,
    currentProgress.normalNextLessonPathIndex,
  );

  const streetMeta = getCurrentLessonMeta(
    "street",
    currentProgress.nextLessonPathIndex,
    currentProgress.normalNextLessonPathIndex,
    locale,
    currentProgress.kidsNextLessonPathIndex
  );
  const normalMeta = getCurrentLessonMeta(
    "normal",
    currentProgress.nextLessonPathIndex,
    currentProgress.normalNextLessonPathIndex,
    locale,
    currentProgress.kidsNextLessonPathIndex
  );
  const nextMeta = streetMeta ?? normalMeta;

  const nextTitle = nextMeta
    ? `Lesson ${nextMeta.lessonNumber}`
    : "Start learning";
  const nextSubtitle = nextMeta?.sectionTitle ?? "Open Twino to continue";

  let recentTitle = "";
  let recentSubtitle = "";
  const activity = s.lastActivity;
  if (activity?.kind === "lesson") {
    recentTitle = activity.label;
    recentSubtitle =
      activity.mode === "normal" ? "Normal English path" : "Kurdish path";
  } else if (activity?.kind === "game") {
    recentTitle = activity.label;
    recentSubtitle = "Practice game";
  }

  return {
    streak: Math.max(0, s.streakDays),
    dailyXp: s.dailyXp,
    dailyGoalXp: s.dailyGoalXp,
    streetPercent: summary.streetPercent,
    normalPercent: summary.normalPercent,
    streetLabel: "Kurdish",
    normalLabel: "English",
    nextTitle,
    nextSubtitle,
    recentTitle,
    recentSubtitle,
  };
}

/** Push latest progress to home screen widgets (iOS + Android). */
export async function syncHomeWidget(): Promise<void> {
  const payload = buildPayload();
  await persistSnapshot(payload);

  if (Platform.OS === "ios") {
    try {
      const { TwinoHomeWidget } = await import("../widgets/TwinoHomeWidget");
      TwinoHomeWidget.updateSnapshot(payload);
    } catch {
      /* expo-widgets requires dev build */
    }
  }
}

/** Deep link target for widget taps (lesson if available). */
export function getWidgetDeepLinkRoute():
  | ReturnType<typeof buildLessonRouteForMode>
  | null {
  const currentProgress = getCurrentProgress();
  return buildLessonRouteForMode(
    "street",
    currentProgress.nextLessonPathIndex,
    currentProgress.normalNextLessonPathIndex,
  );
}
