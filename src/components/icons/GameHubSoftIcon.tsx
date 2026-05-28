/**
 * Soft iOS-style game hub icon tile — gloss + blur shadow, no hard bottom rim.
 */

import { SoftGloss, softFaceBorders } from "@/components/ui/soft-2.5d";
import { crossShadow } from "@/utils/shadows";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type GameHubSoftIconProps = {
  faceColor: string;
  shadowColor?: string;
  size?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GameHubSoftIcon({
  faceColor,
  shadowColor,
  size = 52,
  children,
  style,
}: GameHubSoftIconProps) {
  const radius = Math.round(size * 0.27);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: faceColor,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          ...softFaceBorders(),
          ...crossShadow({
            color: shadowColor ?? faceColor,
            offsetY: 6,
            blur: 16,
            opacity: 0.2,
            elevation: 4,
          }),
        },
        style,
      ]}
    >
      <SoftGloss borderRadius={radius} width={size} height={size} strong />
      <View style={{ zIndex: 1 }}>{children}</View>
    </View>
  );
}
