import { useMemo } from "react";

import { PRIMARY_ACTION } from "../../../constants/primary-action";
import { useThemeColors } from "../../../hooks/useThemeColors";

/**
 * Falou-reference onboarding tokens. The dark resolution is a near-black ink
 * canvas with subtly raised graphite rows; light mode keeps the same hierarchy
 * on warm ivory rather than turning every label into a white card. The login
 * button orange carries progress, focus, selection, and the primary action so
 * onboarding and authentication teach one consistent interaction color.
 */
export type OnboardingTheme = {
  isDark: boolean;

  /** Page background. */
  canvas: string;
  /** Resting option row / input / card. */
  surface: string;
  /** Round controls and anything that must read above `surface`. */
  surfaceRaised: string;
  /** Neutral chip behind an emoji or glyph. */
  surfaceSunken: string;
  /** Speech bubble fill and outline. */
  bubble: string;
  bubbleBorder: string;

  ink: string;
  mutedInk: string;
  faintInk: string;

  border: string;
  borderStrong: string;

  accent: string;
  accentPressed: string;
  accentInk: string;
  accentWash: string;
  accentBorder: string;
  onAccent: string;

  /** Unfilled part of the progress ring. */
  ringTrack: string;

  /** Skia ambient-light colors; static strings are safe in worklets/Skia. */
  glowPrimary: string;
  glowSecondary: string;

  shadowColor: string;
  shadowOpacity: number;
};

const LIGHT: OnboardingTheme = {
  isDark: false,

  canvas: "#F7F5F0",
  surface: "#EFF1F4",
  surfaceRaised: "#FCFBF8",
  surfaceSunken: "#ECEFF3",
  bubble: "#F7F5F0",
  bubbleBorder: "#DCE2E9",

  ink: "#151B24",
  mutedInk: "#667080",
  faintInk: "#8C96A4",

  border: "#DDE2E8",
  borderStrong: "#C7CFD9",

  accent: PRIMARY_ACTION.face,
  accentPressed: PRIMARY_ACTION.rim,
  accentInk: "#B93820",
  accentWash: "#FFF0EC",
  accentBorder: "#FF9B84",
  onAccent: "#FFFFFF",

  ringTrack: "#D8DEE7",

  glowPrimary: "rgba(255,107,74,0.16)",
  glowSecondary: "rgba(255,166,87,0.10)",

  shadowColor: "#151B24",
  shadowOpacity: 0.09,
};

const DARK: OnboardingTheme = {
  isDark: true,

  canvas: "#10161C",
  surface: "#161D24",
  surfaceRaised: "#1B232C",
  surfaceSunken: "#151C23",
  bubble: "#12191F",
  bubbleBorder: "#222B34",

  ink: "#F5F7FA",
  mutedInk: "#A1A9B4",
  faintInk: "#687380",

  border: "#202832",
  borderStrong: "#343F4B",

  accent: PRIMARY_ACTION.face,
  accentPressed: PRIMARY_ACTION.rim,
  accentInk: "#FF9B84",
  accentWash: "#3A211C",
  accentBorder: "#FF9B84",
  onAccent: "#FFFFFF",

  ringTrack: "#2B3540",

  glowPrimary: "rgba(255,107,74,0.22)",
  glowSecondary: "rgba(255,166,87,0.12)",

  shadowColor: "#000000",
  shadowOpacity: 0.4,
};

export function useOnboardingTheme(): OnboardingTheme {
  const { isDark } = useThemeColors();
  return isDark ? DARK : LIGHT;
}

/**
 * Intro-slide backdrop stops.
 *
 * Deliberately very low contrast — every stop sits within a few percent of
 * `canvas`. It exists so a full-bleed screen does not read as flat paper, not
 * to be noticed, and it must never compete with the artwork sitting on it.
 */
export function useOnboardingGradient(): readonly [string, string, string] {
  const theme = useOnboardingTheme();
  return theme.isDark
    ? ["#121A23", theme.canvas, "#0B1015"]
    : ["#FBF9F4", theme.canvas, "#EEF3FA"];
}

/* ────────────────────────────────────────────────────────────────────
 * Metrics
 *
 * The question flow is one repeating shape — a stack of rounded rows under a
 * mascot — so its geometry lives in one place rather than being re-guessed per
 * step. `compact` is the small-phone variant (the same `isCompact` predicate
 * the flow already used), not a separate breakpoint system.
 * ──────────────────────────────────────────────────────────────────── */

export type OnboardingMetrics = ReturnType<typeof onboardingMetrics>;

export function onboardingMetrics(compact: boolean) {
  return {
    gutter: compact ? 18 : 22,
    maxWidth: 560,

    rowMinHeight: compact ? 62 : 68,
    rowRadius: 14,
    rowGap: compact ? 9 : 10,
    rowPadX: compact ? 15 : 17,
    /**
     * Selection is shown by border *colour*, never by border width: growing a
     * 1px border to 2px on press re-lays-out the row's content by a pixel, and
     * a list of rows visibly twitches as the selection moves down it.
     */
    rowBorderWidth: 1,

    leadingSize: compact ? 38 : 40,
    leadingRadius: 11,

    labelSize: compact ? 15.5 : 16.5,
    subLabelSize: compact ? 12 : 12.5,

    questionSize: compact ? 19 : 21,
    mascotSize: compact ? 86 : 98,
  };
}

export function useOnboardingMetrics(compact: boolean): OnboardingMetrics {
  return useMemo(() => onboardingMetrics(compact), [compact]);
}
