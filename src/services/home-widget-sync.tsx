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
  type PhingoWidgetPayload,
} from "@/widgets/widget-payload";

async function persistSnapshot(payload: PhingoWidgetPayload): Promise<void> {
  try {
    await AsyncStorage.setItem(WIDGET_SNAPSHOT_KEY, JSON.stringify(payload));
  } catch {
    /* noop */
  }
}

export function buildWidgetPayload(): PhingoWidgetPayload {
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

async function pushNativeWidgets(payload: PhingoWidgetPayload): Promise<void> {
  if (Platform.OS !== "ios" && Platform.OS !== "android") return;

  try {
    const [
      { PhingoStreakWidget },
      { PhingoDailyXpWidget },
      { PhingoNextLessonWidget },
      { PhingoProgressWidget },
    ] = await Promise.all([
      import("@/widgets/PhingoStreakWidget"),
      import("@/widgets/PhingoDailyXpWidget"),
      import("@/widgets/PhingoNextLessonWidget"),
      import("@/widgets/PhingoProgressWidget"),
    ]);

    PhingoStreakWidget.updateSnapshot(payload);
    PhingoDailyXpWidget.updateSnapshot(payload);
    PhingoNextLessonWidget.updateSnapshot(payload);
    PhingoProgressWidget.updateSnapshot(payload);
  } catch {
    /* Native widgets need a dev/production build — not Expo Go */
  }
}

/** Push latest progress to all Phingo home screen widgets. */
export async function syncHomeWidget(): Promise<void> {
  const payload = buildWidgetPayload();
  await persistSnapshot(payload);
  await pushNativeWidgets(payload);
}

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
