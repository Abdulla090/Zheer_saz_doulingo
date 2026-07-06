import { ScreenOpeningShell, type ScreenOpeningVariant } from "./animations/skia-gsap-opening";
import { TabScreenTransition } from "./TabScreenTransition";
import { usesJsTabBar } from "../constants/tab-mode";
import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";

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
    }, 160); // 160ms lets the tab transition complete first, avoiding animation lag
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <View style={{ flex: 1, backgroundColor: "transparent" }} />;
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(220)}>
      {children}
    </Animated.View>
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

  const shouldLazy = lazy && Platform.OS !== "web";
  if (shouldLazy) {
    content = <TabLazyWrapper>{content}</TabLazyWrapper>;
  }

  if (usesJsTabBar()) {
    return <TabScreenTransition>{content}</TabScreenTransition>;
  }
  return <>{content}</>;
}
