import { useMemo } from "react";
import { Platform } from "react-native";

import { PRIMARY_ACTION } from "../../constants/primary-action";
import { useThemeColors } from "../../hooks/useThemeColors";

/**
 * Practice-surface tokens — the shared identity for every screen behind the
 * Games grid: Reading Practice, Podcasts, Slang, Role Play and AI Teacher.
 *
 * The live AI tutor (`/voice-tutor`) is deliberately NOT part of this system.
 * It is the featured card above the grid, it is a different interaction model
 * (a continuous voice session, not a task with a setup → run → result arc), and
 * it keeps its own look on purpose.
 *
 * ── Why this file exists ──────────────────────────────────────────────────
 *
 * The five practice screens grew independently and ended up with five
 * unrelated identities: podcast was `#2563EB` blue, slang was `#FF6B00`
 * orange, role play shipped four per-scenario accents, reading practice
 * borrowed the home dashboard's navy, and AI teacher used the system coral.
 * Tapping a card on the grid therefore produced a colour break on every single
 * navigation. Radii ranged over 14/16/18/20/22/26/28/30, there were four
 * different back buttons and three separately-coded segmented controls.
 *
 * One shape, two resolutions — same contract as `onboarding-theme.ts`:
 *
 *   light   warm ivory canvas, quiet graphite rows, ink on paper
 *   dark    the app's navy canvas, raised cards, paper on ink
 *
 * ── Accent: one action colour, everywhere ─────────────────────────────────
 *
 * `accent` is the system action colour (`PRIMARY_ACTION.face`) — the same hue
 * as the Continue button in onboarding and the login CTA. Every interactive,
 * committing, or selected thing across all five screens is this colour and
 * nothing else. That is the single most valuable property of the system:
 * "coral means you can act on it" becomes learnable once and holds everywhere,
 * instead of being re-taught per screen.
 *
 * `accent` is the *graphic* value: fills, rings, borders, progress. 3:1.
 * `accentInk` is the *type* value. `#FF6B4A` measures ~2.9:1 on white, which is
 * unreadable at 13px, so light mode darkens it to `#C63D22` (~5.1:1 on white).
 * Dark mode has the opposite problem solved for free — `#FF6B4A` on `#0F172A`
 * is ~6.3:1. Do not collapse the two tokens; no single orange does both jobs.
 *
 * ── Semantic colours are reserved ────────────────────────────────────────
 *
 * `success` / `danger` / `warning` mean correct / wrong / caution and are never
 * used decoratively. Role Play previously used `#10B981` green and `#EF4444`
 * red as *scenario identity* colours on a screen that also scores your speech —
 * so "green" meant both "the market scenario" and "you got it right". Identity
 * hues below are picked to stay clear of all three.
 */
export type GamesTheme = {
  isDark: boolean;

  /** Page background. */
  canvas: string;
  /** Resting card / input / row. */
  surface: string;
  /** Anything that must read above `surface` — round controls, nested rows. */
  surfaceRaised: string;
  /** Neutral chip behind a glyph; also the unselected segmented-control track. */
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

  success: string;
  successInk: string;
  successWash: string;

  danger: string;
  dangerInk: string;
  dangerWash: string;

  warning: string;
  warningInk: string;
  warningWash: string;

  /** Unfilled part of any progress bar or ring. */
  track: string;

  /** Translucent fill for the sticky glass header, under the blur. */
  headerScrim: string;
  headerBorder: string;

  shadowColor: string;
  shadowOpacity: number;
};

const LIGHT: GamesTheme = {
  isDark: false,

  canvas: "#F7F5F0",
  surface: "#EFF1F4",
  surfaceRaised: "#FCFBF8",
  surfaceSunken: "#E7EAEE",

  ink: "#0F172A",
  mutedInk: "#64748B",
  faintInk: "#94A3B8",

  border: "#DCE1E7",
  borderStrong: "#C7CFD9",

  accent: PRIMARY_ACTION.face,
  accentInk: "#C63D22",
  accentWash: "rgba(255, 107, 74, 0.10)",
  accentBorder: PRIMARY_ACTION.face,
  onAccent: "#FFFFFF",

  success: "#10B981",
  successInk: "#047857",
  successWash: "rgba(16, 185, 129, 0.10)",

  danger: "#EF4444",
  dangerInk: "#B91C1C",
  dangerWash: "rgba(239, 68, 68, 0.10)",

  warning: "#F59E0B",
  warningInk: "#B45309",
  warningWash: "rgba(245, 158, 11, 0.12)",

  track: "#DDE2E8",

  headerScrim: "rgba(247, 245, 240, 0.82)",
  headerBorder: "rgba(148, 163, 184, 0.28)",

  shadowColor: "#0F172A",
  shadowOpacity: 0.07,
};

const DARK: GamesTheme = {
  isDark: true,

  canvas: "#10161C",
  surface: "#161D24",
  surfaceRaised: "#1B232C",
  surfaceSunken: "rgba(255,255,255,0.07)",

  ink: "#F8FAFC",
  mutedInk: "#94A3B8",
  faintInk: "#64748B",

  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.20)",

  accent: PRIMARY_ACTION.face,
  accentInk: "#FF8A6E",
  accentWash: "rgba(255, 107, 74, 0.16)",
  accentBorder: PRIMARY_ACTION.face,
  onAccent: "#FFFFFF",

  success: "#10B981",
  successInk: "#34D399",
  successWash: "rgba(16, 185, 129, 0.16)",

  danger: "#EF4444",
  dangerInk: "#F87171",
  dangerWash: "rgba(239, 68, 68, 0.16)",

  warning: "#F59E0B",
  warningInk: "#FBBF24",
  warningWash: "rgba(245, 158, 11, 0.18)",

  track: "rgba(255,255,255,0.12)",

  headerScrim: "rgba(16, 22, 28, 0.78)",
  headerBorder: "rgba(255, 255, 255, 0.10)",

  shadowColor: "#000000",
  shadowOpacity: 0.4,
};

export function useGamesTheme(): GamesTheme {
  const { isDark } = useThemeColors();
  return isDark ? DARK : LIGHT;
}

/* ────────────────────────────────────────────────────────────────────
 * Per-mode identity hue
 *
 * Each practice mode owns exactly one hue. It appears in exactly two places:
 * the icon chip on the screen's intro card, and the eyebrow label above the
 * title. It is *never* applied to anything tappable — that is `accent`'s job.
 *
 * Why keep any per-mode colour at all, when the brief was "same identity"?
 * Because a hue used only for identity is wayfinding, not decoration. The grid
 * card you tapped and the screen you land on share a colour, so the transition
 * reads as "this card opened" rather than "a new app appeared" — colour as a
 * shared element. Strip it entirely and the five screens become genuinely
 * indistinguishable at a glance, which costs orientation and buys nothing,
 * since consistency is already carried by layout, type, radii and the action
 * colour.
 *
 * The split rule is the same as `accent`:
 *   `hue`       graphic only — chip wash, decorative rules. 3:1.
 *   `inkLight`  the hue darkened until it clears 4.5:1 on white.
 *   `inkDark`   the hue lightened until it clears 4.5:1 on `#0F172A`.
 *
 * The raw hues are the tints the Games grid already used, so the grid does not
 * have to change colour — it just stops being the only place they are defined.
 */
export type GameModeKey =
  | "reading-practice"
  | "podcast"
  | "slang"
  | "roleplay"
  | "ai-teacher";

export type GameModeHue = {
  /** Graphic value. Chip wash, decorative rules. Never text, never tappable. */
  hue: string;
  /** 4.5:1 on the light canvas. */
  inkLight: string;
  /** 4.5:1 on the dark canvas. */
  inkDark: string;
};

export const GAME_MODE_HUES: Record<GameModeKey, GameModeHue> = {
  /** Violet — reading is the "study" mode; violet reads focused, not urgent. */
  "reading-practice": { hue: "#7C3AED", inkLight: "#6D28D9", inkDark: "#A78BFA" },
  /** Amber — broadcast/on-air warmth. Ink is darkened hard; raw amber is ~2.1:1. */
  podcast: { hue: "#F59E0B", inkLight: "#B45309", inkDark: "#FBBF24" },
  /** Sky — conversational, informal, the most "everyday" of the five. */
  slang: { hue: "#0EA5E9", inkLight: "#0369A1", inkDark: "#38BDF8" },
  /** Pink — performance and play. Kept well clear of `danger` red. */
  roleplay: { hue: "#EC4899", inkLight: "#BE185D", inkDark: "#F472B6" },
  /** Teal — instruction. Distinct from `success` green at chip size. */
  "ai-teacher": { hue: "#14B8A6", inkLight: "#0F766E", inkDark: "#2DD4BF" },
};

export type ResolvedGameHue = {
  hue: string;
  /** Contrast-safe value for glyphs and the eyebrow label. */
  ink: string;
  /** Chip background. */
  wash: string;
  border: string;
};

export function resolveGameHue(key: GameModeKey, isDark: boolean): ResolvedGameHue {
  const entry = GAME_MODE_HUES[key];
  return {
    hue: entry.hue,
    ink: isDark ? entry.inkDark : entry.inkLight,
    wash: withAlpha(entry.hue, isDark ? 0.18 : 0.1),
    border: withAlpha(entry.hue, isDark ? 0.32 : 0.22),
  };
}

export function useGameHue(key: GameModeKey): ResolvedGameHue {
  const { isDark } = useThemeColors();
  return useMemo(() => resolveGameHue(key, isDark), [key, isDark]);
}

/** `#RRGGBB` + alpha → `rgba(...)`. Passes through values that are already rgba. */
export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("rgb")) return color;
  let c = color.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

/* ────────────────────────────────────────────────────────────────────
 * Elevation
 *
 * Light mode gets a real (soft) shadow. Dark mode gets none: a drop shadow on
 * a dark canvas reads as smudge rather than lift, so separation there comes
 * from `surface` being lighter than `canvas`. Same call as `onboardingLift`.
 * ──────────────────────────────────────────────────────────────────── */
export function gamesLift(theme: GamesTheme, level: "card" | "raised" = "card") {
  if (theme.isDark) return {};
  const raised = level === "raised";
  if (Platform.OS === "web") {
    return {
      boxShadow: raised
        ? "0 2px 4px rgba(15,23,42,0.06), 0 10px 28px rgba(15,23,42,0.08)"
        : "0 1px 2px rgba(15,23,42,0.05), 0 6px 16px rgba(15,23,42,0.05)",
    } as const;
  }
  return {
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: raised ? 8 : 4 },
    shadowOpacity: raised ? theme.shadowOpacity + 0.03 : theme.shadowOpacity,
    shadowRadius: raised ? 18 : 10,
    elevation: raised ? 4 : 2,
  } as const;
}

/* ────────────────────────────────────────────────────────────────────
 * Metrics
 *
 * One geometry for all five screens. Previously the radius vocabulary spanned
 * eight values across the set, which is what made them read as different
 * products even where the layouts matched.
 *
 * Radii follow a nesting rule rather than being picked per component: a child
 * sitting inside a parent uses the next step down, so concentric corners stay
 * visually parallel instead of crossing.
 *
 * `compact` is the small-phone variant; `wide` is the desktop-web breakpoint
 * (`isDesktopWebWidth`).
 * ──────────────────────────────────────────────────────────────────── */
export type GamesMetrics = ReturnType<typeof gamesMetrics>;

export function gamesMetrics(compact: boolean, wide = false) {
  return {
    gutter: compact ? 16 : 20,
    /** Practice content is a single reading column; it must not sprawl. */
    maxWidth: 720,
    sectionGap: compact ? 16 : 20,

    /** Radius ladder — outermost to innermost. */
    radiusCard: wide ? 22 : 20,
    radiusControl: 16,
    radiusChip: 12,
    radiusPill: 999,

    /**
     * Every tappable thing clears 44pt. Fitts's law is not negotiable on a
     * touch surface, and the old back buttons ranged from 36 to 44.
     */
    tapMin: 44,
    controlHeight: 52,
    rowMinHeight: compact ? 60 : 66,
    segmentHeight: 44,

    headerHeight: 56,
    iconChipSize: compact ? 44 : 48,
    iconGlyph: compact ? 21 : 23,

    /**
     * Selection is shown by border *colour*, never by border width: growing a
     * 1px border to 2px re-lays-out the row by a pixel and a list visibly
     * twitches as the selection moves down it.
     */
    selectBorderWidth: 2,
  };
}

export function useGamesMetrics(compact: boolean, wide = false): GamesMetrics {
  return useMemo(() => gamesMetrics(compact, wide), [compact, wide]);
}

/* ────────────────────────────────────────────────────────────────────
 * Type scale
 *
 * Five steps, geometric-ish, each with a job. The old screens used header
 * titles at 17, 20, 22 and 26 with no rule for which applied where.
 * ──────────────────────────────────────────────────────────────────── */
export const GamesType = {
  /** Result numbers and score displays only. */
  display: {
    fontSize: 34,
    fontWeight: "800" as const,
    letterSpacing: -0.9,
    fontFamily: "Rabar_044",
  },
  /** The one-per-screen page title on the intro card. */
  title: {
    fontSize: 24,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
    fontFamily: "Rabar_044",
  },
  /** Sticky header title. Smaller than `title` — chrome must not outrank content. */
  header: {
    fontSize: 17,
    fontWeight: "800" as const,
    letterSpacing: -0.2,
    fontFamily: "Rabar_044",
  },
  /** Card headings and section titles. */
  section: {
    fontSize: 17,
    fontWeight: "800" as const,
    letterSpacing: -0.3,
    fontFamily: "Rabar_044",
  },
  body: {
    fontSize: 15,
    fontWeight: "500" as const,
    letterSpacing: -0.15,
    lineHeight: 21,
    fontFamily: "Rabar_044",
  },
  caption: {
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
    fontFamily: "Rabar_044",
  },
  /**
   * The mode label above a title. Uppercase + wide tracking makes it read as a
   * category marker rather than as content, which is what lets it carry the
   * per-mode hue without competing with the coral action colour.
   */
  eyebrow: {
    fontSize: 11,
    fontWeight: "800" as const,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
    fontFamily: "Rabar_044",
  },
} as const;

/**
 * Motion. Short, spring-based, and shared so that a press on one screen feels
 * identical to a press on another. Under the Doherty threshold (400ms) for
 * every transition a user initiates.
 */
export const GamesMotion = {
  press: {
    damping: 28,
    stiffness: 420,
    mass: 0.42,
    overshootClamping: true,
  },
  settle: {
    damping: 28,
    stiffness: 280,
    mass: 0.55,
    overshootClamping: true,
  },
  colorMs: 180,
  enterMs: 280,
  /** Stagger between siblings entering. Keeps a list arrival readable. */
  staggerMs: 36,
} as const;
