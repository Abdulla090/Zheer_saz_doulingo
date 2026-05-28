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

const DailyView = (props: PhingoWidgetPayload, _env: WidgetEnvironment) => {
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
        <Image systemName="bolt.fill" color={W.blue} size={20} />
        <Text modifiers={[font({ size: 15, weight: "bold" }), foregroundStyle(W.blue)]}>
          Daily XP
        </Text>
      </HStack>
      <Text
        modifiers={[
          font({ size: 28, weight: "bold" }),
          foregroundStyle(W.navy),
          padding({ top: 8 }),
        ]}
      >
        {`${props.dailyXp}/${props.dailyGoalXp}`}
      </Text>
      <Text modifiers={[font({ size: 12, weight: "semibold" }), foregroundStyle(W.green)]}>
        {`${dailyPct}% complete`}
      </Text>
      <HStack modifiers={[padding({ top: 6 })]}>
        <Image systemName="star.fill" color={W.gold} size={14} />
        <Text modifiers={[font({ size: 11 }), foregroundStyle(W.gray)]}>
          {`${props.streak} day streak`}
        </Text>
      </HStack>
    </VStack>
  );
};

export const PhingoDailyXpWidget = createWidget("PhingoDailyXp", DailyView);
export default PhingoDailyXpWidget;
