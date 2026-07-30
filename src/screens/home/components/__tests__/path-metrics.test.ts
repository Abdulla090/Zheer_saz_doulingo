import { describe, expect, it } from "@jest/globals";

import { getPathMetrics } from "../path-metrics";

describe("path node metrics", () => {
  it("uses smaller nodes and rows on compact web layouts", () => {
    expect(getPathMetrics("street", true)).toEqual({
      lessonButtonSize: 46,
      slotHeight: 74,
    });
    expect(getPathMetrics("normal", true)).toEqual({
      lessonButtonSize: 50,
      slotHeight: 78,
    });
    expect(getPathMetrics("kids", true)).toEqual({
      lessonButtonSize: 48,
      slotHeight: 76,
    });
  });

  it("uses slightly smaller native and desktop metrics", () => {
    expect(getPathMetrics("street")).toEqual({
      lessonButtonSize: 54,
      slotHeight: 88,
    });
    expect(getPathMetrics("normal")).toEqual({
      lessonButtonSize: 58,
      slotHeight: 92,
    });
    expect(getPathMetrics("kids")).toEqual({
      lessonButtonSize: 56,
      slotHeight: 90,
    });
  });
});
