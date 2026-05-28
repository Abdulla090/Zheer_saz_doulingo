import React from "react";
import {
  type DimensionValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import {
  SoftPressableButton,
  softRimFromFace,
} from "@/components/ui/soft-2.5d";

type SvgAppButtonProps = {
  onPress: () => void;
  width: number | `${number}%`;
  height: number;
  color?: string;
  backgroundColor?: string;
  leftRadius?: number;
  rightRadius?: number;
  pressDepth?: number;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

/** Soft premium pill — same visual language as home path & CTA buttons. */
export const SvgAppButton = ({
  onPress,
  width,
  height,
  color = "#CE82FF",
  backgroundColor,
  leftRadius = 13,
  pressDepth,
  disabled = false,
  children,
  style,
  contentContainerStyle,
  onPressIn,
  onPressOut,
}: SvgAppButtonProps) => {
  const rim = backgroundColor ?? softRimFromFace(color, 0.18);
  const borderRadius = Math.max(leftRadius, 13);

  return (
    <View style={[{ width: width as DimensionValue }, style]}>
      <SoftPressableButton
        onPress={onPress}
        faceColor={color}
        rimColor={rim}
        borderRadius={borderRadius}
        depth={pressDepth}
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        contentStyle={[
          styles.content,
          { minHeight: height },
          contentContainerStyle,
        ]}
      >
        {children}
      </SoftPressableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
    zIndex: 1,
  },
});
