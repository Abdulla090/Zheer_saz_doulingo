import { ScreenOpeningShell, type ScreenOpeningVariant } from "./animations/skia-gsap-opening";
import { TabScreenTransition } from "./TabScreenTransition";
import { usesJsTabBar } from "../constants/tab-mode";
import React, { useState, useEffect } from "react";
import { View } from "react-native";

import Animated, { FadeIn } from "react-native-reanimated";

/**
 * Lazy wrapper to defer mounting heavy tab screen contents during tab transitions.
 * Prevents JavaScript thread swamping and UI freezes on first load.
 */
function TabLazyWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 30); // 30ms is enough to let tab click transitions register, but fast enough to feel immediate
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <View style={{ flex: 1, backgroundColor: "transparent" }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
}

/**
 * TabScreenChrome wraps each tab screen.
 * - NativeTabs: system transitions only.
 * - JS tab bar: directional slide between Games / Home / Profile / Path.
 * - Supports lazy-loading to defer first-time render blockages.
 */
export function TabScreenChrome({
  children,
  lazy = true,
  openingVariant,
}: {
  children: React.ReactNode;
  lazy?: boolean;
  openingVariant?: ScreenOpeningVariant;
}) {
  let content = children;

  if (openingVariant) {
    content = (
      <ScreenOpeningShell variant={openingVariant}>{content}</ScreenOpeningShell>
    );
  }

  if (lazy) {
    content = <TabLazyWrapper>{content}</TabLazyWrapper>;
  }

  if (usesJsTabBar()) {
    return <TabScreenTransition>{content}</TabScreenTransition>;
  }
  return <>{content}</>;
}
