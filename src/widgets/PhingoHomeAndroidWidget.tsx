"use no memo";

import React from "react";
import { FlexWidget, TextWidget } from "react-native-android-widget";

import type { PhingoHomeWidgetPayload } from "./widget-types";

const BLUE = "#2B59F3";
const NAVY = "#1B2B4B";
const GRAY = "#6B7A99";
const GOLD = "#FFB020";
const BG = "#F4F7FF";

function pctLabel(value: number): string {
  return `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`;
}

export function PhingoHomeAndroidWidget(props: PhingoHomeWidgetPayload) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        flexDirection: "column",
        backgroundColor: BG,
        borderRadius: 20,
        padding: 16,
      }}
      accessibilityLabel="Phingo learning progress"
    >
      <FlexWidget
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "match_parent",
        }}
      >
        <TextWidget
          text="Phingo"
          style={{ fontSize: 20, fontWeight: "bold", color: BLUE, fontFamily: "DIN_BOLD" }}
        />
        <TextWidget
          text={`${props.streak} 🔥`}
          style={{ fontSize: 14, fontWeight: "bold", color: GOLD, fontFamily: "DIN_BOLD" }}
        />
      </FlexWidget>

      <TextWidget
        text={`${props.dailyXp}/${props.dailyGoalXp} XP today`}
        style={{ fontSize: 12, color: GRAY, marginTop: 4, fontFamily: "DIN_MEDIUM" }}
      />

      <FlexWidget
        style={{
          flexDirection: "row",
          width: "match_parent",
          marginTop: 10,
          justifyContent: "space-between",
        }}
      >
        <TextWidget
          text={`${props.streetLabel} ${pctLabel(props.streetPercent)}`}
          style={{ fontSize: 11, color: NAVY, fontFamily: "DIN_MEDIUM" }}
        />
        <TextWidget
          text={`${props.normalLabel} ${pctLabel(props.normalPercent)}`}
          style={{ fontSize: 11, color: NAVY, fontFamily: "DIN_MEDIUM" }}
        />
      </FlexWidget>

      <FlexWidget
        style={{
          width: "match_parent",
          marginTop: 12,
          backgroundColor: "#FFFFFF",
          borderRadius: 14,
          padding: 12,
          flexDirection: "column",
        }}
      >
        <TextWidget
          text="Up next"
          style={{ fontSize: 10, color: GRAY, fontFamily: "DIN_MEDIUM" }}
        />
        <TextWidget
          text={props.nextTitle}
          maxLines={2}
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: NAVY,
            marginTop: 2,
            fontFamily: "DIN_BOLD",
          }}
        />
        <TextWidget
          text={props.nextSubtitle}
          maxLines={2}
          style={{ fontSize: 11, color: GRAY, marginTop: 2, fontFamily: "DIN_MEDIUM" }}
        />
      </FlexWidget>

      {props.recentTitle ? (
        <FlexWidget style={{ width: "match_parent", marginTop: 8, flexDirection: "column" }}>
          <TextWidget
            text="Recent"
            style={{ fontSize: 10, color: GRAY, fontFamily: "DIN_MEDIUM" }}
          />
          <TextWidget
            text={props.recentTitle}
            maxLines={1}
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: NAVY,
              fontFamily: "DIN_BOLD",
            }}
          />
        </FlexWidget>
      ) : null}
    </FlexWidget>
  );
}
