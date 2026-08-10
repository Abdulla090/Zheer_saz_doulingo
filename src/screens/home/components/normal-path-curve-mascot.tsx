import { TwinoMascot, type TwinoPose } from "../../../components/mascot/TwinoMascot";
import type { MascotId } from "../../../constants/mascots";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Poses cycle per mascot stop rather than per unit — a unit can hold more than
 * one peak, and keying on the unit made every mascot in it strike the same
 * pose. 7 poses against a 4-row stride means the pattern only repeats every 28
 * nodes, so no two neighbouring mascots match.
 */
const PEAK_POSES: TwinoPose[] = [
  "happy",
  "encouraging",
  "thinking",
  "surprised",
  "comfy",
  "sleepy",
  "winning",
];

/** Slight size variation, offset from the pose cycle so it does not sync up. */
const PEAK_SIZES = [126, 114, 120] as const;

/**
 * The curve has period 8 (`sin(i · π/4)`), so its extremes land on indexes 2 and
 * 6 — every `globalIndex % 4 === 2`. Anchoring the mascot to those rows puts it
 * in the widest part of the gap the path leaves behind, alternating sides as the
 * curve swings.
 */
export function isNormalPathPeak(globalIndex: number) {
  return globalIndex % 4 === 2;
}

export const NORMAL_CURVE_MASCOT_SIZE = 126;

/**
 * Pushed to the far side of the node, 1.8x the curve amplitude out. At a peak
 * the node sits at 0.18·width, so the mascot lands near 0.32·width opposite it —
 * clear of the node and of the rows above and below.
 */
const ANCHOR_MULTIPLIER = -1.8;

/** Nudge down so the mascot reads as standing beside the path, not floating. */
const VERTICAL_NUDGE = 8;

type Props = {
  /** Row this mascot is attached to; drives which pose it takes. */
  globalIndex: number;
  /** Curve offset of that row, already RTL-mirrored. */
  nodeOffsetX: number;
  slotHeight: number;
  /** Absolute insets resolve against the padding box, so it has to cancel out. */
  slotPaddingTop: number;
  /** Greyed out until the unit it belongs to is reached. */
  isLocked: boolean;
  /** The unit's pet, picked from its theme colour. */
  mascotId: MascotId;
  /** 0 for the unit's opening companion, 1 for the mid-unit one. */
  slot: number;
};

export function NormalPathCurveMascot({
  globalIndex,
  nodeOffsetX,
  slotHeight,
  slotPaddingTop,
  isLocked,
  mascotId,
  slot,
}: Props) {
  // Keyed to the row so two companions in one unit never strike the same pose.
  const poseIndex = Math.floor(globalIndex / 4) + slot;
  const pose = PEAK_POSES[poseIndex % PEAK_POSES.length];
  const size = PEAK_SIZES[poseIndex % PEAK_SIZES.length];
  const top = (slotHeight - size) / 2 + VERTICAL_NUDGE - slotPaddingTop;

  /*
   * Turn the mascot to face the path it stands beside.
   *
   * The artwork faces left, so a mascot that lands left of centre is looking
   * away from the nodes and has to be mirrored. Derived from the mascot's own
   * final offset rather than from the row index, which means it stays correct
   * under RTL for free — `nodeOffsetX` arrives already mirrored, so this follows.
   */
  const mascotOffsetX = nodeOffsetX * ANCHOR_MULTIPLIER;
  const facesAwayFromPath = mascotOffsetX < 0;

  return (
    <View pointerEvents="none" style={[styles.layer, { top }]}>
      <View
        style={[
          styles.mascotSlot,
          {
            width: size,
            height: size,
            transform: [
              { translateX: mascotOffsetX },
              { scaleX: facesAwayFromPath ? -1 : 1 },
            ],
          },
        ]}
      >
        <TwinoMascot
          size={size}
          pose={pose}
          mascotId={mascotId}
          muted={isLocked}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 1,
  },
  mascotSlot: {
    alignItems: "center",
    justifyContent: "center",
  },
});
