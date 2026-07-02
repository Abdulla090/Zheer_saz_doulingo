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

