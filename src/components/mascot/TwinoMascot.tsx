import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

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
  | keyof typeof LEGACY_POSE_MAP
  | string;

type Props = {
  size?: number;
  pose?: TwinoPose;
  mascotId?: MascotId | string;
  muted?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  ambientMotion?: boolean;
  manualHeadPitch?: number;
  manualHeadYaw?: number;
  manualHeadRoll?: number;
  customDefinition?: any;
};

const MUTED_TINT = "#9AA3AF";
const MUTED_WASH_OPACITY = 0.72;
const MUTED_OVERALL_OPACITY = 0.75;
const WEB_GRAYSCALE_STYLE = { filter: "grayscale(100%) opacity(70%)" } as const;

function resolveExpression(pose: TwinoPose): MascotExpression {
  if (pose in LEGACY_POSE_MAP) {
    return LEGACY_POSE_MAP[pose as keyof typeof LEGACY_POSE_MAP];
  }
  const validExpressions: MascotExpression[] = [
    "happy",
    "winning",
    "losing",
    "comfy",
    "encouraging",
    "thinking",
    "surprised",
    "sleepy",
  ];
  if (validExpressions.includes(pose as MascotExpression)) {
    return pose as MascotExpression;
  }
  return "happy";
}

/** Renders the user's selected pet with a state-specific full-body pose. */
export function TwinoMascot({
  size = 100,
  pose = "happy",
  mascotId,
  muted = false,
  onPress,
  style,
}: Props) {
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const resolvedMascot = getMascot(mascotId ?? selectedMascotId);
  const expression = resolveExpression(pose);
  const source = getMascotExpressionSource(resolvedMascot.id, expression);

  const content = (
    <View
      style={[
        styles.outer,
        { width: size, height: size },
        muted ? { opacity: MUTED_OVERALL_OPACITY } : null,
        style,
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

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ width: size, height: size }}>
        {content}
      </Pressable>
    );
  }

  return content;
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
