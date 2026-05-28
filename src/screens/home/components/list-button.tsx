import { Star } from "@/constants/icons";
import {
  SoftCircleButton,
  type SoftColorPair,
} from "@/components/ui/soft-2.5d";
import React from "react";
import { View } from "react-native";
import { CurrentLessonIcon } from "./current-lesson-icon";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

/** Face + rim pairs for path lesson nodes (soft 2.5D, matches home + games). */
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
    const colors: SoftColorPair = SVG_BUTTON_COLOR_SETS[variant];
    const iconSize = Math.round(size * ICON_RATIO);
    const resolvedIconColor =
      iconColor ??
      (variant === "gray" ? "#78909C" : variant === "gold" ? "#FFFFFF" : "#FFFFFF");

    const icon = isCurrentLesson ? (
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
    );

    return (
      <View style={{ transform: [{ translateX: translateX || 0 }] }}>
        <SoftCircleButton
          size={size}
          onPress={onPress}
          faceColor={colors.face}
          rimColor={colors.rim}
          disabled={isLocked}
        >
          {icon}
        </SoftCircleButton>
      </View>
    );
  },
);

SvgButton.displayName = "SvgButton";
