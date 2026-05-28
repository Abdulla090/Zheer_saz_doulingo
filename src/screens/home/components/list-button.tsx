import { cssPressStyle, cssReleaseStyle } from "@/components/animations/motion";
import { Star } from "@/constants/icons";
import { crossShadow } from "@/utils/shadows";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { CurrentLessonIcon } from "./current-lesson-icon";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

/** Face + rim pairs for path lesson nodes (soft 2.5D, matches header Guidebook). */
export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#0B8A6C", face: "#08c296" },
  purple: { rim: "#5E35B1", face: "#7E57C2" },
  blue: { rim: "#0277BD", face: "#039BE5" },
  mint: { rim: "#00695C", face: "#00897B" },
  gray: { rim: "#90A4AE", face: "#B0BEC5" },
  yellow: { rim: "#F57F17", face: "#FBC02D" },
  gold: { rim: "#E5A000", face: "#FFC800" },
  orange: { rim: "#E65100", face: "#FF9800" },
  red: { rim: "#B71C1C", face: "#F44336" },
} as const;

type PathButtonProps = {
  size?: number;
  onPress?: () => void;
  translateX?: number;
  variant?: SvgButtonVariant;
  IconComponent?: React.ComponentType<any>;
  iconColor?: string;
  isCurrentLesson?: boolean;
  isLocked?: boolean;
};

const ICON_RATIO = 0.42;
const DEPTH_RATIO = 0.05;

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
  }: PathButtonProps) => {
    const colors = SVG_BUTTON_COLOR_SETS[variant];
    const [pressed, setPressed] = useState(false);
    const depth = Math.max(3, Math.round(size * DEPTH_RATIO));
    const iconSize = Math.round(size * ICON_RATIO);
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#78909C" : variant === "gold" ? "#FFFFFF" : "#FFFFFF");

    const glossStrong = !isLocked && variant !== "gray";
    const topHighlight = isLocked
      ? "rgba(255,255,255,0.35)"
      : "rgba(255,255,255,0.72)";
    const faceBorder = isLocked
      ? "rgba(255,255,255,0.18)"
      : "rgba(255,255,255,0.22)";

    return (
      <Pressable
        onPress={onPress}
        disabled={isLocked}
        onPressIn={isLocked ? undefined : () => setPressed(true)}
        onPressOut={isLocked ? undefined : () => setPressed(false)}
        style={{
          width: size,
          height: size + depth,
          transform: [{ translateX: translateX || 0 }],
        }}
      >
        <View
          style={{
            width: size,
            height: size + depth,
            borderRadius: size / 2,
            backgroundColor: colors.rim,
            overflow: "hidden",
            ...crossShadow({
              color: colors.rim,
              offsetY: depth + 2,
              opacity: isLocked ? 0.14 : 0.32,
              blur: 16,
              elevation: 6,
            }),
          }}
        >
          <Animated.View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.face,
              marginBottom: depth,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1.5,
              borderColor: faceBorder,
              borderTopColor: topHighlight,
              borderLeftColor: "rgba(255,255,255,0.28)",
              borderRightColor: "rgba(255,255,255,0.2)",
              transform: [{ translateY: pressed ? depth : 0 }],
              ...(pressed ? cssPressStyle : cssReleaseStyle),
            }}
          >
            <LinearGradient
              colors={
                glossStrong
                  ? [
                      "rgba(255,255,255,0.42)",
                      "rgba(255,255,255,0.08)",
                      "rgba(0,0,0,0.06)",
                    ]
                  : [
                      "rgba(255,255,255,0.22)",
                      "rgba(255,255,255,0.04)",
                      "rgba(0,0,0,0.04)",
                    ]
              }
              locations={[0, 0.45, 1]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: size / 2,
              }}
              pointerEvents="none"
            />

            {glossStrong && (
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.35)",
                  "rgba(255,255,255,0)",
                  "rgba(255,255,255,0)",
                ]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 0.55 }}
                style={{
                  position: "absolute",
                  top: size * 0.06,
                  left: size * 0.12,
                  width: size * 0.5,
                  height: size * 0.28,
                  borderRadius: size * 0.2,
                  opacity: 0.85,
                }}
                pointerEvents="none"
              />
            )}

            {isCurrentLesson ? (
              <CurrentLessonIcon
                IconComponent={IconComponent}
                color={resolvedIconColor}
                width={iconSize}
                height={iconSize}
              />
            ) : (
              <IconComponent
                color={resolvedIconColor}
                fill={resolvedIconColor}
                stroke={resolvedIconColor}
                strokeWidth={1}
                width={iconSize}
                height={iconSize}
              />
            )}
          </Animated.View>
        </View>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";
