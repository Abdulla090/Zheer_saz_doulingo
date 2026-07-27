import React from "react";
import { StyleSheet, View } from "react-native";

type PathCircleShineProps = {
  size: number;
  radius?: number;
};

/**
  * Soft playful inner top highlight for active 2.5D game button nodes.
  */
export function PathCircleShine({
  size,
  radius = size / 2,
}: PathCircleShineProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: radius,
          overflow: "hidden",
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: Math.round(size * 0.05),
          left: Math.round(size * 0.12),
          right: Math.round(size * 0.12),
          height: Math.round(size * 0.32),
          borderRadius: Math.round(size * 0.25),
          backgroundColor: "rgba(255,255,255,0.22)",
        }}
      />
    </View>
  );
}
