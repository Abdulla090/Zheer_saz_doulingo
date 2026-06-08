/* eslint-disable react-hooks/set-state-in-effect */
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { OfflineBanner } from "@/components/OfflineBanner";
import { initSentry, Sentry } from "@/lib/sentry";
import { fontMap } from "@/fontMap";
import { useFontStore } from "@/stores/useFontStore";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useContentAdminStore } from "@/stores/useContentAdminStore";
import { useAndroidImmersiveChrome } from "@/hooks/use-android-immersive-chrome";
import { NavigationBar } from "expo-navigation-bar";
import { syncHomeWidget } from "@/services/home-widget-sync";
import { BottomSheetModalProvider } from "@expo/ui/community/bottom-sheet";
import { useLocaleStore } from "@/stores/useLocaleStore";
import { useFonts } from "expo-font";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect } from "react";
import { Platform, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { KeyboardProvider } from "react-native-keyboard-controller";
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
  useAndroidImmersiveChrome();

  const { selectedFont, ready: fontStoreReady } = useFontStore();
  const progressReady = useProgressStore((s) => s.ready);
  const settingsReady = useSettingsStore((s) => s.ready);
  const contentAdminReady = useContentAdminStore((s) => s.ready);
  const onboardingReady = useOnboardingStore((s) => s.ready);
  const onboardingComplete = useOnboardingStore((s) => s.completed);
  const locale = useLocaleStore((s) => s.locale);

  const [kurdishFontLoaded, setKurdishFontLoaded] = React.useState(false);

  useEffect(() => {
    if (fontStoreReady && selectedFont) {
      if (Font.isLoaded(selectedFont)) {
        setKurdishFontLoaded(true);
        return;
      }
      setKurdishFontLoaded(false);
      const fontFile = fontMap[selectedFont as keyof typeof fontMap];
      if (fontFile) {
        Font.loadAsync({
          [selectedFont]: fontFile,
        })
          .then(() => {
            setKurdishFontLoaded(true);
          })
          .catch((err) => {
            console.error("Failed to load Kurdish font dynamically:", selectedFont, err);
            setKurdishFontLoaded(true);
          });
      } else {
        setKurdishFontLoaded(true);
      }
    }
  }, [selectedFont, fontStoreReady]);

  const ready =
    fontStoreReady &&
    kurdishFontLoaded &&
    progressReady &&
    settingsReady &&
    contentAdminReady &&
    onboardingReady;

  useEffect(() => {
    applyGlobalFont(selectedFont);
  }, [selectedFont]);

  const [coreFontsLoaded] = useFonts({
    DINNextRoundedBold: require("@/assets/fonts/DIN_BOLD.ttf"),
    DINNextRoundedMedium: require("@/assets/fonts/DIN_MEDIUM.ttf"),
    DINNextRoundedRegular: require("@/assets/fonts/DIN_REGULAR.ttf"),
  });

  const onLayoutReady = useCallback(async () => {
    if (coreFontsLoaded && ready) {
      await SplashScreen.hideAsync();
    }
  }, [coreFontsLoaded, ready]);

  useEffect(() => {
    onLayoutReady();
  }, [onLayoutReady]);

  useEffect(() => {
    if (ready) {
      void syncHomeWidget();
    }
  }, [ready]);

  if (!coreFontsLoaded || !ready) {
    return null;
  }

  const rnWebVars = Platform.OS === "web" ? {} : {
    "--font-rd-bold": selectedFont,
    "--font-rd-medium": selectedFont,
    "--font-rd-regular": selectedFont,
  };

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <StatusBar
          hidden={Platform.OS === "android"}
          style="auto"
          {...({ translucent: true } as any)}
        />
        {Platform.OS === "android" ? <NavigationBar hidden /> : null}
        <OfflineBanner />
        <GestureHandlerRootView style={[{ flex: 1, direction: locale === "ku" ? "rtl" : "ltr" }, rnWebVars as any]}>
          <AppErrorBoundary>
            <BottomSheetModalProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade",
                }}
              >
                <Stack.Protected guard={onboardingComplete}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="role-play"
                    options={{ presentation: "fullScreenModal", animation: "fade" }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={!onboardingComplete}>
                  <Stack.Screen name="onboarding" />
                </Stack.Protected>
              </Stack>
            </BottomSheetModalProvider>
          </AppErrorBoundary>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
