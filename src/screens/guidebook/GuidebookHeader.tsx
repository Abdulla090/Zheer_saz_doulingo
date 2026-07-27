import React from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { GuidebookCopy } from "./guidebook-copy";
import type { GuidebookViewModel } from "./guidebook-model";
import type { GuidebookAccent } from "./guidebook-theme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BookOpen02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

type GuidebookHeaderProps = {
  guide: GuidebookViewModel;
  copy: GuidebookCopy;
  accent: GuidebookAccent;
  isWide: boolean;
  isRtl: boolean;
  isKurdish: boolean;
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
  topInset,
  onClose,
}: GuidebookHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ paddingTop: topInset }}>
      <View
        style={[
          styles.toolbar,
          isRtl && styles.rowReverse,
          isWide && styles.toolbarWide,
        ]}
      >
        <IOSPressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close study guide"
          style={[styles.closeButton, { backgroundColor: colors.muted }]}
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={20}
            color={colors.foreground}
            strokeWidth={2.3}
          />
        </IOSPressable>

        <View
          style={[
            styles.toolbarTitle,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <AppText
            style={[
              styles.toolbarEyebrow,
              { color: colors.mutedForeground },
              isRtl && styles.rtlText,
            ]}
            forceKurdishFont={isKurdish}
          >
            {copy.screenTitle}
          </AppText>
          <AppText
            style={[
              styles.toolbarUnit,
              { color: colors.foreground },
              isRtl && styles.rtlText,
            ]}
            forceKurdishFont={isKurdish}
            numberOfLines={1}
          >
            {guide.unitLabel}
          </AppText>
        </View>

        <View style={[styles.bookMark, { backgroundColor: accent.tint }]}>
          <HugeiconsIcon
            icon={BookOpen02Icon}
            size={22}
            color={accent.strong}
            strokeWidth={2.2}
          />
        </View>
      </View>

      <View style={[styles.intro, isWide && styles.introWide]}>
        <View
          style={[
            styles.introMain,
            isRtl && styles.rowReverse,
          ]}
        >
          <View
            style={[
              styles.bookTile,
              { backgroundColor: accent.strong },
            ]}
          >
            <HugeiconsIcon
              icon={BookOpen02Icon}
              size={24}
              color="#FFFFFF"
              strokeWidth={2}
            />
          </View>

          <View
            style={[
              styles.introCopy,
              { alignItems: isRtl ? "flex-end" : "flex-start" },
            ]}
          >
            <AppText
              style={[
                styles.introTitle,
                isWide && styles.introTitleWide,
                { color: colors.foreground },
                isRtl && styles.rtlText,
              ]}
              forceKurdishFont={isKurdish}
            >
              {guide.title}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: "row-reverse",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  toolbar: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toolbarWide: {
    paddingHorizontal: 0,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbarTitle: {
    flex: 1,
    minWidth: 0,
  },
  toolbarEyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  toolbarUnit: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
    marginTop: 1,
  },
  bookMark: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  intro: {
    marginHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  introWide: {
    marginHorizontal: 0,
    paddingTop: 28,
    paddingBottom: 12,
  },
  introMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bookTile: {
    width: 48,
    height: 58,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  introCopy: {
    flex: 1,
    minWidth: 0,
  },
  introTitle: {
    fontSize: 25,
    lineHeight: 33,
    fontWeight: "900",
    fontFamily: "DINNextRoundedBold",
  },
  introTitleWide: {
    fontSize: 34,
    lineHeight: 42,
  },
});
