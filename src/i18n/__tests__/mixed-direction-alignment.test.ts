import { describe, expect, it } from "@jest/globals";

import {
  getLanguageDirection,
  resolvePlatformAlignment,
  resolvePlatformTextAlign,
  resolveTextAlign,
  type Direction,
} from "../direction";

/**
 * Reproduces the alignment pipeline AppText runs, so the mixed-direction case
 * is pinned end to end rather than only at the resolver.
 *
 * A Kurdish/Arabic UI puts every screen in an RTL *layout* regardless of the
 * language of the text inside it. English lesson content therefore has LTR
 * content direction inside an RTL layout — the case that regressed, with
 * English answer tiles rendering right-aligned on physical Android devices.
 *
 * The layout direction is the *ambient* one, not a global flag:
 *
 *   • `applyUiLanguageDirection` calls `forceRTL` but never reloads, so
 *     `I18nManager.isRTL` lags the UI language by a cold start. The direction
 *     actually in effect comes from the root view's `direction` style.
 *   • Screens override that locally — an English answer tile pins itself to
 *     `direction: "ltr"` inside a Kurdish lesson, and text inside it must not be
 *     compensated for the outer RTL layout.
 *
 * `layoutRtl` below is therefore the direction of the nearest boundary, which is
 * what `useLayoutDirection` reports.
 */
function resolveAppTextAlign(opts: {
  platform: string;
  contentLanguage: string;
  layoutRtl: boolean;
  align?: "start" | "end" | "center";
}) {
  const { platform, contentLanguage, layoutRtl, align = "start" } = opts;
  const contentDirection = getLanguageDirection(contentLanguage);
  const layoutDirection: Direction = layoutRtl ? "rtl" : "ltr";
  const effective = resolvePlatformAlignment(platform, align, undefined);
  const physical = effective
    ? resolveTextAlign(contentDirection, effective)
    : resolveTextAlign(contentDirection, "start");
  return resolvePlatformTextAlign(platform, contentDirection, physical, layoutDirection);
}

describe("lesson text alignment in a Kurdish (RTL) UI", () => {
  it.each(["android", "ios"])(
    "renders English answer options on the left edge on %s",
    (platform) => {
      // Pre-encoded as "right" so the platform's RTL swap lands it on the left.
      expect(
        resolveAppTextAlign({ platform, contentLanguage: "en", layoutRtl: true }),
      ).toBe("right");
    },
  );

  it.each(["android", "ios"])("keeps Kurdish content on the right edge on %s", (platform) => {
    expect(
      resolveAppTextAlign({ platform, contentLanguage: "ckb", layoutRtl: true }),
    ).toBe("left");
  });

  it("does not disturb an English UI", () => {
    expect(
      resolveAppTextAlign({ platform: "android", contentLanguage: "en", layoutRtl: false }),
    ).toBe("left");
    expect(
      resolveAppTextAlign({ platform: "android", contentLanguage: "ckb", layoutRtl: false }),
    ).toBe("right");
  });

  it("leaves web to CSS direction", () => {
    expect(
      resolveAppTextAlign({ platform: "web", contentLanguage: "en", layoutRtl: true }),
    ).toBe("left");
  });

  it("keeps centered content centered in every combination", () => {
    for (const layoutRtl of [true, false]) {
      for (const contentLanguage of ["en", "ckb"]) {
        expect(
          resolveAppTextAlign({
            platform: "android",
            contentLanguage,
            layoutRtl,
            align: "center",
          }),
        ).toBe("center");
      }
    }
  });

  /*
   * An answer tile pins itself to `direction: "ltr"` inside a Kurdish lesson, so
   * its subtree is an LTR layout even though the screen around it is RTL. There
   * is no swap to undo inside that boundary — compensating anyway is what put
   * English tiles on the wrong edge while unwrapped text on the same screen was
   * fine.
   */
  it.each(["android", "ios"])(
    "does not compensate inside an LTR boundary on %s",
    (platform) => {
      expect(
        resolveAppTextAlign({ platform, contentLanguage: "en", layoutRtl: false }),
      ).toBe("left");
    },
  );

  /*
   * Kurdish content inside that same LTR boundary — a Kurdish hint rendered in
   * an otherwise-English tile — still has to reach its own right edge.
   */
  it.each(["android", "ios"])(
    "keeps Kurdish content right-aligned inside an LTR boundary on %s",
    (platform) => {
      expect(
        resolveAppTextAlign({ platform, contentLanguage: "ckb", layoutRtl: false }),
      ).toBe("right");
    },
  );
});
