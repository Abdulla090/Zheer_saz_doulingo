import { CustomTabBar } from "@/components/CustomTabBar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nManager, Platform, Text } from "react-native";
import { fontMap } from "@/fontMap";
import { useFontStore } from "@/stores/useFontStore";
import "../global.css";

export default function TabLayout() {
  const { selectedFont, ready } = useFontStore();

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.dir = "rtl";
    }
  }, []);

  // ── Apply selected font to all Text components globally ───────────────
  // This runs every time the user picks a different font in Settings.
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.style.setProperty("--font-rd-bold",    `'${selectedFont}'`);
      document.documentElement.style.setProperty("--font-rd-medium",  `'${selectedFont}'`);
      document.documentElement.style.setProperty("--font-rd-regular", `'${selectedFont}'`);
    }
    // RN global Text default — makes every <Text> in the app use the chosen font
    (Text as any).defaultProps = (Text as any).defaultProps ?? {};
    (Text as any).defaultProps.style = { fontFamily: selectedFont };
  }, [selectedFont]);

  // Load ALL Rabar fonts upfront so switching is instant (no network round-trip)
  const [fontsLoaded] = useFonts(fontMap);

  // Don't render until fonts are loaded AND the store has hydrated from storage
  if (!fontsLoaded || !ready) {
    return null;
  }

  // Apply immediately (synchronous, before first paint so there's no flash)
  (Text as any).defaultProps = (Text as any).defaultProps ?? {};
  (Text as any).defaultProps.style = { fontFamily: selectedFont };

  const rnWebVars = Platform.OS === "web" ? {} : {
    "--font-rd-bold":    selectedFont,
    "--font-rd-medium":  selectedFont,
    "--font-rd-regular": selectedFont,
  };

  return (
    <GestureHandlerRootView style={[{ flex: 1 }, rnWebVars as any]}>
      <BottomSheetModalProvider>
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "#B4B8C3",
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="quest" />
          <Tabs.Screen name="league" />
          <Tabs.Screen name="feed" />
          <Tabs.Screen name="subscription" />
          <Tabs.Screen name="more" />
          <Tabs.Screen
            name="lesson"
            options={{
              headerShown: false,
              tabBarButton: () => null,
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
