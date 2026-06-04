import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { OfflineBanner } from "@/components/OfflineBanner";
import { initSentry, Sentry } from "@/lib/sentry";
import { fontMap } from "@/fontMap";
import { useFontStore } from "@/stores/useFontStore";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useContentAdminStore } from "@/stores/useContentAdminStore";
import { syncHomeWidget } from "@/services/home-widget-sync";
import { BottomSheetModalProvider } from "@expo/ui/community/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { Platform, Text } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

initSentry();

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
  (Text as any).defaultProps = (Text as any).defaultProps ?? {};
  (Text as any).defaultProps.style = { fontFamily: kurdishFontFamily };
}

function RootLayout() {
  const { selectedFont, ready: fontReady } = useFontStore();
  const progressReady = useProgressStore((s) => s.ready);
  const settingsReady = useSettingsStore((s) => s.ready);
  const contentAdminReady = useContentAdminStore((s) => s.ready);
  const onboardingReady = useOnboardingStore((s) => s.ready);
  const onboardingComplete = useOnboardingStore((s) => s.completed);
  const ready =
    fontReady && progressReady && settingsReady && contentAdminReady && onboardingReady;

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
    "--font-rd-bold": selectedFont,
    "--font-rd-medium": selectedFont,
    "--font-rd-regular": selectedFont,
  };

  return (
    <SafeAreaProvider>
      <OfflineBanner />
      <GestureHandlerRootView style={[{ flex: 1 }, rnWebVars as any]}>
        <AppErrorBoundary>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={onboardingComplete}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="role-play" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
              </Stack.Protected>
              <Stack.Protected guard={!onboardingComplete}>
                <Stack.Screen name="onboarding" />
              </Stack.Protected>
            </Stack>
          </BottomSheetModalProvider>
        </AppErrorBoundary>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
export default sentryDsn ? Sentry.wrap(RootLayout) : RootLayout;
