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
} from "react-native";
import Animated, {
  Easing,
  FadeInRight,
  FadeOutLeft,
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingSlide, type OnboardingSlideModel } from "./components/OnboardingSlide";
import { OnboardingPetPicker } from "./components/OnboardingPetPicker";
import { LanguageSelectionFlow } from "./LanguageSelectionFlow";
import { OnboardingSkiaBg } from "./components/OnboardingSkiaBg";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useI18n } from "../../hooks/useI18n";
import { OnboardingFooter, OnboardingTopBar } from "./components/OnboardingChrome";
import { useOnboardingTheme } from "./components/onboarding-theme";
import {
  ONBOARDING_SLIDE_IDS,
  ONBOARDING_TOTAL_STEPS,
  onboardingStepNumber,
} from "./onboarding-steps";
import { resolvePathMode } from "../../constants/path-availability";

const STEP_IDS = ONBOARDING_SLIDE_IDS;

export function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isDesktopWeb = Platform.OS === "web" && screenWidth >= 900;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const reduceMotion = useReducedMotion();

  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const pathMode = useSettingsStore((s) => s.pathMode);
  const setPathMode = useSettingsStore((s) => s.setPathMode);
  const localeReady = useLocaleStore((s) => s.ready);
  const { t, locale } = useI18n();

  const [index, setIndex] = useState(0);
  const [showLangSelection, setShowLangSelection] = useState(false);
  const [showPetSelection, setShowPetSelection] = useState(false);
  const [resumeLanguageAtGoal, setResumeLanguageAtGoal] = useState(false);

  const { colors, isDark } = useThemeColors();
  const onboardingTheme = useOnboardingTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark, isDesktopWeb, onboardingTheme.canvas),
    [colors, isDark, isDesktopWeb, onboardingTheme.canvas],
  );
  // Street and kids are paused; a stale stored preference must not survive
  // onboarding and drop the user onto a path that no longer renders.
  const [selectedPath] = useState<PathMode>(() => resolvePathMode(pathMode));

  /* Continuous scroll position for smooth gradient morph */
  const scrollX = useSharedValue(0);
  const rootOpacity = useSharedValue(1);

  const animatedRootStyle = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
  }));

  /*
   * The ScrollView offset is the single source of truth for `scrollX` on native.
   * Driving it with a parallel `withTiming` (as this previously did during
   * programmatic paging) made the Skia background travel on its own 460ms curve
   * while the slides travelled on the platform's native scroll curve, so the
   * two drifted apart mid-transition and the background settled on the wrong
   * page whenever the native animation finished first.
   */
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
      { title: string; subtitle: string }
    > = {
      welcome: {
        title: t("onboarding.welcomeTitle"),
        subtitle: t("onboarding.welcomeSubtitle"),
      },
      practice: {
        title: t("onboarding.practiceTitle"),
        subtitle: t("onboarding.practiceSubtitle"),
      },
      progress: {
        title: t("onboarding.progressTitle"),
        subtitle: t("onboarding.progressSubtitle"),
      },
    };

    return STEP_IDS.map((id) => ({
      id,
      ...meta[id],
    }));
  }, [t]);

  const finishSlides = useCallback(() => {
    setShowLangSelection(true);
  }, []);

  const finishLanguageSelection = useCallback(() => {
    setResumeLanguageAtGoal(true);
    setShowPetSelection(true);
  }, []);

  const returnToLanguageSelection = useCallback(() => {
    setShowPetSelection(false);
    setShowLangSelection(true);
    setResumeLanguageAtGoal(true);
  }, []);

  const finishAll = useCallback(() => {
    setPathMode(selectedPath);
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    if (reduceMotion) {
      completeOnboarding("/auth?redirect=/(tabs)");
      return;
    }
    // Smooth transition: fade out root view, then replace route to show login screen.
    rootOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) {
        runOnJS(completeOnboarding)("/auth?redirect=/(tabs)");
      }
    });
  }, [completeOnboarding, reduceMotion, rootOpacity, selectedPath, setPathMode]);

  const goToSignIn = useCallback(() => {
    /*
     * A returning user has already done setup — language, level, goal and pet
     * are all on their account. Sending them through those five questions again
     * would overwrite the answers with fresh defaults, so this marks onboarding
     * done and hands straight off to auth.
     */
    setPathMode(selectedPath);
    completeOnboarding("/auth?redirect=/(tabs)");
  }, [completeOnboarding, selectedPath, setPathMode]);

  const goNext = useCallback(() => {
    if (isLast) {
      finishSlides();
      return;
    }
    const nextIndex = index + 1;
    const targetX = nextIndex * screenWidth;

    if (isWeb) {
      // No ScrollView on web, so nothing reports scroll position back —
      // `scrollX` has to be driven directly to morph the background.
      scrollX.value = reduceMotion
        ? targetX
        : withTiming(targetX, {
            duration: 460,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          });
    } else {
      scrollRef.current?.scrollTo({ x: targetX, y: 0, animated: !reduceMotion });
    }

    setIndex(nextIndex);
  }, [
    finishSlides,
    index,
    isWeb,
    isLast,
    reduceMotion,
    screenWidth,
    scrollX,
  ]);

  const goBack = useCallback(() => {
    if (index <= 0) return;
    const previousIndex = index - 1;
    const targetX = previousIndex * screenWidth;

    if (isWeb) {
      scrollX.value = reduceMotion
        ? targetX
        : withTiming(targetX, {
            duration: 460,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          });
    } else {
      scrollRef.current?.scrollTo({ x: targetX, y: 0, animated: !reduceMotion });
    }

    setIndex(previousIndex);
  }, [index, isWeb, reduceMotion, screenWidth, scrollX]);

  /* Derive discrete index from scroll for dots + button label */
  const handleMomentumEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const offsetX = Math.abs(e.nativeEvent.contentOffset.x);
      const newIndex = Math.min(
        total - 1,
        Math.max(0, Math.round(offsetX / screenWidth)),
      );
      if (newIndex !== index) {
        setIndex(newIndex);
      }
      // `scrollX` already tracks the settled offset via `scrollHandler`; the
      // previous `withTiming` here re-animated it from the position it was
      // already at, which re-ran the background morph after every swipe.
    },
    [index, screenWidth, total],
  );

  if (!localeReady) {
    return <View style={styles.root} />;
  }

  if (showPetSelection) {
    return (
      <Animated.View style={[styles.root, animatedRootStyle]}>
        <OnboardingPetPicker onBack={returnToLanguageSelection} onFinish={finishAll} />
      </Animated.View>
    );
  }

  if (showLangSelection) {
    return (
      <View style={{ flex: 1 }}>
        <LanguageSelectionFlow
          initialStep={resumeLanguageAtGoal ? "goal" : "nativeLanguage"}
          onBackToIntro={() => {
            setShowLangSelection(false);
            setResumeLanguageAtGoal(false);
            setIndex(STEP_IDS.length - 1);
          }}
          onFinish={finishLanguageSelection}
        />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.root, animatedRootStyle]}>
      <OnboardingSkiaBg scrollX={scrollX} />
      <OnboardingTopBar
        current={onboardingStepNumber(STEP_IDS[index])}
        total={ONBOARDING_TOTAL_STEPS}
        locale={locale}
        topInset={insets.top}
        onBack={index > 0 ? goBack : undefined}
        onSkip={finishSlides}
        skipLabel={t("onboarding.skip")}
        backLabel={t("onboarding.back")}
        showBrand
      />
      <View style={styles.slideFrame}>
      {isWeb ? (
        <Animated.View
          key={slides[index].id}
          entering={reduceMotion ? undefined : FadeInRight.duration(240)}
          exiting={reduceMotion ? undefined : FadeOutLeft.duration(180)}
          style={styles.webSlide}
        >
          <OnboardingSlide slide={slides[index]} locale={locale} />
        </Animated.View>
      ) : (
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
              <OnboardingSlide slide={slide} locale={locale} />
            </View>
          ))}
        </Animated.ScrollView>
      )}
      </View>
      <OnboardingFooter
        label={index === 0 ? t("onboarding.getStarted") : t("onboarding.continue")}
        locale={locale}
        bottomInset={insets.bottom}
        onPress={goNext}
        secondaryLabel={index === 0 ? t("onboarding.alreadyHaveAccount") : undefined}
        onSecondaryPress={index === 0 ? goToSignIn : undefined}
        secondaryTestID="onboarding-sign-in"
        current={onboardingStepNumber(STEP_IDS[index])}
        total={ONBOARDING_TOTAL_STEPS}
      />
    </Animated.View>
  );
}

const createStyles = (
  colors: any,
  isDark: boolean,
  isDesktopWeb: boolean,
  canvas: string,
) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: canvas,
    },
    container: {
      flex: 1,
    },
    slideFrame: {
      flex: 1,
      minHeight: 0,
    },
    webSlide: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
  });
