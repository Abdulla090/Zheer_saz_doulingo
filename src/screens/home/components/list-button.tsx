import { Star } from "@/constants/icons";
import React, { useCallback, useId, useMemo } from "react";
import { Pressable } from "react-native";
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { ClipPath, Defs, Ellipse, G, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";
import { CurrentLessonIcon } from "./current-lesson-icon";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

export const SVG_BUTTON_COLOR_SETS = {
  green:  { rim: "#58a700", face: "#58cc02" },
  purple: { rim: "#a568cc", face: "#ce82ff" },
  blue:   { rim: "#2b70c9", face: "#1cb0f6" },
  mint:   { rim: "#0B8A6C", face: "#08c296" },
  gray:   { rim: "#b7b7b7", face: "#E5E5E5" },
  yellow: { rim: "#ff9600", face: "#ffc800" },
  orange: { rim: "#E65100", face: "#FF9800" },
  red:    { rim: "#B71C1C", face: "#F44336" },
} as const;

type SvgButtonProps = {
  size?: number;
  onPress?: () => void;
  translateX?: number;
  variant?: SvgButtonVariant;
  IconComponent?: React.ComponentType<any>;
  iconColor?: string;
  isCurrentLesson?: boolean;
};

const BUTTON_CENTER_X = 50;
const FACE_BASE_CY = 40;
const RIM_CY = 53;
const FACE_PRESSED_CY = 52;
const RX = 50;
const RY = 50;
const ICON_SCALE = 1.8;
const SVG_VIEWBOX = "-10 -10 120 130";
const STAR_VB_W = 32;
const STAR_VB_H = 32;
const AnimatedG = Animated.createAnimatedComponent(G);

export const SvgButton = React.memo(
  ({
    size = 70,
    onPress,
    translateX,
    variant = "green",
    IconComponent = Star,
    iconColor,
    isCurrentLesson = false,
  }: SvgButtonProps) => {
    const colors = useMemo(() => SVG_BUTTON_COLOR_SETS[variant], [variant]);
    const clipId = useId().replace(/[:]/g, "");
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#AFAFAF" : "white");

    // Single shared value drives both face translation and icon translation
    const offsetY = useSharedValue(0);

    const groupAnimatedProps = useAnimatedProps(() => ({
      transform: [{ translateY: offsetY.value }],
    }));

    const handlePressIn = useCallback(() => {
      offsetY.value = withTiming(FACE_PRESSED_CY - FACE_BASE_CY, { duration: 100 });
    }, [offsetY]);
    const handlePressOut = useCallback(() => {
      offsetY.value = withTiming(0, { duration: 100 });
    }, [offsetY]);

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={{
          width: size,
          height: size,
          transform: [{ translateX: translateX || 0 }],
        }}
      >
        <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
          <Defs>
            <ClipPath id={clipId}>
              <Ellipse
                cx={BUTTON_CENTER_X}
                cy={FACE_BASE_CY}
                rx={RX}
                ry={RY}
              />
            </ClipPath>
            <SvgLinearGradient id={`glass-${clipId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <Stop offset="30%" stopColor="rgba(255,255,255,0.15)" />
              <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </SvgLinearGradient>
          </Defs>

          {/* 1. Static rim/shadow */}
          <Ellipse
            cx={BUTTON_CENTER_X}
            cy={RIM_CY}
            rx={RX}
            ry={RY}
            fill={colors.rim}
          />

          {/* 2. Animated group: face + glass + icon all move together on press */}
          <AnimatedG animatedProps={groupAnimatedProps}>
            {/* Face */}
            <Ellipse
              cx={BUTTON_CENTER_X}
              cy={FACE_BASE_CY}
              rx={RX}
              ry={RY}
              fill={colors.face}
            />
            {/* Glass dome highlight */}
            <G clipPath={`url(#${clipId})`}>
              <Ellipse
                cx={BUTTON_CENTER_X}
                cy={FACE_BASE_CY}
                rx={RX}
                ry={RY}
                fill={`url(#glass-${clipId})`}
              />
            </G>
            {/* Icon */}
            <G transform={`translate(${BUTTON_CENTER_X} ${FACE_BASE_CY})`}>
              <G transform={`scale(${ICON_SCALE}) translate(${-STAR_VB_W / 2} ${-STAR_VB_H / 2})`}>
                {isCurrentLesson ? (
                  <CurrentLessonIcon
                    IconComponent={IconComponent}
                    color={resolvedIconColor}
                    width={STAR_VB_W}
                    height={STAR_VB_H}
                  />
                ) : (
                  <IconComponent
                    color={resolvedIconColor}
                    fill={resolvedIconColor}
                    stroke={resolvedIconColor}
                    strokeWidth={1}
                    width={STAR_VB_W}
                    height={STAR_VB_H}
                  />
                )}
              </G>
            </G>
          </AnimatedG>
        </Svg>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";
