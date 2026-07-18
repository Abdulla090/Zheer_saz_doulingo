import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

import {
  getMascotExpressionSource,
  type MascotExpression,
} from "../../constants/mascot-expressions";
import { getMascot, type MascotId } from "../../constants/mascots";
import { useSettingsStore } from "../../stores/useSettingsStore";

const LEGACY_POSE_MAP = {
  wave: "happy",
  wink: "encouraging",
  party: "winning",
  headset: "thinking",
  sad: "losing",
  fail: "losing",
} as const satisfies Record<string, MascotExpression>;

export type TwinoPose =
  | MascotExpression
  | keyof typeof LEGACY_POSE_MAP;

type Props = {
  size?: number;
  pose?: TwinoPose;
  mascotId?: MascotId;
};

function resolveExpression(pose: TwinoPose): MascotExpression {
  if (pose in LEGACY_POSE_MAP) {
    return LEGACY_POSE_MAP[pose as keyof typeof LEGACY_POSE_MAP];
  }
  return pose as MascotExpression;
}

/** Renders the user's selected pet with a state-specific full-body pose. */
export function TwinoMascot({
  size = 100,
  pose = "happy",
  mascotId,
}: Props) {
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const resolvedMascot = getMascot(mascotId ?? selectedMascotId);
  const expression = resolveExpression(pose);

  return (
    <View
      style={[styles.outer, { width: size, height: size }]}
      accessibilityLabel={`${resolvedMascot.name} mascot, ${expression}`}
    >
      <Image
        source={getMascotExpressionSource(resolvedMascot.id, expression)}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
