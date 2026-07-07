
import {
  GamesTabIcon,
  HomeTabIconFlat,
  LeaderboardTabIcon,
  ProfileTabIconFlat,
} from "./icons/HomeDashboardIcons";
import { TabBarGlassSurface } from "./TabBarGlassSurface";
import { PremiumPressable } from "./PremiumPressable";
import { PanResponder } from "react-native";
import { hapticSelection } from "../utils/haptics";
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
} from "../constants/layout";
import {
  pathnameHidesTabBar,
  TAB_BAR_HIDDEN_ROUTES,
} from "../constants/tab-navigation";
import { TAB_FAB_ROUTE } from "../constants/tab-order";
import { useI18n } from "../hooks/useI18n";
import type { I18nKey } from "../i18n";
import { useTabTransition } from "../context/TabTransitionContext";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { usePathname } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet, useWindowDimensions, View, I18nManager } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, Easing, FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const smoothTransition = (to: number) => {
  "worklet";
  if (Platform.OS === "web") {
    return withTiming(to, {
      duration: 350,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
  }
  return withSpring(to, {
    damping: 30,
    stiffness: 300,
    mass: 0.8,
    overshootClamping: true,
  });
};
import { TAB_BAR_GLASS } from "../constants/tab-bar-glass";
import { springMotion } from "../utils/motion-spring";
import { crossShadow } from "../utils/shadows";
import { AppText } from "./ui/AppText";

const ACTIVE = TAB_BAR_GLASS.iconActive;
const INACTIVE = TAB_BAR_GLASS.iconInactive;

type PillRoute = "index" | "play" | "dashboard";

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
    route: "play",
    labelKey: "tabs.games",
    renderIcon: (active, size) => (
      <GamesTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "dashboard",
    labelKey: "tabs.leaderboard",
    renderIcon: (active, size) => (
      <LeaderboardTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
];

// Animated label that fades in/out next to the active icon
function ActiveTabLabel({ label }: { label: string }) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
    >
      <AppText
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: ACTIVE,
          marginLeft: 4,
        }}
        forceLatinFont
        latinRole="bold"
      >
        {label}
      </AppText>
    </Animated.View>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { t, isKu } = useI18n();
  const { prepareTransition } = useTabTransition();
  const activeRouteName = state.routes[state.index]?.name;

  const pillTabs = useMemo(
    () =>
      PILL_TABS.map((tab) => ({ ...tab, label: t(tab.labelKey) })),
    [t],
  );

  const tabCount = pillTabs.length;
  const rowWidth = width - TAB_BAR_FLOAT_MARGIN_H * 2;
  const pillWidth = rowWidth - TAB_BAR_FAB_SIZE - TAB_BAR_ROW_GAP;
  const slotWidth = pillWidth / tabCount;
  const iconSize = width < 390 ? 25 : 29;
  const bottomPad = tabBarBottomInset(insets.bottom);

  const focusedIndex = useMemo(() => {
    const name = state.routes[state.index]?.name;
    const idx = pillTabs.findIndex((tab) => tab.route === name);
    if (idx >= 0) return idx;
    if (name === TAB_FAB_ROUTE) return tabCount;
    return -1;
  }, [pillTabs, state.index, state.routes, tabCount]);

  const fabFocused = activeRouteName === TAB_FAB_ROUTE;

  // Active chip is wider when showing label
  const ACTIVE_CHIP_WITH_LABEL = slotWidth * 0.95;

  const indicatorTargetX = useCallback(
    (index: number) => {
      if (index < 0 || slotWidth <= 0) return 0;
      
      const isRTL = false;
      const targetWidth = index >= 0 && index < tabCount ? ACTIVE_CHIP_WITH_LABEL : TAB_BAR_ACTIVE_CHIP;

      if (isRTL) {
        if (index < tabCount) {
          const physicalSlotIndex = tabCount - 1 - index;
          return TAB_BAR_FAB_SIZE + TAB_BAR_ROW_GAP + physicalSlotIndex * slotWidth + (slotWidth - targetWidth) / 2;
        }
        return (TAB_BAR_FAB_SIZE - TAB_BAR_ACTIVE_CHIP) / 2;
      } else {
        if (index < tabCount) {
          return index * slotWidth + (slotWidth - targetWidth) / 2;
        }
        return pillWidth + TAB_BAR_ROW_GAP + (TAB_BAR_FAB_SIZE - TAB_BAR_ACTIVE_CHIP) / 2;
      }
    },
    [slotWidth, tabCount, pillWidth, ACTIVE_CHIP_WITH_LABEL]
  );

  const indicatorX = useSharedValue(indicatorTargetX(focusedIndex));
  const indicatorWidth = useSharedValue(
    focusedIndex >= 0 && focusedIndex < tabCount ? ACTIVE_CHIP_WITH_LABEL : TAB_BAR_ACTIVE_CHIP
  );
  const indicatorOpacity = useSharedValue(focusedIndex >= 0 ? 1 : 0);
  const prevFocusedIndex = useRef(focusedIndex);
  const optimisticPress = useRef(false);

  const moveIndicator = useCallback(
    (index: number, animated: boolean) => {
      if (index < 0 || slotWidth <= 0) return;
      const x = indicatorTargetX(index);
      const w = index >= 0 && index < tabCount ? ACTIVE_CHIP_WITH_LABEL : TAB_BAR_ACTIVE_CHIP;
      indicatorX.value = animated ? smoothTransition(x) : x;
      indicatorWidth.value = animated ? smoothTransition(w) : w;
    },
    [indicatorTargetX, indicatorX, indicatorWidth, slotWidth, tabCount, ACTIVE_CHIP_WITH_LABEL],
  );

  const focusedIndexRef = useRef(focusedIndex);
  const tabCountRef = useRef(tabCount);
  const ACTIVE_CHIP_WITH_LABEL_Ref = useRef(ACTIVE_CHIP_WITH_LABEL);
  const pillWidthRef = useRef(pillWidth);
  const slotWidthRef = useRef(slotWidth);
  const stateIndexRef = useRef(state.index);
  const navigateRef = useRef<any>(null);
  const moveIndicatorRef = useRef<any>(null);
  const pillTabsRef = useRef(pillTabs);

  useEffect(() => {
    focusedIndexRef.current = focusedIndex;
    tabCountRef.current = tabCount;
    ACTIVE_CHIP_WITH_LABEL_Ref.current = ACTIVE_CHIP_WITH_LABEL;
    pillWidthRef.current = pillWidth;
    slotWidthRef.current = slotWidth;
    stateIndexRef.current = state.index;
    navigateRef.current = navigate;
    moveIndicatorRef.current = moveIndicator;
    pillTabsRef.current = pillTabs;
  });

  const isDragging = useRef(false);
  const startDragX = useRef(0);
  const currentDragIndex = useRef(focusedIndex);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 8;
      },
      onPanResponderGrant: (evt, gestureState) => {
        isDragging.current = true;
        startDragX.current = indicatorX.value;
        currentDragIndex.current = focusedIndexRef.current;
        if (Platform.OS !== "web") {
          hapticSelection();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isDragging.current) return;

        const targetWidth = focusedIndexRef.current >= 0 && focusedIndexRef.current < tabCountRef.current ? ACTIVE_CHIP_WITH_LABEL_Ref.current : TAB_BAR_ACTIVE_CHIP;
        let newX = startDragX.current + gestureState.dx;
        const maxLimit = pillWidthRef.current - targetWidth;
        newX = Math.max(0, Math.min(newX, maxLimit));

        const stretch = Math.min(Math.abs(gestureState.dx) * 0.35, 40);

        indicatorX.value = newX - stretch / 2;
        indicatorWidth.value = targetWidth + stretch;

        const dragCenter = newX + targetWidth / 2;
        const nearestIndex = Math.max(0, Math.min(Math.floor(dragCenter / slotWidthRef.current), tabCountRef.current - 1));
        if (nearestIndex !== currentDragIndex.current) {
          currentDragIndex.current = nearestIndex;
          if (Platform.OS !== "web") {
            hapticSelection();
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        isDragging.current = false;
        const finalIndex = currentDragIndex.current;
        const targetRoute = pillTabsRef.current[finalIndex]?.route;
        
        if (targetRoute && finalIndex !== focusedIndexRef.current) {
          const isFocused = stateIndexRef.current === finalIndex;
          navigateRef.current(targetRoute, isFocused);
        } else {
          moveIndicatorRef.current(focusedIndexRef.current, true);
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        isDragging.current = false;
        moveIndicatorRef.current(focusedIndexRef.current, true);
      }
    })
  ).current;

  useEffect(() => {
    indicatorOpacity.value = smoothTransition(focusedIndex >= 0 ? 1 : 0);

    if (optimisticPress.current) {
      optimisticPress.current = false;
      prevFocusedIndex.current = focusedIndex;
      return;
    }

    const indexChanged = prevFocusedIndex.current !== focusedIndex;
    prevFocusedIndex.current = focusedIndex;
    // Always recalculate position (covers isKu direction change)
    moveIndicator(focusedIndex, indexChanged);
  }, [focusedIndex, slotWidth, indicatorOpacity, moveIndicator, isKu]);

  const activeCircleTop = (TAB_BAR_INNER_HEIGHT - TAB_BAR_ACTIVE_CHIP) / 2;

  const pillIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
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
    <View style={[styles.host, { paddingBottom: bottomPad, pointerEvents: "box-none", direction: "ltr" as any }]}>
      <View
        style={[
          styles.row,
          {
            marginHorizontal: TAB_BAR_FLOAT_MARGIN_H,
            marginBottom: TAB_BAR_FLOAT_MARGIN_BOTTOM,
            width: rowWidth,
            gap: TAB_BAR_ROW_GAP,
            flexDirection: "row",
            direction: "ltr" as any,
          },
        ]}
      >
        {/* Layer 1: Glass Backgrounds */}
        <View style={[StyleSheet.absoluteFill, { flexDirection: "row", gap: TAB_BAR_ROW_GAP, direction: "ltr" as any }]} pointerEvents="none">
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
        <View
          style={[
            StyleSheet.absoluteFill,
            { direction: "ltr" as any, pointerEvents: "none" }
          ]}
        >
          <Animated.View
            style={[
              styles.activeCircle,
              { top: activeCircleTop, left: 0 },
              pillIndicatorStyle
            ]}
          />
        </View>

        {/* Layer 3: Interactive Icons + Active Label */}
        <View 
          style={[styles.pillWrap, { width: pillWidth, height: TAB_BAR_INNER_HEIGHT, direction: "ltr" as any }]}
          {...panResponder.panHandlers}
        >
          <View style={[styles.pillInner, { height: TAB_BAR_INNER_HEIGHT, flexDirection: "row", direction: "ltr" as any }]}>
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
                  <View style={styles.slotInner}>
                    {renderIcon(isFocused, iconSize)}
                    {isFocused && <ActiveTabLabel label={label} />}
                  </View>
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
  slotInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    position: "absolute",
    left: 0,
    borderRadius: TAB_BAR_ACTIVE_CHIP / 2,
    backgroundColor: TAB_BAR_GLASS.activeCircle,
    borderWidth: 1,
    borderColor: TAB_BAR_GLASS.activeCircleBorder,
    ...crossShadow({
      color: "#000000",
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
