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
 * Gloss is two bands at -45deg, clipped to an inset ellipse so they stop at the
 * face's edge. The reference fills them flat; here they are feathered across
 * their thickness with a gradient, so they read as light on a curved surface
 * rather than as two hard-edged stripes painted onto it.
 *
 * Street and kids paths keep the View + LinearGradient `SvgButton`; only the
 * normal path renders this. Locked and completed states are additions to the
 * reference, which has neither — they are load-bearing here.
 */

import React, { useCallback, useId, useMemo, useRef } from "react";
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
  LinearGradient,
  Rect,
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
const CLIP_INSET = 8;
const ICON_SCALE = 1.8;
const SVG_VIEWBOX = "-10 -10 120 130";
const ICON_VB_W = 32;
const ICON_VB_H = 32;
const GLOSS_X = -10;
const GLOSS_W = 120;
const GLOSS_TOP_Y = -2;
const GLOSS_TOP_H = 30;
const GLOSS_BOTTOM_Y = 50;
const GLOSS_BOTTOM_H = 26;

/*
 * Gloss falloff across each band's thickness.
 *
 * The reference fills the two bands with flat `rgba(255,255,255,0.3)`, which
 * gives them two hard parallel edges — on a phone that reads as a decal printed
 * on the node rather than light falling across it, and the straight edge fights
 * the face's curve. A gradient perpendicular to the band dissolves both edges.
 *
 * Peak alpha is raised above the reference's 0.3 because a feathered band only
 * reaches full strength along its centre line, so matching 0.3 at the peak would
 * land dimmer overall than the flat original.
 */
const GLOSS_PEAK_ALPHA = 0.42;
const GLOSS_STOPS = [
  { offset: "0", alpha: 0 },
  { offset: "0.25", alpha: 0.45 },
  { offset: "0.5", alpha: 1 },
  { offset: "0.75", alpha: 0.45 },
  { offset: "1", alpha: 0 },
] as const;
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
    const colors = useMemo(() => nodeColors(variant), [variant]);
    // `useId` returns a colon-containing value that is not a legal SVG id. Both
    // defs need distinct ids or nodes would cross-reference each other's.
    const rawId = useId().replace(/:/g, "");
    const clipId = `${rawId}-clip`;
    const glossId = `${rawId}-gloss`;
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#AFAFAF" : "white");

    const cy = useSharedValue(FACE_BASE_CY);

    const faceAnimatedProps = useAnimatedProps(() => ({ cy: cy.value }));

    /*
     * Gloss and icon are painted *on* the face, so both travel by exactly the
     * face's own displacement. Deriving it from `cy` rather than interpolating
     * over a separate range keeps them welded to the surface — an independent
     * range drifts by a unit at the pressed end and the sheen visibly slides.
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
          <Defs>
            <ClipPath id={clipId}>
              <Ellipse
                cx={BUTTON_CENTER_X}
                cy={FACE_BASE_CY}
                rx={RX - CLIP_INSET}
                ry={RY - CLIP_INSET}
              />
            </ClipPath>
            {/*
             * Vertical in the band's own coordinate space, so once the -45deg
             * transform is applied it runs across the band's thickness. Object
             * bounding-box units (the default) resolve against each rect's own
             * box, so one definition feathers both bands despite their differing
             * heights.
             */}
            <LinearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
              {GLOSS_STOPS.map((stop) => (
                <Stop
                  key={stop.offset}
                  offset={stop.offset}
                  stopColor="#FFFFFF"
                  stopOpacity={stop.alpha * GLOSS_PEAK_ALPHA}
                />
              ))}
            </LinearGradient>
          </Defs>

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
            fill={colors.face}
            // Not in the reference: a completed node keeps a white hairline so
            // it stays distinguishable from an unstarted one at a glance.
            stroke={isCompleted ? "rgba(255,255,255,0.75)" : undefined}
            strokeWidth={isCompleted ? 3 : 0}
          />

          {/* 3. Gloss — flat white at 0.3 reads as a sheen over any hue. Dropped
              when locked; a gray node should look inert. */}
          {isLocked ? null : (
            <AnimatedGroup
              animatedProps={followFaceProps}
              clipPath={`url(#${clipId})`}
            >
              <Rect
                x={GLOSS_X}
                y={GLOSS_TOP_Y}
                width={GLOSS_W}
                height={GLOSS_TOP_H}
                fill={`url(#${glossId})`}
                transform={`rotate(-45 ${BUTTON_CENTER_X} ${FACE_BASE_CY})`}
              />
              <Rect
                x={GLOSS_X}
                y={GLOSS_BOTTOM_Y}
                width={GLOSS_W}
                height={GLOSS_BOTTOM_H}
                fill={`url(#${glossId})`}
                transform={`rotate(-45 ${BUTTON_CENTER_X} ${FACE_BASE_CY})`}
              />
            </AnimatedGroup>
          )}

          {/* 4. Icon — centred, and follows the face down on press. */}
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
