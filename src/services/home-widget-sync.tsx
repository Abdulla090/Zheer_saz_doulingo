import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { useProgressStore } from "@/stores/useProgressStore";
import { getPathProgressSummary } from "@/utils/path-progress";
import {
  buildLessonRouteForMode,
  getCurrentLessonMeta,
} from "@/utils/lesson-navigation";
import {
  WIDGET_SNAPSHOT_KEY,
  type PhingoHomeWidgetPayload,
} from "@/widgets/widget-types";

async function persistSnapshot(payload: PhingoHomeWidgetPayload): Promise<void> {
  try {
    await AsyncStorage.setItem(WIDGET_SNAPSHOT_KEY, JSON.stringify(payload));
  } catch {
    /* noop */
  }
}

function buildPayload(): PhingoHomeWidgetPayload {
  const s = useProgressStore.getState();
  const summary = getPathProgressSummary(
    s.nextLessonPathIndex,
    s.normalNextLessonPathIndex,
  );

  const streetMeta = getCurrentLessonMeta(
    "street",
    s.nextLessonPathIndex,
    s.normalNextLessonPathIndex,
  );
  const normalMeta = getCurrentLessonMeta(
    "normal",
    s.nextLessonPathIndex,
    s.normalNextLessonPathIndex,
  );
  const nextMeta = streetMeta ?? normalMeta;

  const nextTitle = nextMeta
    ? `Lesson ${nextMeta.lessonNumber}`
    : "Start learning";
  const nextSubtitle = nextMeta?.sectionTitle ?? "Open Phingo to continue";

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

  if (Platform.OS === "ios" || Platform.OS === "android") {
    try {
      const { PhingoHomeWidget } = await import("@/widgets/PhingoHomeWidget");
      PhingoHomeWidget.updateSnapshot(payload);
    } catch {
      /* expo-widgets requires dev build */
    }
  }
}

/** Deep link target for widget taps (lesson if available). */
export function getWidgetDeepLinkRoute():
  | ReturnType<typeof buildLessonRouteForMode>
  | null {
  const s = useProgressStore.getState();
  return buildLessonRouteForMode(
    "street",
    s.nextLessonPathIndex,
    s.normalNextLessonPathIndex,
  );
}
