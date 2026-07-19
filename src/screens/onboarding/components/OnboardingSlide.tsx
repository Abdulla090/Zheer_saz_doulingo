import { useThemeColors } from "../../../hooks/useThemeColors";
import React, { useMemo } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
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
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === "web" && width >= 900;
  const styles = useMemo(
    () => createStyles(colors, isDesktopWeb),
    [colors, isDesktopWeb],
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <OnboardingHeroScene
          variant={slide.id as OnboardingSceneVariant}
          height={isDesktopWeb ? 360 : 292}
        />
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

const createStyles = (colors: any, isDesktopWeb: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: isDesktopWeb ? 1040 : undefined,
    alignSelf: "center",
    flexDirection: isDesktopWeb ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    gap: isDesktopWeb ? 64 : 0,
    paddingHorizontal: isDesktopWeb ? 56 : 32,
    paddingBottom: isDesktopWeb ? 40 : 0,
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: isDesktopWeb ? "48%" : "100%",
    height: isDesktopWeb ? 360 : 292,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isDesktopWeb ? 0 : 22,
    backgroundColor: "transparent",
  },
  textContainer: {
    alignItems: isDesktopWeb ? "flex-start" : "center",
    width: isDesktopWeb ? "42%" : "100%",
    maxWidth: 460,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    color: "#0F172A",
    textAlign: isDesktopWeb ? "left" : "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    textAlign: isDesktopWeb ? "left" : "center",
  },
});
