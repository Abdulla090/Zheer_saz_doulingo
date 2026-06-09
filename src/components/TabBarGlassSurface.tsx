import { LiquidGlassSurface } from "./LiquidGlassSurface";
import React from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

type Props = {
  children?: React.ReactNode;
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
};

export function TabBarGlassSurface({ children, borderRadius, style }: Props) {
  return (
    <LiquidGlassSurface
      borderRadius={borderRadius}
      shadowDepth="tab"
      style={style}
      contentStyle={styles.tabContent}
    >
      {children}
    </LiquidGlassSurface>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
