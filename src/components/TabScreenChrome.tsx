import { TabScreenTransition } from "@/components/TabScreenTransition";
import { usesJsTabBar } from "@/constants/tab-mode";
import React from "react";

/**
 * NativeTabs: system transitions only.
 * JS tab bar: directional slide between Games / Home / Profile.
 */
export function TabScreenChrome({ children }: { children: React.ReactNode }) {
  if (usesJsTabBar()) {
    return <TabScreenTransition>{children}</TabScreenTransition>;
  }
  return <>{children}</>;
}
