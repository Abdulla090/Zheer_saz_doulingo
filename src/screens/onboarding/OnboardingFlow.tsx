import type { PathMode } from "../home/components/PathSwitcher";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState, useRef } from "react";
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { OnboardingSlide, type OnboardingSlideModel } from "./components/OnboardingSlide";
import { LanguageSelectionFlow } from "./LanguageSelectionFlow";
import { OnboardingSkiaBg } from "./components/OnboardingSkiaBg";
import { AppText } from "../../components/ui/AppText";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useRouter } from "expo-router";

/* Blue → Indigo order */
const STEP_IDS = ["learn_conversation", "grow_every_day", "achieve_fluency"] as const;

export function OnboardingFlow() {
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const router = useRouter();

  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const pathMode = useSettingsStore((s) => s.pathMode);
  const setPathMode = useSettingsStore((s) => s.setPathMode);
  const localeReady = useLocaleStore((s) => s.ready);

  const [index, setIndex] = useState(0);
  const [showLangSelection, setShowLangSelection] = useState(false);

  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const [selectedPath] = useState<PathMode>(
    pathMode === "street" || pathMode === "kids" ? pathMode : "normal",
  );

  /* Continuous scroll position for smooth gradient morph */
  const scrollX = useSharedValue(0);
  const rootOpacity = useSharedValue(1);

  const animatedRootStyle = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = Math.abs(event.contentOffset.x);
    },
  });

  const total = STEP_IDS.length;
  const isLast = index === total - 1;

  const slides = useMemo((): OnboardingSlideModel[] => {
    const meta: Record<
      (typeof STEP_IDS)[number],
      { title: string; subtitle: string; icon: any }
    > = {
      learn_conversation: {
        title: "Learn Through Conversation",
        subtitle: "Speak naturally, receive instant corrections, and build confidence every day.",
        icon: ArrowRight01Icon,
      },
      grow_every_day: {
        title: "Grow Every Day",
        subtitle: "Earn rewards, unlock new skills, and watch your language world expand with every conversation.",
        icon: ArrowRight01Icon,
      },
      achieve_fluency: {
        title: "Achieve Fluency",
        subtitle: "Immerse yourself in real-world scenarios and master the language naturally.",
        icon: ArrowRight01Icon,
      },
    };

    return STEP_IDS.map((id) => ({
      id,
      ...meta[id],
    }));
  }, []);

  const finishSlides = useCallback(() => {
    setShowLangSelection(true);
  }, []);

  const finishAll = useCallback(() => {
    setPathMode(selectedPath);
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    completeOnboarding();
    
    // Smooth transition: fade out root view, then replace route to show login screen
    rootOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) {
        runOnJS(router.replace)("/auth?redirect=/(tabs)&showSkip=true");
      }
    });
  }, [completeOnboarding, selectedPath, setPathMode, router]);

  const goNext = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (isLast) {
      finishSlides();
      return;
    }
    const nextIndex = index + 1;

    const isWebRTL = Platform.OS === "web" && I18nManager.isRTL;
    const targetX = nextIndex * screenWidth * (isWebRTL ? -1 : 1);

    scrollRef.current?.scrollTo({
      x: targetX,
      y: 0,
      animated: true,
    } as any);

    setIndex(nextIndex);
  }, [finishSlides, index, isLast, screenWidth]);

  /* Derive discrete index from scroll for dots + button label */
  const handleMomentumEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const offsetX = Math.abs(e.nativeEvent.contentOffset.x);
      const newIndex = Math.round(offsetX / screenWidth);
      if (newIndex >= 0 && newIndex < total && newIndex !== index) {
        if (Platform.OS !== "web") {
          void Haptics.selectionAsync().catch(() => {});
        }
        setIndex(newIndex);
      }
    },
    [index, screenWidth, total],
  );

  if (!localeReady) {
    return <View style={styles.root} />;
  }

  if (showLangSelection) {
    return (
      <View style={{ flex: 1 }}>
        <LanguageSelectionFlow onFinish={finishAll} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.root, animatedRootStyle]}>
      <OnboardingSkiaBg scrollX={scrollX} />
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {slides.map((slide) => (
          <View
            key={slide.id}
            style={{
              width: screenWidth,
              height: "100%",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <OnboardingSlide slide={slide} />
          </View>
        ))}
      </Animated.ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={goNext}
        >
          <View style={styles.nextButtonContent}>
            <AppText style={styles.nextButtonText} forceLatinFont latinRole="bold">
              {index === 0
                ? "Get Started"
                : isLast
                  ? "Start Learning"
                  : "Continue"}
            </AppText>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={20}
              color="#FFFFFF"
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    container: {
      flex: 1,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 24,
      paddingBottom: Platform.OS === "ios" ? 48 : 32,
      paddingTop: 16,
      alignItems: "center",
      backgroundColor: "transparent",
      zIndex: 10,
    },
    pagination: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 32,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      width: 24,
      backgroundColor: "#0F172A",
    },
    dotInactive: {
      width: 8,
      backgroundColor: "rgba(255,255,255,0.5)",
    },
    nextButton: {
      width: "100%",
      height: 56,
      backgroundColor: "#0F172A",
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        web: {
          boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.18)",
        },
        default: {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 5,
        },
      }),
    },
    nextButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      width: "100%",
    },
    nextButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
    },
    arrowIcon: {
      position: "absolute",
      right: 24,
    },
  });
