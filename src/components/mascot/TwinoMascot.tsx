/**
 * Twino mascot — vector sprite sheet with per-pose crop.
 * Source: assets/images/svg/pingo-mascot-sheet.svg (5 poses).
 *
 * The crop is clipped to the EXACT sprite cell (an inner View with
 * overflow:hidden sized to the cell), so neighbouring poses can never bleed in.
 */

import PingoMascotSheet from "../../../assets/images/svg/pingo-mascot-sheet.svg";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const SHEET_W = 180;
const SHEET_H = 109.4;
const TOP_ROW_H = 55.5;
const BOTTOM_COLS = 4;
const COL_W = SHEET_W / BOTTOM_COLS;

export type TwinoPose = "wave" | "happy" | "wink" | "party" | "headset";

const POSE_INDEX: Record<Exclude<TwinoPose, "headset">, number> = {
  wave: 0,
  happy: 1,
  wink: 2,
  party: 3,
};

type Crop = { x: number; y: number; w: number; h: number };

/** Trim a hair off each cell edge so antialiased neighbour pixels are excluded. */
const CELL_INSET = 2.5;

function poseCrop(pose: TwinoPose): Crop {
  if (pose === "headset") {
    const w = SHEET_W * 0.42;
    return { x: (SHEET_W - w) / 2, y: 1, w, h: TOP_ROW_H - 2 };
  }
  const col = POSE_INDEX[pose];
  // Remove inset for wave and party poses, and expand height bounds to prevent clipping of wings and feet.
  const isOuterCol = pose === "wave" || pose === "party";
  const inset = isOuterCol ? 0 : CELL_INSET;
  const paddingBottom = isOuterCol ? 0 : 2;
  const paddingTop = isOuterCol ? 0 : 1;
  return {
    x: col * COL_W + inset,
    y: TOP_ROW_H + paddingTop,
    w: COL_W - inset * 2,
    h: SHEET_H - TOP_ROW_H - paddingTop - paddingBottom,
  };
}

type Props = {
  size?: number;
  pose?: TwinoPose;
};

export function TwinoMascot({ size = 100, pose = "wave" }: Props) {
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
      accessibilityLabel="Twino mascot"
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
