import { describe, expect, it } from "@jest/globals";

import { orderTabsForDirection } from "../tab-order";

describe("orderTabsForDirection", () => {
  const tabs = ["home", "games", "leaderboard", "profile"] as const;

  it("keeps LTR tabs in their logical order", () => {
    expect(orderTabsForDirection(tabs, false)).toEqual(tabs);
  });

  it("mirrors RTL tabs exactly once without mutating the source", () => {
    expect(orderTabsForDirection(tabs, true)).toEqual([
      "profile",
      "leaderboard",
      "games",
      "home",
    ]);
    expect(tabs).toEqual(["home", "games", "leaderboard", "profile"]);
  });
});
