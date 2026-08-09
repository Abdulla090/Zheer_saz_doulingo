import { describe, expect, it, test } from "@jest/globals";

import {
  getLanguageDirection,
  getTextDirection,
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

describe("streamed text direction", () => {
  it("uses the first strong word instead of the surrounding UI language", () => {
    expect(getTextDirection("Hi! من باشم.")).toBe("ltr");
    expect(getTextDirection("سڵاو! I am ready.")).toBe("rtl");
    expect(getTextDirection("مرحباً! I am ready.")).toBe("rtl");
  });

  it("skips punctuation, emoji, and digits before the first word", () => {
    expect(getTextDirection('✨ 2... "Welcome back"')).toBe("ltr");
    expect(getTextDirection("— ٢... بەخێربێیتەوە")).toBe("rtl");
  });

  it("uses the requested fallback when no strong script exists", () => {
    expect(getTextDirection("... 123", "rtl")).toBe("rtl");
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

  /*
   * The regression behind English lesson text drifting right on a physical
   * phone: the app runs under forceRTL for a Kurdish UI, so the platform swaps
   * explicit left/right even for LTR *content*. The swap follows the layout,
   * not the glyphs.
   */
  it.each(["android", "ios"])(
    "compensates the swap for LTR content inside an RTL layout on %s",
    (platform) => {
      expect(resolvePlatformTextAlign(platform, "ltr", "left", "rtl")).toBe("right");
      expect(resolvePlatformTextAlign(platform, "ltr", "right", "rtl")).toBe("left");
      expect(resolvePlatformTextAlign(platform, "ltr", "center", "rtl")).toBe("center");
    },
  );

  it("leaves RTL content in an LTR layout untouched", () => {
    expect(resolvePlatformTextAlign("android", "rtl", "right", "ltr")).toBe("right");
    expect(resolvePlatformTextAlign("ios", "rtl", "left", "ltr")).toBe("left");
  });

  it("defaults the layout direction to the content direction", () => {
    expect(resolvePlatformTextAlign("android", "rtl", "right")).toBe(
      resolvePlatformTextAlign("android", "rtl", "right", "rtl"),
    );
  });

  it("keeps web unswapped regardless of layout direction", () => {
    expect(resolvePlatformTextAlign("web", "ltr", "left", "rtl")).toBe("left");
  });
});
