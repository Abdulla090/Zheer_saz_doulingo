import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { AppText } from "../../../components/ui/AppText";
import { OnboardingHeroScene, type OnboardingSceneVariant } from "./OnboardingHeroScene";
import {
  ONBOARDING_ART_HEIGHT,
  ONBOARDING_DESIGN,
  ONBOARDING_GUTTER,
  ONBOARDING_SPACE,
  ONBOARDING_TYPE,
  resolveOnboardingSize,
} from "./onboarding-design";
import { useOnboardingTheme, type OnboardingTheme } from "./onboarding-theme";

export type OnboardingSlideModel = {
  id: string;
  title: string;
  subtitle: string;
};

type Props = {
  slide: OnboardingSlideModel;
  locale: string;
};

const OPENING_EASE = Easing.bezier(0.22, 1, 0.36, 1);

/*
 * A slide is one artwork, one title, one line of support — nothing else.
 *
 * The "01 / 02 / 03" eyebrow above the title is dropped: the footer progress
 * bar already answers "where am I", and the number was a second, competing
 * position indicator rendered in the accent colour at the strongest point on
 * the page. The decorative accent full stop after the title goes with it for
 * the same reason — it drew colour to punctuation rather than to meaning.
 */
export function OnboardingSlide({
  slide,
  locale,
}: Props) {
  const { width, height } = useWindowDimensions();
  const size = resolveOnboardingSize(width, height);
  const isWide = size === "xl";
  const isRtl = locale === "ku" || locale === "ar";
  const theme = useOnboardingTheme();
  const reduceMotion = useReducedMotion();
  const artworkReveal = useSharedValue(reduceMotion ? 1 : 0);
  const titleReveal = useSharedValue(reduceMotion ? 1 : 0);
  const subtitleReveal = useSharedValue(reduceMotion ? 1 : 0);

  const styles = useMemo(
    () => createStyles(size, isWide, isRtl, theme),
    [isRtl, isWide, size, theme],
  );

  useEffect(() => {
    cancelAnimation(artworkReveal);
    cancelAnimation(titleReveal);
    cancelAnimation(subtitleReveal);

    if (reduceMotion) {
      artworkReveal.value = 1;
      titleReveal.value = 1;
      subtitleReveal.value = 1;
      return;
    }

    artworkReveal.value = 0;
    titleReveal.value = 0;
    subtitleReveal.value = 0;
    artworkReveal.value = withDelay(
      55,
      withTiming(1, { duration: 460, easing: OPENING_EASE }),
    );
    titleReveal.value = withDelay(
      420,
      withTiming(1, { duration: 360, easing: OPENING_EASE }),
    );
    subtitleReveal.value = withDelay(
      610,
      withTiming(1, { duration: 340, easing: OPENING_EASE }),
    );

    return () => {
      cancelAnimation(artworkReveal);
      cancelAnimation(titleReveal);
      cancelAnimation(subtitleReveal);
    };
  }, [artworkReveal, reduceMotion, slide.id, subtitleReveal, titleReveal]);

  const artworkMotion = useAnimatedStyle(() => ({
    opacity: artworkReveal.value,
    transform: [
      { translateY: interpolate(artworkReveal.value, [0, 1], [20, 0]) },
      { scale: interpolate(artworkReveal.value, [0, 1], [0.94, 1]) },
    ],
  }));

  const titleMotion = useAnimatedStyle(() => ({
    opacity: titleReveal.value,
    transform: [
      {
        translateX: interpolate(
          titleReveal.value,
          [0, 1],
          [isRtl ? 18 : -18, 0],
        ),
      },
      { translateY: interpolate(titleReveal.value, [0, 1], [8, 0]) },
    ],
  }));

  const subtitleMotion = useAnimatedStyle(() => ({
    opacity: subtitleReveal.value,
    transform: [
      {
        translateX: interpolate(
          subtitleReveal.value,
          [0, 1],
          [isRtl ? 14 : -14, 0],
        ),
      },
    ],
  }));

  const artwork = (
    <Animated.View style={[styles.artwork, artworkMotion]}>
      <OnboardingHeroScene
        variant={slide.id as OnboardingSceneVariant}
        height={ONBOARDING_ART_HEIGHT[size]}
      />
    </Animated.View>
  );

  const copy = (
    <View style={styles.copy}>
      <Animated.View style={[styles.copyLine, titleMotion]}>
        <AppText
          style={isRtl ? styles.titleRtl : styles.title}
          languageCode={locale}
          latinRole="bold"
          align="start"
          fullWidth
          accessibilityRole="header"
        >
          {slide.title}
        </AppText>
      </Animated.View>

      <Animated.View style={[styles.copyLine, subtitleMotion]}>
        <AppText
          style={styles.subtitle}
          languageCode={locale}
          align="start"
          fullWidth
        >
          {slide.subtitle}
        </AppText>
      </Animated.View>
    </View>
  );

  /*
   * Order is fixed: artwork above copy on every slide.
   *
   * It previously alternated (`artworkFirst` on welcome only), which moved the
   * title to a different vertical position on each page. Paging between slides
   * then read as the layout jumping rather than the content advancing.
   */
  return (
    <View style={styles.container}>
      {isWide ? (
        <>
          {copy}
          {artwork}
        </>
      ) : (
        <>
          {artwork}
          {copy}
        </>
      )}
    </View>
  );
}

const createStyles = (
  size: ReturnType<typeof resolveOnboardingSize>,
  isWide: boolean,
  isRtl: boolean,
  theme: OnboardingTheme,
) => {
  const type = ONBOARDING_TYPE[size];
  const gutter = ONBOARDING_GUTTER[size];
  const tight = size === "xs" || size === "sm";

  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: isWide ? 1120 : 620,
      alignSelf: "center",
      // RTL row order is mirrored by the layout engine (forceRTL / document.dir),
      // so this stays `row` — see LESSON_REDESIGN.md.
      flexDirection: isWide ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      gap: isWide ? ONBOARDING_SPACE.huge : tight ? ONBOARDING_SPACE.sm : ONBOARDING_SPACE.lg,
      paddingHorizontal: gutter,
      paddingVertical: tight ? ONBOARDING_SPACE.xs : ONBOARDING_SPACE.md,
    },
    artwork: {
      width: isWide ? "52%" : "100%",
      height: ONBOARDING_ART_HEIGHT[size],
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 1,
    },
    copy: {
      width: isWide ? "40%" : "100%",
      maxWidth: 520,
      alignItems: "flex-start",
      flexShrink: 0,
    },
    copyLine: {
      width: "100%",
    },
    title: {
      width: "100%",
      color: theme.ink,
      fontFamily: ONBOARDING_DESIGN.displayFont,
      fontSize: type.display.size,
      lineHeight: type.display.lineHeight,
      letterSpacing: type.display.letterSpacing,
      textAlign: "left",
    },
    titleRtl: {
      width: "100%",
      color: theme.ink,
      fontSize: type.displayRtl.size,
      lineHeight: Math.round(type.displayRtl.size * 1.42),
      letterSpacing: 0,
    },
    subtitle: {
      color: theme.mutedInk,
      fontSize: type.body.size,
      lineHeight: type.body.lineHeight,
      marginTop: tight ? ONBOARDING_SPACE.sm : ONBOARDING_SPACE.md,
      maxWidth: 430,
    },
  });
};
