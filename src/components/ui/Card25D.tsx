/**
 * Card25D — lightweight 2.5D raised card (extruded bottom edge + soft shadow).
 * Uses PressableScale only; no layout animations for scroll performance.
 */

import { PressableScale } from "@/components/animations";
import { crossShadow } from "@/utils/shadows";
import React, { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type Card25DProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  depth?: number;
  edgeColor?: string;
  disabled?: boolean;
};

function Card25DInner({
  children,
  style,
  faceStyle,
  onPress,
  depth = 4,
  edgeColor = "#D1D5DB",
  disabled,
}: Card25DProps) {
  const shell = (
    <View
      style={[
        styles.shell,
        {
          paddingBottom: depth,
          backgroundColor: edgeColor,
        },
        crossShadow({
          color: "#0F172A",
          offsetY: 6,
          blur: 16,
          opacity: 0.06,
          elevation: 4,
        }),
        style,
      ]}
    >
      <View style={[styles.face, faceStyle]}>{children}</View>
    </View>
  );

  if (!onPress) return shell;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      scaleDown={0.98}
      style={styles.pressable}
    >
      {shell}
    </PressableScale>
  );
}

export const Card25D = memo(Card25DInner);

const styles = StyleSheet.create({
  pressable: { width: "100%" },
  shell: {
    borderRadius: 24,
    overflow: "hidden",
  },
  face: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
  },
});
