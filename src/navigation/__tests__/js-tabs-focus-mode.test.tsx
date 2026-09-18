import { describe, expect, it, jest } from "@jest/globals";
import React from "react";
import renderer, { act } from "react-test-renderer";
import JsTabsLayout from "../JsTabsLayout";

let mockFocusModeEnabled = false;
let mockScreenOptions: Record<string, unknown> = {};

jest.mock("expo-router", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  const Tabs = ({ children, screenOptions }: any) => {
    mockScreenOptions = screenOptions;
    return React.createElement(React.Fragment, null, children);
  };
  Tabs.Screen = function MockTabScreen() {
    return null;
  };
  return {
    Tabs,
    router: { prefetch: jest.fn() },
    usePathname: () => "/",
  };
});

jest.mock("../../components/CustomTabBar", () => ({ CustomTabBar: () => null }));
jest.mock("../../components/web/DesktopWebSidebar", () => ({ DesktopWebSidebar: () => null }));
jest.mock("../../components/web/DesktopWebRail", () => ({ DesktopWebRail: () => null }));
jest.mock("../../context/tab-bar-visibility", () => ({
  TabBarVisibilityProvider: ({ children }: { children: React.ReactNode }) => children,
  useTabBarVisibility: () => ({ hidden: false }),
}));
jest.mock("../../hooks/useThemeColors", () => ({
  useThemeColors: () => ({ colors: { background: "#fff", foreground: "#111", mutedForeground: "#777" } }),
}));
jest.mock("../../stores/useSettingsStore", () => ({
  useSettingsStore: (selector: (state: { focusModeEnabled: boolean }) => unknown) =>
    selector({ focusModeEnabled: mockFocusModeEnabled }),
}));

describe("JsTabsLayout focus-mode transitions", () => {
  it("keeps the navigator animation stable across focus-mode changes", () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<JsTabsLayout />);
    });
    expect(mockScreenOptions.animation).toBe("fade");

    mockFocusModeEnabled = true;
    act(() => {
      tree.update(<JsTabsLayout />);
    });
    expect(mockScreenOptions.animation).toBe("fade");

    act(() => tree.unmount());
    mockFocusModeEnabled = false;
  });
});
