import { KidsCustomTabBar } from "../components/KidsCustomTabBar";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "../context/tab-bar-visibility";
import { TabTransitionProvider } from "../context/TabTransitionContext";
import { pathnameHidesTabBar } from "../constants/tab-navigation";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";

function KidsJsTabsLayoutInner() {
  const pathname = usePathname();
  const { hidden: contextHidden } = useTabBarVisibility();
  const hideTabBar = contextHidden || pathnameHidesTabBar(pathname);

  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <KidsCustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#4CAF50", // Kid-friendly green
        tabBarInactiveTintColor: "#9E9E9E",
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
      <Tabs.Screen name="index" />
      <Tabs.Screen name="classic-path" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

export default function KidsJsTabsLayout() {
  return (
    <TabTransitionProvider>
      <TabBarVisibilityProvider>
        <KidsJsTabsLayoutInner />
      </TabBarVisibilityProvider>
    </TabTransitionProvider>
  );
}
