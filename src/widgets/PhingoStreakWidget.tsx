import { HStack, Image, Text, VStack } from "@expo/ui/swift-ui";
import {
  background,
  clipShape,
  font,
  foregroundStyle,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

import type { PhingoWidgetPayload } from "./widget-payload";
import { W, pct } from "./widget-theme";

const StreakView = (props: PhingoWidgetPayload, _env: WidgetEnvironment) => {
  "widget";
  const dailyPct = props.dailyGoalXp > 0 ? pct(props.dailyXp / props.dailyGoalXp) : 0;

  return (
    <VStack
      modifiers={[
        padding({ all: 14 }),
        background(W.bg),
        clipShape("roundedRectangle"),
      ]}
    >
      <HStack>
        <Image systemName="flame.fill" color={W.gold} size={22} />
        <Text modifiers={[font({ size: 16, weight: "bold" }), foregroundStyle(W.blue)]}>
          Phingo
        </Text>
      </HStack>
      <Text
        modifiers={[
          font({ size: 36, weight: "bold" }),
          foregroundStyle(W.gold),
          padding({ top: 6 }),
        ]}
      >
        {String(Math.max(0, props.streak))}
      </Text>
      <Text modifiers={[font({ size: 12, weight: "semibold" }), foregroundStyle(W.navy)]}>
        day streak
      </Text>
      <Text modifiers={[font({ size: 11 }), foregroundStyle(W.gray), padding({ top: 4 })]}>
        {`${dailyPct}% of daily XP`}
      </Text>
    </VStack>
  );
};

export const PhingoStreakWidget = createWidget("PhingoStreak", StreakView);
export default PhingoStreakWidget;
