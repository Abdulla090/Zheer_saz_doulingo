/* eslint-disable */
import { NoteBook } from "../../../constants/icons";
import { AppText } from "../../../components/ui/AppText";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useI18n } from "../../../hooks/useI18n";
import { ltrText, rtlText } from "../../lesson/games/game-text";
import { hapticSelection } from "../../../utils/haptics";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";

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
  isKu,
  compact,
  onPress,
}: {
  label: string;
  isKu: boolean;
  compact: boolean;
  onPress: () => void;
}) {
  const direction = isKu ? rtlText : ltrText;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: "rgba(255,255,255,0.22)", borderless: false }}
      style={({ pressed }) => ({
        flexShrink: 0,
        alignSelf: "center",
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <View
        style={{
          flexDirection: isKu ? "row-reverse" : "row",
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
            forceLatinFont={!isKu}
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
  const { t, isKu } = useI18n();
  const barWidth = Math.min(width - 48, 320);
  const guidebookCompact = width < 360;
  const direction = isKu ? rtlText : ltrText;

  const openGuidebook = useCallback(() => {
    hapticSelection();
    router.push({
      pathname: "/guidebook",
      params: { unit: String(unitIndex), mode: pathMode },
    });
  }, [pathMode, router, unitIndex]);

  return (
    <View style={{ alignSelf: "center", marginTop: 2, marginBottom: 10, width: barWidth }}>
      <View
        style={{
          borderRadius: 24,
          backgroundColor: faceColor,
          flexDirection: isKu ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          minHeight: 76,
        }}
      >
        <View
          style={{
            flex: 1,
            flexShrink: 1,
            minWidth: 0,
            marginRight: isKu ? 0 : 4,
            marginLeft: isKu ? 4 : 0,
            alignItems: isKu ? "flex-end" : "flex-start",
          }}
        >
          <View
            style={{
              alignSelf: isKu ? "flex-end" : "flex-start",
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 10,
              marginBottom: 2,
            }}
          >
            <AppText
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                ...direction,
              }}
              forceKurdishFont={isKu}
              forceLatinFont={!isKu}
              numberOfLines={1}
            >
              {unitLabel}
            </AppText>
          </View>
          <AppText
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: "800",
              lineHeight: 22,
              width: "100%",
              ...direction,
            }}
            forceKurdishFont={isKu}
            forceLatinFont={!isKu}
            numberOfLines={2}
          >
            {sectionTitle}
          </AppText>
        </View>

        <View style={{ flexShrink: 0, flexGrow: 0 }}>
          <GuidebookBtn
            label={t("path.guidebook")}
            isKu={isKu}
            compact={guidebookCompact}
            onPress={openGuidebook}
          />
        </View>
      </View>
    </View>
  );
});
