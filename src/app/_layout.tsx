 
import "../utils/web-deprecations-patch";
import { AppErrorBoundary } from "../components/AppErrorBoundary";
import { SkiaWebGate } from "../components/animations/skia-gsap-opening/SkiaWebGate";
import { OfflineBanner } from "../components/OfflineBanner";
import { initSentry, Sentry } from "../lib/sentry";
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
import { useLocaleStore } from "../stores/useLocaleStore";
import { useFonts } from "expo-font";
import * as Font from "expo-font";
import * as SecureStore from "expo-secure-store";
import { setRuntimeGeminiApiKey } from "../constants/gemini";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { AuthProvider, useAuth } from "../context/AuthContext";

initSentry();

SplashScreen.preventAutoHideAsync().catch(() => {});

// BottomSheetModalProvider from @expo/ui/community/bottom-sheet loads Jetpack Compose
// native modules (ModalBottomSheet, Host) which can crash in standard APK builds.
// The original implementation is literally just <>{children}</>, so we inline it safely.
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
  const onboardingComplete = useOnboardingStore((s) => s.completed);
  const locale = useLocaleStore((s) => s.locale);
  const { loading: authLoading } = useAuth();

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
    onboardingReady &&
    !authLoading;

  useEffect(() => {
    applyGlobalFont(selectedFont);
  }, [selectedFont]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      SecureStore.getItemAsync("twino.gemini.apikey")
        .then((key: string | null) => {
          if (key) {
            setRuntimeGeminiApiKey(key);
          }
        })
        .catch(() => {});
    } else {
      try {
        if (typeof localStorage !== "undefined") {
          const key = localStorage.getItem("twino.gemini.apikey");
          if (key) {
            setRuntimeGeminiApiKey(key);
          }
        }
      } catch {}
    }
  }, []);

  const [coreFontsLoaded] = useFonts({
    DINNextRoundedBold: require("../../assets/fonts/DIN_BOLD.ttf"),
    DINNextRoundedMedium: require("../../assets/fonts/DIN_MEDIUM.ttf"),
    DINNextRoundedRegular: require("../../assets/fonts/DIN_REGULAR.ttf"),
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
      void fetchRemoteCurriculum("street");
      void fetchRemoteCurriculum("normal");
      void fetchRemoteCurriculum("kids");
    }
  }, [ready]);

  if (!coreFontsLoaded || !ready) {
    // Return a plain white view matching the splash background — never a bare null
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
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
        {/* NavigationBar declarative component removed — it loads Jetpack Compose
            native modules that crash in standard APK builds (same issue as
            BottomSheetModalProvider above). The imperative API in
            useAndroidImmersiveChrome already handles hiding the nav bar. */}
        <OfflineBanner />
        <GestureHandlerRootView style={[{ flex: 1, direction: locale === "ku" ? "rtl" : "ltr" }, rnWebVars as any]}>
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

const WrappedInnerLayout = Sentry.wrap(InnerLayout);

function RootLayout() {
  return (
    <AuthProvider>
      <WrappedInnerLayout />
    </AuthProvider>
  );
}

export default Sentry.wrap(RootLayout);
