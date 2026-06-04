import { Colors } from "@/constants/theme";
import { pathnameHidesTabBar } from "@/constants/tab-navigation";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "@/context/tab-bar-visibility";
import { ENABLE_SHOP } from "@/constants/feature-flags";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useI18n } from "@/hooks/useI18n";
import { hapticSelection } from "@/utils/haptics";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { usePathname } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import React, { useMemo } from "react";
import { DynamicColorIOS, Platform } from "react-native";

const BRAND = "#2B59F3";
const INACTIVE = "#8E95A3";

const BRAND_TINT =
  Platform.OS === "ios"
    ? DynamicColorIOS({ light: BRAND, dark: "#6B8AFF" })
    : BRAND;

const INACTIVE_TINT =
  Platform.OS === "ios"
    ? DynamicColorIOS({ light: INACTIVE, dark: "#98989D" })
    : INACTIVE;

function NativeTabsLayout() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { hidden: contextHidden } = useTabBarVisibility();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const hideTabBar = contextHidden || pathnameHidesTabBar(pathname);

  const contentStyle = useMemo(
    () => ({ backgroundColor: theme.background }),
    [theme.background],
  );

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs
        hidden={hideTabBar}
        backgroundColor="transparent"
        blurEffect={Platform.OS === "ios" ? "systemChromeMaterialLight" : undefined}
        shadowColor="transparent"
        minimizeBehavior={Platform.OS === "ios" ? "onScrollDown" : "never"}
        tintColor={BRAND_TINT}
        iconColor={{ default: INACTIVE_TINT, selected: BRAND_TINT }}
        indicatorColor={BRAND}
        labelVisibilityMode="labeled"
        rippleColor="rgba(43, 89, 243, 0.14)"
        labelStyle={{
          default: {
            color: INACTIVE_TINT,
            fontSize: 10,
            fontWeight: "600",
          },
          selected: {
            color: BRAND_TINT,
            fontSize: 10,
            fontWeight: "700",
          },
        }}
        screenListeners={{
          tabPress: () => {
            hapticSelection();
          },
        }}
      >
        <NativeTabs.Trigger name="feed" contentStyle={contentStyle}>
          <NativeTabs.Trigger.Icon
            sf={{ default: "gamecontroller", selected: "gamecontroller.fill" }}
            md={{ default: "sports_esports", selected: "sports_esports" }}
          />
          <NativeTabs.Trigger.Label>{t("tabs.games")}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="index" contentStyle={contentStyle}>
          <NativeTabs.Trigger.Icon
            sf={{ default: "house", selected: "house.fill" }}
            md={{ default: "home", selected: "home" }}
          />
          <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger
          name="subscription"
          hidden={!ENABLE_SHOP}
          contentStyle={contentStyle}
        >
          <NativeTabs.Trigger.Icon
            sf={{ default: "bag", selected: "bag.fill" }}
            md={{ default: "shopping_bag", selected: "shopping_bag" }}
          />
          <NativeTabs.Trigger.Label>{t("tabs.shop")}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="more" contentStyle={contentStyle}>
          <NativeTabs.Trigger.Icon
            sf={{ default: "person", selected: "person.fill" }}
            md={{ default: "person", selected: "person" }}
          />
          <NativeTabs.Trigger.Label>{t("tabs.profile")}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}

/** iOS + Android dev build: system tab bar (Liquid Glass / Material 3). */
export default function NativeTabsShell() {
  return (
    <TabBarVisibilityProvider>
      <NativeTabsLayout />
    </TabBarVisibilityProvider>
  );
}
