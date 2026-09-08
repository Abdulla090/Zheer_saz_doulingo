export type ScreenOpeningVariant =
  | "home"
  | "dashboard"
  | "practice"
  | "play"
  | "games"
  | "path"
  | "settings"
  | "guidebook"
  | "feed"
  | "quest"
  | "subscription"
  | "pricing"
  | "profile"
  | "more"
  | "exam"
  | "ai"
  | "general";

export type OpeningTheme = {
  veilGradient: [string, string, ...string[]];
  orbA: string;
  orbB: string;
  orbC: string;
  origin: { x: number; y: number };
};

const TRANSPARENT_GRADIENT: [string, string] = [
  "rgba(0,0,0,0)",
  "rgba(0,0,0,0)",
];

const DEFAULT_THEME: OpeningTheme = {
  veilGradient: TRANSPARENT_GRADIENT,
  orbA: "rgba(56, 189, 248, 0.20)",
  orbB: "rgba(37, 99, 235, 0.15)",
  orbC: "rgba(14, 165, 233, 0.10)",
  origin: { x: 0.5, y: 0.15 },
};

export const OPENING_THEMES: Record<ScreenOpeningVariant, OpeningTheme> = {
  home: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(56, 189, 248, 0.22)",
    orbB: "rgba(37, 99, 235, 0.16)",
    orbC: "rgba(16, 185, 129, 0.12)",
    origin: { x: 0.18, y: 0.14 },
  },
  dashboard: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(14, 165, 233, 0.22)",
    orbB: "rgba(37, 99, 235, 0.16)",
    orbC: "rgba(56, 189, 248, 0.10)",
    origin: { x: 0.5, y: 0.12 },
  },
  practice: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(16, 185, 129, 0.22)",
    orbB: "rgba(13, 148, 136, 0.16)",
    orbC: "rgba(56, 189, 248, 0.10)",
    origin: { x: 0.82, y: 0.16 },
  },
  play: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(14, 165, 233, 0.22)",
    orbB: "rgba(37, 99, 235, 0.16)",
    orbC: "rgba(16, 185, 129, 0.12)",
    origin: { x: 0.5, y: 0.2 },
  },
  games: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(14, 165, 233, 0.22)",
    orbB: "rgba(37, 99, 235, 0.16)",
    orbC: "rgba(16, 185, 129, 0.12)",
    origin: { x: 0.5, y: 0.2 },
  },
  path: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(2, 132, 199, 0.22)",
    orbB: "rgba(14, 165, 233, 0.16)",
    orbC: "rgba(56, 189, 248, 0.10)",
    origin: { x: 0.5, y: 0.08 },
  },
  settings: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(56, 189, 248, 0.22)",
    orbB: "rgba(37, 99, 235, 0.16)",
    orbC: "rgba(14, 165, 233, 0.12)",
    origin: { x: 0.5, y: 0.22 },
  },
  guidebook: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(2, 132, 199, 0.22)",
    orbB: "rgba(59, 130, 246, 0.16)",
    orbC: "rgba(14, 165, 233, 0.10)",
    origin: { x: 0.5, y: 0.15 },
  },
  feed: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(245, 158, 11, 0.22)",
    orbB: "rgba(217, 119, 6, 0.16)",
    orbC: "rgba(251, 191, 36, 0.10)",
    origin: { x: 0.5, y: 0.18 },
  },
  quest: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(245, 158, 11, 0.22)",
    orbB: "rgba(217, 119, 6, 0.16)",
    orbC: "rgba(251, 191, 36, 0.10)",
    origin: { x: 0.5, y: 0.18 },
  },
  subscription: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(245, 158, 11, 0.22)",
    orbB: "rgba(217, 119, 6, 0.16)",
    orbC: "rgba(252, 211, 77, 0.10)",
    origin: { x: 0.5, y: 0.25 },
  },
  pricing: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(245, 158, 11, 0.22)",
    orbB: "rgba(217, 119, 6, 0.16)",
    orbC: "rgba(252, 211, 77, 0.10)",
    origin: { x: 0.5, y: 0.25 },
  },
  profile: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(56, 189, 248, 0.20)",
    orbB: "rgba(37, 99, 235, 0.15)",
    orbC: "rgba(14, 165, 233, 0.10)",
    origin: { x: 0.5, y: 0.15 },
  },
  more: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(56, 189, 248, 0.20)",
    orbB: "rgba(37, 99, 235, 0.15)",
    orbC: "rgba(14, 165, 233, 0.10)",
    origin: { x: 0.5, y: 0.15 },
  },
  exam: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(14, 165, 233, 0.22)",
    orbB: "rgba(37, 99, 235, 0.16)",
    orbC: "rgba(56, 189, 248, 0.10)",
    origin: { x: 0.5, y: 0.15 },
  },
  ai: {
    veilGradient: TRANSPARENT_GRADIENT,
    orbA: "rgba(6, 182, 212, 0.22)",
    orbB: "rgba(59, 130, 246, 0.16)",
    orbC: "rgba(14, 165, 233, 0.10)",
    origin: { x: 0.5, y: 0.2 },
  },
  general: DEFAULT_THEME,
};
