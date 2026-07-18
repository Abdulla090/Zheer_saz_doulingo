import { CustomTabBar } from "../components/CustomTabBar";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "../context/tab-bar-visibility";
import { pathnameHidesTabBar } from "../constants/tab-navigation";
import { isDesktopWebWidth } from "../constants/web-layout";
import { DesktopWebSidebar } from "../components/web/DesktopWebSidebar";
import { DesktopWebRail } from "../components/web/DesktopWebRail";
import { router, Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { Platform, useWindowDimensions, View } from "react-native";

const WARM_TAB_ROUTES = ["/play", "/dashboard", "/more"] as const;

function useWarmTabRoutes() {
  useEffect(() => {
    let cancelled = false;
    const timers = WARM_TAB_ROUTES.map((href, index) =>
      setTimeout(() => {
        if (cancelled) return;

        const prefetch = () => {
          if (!cancelled) router.prefetch(href);
        };

        if (typeof globalThis.requestIdleCallback === "function") {
          globalThis.requestIdleCallback(prefetch, { timeout: 800 });
        } else {
          prefetch();
        }
      }, 500 + index * 550),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);
}

function JsTabsLayoutInner() {
  useWarmTabRoutes();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { hidden: contextHidden } = useTabBarVisibility();
  const hideTabBar = contextHidden || pathnameHidesTabBar(pathname);
  const isDesktopWeb =
    Platform.OS === "web" && isDesktopWebWidth(width);
  const showDesktopRail =
    isDesktopWeb &&
    (pathname === "/" || pathname === "/index" || pathname === "/play");

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      initialRouteName="index"
      tabBar={(props) =>
        isDesktopWeb ? null : <CustomTabBar {...props} />
      }
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#8E95A3",
        animation: "fade",
        transitionSpec: {
          animation: "timing",
          config: { duration: 140 },
        },
        freezeOnBlur: true,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "transparent" }} />
        ),
        tabBarStyle: hideTabBar || isDesktopWeb
          ? { display: "none" }
          : {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              borderTopWidth: 0,
              borderTopColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
              shadowColor: "transparent",
            },
      }}
    >
      {/* Pill: Home · Games · Leaderboard — FAB: Profile */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="play" />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="more" />
      <Tabs.Screen
        name="subscription"
        options={{ href: null }}
      />
    </Tabs>
    {isDesktopWeb && !hideTabBar ? <DesktopWebSidebar /> : null}
    {showDesktopRail ? <DesktopWebRail /> : null}
    </View>
  );
}

/** JS floating frosted glass tab bar (Android default, Expo Go, web). */
export default function JsTabsLayout() {
  return (
    <TabBarVisibilityProvider>
      <JsTabsLayoutInner />
    </TabBarVisibilityProvider>
  );
}
