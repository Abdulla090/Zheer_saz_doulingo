import { getUnitsFromCacheOrBundle } from "../services/curriculum-loader";
import type { LessonBank, LessonPathMode, UnitBank } from "./types";
import { useContentAdminStore } from "../stores/useContentAdminStore";
import { useContentPackStore } from "../stores/useContentPackStore";

/** Effective units for gameplay — admin overrides or cached/bundled defaults. */
export function getUnitsForPath(mode: LessonPathMode): UnitBank[] {
  // Guard: if the content pack for this mode is not downloaded, return empty
  if (!useContentPackStore.getState().isAvailable(mode)) {
    return [];
  }

  const override = useContentAdminStore.getState().overrides[mode];
  if (override) return override;
  return getUnitsFromCacheOrBundle(mode);
}

export function getLessonBank(
  mode: LessonPathMode,
  unitIndex: number,
  lessonIndex: number,
): LessonBank | undefined {
  const units = getUnitsForPath(mode);
  return units[unitIndex]?.[lessonIndex];
}
