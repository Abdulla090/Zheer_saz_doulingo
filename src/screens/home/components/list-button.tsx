import { cssPressStyle, cssReleaseStyle } from "@/components/animations/motion";
import {
  SoftGloss,
  softDepth,
  softFaceBorders,
} from "@/components/ui/soft-2.5d";
import { Star } from "@/constants/icons";
import { crossShadow } from "@/utils/shadows";
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
    const depth = softDepth(size);
    const iconSize = Math.round(size * ICON_RATIO);
    const resolvedIconColor =
      iconColor ?? (variant === "gray" ? "#78909C" : variant === "gold" ? "#FFFFFF" : "#FFFFFF");

    const glossStrong = !isLocked && variant !== "gray";

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
              ...softFaceBorders(isLocked),
              transform: [{ translateY: pressed ? depth : 0 }],
              ...(pressed ? cssPressStyle : cssReleaseStyle),
            }}
          >
            <SoftGloss
              borderRadius={size / 2}
              width={size}
              height={size}
              strong={glossStrong}
            />

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
