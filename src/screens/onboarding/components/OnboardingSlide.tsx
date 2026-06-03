import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ONBOARDING_SLIDE_IMAGES } from "../onboarding-slide-images";

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
    return (
      <View style={styles.imagePage}>
        <View style={styles.imageFrame}>
          <Image
            source={source}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
            recyclingKey={slide.id}
          />
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
    width: "100%",
    maxHeight: "100%",
    aspectRatio: 576 / 1024,
    position: "relative",
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
