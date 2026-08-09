import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";

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
  /**
   * Renders the pet as not-yet-available while preserving its face, shading,
   * and expression. Web uses luminance-preserving grayscale. Native uses a
   * translucent neutral wash because React Native has no built-in grayscale
   * image filter; keeping a little of the source underneath preserves detail.
   */
  muted?: boolean;
};

const MUTED_TINT = "#9AA1A9";
const MUTED_WASH_OPACITY = 0.78;
const MUTED_OVERALL_OPACITY = 0.72;
const WEB_GRAYSCALE_STYLE = {
  filter: "grayscale(1) saturate(0)",
} as const;

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
  muted = false,
}: Props) {
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const resolvedMascot = getMascot(mascotId ?? selectedMascotId);
  const expression = resolveExpression(pose);
  const source = getMascotExpressionSource(resolvedMascot.id, expression);

  return (
    <View
      style={[
        styles.outer,
        { width: size, height: size },
        muted ? { opacity: MUTED_OVERALL_OPACITY } : null,
      ]}
      accessibilityLabel={`${resolvedMascot.name} mascot, ${expression}${muted ? ", locked" : ""}`}
    >
      <Image
        source={source}
        style={[
          styles.image,
          muted && Platform.OS === "web"
            ? (WEB_GRAYSCALE_STYLE as any)
            : null,
        ]}
        resizeMode="contain"
      />
      {muted && Platform.OS !== "web" ? (
        <Image
          source={source}
          style={[styles.image, styles.mutedWash]}
          resizeMode="contain"
          tintColor={MUTED_TINT}
        />
      ) : null}
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
  mutedWash: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: MUTED_WASH_OPACITY,
  },
});
