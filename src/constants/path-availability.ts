/**
 * Which learning paths are available.
 *
 * Street and kids are paused: their content and screens are complete but not
 * shipping yet. Everything gates on this one file so re-enabling a path is a
 * one-line change — set its flag to `true` and the switcher, routing, deep-link
 * coercion, and persisted-preference migration all follow.
 *
 * Deliberately not a store: this is a build-time product decision, not user
 * state, so it must not be persisted or made mutable at runtime.
 *
 * `PathMode` is declared here rather than imported from `useSettingsStore`
 * because the store itself calls `resolvePathMode` at module scope; importing
 * the type from there would close an import cycle.
 */

export type PathMode = "street" | "normal" | "kids";

export const PATH_AVAILABILITY: Record<PathMode, boolean> = {
  normal: true,
  street: false,
  kids: false,
};

/** The path every fallback resolves to. Must always be enabled. */
export const DEFAULT_PATH_MODE: PathMode = "normal";

export function isPathEnabled(mode: PathMode | null | undefined): boolean {
  if (!mode) return false;
  return PATH_AVAILABILITY[mode] === true;
}

/**
 * Coerce any requested mode to one the user can actually reach.
 *
 * Covers three cases that would otherwise render a paused path: a stale
 * persisted preference from before the pause, a deep link or QR code pointing
 * at `?mode=street`, and in-app navigation that outlived a flag change.
 */
export function resolvePathMode(mode: PathMode | null | undefined): PathMode {
  return isPathEnabled(mode) ? (mode as PathMode) : DEFAULT_PATH_MODE;
}

/** True when more than one path is live — the switcher hides entirely otherwise. */
export function hasMultiplePaths(): boolean {
  return Object.values(PATH_AVAILABILITY).filter(Boolean).length > 1;
}

export const ENABLED_PATH_MODES: PathMode[] = (
  Object.keys(PATH_AVAILABILITY) as PathMode[]
).filter(isPathEnabled);
