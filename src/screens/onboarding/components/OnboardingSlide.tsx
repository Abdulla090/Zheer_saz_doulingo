import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AppText } from "../../../components/ui/AppText";
import { OnboardingHeroScene, type OnboardingSceneVariant } from "./OnboardingHeroScene";
import { ONBOARDING_DESIGN } from "./onboarding-design";

export type OnboardingSlideModel = {
  id: string;
  title: string;
  subtitle: string;
};

type Props = {
  slide: OnboardingSlideModel;
  locale: string;
};

const SLIDE_NUMBER: Record<string, string> = {
  welcome: "01",
  practice: "02",
  progress: "03",
};

export function OnboardingSlide({ slide, locale }: Props) {
  const { width, height } = useWindowDimensions();
  const isWideLayout = width >= 760;
  const isTallPhone = !isWideLayout && height >= 820;
  const isCompactPhone = !isWideLayout && height < 760;
  const isVeryCompactPhone = !isWideLayout && (height < 680 || width < 360);
  const isRtl = locale === "ku" || locale === "ar";
  const artworkFirst = slide.id === "welcome";
  const artHeight = isWideLayout
    ? 520
    : isVeryCompactPhone
      ? 210
      : isCompactPhone
        ? 270
        : isTallPhone
          ? 400
          : 355;
  const styles = useMemo(
    () => createStyles(isWideLayout, isTallPhone, isCompactPhone, isVeryCompactPhone, isRtl),
    [isCompactPhone, isRtl, isTallPhone, isVeryCompactPhone, isWideLayout],
  );

  const artwork = (
    <View style={styles.artwork}>
      <OnboardingHeroScene
        variant={slide.id as OnboardingSceneVariant}
        height={artHeight}
      />
    </View>
  );

  const copy = (
    <View style={styles.copy}>
      <AppText
        style={[styles.number, { color: slideAccent(slide.id) }]}
        languageCode="en"
        forceLatinFont
        latinRole="medium"
        align="start"
        fullWidth
      >
        {SLIDE_NUMBER[slide.id] ?? "01"}
      </AppText>
      {isRtl ? (
        <AppText
          style={styles.titleRtl}
          languageCode={locale}
          latinRole="regular"
          align="start"
          fullWidth
        >
          {slide.title}
          <AppText style={styles.titleDot} languageCode={locale}>.</AppText>
        </AppText>
      ) : (
        <Text style={styles.title} accessibilityRole="header">
          {slide.title}
          <Text style={styles.titleDot}>.</Text>
        </Text>
      )}
      <AppText
        style={styles.subtitle}
        languageCode={locale}
        align="start"
        fullWidth
      >
        {slide.subtitle}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      {isWideLayout ? (
        <>
          {copy}
          {artwork}
        </>
      ) : artworkFirst ? (
        <>
          {artwork}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {artwork}
        </>
      )}
    </View>
  );
}

const createStyles = (
  isWideLayout: boolean,
  isTallPhone: boolean,
  isCompactPhone: boolean,
  isVeryCompactPhone: boolean,
  isRtl: boolean,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      maxWidth: isWideLayout ? 1120 : 620,
      alignSelf: "center",
      flexDirection: isWideLayout ? (isRtl ? "row-reverse" : "row") : "column",
      alignItems: "center",
      justifyContent: "center",
      gap: isWideLayout ? 72 : isCompactPhone ? 2 : 10,
      paddingHorizontal: isWideLayout ? 60 : isVeryCompactPhone ? 20 : 28,
      paddingVertical: isWideLayout ? 16 : isVeryCompactPhone ? 2 : 8,
    },
    artwork: {
      width: isWideLayout ? "52%" : "100%",
      height: isWideLayout
        ? 520
        : isVeryCompactPhone
          ? 210
          : isCompactPhone
            ? 270
            : isTallPhone
              ? 400
              : 355,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 1,
    },
    copy: {
      width: isWideLayout ? "40%" : "100%",
      maxWidth: 520,
      alignItems: isRtl ? "flex-end" : "flex-start",
      paddingHorizontal: isWideLayout ? 0 : 6,
      flexShrink: 0,
    },
    number: {
      fontSize: isVeryCompactPhone ? 13 : isCompactPhone ? 15 : 19,
      lineHeight: isVeryCompactPhone ? 17 : isCompactPhone ? 19 : 24,
      marginBottom: isCompactPhone ? 5 : 9,
      letterSpacing: 0.6,
    },
    title: {
      width: "100%",
      color: ONBOARDING_DESIGN.ink,
      fontFamily: ONBOARDING_DESIGN.serif,
      fontSize: isWideLayout ? 66 : isVeryCompactPhone ? 33 : isCompactPhone ? 39 : isTallPhone ? 52 : 48,
      lineHeight: isWideLayout ? 69 : isVeryCompactPhone ? 38 : isCompactPhone ? 44 : isTallPhone ? 56 : 52,
      letterSpacing: -1.8,
      textAlign: "left",
    },
    titleRtl: {
      width: "100%",
      color: ONBOARDING_DESIGN.ink,
      fontSize: isWideLayout ? 54 : isVeryCompactPhone ? 31 : isCompactPhone ? 35 : isTallPhone ? 44 : 41,
      lineHeight: isWideLayout ? 65 : isVeryCompactPhone ? 40 : isCompactPhone ? 45 : isTallPhone ? 56 : 52,
      letterSpacing: -0.6,
    },
    titleDot: {
      color: ONBOARDING_DESIGN.orange,
    },
    subtitle: {
      color: ONBOARDING_DESIGN.mutedInk,
      fontSize: isWideLayout ? 20 : isVeryCompactPhone ? 13 : isCompactPhone ? 14 : isTallPhone ? 17 : 16,
      lineHeight: isWideLayout ? 29 : isVeryCompactPhone ? 18 : isCompactPhone ? 20 : isTallPhone ? 25 : 23,
      marginTop: isCompactPhone ? 7 : 10,
      maxWidth: 430,
    },
  });

function slideAccent(slideId: string) {
  return slideId === "practice" ? ONBOARDING_DESIGN.orange : ONBOARDING_DESIGN.lavenderDeep;
}
