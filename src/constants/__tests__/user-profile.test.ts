import { describe, expect, it } from "@jest/globals";

import {
  DEFAULT_USER_AGE,
  USER_AGE_MAX,
  USER_AGE_MIN,
  ageFromTrackPosition,
  isUserSex,
  resolveUserAge,
  trackPositionFromAge,
} from "../user-profile";

describe("onboarding user profile", () => {
  it("accepts only the two supported sex values", () => {
    expect(isUserSex("female")).toBe(true);
    expect(isUserSex("male")).toBe(true);
    expect(isUserSex("other")).toBe(false);
    expect(isUserSex("")).toBe(false);
  });

  it("normalizes stored age into the supported slider range", () => {
    expect(resolveUserAge("")).toBe(DEFAULT_USER_AGE);
    expect(resolveUserAge("4")).toBe(USER_AGE_MIN);
    expect(resolveUserAge("36")).toBe(36);
    expect(resolveUserAge("120")).toBe(USER_AGE_MAX);
  });

  it("maps the slider endpoints and round-trips an age", () => {
    expect(ageFromTrackPosition(0, 300)).toBe(USER_AGE_MIN);
    expect(ageFromTrackPosition(300, 300)).toBe(USER_AGE_MAX);

    const position = trackPositionFromAge(24, 300);
    expect(ageFromTrackPosition(position, 300)).toBe(24);
  });
});
