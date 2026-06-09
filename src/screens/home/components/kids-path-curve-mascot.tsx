import { PingoMascot, type PingoPose } from "../../../components/mascot/PingoMascot";
import React from "react";
import { StyleSheet, View } from "react-native";

const UNIT_POSES: PingoPose[] = ["wave", "happy", "headset"];

export const KIDS_CURVE_MASCOT_SIZE = 116;
/** Show mascot on this lesson row (under the mic node). */
export const KIDS_CURVE_MASCOT_ROW_INDEX = 2;

const POCKET_SIDE_OFFSET = 0.26;
const UNIT_UPWARD = [0.38, 0.5, 0.68] as const;
const UNIT_SIZES = [116, 116, 132] as const;

function mascotSize(unitIndex: number): number {
  return UNIT_SIZES[unitIndex % UNIT_SIZES.length];
}

type Props = {
  unitIndex: number;
  mascotRowOffsetX: number;
  screenWidth: number;
  rowHeight: number;
};

export function KidsPathCurveMascot({
  unitIndex,
  mascotRowOffsetX,
  screenWidth,
  rowHeight,
}: Props) {
  const pose = UNIT_POSES[unitIndex % UNIT_POSES.length];
  const upward = UNIT_UPWARD[unitIndex % UNIT_UPWARD.length];
  const size = mascotSize(unitIndex);

  const emptySign = mascotRowOffsetX <= 0 ? 1 : -1;
  const offsetX = emptySign * screenWidth * POCKET_SIDE_OFFSET;
  const top = (rowHeight - size) / 2 - size * upward;

  return (
    <View pointerEvents="none" style={[styles.layer, { top }]}>
      <View
        style={[
          styles.mascotSlot,
          { transform: [{ translateX: offsetX }], width: size, height: size },
        ]}
      >
        <PingoMascot size={size} pose={pose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 0,
  },
  mascotSlot: {
    alignItems: "center",
    justifyContent: "center",
  },
});
