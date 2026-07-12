import { describe, expect, it, test } from "@jest/globals";

import {
  getLanguageDirection,
  normalizeLanguageCode,
  resolveTextAlign,
  type Direction,
  type LogicalAlignment,
  type PhysicalTextAlign,
} from "../direction";

describe("language direction", () => {
  test.each([
    ["en", "ltr"],
    ["en-US", "ltr"],
    ["ar", "rtl"],
    ["ar-IQ", "rtl"],
    ["ckb", "rtl"],
    ["ckb-IQ", "rtl"],
    ["ku-Arab", "rtl"],
    ["ku-Latn", "ltr"],
    ["es", "ltr"],
    ["ru", "ltr"],
    ["unknown", "ltr"],
  ])("resolves %s as %s", (languageCode, expected) => {
    expect(getLanguageDirection(languageCode)).toBe(expected);
  });

  it("supports an explicit fallback for unknown languages", () => {
    expect(getLanguageDirection("unknown", "rtl")).toBe("rtl");
    expect(getLanguageDirection(undefined, "rtl")).toBe("rtl");
  });

  it("normalizes locale tags without losing script metadata", () => {
    expect(normalizeLanguageCode(" KU_latn_iq ")).toBe("ku-Latn-IQ");
  });
});

describe("logical alignment", () => {
  const cases: [Direction, LogicalAlignment, PhysicalTextAlign][] = [
    ["ltr", "start", "left"],
    ["rtl", "start", "right"],
    ["ltr", "end", "right"],
    ["rtl", "end", "left"],
    ["ltr", "center", "center"],
    ["rtl", "center", "center"],
  ];

  test.each(cases)("maps %s %s to %s", (direction, alignment, expected) => {
    expect(resolveTextAlign(direction, alignment)).toBe(expected);
  });
});
