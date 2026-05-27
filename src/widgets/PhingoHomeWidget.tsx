import { HStack, Text, VStack } from "@expo/ui/swift-ui";
import {
  background,
  clipShape,
  font,
  foregroundStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

import type { PhingoHomeWidgetPayload } from "./widget-types";

const BLUE = "#2B59F3";
const NAVY = "#1B2B4B";
const GRAY = "#6B7A99";
const TRACK = "#E8EDF7";
const GOLD = "#FFB020";

function ProgressRow({
  label,
  value,
  compact,
}: {
  label: string;
  value: number;
  compact?: boolean;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <VStack modifiers={[padding({ vertical: compact ? 2 : 4 })]}>
      <HStack>
        <Text
          modifiers={[
            font({ size: compact ? 11 : 12, weight: "semibold" }),
            foregroundStyle(NAVY),
          ]}
        >
          {label}
        </Text>
        <Text
          modifiers={[
            font({ size: compact ? 11 : 12, weight: "bold" }),
            foregroundStyle(BLUE),
          ]}
        >
          {`${pct}%`}
        </Text>
      </HStack>
      <Text
        modifiers={[
          font({ size: 10 }),
          foregroundStyle(GRAY),
          frame({ maxWidth: 9999 }),
        ]}
      >
        {`${pct}% complete`}
      </Text>
    </VStack>
  );
}

const PhingoHomeWidgetView = (
  props: PhingoHomeWidgetPayload,
  environment: WidgetEnvironment,
) => {
  "widget";

  const small = environment.widgetFamily === "systemSmall";
  const dailyPct =
    props.dailyGoalXp > 0
      ? Math.min(1, props.dailyXp / props.dailyGoalXp)
      : 0;

  if (small) {
    return (
      <VStack
        modifiers={[
          padding({ all: 14 }),
          background("#F4F7FF"),
          clipShape("roundedRectangle"),
        ]}
      >
        <Text modifiers={[font({ size: 18, weight: "bold" }), foregroundStyle(BLUE)]}>
          Phingo
        </Text>
        <HStack modifiers={[padding({ top: 8 })]}>
          <Text modifiers={[font({ size: 22, weight: "bold" }), foregroundStyle(GOLD)]}>
            {String(props.streak)}
          </Text>
          <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>day streak</Text>
        </HStack>
        <Text
          modifiers={[
            font({ size: 13, weight: "semibold" }),
            foregroundStyle(NAVY),
            padding({ top: 6 }),
          ]}
        >
          {props.nextTitle}
        </Text>
        <Text modifiers={[font({ size: 11 }), foregroundStyle(GRAY)]}>
          {props.nextSubtitle}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack
      modifiers={[
        padding({ all: 16 }),
        background("#F4F7FF"),
        clipShape("roundedRectangle"),
      ]}
    >
      <HStack>
        <Text modifiers={[font({ size: 20, weight: "bold" }), foregroundStyle(BLUE)]}>
          Phingo
        </Text>
        <Text modifiers={[font({ size: 13, weight: "semibold" }), foregroundStyle(GOLD)]}>
          {`${props.streak}🔥`}
        </Text>
      </HStack>

      <Text
        modifiers={[
          font({ size: 12 }),
          foregroundStyle(GRAY),
          padding({ top: 4 }),
        ]}
      >
        {`${props.dailyXp}/${props.dailyGoalXp} XP today`}
      </Text>

      <VStack modifiers={[padding({ top: 10 })]}>
        <ProgressRow label={props.streetLabel} value={props.streetPercent} />
        <ProgressRow label={props.normalLabel} value={props.normalPercent} />
      </VStack>

      <VStack
        modifiers={[
          padding({ all: 10, top: 12 }),
          background("#FFFFFF"),
          clipShape("roundedRectangle"),
        ]}
      >
        <Text modifiers={[font({ size: 11, weight: "semibold" }), foregroundStyle(GRAY)]}>
          Up next
        </Text>
        <Text modifiers={[font({ size: 15, weight: "bold" }), foregroundStyle(NAVY)]}>
          {props.nextTitle}
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(GRAY)]}>
          {props.nextSubtitle}
        </Text>
      </VStack>

      {props.recentTitle ? (
        <VStack modifiers={[padding({ top: 8 })]}>
          <Text modifiers={[font({ size: 11, weight: "semibold" }), foregroundStyle(GRAY)]}>
            Recent
          </Text>
          <Text modifiers={[font({ size: 13, weight: "semibold" }), foregroundStyle(NAVY)]}>
            {props.recentTitle}
          </Text>
          <Text modifiers={[font({ size: 11 }), foregroundStyle(GRAY)]}>
            {props.recentSubtitle}
          </Text>
        </VStack>
      ) : null}
    </VStack>
  );
};

export const PhingoHomeWidget = createWidget("PhingoHome", PhingoHomeWidgetView);
export default PhingoHomeWidget;
