import { useMemo } from "react";
import { Platform } from "react-native";

import { PRIMARY_ACTION } from "../../../constants/primary-action";
import { useThemeColors } from "../../../hooks/useThemeColors";

/**
 * Onboarding surface tokens — theme aware.
 *
 * `onboarding-design.ts` is a *static* cream-paper palette: every value in it is
 * a light-mode literal, so importing it into a screen makes that screen light
 * regardless of the user's theme. That was fine when onboarding was a
 * deliberately separate editorial surface, but the question flow is now a
 * product surface that has to render correctly in dark mode too.
 *
 * So the question flow reads from here instead. One shape, two resolutions:
 *
 *   light   off-white canvas, white rows lifted off it, ink on paper
 *   dark    the app's own navy canvas, raised rows, paper on ink
 *
 * Both resolutions keep the same elevation relationship: `surface` is the raised
 * value and `canvas` recedes behind it. Light mode used to set both to
 * `#FFFFFF`, which flattened that relationship — a white row on a white page
 * only existed by way of its border and shadow, so inputs and bubbles read as
 * stray white boxes rather than as surfaces.
 *
 * ── Accent ────────────────────────────────────────────────────────────────
 *
 * The accent is the system action colour (`PRIMARY_ACTION.face`), so the
 * selected row, the progress ring and the Continue button are all literally the
 * same hue — onboarding stops looking like a different product.
 *
 * `accent` is the *graphic* value: fills, rings, borders, checkbox bodies. It
 * only ever needs 3:1.
 *
 * `accentInk` is the *type* value. `#FF6B4A` measures ~2.9:1 on white, which is
 * unreadable at 13px, so light mode darkens it to `#C63D22` (~5.1:1 on white).
 * Dark mode has the opposite problem solved for free — `#FF6B4A` on `#0F172A`
 * is ~6.3:1 — so it uses the graphic value directly. Do not collapse the two
 * tokens into one; there is no single orange that does both jobs.
 *
 * ── Opacity ───────────────────────────────────────────────────────────────
 *
 * Every fill that lands on a view carrying `onboardingLift` must be **opaque**.
 * `elevation` on Android composites the drop shadow *inside* the view's own
 * outline when its background has alpha, so a translucent selected/focused fill
 * renders as a flat grey slab across the whole card instead of a soft lift.
 * `accentWash` is therefore pre-blended against `canvas` rather than expressed
 * as `rgba(...)`. `surfaceSunken` may keep its alpha: nothing that uses it is
 * elevated, and staying translucent lets the chip sit correctly on both
 * `surface` and `accentWash`.
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

  ink: string;
  mutedInk: string;
  faintInk: string;

  border: string;
  borderStrong: string;

  accent: string;
  accentInk: string;
  accentWash: string;
  accentBorder: string;
  onAccent: string;

  /** Unfilled part of the progress ring. */
  ringTrack: string;

  shadowColor: string;
  shadowOpacity: number;
};

const LIGHT: OnboardingTheme = {
  isDark: false,

  canvas: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  surfaceSunken: "#EEF2F7",

  ink: "#0F172A",
  mutedInk: "#64748B",
  faintInk: "#94A3B8",

  border: "#E3E8EF",
  borderStrong: "#CBD5E1",

  accent: PRIMARY_ACTION.face,
  accentInk: "#C63D22",
  // `#FF6B4A` at 12% over `#FFFFFF`, flattened — see “Opacity” above.
  accentWash: "#FFEDE9",
  accentBorder: PRIMARY_ACTION.face,
  onAccent: "#FFFFFF",

  ringTrack: "#E7ECF2",

  shadowColor: "#0F172A",
  shadowOpacity: 0.07,
};

const DARK: OnboardingTheme = {
  isDark: true,

  canvas: "#0F172A",
  surface: "#182337",
  surfaceRaised: "#1F2C43",
  surfaceSunken: "rgba(255,255,255,0.07)",

  ink: "#F8FAFC",
  mutedInk: "#94A3B8",
  faintInk: "#64748B",

  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.20)",

  accent: PRIMARY_ACTION.face,
  accentInk: "#FF8A6E",
  // `#FF6B4A` at ~18% over `#0F172A`, flattened — see “Opacity” above.
  accentWash: "#3A2823",
  accentBorder: PRIMARY_ACTION.face,
  onAccent: "#FFFFFF",

  ringTrack: "rgba(255,255,255,0.12)",

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
    ? ["#131E33", theme.canvas, "#0C1322"]
    : ["#FAFBFD", theme.canvas, "#EDF1F7"];
}

/**
 * Card lift. Light mode gets a real (soft) shadow; dark mode gets almost none,
 * because a drop shadow on a dark canvas reads as smudge rather than elevation —
 * separation there comes from `surface` being lighter than `canvas`.
 */
export function onboardingLift(theme: OnboardingTheme) {
  if (theme.isDark) return {};
  if (Platform.OS === "web") {
    return { boxShadow: "0 1px 2px rgba(15,23,42,0.05), 0 6px 16px rgba(15,23,42,0.05)" } as const;
  }
  return {
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 10,
    elevation: 2,
  } as const;
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

    rowMinHeight: compact ? 60 : 66,
    rowRadius: 16,
    rowGap: compact ? 9 : 11,
    rowPadX: compact ? 13 : 15,
    /**
     * Selection is shown by border *colour*, never by border width: growing a
     * 1px border to 2px on press re-lays-out the row's content by a pixel, and
     * a list of rows visibly twitches as the selection moves down it.
     */
    rowBorderWidth: 2,

    leadingSize: compact ? 38 : 42,
    leadingRadius: 12,

    labelSize: compact ? 15.5 : 16.5,
    subLabelSize: compact ? 12 : 12.5,

    questionSize: compact ? 19 : 21,
    mascotSize: compact ? 76 : 92,
  };
}

export function useOnboardingMetrics(compact: boolean): OnboardingMetrics {
  return useMemo(() => onboardingMetrics(compact), [compact]);
}
