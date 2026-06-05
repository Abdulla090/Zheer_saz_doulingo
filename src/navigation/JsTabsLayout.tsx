import { CustomTabBar } from "@/components/CustomTabBar";
import { ENABLE_SHOP } from "@/constants/feature-flags";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "@/context/tab-bar-visibility";
import { TabTransitionProvider } from "@/context/TabTransitionContext";
import { pathnameHidesTabBar } from "@/constants/tab-navigation";
import { usePathname } from "expo-router";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

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
        animation: Platform.OS === "android" ? "shift" : "fade",
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
      {/* Screen order matches tab bar: Games (left) → Home → Shop? → Profile (right) */}
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="subscription"
        options={{ href: ENABLE_SHOP ? undefined : null }}
      />
      <Tabs.Screen name="more" />
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="quest" options={{ href: null }} />
      <Tabs.Screen name="league" options={{ href: null }} />
      <Tabs.Screen
        name="lesson"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="guidebook"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="roleplay"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="ai-teacher"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="slang"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="podcast"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="voice-tutor"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen name="privacy-policy" options={{ href: null }} />
      <Tabs.Screen name="ai-safety" options={{ href: null }} />
      <Tabs.Screen name="terms" options={{ href: null }} />
      <Tabs.Screen
        name="admin/index"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="admin/unit"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="admin/lesson"
        options={{ headerShown: false, href: null, tabBarStyle: { display: "none" } }}
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
