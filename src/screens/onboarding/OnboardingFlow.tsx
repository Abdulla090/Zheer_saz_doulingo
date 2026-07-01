import type { PathMode } from "../home/components/PathSwitcher";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState, useRef } from "react";
import { Platform, StyleSheet, useWindowDimensions, View, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, ScrollView, I18nManager } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { OnboardingSlide, type OnboardingSlideModel } from "./components/OnboardingSlide";
import { LanguageSelectionFlow } from "./LanguageSelectionFlow";
import { OnboardingSkiaBg } from "./components/OnboardingSkiaBg";
import { AppText } from "../../components/ui/AppText";
import { useThemeColors } from "../../hooks/useThemeColors";

const STEP_IDS = ["meet_twin", "learn_conversation", "grow_every_day"] as const;

export function OnboardingFlow() {
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

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

  const total = STEP_IDS.length;
  const isLast = index === total - 1;

  const slides = useMemo((): OnboardingSlideModel[] => {
    const meta: Record<
      (typeof STEP_IDS)[number],
      { title: string; subtitle: string; icon: React.ElementType }
    > = {
      meet_twin: {
        title: "Meet Your AI Twin",
        subtitle: "Practice real conversations with an AI partner that adapts to your level, goals, and learning style.",
        icon: ArrowRight,
      },
      learn_conversation: {
        title: "Learn Through Conversation",
        subtitle: "Speak naturally, receive instant corrections, and build confidence every day.",
        icon: ArrowRight,
      },
      grow_every_day: {
        title: "Grow Every Day",
        subtitle: "Earn rewards, unlock new skills, and watch your language world expand with every conversation.",
        icon: ArrowRight,
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

    // Complete onboarding immediately — no animation, no setTimeout race
    completeOnboarding();
  }, [completeOnboarding, selectedPath, setPathMode]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = Math.abs(event.nativeEvent.contentOffset.x);
    const newIndex = Math.round(offsetX / screenWidth);
    if (newIndex !== index && newIndex >= 0 && newIndex < total) {
      if (Platform.OS !== "web") {
        void Haptics.selectionAsync().catch(() => {});
      }
      setIndex(newIndex);
    }
  };

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
      animated: Platform.OS !== "web" 
    });
    
    setIndex(nextIndex);
  }, [finishSlides, index, isLast, screenWidth]);

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
    <View style={styles.root}>
      <OnboardingSkiaBg />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {slides.map((slide, i) => (
          <View key={slide.id} style={{ width: screenWidth, height: "100%", justifyContent: "center", backgroundColor: "transparent" }}>
            <OnboardingSlide slide={slide} />
          </View>
        ))}
      </ScrollView>

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
              {index === 0 ? "Get Started" : (isLast ? "Start Learning" : "Continue")}
            </AppText>
            <ArrowRight size={20} color="#FFFFFF" style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
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
    backgroundColor: "#2563EB",
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#E2E8F0",
  },
  nextButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        boxShadow: "0px 8px 24px rgba(37, 99, 235, 0.25)",
      },
      default: {
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6,
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
