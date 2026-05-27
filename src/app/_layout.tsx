import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { CustomTabBar } from "@/components/CustomTabBar";
import { ENABLE_SHOP } from "@/constants/feature-flags";
import { fontMap } from "@/fontMap";
import { useFontStore } from "@/stores/useFontStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { syncHomeWidget } from "@/services/home-widget-sync";
import { BottomSheetModalProvider } from "@expo/ui/community/bottom-sheet";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { Platform, Text } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerPhingoAndroidWidgetHandler } from "@/widgets/android-widget-handler";
import "../global.css";

registerPhingoAndroidWidgetHandler();

SplashScreen.preventAutoHideAsync().catch(() => {});

function applyGlobalFont(kurdishFontFamily: string) {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    document.documentElement.style.setProperty(
      "--font-rd-bold",
      `'${kurdishFontFamily}'`,
    );
    document.documentElement.style.setProperty(
      "--font-rd-medium",
      `'${kurdishFontFamily}'`,
    );
    document.documentElement.style.setProperty(
      "--font-rd-regular",
      `'${kurdishFontFamily}'`,
    );
  }
  // Fallback when styles omit fontFamily — AppText picks Rabar vs DIN per string.
  (Text as any).defaultProps = (Text as any).defaultProps ?? {};
  (Text as any).defaultProps.style = { fontFamily: kurdishFontFamily };
}

export default function TabLayout() {
  const { selectedFont, ready: fontReady } = useFontStore();
  const progressReady = useProgressStore((s) => s.ready);
  const settingsReady = useSettingsStore((s) => s.ready);
  const ready = fontReady && progressReady && settingsReady;

  useEffect(() => {
    applyGlobalFont(selectedFont);
  }, [selectedFont]);

  const [fontsLoaded] = useFonts(fontMap);

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded && ready) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, ready]);

  useEffect(() => {
    onLayoutReady();
  }, [onLayoutReady]);

  useEffect(() => {
    if (ready) {
      void syncHomeWidget();
    }
  }, [ready]);

  if (!fontsLoaded || !ready) {
    return null;
  }

  const rnWebVars = Platform.OS === "web" ? {} : {
    "--font-rd-bold":    selectedFont,
    "--font-rd-medium":  selectedFont,
    "--font-rd-regular": selectedFont,
  };

  return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={[{ flex: 1 }, rnWebVars as any]}>
      <AppErrorBoundary>
      <BottomSheetModalProvider>
        <Tabs
          initialRouteName="index"
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "#B4B8C3",
            // Fast fade — lighter than morph/shift on low-end devices
            animation: "fade",
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="dashboard" />
          <Tabs.Screen name="feed" />
          <Tabs.Screen
            name="subscription"
            options={{ href: ENABLE_SHOP ? undefined : null }}
          />
          <Tabs.Screen name="more" />
          <Tabs.Screen
            name="quest"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="league"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="lesson"
            options={{
              headerShown: false,
              href: null,
              tabBarStyle: { display: "none" },
            }}
          />
          <Tabs.Screen
            name="guidebook"
            options={{
              headerShown: false,
              href: null,
              tabBarStyle: { display: "none" },
            }}
          />
          <Tabs.Screen
            name="roleplay"
            options={{
              headerShown: false,
              href: null,
              tabBarStyle: { display: "none" },
            }}
          />
          <Tabs.Screen
            name="ai-teacher"
            options={{
              headerShown: false,
              href: null,
              tabBarStyle: { display: "none" },
            }}
          />
          <Tabs.Screen name="privacy-policy" options={{ href: null }} />
          <Tabs.Screen name="ai-safety" options={{ href: null }} />
          <Tabs.Screen name="terms" options={{ href: null }} />
        </Tabs>
      </BottomSheetModalProvider>
      </AppErrorBoundary>
    </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
