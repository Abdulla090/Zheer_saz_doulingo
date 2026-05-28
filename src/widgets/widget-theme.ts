export const W = {
  blue: "#2B59F3",
  blueLight: "#E8F0FE",
  navy: "#1B2B48",
  gray: "#6B7A99",
  gold: "#FFB020",
  green: "#58CC02",
  white: "#FFFFFF",
  bg: "#F4F7FF",
} as const;

export function pct(n: number): number {
  return Math.round(Math.min(1, Math.max(0, n)) * 100);
}
