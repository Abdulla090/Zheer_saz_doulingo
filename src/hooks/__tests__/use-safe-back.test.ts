import { describe, expect, it, jest } from "@jest/globals";

import { replaceWithFallback } from "../../utils/safe-navigation";

describe("replaceWithFallback", () => {
  it("replaces the current route without popping a parent navigator", () => {
    const router = {
      replace: jest.fn(),
      navigate: jest.fn(),
    };

    replaceWithFallback(router as any, "/(tabs)/play");

    expect(router.replace).toHaveBeenCalledWith("/(tabs)/play");
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("falls back to navigate if replace is unavailable at runtime", () => {
    const router = {
      replace: jest.fn(() => {
        throw new Error("replace unavailable");
      }),
      navigate: jest.fn(),
    };

    expect(() =>
      replaceWithFallback(router as any, "/(tabs)/more"),
    ).not.toThrow();
    expect(router.navigate).toHaveBeenCalledWith("/(tabs)/more");
  });

  it("falls back when replace rejects asynchronously", async () => {
    const router = {
      replace: jest.fn(() => Promise.reject(new Error("replace failed"))),
      navigate: jest.fn(),
    };

    replaceWithFallback(router as any, "/path");
    await Promise.resolve();
    await Promise.resolve();

    expect(router.navigate).toHaveBeenCalledWith("/path");
  });
});
