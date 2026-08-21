import { NoteBook } from "../../../constants/icons";
import { AppText } from "../../../components/ui/AppText";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useI18n } from "../../../hooks/useI18n";
import { ltrText, rtlText } from "../../lesson/games/game-text";
import { hapticSelection } from "../../../utils/haptics";
import { shadeHex } from "../../../utils/color-shade";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

type HomeMainButtonProps = {
  unitLabel: string;
  sectionTitle: string;
  faceColor: string;
  rimColor?: string;
  unitIndex: number;
  pathMode?: LessonPathMode;
};

function GuidebookSegment({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: "rgba(255,255,255,0.22)", borderless: false }}
      style={styles.guidebookSegment}
    >
      <NoteBook width={26} height={26} color="#FFFFFF" fill="#FFFFFF" />
    </Pressable>
  );
}

function UnitCopy({
  unitLabel,
  sectionTitle,
  isRtl,
  languageCode,
  onPress,
}: {
  unitLabel: string;
  sectionTitle: string;
  isRtl: boolean;
  languageCode: string;
  onPress: () => void;
}) {
  const direction = isRtl ? rtlText : ltrText;
  const isKurdishOrArabic = isRtl || languageCode === "ku" || languageCode === "ar";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.copy,
        { alignItems: isRtl ? "flex-end" : "flex-start" },
      ]}
      android_ripple={{ color: "rgba(255,255,255,0.15)", borderless: false }}
    >
      <AppText
        style={[styles.unitLabel, direction]}
        languageCode={languageCode}
        forceKurdishFont={isKurdishOrArabic}
        forceLatinFont={!isKurdishOrArabic}
        numberOfLines={1}
        fullWidth
      >
        {unitLabel}
      </AppText>
      <AppText
        style={[styles.sectionTitle, direction]}
        languageCode={languageCode}
        forceKurdishFont={isKurdishOrArabic}
        forceLatinFont={!isKurdishOrArabic}
        numberOfLines={2}
        fullWidth
      >
        {sectionTitle}
      </AppText>
    </Pressable>
  );
}

export const HomeMainButton = React.memo(function HomeMainButton({
  unitLabel,
  sectionTitle,
  faceColor,
  rimColor,
  unitIndex,
  pathMode = "street",
}: HomeMainButtonProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { t, locale, isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;
  const barWidth = Math.min(width - 32, 620);
  const bottomRimColor = rimColor || shadeHex(faceColor, 0.82);

  const openGuidebook = useCallback(() => {
    hapticSelection();
    router.push({
      pathname: "/guidebook",
      params: { unit: String(unitIndex), mode: pathMode },
    });
  }, [pathMode, router, unitIndex]);

  return (
    <View style={[styles.shell, { width: barWidth, backgroundColor: bottomRimColor }]}>
      <View style={[styles.face, { backgroundColor: faceColor }]}>
        {/* Guidebook button is ALWAYS on the left side */}
        <GuidebookSegment label={t("path.guidebook")} onPress={openGuidebook} />
        <View style={styles.divider} />
        {/* Unit Copy on the right */}
        <UnitCopy
          unitLabel={unitLabel}
          sectionTitle={sectionTitle}
          isRtl={isRtl}
          languageCode={locale}
          onPress={openGuidebook}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  shell: {
    alignSelf: "center",
    marginHorizontal: 16,
    marginVertical: 6,
    paddingBottom: 4, // Clean 3D bottom bevel rim
    borderRadius: 16,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  face: {
    minHeight: 66,
    borderRadius: 15,
    borderCurve: "continuous",
    overflow: "hidden",
    flexDirection: "row", // Guidebook always on left, Copy on right
    alignItems: "stretch",
  },
  guidebookSegment: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1.5,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 3,
  },
  unitLabel: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "600",
  },
});
