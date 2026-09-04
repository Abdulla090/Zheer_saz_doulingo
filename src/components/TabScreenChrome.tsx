import { usePathname } from "expo-router";
import React from "react";
import { Platform, useWindowDimensions, View } from "react-native";

import { ScreenOpeningShell } from "./animations/skia-gsap-opening";
import type { ScreenOpeningVariant } from "./animations/skia-gsap-opening/opening-themes";
import {
  isDesktopWebWidth,
  WEB_DESKTOP_NAV_WIDTH,
  WEB_DESKTOP_RAIL_WIDTH,
} from "../constants/web-layout";

/**
 * TabScreenChrome wraps each tab screen.
 * Applies the universal ScreenOpeningShell entrance transition.
 */
export function TabScreenChrome({
  children,
  openingVariant,
}: {
  children: React.ReactNode;
  openingVariant?: string;
  lazy?: boolean;
}) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktopWeb =
    Platform.OS === "web" && isDesktopWebWidth(width);
  const usesDesktopRail =
    pathname === "/" || pathname === "/index" || pathname === "/play";

  const variant = (openingVariant as ScreenOpeningVariant) || "general";

  return (
    <View
      style={[
        { flex: 1 },
        isDesktopWeb && {
          marginLeft: WEB_DESKTOP_NAV_WIDTH,
          marginRight: usesDesktopRail ? WEB_DESKTOP_RAIL_WIDTH : 0,
        },
      ]}
    >
      <ScreenOpeningShell variant={variant} screenKey={pathname} firstTimeOnly={false}>
        {children}
      </ScreenOpeningShell>
    </View>
  );
}
