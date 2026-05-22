/**
 * game-design.ts — PHINGO design tokens
 * Primary brand = PHINGO Blue (#1CB0F6) — like a dolphin in the ocean.
 * Correct flow = green (universal UX). Wrong = red. Action/progress = blue.
 */

export const G = {
  // ── PHINGO brand blues (primary action color) ──────────────────────
  blue:        "#1CB0F6",
  blueRim:     "#1490CC",
  blueBg:      "#DDF4FF",
  blueText:    "#0A5F8A",

  // ── Correct / success — green (universal UX, secondary) ───────────
  green:       "#58CC02",
  greenRim:    "#58A700",
  greenBg:     "#D7FFB8",
  greenText:   "#3C8400",

  // ── Wrong / error — red ────────────────────────────────────────────
  red:         "#FF4B4B",
  redRim:      "#EA2B2B",
  redBg:       "#FFE0E0",
  redText:     "#CC0000",

  // ── XP / reward — yellow ───────────────────────────────────────────
  yellow:      "#FFC800",
  yellowRim:   "#E6A700",
  yellowBg:    "#FFF9E6",
  yellowText:  "#A87800",

  // ── Surfaces ───────────────────────────────────────────────────────
  bg:          "#FFFFFF",
  bgSoft:      "#F7F7F7",
  border:      "#E5E5E5",
  borderDark:  "#DADADA",

  // ── Option chip default ────────────────────────────────────────────
  optBg:       "#FFFFFF",
  optBorder:   "#E5E5E5",
  optRim:      "#E5E5E5",

  // ── Typography ─────────────────────────────────────────────────────
  textDark:    "#3C3C3C",
  textMid:     "#777777",
  textLight:   "#AFAFAF",

  // ── Radius scale ───────────────────────────────────────────────────
  rSm:  12,
  rMd:  16,
  rLg:  20,
  rXl:  24,

  // ── Layout ─────────────────────────────────────────────────────────
  px:    16,

  // ── 3D depth ───────────────────────────────────────────────────────
  depth: 4,
} as const;
