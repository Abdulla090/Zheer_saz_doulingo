import { usePathname } from "expo-router";
import React from "react";
import { Platform, useWindowDimensions, View } from "react-native";

import {
  isDesktopWebWidth,
  WEB_DESKTOP_NAV_WIDTH,
  WEB_DESKTOP_RAIL_WIDTH,
} from "../constants/web-layout";

/**
 * TabScreenChrome wraps each tab screen.
 * Tab screens render instantly — no opening overlay.
 * Navigation owns the transition so tab screens do not animate twice.
 */
export function TabScreenChrome({
  children,
}: {
  children: React.ReactNode;
  lazy?: boolean;
  openingVariant?: string;
}) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktopWeb =
    Platform.OS === "web" && isDesktopWebWidth(width);
  const usesDesktopRail =
    pathname === "/" || pathname === "/index" || pathname === "/play";

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
      {children}
    </View>
  );
}
