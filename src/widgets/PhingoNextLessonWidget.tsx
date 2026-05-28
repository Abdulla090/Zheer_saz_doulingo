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
import { W } from "./widget-theme";

const NextLessonView = (props: PhingoWidgetPayload, env: WidgetEnvironment) => {
  "widget";
  const small = env.widgetFamily === "systemSmall";

  return (
    <VStack
      modifiers={[
        padding({ all: small ? 12 : 16 }),
        background(W.blue),
        clipShape("roundedRectangle"),
      ]}
    >
      <HStack>
        <Image systemName="book.fill" color={W.white} size={small ? 18 : 22} />
        <Text modifiers={[font({ size: small ? 13 : 15, weight: "bold" }), foregroundStyle(W.white)]}>
          Up next
        </Text>
      </HStack>
      <Text
        modifiers={[
          font({ size: small ? 16 : 20, weight: "bold" }),
          foregroundStyle(W.white),
          padding({ top: 8 }),
        ]}
      >
        {props.nextTitle}
      </Text>
      {!small ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle("rgba(255,255,255,0.85)")]}>
          {props.nextSubtitle}
        </Text>
      ) : null}
      <HStack modifiers={[padding({ top: small ? 4 : 8 })]}>
        <Image systemName="hand.tap.fill" color={W.white} size={12} />
        <Text modifiers={[font({ size: 10, weight: "semibold" }), foregroundStyle(W.white)]}>
          Tap to open Phingo
        </Text>
      </HStack>
    </VStack>
  );
};

export const PhingoNextLessonWidget = createWidget("PhingoNextLesson", NextLessonView);
export default PhingoNextLessonWidget;
