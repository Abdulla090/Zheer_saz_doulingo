import { Star } from "@/constants/icons";
import React, { useCallback, useId, useMemo } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  ClipPath,
  Defs,
  Ellipse,
  G,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { CurrentLessonIcon } from "./current-lesson-icon";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#58a700", face: "#58cc02" },
  purple: { rim: "#a568cc", face: "#ce82ff" },
  blue: { rim: "#2b70c9", face: "#1cb0f6" },
  mint: { rim: "#0B8A6C", face: "#08c296" },
  gray: { rim: "#afafaf", face: "#e0e0e0" },
  yellow: { rim: "#ff9600", face: "#ffc800" },
  gold: { rim: "#e5a000", face: "#ffc800" },
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
  isLocked?: boolean;
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
    isLocked = false,
  }: SvgButtonProps) => {
    const colors = useMemo(() => SVG_BUTTON_COLOR_SETS[variant], [variant]);
    const clipId = useId().replace(/[:]/g, "");
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#AFAFAF" : variant === "gold" ? "#FFFFFF" : "white");

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
        onPressIn={isLocked ? undefined : handlePressIn}
        onPressOut={isLocked ? undefined : handlePressOut}
        onPress={onPress}
        disabled={isLocked}
        style={{
          width: size,
          height: size,
          transform: [{ translateX: translateX || 0 }],
        }}
      >
        <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
          <Defs>
            <ClipPath id={clipId}>
              <Ellipse cx={BUTTON_CENTER_X} cy={FACE_BASE_CY} rx={RX} ry={RY} />
            </ClipPath>
            <SvgLinearGradient id={`glass-${clipId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
              <Stop offset="35%" stopColor="rgba(255,255,255,0.1)" />
              <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </SvgLinearGradient>
            <SvgLinearGradient
              id={`blueShine-${clipId}`}
              x1="15%"
              y1="5%"
              x2="85%"
              y2="95%"
            >
              <Stop offset="0%" stopColor="rgba(70,150,255,0)" />
              <Stop offset="28%" stopColor="rgba(80,165,255,0.06)" />
              <Stop offset="38%" stopColor="rgba(95,180,255,0.28)" />
              <Stop offset="46%" stopColor="rgba(140,210,255,0.52)" />
              <Stop offset="50%" stopColor="rgba(190,235,255,0.62)" />
              <Stop offset="54%" stopColor="rgba(140,210,255,0.52)" />
              <Stop offset="62%" stopColor="rgba(95,180,255,0.28)" />
              <Stop offset="72%" stopColor="rgba(80,165,255,0.06)" />
              <Stop offset="100%" stopColor="rgba(70,150,255,0)" />
            </SvgLinearGradient>
            <SvgLinearGradient
              id={`blueShineWide-${clipId}`}
              x1="10%"
              y1="0%"
              x2="90%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="rgba(60,140,255,0)" />
              <Stop offset="32%" stopColor="rgba(75,160,255,0.1)" />
              <Stop offset="50%" stopColor="rgba(110,190,255,0.22)" />
              <Stop offset="68%" stopColor="rgba(75,160,255,0.1)" />
              <Stop offset="100%" stopColor="rgba(60,140,255,0)" />
            </SvgLinearGradient>
          </Defs>

          <Ellipse
            cx={BUTTON_CENTER_X}
            cy={RIM_CY}
            rx={RX}
            ry={RY}
            fill={colors.rim}
          />

          <AnimatedG animatedProps={groupAnimatedProps}>
            <Ellipse
              cx={BUTTON_CENTER_X}
              cy={FACE_BASE_CY}
              rx={RX}
              ry={RY}
              fill={colors.face}
            />

            <G clipPath={`url(#${clipId})`}>
              <Ellipse
                cx={BUTTON_CENTER_X}
                cy={FACE_BASE_CY}
                rx={RX}
                ry={RY}
                fill={`url(#blueShineWide-${clipId})`}
                opacity={isLocked ? 0.55 : 0.85}
              />
              <Ellipse
                cx={BUTTON_CENTER_X}
                cy={FACE_BASE_CY}
                rx={RX}
                ry={RY}
                fill={`url(#blueShine-${clipId})`}
                opacity={isLocked ? 0.65 : 1}
              />
              <Ellipse
                cx={BUTTON_CENTER_X}
                cy={FACE_BASE_CY}
                rx={RX}
                ry={RY}
                fill={`url(#glass-${clipId})`}
              />
            </G>

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
