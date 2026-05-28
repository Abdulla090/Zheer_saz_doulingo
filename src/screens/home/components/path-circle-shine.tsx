import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type PathCircleShineProps = {
  size: number;
};

/**
 * Premium diagonal light sheen for the active path lesson node.
 * Static soft highlight + slow shimmer band; light blur softens the face.
 */
export function PathCircleShine({ size }: PathCircleShineProps) {
  const shimmer = useSharedValue(-1.2);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1.2, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
      -1,
      false,
    );
  }, [shimmer]);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: "-38deg" },
      { translateX: shimmer.value * size * 0.72 },
    ],
  }));

  const radius = size / 2;

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: "hidden" }]}
    >
      {Platform.OS !== "web" ? (
        <BlurView
          intensity={Platform.OS === "android" ? 8 : 14}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius: radius, opacity: 0.42 }]}
        />
      ) : null}

      <LinearGradient
        colors={[
          "rgba(255,255,255,0)",
          "rgba(255,255,255,0.12)",
          "rgba(255,255,255,0.28)",
          "rgba(255,255,255,0.06)",
          "rgba(255,255,255,0)",
        ]}
        locations={[0, 0.38, 0.5, 0.62, 1]}
        start={{ x: 0.08, y: 0.05 }}
        end={{ x: 0.92, y: 0.95 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            top: -size * 0.22,
            left: size * 0.08,
            width: size * 0.34,
            height: size * 1.55,
            opacity: 0.95,
          },
          bandStyle,
        ]}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0.62)",
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0)",
          ]}
          locations={[0, 0.32, 0.5, 0.68, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
        <View
          style={{
            position: "absolute",
            top: "38%",
            left: "42%",
            width: size * 0.06,
            height: size * 0.55,
            marginLeft: -(size * 0.03),
            marginTop: -(size * 0.275),
            borderRadius: size * 0.03,
            backgroundColor: "rgba(255,255,255,0.75)",
            opacity: 0.55,
            transform: [{ scaleX: 0.35 }],
          }}
        />
      </Animated.View>

      <LinearGradient
        colors={["rgba(255,255,255,0.34)", "rgba(255,255,255,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.55 }}
        style={{
          position: "absolute",
          top: 0,
          left: size * 0.12,
          right: size * 0.12,
          height: size * 0.38,
          borderRadius: radius,
        }}
      />
    </View>
  );
}
