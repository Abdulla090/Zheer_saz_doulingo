import { Cancel01Icon, FlowerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

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
          isRtl && Platform.OS !== "web" && styles.rowReverse,
          isWide && styles.toolbarWide,
        ]}
      >
        <IOSPressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={copy.close}
          hitSlop={8}
          style={[styles.closeButton, { backgroundColor: colors.muted }]}
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={19}
            color={colors.foreground}
            strokeWidth={2.3}
          />
        </IOSPressable>

        <AppText
          style={[
            styles.toolbarTitle,
            { color: colors.mutedForeground },
            isRtl && styles.rtlText,
          ]}
          forceKurdishFont={isKurdish}
          numberOfLines={1}
        >
          {copy.screenTitle}
        </AppText>

        <View style={[styles.flowerMark, { borderColor: accent.soft }]}>
          <HugeiconsIcon
            icon={FlowerIcon}
            size={20}
            color={accent.strong}
            strokeWidth={1.8}
          />
        </View>
      </View>

      <LinearGradient
        colors={[accent.tint, accent.soft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.cover,
          isWide && styles.coverWide,
          isRtl && styles.coverRtl,
        ]}
      >
        <View
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          style={[styles.art, isRtl && styles.artRtl]}
        >
          <View
            style={[
              styles.artHalo,
              { borderColor: "rgba(255,255,255,0.58)" },
            ]}
          />
          <View style={[styles.artSun, { backgroundColor: accent.strong }]} />
          <View style={[styles.artMoon, { backgroundColor: accent.tint }]} />
          <View
            style={[
              styles.artStem,
              { backgroundColor: "rgba(255,255,255,0.62)" },
            ]}
          />
        </View>

        <View
          style={[
            styles.coverCopy,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <View
            style={[
              styles.unitPill,
              { backgroundColor: "rgba(255,255,255,0.62)" },
            ]}
          >
            <AppText
              style={[styles.unitLabel, { color: accent.deep }]}
              forceKurdishFont={isKurdish}
              numberOfLines={1}
            >
              {guide.unitLabel}
            </AppText>
          </View>

          <AppText
            style={[
              styles.coverTitle,
              isWide && styles.coverTitleWide,
              { color: accent.deep },
            ]}
            align="start"
            forceKurdishFont={isKurdish}
            fullWidth
            numberOfLines={3}
          >
            {guide.title}
          </AppText>
        </View>
      </LinearGradient>
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
    minHeight: 66,
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
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  flowerMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    minHeight: 214,
    marginHorizontal: 16,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 24,
  },
  coverWide: {
    minHeight: 250,
    marginHorizontal: 0,
    paddingHorizontal: 34,
    paddingVertical: 30,
  },
  coverRtl: {
    alignItems: "flex-end",
  },
  coverCopy: {
    width: "72%",
    minWidth: 0,
    gap: 12,
    zIndex: 2,
  },
  unitPill: {
    minHeight: 28,
    maxWidth: "100%",
    borderRadius: 14,
    paddingHorizontal: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  unitLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 0.35,
  },
  coverTitle: {
    maxWidth: 560,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    fontFamily: "DINNextRoundedBold",
  },
  coverTitleWide: {
    fontSize: 40,
    lineHeight: 48,
  },
  art: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  artRtl: {
    transform: [{ scaleX: -1 }],
  },
  artHalo: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    top: -34,
    right: -24,
  },
  artSun: {
    position: "absolute",
    width: 118,
    height: 118,
    borderRadius: 59,
    top: 32,
    right: 20,
    opacity: 0.9,
  },
  artMoon: {
    position: "absolute",
    width: 94,
    height: 94,
    borderRadius: 47,
    top: 18,
    right: 54,
  },
  artStem: {
    position: "absolute",
    width: 1,
    height: 96,
    right: 79,
    bottom: -8,
    transform: [{ rotate: "24deg" }],
  },
});
