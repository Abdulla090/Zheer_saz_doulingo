import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ONBOARDING_SLIDE_IMAGES } from "../onboarding-slide-images";

const PHONE_SLIDE_RATIO = 485 / 1024;
const SLIDES_WITH_EMBEDDED_STATUS_BAR = new Set([
  "paths",
  "practice",
  "progress",
  "ready",
]);

export type OnboardingSlideModel = {
  id: string;
  title: string;
  subtitle: string;
  imageOnly?: boolean;
};

type Props = {
  slide: OnboardingSlideModel;
  isLast?: boolean;
  onPrimaryPress?: () => void;
};

export function OnboardingSlide({ slide, isLast, onPrimaryPress }: Props) {
  const source = ONBOARDING_SLIDE_IMAGES[slide.id];

  if (slide.imageOnly && source) {
    const cropEmbeddedStatusBar = SLIDES_WITH_EMBEDDED_STATUS_BAR.has(slide.id);

    return (
      <View style={styles.imagePage}>
        <View style={styles.imageFrame}>
          <View style={styles.imageViewport}>
            <Image
              source={source}
              style={[
                styles.slideImage,
                cropEmbeddedStatusBar && styles.slideImageStatusCrop,
              ]}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={0}
              recyclingKey={slide.id}
            />
          </View>
          <Pressable
            onPress={onPrimaryPress}
            accessibilityRole="button"
            accessibilityLabel={isLast ? "Get Started" : "Next"}
            style={styles.hiddenImageButton}
          />
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  imagePage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  imageFrame: {
    height: "100%",
    maxWidth: "100%",
    aspectRatio: PHONE_SLIDE_RATIO,
    position: "relative",
  },
  imageViewport: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  slideImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  slideImageStatusCrop: {
    top: "-5.4%",
    bottom: undefined,
    height: "105.4%",
  },
  hiddenImageButton: {
    position: "absolute",
    left: "7%",
    right: "7%",
    bottom: "5.2%",
    height: "7.2%",
    borderRadius: 14,
    backgroundColor: "transparent",
  },
});
