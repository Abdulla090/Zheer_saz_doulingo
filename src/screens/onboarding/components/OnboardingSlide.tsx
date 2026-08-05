import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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

export type OnboardingSlideModel = {
  id: string;
  title: string;
  subtitle: string;
};

type Props = {
  slide: OnboardingSlideModel;
  locale: string;
};

/*
 * A slide is one artwork, one title, one line of support — nothing else.
 *
 * The "01 / 02 / 03" eyebrow above the title is dropped: the footer progress
 * bar already answers "where am I", and the number was a second, competing
 * position indicator rendered in the accent colour at the strongest point on
 * the page. The decorative accent full stop after the title goes with it for
 * the same reason — it drew colour to punctuation rather than to meaning.
 */
export function OnboardingSlide({ slide, locale }: Props) {
  const { width, height } = useWindowDimensions();
  const size = resolveOnboardingSize(width, height);
  const isWide = size === "xl";
  const isRtl = locale === "ku" || locale === "ar";

  const styles = useMemo(
    () => createStyles(size, isWide, isRtl),
    [isRtl, isWide, size],
  );

  const artwork = (
    <View style={styles.artwork}>
      <OnboardingHeroScene
        variant={slide.id as OnboardingSceneVariant}
        height={ONBOARDING_ART_HEIGHT[size]}
      />
    </View>
  );

  const copy = (
    <View style={styles.copy}>
      {isRtl ? (
        <AppText
          style={styles.titleRtl}
          languageCode={locale}
          latinRole="regular"
          align="start"
          fullWidth
          accessibilityRole="header"
        >
          {slide.title}
        </AppText>
      ) : (
        <Text style={styles.title} accessibilityRole="header">
          {slide.title}
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
    title: {
      width: "100%",
      color: ONBOARDING_DESIGN.ink,
      fontFamily: ONBOARDING_DESIGN.serif,
      fontSize: type.display.size,
      lineHeight: type.display.lineHeight,
      letterSpacing: type.display.letterSpacing,
      textAlign: "left",
    },
    titleRtl: {
      width: "100%",
      color: ONBOARDING_DESIGN.ink,
      fontSize: type.displayRtl.size,
      lineHeight: Math.round(type.displayRtl.size * 1.42),
      letterSpacing: 0,
    },
    subtitle: {
      color: ONBOARDING_DESIGN.mutedInk,
      fontSize: type.body.size,
      lineHeight: type.body.lineHeight,
      marginTop: tight ? ONBOARDING_SPACE.sm : ONBOARDING_SPACE.md,
      maxWidth: 430,
    },
  });
};
