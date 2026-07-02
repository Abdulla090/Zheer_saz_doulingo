import React, { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { DolphinFlat } from "./icons/HomeDashboardIcons";

type Props = {
  visible: boolean;
  onAnimationComplete?: () => void;
};

export default function KidsLessonTransition({ visible, onAnimationComplete }: Props) {
  const { width } = useWindowDimensions();
  
  // Animation shared values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (visible) {
      // Fade in background
      opacity.value = withTiming(1, { duration: 300 });
      // Scale up central bubble with spring
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      // Float up the bubble slightly
      translateY.value = withSpring(0, { damping: 12, stiffness: 90 });

      // Trigger callback after entrance animation completes
      const timer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 700);

      return () => clearTimeout(timer);
    } else {
      // Fade out background and scale down bubble
      opacity.value = withTiming(0, { duration: 400 });
      scale.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(40, { duration: 350 });
    }
  }, [visible, onAnimationComplete, opacity, scale, translateY]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: opacity.value > 0.1 ? "auto" : "none",
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
  }));

  if (!visible && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, backgroundStyle]}>
      {/* Playful background blobs */}
      <View style={[styles.blob, { width: width * 1.5, height: width * 1.5, borderRadius: width, top: -width * 0.5, left: -width * 0.25 }]} />

      {/* Central Interactive Content */}
      <Animated.View style={[styles.bubbleContainer, bubbleStyle]}>
        <View style={styles.dolphinCircle}>
          <DolphinFlat width={96} height={96} />
        </View>
        <Text style={styles.title}>Loading Lesson...</Text>
        <Text style={styles.subtitle}>Get ready to play! 🚀</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#7C3AED", // Rich royal purple
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  blob: {
    position: "absolute",
    backgroundColor: "#EC4899", // Playful pink
    opacity: 0.15,
  },
  bubbleContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dolphinCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "DINNextRoundedBold",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F3E8FF",
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
  },
});
