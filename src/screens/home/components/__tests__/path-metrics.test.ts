import { describe, expect, it } from "@jest/globals";

import { getPathMetrics } from "../path-metrics";

describe("path node metrics", () => {
  it("uses smaller nodes and rows on compact web layouts", () => {
    expect(getPathMetrics("street", true)).toEqual({
      lessonButtonSize: 48,
      slotHeight: 74,
    });
    expect(getPathMetrics("normal", true)).toEqual({
      lessonButtonSize: 64,
      slotHeight: 62,
    });
    expect(getPathMetrics("kids", true)).toEqual({
      lessonButtonSize: 50,
      slotHeight: 76,
    });
  });

  it("uses slightly smaller native and desktop metrics", () => {
    expect(getPathMetrics("street")).toEqual({
      lessonButtonSize: 55,
      slotHeight: 88,
    });
    // The reference path's own numbers. The slot is shorter than the node
    // because the node's SVG viewBox is mostly padding — the drawn token is
    // about 69x60 of those 76px, so centring it still leaves a row gap.
    expect(getPathMetrics("normal")).toEqual({
      lessonButtonSize: 76,
      slotHeight: 74,
    });
    expect(getPathMetrics("kids")).toEqual({
      lessonButtonSize: 57,
      slotHeight: 90,
    });
  });

  it("keeps the normal path's node taller than its slot", () => {
    // Guards the centring in `ListItem`: if the slot ever grows past the node,
    // the rows would drift apart from the reference rhythm.
    for (const compactWeb of [false, true]) {
      const { lessonButtonSize, slotHeight } = getPathMetrics(
        "normal",
        compactWeb,
      );
      expect(slotHeight).toBeLessThan(lessonButtonSize);
    }
  });
});
