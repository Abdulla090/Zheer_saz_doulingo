import { describe, expect, it } from "@jest/globals";

import { getPathMetrics } from "../path-metrics";

describe("path node metrics", () => {
  it("uses smaller nodes and rows on compact web layouts", () => {
    expect(getPathMetrics("street", true)).toEqual({
      lessonButtonSize: 56,
      slotHeight: 78,
    });
    expect(getPathMetrics("normal", true)).toEqual({
      lessonButtonSize: 60,
      slotHeight: 82,
    });
    expect(getPathMetrics("kids", true)).toEqual({
      lessonButtonSize: 58,
      slotHeight: 80,
    });
  });

  it("uses slightly smaller native and desktop metrics", () => {
    expect(getPathMetrics("street")).toEqual({
      lessonButtonSize: 70,
      slotHeight: 98,
    });
    expect(getPathMetrics("normal")).toEqual({
      lessonButtonSize: 76,
      slotHeight: 104,
    });
    expect(getPathMetrics("kids")).toEqual({
      lessonButtonSize: 72,
      slotHeight: 100,
    });
  });
});
