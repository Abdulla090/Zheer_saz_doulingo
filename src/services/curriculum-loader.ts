import { getBundledUnits } from "../data/content-registry";
import { UnitBank, LessonPathMode } from "../data/types";
import { appStorage } from "../lib/app-storage";

const API_URL = process.env.EXPO_PUBLIC_CURRICULUM_API_URL;
const CACHE_PREFIX = "twino.curriculum.cache.";

/**
 * CurriculumLoader — dynamically loads learning path units.
 * Checks for a remote API endpoint; falls back to local cached or bundled files on timeout/error.
 */
export async function fetchRemoteCurriculum(mode: LessonPathMode): Promise<UnitBank[] | null> {
  if (!API_URL) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

    const res = await fetch(`${API_URL}/units?mode=${mode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as UnitBank[];
      if (Array.isArray(data) && data.length > 0) {
        // Cache locally for offline usage
        appStorage.setItemSync(`${CACHE_PREFIX}${mode}`, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn(`[curriculum-loader] Failed to fetch remote curriculum for ${mode}:`, err);
  }
  return null;
}

export function getUnitsFromCacheOrBundle(mode: LessonPathMode): UnitBank[] {
  // Normal mode has a bundled fallback and should always use it
  if (mode === "normal") {
    return getBundledUnits("normal");
  }

  // Kids and Street are loaded from the local cache after the learner activates them.
  try {
    const cached = appStorage.getItemSync(`${CACHE_PREFIX}${mode}`);
    if (cached) {
      const parsed = JSON.parse(cached) as UnitBank[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    /* ignore and return empty */
  }

  // If not activated yet (not in cache), return an empty array to keep the path inactive.
  return [];
}
