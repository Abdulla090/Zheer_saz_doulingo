import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "../ui/AppText";

const TWINO_LOGO = require("../../../assets/images/logo-compressed.png");
const MARK_SCALE = 1.72;

export function TwinoBrandMark({
  size = 44,
  showName = false,
  nameColor = "#168BD2",
  nameSize = 24,
  style,
}: {
  size?: number;
  showName?: boolean;
  nameColor?: string;
  nameSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[styles.row, style]}
      accessibilityRole="image"
      accessibilityLabel="TWINO"
    >
      <View style={{ width: size, height: size, overflow: "hidden" }}>
        <Image
          source={TWINO_LOGO}
          style={{
            position: "absolute",
            width: size * MARK_SCALE,
            height: size * MARK_SCALE,
            left: -(size * (MARK_SCALE - 1)) / 2,
            top: -(size * (MARK_SCALE - 1)) / 2,
          }}
          contentFit="contain"
        />
      </View>
      {showName ? (
        <AppText
          style={[
            styles.name,
            {
              color: nameColor,
              fontSize: nameSize,
              lineHeight: Math.round(nameSize * 1.18),
            },
          ]}
          forceLatinFont
          latinRole="bold"
        >
          Twino
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  name: {
    letterSpacing: -0.7,
  },
});
