import {
  GamesTabIcon,
  HomeTabIconFlat,
  LeaderboardTabIcon,
  ProfileTabIconFlat,
} from "./icons/HomeDashboardIcons";
import {
  TAB_BAR_FLOAT_MARGIN_BOTTOM,
  TAB_BAR_FLOAT_MARGIN_H,
  TAB_BAR_INNER_HEIGHT,
  tabBarBottomInset,
} from "../constants/layout";
import {
  pathnameHidesTabBar,
  TAB_BAR_HIDDEN_ROUTES,
} from "../constants/tab-navigation";
import { TAB_FAB_ROUTE } from "../constants/tab-order";
import { useI18n } from "../hooks/useI18n";
import type { I18nKey } from "../i18n";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { BlurView } from "expo-blur";
import { router, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type View as NativeView,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { crossShadow } from "../utils/shadows";
import { AppText } from "./ui/AppText";
import { useThemeColors } from "../hooks/useThemeColors";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { springMotion } from "../utils/motion-spring";
import { orderTabsForDirection } from "../utils/tab-order";

const MAX_BAR_WIDTH = 460;
const BAR_PADDING = 6;

type TabRoute = "index" | "play" | "dashboard" | typeof TAB_FAB_ROUTE;

const TAB_ITEMS: {
  route: TabRoute;
  href: "/" | "/play" | "/dashboard" | "/more";
  labelKey: I18nKey;
  renderIcon: (active: boolean, size: number, activeColor: string, inactiveColor: string) => React.ReactNode;
}[] = [
  {
    route: "index",
    href: "/",
    labelKey: "tabs.home",
    renderIcon: (active, size, activeColor, inactiveColor) => (
      <HomeTabIconFlat size={size} color={active ? activeColor : inactiveColor} />
    ),
  },
  {
    route: "play",
    href: "/play",
    labelKey: "tabs.games",
    renderIcon: (active, size, activeColor, inactiveColor) => (
      <GamesTabIcon size={size} color={active ? activeColor : inactiveColor} />
    ),
  },
  {
    route: "dashboard",
    href: "/dashboard",
    labelKey: "tabs.leaderboard",
    renderIcon: (active, size, activeColor, inactiveColor) => (
      <LeaderboardTabIcon size={size} color={active ? activeColor : inactiveColor} />
    ),
  },
  {
    route: TAB_FAB_ROUTE,
    href: "/more",
    labelKey: "tabs.profile",
    renderIcon: (active, size, activeColor, inactiveColor) => (
      <ProfileTabIconFlat size={size} color={active ? activeColor : inactiveColor} />
    ),
  },
];

const hitSlop = { top: 8, bottom: 8, left: 4, right: 4 };

const webTouchableStyle =
  Platform.OS === "web"
    ? ({
        WebkitTapHighlightColor: "transparent",
        cursor: "pointer",
        outlineStyle: "none",
        userSelect: "none",
      } as unknown as ViewStyle)
    : undefined;

function TabButton({
  label,
  isFocused,
  isRtl,
  icon,
  onPressIn,
  onPress,
}: {
  label: string;
  isFocused: boolean;
  isRtl: boolean;
  icon: React.ReactNode;
  onPressIn: () => void;
  onPress: () => void;
}) {
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const reducedMotion = useReducedMotion();
  const pressScale = useSharedValue(1);
  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = () => {
    pressScale.value = reducedMotion
      ? 1
      : springMotion(0.96, { damping: 24, stiffness: 360 });
    onPressIn();
  };

  const handlePressOut = () => {
    pressScale.value = reducedMotion ? 1 : springMotion(1, { damping: 20, stiffness: 320 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={{ color: "rgba(255,255,255,0.18)", borderless: false }}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      {...(Platform.OS === "web"
        ? ({
            "aria-selected": isFocused,
            "data-selected": isFocused ? "true" : "false",
          } as any)
        : null)}
      hitSlop={hitSlop}
      style={[styles.tabButton, webTouchableStyle]}
    >
      <Animated.View style={[styles.tabButtonContent, animatedPressStyle]}>
        <View style={styles.iconWrap}>{icon}</View>
        <AppText
          style={[
            styles.label,
            isFocused ? styles.labelActive : styles.labelInactive,
            isRtl && styles.labelRtl,
          ]}
          forceKurdishFont={isRtl}
          forceLatinFont={!isRtl}
          latinRole="bold"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
        >
          {label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

type CustomTabBarProps = BottomTabBarProps & {
  blurTarget?: RefObject<NativeView | null>;
};

export function CustomTabBar({
  state,
  navigation,
  blurTarget,
}: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const activeRouteName = state.routes[state.index]?.name;
  const isRtl = isKu || isAr;

  const items = useMemo(
    () => TAB_ITEMS.map((item) => ({ ...item, label: t(item.labelKey) })),
    [t],
  );
  // Keep layout coordinates LTR and mirror the data exactly once. Native RTL
  // otherwise mirrors the row/absolute inset while indicator math mirrors the
  // index again, placing the active lens under the opposite tab.
  const visualItems = useMemo(
    () => orderTabsForDirection(items, isRtl),
    [isRtl, items],
  );

  const barWidth = Math.max(
    280,
    Math.min(width - TAB_BAR_FLOAT_MARGIN_H * 2, MAX_BAR_WIDTH),
  );
  const iconSize = width < 390 ? 23 : 25;
  const bottomPad = tabBarBottomInset(insets.bottom);
  const slotWidth = (barWidth - BAR_PADDING * 2) / items.length;
  const activeItemIndex = Math.max(
    0,
    visualItems.findIndex((item) => item.route === activeRouteName),
  );
  const indicatorX = useSharedValue(activeItemIndex * slotWidth);
  const indicatorScaleX = useSharedValue(1);
  const indicatorScaleY = useSharedValue(1);
  const hasPositionedIndicator = useRef(false);
  const reducedMotion = useReducedMotion();

  const indicatorTarget = useCallback(
    (index: number) => index * slotWidth,
    [slotWidth],
  );

  useEffect(() => {
    const target = indicatorTarget(activeItemIndex);
    if (!hasPositionedIndicator.current || reducedMotion) {
      indicatorX.value = target;
      hasPositionedIndicator.current = true;
      return;
    }
    indicatorX.value = withTiming(target, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeItemIndex, indicatorTarget, indicatorX, reducedMotion]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: indicatorX.value },
      { scaleX: indicatorScaleX.value },
      { scaleY: indicatorScaleY.value },
    ],
  }));

  const energizeIndicator = () => {
    if (reducedMotion) return;
    indicatorScaleX.value = withSequence(
      withTiming(1.035, { duration: 55 }),
      withTiming(1, { duration: 105, easing: Easing.out(Easing.cubic) }),
    );
    indicatorScaleY.value = withSequence(
      withTiming(0.985, { duration: 55 }),
      withTiming(1, { duration: 105, easing: Easing.out(Easing.cubic) }),
    );
  };

  if (
    pathnameHidesTabBar(pathname) ||
    (activeRouteName && TAB_BAR_HIDDEN_ROUTES.has(activeRouteName))
  ) {
    return null;
  }

  const shellStyle = [
    styles.barShell,
    {
      width: barWidth,
      marginBottom: TAB_BAR_FLOAT_MARGIN_BOTTOM,
    },
  ];

  const contentStyle = [
    styles.barContent,
    Platform.OS !== "web" && {
      direction: "ltr" as const,
    },
  ];

  const tabButtons = (
    <>
      {Platform.OS === "android" ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeLens,
            {
              width: slotWidth - 6,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.13)"
                : "rgba(255,255,255,0.68)",
              borderColor: isDark
                ? "rgba(2,6,23,0.58)"
                : "rgba(51,65,85,0.3)",
            },
            indicatorStyle,
          ]}
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(255,255,255,0.15)", "rgba(255,255,255,0.03)"]
                : ["rgba(255,255,255,0.92)", "rgba(226,232,240,0.32)"]
            }
            style={styles.activeLensSheen}
          />
          <View pointerEvents="none" style={styles.activeLensInnerRim} />
        </Animated.View>
      ) : null}
      {Platform.OS === "android" ? (
        <LinearGradient
          pointerEvents="none"
          colors={
            isDark
              ? ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.025)", "rgba(255,255,255,0)"]
              : ["rgba(255,255,255,0.62)", "rgba(255,255,255,0.16)", "rgba(255,255,255,0)"]
          }
          locations={[0, 0.42, 1]}
          style={styles.glassSheen}
        />
      ) : null}
      {Platform.OS === "android" ? (
        <LinearGradient
          pointerEvents="none"
          colors={
            isDark
              ? ["rgba(2,6,23,0)", "rgba(2,6,23,0.28)"]
              : ["rgba(51,65,85,0)", "rgba(51,65,85,0.16)"]
          }
          locations={[0.52, 1]}
          style={styles.glassBottomShade}
        />
      ) : null}
      {visualItems.map((item) => {
          const routeState = state.routes.find((route) => route.name === item.route);
          if (!routeState) return null;

          const isFocused = activeRouteName === item.route;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: routeState.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(routeState.name, routeState.params);
            }
          };

          return (
            <TabButton
              key={item.route}
              label={item.label}
              isFocused={isFocused}
              isRtl={isRtl}
              icon={item.renderIcon(isFocused, iconSize, colors.foreground, colors.mutedForeground)}
              onPressIn={() => {
                const index = visualItems.findIndex(
                  (candidate) => candidate.route === item.route,
                );
                indicatorX.value = reducedMotion
                  ? indicatorTarget(index)
                  : withTiming(indicatorTarget(index), {
                      duration: 180,
                      easing: Easing.out(Easing.cubic),
                    });
                energizeIndicator();
                router.prefetch(item.href);
              }}
              onPress={onPress}
            />
          );
        })}
    </>
  );

  return (
    <View style={[styles.host, { paddingBottom: bottomPad }]}>
      {Platform.OS === "android" ? (
        <View style={shellStyle}>
          <BlurView
            blurTarget={blurTarget}
            blurMethod="dimezisBlurViewSdk31Plus"
            blurReductionFactor={2.6}
            intensity={82}
            tint={isDark ? "dark" : "extraLight"}
            style={styles.androidBlur}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.androidFrost,
              {
                backgroundColor: isDark
                  ? "rgba(15,23,42,0.52)"
                  : "rgba(241,245,249,0.5)",
              },
            ]}
          />
          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ["rgba(255,255,255,0.28)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]
                : ["rgba(255,255,255,0.98)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0)"]
            }
            locations={[0, 0.32, 1]}
            style={styles.androidSpecular}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.androidDarkRim,
              {
                borderColor: isDark
                  ? "rgba(2,6,23,0.64)"
                  : "rgba(51,65,85,0.28)",
              },
            ]}
          />
          <View style={contentStyle}>{tabButtons}</View>
        </View>
      ) : (
        <View
          {...(Platform.OS === "web"
            ? ({ dir: "ltr" } as any)
            : null)}
          style={[shellStyle, contentStyle]}
        >
          {tabButtons}
        </View>
      )}
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  host: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },
  barShell: {
    height: TAB_BAR_INNER_HEIGHT,
    alignSelf: "center",
    borderRadius: 30,
    backgroundColor: Platform.OS === "web"
      ? colors.surfaceRaised
      : "transparent",
    ...crossShadow({
      color: "#0F172A",
      offsetY: 10,
      blur: 28,
      opacity: isDark ? 0.3 : 0.18,
      elevation: 14,
    }),
  },
  androidBlur: {
    ...StyleSheet.absoluteFill,
    borderRadius: 30,
    overflow: "hidden",
  },
  androidFrost: {
    borderRadius: 30,
    overflow: "hidden",
  },
  androidSpecular: {
    position: "absolute",
    top: 0,
    left: 12,
    right: 12,
    height: "48%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  androidDarkRim: {
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
  },
  barContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.82)",
    paddingHorizontal: BAR_PADDING,
    paddingVertical: BAR_PADDING,
    overflow: "hidden",
  },
  glassSheen: {
    ...StyleSheet.absoluteFill,
    borderRadius: 30,
  },
  glassBottomShade: {
    ...StyleSheet.absoluteFill,
    borderRadius: 30,
  },
  activeLens: {
    position: "absolute",
    left: BAR_PADDING + 3,
    top: BAR_PADDING,
    bottom: BAR_PADDING,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    zIndex: 1,
    ...crossShadow({
      color: "#334155",
      offsetY: 3,
      blur: 8,
      opacity: isDark ? 0.28 : 0.14,
      elevation: 3,
    }),
  },
  activeLensSheen: {
    ...StyleSheet.absoluteFill,
    borderRadius: 23,
  },
  activeLensInnerRim: {
    ...StyleSheet.absoluteFill,
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.76)",
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    paddingHorizontal: 4,
    overflow: "hidden",
    zIndex: 3,
  },
  tabButtonContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 2,
    maxWidth: "100%",
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: "800",
    includeFontPadding: false,
    textAlign: "center",
  },
  labelActive: {
    color: colors.foreground,
  },
  labelInactive: {
    color: colors.mutedForeground,
  },
  labelRtl: {
    writingDirection: "rtl",
  },
  });
}
