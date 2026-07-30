import React from "react";
import { StyleSheet, View } from "react-native";
import { ONBOARDING_DESIGN } from "./onboarding-design";

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
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    height: 10,
  },
  dot: {
    flex: 1,
    maxWidth: 54,
    height: 6,
    borderRadius: 999,
  },
  dotIdle: {
    backgroundColor: "rgba(85,75,65,0.13)",
  },
  dotActive: {
    backgroundColor: ONBOARDING_DESIGN.orange,
  },
});
