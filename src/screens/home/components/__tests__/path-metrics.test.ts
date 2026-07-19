import { describe, expect, it } from "@jest/globals";

import { getPathMetrics } from "../path-metrics";

describe("path node metrics", () => {
  it("uses smaller nodes and rows on compact web layouts", () => {
    expect(getPathMetrics("street", true)).toEqual({
      lessonButtonSize: 60,
      slotHeight: 84,
    });
    expect(getPathMetrics("normal", true)).toEqual({
      lessonButtonSize: 64,
      slotHeight: 88,
    });
    expect(getPathMetrics("kids", true)).toEqual({
      lessonButtonSize: 62,
      slotHeight: 86,
    });
  });

  it("preserves the existing native and desktop metrics", () => {
    expect(getPathMetrics("street")).toEqual({
      lessonButtonSize: 76,
      slotHeight: 106,
    });
    expect(getPathMetrics("normal")).toEqual({
      lessonButtonSize: 82,
      slotHeight: 112,
    });
    expect(getPathMetrics("kids")).toEqual({
      lessonButtonSize: 78,
      slotHeight: 108,
    });
  });
});
