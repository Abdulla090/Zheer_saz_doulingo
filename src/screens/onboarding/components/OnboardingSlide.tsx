import { useThemeColors } from "../../../hooks/useThemeColors";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../../components/ui/AppText";
import { OnboardingHeroScene, type OnboardingSceneVariant } from "./OnboardingHeroScene";

export type OnboardingSlideModel = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
};

type Props = {
  slide: OnboardingSlideModel;
};

/**
 * Simple, crash-proof onboarding slide.
 * No Reanimated animations — just static layout.
 * Previous version crashed on Android APK because 3 simultaneous
 * withRepeat(withSequence(...), -1, true) animations started on
 * the same native frame, causing a Reanimated thread race condition.
 */
export function OnboardingSlide({ slide }: Props) {
  const { colors } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <OnboardingHeroScene variant={slide.id as OnboardingSceneVariant} height={260} />
      </View>
      
      <View style={styles.textContainer}>
        <AppText style={styles.title} forceLatinFont latinRole="bold">
          {slide.title}
        </AppText>
        <AppText style={styles.subtitle}>
          {slide.subtitle}
        </AppText>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: "100%",
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    backgroundColor: "transparent",
  },
  textContainer: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    textAlign: "center",
  },
});
