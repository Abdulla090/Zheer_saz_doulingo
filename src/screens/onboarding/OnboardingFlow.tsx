import type { PathMode } from "../home/components/PathSwitcher";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
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
const ONBOARDING_SLIDE_EASE = Easing.bezier(0.22, 1, 0.36, 1);

export function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const scrollRef = useRef<Animated.ScrollView>(null);
  const pendingIndexRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [clientMounted, setClientMounted] = useState(Platform.OS !== "web");

  useEffect(() => {
    setClientMounted(true);
  }, []);

  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const pathMode = useSettingsStore((s) => s.pathMode);
  const setPathMode = useSettingsStore((s) => s.setPathMode);
  const localeReady = useLocaleStore((s) => s.ready);
  const { t, locale } = useI18n();

  const [index, setIndex] = useState(0);
  const [showLangSelection, setShowLangSelection] = useState(false);
  const [showPetSelection, setShowPetSelection] = useState(false);
  const [isPaging, setIsPaging] = useState(false);
  const [webDirection, setWebDirection] = useState<1 | -1>(1);

  const onboardingTheme = useOnboardingTheme();
  const styles = useMemo(
    () => createStyles(onboardingTheme.canvas),
    [onboardingTheme.canvas],
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
    setShowPetSelection(true);
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

  const finishPetSelection = useCallback(() => {
    setShowPetSelection(false);
    setShowLangSelection(true);
  }, []);

  const returnToIntroSlides = useCallback(() => {
    setShowPetSelection(false);
  }, []);

  const returnToPetSelection = useCallback(() => {
    setShowLangSelection(false);
    setShowPetSelection(true);
  }, []);

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
    if (isPaging) return;
    if (isLast) {
      finishSlides();
      return;
    }
    const nextIndex = index + 1;
    const targetX = nextIndex * screenWidth;

    if (isWeb) {
      setWebDirection(1);
      // No ScrollView on web, so nothing reports scroll position back —
      // `scrollX` has to be driven directly to morph the background.
      scrollX.value = reduceMotion
        ? targetX
        : withTiming(targetX, {
            duration: 320,
            easing: ONBOARDING_SLIDE_EASE,
          });
      setIndex(nextIndex);
    } else if (reduceMotion) {
      scrollRef.current?.scrollTo({ x: targetX, y: 0, animated: false });
      setIndex(nextIndex);
    } else {
      /*
       * Keep the progress ring and CTA copy on the current step until native
       * paging actually settles. Updating React state before scrollTo finished
       * made the chrome jump ahead of the slide and read as a dropped frame.
       */
      setIsPaging(true);
      pendingIndexRef.current = nextIndex;
      scrollRef.current?.scrollTo({ x: targetX, y: 0, animated: true });
    }
  }, [
    finishSlides,
    index,
    isWeb,
    isLast,
    isPaging,
    reduceMotion,
    screenWidth,
    scrollX,
  ]);

  const goBack = useCallback(() => {
    if (index <= 0 || isPaging) return;
    const previousIndex = index - 1;
    const targetX = previousIndex * screenWidth;

    if (isWeb) {
      setWebDirection(-1);
      scrollX.value = reduceMotion
        ? targetX
        : withTiming(targetX, {
            duration: 320,
            easing: ONBOARDING_SLIDE_EASE,
          });
      setIndex(previousIndex);
    } else if (reduceMotion) {
      scrollRef.current?.scrollTo({ x: targetX, y: 0, animated: false });
      setIndex(previousIndex);
    } else {
      setIsPaging(true);
      pendingIndexRef.current = previousIndex;
      scrollRef.current?.scrollTo({ x: targetX, y: 0, animated: true });
    }
  }, [index, isPaging, isWeb, reduceMotion, screenWidth, scrollX]);

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
      pendingIndexRef.current = null;
      setIsPaging(false);
      // `scrollX` already tracks the settled offset via `scrollHandler`; the
      // previous `withTiming` here re-animated it from the position it was
      // already at, which re-ran the background morph after every swipe.
    },
    [index, screenWidth, total],
  );
  const isRtl = locale === "ku" || locale === "ar";
  const webEntering =
    webDirection > 0
      ? isRtl
        ? FadeInLeft
        : FadeInRight
      : isRtl
        ? FadeInRight
        : FadeInLeft;
  const webExiting =
    webDirection > 0
      ? isRtl
        ? FadeOutRight
        : FadeOutLeft
      : isRtl
        ? FadeOutLeft
        : FadeOutRight;

  if (!localeReady || !clientMounted) {
    /*
     * Static web rendering cannot read localStorage. Rendering translated copy
     * there and replacing it with the stored locale/theme during hydration
     * caused a full React hydration recovery—the opening visibly flashed before
     * any motion began. The identical neutral shell on server and first client
     * frame hydrates cleanly; the real themed flow mounts in the next frame.
     */
    return <View style={hydrationStyles.root} />;
  }

  if (showPetSelection) {
    return (
      <Animated.View style={[styles.root, animatedRootStyle]}>
        <OnboardingPetPicker
          onBack={returnToIntroSlides}
          onFinish={finishPetSelection}
        />
      </Animated.View>
    );
  }

  if (showLangSelection) {
    return (
      <View style={{ flex: 1 }}>
        <LanguageSelectionFlow
          initialStep="nativeLanguage"
          onBackToIntro={returnToPetSelection}
          onFinish={finishAll}
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
      />
      <View style={styles.slideFrame}>
      {isWeb ? (
        <Animated.View
          key={slides[index].id}
          entering={
            reduceMotion || index === 0
              ? undefined
              : webEntering.duration(320).easing(ONBOARDING_SLIDE_EASE)
          }
          exiting={
            reduceMotion
              ? undefined
              : webExiting.duration(210).easing(Easing.in(Easing.quad))
          }
          style={styles.webSlide}
        >
          <OnboardingSlide
            slide={slides[index]}
            locale={locale}
            pageIndex={index}
            pageWidth={screenWidth}
            scrollX={scrollX}
          />
        </Animated.View>
      ) : (
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          decelerationRate="fast"
          disableIntervalMomentum
          snapToAlignment="start"
          snapToInterval={screenWidth}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={scrollHandler}
          onScrollBeginDrag={() => {
            pendingIndexRef.current = null;
            setIsPaging(true);
          }}
          onMomentumScrollEnd={handleMomentumEnd}
          onScrollAnimationEnd={() => {
            const pendingIndex = pendingIndexRef.current;
            if (pendingIndex != null) {
              setIndex(pendingIndex);
              pendingIndexRef.current = null;
            }
            setIsPaging(false);
          }}
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
              <OnboardingSlide
                slide={slide}
                locale={locale}
                pageIndex={STEP_IDS.indexOf(slide.id as (typeof STEP_IDS)[number])}
                pageWidth={screenWidth}
                scrollX={scrollX}
              />
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
        disabled={isPaging}
        secondaryLabel={index === 0 ? t("onboarding.alreadyHaveAccount") : undefined}
        onSecondaryPress={index === 0 ? goToSignIn : undefined}
        secondaryTestID="onboarding-sign-in"
        current={onboardingStepNumber(STEP_IDS[index])}
        total={ONBOARDING_TOTAL_STEPS}
      />
    </Animated.View>
  );
}

const createStyles = (canvas: string) =>
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

const hydrationStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F5F0",
  },
});
