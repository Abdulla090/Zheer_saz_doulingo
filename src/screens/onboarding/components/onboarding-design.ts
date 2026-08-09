import { Platform } from "react-native";

import { PRIMARY_ACTION } from "../../../constants/primary-action";

/**
 * Onboarding design system.
 *
 * The onboarding is an editorial surface — warm paper, generous type, a single
 * accent. It is intentionally *not* the in-app look, but it must use the same
 * accent hue as the rest of the product or the first-run experience reads as a
 * different app.
 *
 * ── Colour ────────────────────────────────────────────────────────────────
 *
 * The exact login-button orange is the onboarding action color. Keeping one
 * brand action hue lets users learn the interaction language before sign-in.
 *
 * Theme-aware components should prefer `useOnboardingTheme`; this object stays
 * as the light-mode fallback for legacy illustration code.
 */

const CANVAS = "#F7F5F0";

export const ONBOARDING_DESIGN = {
  canvas: CANVAS,
  paper: "#EFF1F4",
  paperRaised: "#FCFBF8",

  lavender: "#FFF0EC",
  lavenderDeep: "#FF9B84",

  ink: "#132238",
  mutedInk: "#5E6B7E",

  accent: PRIMARY_ACTION.face,
  accentPressed: PRIMARY_ACTION.rim,
  accentInk: "#B93820",
  accentWash: "#FFF0EC",

  /** Legacy aliases — older call sites still import these. */
  orange: PRIMARY_ACTION.face,
  orangePressed: PRIMARY_ACTION.rim,

  hairline: "rgba(15, 23, 42, 0.12)",
  paperShadow: "rgba(15, 23, 42, 0.14)",

  displayFont: Platform.select({
    ios: "DINNextRoundedBold",
    android: "DINNextRoundedBold",
    web: "DINNextRoundedBold",
    default: "DINNextRoundedBold",
  }),
} as const;

export const ONBOARDING_PAPER_SHADOW = Platform.select({
  web: {
    boxShadow:
      "0 18px 42px rgba(71, 55, 39, 0.14), 0 3px 8px rgba(71, 55, 39, 0.10), inset 0 1px 0 rgba(255,255,255,0.90)",
  },
  default: {
    shadowColor: "#473727",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
});

/* ────────────────────────────────────────────────────────────────────
 * Breakpoints
 *
 * Named once so every onboarding component splits the same way. Previously
 * each file re-derived its own `isCompactPhone` from raw pixel comparisons and
 * they had drifted apart.
 * ──────────────────────────────────────────────────────────────────── */

export type OnboardingSize = "xs" | "sm" | "md" | "lg" | "xl";

export function resolveOnboardingSize(width: number, height: number): OnboardingSize {
  if (width >= 760) return "xl";
  if (height < 680 || width < 360) return "xs";
  if (height < 760) return "sm";
  if (height >= 820) return "lg";
  return "md";
}

/* ────────────────────────────────────────────────────────────────────
 * Type scale
 *
 * A modular scale rather than per-breakpoint guesswork. Each step is the one
 * below it times ~1.28 (a major third, slightly tightened), so the ratio between
 * display and body stays constant as the screen shrinks and the page keeps its
 * proportions instead of just getting smaller in places.
 *
 * Line heights are ratios of their own size, not fixed pixels: display type
 * wants ~1.06 (tight, editorial) and body wants ~1.45 (readable).
 *
 * Optical tracking: large type needs negative tracking to avoid looking loose,
 * small type needs slightly positive. The previous -1.8 at every size made
 * 33px titles collide.
 * ──────────────────────────────────────────────────────────────────── */

type TypeStep = {
  size: number;
  lineHeight: number;
  letterSpacing: number;
};

function display(size: number): TypeStep {
  return {
    size,
    lineHeight: Math.round(size * 1.07),
    // Tracking scales with size: -0.022em, so it stays optically even.
    letterSpacing: Math.round(size * -0.022 * 10) / 10,
  };
}

function body(size: number): TypeStep {
  return {
    size,
    lineHeight: Math.round(size * 1.45),
    letterSpacing: 0,
  };
}

function label(size: number): TypeStep {
  return {
    size,
    lineHeight: Math.round(size * 1.3),
    letterSpacing: 0.6,
  };
}

export const ONBOARDING_TYPE: Record<
  OnboardingSize,
  { display: TypeStep; displayRtl: TypeStep; body: TypeStep; label: TypeStep }
> = {
  xs: { display: display(29), displayRtl: display(27), body: body(15), label: label(12) },
  sm: { display: display(32), displayRtl: display(30), body: body(16), label: label(13) },
  md: { display: display(35), displayRtl: display(33), body: body(16), label: label(14) },
  lg: { display: display(38), displayRtl: display(35), body: body(17), label: label(15) },
  xl: { display: display(46), displayRtl: display(42), body: body(18), label: label(16) },
};

/**
 * RTL display type is set a step smaller than Latin.
 *
 * Arabic and Kurdish glyphs carry taller ascenders and deeper descenders than
 * Latin at the same point size, so matching the numbers makes the Kurdish title
 * overflow where the English one fits. Their line heights are also looser —
 * `displayRtl` keeps the 1.07 ratio but the scale below compensates.
 */

/* ────────────────────────────────────────────────────────────────────
 * Spacing
 *
 * A 4pt base grid. Every gap and pad in onboarding resolves to one of these,
 * so vertical rhythm stays consistent between slides.
 * ──────────────────────────────────────────────────────────────────── */

export const ONBOARDING_SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

/** Horizontal page gutter per breakpoint. */
export const ONBOARDING_GUTTER: Record<OnboardingSize, number> = {
  xs: 20,
  sm: 24,
  md: 28,
  lg: 28,
  xl: 60,
};

/** Hero artwork height per breakpoint. */
export const ONBOARDING_ART_HEIGHT: Record<OnboardingSize, number> = {
  xs: 190,
  sm: 225,
  md: 270,
  lg: 310,
  xl: 420,
};
