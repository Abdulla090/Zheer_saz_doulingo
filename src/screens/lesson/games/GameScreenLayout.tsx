/**
 * GameScreenLayout — fixed header + flex body + pinned footer (no scroll).
 * Keeps CHECK / primary actions visible on all screen sizes.
 */

import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
  bodyStyle?: ViewStyle;
};

export function GameScreenLayout({ header, children, footer, style, bodyStyle }: Props) {
  return (
    <View style={[s.root, style]}>
      {header ? <View style={s.header}>{header}</View> : null}
      <View style={[s.body, bodyStyle]}>{children}</View>
      {footer ? <View style={s.footer}>{footer}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 8,
  },
  header: {
    flexShrink: 0,
    marginBottom: 8,
  },
  body: {
    flex: 1,
    minHeight: 0,
    justifyContent: "flex-start",
  },
  footer: {
    flexShrink: 0,
    paddingTop: 6,
  },
});
