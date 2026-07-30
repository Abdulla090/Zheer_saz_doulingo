import { getUnitsFromCacheOrBundle } from "../services/curriculum-loader";
import type { LessonBank, LessonPathMode, UnitBank } from "./types";
import { useContentAdminStore } from "../stores/useContentAdminStore";
import { useContentPackStore } from "../stores/useContentPackStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { getSkippedUnitsCount } from "./normal-english";

/** Effective units for gameplay — admin overrides or cached/bundled defaults. */
export function getUnitsForPath(mode: LessonPathMode): UnitBank[] {
  // Guard: if this bundled path has not been activated, return no units.
  if (!useContentPackStore.getState().isAvailable(mode)) {
    return [];
  }

  const override = useContentAdminStore.getState().overrides[mode];
  const baseUnits = override || getUnitsFromCacheOrBundle(mode);

  if (mode === "normal") {
    const level = useSettingsStore.getState().englishLevel || 5;
    const skipCount = getSkippedUnitsCount(level);
    return baseUnits.slice(skipCount);
  }

  return baseUnits;
}

/** Full, unsliced path for curriculum administration and publishing. */
export function getAllUnitsForPath(mode: LessonPathMode): UnitBank[] {
  return (
    useContentAdminStore.getState().overrides[mode] ??
    getUnitsFromCacheOrBundle(mode)
  );
}

export function getLessonBank(
  mode: LessonPathMode,
  unitIndex: number,
  lessonIndex: number,
): LessonBank | undefined {
  const units = getUnitsForPath(mode);
  return units[unitIndex]?.[lessonIndex];
}
