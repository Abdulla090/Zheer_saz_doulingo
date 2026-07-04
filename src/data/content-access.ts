import { getUnitsFromCacheOrBundle } from "../services/curriculum-loader";
import type { LessonBank, LessonPathMode, UnitBank } from "./types";
import { getBundledUnits } from "./content-registry";
import { useContentAdminStore } from "../stores/useContentAdminStore";
import { useContentPackStore } from "../stores/useContentPackStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { getSkippedUnitsCount } from "./normal-english";

/** Effective units for gameplay — admin overrides or cached/bundled defaults. */
export function getUnitsForPath(mode: LessonPathMode): UnitBank[] {
  // Guard: if the content pack for this mode is not downloaded, return empty
  if (!useContentPackStore.getState().isAvailable(mode)) {
    return [];
  }

  const override = useContentAdminStore.getState().overrides[mode];
  const baseUnits = override || getUnitsFromCacheOrBundle(mode);

  if (mode === "normal" && baseUnits === getBundledUnits("normal")) {
    const level = useSettingsStore.getState().englishLevel || 5;
    const skipCount = getSkippedUnitsCount(level);
    return baseUnits.slice(skipCount);
  }

  return baseUnits;
}

export function getLessonBank(
  mode: LessonPathMode,
  unitIndex: number,
  lessonIndex: number,
): LessonBank | undefined {
  const units = getUnitsForPath(mode);
  return units[unitIndex]?.[lessonIndex];
}
