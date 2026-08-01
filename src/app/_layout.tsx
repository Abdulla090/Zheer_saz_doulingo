import "../utils/web-deprecations-patch";
import { AppErrorBoundary } from "../components/AppErrorBoundary";
import { SkiaWebGate } from "../components/animations/skia-gsap-opening/SkiaWebGate";
import { OfflineBanner } from "../components/OfflineBanner";
import { initSentry, wrapSentry } from "../lib/sentry";
import { isSupabaseConfigured } from "../lib/supabase";
import { fontMap } from "../fontMap";
import { useFontStore } from "../stores/useFontStore";
import { useOnboardingStore } from "../stores/useOnboardingStore";
import { useProgressStore } from "../stores/useProgressStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useContentAdminStore } from "../stores/useContentAdminStore";
import { useAndroidImmersiveChrome } from "../hooks/use-android-immersive-chrome";
// NavigationBar import removed — declarative <NavigationBar hidden /> component
// crashed on APK builds. useAndroidImmersiveChrome handles it imperatively.
import { syncHomeWidget } from "../services/home-widget-sync";
import { fetchRemoteCurriculum } from "../services/curriculum-loader";
import { applyUiLanguageDirection, useLocaleStore } from "../stores/useLocaleStore";
import { getLanguageDirection } from "../i18n/direction";
import { useFonts } from "expo-font";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";

initSentry();

// Prevent the native splash screen from auto-hiding until initial assets/stores are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

function BottomSheetModalProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

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
}

function InnerLayout() {
  useAndroidImmersiveChrome();

  const { selectedFont, ready: fontStoreReady } = useFontStore();
  const progressReady = useProgressStore((s) => s.ready);
  const settingsReady = useSettingsStore((s) => s.ready);
  const contentAdminReady = useContentAdminStore((s) => s.ready);
  const onboardingReady = useOnboardingStore((s) => s.ready);
  const uiLanguage = useLocaleStore((s) => s.selectedUiLanguage);

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

  const [fontsLoaded] = useFonts({
    DINNextRoundedBold: require("../../assets/fonts/DIN_BOLD.ttf"),
    DINNextRoundedMedium: require("../../assets/fonts/DIN_MEDIUM.ttf"),
    DINNextRoundedRegular: require("../../assets/fonts/DIN_REGULAR.ttf"),
  });

  // Hide the native splash screen as soon as fonts and stores are ready, or after a maximum safety timeout.
  useEffect(() => {
    let hidden = false;
    const hideSplash = () => {
      if (!hidden) {
        hidden = true;
        void SplashScreen.hideAsync().catch(() => {});
      }
    };

    if (ready && fontsLoaded) {
      hideSplash();
    }

    // Safety fallback: guarantee splash screen is hidden within 1.5 seconds max
    const timer = setTimeout(hideSplash, 1500);
    return () => clearTimeout(timer);
  }, [ready, fontsLoaded]);

  useEffect(() => {
    applyUiLanguageDirection(uiLanguage);
  }, [uiLanguage]);

  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const isRTL = getLanguageDirection(uiLanguage) === "rtl";
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = uiLanguage;
      document.documentElement.style.direction = isRTL ? "rtl" : "ltr";
    }
  }, [uiLanguage]);

  useEffect(() => {
    if (ready) {
      void syncHomeWidget();
      void fetchRemoteCurriculum("street");
      void fetchRemoteCurriculum("normal");
      void fetchRemoteCurriculum("kids");
    }
  }, [ready]);

  const rnWebVars = Platform.OS === "web" ? {} : {
    "--font-rd-bold": selectedFont,
    "--font-rd-medium": selectedFont,
    "--font-rd-regular": selectedFont,
  };

  const isRTL = getLanguageDirection(uiLanguage) === "rtl";

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <StatusBar
          hidden={Platform.OS === "android"}
          style="auto"
          {...({ translucent: true } as any)}
        />
        {/* NavigationBar declarative component removed — it loads Jetpack Compose
            native modules that crash in standard APK builds (same issue as
            BottomSheetModalProvider above). The imperative API in
            useAndroidImmersiveChrome already handles hiding the nav bar. */}
        <OfflineBanner />
        <GestureHandlerRootView
          style={[
            { flex: 1 },
            Platform.OS !== "web" && { direction: isRTL ? "rtl" : "ltr" },
            rnWebVars as any,
          ]}
        >
          <SkiaWebGate>
          <AppErrorBoundary>
            <BottomSheetModalProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade",
                }}
              >
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="roleplay"
                    options={{ presentation: "fullScreenModal", animation: "fade" }}
                  />
                  <Stack.Screen name="lesson" />
                  <Stack.Screen name="guidebook" options={{ animation: "fade" }} />
                  <Stack.Screen name="ai-teacher" />
                  <Stack.Screen name="voice-tutor" />
                  <Stack.Screen name="path" options={{ animation: "fade" }} />
                  <Stack.Screen name="podcast" />
                  <Stack.Screen name="slang" />
                  <Stack.Screen name="reading-practice" />
                  <Stack.Screen name="quest" />
                  <Stack.Screen name="league" />
                  <Stack.Screen name="privacy-policy" />
                  <Stack.Screen name="ai-safety" />
                  <Stack.Screen name="terms" />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="auth" />
                  <Stack.Screen name="admin/index" />
                  <Stack.Screen name="admin/unit" />
                  <Stack.Screen name="admin/lesson" />
                  <Stack.Screen name="onboarding" />
              </Stack>
            </BottomSheetModalProvider>
          </AppErrorBoundary>
          </SkiaWebGate>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

const WrappedInnerLayout = wrapSentry(InnerLayout);

function ConfigurationErrorScreen() {
  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <View style={configurationStyles.screen}>
      <Text style={configurationStyles.eyebrow}>TWINO</Text>
      <Text style={configurationStyles.title}>App setup is incomplete</Text>
      <Text style={configurationStyles.body}>
        This installation is missing its connection settings. Please install a
        correctly configured release.
      </Text>
    </View>
  );
}

const configurationStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#F8FAFC",
  },
  eyebrow: {
    marginBottom: 18,
    color: "#3159D9",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2.4,
  },
  title: {
    color: "#15213A",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  body: {
    maxWidth: 340,
    marginTop: 12,
    color: "#657089",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});

function RootLayout() {
  if (!isSupabaseConfigured) {
    return <ConfigurationErrorScreen />;
  }

  return (
    <AuthProvider>
      <WrappedInnerLayout />
    </AuthProvider>
  );
}

export default wrapSentry(RootLayout);
