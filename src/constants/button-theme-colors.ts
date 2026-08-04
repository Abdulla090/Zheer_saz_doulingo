export const BUTTON_FACE_RIM_COLORS = {
  // Ocean-inspired beautiful vibrant theme
  green: { rim: "#0F172A", face: "#334155" }, 
  purple: { rim: "#0F172A", face: "#475569" }, 
  blue: { rim: "#020617", face: "#0F172A" }, 
  mint: { rim: "#0F172A", face: "#64748B" }, 
  gray: { rim: "#334155", face: "#475569" }, 
  yellow: { rim: "#020617", face: "#334155" }, 
  orange: { rim: "#0F172A", face: "#475569" }, 
  red: { rim: "#020617", face: "#0F172A" },
} as const;

export const KIDS_BUTTON_FACE_RIM_COLORS = {
  green:  { rim: "#58A700", face: "#58CC02" }, 
  purple: { rim: "#7C3AED", face: "#A78BFA" }, 
  blue:   { rim: "#1490CC", face: "#1CB0F6" }, 
  mint:   { rim: "#0D9488", face: "#2DD4BF" }, 
  gray:   { rim: "#94A3B8", face: "#CBD5E1" }, 
  yellow: { rim: "#E6A700", face: "#FFC800" }, 
  orange: { rim: "#EA580C", face: "#FB923C" }, 
  red:    { rim: "#EA2B2B", face: "#FF4B4B" },
} as const;

export type ButtonThemeColorKey = keyof typeof BUTTON_FACE_RIM_COLORS;

/**
 * Face/rim pairs for the path nodes, keyed by unit theme.
 *
 * Lives here rather than in `list-button` so that data consumers — the unit
 * banner, tests — can read the palette without importing the component (which
 * pulls in the CSS-importing theme module and cannot load under Jest).
 * `list-button` re-exports it, so existing call sites are unaffected.
 */
export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#46a302", face: "#58cc02" },
  purple: { rim: "#6751C9", face: "#8B73E8" },
  blue: { rim: "#1482b8", face: "#1cb0f6" },
  mint: { rim: "#068265", face: "#08c296" },
  gray: { rim: "#B5B6B8", face: "#E9EAEB" },
  yellow: { rim: "#e59400", face: "#ffc800" },
  gold: { rim: "#e59400", face: "#ffc800" },
  orange: { rim: "#d86f00", face: "#ff9600" },
  red: { rim: "#d32f2f", face: "#ff4b4b" },
} as const;

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

