import { cssPressStyle, cssReleaseStyle } from "@/components/animations/motion";
import { rtlTextCenter } from "@/utils/rtl";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { useOnboardingLocale } from "../OnboardingLocaleContext";

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
  rimColor?: string;
};

export function OnboardingPrimaryButton({
  label,
  onPress,
  color = "#208AEF",
  rimColor,
}: Props) {
  const { isRtl, locale } = useOnboardingLocale();
  const [pressed, setPressed] = useState(false);
  const rim = rimColor ?? color;
  const depth = 4;
  const fontFamily = locale === "ku" ? "Rabar_011" : undefined;

  return (
    <View style={[styles.rim, { backgroundColor: rim }, { direction: isRtl ? "rtl" : "ltr" }]}>
      <Animated.View
        style={[
          styles.face,
          {
            backgroundColor: color,
            marginBottom: depth,
            transform: [{ translateY: pressed ? depth : 0 }],
          },
          pressed ? cssPressStyle : cssReleaseStyle,
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0.05)", "rgba(0,0,0,0.06)"]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Pressable
          onPress={() => {
            if (Platform.OS !== "web") {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            onPress();
          }}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={styles.press}
        >
          <Text
            style={[
              styles.label,
              rtlTextCenter(isRtl),
              fontFamily && { fontFamily },
            ]}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rim: {
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
  face: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.28)",
    borderTopColor: "rgba(255,255,255,0.55)",
    overflow: "hidden",
  },
  press: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
