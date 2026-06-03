import {
  GamesTabIcon,
  HomeTabIconFlat,
  PathTabIcon,
  ProfileTabIconFlat,
  ShopTabIcon,
} from "@/components/icons/HomeDashboardIcons";
import { TabBarGlassSurface } from "@/components/TabBarGlassSurface";
import {
  TAB_BAR_CORNER_RADIUS,
  TAB_BAR_FLOAT_MARGIN_H,
  TAB_BAR_FLOAT_MARGIN_BOTTOM,
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
const INACTIVE = "#8E95A3";

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
  const labelSize = compact ? 10 : 11;
  const bottomPad = tabBarBottomInset(insets.bottom);

  const tabs = useMemo(
    () =>
      TABS.filter((tab) => ENABLE_SHOP || tab.route !== "subscription").map(
        (tab) => ({ ...tab, label: t(tab.labelKey) }),
      ),
    [t],
  );

  const onTabPress = useCallback(
    (route: TabKey, isFocused: boolean) => {
      if (!isFocused) {
        hapticSelection();
        navigation.navigate(route);
      }
    },
    [navigation],
  );

  if (activeRouteName && HIDDEN_ROUTES.has(activeRouteName)) {
    return null;
  }

  return (
    <View style={styles.host} pointerEvents="box-none">
      <View
        style={[
          styles.floatWrap,
          {
            marginHorizontal: TAB_BAR_FLOAT_MARGIN_H,
            marginBottom: TAB_BAR_FLOAT_MARGIN_BOTTOM + bottomPad,
            paddingTop: TAB_BAR_TOP_PADDING,
            minHeight: TAB_BAR_TOP_PADDING + TAB_BAR_INNER_HEIGHT,
          },
        ]}
      >
        <TabBarGlassSurface borderRadius={TAB_BAR_CORNER_RADIUS}>
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
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                {isFocused ? <View style={styles.activePill} /> : null}
                <View style={styles.itemInner}>
                  {renderIcon(isFocused, iconSize)}
                  <Text
                    style={[
                      styles.label,
                      { fontSize: labelSize },
                      isFocused && styles.labelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </TabBarGlassSurface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    backgroundColor: "transparent",
  },
  floatWrap: {
    backgroundColor: "transparent",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: TAB_BAR_INNER_HEIGHT,
    paddingHorizontal: 4,
    position: "relative",
  },
  activePill: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 3,
    marginVertical: 5,
    borderRadius: 18,
    backgroundColor: "rgba(43, 89, 243, 0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(43, 89, 243, 0.22)",
  },
  itemInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    zIndex: 1,
  },
  label: {
    fontWeight: "600",
    color: INACTIVE,
    letterSpacing: 0.15,
    fontFamily: Platform.select({
      ios: "System",
      default: "DINNextRoundedMedium",
    }),
    textAlign: "center",
  },
  labelActive: {
    color: ACTIVE,
    fontWeight: "700",
    fontFamily: Platform.select({
      ios: "System",
      default: "DINNextRoundedBold",
    }),
  },
});
