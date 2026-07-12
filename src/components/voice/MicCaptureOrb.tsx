import { crossShadow } from "../../utils/shadows";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { Mic01Icon, SquareIcon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../ui/AppText";

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
  color = "#0F172A",
  size = 108,
  hint,
  onPress,
}: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (listening) {
      pulse.value = 0;
      pulse.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 300 });
    }
  }, [listening, pulse]);

  const ring1Style = useAnimatedStyle(() => {
    const p = pulse.value;
    return {
      transform: [{ scale: 1 + p * 1.0 }],
      opacity: (1 - p) * 0.45 * (listening ? 1 : 0),
    };
  });

  const ring2Style = useAnimatedStyle(() => {
    const p = (pulse.value + 0.33) % 1;
    return {
      transform: [{ scale: 1 + p * 1.0 }],
      opacity: (1 - p) * 0.45 * (listening ? 1 : 0),
    };
  });

  const ring3Style = useAnimatedStyle(() => {
    const p = (pulse.value + 0.66) % 1;
    return {
      transform: [{ scale: 1 + p * 1.0 }],
      opacity: (1 - p) * 0.45 * (listening ? 1 : 0),
    };
  });

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
            ring1Style,
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: color,
            },
            ring2Style,
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: color,
            },
            ring3Style,
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
          <HugeiconsIcon icon={listening ? SquareIcon : Mic01Icon} size={Math.round(size * 0.38)} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>
      {hint ? <AppText style={styles.hint}>{hint}</AppText> : null}
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
