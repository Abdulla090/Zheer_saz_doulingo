import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons/core-free-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { PathCircleShine } from "./path-circle-shine";
import { crossShadow } from "../../../utils/shadows";

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

    // Settle once, then travel directly between the two endpoints. Returning
    // to zero before starting the next descent caused a visible hitch.
    translateY.value = withSequence(
      withTiming(5, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      }),
      withRepeat(
        withSequence(
          withTiming(-8, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
          }),
          withTiming(5, {
            duration: 650,
            easing: Easing.inOut(Easing.cubic),
          }),
        ),
        -1,
        false,
      ),
    );
    // Five bounces make one full turn. Resetting at 360deg is visually
    // identical, unlike the old 72deg-to-0deg snap at the loop boundary.
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 5750,
        easing: Easing.linear,
      }),
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
    const nodeLift = useSharedValue(0);
    const nodeScale = useSharedValue(1);
    const reduceMotion = useReducedMotion();
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#AFAFAF" : "white");
    const depth = Math.max(4, Math.round(size * 0.055));
    const faceSize = size - depth;
    const cornerRadius = Math.round(faceSize * 0.31);
    const faceTop = 0;
    const rimTop = depth;
    const iconSize = Math.round(size * 0.44);

    useEffect(() => {
      if (!isCurrentLesson || isLocked || reduceMotion) {
        nodeLift.value = withTiming(0, { duration: 180 });
        nodeScale.value = withTiming(1, { duration: 180 });
        return;
      }

      nodeLift.value = withRepeat(
        withSequence(
          withTiming(-2.5, {
            duration: 1350,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: 1550,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      );
      nodeScale.value = withRepeat(
        withSequence(
          withTiming(1.018, {
            duration: 1350,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1, {
            duration: 1550,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      );

      return () => {
        cancelAnimation(nodeLift);
        cancelAnimation(nodeScale);
      };
    }, [isCurrentLesson, isLocked, nodeLift, nodeScale, reduceMotion]);

    const nodeMotionStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: nodeLift.value },
        { scale: nodeScale.value },
      ],
    }));

    return (
      <Pressable
        disabled={!onPress}
        onPress={onPress}
        activeOpacity={0.96}
        pressScale={0.94}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked, selected: isSelected }}
        style={[
          { width: size, height: size },
          translateX ? { transform: [{ translateX }] } : undefined,
        ]}
      >
        <Animated.View
          style={[
            { width: size, height: size, alignItems: "center" },
            nodeMotionStyle,
          ]}
        >
          <LinearGradient
            colors={[colors.face, colors.rim]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: "absolute",
              top: rimTop,
              width: faceSize - 2,
              height: faceSize,
              borderRadius: cornerRadius - 1,
              borderCurve: "continuous",
              ...crossShadow({
                color: colors.rim,
                offsetY: 3,
                blur: 7,
                opacity: isLocked ? 0.1 : 0.2,
                elevation: 2,
              }),
            }}
          />
          <View
            style={{
              position: "absolute",
              top: faceTop,
              width: faceSize,
              height: faceSize,
              borderRadius: cornerRadius,
              borderCurve: "continuous",
              backgroundColor: colors.face,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              borderTopColor: "rgba(255,255,255,0.5)",
              borderLeftColor: "rgba(255,255,255,0.28)",
              borderRightColor: "rgba(255,255,255,0.14)",
              borderBottomColor: "rgba(0,0,0,0.06)",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <LinearGradient
              pointerEvents="none"
              colors={[
                "rgba(255,255,255,0.17)",
                "rgba(255,255,255,0)",
                "rgba(0,0,0,0.055)",
              ]}
              locations={[0, 0.58, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: cornerRadius,
              }}
            />
            {isCurrentLesson && !isLocked ? (
              <PathCircleShine size={faceSize} radius={cornerRadius} />
            ) : (
              <>
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: -Math.round(size * 0.04),
                    left: -Math.round(size * 0.18),
                    width: Math.round(size * 1.35),
                    height: Math.round(size * 0.22),
                    backgroundColor: "rgba(255,255,255,0.24)",
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
                    height: Math.round(size * 0.12),
                    backgroundColor: "rgba(255,255,255,0.14)",
                    transform: [{ rotate: "-24deg" }],
                  }}
                />
              </>
            )}
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
        </Animated.View>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";
