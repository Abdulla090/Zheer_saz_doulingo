import {
  Icon3DCheck,
  Icon3DFire,
  Icon3DLayers,
  Icon3DMic,
  Icon3DZapBlue,
} from "@/components/icons/Icon3D";
import { crossShadow } from "@/utils/shadows";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

export type OnboardingHeroVariant =
  | "welcome"
  | "paths"
  | "practice"
  | "progress"
  | "ready";

const MASCOT = require("../../../../assets/images/characters/dolphin-mascot.jpg");

export function OnboardingHero({ variant }: { variant: OnboardingHeroVariant }) {
  const { width } = useWindowDimensions();
  const heroH = Math.min(220, Math.max(160, width * 0.48));
  const mascotSize = Math.min(140, width * 0.36);

  return (
    <View style={[styles.wrap, { height: heroH }]}>
      <View style={styles.glow} />

      {variant === "welcome" || variant === "ready" ? (
        <View
          style={[
            styles.mascotCard,
            { width: mascotSize + 32, height: mascotSize + 32 },
            crossShadow({
              color: "#208AEF",
              offsetY: 12,
              blur: 28,
              opacity: 0.2,
              elevation: 8,
            }),
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
            style={styles.sheen}
            pointerEvents="none"
          />
          <Image
            source={MASCOT}
            contentFit="contain"
            style={{ width: mascotSize, height: mascotSize }}
          />
        </View>
      ) : null}

      {variant === "paths" ? (
        <View style={styles.iconRow}>
          <HeroIconBubble accent="#208AEF">
            <Icon3DZapBlue size={40} active />
          </HeroIconBubble>
          <HeroIconBubble accent="#7C3AED" style={{ marginTop: 20 }}>
            <Icon3DLayers size={40} active />
          </HeroIconBubble>
        </View>
      ) : null}

      {variant === "practice" ? (
        <View style={styles.iconRow}>
          <HeroIconBubble accent="#208AEF">
            <Icon3DMic size={36} />
          </HeroIconBubble>
          <HeroIconBubble accent="#58CC02" style={{ marginTop: 16 }}>
            <Icon3DZapBlue size={36} active />
          </HeroIconBubble>
        </View>
      ) : null}

      {variant === "progress" ? (
        <View style={styles.iconRow}>
          <HeroIconBubble accent="#FF9600">
            <Icon3DFire size={36} />
          </HeroIconBubble>
          <HeroIconBubble accent="#58CC02" style={{ marginTop: 16 }}>
            <Icon3DCheck size={36} />
          </HeroIconBubble>
        </View>
      ) : null}
    </View>
  );
}

function HeroIconBubble({
  children,
  accent,
  style,
}: {
  children: React.ReactNode;
  accent: string;
  style?: object;
}) {
  return (
    <View
      style={[
        styles.bubble,
        { borderColor: `${accent}33` },
        crossShadow({ color: accent, offsetY: 8, blur: 20, opacity: 0.18, elevation: 6 }),
        style,
      ]}
    >
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC"]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(147, 197, 253, 0.2)",
  },
  mascotCard: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  bubble: {
    width: 88,
    height: 88,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
