import {
  GamesTabIcon,
  HomeTabIconFlat,
  PathTabIcon,
  ProfileTabIconFlat,
  ShopTabIcon,
} from "@/components/icons/HomeDashboardIcons";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#2B59F3";
const INACTIVE = "#9CA3AF";

type TabKey = "index" | "dashboard" | "feed" | "subscription" | "more";

const TABS: {
  route: TabKey;
  label: string;
  renderIcon: (active: boolean) => React.ReactNode;
}[] = [
  {
    route: "index",
    label: "HOME",
    renderIcon: (active) => (
      <HomeTabIconFlat size={26} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "dashboard",
    label: "PATH",
    renderIcon: (active) => (
      <PathTabIcon size={26} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "feed",
    label: "GAMES",
    renderIcon: (active) => (
      <GamesTabIcon size={26} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "subscription",
    label: "SHOP",
    renderIcon: (active) => (
      <ShopTabIcon size={26} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "more",
    label: "PROFILE",
    renderIcon: (active) => (
      <ProfileTabIconFlat size={26} color={active ? ACTIVE : INACTIVE} />
    ),
  },
];

const HIDDEN_ROUTES = new Set([
  "lesson",
  "guidebook",
  "roleplay",
  "quest",
  "league",
]);

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index]?.name;

  if (activeRouteName && HIDDEN_ROUTES.has(activeRouteName)) {
    return null;
  }

  const onTabPress = useCallback(
    (route: TabKey, isFocused: boolean) => {
      if (!isFocused) {
        void Haptics.selectionAsync();
        navigation.navigate(route);
      }
    },
    [navigation],
  );

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(
            insets.bottom,
            Platform.OS === "android" ? 8 : 4,
          ),
        },
      ]}
    >
      {TABS.map(({ route, label, renderIcon }) => {
        const routeIndex = state.routes.findIndex((r) => r.name === route);
        const isFocused =
          routeIndex >= 0
            ? state.index === routeIndex
            : activeRouteName === route;

        return (
          <Pressable
            key={route}
            onPress={() => onTabPress(route, isFocused)}
            style={styles.item}
          >
            {renderIcon(isFocused)}
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: INACTIVE,
    letterSpacing: 0.4,
    fontFamily: "DINNextRoundedBold",
  },
  labelActive: {
    color: ACTIVE,
  },
});
