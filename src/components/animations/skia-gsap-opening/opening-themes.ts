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

const DEFAULT_THEME: OpeningTheme = {
  veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
  orbA: "rgba(15, 23, 42, 0.12)",
  orbB: "rgba(15, 23, 42, 0.08)",
  orbC: "rgba(15, 23, 42, 0.05)",
  origin: { x: 0.5, y: 0.15 },
};

export const OPENING_THEMES: Record<ScreenOpeningVariant, OpeningTheme> = {
  home: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.18, y: 0.14 },
  },
  dashboard: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.5, y: 0.12 },
  },
  practice: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.82, y: 0.16 },
  },
  play: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(139, 92, 246, 0.14)",
    orbB: "rgba(59, 130, 246, 0.10)",
    orbC: "rgba(236, 72, 153, 0.08)",
    origin: { x: 0.5, y: 0.2 },
  },
  games: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(139, 92, 246, 0.14)",
    orbB: "rgba(59, 130, 246, 0.10)",
    orbC: "rgba(236, 72, 153, 0.08)",
    origin: { x: 0.5, y: 0.2 },
  },
  path: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(2, 132, 199, 0.12)",
    orbB: "rgba(14, 165, 233, 0.08)",
    orbC: "rgba(56, 189, 248, 0.05)",
    origin: { x: 0.5, y: 0.08 },
  },
  settings: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.5, y: 0.22 },
  },
  guidebook: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(2, 132, 199, 0.14)",
    orbB: "rgba(59, 130, 246, 0.09)",
    orbC: "rgba(14, 165, 233, 0.06)",
    origin: { x: 0.5, y: 0.15 },
  },
  feed: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(245, 158, 11, 0.14)",
    orbB: "rgba(234, 88, 12, 0.09)",
    orbC: "rgba(251, 191, 36, 0.06)",
    origin: { x: 0.5, y: 0.18 },
  },
  quest: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(245, 158, 11, 0.14)",
    orbB: "rgba(234, 88, 12, 0.09)",
    orbC: "rgba(251, 191, 36, 0.06)",
    origin: { x: 0.5, y: 0.18 },
  },
  subscription: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(245, 158, 11, 0.15)",
    orbB: "rgba(217, 119, 6, 0.10)",
    orbC: "rgba(252, 211, 77, 0.07)",
    origin: { x: 0.5, y: 0.25 },
  },
  pricing: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(245, 158, 11, 0.15)",
    orbB: "rgba(217, 119, 6, 0.10)",
    orbC: "rgba(252, 211, 77, 0.07)",
    origin: { x: 0.5, y: 0.25 },
  },
  profile: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.5, y: 0.15 },
  },
  more: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.5, y: 0.15 },
  },
  exam: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(79, 70, 229, 0.14)",
    orbB: "rgba(99, 102, 241, 0.09)",
    orbC: "rgba(129, 140, 248, 0.06)",
    origin: { x: 0.5, y: 0.15 },
  },
  ai: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(6, 182, 212, 0.14)",
    orbB: "rgba(59, 130, 246, 0.09)",
    orbC: "rgba(14, 165, 233, 0.06)",
    origin: { x: 0.5, y: 0.2 },
  },
  general: DEFAULT_THEME,
};
