export type ScreenOpeningVariant = "home" | "practice" | "path" | "settings";

export type OpeningTheme = {
  veilGradient: [string, string, ...string[]];
  orbA: string;
  orbB: string;
  orbC: string;
  origin: { x: number; y: number };
};

export const OPENING_THEMES: Record<ScreenOpeningVariant, OpeningTheme> = {
  home: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.18, y: 0.14 },
  },
  practice: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.82, y: 0.16 },
  },
  path: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.5, y: 0.08 },
  },
  settings: {
    veilGradient: ["#F8FAFC", "#E2E8F0", "#FFFFFF"],
    orbA: "rgba(15, 23, 42, 0.12)",
    orbB: "rgba(15, 23, 42, 0.08)",
    orbC: "rgba(15, 23, 42, 0.05)",
    origin: { x: 0.5, y: 0.22 },
  },
};
