import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { GuidebookCopy } from "./guidebook-copy";
import type { GuidebookViewModel } from "./guidebook-model";
import type { GuidebookAccent } from "./guidebook-theme";

type GuidebookHeaderProps = {
  guide: GuidebookViewModel;
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  isWide: boolean;
  isRtl: boolean;
  isKurdish: boolean;
  languageCode: string;
  topInset: number;
  onClose: () => void;
};

export function GuidebookHeader({
  guide,
  copy,
  accent,
  isWide,
  isRtl,
  isKurdish,
  languageCode,
  topInset,
  onClose,
}: GuidebookHeaderProps) {
  const { colors } = useThemeColors();
  const closeButton = (
    <IOSPressable
      onPress={onClose}
      accessibilityRole="button"
      accessibilityLabel={copy.close}
      hitSlop={8}
      style={styles.closeButton}
    >
      <HugeiconsIcon
        icon={Cancel01Icon}
        size={28}
        color={colors.mutedForeground}
        strokeWidth={2.1}
      />
    </IOSPressable>
  );
  const spacer = <View style={styles.toolbarSpacer} />;

  return (
    <View style={{ paddingTop: topInset }}>
      <View
        style={[
          styles.toolbar,
          isWide && styles.toolbarWide,
          { borderBottomColor: colors.border },
        ]}
      >
        {isRtl ? spacer : closeButton}
        <AppText
          style={[styles.unitLabel, { color: colors.mutedForeground }]}
          languageCode={languageCode}
          forceKurdishFont={isKurdish}
          align="center"
          numberOfLines={1}
        >
          {guide.unitLabel}
        </AppText>
        {isRtl ? closeButton : spacer}
      </View>

      <View
        style={[
          styles.intro,
          isWide && styles.introWide,
          { alignItems: isRtl ? "flex-end" : "flex-start" },
        ]}
      >
        <AppText
          style={[styles.eyebrow, { color: accent.strong }]}
          languageCode={languageCode}
          forceKurdishFont={isKurdish}
          align="start"
          fullWidth
        >
          {copy.keyPhrases}
        </AppText>
        <AppText
          style={[
            styles.title,
            isWide && styles.titleWide,
            { color: colors.foreground },
          ]}
          languageCode={languageCode}
          forceKurdishFont={isKurdish}
          align="start"
          fullWidth
          numberOfLines={2}
        >
          {guide.title}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    minHeight: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toolbarWide: {
    paddingHorizontal: 0,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarSpacer: {
    width: 44,
    height: 44,
  },
  unitLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
  },
  intro: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 18,
    gap: 8,
  },
  introWide: {
    paddingHorizontal: 0,
    paddingTop: 40,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
  },
  title: {
    fontSize: 29,
    lineHeight: 37,
    fontWeight: "900",
    fontFamily: "Rabar_044",
  },
  titleWide: {
    fontSize: 36,
    lineHeight: 44,
  },
});
