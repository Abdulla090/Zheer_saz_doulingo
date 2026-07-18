/* eslint-disable */
import { NoteBook } from "../../../constants/icons";
import { AppText } from "../../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useI18n } from "../../../hooks/useI18n";
import { ltrText, rtlText } from "../../lesson/games/game-text";
import { hapticSelection } from "../../../utils/haptics";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useWindowDimensions, View } from "react-native";

type HomeMainButtonProps = {
  unitLabel: string;
  sectionTitle: string;
  faceColor: string;
  rimColor: string;
  unitIndex: number;
  pathMode?: LessonPathMode;
};

/** Solid frosted chip — liquid glass clips/misaligns on small controls over saturated headers. */
function GuidebookBtn({
  label,
  isRtl,
  isKu,
  compact,
  onPress,
}: {
  label: string;
  isRtl: boolean;
  isKu: boolean;
  compact: boolean;
  onPress: () => void;
}) {
  const direction = isRtl ? rtlText : ltrText;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: "rgba(255,255,255,0.22)", borderless: false }}
      style={{
        flexShrink: 0,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          direction: isRtl ? "rtl" : "ltr",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: compact ? 0 : 6,
          minHeight: 40,
          minWidth: compact ? 40 : 112,
          paddingHorizontal: compact ? 10 : 12,
          paddingVertical: 8,
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.22)",
        }}
      >
        <NoteBook width={18} height={18} color="#FFFFFF" fill="#FFFFFF" />
        {!compact ? (
          <AppText
            style={{
              color: "#FFFFFF",
              fontWeight: "800",
              fontSize: 13,
              letterSpacing: 0.2,
              flexShrink: 0,
              ...direction,
            }}
            forceKurdishFont={isKu}
            forceLatinFont={!isRtl}
            numberOfLines={1}
          >
            {label}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

export const HomeMainButton = React.memo(({
  unitLabel,
  sectionTitle,
  faceColor,
  rimColor,
  unitIndex,
  pathMode = "street",
}: HomeMainButtonProps) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { t, isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;
  const barWidth = Math.min(width - 32, 640);
  const guidebookCompact = width < 360;
  const direction = isRtl ? rtlText : ltrText;

  const openGuidebook = useCallback(() => {
    hapticSelection();
    router.push({
      pathname: "/guidebook",
      params: { unit: String(unitIndex), mode: pathMode },
    });
  }, [pathMode, router, unitIndex]);

  return (
    <View style={{ alignSelf: "center", marginTop: 0, marginBottom: 0, width: barWidth }}>
      <View
        style={{
          borderRadius: 22,
          borderCurve: "continuous",
          backgroundColor: faceColor,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "rgba(255,255,255,0.22)",
          borderBottomWidth: 6,
          borderBottomColor: rimColor,
          direction: isRtl ? "rtl" : "ltr",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: 12,
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: 14,
          minHeight: 92,
        }}
      >
        <View
          style={{
            flex: 1,
            flexShrink: 1,
            minWidth: 0,
            marginRight: isRtl ? 0 : 4,
            marginLeft: isRtl ? 4 : 0,
            alignItems: isRtl ? "flex-end" : "flex-start",
          }}
        >
          <View
            style={{
              alignSelf: isRtl ? "flex-end" : "flex-start",
              paddingVertical: 2,
              marginBottom: 3,
            }}
          >
            <AppText
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: 12,
                fontWeight: "800",
                letterSpacing: 1.1,
                textTransform: "uppercase",
                ...direction,
              }}
              forceKurdishFont={isKu}
              forceLatinFont={!isRtl}
              numberOfLines={1}
            >
              {unitLabel}
            </AppText>
          </View>
          <AppText
            style={{
              color: "#FFFFFF",
              fontSize: 19,
              fontWeight: "800",
              lineHeight: 24,
              width: "100%",
              ...direction,
            }}
            forceKurdishFont={isKu}
            forceLatinFont={!isRtl}
            numberOfLines={2}
          >
            {sectionTitle}
          </AppText>
        </View>

        <View style={{ flexShrink: 0, flexGrow: 0 }}>
          <GuidebookBtn
            label={t("path.guidebook")}
            isRtl={isRtl}
            isKu={isKu}
            compact={guidebookCompact}
            onPress={openGuidebook}
          />
        </View>
      </View>
    </View>
  );
});
