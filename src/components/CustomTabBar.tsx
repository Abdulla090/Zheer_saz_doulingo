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
import { useTabTransition } from "../context/TabTransitionContext";
import type { I18nKey } from "../i18n";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { crossShadow } from "../utils/shadows";
import { AppText } from "./ui/AppText";

const ACTIVE = "#0F172A";
const INACTIVE = "#64748B";
const ACTIVE_FILL = "rgba(15, 23, 42, 0.08)";
const ACTIVE_BORDER = "rgba(15, 23, 42, 0.08)";
const MAX_BAR_WIDTH = 460;

type TabRoute = "index" | "play" | "dashboard" | typeof TAB_FAB_ROUTE;

const TAB_ITEMS: {
  route: TabRoute;
  href: "/" | "/play" | "/dashboard" | "/more";
  labelKey: I18nKey;
  renderIcon: (active: boolean, size: number) => React.ReactNode;
}[] = [
  {
    route: "index",
    href: "/",
    labelKey: "tabs.home",
    renderIcon: (active, size) => (
      <HomeTabIconFlat size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "play",
    href: "/play",
    labelKey: "tabs.games",
    renderIcon: (active, size) => (
      <GamesTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: "dashboard",
    href: "/dashboard",
    labelKey: "tabs.leaderboard",
    renderIcon: (active, size) => (
      <LeaderboardTabIcon size={size} color={active ? ACTIVE : INACTIVE} />
    ),
  },
  {
    route: TAB_FAB_ROUTE,
    href: "/more",
    labelKey: "tabs.profile",
    renderIcon: (active, size) => (
      <ProfileTabIconFlat size={size} color={active ? ACTIVE : INACTIVE} />
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
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      android_ripple={{ color: "rgba(15, 23, 42, 0.08)", borderless: false }}
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
      style={({ pressed }) => [
        styles.tabButton,
        isFocused && styles.tabButtonActive,
        pressed && styles.tabButtonPressed,
        webTouchableStyle,
      ]}
    >
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
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();
  const { prepareTransition } = useTabTransition();
  const activeRouteName = state.routes[state.index]?.name;
  const isRtl = isKu || isAr;

  const items = useMemo(
    () => TAB_ITEMS.map((item) => ({ ...item, label: t(item.labelKey) })),
    [t],
  );

  const barWidth = Math.max(
    280,
    Math.min(width - TAB_BAR_FLOAT_MARGIN_H * 2, MAX_BAR_WIDTH),
  );
  const iconSize = width < 390 ? 23 : 25;
  const bottomPad = tabBarBottomInset(insets.bottom);

  if (
    pathnameHidesTabBar(pathname) ||
    (activeRouteName && TAB_BAR_HIDDEN_ROUTES.has(activeRouteName))
  ) {
    return null;
  }

  return (
    <View style={[styles.host, { paddingBottom: bottomPad }]}>
      <View
        style={[
          styles.bar,
          {
            width: barWidth,
            marginBottom: TAB_BAR_FLOAT_MARGIN_BOTTOM,
            flexDirection: isRtl ? "row-reverse" : "row",
          },
        ]}
      >
        {items.map((item) => {
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
              prepareTransition(activeRouteName ?? "", item.route, isRtl);
              navigation.navigate(routeState.name, routeState.params);
            }
          };

          return (
            <TabButton
              key={item.route}
              label={item.label}
              isFocused={isFocused}
              isRtl={isRtl}
              icon={item.renderIcon(isFocused, iconSize)}
              onPressIn={() => router.prefetch(item.href)}
              onPress={onPress}
            />
          );
        })}
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
    alignItems: "center",
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },
  bar: {
    height: TAB_BAR_INNER_HEIGHT,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(15, 23, 42, 0.10)",
    backgroundColor: Platform.OS === "web" ? "#FFFFFF" : "rgba(255,255,255,0.96)",
    paddingHorizontal: 6,
    paddingVertical: 6,
    ...crossShadow({
      color: "#0F172A",
      offsetY: 8,
      blur: 22,
      opacity: 0.16,
      elevation: 10,
    }),
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
    paddingHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: ACTIVE_FILL,
    borderColor: ACTIVE_BORDER,
  },
  tabButtonPressed: {
    opacity: 0.72,
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
    color: ACTIVE,
  },
  labelInactive: {
    color: INACTIVE,
  },
  labelRtl: {
    writingDirection: "rtl",
  },
});
