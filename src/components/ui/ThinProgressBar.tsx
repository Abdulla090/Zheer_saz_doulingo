import { useI18n } from "@/hooks/useI18n";
import React, { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type ThinProgressBarProps = {
  progress: number;
  style?: StyleProp<ViewStyle>;
  trackColor?: string;
  fillColor?: string;
  height?: number;
};

function ThinProgressBarInner({
  progress,
  style,
  trackColor = "#E8EDF2",
  fillColor = "#1CB0F6",
  height = 8,
}: ThinProgressBarProps) {
  const { isKu } = useI18n();
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor, alignItems: isKu ? "flex-end" : "flex-start" },
        style,
      ]}
    >
      <View
        style={{
          width: `${p * 100}%`,
          height: "100%",
          borderRadius: height / 2,
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
}

export const ThinProgressBar = memo(ThinProgressBarInner);

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
});
