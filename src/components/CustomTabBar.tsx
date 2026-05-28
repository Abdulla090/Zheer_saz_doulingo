import {
  GamesTabIcon,
  HomeTabIconFlat,
  PathTabIcon,
  ProfileTabIconFlat,
  ShopTabIcon,
} from "@/components/icons/HomeDashboardIcons";
import {
  tabBarBottomInset,
  TAB_BAR_INNER_HEIGHT,
  TAB_BAR_TOP_PADDING,
} from "@/constants/layout";
import { ENABLE_SHOP } from "@/constants/feature-flags";
import { useI18n } from "@/hooks/useI18n";
import type { I18nKey } from "@/i18n";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { hapticSelection } from "@/utils/haptics";
import React, { useCallback, useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#2B59F3";
const INACTIVE = "#9CA3AF";

type TabKey = "index" | "dashboard" | "feed" | "subscription" | "more";

const TABS: {
  route: TabKey;
  labelKey: I18nKey;
  renderIcon: (active: boolean, size: number) => React.ReactNode;
}[] = [
  {
    route: "index",
    labelKey: "tabs.home",
    renderIcon: (active, size) => (
      <HomeTabIconFlat size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "dashboard",
    labelKey: "tabs.path",
    renderIcon: (active, size) => (
      <PathTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "feed",
    labelKey: "tabs.games",
    renderIcon: (active, size) => (
      <GamesTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "subscription",
    labelKey: "tabs.shop",
    renderIcon: (active, size) => (
      <ShopTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "more",
    labelKey: "tabs.profile",
    renderIcon: (active, size) => (
      <ProfileTabIconFlat size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
];

const HIDDEN_ROUTES = new Set([
  "lesson",
  "guidebook",
  "roleplay",
  "ai-teacher",
  "quest",
  "league",
  "privacy-policy",
  "ai-safety",
  "terms",
]);

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t } = useI18n();
  const activeRouteName = state.routes[state.index]?.name;

  const compact = width < 390;
  const iconSize = compact ? 22 : 24;
  const labelSize = compact ? 9 : 10;
  const bottomPad = tabBarBottomInset(insets.bottom);

  const tabs = useMemo(
    () =>
      TABS.filter((tab) => ENABLE_SHOP || tab.route !== "subscription").map(
        (tab) => ({ ...tab, label: t(tab.labelKey) }),
      ),
    [t],
  );

  if (activeRouteName && HIDDEN_ROUTES.has(activeRouteName)) {
    return null;
  }

  const onTabPress = useCallback(
    (route: TabKey, isFocused: boolean) => {
      if (!isFocused) {
        hapticSelection();
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
          paddingTop: TAB_BAR_TOP_PADDING,
          paddingBottom: bottomPad,
          minHeight: TAB_BAR_TOP_PADDING + TAB_BAR_INNER_HEIGHT + bottomPad,
        },
      ]}
    >
      {tabs.map(({ route, label, renderIcon }) => {
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
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
          >
            {renderIcon(isFocused, iconSize)}
            <Text
              style={[
                styles.label,
                { fontSize: labelSize },
                isFocused && styles.labelActive,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
    }),
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: TAB_BAR_INNER_HEIGHT,
    paddingHorizontal: 2,
    gap: 3,
  },
  label: {
    fontWeight: "800",
    color: INACTIVE,
    letterSpacing: 0.2,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
    maxWidth: "100%",
  },
  labelActive: {
    color: ACTIVE,
  },
});
