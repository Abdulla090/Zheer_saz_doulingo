/**
 * PINGO mascot — vector sprite sheet with per-pose crop.
 * Source: assets/images/svg/pingo-mascot-sheet.svg (5 poses).
 *
 * The crop is clipped to the EXACT sprite cell (an inner View with
 * overflow:hidden sized to the cell), so neighbouring poses can never bleed in.
 */

import PingoMascotSheet from "@/assets/images/svg/pingo-mascot-sheet.svg";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const SHEET_W = 180;
const SHEET_H = 109.4;
const TOP_ROW_H = 55.5;
const BOTTOM_COLS = 4;
const COL_W = SHEET_W / BOTTOM_COLS;

export type PingoPose = "wave" | "happy" | "wink" | "party" | "headset";

const POSE_INDEX: Record<Exclude<PingoPose, "headset">, number> = {
  wave: 0,
  happy: 1,
  wink: 2,
  party: 3,
};

type Crop = { x: number; y: number; w: number; h: number };

/** Trim a hair off each cell edge so antialiased neighbour pixels are excluded. */
const CELL_INSET = 2.5;

function poseCrop(pose: PingoPose): Crop {
  if (pose === "headset") {
    const w = SHEET_W * 0.42;
    return { x: (SHEET_W - w) / 2, y: 1, w, h: TOP_ROW_H - 2 };
  }
  const col = POSE_INDEX[pose];
  // Wave pose: no inset — the wing extends to the cell edge and it's often
  // displayed flipped (scaleX: -1), so both sides must be fully visible.
  const inset = pose === "wave" ? 0 : CELL_INSET;
  return {
    x: col * COL_W + inset,
    y: TOP_ROW_H + 1,
    w: COL_W - inset * 2,
    h: SHEET_H - TOP_ROW_H - 2,
  };
}

type Props = {
  size?: number;
  pose?: PingoPose;
};

export function PingoMascot({ size = 100, pose = "wave" }: Props) {
  const layout = useMemo(() => {
    const crop = poseCrop(pose);
    const scale = size / Math.max(crop.w, crop.h);
    return {
      clipW: crop.w * scale,
      clipH: crop.h * scale,
      sheetW: SHEET_W * scale,
      sheetH: SHEET_H * scale,
      sheetLeft: -crop.x * scale,
      sheetTop: -crop.y * scale,
    };
  }, [pose, size]);

  return (
    <View
      style={[styles.outer, { width: size, height: size }]}
      accessibilityLabel="PINGO mascot"
    >
      <View
        style={[
          styles.clip,
          { width: layout.clipW, height: layout.clipH },
        ]}
      >
        <PingoMascotSheet
          width={layout.sheetW}
          height={layout.sheetH}
          style={{ position: "absolute", left: layout.sheetLeft, top: layout.sheetTop }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    justifyContent: "center",
  },
  clip: {
    overflow: "hidden",
  },
});
