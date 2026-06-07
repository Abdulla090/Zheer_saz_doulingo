import { ALL_RABAR_FONTS } from "@/constants/rabar-fonts";
import { useFontStore } from "@/stores/useFontStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import {
  FieldGroup,
  Host,
  List,
  ListItem,
  RNHostView,
  Row,
  ScrollView,
  Spacer,
  Switch,
  Text,
} from "@expo/ui";
import React from "react";
import { Text as RNText } from "react-native";

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

function FontPreviewRow({
  fontFamily,
  label,
  selected,
  onSelect,
}: {
  fontFamily: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <ListItem
      onPress={onSelect}
      supportingText={label}
      trailing={
        selected ? (
          <Text textStyle={{ fontSize: 18, color: "#1CB0F6" }}>✓</Text>
        ) : undefined
      }
    >
      <RNHostView matchContents>
        <RNText
          style={{
            fontFamily,
            fontSize: 20,
            color: selected ? "#1CB0F6" : "#4B4B4B",
            textAlign: "right",
            writingDirection: "rtl",
          }}
        >
          فێربوونی زمان
        </RNText>
      </RNHostView>
    </ListItem>
  );
}

export default function SettingsExpoUIScreen() {
  const { selectedFont, setFont } = useFontStore();
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
                جۆری فۆنتی دڵخوازت لێرە هەڵبژێرە. گۆڕانکارییەکان یەکسەر جێبەجێ
                دەبن!
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section title="فۆنتەکان">
            <List>
              {ALL_RABAR_FONTS.map((font) => (
                <FontPreviewRow
                  key={font}
                  fontFamily={font}
                  label={font}
                  selected={selectedFont === font}
                  onSelect={() => setFont(font)}
                />
              ))}
            </List>
          </FieldGroup.Section>
        </FieldGroup>
      </ScrollView>
    </Host>
  );
}
