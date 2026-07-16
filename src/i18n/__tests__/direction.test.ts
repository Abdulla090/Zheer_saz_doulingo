import { describe, expect, it, test } from "@jest/globals";

import {
  getLanguageDirection,
  normalizeLanguageCode,
  resolvePlatformAlignment,
  resolvePlatformTextAlign,
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

describe("platform alignment", () => {
  it("preserves centered lesson cards on web", () => {
    expect(resolvePlatformAlignment("web", "center", "start")).toBe("center");
  });

  it.each(["android", "ios"])(
    "uses the explicit language edge on %s",
    (platform) => {
      expect(resolvePlatformAlignment(platform, "center", "start")).toBe("start");
    },
  );

  it.each(["android", "ios"])(
    "encodes the Kurdish right edge for React Native on %s",
    (platform) => {
      expect(resolvePlatformTextAlign(platform, "rtl", "right")).toBe("left");
      expect(resolvePlatformTextAlign(platform, "rtl", "left")).toBe("right");
      expect(resolvePlatformTextAlign(platform, "rtl", "center")).toBe("center");
    },
  );

  it("keeps web RTL and every English physical alignment unchanged", () => {
    expect(resolvePlatformTextAlign("web", "rtl", "right")).toBe("right");
    expect(resolvePlatformTextAlign("android", "ltr", "left")).toBe("left");
    expect(resolvePlatformTextAlign("ios", "ltr", "right")).toBe("right");
  });
});
