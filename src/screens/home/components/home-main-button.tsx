import { NoteBook } from "@/constants/icons";
import { SoftPressableButton, SoftSurface } from "@/components/ui/soft-2.5d";
import { useRouter } from "expo-router";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

type HomeMainButtonProps = {
  unitLabel: string;
  sectionTitle: string;
  faceColor: string;
  rimColor: string;
  unitIndex: number;
};

function GuidebookBtn({
  rimColor,
  onPress,
}: {
  rimColor: string;
  onPress: () => void;
}) {
  return (
    <SoftPressableButton
      onPress={onPress}
      faceColor="rgba(255,255,255,0.24)"
      rimColor={rimColor}
      borderRadius={14}
      contentStyle={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 6,
      }}
    >
      <NoteBook width={20} height={20} />
      <Text
        style={{
          color: "#FFFFFF",
          fontWeight: "800",
          fontSize: 13,
          letterSpacing: 0.3,
          zIndex: 1,
        }}
      >
        Guidebook
      </Text>
    </SoftPressableButton>
  );
}

export const HomeMainButton = React.memo(({
  unitLabel,
  sectionTitle,
  faceColor,
  rimColor,
  unitIndex,
}: HomeMainButtonProps) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const barWidth = Math.min(width - 48, 320);

  return (
    <View style={{ alignSelf: "center", marginVertical: 12, width: barWidth }}>
      <SoftSurface
        faceColor={faceColor}
        rimColor={rimColor}
        borderRadius={24}
        innerStyle={{
          paddingHorizontal: 14,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 76,
        }}
      >
        <View style={{ flex: 1, marginRight: 10, minWidth: 0, zIndex: 1 }}>
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 10,
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {unitLabel}
            </Text>
          </View>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              fontWeight: "800",
              lineHeight: 22,
            }}
            numberOfLines={2}
          >
            {sectionTitle}
          </Text>
        </View>

        <GuidebookBtn
          rimColor={rimColor}
          onPress={() => router.push(`/guidebook?unit=${unitIndex}`)}
        />
      </SoftSurface>
    </View>
  );
});
