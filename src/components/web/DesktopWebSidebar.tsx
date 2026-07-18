import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

import {
  GamesTabIcon,
  HomeTabIconFlat,
  LeaderboardTabIcon,
  ProfileTabIconFlat,
} from "../icons/HomeDashboardIcons";
import { TwinoWordmark } from "../icons/TwinoHomeIcons";
import { AppText } from "../ui/AppText";
import { WEB_DESKTOP_NAV_WIDTH } from "../../constants/web-layout";
import type { I18nKey } from "../../i18n";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";

const ITEMS: {
  href: "/" | "/play" | "/dashboard" | "/more";
  labelKey: I18nKey;
  isActive: (pathname: string) => boolean;
  renderIcon: (active: boolean, color: string) => React.ReactNode;
}[] = [
  {
    href: "/",
    labelKey: "tabs.home",
    isActive: (pathname) => pathname === "/" || pathname === "/index",
    renderIcon: (active, color) => (
      <HomeTabIconFlat size={28} color={active ? "#1CB0F6" : color} />
    ),
  },
  {
    href: "/play",
    labelKey: "tabs.games",
    isActive: (pathname) => pathname === "/play",
    renderIcon: (active, color) => (
      <GamesTabIcon size={28} color={active ? "#1CB0F6" : color} />
    ),
  },
  {
    href: "/dashboard",
    labelKey: "tabs.leaderboard",
    isActive: (pathname) => pathname === "/dashboard",
    renderIcon: (active, color) => (
      <LeaderboardTabIcon
        size={28}
        color={active ? "#1CB0F6" : color}
      />
    ),
  },
  {
    href: "/more",
    labelKey: "tabs.profile",
    isActive: (pathname) => pathname === "/more",
    renderIcon: (active, color) => (
      <ProfileTabIconFlat
        size={28}
        color={active ? "#1CB0F6" : color}
      />
    ),
  },
];

const webTouchableStyle =
  Platform.OS === "web"
    ? ({
        WebkitTapHighlightColor: "transparent",
        cursor: "pointer",
        outlineStyle: "none",
        userSelect: "none",
      } as unknown as ViewStyle)
    : undefined;

export function DesktopWebSidebar() {
  const pathname = usePathname();
  const { t, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark],
  );

  return (
    <View style={styles.host}>
      <View style={styles.brand}>
        <TwinoWordmark height={38} />
      </View>

      <View style={styles.nav}>
        {ITEMS.map((item) => {
          const active = item.isActive(pathname);
          const label = t(item.labelKey);

          return (
            <Pressable
              key={item.href}
              onPressIn={() => router.prefetch(item.href)}
              onPress={() => {
                if (!active) router.replace(item.href);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={label}
              {...({
                "aria-selected": active,
                "data-selected": active ? "true" : "false",
              } as any)}
              style={({ pressed }) => [
                styles.tab,
                active && styles.tabActive,
                pressed && styles.tabPressed,
                webTouchableStyle,
              ]}
            >
              <View style={styles.iconWrap}>
                {item.renderIcon(active, colors.mutedForeground)}
              </View>
              <AppText
                style={[
                  styles.label,
                  active ? styles.labelActive : styles.labelInactive,
                  { textAlign: isKu ? "right" : "left" },
                ]}
                forceKurdishFont={isKu}
                forceLatinFont={!isKu}
                latinRole="bold"
                numberOfLines={1}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppText style={styles.footerTitle} forceLatinFont latinRole="bold">
          TWINO
        </AppText>
        <AppText style={styles.footerText} forceLatinFont>
          Learn English every day
        </AppText>
      </View>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    host: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: WEB_DESKTOP_NAV_WIDTH,
      zIndex: 20,
      backgroundColor: colors.background,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: colors.border,
      paddingHorizontal: 18,
      paddingTop: 28,
      paddingBottom: 24,
    },
    brand: {
      minHeight: 62,
      justifyContent: "center",
      paddingHorizontal: 12,
      marginBottom: 16,
    },
    nav: {
      gap: 8,
    },
    tab: {
      minHeight: 58,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: "transparent",
      paddingHorizontal: 16,
    },
    tabActive: {
      backgroundColor: isDark
        ? "rgba(28,176,246,0.12)"
        : "rgba(28,176,246,0.08)",
      borderColor: "#1CB0F6",
    },
    tabPressed: {
      opacity: 0.72,
      transform: [{ translateY: 1 }],
    },
    iconWrap: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      flex: 1,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "800",
      letterSpacing: 0.45,
      textTransform: "uppercase",
    },
    labelActive: {
      color: "#1CB0F6",
    },
    labelInactive: {
      color: colors.foreground,
    },
    footer: {
      marginTop: "auto",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingHorizontal: 12,
      paddingTop: 18,
      gap: 3,
    },
    footerTitle: {
      color: colors.foreground,
      fontSize: 12,
      letterSpacing: 1.2,
    },
    footerText: {
      color: colors.mutedForeground,
      fontSize: 12,
      lineHeight: 17,
    },
  });
}
