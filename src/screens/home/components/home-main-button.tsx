import { NoteBook } from "../../../constants/icons";
import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useI18n } from "../../../hooks/useI18n";
import { ltrText, rtlText } from "../../lesson/games/game-text";
import { hapticSelection } from "../../../utils/haptics";
import { IS_ANDROID } from "../../../utils/native-perf";
import { crossShadow } from "../../../utils/shadows";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

type HomeMainButtonProps = {
  unitLabel: string;
  sectionTitle: string;
  faceColor: string;
  rimColor: string;
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
      <NoteBook width={31} height={31} color="#FFFFFF" fill="#FFFFFF" />
    </Pressable>
  );
}

function UnitCopy({
  unitLabel,
  sectionTitle,
  isRtl,
  languageCode,
}: {
  unitLabel: string;
  sectionTitle: string;
  isRtl: boolean;
  languageCode: string;
}) {
  const direction = isRtl ? rtlText : ltrText;
  return (
    <View
      style={[
        styles.copy,
        { alignItems: isRtl ? "flex-end" : "flex-start" },
      ]}
    >
      <AppText
        style={[styles.unitLabel, direction]}
        languageCode={languageCode}
        forceKurdishFont={languageCode === "ku"}
        forceLatinFont={!isRtl}
        numberOfLines={1}
        fullWidth
      >
        {unitLabel}
      </AppText>
      <AppText
        style={[styles.sectionTitle, direction]}
        languageCode={languageCode}
        forceKurdishFont={languageCode === "ku"}
        forceLatinFont={!isRtl}
        numberOfLines={2}
        fullWidth
      >
        {sectionTitle}
      </AppText>
    </View>
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

  const openGuidebook = useCallback(() => {
    hapticSelection();
    router.push({
      pathname: "/guidebook",
      params: { unit: String(unitIndex), mode: pathMode },
    });
  }, [pathMode, router, unitIndex]);

  const shadow = useMemo(
    () =>
      IS_ANDROID
        ? undefined
        : crossShadow({
            color: rimColor,
            offsetY: 4,
            blur: 8,
            opacity: 0.18,
            elevation: 3,
          }),
    [rimColor],
  );

  const guidebook = (
    <GuidebookSegment label={t("path.guidebook")} onPress={openGuidebook} />
  );
  const divider = <View style={styles.divider} />;
  const copy = (
    <UnitCopy
      unitLabel={unitLabel}
      sectionTitle={sectionTitle}
      isRtl={isRtl}
      languageCode={locale}
    />
  );

  return (
    <View style={[styles.shell, { width: barWidth, backgroundColor: rimColor }, shadow]}>
      <View
        style={[
          styles.face,
          {
            backgroundColor: faceColor,
            flexDirection: isRtl ? "row-reverse" : "row",
          },
        ]}
      >
        {isRtl ? (
          <>
            {guidebook}
            {divider}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {divider}
            {guidebook}
          </>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  shell: {
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 0,
    minHeight: 92,
    paddingBottom: 6,
    borderRadius: 25,
    borderCurve: "continuous",
  },
  face: {
    flex: 1,
    minHeight: 86,
    borderRadius: 24,
    borderCurve: "continuous",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    gap: 4,
  },
  unitLabel: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "900",
    fontFamily: "Rabar_044",
  },
  divider: {
    width: 2,
    alignSelf: "stretch",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  guidebookSegment: {
    width: 76,
    minHeight: 84,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
