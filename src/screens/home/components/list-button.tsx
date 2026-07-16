import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons/core-free-icons";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#58a700", face: "#58cc02" },
  purple: { rim: "#a568cc", face: "#ce82ff" },
  blue: { rim: "#2b70c9", face: "#1cb0f6" },
  mint: { rim: "#0B8A6C", face: "#08c296" },
  gray: { rim: "#b7b7b7", face: "#E5E5E5" },
  yellow: { rim: "#ff9600", face: "#ffc800" },
  gold: { rim: "#ff9600", face: "#ffc800" },
  orange: { rim: "#d86f00", face: "#ff9600" },
  red: { rim: "#d33131", face: "#ff4b4b" },
} as const;

type SvgButtonProps = {
  size?: number;
  onPress?: () => void;
  translateX?: number;
  variant?: SvgButtonVariant;
  IconComponent?: React.ComponentType<any>;
  iconColor?: string;
  label?: string | number;
  isCurrentLesson?: boolean;
  isSelected?: boolean;
  isLocked?: boolean;
  accessibilityLabel?: string;
};

export function CurrentLessonIcon({ size }: { size: number }) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      translateY.value = 0;
      rotate.value = 0;
      return;
    }

    translateY.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 200 }),
        withTiming(-8, { duration: 500 }),
        withTiming(0, { duration: 550 }),
      ),
      -1,
      false,
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(72, { duration: 500 }),
        withTiming(72, { duration: 550 }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
    };
  }, [reduceMotion, rotate, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <HugeiconsIcon
        icon={StarIcon}
        color="#FFFFFF"
        fill="#FFFFFF"
        strokeWidth={2.4}
        size={size}
      />
    </Animated.View>
  );
}

export const SvgButton = React.memo(
  ({
    size = 70,
    onPress,
    translateX,
    variant = "green",
    IconComponent,
    iconColor,
    label,
    isCurrentLesson = false,
    isSelected = false,
    isLocked = false,
    accessibilityLabel,
  }: SvgButtonProps) => {
    const colors = SVG_BUTTON_COLOR_SETS[variant];
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#AFAFAF" : "white");
    const depth = Math.max(5, Math.round(size * 0.09));
    const faceSize = size - depth;
    const faceTop = 0;
    const rimTop = depth;
    const iconSize = Math.round(size * 0.44);

    return (
      <Pressable
        disabled={!onPress}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked, selected: isSelected }}
        style={[
          { width: size, height: size },
          translateX ? { transform: [{ translateX }] } : undefined,
        ]}
      >
        <View style={{ width: size, height: size, alignItems: "center" }}>
          <View
            style={{
              position: "absolute",
              top: rimTop,
              width: faceSize,
              height: faceSize,
              borderRadius: faceSize / 2,
              backgroundColor: colors.rim,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: faceTop,
              width: faceSize,
              height: faceSize,
              borderRadius: faceSize / 2,
              backgroundColor: colors.face,
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.34)",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -Math.round(size * 0.04),
                left: -Math.round(size * 0.18),
                width: Math.round(size * 1.35),
                height: Math.round(size * 0.22),
                backgroundColor: "rgba(255,255,255,0.28)",
                transform: [{ rotate: "-24deg" }],
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: -Math.round(size * 0.02),
                left: -Math.round(size * 0.12),
                width: Math.round(size * 1.25),
                height: Math.round(size * 0.14),
                backgroundColor: "rgba(255,255,255,0.18)",
                transform: [{ rotate: "-24deg" }],
              }}
            />
            {isCurrentLesson && !isLocked ? (
              <CurrentLessonIcon size={iconSize} />
            ) : label !== undefined ? (
              <AppText
                forceLatinFont
                latinRole="bold"
                style={{
                  color: resolvedIconColor,
                  fontSize: Math.round(size * 0.34),
                  lineHeight: Math.round(size * 0.4),
                  fontWeight: "900",
                  fontVariant: ["tabular-nums"],
                  letterSpacing: -0.5,
                }}
              >
                {label}
              </AppText>
            ) : IconComponent ? (
              <IconComponent
                color={resolvedIconColor}
                fill={resolvedIconColor}
                stroke={resolvedIconColor}
                strokeWidth={1}
                width={iconSize}
                height={iconSize}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";
