import { useSettingsStore } from "../../stores/useSettingsStore";
import {
  FieldGroup,
  Host,
  Row,
  ScrollView,
  Spacer,
  Switch,
  Text,
} from "@expo/ui";
import React from "react";

function LabeledRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Row alignment="center" spacing={16}>
      <Text textStyle={{ fontSize: 16 }}>{label}</Text>
      <Spacer flexible />
      {children}
    </Row>
  );
}

export default function SettingsExpoUIScreen() {
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const soundsEnabled = useSettingsStore((s) => s.soundsEnabled);
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const setSoundsEnabled = useSettingsStore((s) => s.setSoundsEnabled);

  return (
    <Host
      style={{ flex: 1 }}
      layoutDirection="rightToLeft"
      useViewportSizeMeasurement
    >
      <ScrollView>
        <FieldGroup>
          <FieldGroup.Section title="ڕێکخستنەکان">
            <LabeledRow label="لەرزین (Haptics)">
              <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
            </LabeledRow>
            <LabeledRow label="دەنگ">
              <Switch value={soundsEnabled} onValueChange={setSoundsEnabled} />
            </LabeledRow>
            <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 13, color: "#6c6c70" }}>
                فۆنتی ئەپ: Rabar 044
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

        </FieldGroup>
      </ScrollView>
    </Host>
  );
}
