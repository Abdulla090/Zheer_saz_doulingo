import { CustomTabBar } from "../components/CustomTabBar";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "../context/tab-bar-visibility";
import { TabTransitionProvider } from "../context/TabTransitionContext";
import { pathnameHidesTabBar } from "../constants/tab-navigation";
import { router, Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

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
  const { hidden: contextHidden } = useTabBarVisibility();
  const hideTabBar = contextHidden || pathnameHidesTabBar(pathname);

  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#8E95A3",
        animation: "fade",
        transitionSpec: {
          animation: "timing",
          config: { duration: 160 },
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: "transparent" }} />
        ),
        tabBarStyle: hideTabBar
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
  );
}

/** JS floating frosted glass tab bar (Android default, Expo Go, web). */
export default function JsTabsLayout() {
  return (
    <TabTransitionProvider>
      <TabBarVisibilityProvider>
        <JsTabsLayoutInner />
      </TabBarVisibilityProvider>
    </TabTransitionProvider>
  );
}
