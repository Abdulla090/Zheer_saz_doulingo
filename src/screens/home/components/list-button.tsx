import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons/core-free-icons";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { crossShadow } from "../../../utils/shadows";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#46a302", face: "#58cc02" },
  purple: { rim: "#9b51e0", face: "#ce82ff" },
  blue: { rim: "#1482b8", face: "#1cb0f6" },
  mint: { rim: "#068265", face: "#08c296" },
  gray: { rim: "#a6a6a6", face: "#e5e5e5" },
  yellow: { rim: "#e59400", face: "#ffc800" },
  gold: { rim: "#e59400", face: "#ffc800" },
  orange: { rim: "#d86f00", face: "#ff9600" },
  red: { rim: "#d32f2f", face: "#ff4b4b" },
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
  isCompleted?: boolean;
  isSelected?: boolean;
  isLocked?: boolean;
  accessibilityLabel?: string;
};

export function CurrentLessonIcon({ size }: { size: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1650,
        easing: Easing.linear,
      }),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );

    return () => cancelAnimation(progress);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const phase = progress.value;
    const translateY = interpolate(
      phase,
      [0, 0.14, 0.48, 0.78, 1],
      [0, 4, -8, 1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      phase,
      [0, 0.14, 0.48, 0.78, 1],
      [1, 0.94, 1.08, 0.99, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        { translateY },
        // A five-point star is visually identical after 72 degrees, so the
        // loop closes cleanly without a visible rotation jump.
        { rotate: `${phase * 72}deg` },
        { scale },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const lift = interpolate(
      progress.value,
      [0, 0.14, 0.48, 0.78, 1],
      [1, 4, -2, 2, 1],
      Extrapolation.CLAMP,
    );
    const shadowScale = interpolate(
      progress.value,
      [0, 0.14, 0.48, 0.78, 1],
      [1, 0.88, 1.16, 0.96, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: interpolate(
        progress.value,
        [0, 0.14, 0.48, 1],
        [0.28, 0.36, 0.13, 0.28],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: lift + 3 },
        { rotate: `${progress.value * 72}deg` },
        { scale: shadowScale },
      ],
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
          shadowStyle,
        ]}
      >
        <HugeiconsIcon
          icon={StarIcon}
          color="rgba(15,23,42,0.18)"
          fill="rgba(15,23,42,0.28)"
          strokeWidth={2.4}
          size={size}
        />
      </Animated.View>
      <Animated.View
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
        style={animatedStyle}
      >
        <HugeiconsIcon
          icon={StarIcon}
          color="#FFFFFF"
          fill="#FFFFFF"
          strokeWidth={2.4}
          size={size}
        />
      </Animated.View>
    </View>
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
    isCompleted = false,
    isSelected = false,
    isLocked = false,
    accessibilityLabel,
  }: SvgButtonProps) => {
    const colors =
      SVG_BUTTON_COLOR_SETS[variant] || SVG_BUTTON_COLOR_SETS.green;
    const pressProgress = useSharedValue(0);

    const depth = Math.max(7, Math.round(size * 0.12));
    const buttonRadius = Math.round(size * 0.4);
    const iconSize = Math.round(size * 0.42);
    const starSize = Math.round(size * 0.5);
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#9E9E9E" : "#FFFFFF");

    const handlePressIn = () => {
      if (isLocked) return;
      pressProgress.value = withTiming(1, {
        duration: 60,
        easing: Easing.out(Easing.quad),
      });
    };

    const handlePressOut = () => {
      if (isLocked) return;
      pressProgress.value = withTiming(0, {
        duration: 90,
        easing: Easing.out(Easing.quad),
      });
    };

    const topFaceStyle = useAnimatedStyle(() => {
      const pressTranslate = pressProgress.value * (depth - 2);
      return {
        transform: [{ translateY: pressTranslate }],
      };
    });

    return (
      <Pressable
        disabled={!onPress || isLocked}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        pressScale={1}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked, selected: isSelected }}
        style={[
          { width: size, height: size + depth },
          translateX ? { transform: [{ translateX }] } : undefined,
        ]}
      >
        <View
          style={{ width: size, height: size + depth, alignItems: "center" }}
        >
          {/* 2.5D Fixed Extruded Rim Base (Stays 100% fixed) */}
          <View
            style={{
              position: "absolute",
              top: depth,
              width: size,
              height: size,
              borderRadius: buttonRadius,
              borderCurve: "continuous",
              backgroundColor: colors.rim,
              ...crossShadow({
                color: colors.rim,
                offsetY: 2,
                blur: 4,
                opacity: isLocked ? 0.1 : 0.2,
                elevation: 2,
              }),
            }}
          />

          {/* 2.5D Pushable Top Face Button (Sinks into base when clicked!) */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                width: size,
                height: size,
                borderRadius: buttonRadius,
                borderCurve: "continuous",
                backgroundColor: colors.face,
                borderWidth: isCompleted ? 1.5 : 0,
                borderColor: isCompleted
                  ? "rgba(255,255,255,0.46)"
                  : "transparent",
                borderTopColor: isCompleted
                  ? "rgba(255,255,255,0.72)"
                  : "transparent",
                borderBottomColor: isCompleted
                  ? "rgba(0,0,0,0.08)"
                  : "transparent",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              },
              topFaceStyle,
            ]}
          >
            {isCompleted ? (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: Math.round(size * 0.08),
                  left: Math.round(size * 0.14),
                  right: Math.round(size * 0.14),
                  height: Math.max(2, Math.round(size * 0.035)),
                  borderRadius: size,
                  backgroundColor: "rgba(255,255,255,0.34)",
                }}
              />
            ) : null}
            {isCurrentLesson && !isLocked ? (
              <CurrentLessonIcon size={starSize} />
            ) : label !== undefined ? (
              <AppText
                forceLatinFont
                latinRole="bold"
                style={{
                  color: resolvedIconColor,
                  fontSize: Math.round(size * 0.38),
                  lineHeight: Math.round(size * 0.44),
                  fontWeight: "900",
                  fontVariant: ["tabular-nums"],
                  letterSpacing: -0.5,
                }}
              >
                {label}
              </AppText>
            ) : IconComponent ? (
              <IconComponent
                color={isCompleted ? "#FFFFFF" : resolvedIconColor}
                fill={isCompleted ? "#FFFFFF" : resolvedIconColor}
                stroke={isCompleted ? "#FFFFFF" : resolvedIconColor}
                strokeWidth={isCompleted ? 1.5 : 1}
                width={isCompleted ? Math.round(size * 0.5) : iconSize}
                height={isCompleted ? Math.round(size * 0.5) : iconSize}
              />
            ) : null}
          </Animated.View>
        </View>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";
