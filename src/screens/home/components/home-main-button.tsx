import { NoteBook } from "@/constants/icons";
import { AppText } from "@/components/ui/AppText";
import { SoftPressableButton, SoftSurface } from "@/components/ui/soft-2.5d";
import type { LessonPathMode } from "@/data/lesson-content";
import { useI18n } from "@/hooks/useI18n";
import { ltrText, rtlText } from "@/screens/lesson/games/game-text";
import { useRouter } from "expo-router";
import React from "react";
import { useWindowDimensions, View } from "react-native";

type HomeMainButtonProps = {
  unitLabel: string;
  sectionTitle: string;
  faceColor: string;
  rimColor: string;
  unitIndex: number;
  pathMode?: LessonPathMode;
};

function GuidebookBtn({
  rimColor,
  label,
  isKu,
  onPress,
}: {
  rimColor: string;
  label: string;
  isKu: boolean;
  onPress: () => void;
}) {
  const direction = isKu ? rtlText : ltrText;

  return (
    <SoftPressableButton
      onPress={onPress}
      faceColor="rgba(255,255,255,0.24)"
      rimColor={rimColor}
      borderRadius={14}
      style={{ flexShrink: 0, alignSelf: "center" }}
      contentStyle={{
        flexDirection: isKu ? "row-reverse" : "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 6,
      }}
    >
      <NoteBook width={20} height={20} />
      <AppText
        style={{
          color: "#FFFFFF",
          fontWeight: "800",
          fontSize: 13,
          letterSpacing: 0.3,
          zIndex: 1,
          ...direction,
        }}
        forceKurdishFont={isKu}
        forceLatinFont={!isKu}
      >
        {label}
      </AppText>
    </SoftPressableButton>
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
  const direction = isKu ? rtlText : ltrText;

  return (
    <View style={{ alignSelf: "center", marginVertical: 12, width: barWidth }}>
      <SoftSurface
        faceColor={faceColor}
        rimColor={rimColor}
        borderRadius={24}
        innerStyle={{
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
              marginBottom: 6,
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
            rimColor={rimColor}
            label={t("path.guidebook")}
            isKu={isKu}
            onPress={() =>
              router.push({
                pathname: "/guidebook",
                params: { unit: String(unitIndex), mode: pathMode },
              })
            }
          />
        </View>
      </SoftSurface>
    </View>
  );
});
