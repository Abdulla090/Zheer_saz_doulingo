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
 *
 * ── Static vs. pressable split ──
 *
 * Locked, completed and unavailable rows can never be pressed, so their press
 * travel can never run — yet they used to carry the same Reanimated shared
 * values, view adapters and animated-props mappings as the live rows. Those are
 * per-row mount and memory cost on the JS thread, paid again every time the
 * virtualized list recycles a cell during a fling. Since they are nearly every
 * row on the path, non-pressable rows now render a plain SVG tree with no
 * animation machinery at all; only pressable rows (the current lesson and each
 * unit's discoverable first lesson) keep the animated press.
 */

import React, { useCallback, useMemo } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
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

const PRESS_IN_MS = 55;
const PRESS_OUT_MS = 80;

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
  isUnavailable?: boolean;
  isSelected?: boolean;
  accessibilityLabel?: string;
};

/**
 * The metallic gold ramp, shared verbatim by both branches so a completed row
 * looks identical whether it rendered static or pressable a moment before.
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

export const NormalPathNode = React.memo(
  (props: NormalPathNodeProps) => {
    const { onPress, isLocked = false, isUnavailable = false } = props;
    const canPress = Boolean(onPress) && !isLocked && !isUnavailable;

    if (!canPress) return <StaticNormalPathNode {...props} />;
    return <PressableNormalPathNode {...props} />;
  },
);

NormalPathNode.displayName = "NormalPathNode";

/**
 * Locked, completed and unavailable rows. A disabled `Pressable` still exposes
 * the same accessibility semantics, but the drawing is inert: plain elements,
 * no shared values, nothing for Reanimated to attach per frame.
 */
function StaticNormalPathNode({
  size = 80,
  translateX,
  variant = "green",
  IconComponent = LessonStar,
  iconColor,
  isCompleted = false,
  isLocked = false,
  isUnavailable = false,
  isSelected = false,
  accessibilityLabel,
}: NormalPathNodeProps) {
  const goldGradientId = React.useId().replace(/:/g, "");
  const colors = useMemo(() => nodeColors(variant), [variant]);
  const usesMetallicGold = isCompleted || variant === "gold";
  const resolvedIconColor =
    iconColor ?? (variant === "gray" ? "#AFAFAF" : "white");

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
      <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
        {usesMetallicGold ? (
          <GoldGradientDef gradientId={goldGradientId} />
        ) : null}

        <Ellipse
          cx={BUTTON_CENTER_X}
          cy={RIM_CY}
          rx={RX}
          ry={RY}
          fill={colors.rim}
        />

        <Ellipse
          cx={BUTTON_CENTER_X}
          cy={FACE_BASE_CY}
          rx={RX}
          ry={RY}
          fill={usesMetallicGold ? `url(#${goldGradientId})` : colors.face}
          stroke={usesMetallicGold ? "#FFE681" : undefined}
          strokeWidth={usesMetallicGold ? 1.25 : 0}
        />

        <G transform={`translate(${BUTTON_CENTER_X} ${FACE_BASE_CY})`}>
          <G
            transform={`scale(${ICON_SCALE}) translate(${-ICON_VB_W / 2} ${-ICON_VB_H / 2})`}
          >
            <IconComponent
              color={resolvedIconColor}
              fill={resolvedIconColor}
              stroke={resolvedIconColor}
              strokeWidth={1}
              width={ICON_VB_W}
              height={ICON_VB_H}
            />
          </G>
        </G>
      </Svg>
    </Pressable>
  );
}

/**
 * The current lesson and each unit's discoverable first lesson — the rows that
 * can actually be pressed. The face ellipse travels down into the rim on press
 * and the icon rides the same displacement, exactly as in the reference.
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

    const handlePressIn = useCallback(() => {
      if (isLocked || isUnavailable) return;
      cy.value = withTiming(FACE_PRESSED_CY, {
        duration: PRESS_IN_MS,
        easing: Easing.out(Easing.cubic),
      });
    }, [cy, isLocked, isUnavailable]);

    const handlePressOut = useCallback(() => {
      if (isLocked || isUnavailable) return;
      cy.value = withTiming(FACE_BASE_CY, {
        duration: PRESS_OUT_MS,
        easing: Easing.out(Easing.cubic),
      });
    }, [cy, isLocked, isUnavailable]);

    const handlePress = useCallback(() => {
      if (isLocked || isUnavailable) return;
      onPress?.();
    }, [isLocked, isUnavailable, onPress]);

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
        disabled={!onPress || isLocked || isUnavailable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isLocked || isUnavailable, selected: isSelected }}
        style={{
          width: size,
          height: size,
          opacity: isUnavailable ? 0.62 : 1,
          transform: [{ translateX: translateX || 0 }],
        }}
      >
        <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
          {usesMetallicGold ? (
            <GoldGradientDef gradientId={goldGradientId} />
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
                    color={resolvedIconColor}
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

PressableNormalPathNode.displayName = "PressableNormalPathNode";
