import { CustomTabBar } from "../components/CustomTabBar";
import { ENABLE_SHOP } from "../constants/feature-flags";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "../context/tab-bar-visibility";
import { TabTransitionProvider } from "../context/TabTransitionContext";
import { pathnameHidesTabBar } from "../constants/tab-navigation";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";

function JsTabsLayoutInner() {
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
        tabBarActiveTintColor: "#2B59F3",
        tabBarInactiveTintColor: "#8E95A3",
        animation: "none",
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
      {/* Pill: Home · Games · Path · Shop? — FAB: Profile */}
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="subscription"
        options={{ href: ENABLE_SHOP ? undefined : null }}
      />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="more" />
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
