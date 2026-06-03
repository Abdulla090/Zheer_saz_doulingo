import React from "react";
import { StyleSheet, View } from "react-native";

export function OnboardingProgressBar({
  total,
  index,
}: {
  total: number;
  index: number;
}) {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: total,
        now: index + 1,
      }}
    >
      {Array.from({ length: total }, (_, i) => (
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
    alignItems: "center",
    gap: 6,
    height: 18,
  },
  dot: {
    height: 4,
    borderRadius: 999,
  },
  dotIdle: {
    width: 7,
    backgroundColor: "#E4EAF4",
  },
  dotActive: {
    width: 17,
    backgroundColor: "#2C6DF4",
  },
});
