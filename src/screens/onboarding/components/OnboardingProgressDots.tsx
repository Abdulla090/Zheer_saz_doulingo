import React from "react";
import { StyleSheet, View } from "react-native";

const ACTIVE = "#208AEF";
const INACTIVE = "#CBD5E1";

export function OnboardingProgressDots({
  total,
  index,
}: {
  total: number;
  index: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === index ? styles.dotActive : styles.dotIdle,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: ACTIVE,
  },
  dotIdle: {
    width: 8,
    backgroundColor: INACTIVE,
  },
});
