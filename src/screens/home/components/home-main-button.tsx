import { NoteBook } from "@/constants/icons";
import { cssPressStyle, cssReleaseStyle } from "@/components/animations/motion";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";
import { crossShadow } from "@/utils/shadows";
import { LinearGradient } from "expo-linear-gradient";

type HomeMainButtonProps = {
  unitLabel: string;
  sectionTitle: string;
  faceColor: string;
  rimColor: string;
  unitIndex: number;
};

// ── 3D Guidebook button ───────────────────────────────────────────────────────
function GuidebookBtn({
  rimColor,
  onPress,
}: {
  rimColor: string;
  faceColor: string;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const faceBg = "rgba(255,255,255,0.22)";
  const depth = 4;

  return (
    <View
      style={{
        backgroundColor: rimColor,
        borderRadius: 14,
        // @ts-ignore
        borderCurve: "continuous",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          backgroundColor: faceBg,
          borderRadius: 14,
          // @ts-ignore
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderColor: "rgba(255,255,255,0.2)",
          borderTopColor: "rgba(255,255,255,0.7)",
          marginBottom: depth,
          overflow: "hidden",
          transform: [{ translateY: pressed ? depth : 0 }],
          ...(pressed ? cssPressStyle : cssReleaseStyle),
        }}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.3)", "transparent", "rgba(0,0,0,0.05)"]}
          locations={[0, 0.4, 1]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
        <Pressable
          onPress={onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={{
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
              textShadowColor: rimColor,
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
            }}
          >
            Guidebook
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ── Main section card ─────────────────────────────────────────────────────────
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
    <View
      style={{
        alignSelf: "center",
        marginVertical: 12,
        width: barWidth,
        // 3D outer: rim shows at the bottom
        backgroundColor: rimColor,
        borderRadius: 24,
        // @ts-ignore
        borderCurve: "continuous",
        // shadow
        ...crossShadow({ color: rimColor, offsetY: 6, opacity: 0.35, blur: 12, elevation: 8 }),
      }}
    >
      {/* Face layer sits on top of the rim, rides up via marginBottom */}
      <View
        style={{
          backgroundColor: faceColor,
          borderRadius: 24,
          // @ts-ignore
          borderCurve: "continuous",
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 6,        // ← 3D depth: rim shows below
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 76,
          overflow: "hidden", // to clip gradient
          // iOS 2026 glowing edge highlight
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          borderTopWidth: 2,
          borderTopColor: "rgba(255,255,255,0.6)",
          borderLeftWidth: 1.5,
          borderLeftColor: "rgba(255,255,255,0.3)",
          borderRightWidth: 1.5,
          borderRightColor: "rgba(255,255,255,0.3)",
        }}
      >
        {/* iOS 2026 Liquid Glass Gloss */}
        <LinearGradient
          colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.0)", "rgba(0,0,0,0.08)"]}
          locations={[0, 0.5, 1]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />

        {/* Text block */}
        <View style={{ flex: 1, marginRight: 10, minWidth: 0 }}>
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
                textShadowColor: rimColor,
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 1,
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
              textShadowColor: rimColor,
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
            numberOfLines={2}
          >
            {sectionTitle}
          </Text>
        </View>

        {/* 3D Guidebook button */}
        <GuidebookBtn
          rimColor={rimColor}
          faceColor={faceColor}
          onPress={() => router.push(`/guidebook?unit=${unitIndex}`)}
        />
      </View>
    </View>
  );
});
