import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import { useThemeColors } from "../../hooks/useThemeColors";

/*
 * Shared chrome for the guidebook's reference screens (Letters, Nouns, Verbs).
 *
 * Mirrors `GuidebookHeader`'s toolbar — hairline rule, back control on the
 * trailing side under RTL, centered eyebrow — so every screen in the
 * guidebook family reads as one product. The title block sits under it with
 * the accent eyebrow above the heading, exactly as the guide screen does.
 */

type GuidebookScreenShellProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Accent color for the eyebrow, from `getGuidebookAccent`. */
  accentColor: string;
  isRtl: boolean;
  isKurdish: boolean;
  languageCode: string;
  /** Falls back to `router.back()` semantics via expo-router history. */
  onBack: () => void;
  backLabel: string;
  children: React.ReactNode;
  /** Extra bottom padding for the scroll content (tab bar clearance etc.). */
  contentBottomPadding?: number;
};

export function GuidebookScreenShell({
  eyebrow,
  title,
  subtitle,
  accentColor,
  isRtl,
  isKurdish,
  languageCode,
  onBack,
  backLabel,
  children,
  contentBottomPadding = 40,
}: GuidebookScreenShellProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  const backButton = (
    <IOSPressable
      onPress={onBack}
      accessibilityRole="button"
      accessibilityLabel={backLabel}
      hitSlop={8}
      style={styles.backButton}
    >
      <HugeiconsIcon
        icon={ArrowLeft01Icon}
        size={24}
        color={colors.foreground}
        strokeWidth={2.1}
        style={isRtl ? styles.backIconRtl : undefined}
      />
    </IOSPressable>
  );
  const spacer = <View style={styles.toolbarSpacer} />;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.toolbar,
          { borderBottomColor: colors.border, paddingTop: insets.top },
        ]}
      >
        {isRtl ? spacer : backButton}
        <AppText
          style={[styles.eyebrow, { color: accentColor }]}
          languageCode={languageCode}
          forceKurdishFont={isKurdish}
          align="center"
          numberOfLines={1}
        >
          {eyebrow}
        </AppText>
        {isRtl ? backButton : spacer}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + contentBottomPadding },
        ]}
      >
        <View style={styles.titleBlock}>
          <AppText
            style={[styles.title, { color: colors.foreground }]}
            languageCode={languageCode}
            forceKurdishFont={isKurdish}
            align="start"
            fullWidth
            numberOfLines={2}
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              style={[styles.subtitle, { color: colors.mutedForeground }]}
              languageCode={languageCode}
              forceKurdishFont={isKurdish}
              align="start"
              fullWidth
              numberOfLines={2}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toolbar: {
    minHeight: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backIconRtl: { transform: [{ scaleX: -1 }] },
  toolbarSpacer: { width: 40 },
  eyebrow: { fontSize: 13, lineHeight: 18, fontWeight: "700", flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    alignSelf: "center",
    width: "100%",
    maxWidth: 720,
  },
  titleBlock: { gap: 5, marginBottom: 18 },
  title: { fontSize: 27, lineHeight: 33, fontWeight: "800", letterSpacing: -0.4 },
  subtitle: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
});
