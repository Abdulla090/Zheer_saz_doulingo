import {
  GamesTabIcon,
  HomeTabIconFlat,
  PathTabIcon,
  ProfileTabIconFlat,
  ShopTabIcon,
} from "@/components/icons/HomeDashboardIcons";
import { TabBarGlassSurface } from "@/components/TabBarGlassSurface";
import { PremiumPressable } from "@/components/PremiumPressable";
import {
  TAB_BAR_ACTIVE_CHIP,
  TAB_BAR_CORNER_RADIUS,
  TAB_BAR_FAB_SIZE,
  TAB_BAR_FLOAT_MARGIN_BOTTOM,
  TAB_BAR_FLOAT_MARGIN_H,
  TAB_BAR_INNER_HEIGHT,
  TAB_BAR_ROW_GAP,
  TAB_BAR_TOP_PADDING,
  tabBarBottomInset,
} from "@/constants/layout";
import { ENABLE_SHOP } from "@/constants/feature-flags";
import {
  pathnameHidesTabBar,
  TAB_BAR_HIDDEN_ROUTES,
} from "@/constants/tab-navigation";
import { TAB_FAB_ROUTE } from "@/constants/tab-order";
import { useI18n } from "@/hooks/useI18n";
import type { I18nKey } from "@/i18n";
import { useTabTransition } from "@/context/TabTransitionContext";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { usePathname } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_GLASS } from "@/constants/tab-bar-glass";
import { springMotion } from "@/utils/motion-spring";
import { crossShadow } from "@/utils/shadows";

const ACTIVE = TAB_BAR_GLASS.iconActive;
const INACTIVE = TAB_BAR_GLASS.iconInactive;

type PillRoute = "index" | "feed" | "dashboard" | "subscription";

const PILL_TABS: {
  route: PillRoute;
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
    route: "subscription",
    labelKey: "tabs.shop",
    renderIcon: (active, size) => (
      <ShopTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
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
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { t, isKu } = useI18n();
  const { prepareTransition } = useTabTransition();
  const activeRouteName = state.routes[state.index]?.name;

  const pillTabs = useMemo(
    () =>
      PILL_TABS.filter((tab) => ENABLE_SHOP || tab.route !== "subscription").map(
        (tab) => ({ ...tab, label: t(tab.labelKey) }),
      ),
    [t],
  );

  const tabCount = pillTabs.length;
  const rowWidth = width - TAB_BAR_FLOAT_MARGIN_H * 2;
  const pillWidth = rowWidth - TAB_BAR_FAB_SIZE - TAB_BAR_ROW_GAP;
  const slotWidth = pillWidth / tabCount;
  const iconSize = width < 390 ? 22 : 24;
  const bottomPad = tabBarBottomInset(insets.bottom);

  const focusedIndex = useMemo(() => {
    const name = state.routes[state.index]?.name;
    const idx = pillTabs.findIndex((tab) => tab.route === name);
    if (idx >= 0) return idx;
    if (name === TAB_FAB_ROUTE) return tabCount;
    return -1;
  }, [pillTabs, state.index, state.routes, tabCount]);

  const fabFocused = activeRouteName === TAB_FAB_ROUTE;

  const indicatorTargetX = useCallback(
    (index: number) => {
      if (index < 0 || slotWidth <= 0) return 0;
      if (index < tabCount) {
        if (isKu) {
          const slotIndexFromLeft = tabCount - 1 - index;
          return TAB_BAR_FAB_SIZE + TAB_BAR_ROW_GAP + slotIndexFromLeft * slotWidth + (slotWidth - TAB_BAR_ACTIVE_CHIP) / 2;
        }
        return index * slotWidth + (slotWidth - TAB_BAR_ACTIVE_CHIP) / 2;
      }
      if (isKu) {
        return (TAB_BAR_FAB_SIZE - TAB_BAR_ACTIVE_CHIP) / 2;
      }
      return pillWidth + TAB_BAR_ROW_GAP + (TAB_BAR_FAB_SIZE - TAB_BAR_ACTIVE_CHIP) / 2;
    },
    [slotWidth, tabCount, pillWidth, isKu]
  );

  const indicatorX = useSharedValue(indicatorTargetX(focusedIndex));
  const indicatorOpacity = useSharedValue(focusedIndex >= 0 ? 1 : 0);
  const prevFocusedIndex = useRef(focusedIndex);
  const optimisticPress = useRef(false);

  const moveIndicator = useCallback(
    (index: number, animated: boolean) => {
      if (index < 0 || slotWidth <= 0) return;
      const x = indicatorTargetX(index);
      indicatorX.value = animated ? springMotion(x) : x;
    },
    [indicatorTargetX, indicatorX, slotWidth],
  );

  useEffect(() => {
    indicatorOpacity.value = springMotion(focusedIndex >= 0 ? 1 : 0);

    if (optimisticPress.current) {
      optimisticPress.current = false;
      prevFocusedIndex.current = focusedIndex;
      return;
    }

    const indexChanged = prevFocusedIndex.current !== focusedIndex;
    prevFocusedIndex.current = focusedIndex;
    moveIndicator(focusedIndex, indexChanged);
  }, [focusedIndex, slotWidth, indicatorOpacity, moveIndicator]);

  const activeCircleTop = (TAB_BAR_INNER_HEIGHT - TAB_BAR_ACTIVE_CHIP) / 2;

  const pillIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: TAB_BAR_ACTIVE_CHIP,
    height: TAB_BAR_ACTIVE_CHIP,
    opacity: indicatorOpacity.value,
  }));

  const fabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value - (pillWidth + TAB_BAR_ROW_GAP) }],
    width: TAB_BAR_ACTIVE_CHIP,
    height: TAB_BAR_ACTIVE_CHIP,
    opacity: indicatorOpacity.value,
  }));

  const navigate = useCallback(
    (route: string, isFocused: boolean) => {
      if (!isFocused) {
        let nextIdx = pillTabs.findIndex((tab) => tab.route === route);
        if (nextIdx < 0 && route === TAB_FAB_ROUTE) {
          nextIdx = tabCount;
        }
        if (nextIdx >= 0) {
          optimisticPress.current = true;
          moveIndicator(nextIdx, true);
          indicatorOpacity.value = 1;
        }
        prepareTransition(activeRouteName ?? "index", route);
        navigation.navigate(route);
      }
    },
    [
      activeRouteName,
      indicatorOpacity,
      moveIndicator,
      navigation,
      pillTabs,
      prepareTransition,
      tabCount,
    ],
  );

  if (
    pathnameHidesTabBar(pathname) ||
    (activeRouteName && TAB_BAR_HIDDEN_ROUTES.has(activeRouteName))
  ) {
    return null;
  }

  return (
    <View style={[styles.host, { paddingBottom: bottomPad, pointerEvents: "box-none" }]}>
      <View
        style={[
          styles.row,
          {
            marginHorizontal: TAB_BAR_FLOAT_MARGIN_H,
            marginBottom: TAB_BAR_FLOAT_MARGIN_BOTTOM,
            width: rowWidth,
            gap: TAB_BAR_ROW_GAP,
          },
        ]}
      >
        {/* Layer 1: Glass Backgrounds */}
        <View style={[StyleSheet.absoluteFill, { flexDirection: "row", gap: TAB_BAR_ROW_GAP }]} pointerEvents="none">
          <TabBarGlassSurface
            borderRadius={TAB_BAR_CORNER_RADIUS}
            style={{ width: pillWidth, height: TAB_BAR_INNER_HEIGHT }}
          />
          <TabBarGlassSurface
            borderRadius={TAB_BAR_FAB_SIZE / 2}
            style={{ width: TAB_BAR_FAB_SIZE, height: TAB_BAR_FAB_SIZE, marginTop: TAB_BAR_INNER_HEIGHT - TAB_BAR_FAB_SIZE }}
          />
        </View>

        {/* Layer 2: Seamless Active Indicator */}
        <Animated.View
          style={[
            styles.activeCircle,
            { top: activeCircleTop, pointerEvents: "none" },
            pillIndicatorStyle
          ]}
        />

        {/* Layer 3: Interactive Icons */}
        <View style={[styles.pillWrap, { width: pillWidth, height: TAB_BAR_INNER_HEIGHT }]}>
          <View style={[styles.pillInner, { height: TAB_BAR_INNER_HEIGHT }]}>
            {pillTabs.map(({ route, label, renderIcon }) => {
              const routeIndex = state.routes.findIndex((r) => r.name === route);
              const isFocused =
                routeIndex >= 0
                  ? state.index === routeIndex
                  : activeRouteName === route;

              return (
                <PremiumPressable
                  key={route}
                  android_ripple={{ color: "transparent" }}
                  onPress={() => navigate(route, isFocused)}
                  style={[styles.slot, { width: slotWidth }]}
                  pressScale={0.92}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isFocused }}
                  accessibilityLabel={label}
                  hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
                >
                  {renderIcon(isFocused, iconSize)}
                </PremiumPressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fabWrap}>
          <View style={{ width: TAB_BAR_FAB_SIZE, height: TAB_BAR_FAB_SIZE, position: "relative" }}>
            <PremiumPressable
              android_ripple={{ color: "transparent" }}
              onPress={() => navigate(TAB_FAB_ROUTE, fabFocused)}
              style={[styles.fabBtn]}
              pressScale={0.94}
              accessibilityRole="button"
              accessibilityLabel={t("tabs.profile")}
              hitSlop={8}
            >
              <ProfileTabIconFlat
                size={iconSize}
                color={fabFocused ? ACTIVE : INACTIVE}
              />
            </PremiumPressable>
          </View>
        </View>
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  pillWrap: {
    minWidth: 0,
  },
  pillGlass: {
    width: "100%",
    height: TAB_BAR_INNER_HEIGHT,
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  slot: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    height: "100%",
  },
  activeCircle: {
    position: "absolute",
    left: 0,
    borderRadius: TAB_BAR_ACTIVE_CHIP / 2,
    backgroundColor: TAB_BAR_GLASS.activeCircle,
    borderWidth: 1,
    borderColor: TAB_BAR_GLASS.activeCircleBorder,
    ...crossShadow({
      color: "#2B59F3",
      offsetY: 2,
      blur: 6,
      opacity: 0.12,
      elevation: 2,
    }),
  },
  fabWrap: {
    width: TAB_BAR_FAB_SIZE,
    height: TAB_BAR_FAB_SIZE,
    marginBottom: TAB_BAR_TOP_PADDING,
  },
  fabGlass: {
    width: TAB_BAR_FAB_SIZE,
    height: TAB_BAR_FAB_SIZE,
  },
  fabBtn: {
    width: TAB_BAR_FAB_SIZE,
    height: TAB_BAR_FAB_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: TAB_BAR_FAB_SIZE / 2,
  },
  fabBtnActive: {
    backgroundColor: TAB_BAR_GLASS.activeCircle,
  },
});
