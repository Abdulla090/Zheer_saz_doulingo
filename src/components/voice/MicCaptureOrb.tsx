import { crossShadow } from "@/utils/shadows";
import { Mic } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  listening: boolean;
  disabled?: boolean;
  color?: string;
  size?: number;
  hint?: string;
  onPress: () => void;
};

export function MicCaptureOrb({
  listening,
  disabled,
  color = "#2B59F3",
  size = 108,
  hint,
  onPress,
}: Props) {
  const ringO = useSharedValue(0);

  useEffect(() => {
    if (listening) {
      ringO.value = withRepeat(
        withTiming(0.42, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(ringO);
      ringO.value = withTiming(0, { duration: 200 });
    }
  }, [listening, ringO]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringO.value,
  }));

  const outer = size + 12;
  const radius = size / 2;

  return (
    <View style={styles.wrap}>
      <View style={[styles.outer, { width: outer, height: outer }]}>
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: color,
            },
            ringStyle,
          ]}
        />
        <Pressable
          onPress={onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={
            listening ? "Stop listening" : "Start microphone"
          }
          accessibilityHint={hint}
          style={({ pressed }) => [
            styles.btn,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: color,
              opacity: disabled ? 0.45 : pressed ? 0.92 : 1,
              ...crossShadow({
                color,
                offsetY: 10,
                opacity: 0.32,
                blur: 20,
                elevation: 10,
              }),
            },
          ]}
        >
          <Mic size={Math.round(size * 0.38)} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 14,
  },
  outer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
  },
  hint: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
  },
});
