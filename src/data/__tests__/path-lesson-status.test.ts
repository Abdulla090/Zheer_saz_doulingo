import { describe, expect, it } from "@jest/globals";
import { resolveLessonStatus } from "../list-items";

describe("path lesson status", () => {
  it("keeps exactly one next lesson current", () => {
    expect(resolveLessonStatus(7, 8)).toBe("completed");
    expect(resolveLessonStatus(8, 8)).toBe("current");
    expect(resolveLessonStatus(9, 8)).toBe("locked");
  });
});
