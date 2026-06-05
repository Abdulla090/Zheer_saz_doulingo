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
import { PremiumPressable } from "@/components/PremiumPressable";
import { useTabTransition } from "@/context/TabTransitionContext";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { usePathname } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  Platform,
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
const INACTIVE = "#6B7280";

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
  const { prepareTransition } = useTabTransition();
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

  const iconSize = width < 390 ? 24 : 26;
  const labelSize = width < 390 ? 11 : 12;
  const bottomPad = tabBarBottomInset(insets.bottom);

  const onTabPress = useCallback(
    (route: TabKey, isFocused: boolean) => {
      if (!isFocused) {
        prepareTransition(activeRouteName ?? "index", route);
        navigation.navigate(route);
      }
    },
    [activeRouteName, navigation, prepareTransition],
  );

  if (
    pathnameHidesTabBar(pathname) ||
    (activeRouteName && TAB_BAR_HIDDEN_ROUTES.has(activeRouteName))
  ) {
    return null;
  }

  return (
    <View
      style={[styles.host, { paddingBottom: bottomPad }]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.floatWrap,
          {
            marginHorizontal: TAB_BAR_FLOAT_MARGIN_H,
            marginBottom: TAB_BAR_FLOAT_MARGIN_BOTTOM,
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
                <PremiumPressable
                  key={route}
                  onPress={() => onTabPress(route, isFocused)}
                  style={[styles.item, { width: slotWidth }]}
                  pressScale={0.94}
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
                </PremiumPressable>
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
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
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
    top: 6,
    bottom: 6,
    left: 0,
    borderRadius: 20,
    backgroundColor: "rgba(43, 89, 243, 0.12)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(43, 89, 243, 0.18)",
  },
  itemInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 2,
  },
  label: {
    fontWeight: "600",
    color: "#6B7280",
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
