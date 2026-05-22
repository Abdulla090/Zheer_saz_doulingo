import { Star } from "@/constants/icons";
import React, { useCallback, useId, useMemo } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { ClipPath, Defs, Ellipse, G, Rect, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { CurrentLessonIcon } from "./current-lesson-icon";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#58a700", face: "#58cc02" },
  purple: { rim: "#a568cc", face: "#ce82ff" },
  blue: { rim: "#2b70c9", face: "#1cb0f6" },
  mint: { rim: "#0B8A6C", face: "#08c296" },
  gray: { rim: "#b7b7b7", face: "#E5E5E5" },
  yellow: { rim: "#ff9600", face: "#ffc800" },
  orange: { rim: "#E65100", face: "#FF9800" },
  red: { rim: "#B71C1C", face: "#F44336" },
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
const CLIP_INSET = 8;
const ICON_SCALE = 1.8;
const ICON_DROP_DISTANCE = 12;
const SVG_VIEWBOX = "-10 -10 120 130";
const STAR_VB_W = 32;
const STAR_VB_H = 32;
const GLOSS_X = -10;
const GLOSS_W = 120;
const GLOSS_TOP_Y = -2;
const GLOSS_TOP_H = 30;
const GLOSS_BOTTOM_Y = 50;
const GLOSS_BOTTOM_H = 26;
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedGroup = Animated.createAnimatedComponent(G);

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

    const cy = useSharedValue(FACE_BASE_CY);
    const outerCircleAnimatedProps = useAnimatedProps(() => {
      return { cy: cy.value };
    });
    const groupAnimatedProps = useAnimatedProps(() => {
      const y = interpolate(
        cy.value,
        [FACE_BASE_CY, RIM_CY],
        [0, ICON_DROP_DISTANCE],
      );
      return { transform: [{ translateY: y }] };
    });

    const iconFollowFaceProps = useAnimatedProps(() => ({
      transform: [{ translateY: cy.value - FACE_BASE_CY }],
    }));

    const handlePressIn = useCallback(() => {
      cy.value = withTiming(FACE_PRESSED_CY, { duration: 100 });
    }, [cy]);
    const handlePressOut = useCallback(() => {
      cy.value = withTiming(FACE_BASE_CY, { duration: 100 });
    }, [cy]);

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

          {/* 1. Shadow/Rim (adds depth) */}
          <Ellipse
            cx={BUTTON_CENTER_X}
            cy={RIM_CY}
            rx={RX}
            ry={RY}
            fill={colors.rim}
          />

          {/* 2. Moving Face Base */}
          <AnimatedEllipse
            animatedProps={outerCircleAnimatedProps}
            cx={BUTTON_CENTER_X}
            cy={FACE_BASE_CY}
            rx={RX}
            ry={RY}
            fill={colors.face}
          />

          {/* 3. iOS 2026 Liquid Glass Dome Highlight */}
          <AnimatedGroup
            animatedProps={groupAnimatedProps}
            clipPath={`url(#${clipId})`}
          >
            <Ellipse
              cx={BUTTON_CENTER_X}
              cy={FACE_BASE_CY}
              rx={RX}
              ry={RY}
              fill={`url(#glass-${clipId})`}
            />
            {/* Subtle inner stroke for glass edge */}
            <Ellipse
              cx={BUTTON_CENTER_X}
              cy={FACE_BASE_CY}
              rx={RX - 2}
              ry={RY - 2}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              fill="none"
            />
          </AnimatedGroup>

          {/* 4. Center icon */}
          <AnimatedGroup animatedProps={iconFollowFaceProps}>
            <G transform={`translate(${BUTTON_CENTER_X} ${FACE_BASE_CY})`}>
              <G
                transform={`scale(${ICON_SCALE}) translate(${-STAR_VB_W / 2} ${-STAR_VB_H / 2})`}
              >
                {isCurrentLesson ? (
                  <CurrentLessonIcon
                    IconComponent={IconComponent}
                    color={resolvedIconColor}
                    width={STAR_VB_W}
                    height={STAR_VB_H}
                  />
                ) : (
                  <IconComponent
                    fill={resolvedIconColor}
                    stroke={resolvedIconColor}
                    strokeWidth={1}
                    width={STAR_VB_W}
                    height={STAR_VB_H}
                  />
                )}
              </G>
            </G>
          </AnimatedGroup>
        </Svg>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";
