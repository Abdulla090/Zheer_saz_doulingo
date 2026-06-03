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
  usePathname,
} from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import React, { useMemo } from "react";
import { DynamicColorIOS } from "react-native";

const BRAND_TINT = DynamicColorIOS({ light: "#2B59F3", dark: "#6B8AFF" });
const INACTIVE_TINT = DynamicColorIOS({ light: "#8E95A3", dark: "#98989D" });

function IosNativeTabsLayout() {
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
        minimizeBehavior="onScrollDown"
        tintColor={BRAND_TINT}
        iconColor={{ default: INACTIVE_TINT, selected: BRAND_TINT }}
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
        <NativeTabs.Trigger name="index" contentStyle={contentStyle}>
          <NativeTabs.Trigger.Icon
            sf={{ default: "house", selected: "house.fill" }}
            md={{ default: "home", selected: "home" }}
          />
          <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="dashboard" contentStyle={contentStyle}>
          <NativeTabs.Trigger.Icon
            sf={{ default: "map", selected: "map.fill" }}
            md={{ default: "route", selected: "route" }}
          />
          <NativeTabs.Trigger.Label>{t("tabs.path")}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="feed" contentStyle={contentStyle}>
          <NativeTabs.Trigger.Icon
            sf={{ default: "gamecontroller", selected: "gamecontroller.fill" }}
            md={{ default: "sports_esports", selected: "sports_esports" }}
          />
          <NativeTabs.Trigger.Label>{t("tabs.games")}</NativeTabs.Trigger.Label>
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

export default function TabsLayout() {
  return (
    <TabBarVisibilityProvider>
      <IosNativeTabsLayout />
    </TabBarVisibilityProvider>
  );
}
