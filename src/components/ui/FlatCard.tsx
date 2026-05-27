import React, { memo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type FlatCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

function FlatCardInner({ children, style, contentStyle }: FlatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

export const FlatCard = memo(FlatCardInner);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    overflow: "hidden",
  },
});
