import { getBundledUnits } from "@/data/content-registry";
import type { LessonBank, LessonPathMode, UnitBank } from "@/data/types";
import { useContentAdminStore } from "@/stores/useContentAdminStore";

/** Effective units for gameplay — admin overrides or bundled defaults. */
export function getUnitsForPath(mode: LessonPathMode): UnitBank[] {
  const override = useContentAdminStore.getState().overrides[mode];
  if (override) return override;
  return getBundledUnits(mode);
}

export function getLessonBank(
  mode: LessonPathMode,
  unitIndex: number,
  lessonIndex: number,
): LessonBank | undefined {
  const units = getUnitsForPath(mode);
  return units[unitIndex]?.[lessonIndex];
}
