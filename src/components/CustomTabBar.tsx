import { PressableScale } from "@/components/animations";
import {
  PathTabIcon,
  ShopTabIcon,
} from "@/components/icons/HomeDashboardIcons";
import { Icon3DGamepad } from "@/components/icons/Icon3D";
import {
  Home,
  Profile,
} from "@/constants/icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const ACTIVE = "#1CB0F6";
const INACTIVE = "#AFAFAF";

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
      <Home
        width={26}
        height={26}
        fill={active ? ACTIVE : INACTIVE}
        stroke={active ? ACTIVE : INACTIVE}
      />
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
      <View style={{ opacity: active ? 1 : 0.55 }}>
        <Icon3DGamepad size={26} />
      </View>
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
      <Profile
        width={26}
        height={26}
        fill={active ? ACTIVE : INACTIVE}
        stroke={active ? ACTIVE : INACTIVE}
      />
    ),
  },
];

const HIDDEN_ROUTES = new Set(["lesson", "guidebook", "roleplay", "quest", "league"]);

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
          paddingBottom: Math.max(insets.bottom, Platform.OS === "android" ? 8 : 0),
        },
      ]}
    >
      {TABS.map(({ route, label, renderIcon }) => {
        const routeIndex = state.routes.findIndex((r) => r.name === route);
        const isFocused =
          routeIndex >= 0 ? state.index === routeIndex : activeRouteName === route;

        return (
          <PressableScale
            key={route}
            onPress={() => onTabPress(route, isFocused)}
            style={styles.item}
            scaleDown={0.92}
          >
            {renderIcon(isFocused)}
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

/** Fallback home icon if SVG import lacks fill */
export function HomeTabIcon({
  size = 26,
  color = INACTIVE,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9.5z"
        fill={color}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingHorizontal: 6,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 2,
    borderTopColor: "#E5E5E5",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: INACTIVE,
    letterSpacing: 0.3,
    fontFamily: "DINNextRoundedBold",
  },
  labelActive: {
    color: ACTIVE,
  },
});
