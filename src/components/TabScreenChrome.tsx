import { TabScreenTransition } from "@/components/TabScreenTransition";
import { usesJsTabBar } from "@/constants/tab-mode";
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
    }, 280); // 280ms lets the horizontal slide and tab transition finish completely first
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <View style={{ flex: 1, backgroundColor: "transparent" }} />;
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(250)}>
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
}: {
  children: React.ReactNode;
  lazy?: boolean;
}) {
  const content = lazy ? <TabLazyWrapper>{children}</TabLazyWrapper> : children;

  if (usesJsTabBar()) {
    return <TabScreenTransition>{content}</TabScreenTransition>;
  }
  return <>{content}</>;
}
