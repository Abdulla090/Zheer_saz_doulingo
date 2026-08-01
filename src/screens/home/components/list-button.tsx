import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons/core-free-icons";
import React, { useEffect } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { crossTextShadow } from "../../../utils/shadows";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#46a302", face: "#58cc02" },
  purple: { rim: "#6751C9", face: "#8B73E8" },
  blue: { rim: "#1482b8", face: "#1cb0f6" },
  mint: { rim: "#068265", face: "#08c296" },
  gray: { rim: "#B5B6B8", face: "#E9EAEB" },
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
    const haloProgress = useSharedValue(0);
    const hoverProgress = useSharedValue(0);

    // Slightly wide seated token: full perimeter bevel plus an inset face.
    const width = size;
    const height = Math.round(size * 0.86);
    const rimDepth = Math.max(4, Math.round(size * 0.09));
    const totalHeight = height + rimDepth;
    const borderRadius = Math.round(height / 2);
    const faceInsetX = Math.max(3, Math.round(size * 0.055));
    const faceInsetTop = Math.max(2, Math.round(size * 0.045));
    const faceInsetBottom = Math.max(4, Math.round(size * 0.075));
    const innerWidth = width - faceInsetX * 2;
    const innerHeight = height - faceInsetTop - faceInsetBottom;
    const innerRadius = Math.round(innerHeight / 2);

    const iconSize = Math.round(innerHeight * 0.52);
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#9E9E9E" : "#FFFFFF");
    const showHalo = (isCurrentLesson || isSelected) && !isLocked;

    useEffect(() => {
      if (!showHalo) {
        cancelAnimation(haloProgress);
        haloProgress.value = 0;
        return;
      }
      haloProgress.value = withRepeat(
        withTiming(1, {
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          reduceMotion: ReduceMotion.System,
        }),
        -1,
        true,
      );
      return () => cancelAnimation(haloProgress);
    }, [haloProgress, showHalo]);

    const handlePressIn = () => {
      if (isLocked) return;
      pressProgress.value = withTiming(1, {
        duration: 60,
        easing: Easing.out(Easing.quad),
      });
    };

    const handlePressOut = () => {
      if (isLocked) return;
      pressProgress.value = withSpring(0, {
        stiffness: 520,
        damping: 28,
        mass: 0.45,
        overshootClamping: true,
        reduceMotion: ReduceMotion.System,
      });
    };

    const handleHoverIn = () => {
      if (isLocked) return;
      hoverProgress.value = withTiming(1, {
        duration: 140,
        easing: Easing.out(Easing.cubic),
      });
    };

    const handleHoverOut = () => {
      hoverProgress.value = withTiming(0, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      });
    };

    const topFaceStyle = useAnimatedStyle(() => {
      const pressTranslate = pressProgress.value * (rimDepth - 2);
      return {
        transform: [
          { translateY: pressTranslate },
          { scale: 1 - pressProgress.value * 0.012 },
        ],
      };
    });

    const haloStyle = useAnimatedStyle(() => ({
      opacity:
        (isLocked ? 0.16 : 0.3) +
        hoverProgress.value * 0.2 +
        (showHalo ? haloProgress.value * 0.2 : 0),
      transform: [
        {
          scale:
            0.98 +
            hoverProgress.value * 0.06 +
            (showHalo ? haloProgress.value * 0.035 : 0) -
            pressProgress.value * 0.025,
        },
      ],
    }));

    const tokenStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: hoverProgress.value * -1.5 },
        {
          scale:
            1 +
            hoverProgress.value * 0.025 +
            (showHalo ? haloProgress.value * 0.008 : 0),
        },
      ],
    }));

    return (
      <Pressable
        disabled={!onPress || isLocked}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        activeOpacity={1}
        pressScale={1}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked, selected: isSelected }}
        style={[
          { width, height: totalHeight },
          translateX ? { transform: [{ translateX }] } : undefined,
        ]}
      >
        <Animated.View
          style={[
            { width, height: totalHeight, alignItems: "center" },
            tokenStyle,
          ]}
        >
          {/* Tight contact shadow under the circular badge. */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: totalHeight - 1,
              width: Math.round(width * 0.56),
              height: 3,
              borderRadius: 999,
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.18)",
            }}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                top: -4,
                left: -4,
                width: width + 8,
                height: height + 8,
                borderRadius: borderRadius + 5,
                backgroundColor: `${colors.face}2B`,
                boxShadow: `0 2px 11px ${colors.face}70`,
              },
              haloStyle,
            ]}
          />

          {/* Shallow lower crescent. */}
          <View
            style={{
              position: "absolute",
              top: rimDepth,
              left: 0,
              width,
              height,
              borderRadius,
              backgroundColor: colors.rim,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.11)",
              borderBottomColor: "rgba(0,0,0,0.1)",
            }}
          />

          {/* Raised outer shell — its bevel is visible around every edge. */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                width,
                height,
                borderRadius,
                backgroundColor: colors.rim,
                borderWidth: 1,
                borderColor: isCompleted
                  ? "rgba(255,255,255,0.42)"
                  : "rgba(255,255,255,0.24)",
                borderTopColor: "rgba(255,255,255,0.58)",
                borderBottomColor: "rgba(0,0,0,0.08)",
                overflow: "hidden",
              },
              topFaceStyle,
            ]}
          >
            <LinearGradient
              pointerEvents="none"
              colors={
                isLocked
                  ? ["#F4F5F6", colors.face, "#D3D5D8"]
                  : ["rgba(255,255,255,0.46)", colors.face, colors.rim]
              }
              locations={[0, 0.5, 1]}
              start={{ x: 0.12, y: 0.02 }}
              end={{ x: 0.9, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderRadius,
              }}
            />

            {/* Smaller top face inset into the perimeter bevel. */}
            <View
              style={{
                position: "absolute",
                top: faceInsetTop,
                left: faceInsetX,
                width: innerWidth,
                height: innerHeight,
                borderRadius: innerRadius,
                backgroundColor: colors.face,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderWidth: 0.75,
                borderColor: "rgba(255,255,255,0.24)",
                borderBottomColor: "rgba(0,0,0,0.08)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.22), inset 0 -2px 3px rgba(38,27,91,0.12)",
              }}
            >
              <LinearGradient
                pointerEvents="none"
                colors={
                  isLocked
                    ? ["rgba(255,255,255,0.3)", colors.face, "rgba(0,0,0,0.05)"]
                    : ["rgba(255,255,255,0.26)", colors.face, "rgba(0,0,0,0.07)"]
                }
                locations={[0, 0.54, 1]}
                start={{ x: 0.18, y: 0.04 }}
                end={{ x: 0.82, y: 1 }}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  borderRadius: innerRadius,
                }}
              />
            {!isLocked ? (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: Math.round(innerHeight * 0.08),
                  left: Math.round(innerWidth * 0.14),
                  width: Math.round(innerWidth * 0.46),
                  height: Math.max(3, Math.round(innerHeight * 0.13)),
                  borderRadius: 9999,
                  backgroundColor: "rgba(255,255,255,0.24)",
                  transform: [{ rotate: "-10deg" }],
                }}
              />
            ) : null}
            {label !== undefined ? (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText
                  forceLatinFont
                  languageCode="en"
                  align="center"
                  latinRole="bold"
                  fontFamilyOverride="DINNextRoundedBold"
                  style={{
                    width: "100%",
                    color: resolvedIconColor,
                    textAlign: "center",
                    fontSize: Math.round(innerHeight * 0.56),
                    lineHeight: Math.round(innerHeight * 0.62),
                    fontWeight: "900",
                    fontVariant: ["tabular-nums"],
                    letterSpacing: -0.55,
                    ...crossTextShadow({
                      color: "rgba(44, 32, 102, 0.3)",
                      offsetY: 1,
                      blur: 1,
                    }),
                  }}
                >
                  {label}
                </AppText>
              </View>
            ) : IconComponent ? (
              <IconComponent
                color={isCompleted ? "#FFFFFF" : resolvedIconColor}
                fill={isCompleted ? "#FFFFFF" : resolvedIconColor}
                stroke={isCompleted ? "#FFFFFF" : resolvedIconColor}
                strokeWidth={isCompleted ? 1.5 : 1}
                width={isCompleted ? Math.round(height * 0.52) : iconSize}
                height={isCompleted ? Math.round(height * 0.52) : iconSize}
              />
            ) : null}
            </View>
          </Animated.View>
        </Animated.View>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";
