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

function PathLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <VStack modifiers={[padding({ vertical: 3 })]}>
      <HStack>
        <Text modifiers={[font({ size: 11, weight: "semibold" }), foregroundStyle(W.navy)]}>
          {label}
        </Text>
        <Text modifiers={[font({ size: 11, weight: "bold" }), foregroundStyle(color)]}>
          {`${pct(value)}%`}
        </Text>
      </HStack>
    </VStack>
  );
}

const ProgressView = (props: PhingoWidgetPayload, _env: WidgetEnvironment) => {
  "widget";

  return (
    <VStack
      modifiers={[
        padding({ all: 14 }),
        background(W.bg),
        clipShape("roundedRectangle"),
      ]}
    >
      <HStack>
        <Image systemName="chart.bar.fill" color={W.blue} size={20} />
        <Text modifiers={[font({ size: 15, weight: "bold" }), foregroundStyle(W.blue)]}>
          Your paths
        </Text>
      </HStack>
      <VStack modifiers={[padding({ top: 8 })]}>
        <PathLine label={props.streetLabel} value={props.streetPercent} color={W.blue} />
        <PathLine label={props.normalLabel} value={props.normalPercent} color={W.green} />
      </VStack>
      {props.recentTitle ? (
        <VStack
          modifiers={[
            padding({ all: 8, top: 10 }),
            background(W.white),
            clipShape("roundedRectangle"),
          ]}
        >
          <Text modifiers={[font({ size: 10, weight: "semibold" }), foregroundStyle(W.gray)]}>
            Recent
          </Text>
          <Text modifiers={[font({ size: 12, weight: "bold" }), foregroundStyle(W.navy)]}>
            {props.recentTitle}
          </Text>
        </VStack>
      ) : null}
    </VStack>
  );
};

export const PhingoProgressWidget = createWidget("PhingoProgress", ProgressView);
export default PhingoProgressWidget;
