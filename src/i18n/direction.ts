import { LANGUAGES } from "../config/languages";

export type Direction = "ltr" | "rtl";
export type LogicalAlignment = "start" | "end" | "center";
export type PhysicalTextAlign = "left" | "right" | "center";
export type DirectionPlatform = "android" | "ios" | "web" | string;

const RTL_SCRIPTS = new Set(["arab", "hebr", "syrc", "thaa", "nkoo", "adlm"]);
const LTR_SCRIPTS = new Set(["latn", "cyrl", "grek"]);
const RTL_LANGUAGES = new Set([
  "ar",
  "ckb",
  "dv",
  "fa",
  "he",
  "ku",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
]);

/** Normalize underscores/casing while preserving BCP-47 script information. */
export function normalizeLanguageCode(languageCode?: string | null): string {
  return (languageCode ?? "")
    .trim()
    .replace(/_/g, "-")
    .split("-")
    .filter(Boolean)
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      if (part.length === 4) {
        return `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`;
      }
      return part.toUpperCase();
    })
    .join("-");
}

/** Resolve paragraph direction from explicit language metadata and locale/script tags. */
export function getLanguageDirection(
  languageCode?: string | null,
  fallback: Direction = "ltr",
): Direction {
  const normalized = normalizeLanguageCode(languageCode);
  if (!normalized) return fallback;

  const parts = normalized.toLowerCase().split("-");
  const primary = parts[0];
  const script = parts.find((part) => part.length === 4);

  // An explicit script always wins over the base language (for example ku-Latn).
  if (script && LTR_SCRIPTS.has(script)) return "ltr";
  if (script && RTL_SCRIPTS.has(script)) return "rtl";

  const projectLanguage = LANGUAGES[normalized] ?? LANGUAGES[primary];
  if (projectLanguage) return projectLanguage.rtl ? "rtl" : "ltr";

  return RTL_LANGUAGES.has(primary) ? "rtl" : fallback;
}

export function resolveTextAlign(
  direction: Direction,
  alignment: LogicalAlignment = "start",
): PhysicalTextAlign {
  if (alignment === "center") return "center";
  if (alignment === "start") return direction === "rtl" ? "right" : "left";
  return direction === "rtl" ? "left" : "right";
}

/**
 * Encode a desired physical edge for React Native's platform text engines.
 *
 * Android and iOS swap explicit left/right paragraph alignment when the text
 * sits inside an RTL *layout*. That layout direction comes from
 * `I18nManager.forceRTL`, which this app sets from the UI language — it is NOT
 * the direction of the text's own content. English answer tiles inside a Kurdish
 * UI are the case that distinguishes the two: content is LTR, layout is RTL, and
 * the platform still swaps, so `left` must be pre-encoded as `right` to land on
 * the left edge.
 *
 * `layoutDirection` defaults to `contentDirection` so existing single-direction
 * callers keep their behaviour; mixed-language content should pass both.
 */
export function resolvePlatformTextAlign(
  platform: DirectionPlatform,
  contentDirection: Direction,
  physicalAlignment: PhysicalTextAlign,
  layoutDirection: Direction = contentDirection,
): PhysicalTextAlign {
  if (platform === "web" || physicalAlignment === "center") {
    return physicalAlignment;
  }
  // The swap is a property of the surrounding layout, not of the glyphs.
  if (layoutDirection === "ltr") return physicalAlignment;

  return physicalAlignment === "right" ? "left" : "right";
}

/**
 * Keep an established web alignment while allowing native lesson content to
 * opt into an explicit logical edge. Native text otherwise inherits the app's
 * global RTL paragraph context even when its own content language is LTR.
 */
export function resolvePlatformAlignment(
  platform: DirectionPlatform,
  alignment?: LogicalAlignment,
  nativeAlignment?: LogicalAlignment,
): LogicalAlignment | undefined {
  return platform === "web" ? alignment : nativeAlignment ?? alignment;
}

export function resolveFlexDirection(
  direction: Direction,
  orientation: "inline" | "reverse" = "inline",
): "row" | "row-reverse" {
  const inline = direction === "rtl" ? "row-reverse" : "row";
  if (orientation === "inline") return inline;
  return inline === "row" ? "row-reverse" : "row";
}
