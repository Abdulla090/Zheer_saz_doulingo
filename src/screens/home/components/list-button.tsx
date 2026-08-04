import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarIcon } from "@hugeicons/core-free-icons";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PATH_RASTERIZE_NODES, PATH_SKIP_NODE_SHADOW, FX_ALLOW_GRADIENTS } from "../../../utils/native-perf";
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

import {
  SVG_BUTTON_COLOR_SETS,
  type SvgButtonVariant,
} from "../../../constants/button-theme-colors";

/*
 * The palette itself lives in `constants/button-theme-colors` so data consumers
 * (the unit banner, tests) can read it without importing this component. Both
 * names are re-exported here because existing call sites import them from here.
 */
export { SVG_BUTTON_COLOR_SETS, type SvgButtonVariant };

// Native surfaces render the same gradients with much higher perceived
// contrast than the web canvas, so native gets its own, gentler ramp rather
// than no ramp at all. Skipping the gradient entirely (the previous behaviour)
// left the node a single flat fill — geometrically 3D, but visually a sticker.
const isNativeNode = Platform.OS !== "web";

/**
 * Shading for one node.
 *
 * Duolingo's depth comes from three cheap cues stacked in order: a light top
 * edge, the base colour through the middle, and a darker bottom edge — read as
 * a lit dome. Native keeps the same three stops at roughly half the contrast,
 * because the same alpha reads far stronger on an OLED phone than on a browser
 * canvas.
 *
 * The ramp is near-vertical (a slight lean, not a diagonal wash): a light source
 * above the token is what makes a round face look spherical instead of tilted.
 */
function faceGradient(face: string, locked: boolean) {
  if (isNativeNode) {
    return locked
      ? (["rgba(255,255,255,0.22)", face, "rgba(0,0,0,0.08)"] as const)
      : (["rgba(255,255,255,0.32)", face, "rgba(0,0,0,0.14)"] as const);
  }
  return locked
    ? (["rgba(255,255,255,0.3)", face, "rgba(0,0,0,0.05)"] as const)
    : (["rgba(255,255,255,0.26)", face, "rgba(0,0,0,0.07)"] as const);
}

function shellGradient(face: string, rim: string, locked: boolean) {
  if (isNativeNode) {
    // The shell is the side wall; it stays closer to the rim colour so the
    // raised face still reads as the brightest surface.
    return locked
      ? (["#EDEEF0", face, "#D3D5D8"] as const)
      : (["rgba(255,255,255,0.34)", face, rim] as const);
  }
  return locked
    ? (["#F4F5F6", face, "#D3D5D8"] as const)
    : (["rgba(255,255,255,0.46)", face, rim] as const);
}

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

    // Seated token geometry.
    //
    // `rimDepth` is the visible thickness of the side wall — the single value
    // that decides whether the node reads as a sticker lying on the screen or a
    // physical button standing on it. At 0.09 it was too thin to register, so
    // it is now 0.155 of the node size (~10px at 62px) which is close to
    // Duolingo's own proportion. The 96px slot has room for the extra height.
    const width = size;
    const height = Math.round(size * 0.86);
    const rimDepth = Math.max(7, Math.round(size * 0.155));
    const totalHeight = height + rimDepth;
    const borderRadius = Math.round(height / 2);
    const faceInsetX = Math.max(3, Math.round(size * 0.055));
    const faceInsetTop = Math.max(2, Math.round(size * 0.045));
    const faceInsetBottom = Math.max(4, Math.round(size * 0.075));
    const innerWidth = width - faceInsetX * 2;
    const innerHeight = height - faceInsetTop - faceInsetBottom;
    const innerRadius = Math.round(innerHeight / 2);

    // Ground shadow: wider and softer than the token, offset below it. This is
    // what visually detaches the node from the background — without it a deep
    // rim just looks like a thick border.
    const groundWidth = Math.round(width * 0.82);
    const groundHeight = Math.max(6, Math.round(size * 0.14));

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
      // Travel the full rim minus a 2px sliver, so a pressed node looks seated
      // on the surface but never completely loses its edge.
      const pressTranslate = pressProgress.value * (rimDepth - 2);
      return {
        transform: [
          { translateY: pressTranslate },
          { scale: 1 - pressProgress.value * 0.012 },
        ],
      };
    });

    // The depth is a separate layer so a tap can visually flatten the token:
    // the raised face settles into the rim while the lower crescent and its
    // contact shadow fade away together.
    const depthStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        pressProgress.value,
        [0, 1],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: -pressProgress.value },
        { scaleY: 1 - pressProgress.value * 0.78 },
      ],
    }));

    const contactShadowStyle = useAnimatedStyle(() => ({
      // The ground shadow tightens rather than vanishing: a pressed object
      // still touches the surface, it just casts less.
      opacity: interpolate(
        pressProgress.value,
        [0, 1],
        [1, 0.45],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: -pressProgress.value * (rimDepth - 2) },
        { scaleX: 1 - pressProgress.value * 0.22 },
        { scaleY: 1 - pressProgress.value * 0.3 },
      ],
    }));

    const haloStyle = useAnimatedStyle(() => ({
      opacity: isNativeNode
        ? showHalo
          ? 0.4 + hoverProgress.value * 0.08 + haloProgress.value * 0.06
          : 0
        : (isLocked ? 0.16 : 0.3) +
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
        inList
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
          renderToHardwareTextureAndroid={PATH_RASTERIZE_NODES}
          shouldRasterizeIOS={PATH_RASTERIZE_NODES}
          style={[
            { width, height: totalHeight, alignItems: "center" },
            tokenStyle,
          ]}
        >
          {/*
            Ground shadow. A soft ellipse sitting under and slightly wider than
            the token, so the node reads as resting ON the surface rather than
            printed into it. It shrinks and fades as the token is pressed down,
            which is what sells the travel.

            Android gets a flat translucent ellipse (no blur): elevation on a
            non-opaque view in a virtualized list is a per-frame CPU cost, and
            at this size the soft edge is not missed.
          */}
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                top: totalHeight - Math.round(groundHeight * 0.55),
                width: groundWidth,
                height: groundHeight,
                borderRadius: 999,
                backgroundColor: isLocked
                  ? "rgba(15,23,42,0.10)"
                  : "rgba(15,23,42,0.16)",
                ...(isNativeNode || PATH_SKIP_NODE_SHADOW
                  ? {}
                  : { filter: "blur(4px)" as any }),
              },
              contactShadowStyle,
            ]}
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
                backgroundColor: isNativeNode ? "transparent" : `${colors.face}2B`,
                borderWidth: isNativeNode && showHalo ? 1 : 0,
                borderColor: isNativeNode ? `${colors.face}8A` : undefined,
                ...(isNativeNode
                  ? {}
                  : { boxShadow: `0 2px 11px ${colors.face}70` }),
              },
              haloStyle,
            ]}
          />

          {/* Shallow lower crescent. */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: rimDepth,
                left: 0,
                width,
                height,
                borderRadius,
                backgroundColor: colors.rim,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.11)",
                // A real side wall darkens toward its base — this is what makes
                // the exposed rim read as thickness instead of an outline.
                borderBottomWidth: 2,
                borderBottomColor: "rgba(0,0,0,0.22)",
              },
              depthStyle,
            ]}
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
                borderColor: isNativeNode
                  ? isCompleted
                    ? "rgba(255,255,255,0.24)"
                    : "rgba(15,23,42,0.14)"
                  : isCompleted
                    ? "rgba(255,255,255,0.42)"
                    : "rgba(255,255,255,0.24)",
                borderTopColor: isNativeNode
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(255,255,255,0.58)",
                borderBottomColor: isNativeNode
                  ? "rgba(15,23,42,0.2)"
                  : "rgba(0,0,0,0.08)",
                overflow: "hidden",
              },
              topFaceStyle,
            ]}
          >
            {/* Low-end devices fall through to the flat `colors.rim` fill
                underneath — same geometry and colour, just no ramp. */}
            {FX_ALLOW_GRADIENTS ? (
              <LinearGradient
                pointerEvents="none"
                colors={shellGradient(colors.face, colors.rim, isLocked)}
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
            ) : null}

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
                borderWidth: isNativeNode ? 0 : 0.75,
                borderColor: isNativeNode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.24)",
                borderBottomColor: isNativeNode
                  ? "rgba(15,23,42,0.12)"
                  : "rgba(0,0,0,0.08)",
                ...(isNativeNode
                  ? {}
                  : {
                      boxShadow:
                        "inset 0 1px 1px rgba(255,255,255,0.22), inset 0 -2px 3px rgba(38,27,91,0.12)",
                    }),
              }}
            >
              {FX_ALLOW_GRADIENTS ? (
                <LinearGradient
                  pointerEvents="none"
                  colors={faceGradient(colors.face, isLocked)}
                  locations={[0, 0.54, 1]}
                  /* Near-vertical: the light reads as coming from above the token. */
                  start={{ x: 0.32, y: 0 }}
                  end={{ x: 0.68, y: 1 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    borderRadius: innerRadius,
                  }}
                />
              ) : null}
              {/*
                Crown highlight — a hairline at the very top of the face, where a
                lit dome would catch the light. Inset by the full corner radius:
                the face is a pill with `overflow: hidden`, so anything wider
                gets clipped by the rounded caps and ends in two hard stubs.
                Cheap enough (1px View, no gradient) to keep on every device.
              */}
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0,
                  left: innerRadius,
                  right: innerRadius,
                  height: 1,
                  borderRadius: 9999,
                  backgroundColor: isLocked
                    ? "rgba(255,255,255,0.30)"
                    : "rgba(255,255,255,0.45)",
                }}
              />
            {!isLocked ? (
              /*
               * Specular sheen. A gradient fades the highlight out at both ends;
               * a flat translucent bar reads as a painted-on stripe, which is
               * the single biggest tell that a node is not a lit object. Native
               * runs the same shape at lower peak alpha, in white rather than
               * the web's blue-tinted glass.
               *
               * Low-end devices keep the flat bar — one opaque-ish View is far
               * cheaper than a third overlapping gradient per node in a
               * virtualized list, and some highlight beats none.
               */
              FX_ALLOW_GRADIENTS ? (
                <LinearGradient
                  pointerEvents="none"
                  colors={
                    isNativeNode
                      ? [
                          "rgba(255,255,255,0)",
                          "rgba(255,255,255,0.16)",
                          "rgba(255,255,255,0.34)",
                          "rgba(255,255,255,0.16)",
                          "rgba(255,255,255,0)",
                        ]
                      : [
                          "rgba(145, 225, 255, 0)",
                          "rgba(156, 231, 255, 0.26)",
                          "rgba(198, 243, 255, 0.68)",
                          "rgba(156, 231, 255, 0.26)",
                          "rgba(145, 225, 255, 0)",
                        ]
                  }
                  locations={[0, 0.22, 0.5, 0.78, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{
                    position: "absolute",
                    top: Math.round(innerHeight * 0.08),
                    left: Math.round(innerWidth * 0.14),
                    width: Math.round(innerWidth * 0.58),
                    height: Math.max(6, Math.round(innerHeight * 0.17)),
                    borderRadius: 9999,
                    opacity: isNativeNode ? 0.9 : 0.82,
                    transform: [{ rotate: "-10deg" }],
                  }}
                />
              ) : (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: Math.max(2, Math.round(innerHeight * 0.1)),
                    left: Math.round(innerWidth * 0.2),
                    width: Math.round(innerWidth * 0.36),
                    height: Math.max(2, Math.round(innerHeight * 0.06)),
                    borderRadius: 9999,
                    backgroundColor: "rgba(255,255,255,0.22)",
                    opacity: 0.42,
                    transform: [{ rotate: "-10deg" }],
                  }}
                />
              )
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
