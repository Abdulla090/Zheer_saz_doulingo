import { ScreenOpeningShell, type ScreenOpeningVariant } from "./animations/skia-gsap-opening";
import { TabScreenTransition } from "./TabScreenTransition";
import { usesJsTabBar } from "../constants/tab-mode";
import React, { useEffect, useState } from "react";

const playedOpeningVariants = new Set<ScreenOpeningVariant>();

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
  const [shouldPlayOpening, setShouldPlayOpening] = useState(
    () => !!openingVariant && !playedOpeningVariants.has(openingVariant),
  );

  useEffect(() => {
    if (!openingVariant) return;
    if (playedOpeningVariants.has(openingVariant)) {
      setShouldPlayOpening(false);
      return;
    }
    playedOpeningVariants.add(openingVariant);
  }, [openingVariant]);

  let content = children;

  if (openingVariant && shouldPlayOpening) {
    content = (
      <ScreenOpeningShell variant={openingVariant}>{content}</ScreenOpeningShell>
    );
  }

  void lazy;

  if (usesJsTabBar()) {
    return <TabScreenTransition>{content}</TabScreenTransition>;
  }
  return <>{content}</>;
}
