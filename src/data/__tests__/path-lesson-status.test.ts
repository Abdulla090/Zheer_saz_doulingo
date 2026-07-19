import { describe, expect, it } from "@jest/globals";
import {
  resolveLessonStatus,
  resolveUnitLessonStatus,
} from "../list-items";

describe("path lesson status", () => {
  it("keeps exactly one next lesson current", () => {
    expect(resolveLessonStatus(7, 8)).toBe("completed");
    expect(resolveLessonStatus(8, 8)).toBe("current");
    expect(resolveLessonStatus(9, 8)).toBe("locked");
  });

  it("keeps the first lesson of every future unit available", () => {
    expect(resolveUnitLessonStatus(20, 8, 0)).toBe("current");
    expect(resolveUnitLessonStatus(21, 8, 1)).toBe("locked");
    expect(resolveUnitLessonStatus(0, 8, 0)).toBe("completed");
  });
});
