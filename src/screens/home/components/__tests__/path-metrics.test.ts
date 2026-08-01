import { describe, expect, it } from "@jest/globals";

import { getPathMetrics } from "../path-metrics";

describe("path node metrics", () => {
  it("uses smaller nodes and rows on compact web layouts", () => {
    expect(getPathMetrics("street", true)).toEqual({
      lessonButtonSize: 50,
      slotHeight: 78,
    });
    expect(getPathMetrics("normal", true)).toEqual({
      lessonButtonSize: 54,
      slotHeight: 82,
    });
    expect(getPathMetrics("kids", true)).toEqual({
      lessonButtonSize: 52,
      slotHeight: 80,
    });
  });

  it("uses slightly smaller native and desktop metrics", () => {
    expect(getPathMetrics("street")).toEqual({
      lessonButtonSize: 58,
      slotHeight: 92,
    });
    expect(getPathMetrics("normal")).toEqual({
      lessonButtonSize: 62,
      slotHeight: 96,
    });
    expect(getPathMetrics("kids")).toEqual({
      lessonButtonSize: 60,
      slotHeight: 94,
    });
  });
});
