/**
 * Normal English path node — a direct port of the reference implementation at
 * github.com/hewad-mubariz/duolingo-clone (`src/screens/home/components/list-button.tsx`).
 *
 * The depth illusion is two stacked ellipses: a static rim ellipse sits low
 * (`RIM_CY`) and the face ellipse rides above it at `FACE_BASE_CY`, animating
 * down to `FACE_PRESSED_CY` on press. Because both are the same size, the
 * exposed sliver of rim *is* the side wall, so pressing the node genuinely
 * collapses it rather than faking the collapse with opacity.
 *
 * Ordinary nodes stay flat and cheap to draw; completed nodes alone receive a
 * compact metallic gold ramp so completion cannot be mistaken for the
 * bright-yellow reward state.
 *
 * To avoid native SVG animation crashes and virtual view nesting crashes on Android
 * (New Architecture / Fabric), all movement is driven via native `Animated.View`
 * transforms, and all icon components are rendered in hardware-positioned Views
 * rather than nested inside SVG Group elements.
 *
 * Locked and completed rows render through `StaticNormalPathNode` — pure static
 * SVG with no Reanimated hooks, keeping SectionList scrolling lean.
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  Ellipse,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

import { LessonStar } from "../../../constants/icons";
import { CurrentLessonIcon } from "./current-lesson-icon";
import {
  SVG_BUTTON_COLOR_SETS,
  type SvgButtonVariant,
} from "../../../constants/button-theme-colors";

const BUTTON_CENTER_X = 50;
const FACE_BASE_CY = 40;
const RIM_CY = 53;
const RX = 55;
const RY = 45;
const SVG_VIEWBOX = "-10 -10 120 130";

const PRESS_IN_MS = 55;
const PRESS_OUT_MS = 80;

const REFERENCE_NODE_COLORS = {
  green: { rim: "#46a302", face: "#58cc02" },
  purple: { rim: "#a568cc", face: "#ce82ff" },
  blue: { rim: "#2b70c9", face: "#1cb0f6" },
  mint: { rim: "#0B8A6C", face: "#08c296" },
  gray: { rim: "#b7b7b7", face: "#E5E5E5" },
  yellow: { rim: "#ff9600", face: "#ffc800" },
} as const;

function nodeColors(variant: SvgButtonVariant) {
  return (
    REFERENCE_NODE_COLORS[variant as keyof typeof REFERENCE_NODE_COLORS] ??
    SVG_BUTTON_COLOR_SETS[variant] ??
    REFERENCE_NODE_COLORS.green
  );
}

export type NormalPathNodeProps = {
  size?: number;
  onPress?: () => void;
  translateX?: number;
  variant?: SvgButtonVariant;
  IconComponent?: React.ComponentType<any>;
  iconColor?: string;
  isCurrentLesson?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  isUnavailable?: boolean;
  isSelected?: boolean;
  accessibilityLabel?: string;
};

/**
 * Metallic gold ramp for legendary / gold reward nodes.
 */
function GoldGradientDef({ gradientId }: { gradientId: string }) {
  return (
    <Defs>
      <SvgLinearGradient
        id={gradientId}
        x1="16%"
        y1="2%"
        x2="82%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#FFF2B5" />
        <Stop offset="18%" stopColor="#FFE681" />
        <Stop offset="65%" stopColor="#FFC72C" />
        <Stop offset="90%" stopColor="#E3A300" />
        <Stop offset="100%" stopColor="#C97800" />
      </SvgLinearGradient>
    </Defs>
  );
}

/**
 * Static SVG rendering for locked, completed, or inert nodes.
 * Skips Reanimated mount and shared values entirely.
 * Icons are rendered in a positioned View above the face to avoid nested SVG virtual view crashes.
 */
function StaticNormalPathNode({
  size = 80,
  translateX,
  variant = "green",
  IconComponent = LessonStar,
  iconColor,
  isCurrentLesson = false,
  isCompleted = false,
  isLocked = false,
  isUnavailable = false,
  isSelected = false,
  accessibilityLabel,
}: NormalPathNodeProps) {
  const goldGradientId = React.useId().replace(/:/g, "");
  const colors = useMemo(() => nodeColors(variant), [variant]);
  const usesMetallicGold = !isCompleted && variant === "gold";
  const resolvedIconColor =
    iconColor ?? (isCompleted ? "#FFFFFF" : variant === "gray" ? "#AFAFAF" : "white");

  // 50 viewBox units for completed checkmark, 57.6 for stars/icons
  const iconPixelSize = Math.round(size * (isCompleted ? 50 / 130 : 57.6 / 130));
  const iconLeft = Math.round((size - iconPixelSize) / 2);
  const iconTop = Math.round(size * (49 / 130) - iconPixelSize / 2);

  return (
    <Pressable
      disabled
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: true, selected: isSelected }}
      style={{
        width: size,
        height: size,
        opacity: isUnavailable ? 0.62 : 1,
        transform: [{ translateX: translateX || 0 }],
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={SVG_VIEWBOX}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          {usesMetallicGold ? (
            <GoldGradientDef gradientId={goldGradientId} />
          ) : null}
        </Defs>

        {/* 1. Rim — 3D cylinder depth */}
        <Ellipse
          cx={BUTTON_CENTER_X}
          cy={RIM_CY}
          rx={RX}
          ry={RY}
          fill={colors.rim}
        />

        {/* 2. Face — top ellipse */}
        <Ellipse
          cx={BUTTON_CENTER_X}
          cy={FACE_BASE_CY}
          rx={RX}
          ry={RY}
          fill={usesMetallicGold ? `url(#${goldGradientId})` : colors.face}
          stroke={usesMetallicGold ? "#FFE681" : undefined}
          strokeWidth={usesMetallicGold ? 1.25 : 0}
        />
      </Svg>

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: iconLeft,
          top: iconTop,
          width: iconPixelSize,
          height: iconPixelSize,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComponent
          color={resolvedIconColor}
          fill={resolvedIconColor}
          stroke={resolvedIconColor}
          strokeWidth={1}
          width={iconPixelSize}
          height={iconPixelSize}
        />
      </View>
    </Pressable>
  );
}

/**
 * Interactive path row. On touch, the face layer travels downward into the rim
 * via a standard hardware-accelerated `Animated.View` translation, keeping the
 * entire animation off Fabric's SVG ShadowNodes and avoiding nested SVG crashes.
 */
const PressableNormalPathNode = React.memo(
  ({
    size = 80,
    onPress,
    translateX,
    variant = "green",
    IconComponent = LessonStar,
    iconColor,
    isCurrentLesson = false,
    isCompleted = false,
    isLocked = false,
    isUnavailable = false,
    isSelected = false,
    accessibilityLabel,
  }: NormalPathNodeProps) => {
    const goldGradientId = React.useId().replace(/:/g, "");
    const colors = useMemo(() => nodeColors(variant), [variant]);
    const usesMetallicGold = !isCompleted && variant === "gold";
    const resolvedIconColor =
      iconColor ?? (isCompleted ? "#FFFFFF" : variant === "gray" ? "#AFAFAF" : "white");

    const pressProgress = useSharedValue(0);

    // 12 viewBox units (52 - 40) scaled to pixel dimensions
    const faceTravelPx = Math.round(size * (12 / 130));
    // 50 viewBox units for completed checkmark, 57.6 for stars/icons
    const iconPixelSize = Math.round(size * (isCompleted ? 50 / 130 : 57.6 / 130));
    const iconLeft = Math.round((size - iconPixelSize) / 2);
    const iconTop = Math.round(size * (49 / 130) - iconPixelSize / 2);

    const faceAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: pressProgress.value * faceTravelPx }],
    }));

    const handlePressIn = useCallback(() => {
      pressProgress.value = withTiming(1, {
        duration: PRESS_IN_MS,
        easing: Easing.out(Easing.cubic),
      });
    }, [pressProgress]);

    const handlePressOut = useCallback(() => {
      pressProgress.value = withTiming(0, {
        duration: PRESS_OUT_MS,
        easing: Easing.out(Easing.cubic),
      });
    }, [pressProgress]);

    const handlePress = useCallback(() => {
      onPress?.();
    }, [onPress]);

    useEffect(() => {
      return () => {
        cancelAnimation(pressProgress);
      };
    }, [pressProgress]);

    const showsActiveLessonIcon = isCurrentLesson && !isLocked;

    return (
      <Pressable
        disabled={!onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !onPress, selected: isSelected }}
        style={{
          width: size,
          height: size,
          opacity: isUnavailable ? 0.62 : 1,
          transform: [{ translateX: translateX || 0 }],
        }}
      >
        {/* 1. Rim — static, and the part left exposed below the face reads as
            the node's side wall. */}
        <Svg
          width="100%"
          height="100%"
          viewBox={SVG_VIEWBOX}
          style={StyleSheet.absoluteFill}
        >
          <Ellipse
            cx={BUTTON_CENTER_X}
            cy={RIM_CY}
            rx={RX}
            ry={RY}
            fill={colors.rim}
          />
        </Svg>

        {/* 2. Face + Icon — travels down on press to seat into the rim. */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, faceAnimatedStyle]}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox={SVG_VIEWBOX}
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              {usesMetallicGold ? (
                <GoldGradientDef gradientId={goldGradientId} />
              ) : null}
            </Defs>

            <Ellipse
              cx={BUTTON_CENTER_X}
              cy={FACE_BASE_CY}
              rx={RX}
              ry={RY}
              fill={
                usesMetallicGold ? `url(#${goldGradientId})` : colors.face
              }
              stroke={usesMetallicGold ? "#FFE681" : undefined}
              strokeWidth={usesMetallicGold ? 1.25 : 0}
            />
          </Svg>

          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: iconLeft,
              top: iconTop,
              width: iconPixelSize,
              height: iconPixelSize,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showsActiveLessonIcon ? (
              <CurrentLessonIcon
                IconComponent={IconComponent}
                color={resolvedIconColor}
                width={iconPixelSize}
                height={iconPixelSize}
              />
            ) : (
              <IconComponent
                color={resolvedIconColor}
                fill={resolvedIconColor}
                stroke={resolvedIconColor}
                strokeWidth={1}
                width={iconPixelSize}
                height={iconPixelSize}
              />
            )}
          </View>
        </Animated.View>
      </Pressable>
    );
  },
);

PressableNormalPathNode.displayName = "PressableNormalPathNode";

export const NormalPathNode = React.memo((props: NormalPathNodeProps) => {
  const { onPress } = props;
  const canPress = Boolean(onPress);

  if (!canPress) return <StaticNormalPathNode {...props} />;
  return <PressableNormalPathNode {...props} />;
});

NormalPathNode.displayName = "NormalPathNode";
