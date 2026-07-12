import { describe, expect, it } from "@jest/globals";

import {
  SLANG_CATEGORIES,
  SLANG_DATA,
  type SlangContext,
} from "../slang-dictionary";

describe("slang dictionary", () => {
  it("has unique stable ids and complete learning content", () => {
    expect(new Set(SLANG_DATA.map((item) => item.id)).size).toBe(SLANG_DATA.length);

    for (const item of SLANG_DATA) {
      expect(item.phrase.trim()).not.toBe("");
      expect(item.pronunciation.trim()).not.toBe("");
      expect(item.kuMeaning.trim()).not.toBe("");
      expect(item.example.speakerA.trim()).not.toBe("");
      expect(item.example.speakerB.trim()).not.toBe("");
      expect(item.example.kuA.trim()).not.toBe("");
      expect(item.example.kuB.trim()).not.toBe("");
      expect(SLANG_CATEGORIES[item.context]).toBeDefined();
    }
  });

  it("categorizes every supported real-life context", () => {
    const contexts = Object.keys(SLANG_CATEGORIES).filter(
      (context): context is SlangContext => context !== "All",
    );

    for (const context of contexts) {
      expect(SLANG_DATA.some((item) => item.context === context)).toBe(true);
    }
  });

  it("includes high-value restaurant, travel, daily-life, service, and health phrases", () => {
    const ids = new Set(SLANG_DATA.map((item) => item.id));
    expect(ids.size).toBeGreaterThan(250);

    for (const id of [
      "can_i_get",
      "could_we_get_the_check",
      "on_the_house",
      "drop_me_off",
      "traffic_backed_up",
      "slipped_my_mind",
      "give_me_a_heads_up",
      "sink_backed_up",
      "coming_down_with_something",
      "just_browsing",
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });
});
