import {
  GamesTabIcon,
  HomeTabIconFlat,
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
import {
  pathnameHidesTabBar,
  TAB_BAR_HIDDEN_ROUTES,
} from "@/constants/tab-navigation";
import { useI18n } from "@/hooks/useI18n";
import type { I18nKey } from "@/i18n";
import { Motion } from "@/screens/lesson/games/game-design";
import { hapticSelection } from "@/utils/haptics";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { usePathname } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#2B59F3";
const INACTIVE = "#8E95A3";

type TabKey = "index" | "feed" | "subscription" | "more";

const TABS: {
  route: TabKey;
  labelKey: I18nKey;
  renderIcon: (active: boolean, size: number) => React.ReactNode;
}[] = [
  {
    route: "feed",
    labelKey: "tabs.games",
    renderIcon: (active, size) => (
      <GamesTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "index",
    labelKey: "tabs.home",
    renderIcon: (active, size) => (
      <HomeTabIconFlat size={size} color={active ? ACTIVE : INACTIVE} />
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

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { t } = useI18n();
  const activeRouteName = state.routes[state.index]?.name;

  const tabs = useMemo(
    () =>
      TABS.filter((tab) => ENABLE_SHOP || tab.route !== "subscription").map(
        (tab) => ({ ...tab, label: t(tab.labelKey) }),
      ),
    [t],
  );

  const tabCount = tabs.length;
  const barWidth = width - TAB_BAR_FLOAT_MARGIN_H * 2;
  const slotWidth = barWidth / tabCount;
  const pillInset = 4;
  const pillWidth = slotWidth - pillInset * 2;

  const pillX = useSharedValue(0);

  const focusedIndex = useMemo(() => {
    const name = state.routes[state.index]?.name;
    const idx = tabs.findIndex((tab) => tab.route === name);
    return idx >= 0 ? idx : 0;
  }, [tabs, state.index, state.routes]);

  useEffect(() => {
    pillX.value = withSpring(focusedIndex * slotWidth + pillInset, Motion.soft);
  }, [focusedIndex, pillInset, pillX, slotWidth]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillWidth,
  }));

  const iconSize = width < 390 ? 22 : 24;
  const labelSize = width < 390 ? 10 : 11;
  const bottomPad = tabBarBottomInset(insets.bottom);

  const onTabPress = useCallback(
    (route: TabKey, isFocused: boolean) => {
      if (!isFocused) {
        hapticSelection();
        navigation.navigate(route);
      }
    },
    [navigation],
  );

  if (
    pathnameHidesTabBar(pathname) ||
    (activeRouteName && TAB_BAR_HIDDEN_ROUTES.has(activeRouteName))
  ) {
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
            width: barWidth,
            alignSelf: "center",
            paddingTop: TAB_BAR_TOP_PADDING,
            minHeight: TAB_BAR_TOP_PADDING + TAB_BAR_INNER_HEIGHT,
          },
        ]}
      >
        <TabBarGlassSurface borderRadius={TAB_BAR_CORNER_RADIUS}>
          <View style={[styles.row, { height: TAB_BAR_INNER_HEIGHT }]}>
            <Animated.View
              style={[styles.activePill, pillStyle]}
              pointerEvents="none"
            />
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
                  style={[styles.item, { width: slotWidth }]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isFocused }}
                  accessibilityLabel={label}
                  hitSlop={{ top: 8, bottom: 8, left: 2, right: 2 }}
                >
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
          </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  activePill: {
    position: "absolute",
    top: 5,
    bottom: 5,
    left: 0,
    borderRadius: 20,
    backgroundColor: "rgba(43, 89, 243, 0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(43, 89, 243, 0.22)",
  },
  itemInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
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
