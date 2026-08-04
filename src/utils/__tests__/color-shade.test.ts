import { describe, expect, it } from "@jest/globals";

import { shadeHex } from "../color-shade";
import { SVG_BUTTON_COLOR_SETS } from "../../constants/button-theme-colors";
import { NORMAL_SECTION_THEME_CYCLE } from "../../data/normal-english";

describe("shadeHex", () => {
  it("darkens by scaling channels", () => {
    expect(shadeHex("#FFFFFF", 0.5)).toBe("#808080");
    expect(shadeHex("#FF9600", 0.5)).toBe("#804b00");
  });

  it("is a no-op at factor 1", () => {
    expect(shadeHex("#58CC02", 1)).toBe("#58cc02");
  });

  it("expands 3-digit hex", () => {
    expect(shadeHex("#FFF", 1)).toBe("#ffffff");
  });

  it("clamps instead of overflowing when lightening", () => {
    expect(shadeHex("#FFFFFF", 4)).toBe("#ffffff");
  });

  it("never emits a short or malformed value", () => {
    // #010101 * 0.1 rounds to #000000 — the padStart is what keeps this 6 digits.
    expect(shadeHex("#010101", 0.1)).toBe("#000000");
    expect(shadeHex("#010101", 0.1)).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("passes through values it cannot parse", () => {
    for (const input of ["rgba(0,0,0,0.5)", "transparent", "", "#12345"]) {
      expect(shadeHex(input, 0.5)).toBe(input);
    }
  });
});

/**
 * The unit banner derives its colour from the same table the nodes read, so a
 * theme in the cycle without a matching colour set would silently fall back to
 * orange and the banner would stop matching its unit.
 */
describe("normal path unit themes", () => {
  it("opens on orange, then purple", () => {
    expect(NORMAL_SECTION_THEME_CYCLE[0]).toBe("orange");
    expect(NORMAL_SECTION_THEME_CYCLE[1]).toBe("purple");
  });

  it("every theme in the cycle has a node colour set", () => {
    for (const theme of NORMAL_SECTION_THEME_CYCLE) {
      expect(SVG_BUTTON_COLOR_SETS).toHaveProperty(theme);
    }
  });

  it("has no adjacent duplicates, including at the wrap point", () => {
    const cycle = NORMAL_SECTION_THEME_CYCLE;
    for (let i = 0; i < cycle.length; i++) {
      expect(cycle[i]).not.toBe(cycle[(i + 1) % cycle.length]);
    }
  });

  it("does not use the locked/greyed variant as a unit colour", () => {
    expect(NORMAL_SECTION_THEME_CYCLE).not.toContain("gray");
  });
});
