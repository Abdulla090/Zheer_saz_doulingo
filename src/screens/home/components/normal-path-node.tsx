/**
 * Normal English path node — a direct port of the reference implementation at
 * github.com/hewad-mubariz/duolingo-clone (`src/screens/home/components/list-button.tsx`).
 *
 * The depth illusion is two stacked ellipses, not a stack of Views: a static rim
 * ellipse sits low (`RIM_CY`) and the face ellipse rides above it at
 * `FACE_BASE_CY`, animating down to `FACE_PRESSED_CY` on press. Because both are
 * the same size, the exposed sliver of rim *is* the side wall, so pressing the
 * node genuinely collapses it rather than faking the collapse with opacity.
 *
 * The reference also paints two gloss sheens across the face. Ordinary nodes
 * stay flat and cheap to draw; completed nodes alone receive a compact metallic
 * gold ramp so completion cannot be mistaken for the bright-yellow reward state.
 *
 * Street and kids paths keep the View + LinearGradient `SvgButton`; only the
 * normal path renders this. Locked and completed states are additions to the
 * reference, which has neither — they are load-bearing here.
 */

import React, { useCallback, useMemo, useRef } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  Ellipse,
  G,
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
const FACE_PRESSED_CY = 52;
const RX = 55;
const RY = 45;
const ICON_SCALE = 1.8;
const SVG_VIEWBOX = "-10 -10 120 130";
const ICON_VB_W = 32;
const ICON_VB_H = 32;

const PRESS_DURATION_MS = 100;

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedGroup = Animated.createAnimatedComponent(G);

/*
 * The reference's own face/rim pairs. They differ from this app's shared
 * `SVG_BUTTON_COLOR_SETS` on three variants — purple (#ce82ff vs #8B73E8), blue's
 * rim (#2b70c9 vs #1482b8) and green's rim (#58a700 vs #46a302) — so the exact
 * values are pinned here rather than by editing the shared palette, which the
 * unit banner and the street and kids paths also read.
 *
 * Variants the reference never defines (orange, red, gold) fall through to the
 * shared palette.
 */
const REFERENCE_NODE_COLORS = {
  green: { rim: "#58a700", face: "#58cc02" },
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
  isSelected?: boolean;
  accessibilityLabel?: string;
};

export const NormalPathNode = React.memo(
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
    isSelected = false,
    accessibilityLabel,
  }: NormalPathNodeProps) => {
    const goldGradientId = React.useId().replace(/:/g, "");
    const colors = useMemo(() => nodeColors(variant), [variant]);
    const usesMetallicGold = isCompleted || variant === "gold";
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#AFAFAF" : "white");

    const cy = useSharedValue(FACE_BASE_CY);

    const faceAnimatedProps = useAnimatedProps(() => ({ cy: cy.value }));

    /*
     * The icon is painted *on* the face, so it travels by exactly the face's own
     * displacement. Deriving it from `cy` rather than interpolating over a
     * separate range keeps it welded to the surface — an independent range
     * drifts by a unit at the pressed end and the icon visibly slides.
     */
    const followFaceProps = useAnimatedProps(() => ({
      transform: [{ translateY: cy.value - FACE_BASE_CY }],
    }));

    /*
     * Open on touch-down, not on release.
     *
     * `Pressable`'s `onPress` fires when the finger lifts, so the popup used to
     * wait out however long the node was held — the press animation runs in
     * 100ms, but a normal tap is held far longer, which is the delay that read
     * as lag. Firing here lets the popup and the 3D press play together.
     *
     * The face still animates when locked; only the dispatch is suppressed, so
     * a locked node stays physical under the finger.
     */
    const openedOnPressInRef = useRef(false);

    const handlePressIn = useCallback(() => {
      openedOnPressInRef.current = false;
      if (isLocked) return;
      cy.value = withTiming(FACE_PRESSED_CY, { duration: PRESS_DURATION_MS });
      if (onPress) {
        openedOnPressInRef.current = true;
        onPress();
      }
    }, [cy, isLocked, onPress]);

    const handlePressOut = useCallback(() => {
      if (isLocked) return;
      cy.value = withTiming(FACE_BASE_CY, { duration: PRESS_DURATION_MS });
    }, [cy, isLocked]);

    /*
     * Assistive activation (VoiceOver/TalkBack double-tap) reaches `onPress`
     * without ever going through `onPressIn`, so this stays wired — it just
     * stands down when touch-down already did the work.
     */
    const handlePress = useCallback(() => {
      if (openedOnPressInRef.current) {
        openedOnPressInRef.current = false;
        return;
      }
      onPress?.();
    }, [onPress]);

    return (
      /*
       * Plain `Pressable`, as in the reference. `IOSPressable`'s `inList` branch
       * dims to `activeOpacity` while pressed, which would wash the node out on
       * top of the face travel — the ellipse slide is the whole press language
       * here, so it has to be the only thing that moves.
       *
       * Whether a locked node is pressable is the caller's call: the path opens
       * a popup explaining the lock, so `onPress` is still wired when locked.
       */
      <Pressable
        disabled={!onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked, selected: isSelected }}
        style={{
          width: size,
          height: size,
          transform: [{ translateX: translateX || 0 }],
        }}
      >
        <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
          {usesMetallicGold ? (
            <Defs>
              <SvgLinearGradient
                id={goldGradientId}
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
          ) : null}

          {/* 1. Rim — static, and the part left exposed below the face reads as
              the node's side wall. */}
          <Ellipse
            cx={BUTTON_CENTER_X}
            cy={RIM_CY}
            rx={RX}
            ry={RY}
            fill={colors.rim}
          />

          {/* 2. Face — travels down on press to seat into the rim. */}
          <AnimatedEllipse
            animatedProps={faceAnimatedProps}
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

          {/* 3. Icon — painted on the face, so it rides the same displacement. */}
          <AnimatedGroup animatedProps={followFaceProps}>
            <G transform={`translate(${BUTTON_CENTER_X} ${FACE_BASE_CY})`}>
              <G
                transform={`scale(${ICON_SCALE}) translate(${-ICON_VB_W / 2} ${-ICON_VB_H / 2})`}
              >
                {isCurrentLesson && !isLocked ? (
                  <CurrentLessonIcon
                    IconComponent={IconComponent}
                    color={resolvedIconColor}
                    width={ICON_VB_W}
                    height={ICON_VB_H}
                  />
                ) : (
                  <IconComponent
                    fill={resolvedIconColor}
                    stroke={resolvedIconColor}
                    strokeWidth={1}
                    width={ICON_VB_W}
                    height={ICON_VB_H}
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

NormalPathNode.displayName = "NormalPathNode";
