import { CustomTabBar } from "@/components/CustomTabBar";
import { fontMap } from "@/fontMap";
import { useFontStore } from "@/stores/useFontStore";
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
import "../global.css";

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
  const { selectedFont, ready } = useFontStore();

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

  if (!fontsLoaded || !ready) {
    return null;
  }

  applyGlobalFont(selectedFont);

  const rnWebVars = Platform.OS === "web" ? {} : {
    "--font-rd-bold":    selectedFont,
    "--font-rd-medium":  selectedFont,
    "--font-rd-regular": selectedFont,
  };

  return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={[{ flex: 1 }, rnWebVars as any]}>
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
          <Tabs.Screen name="subscription" />
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
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
