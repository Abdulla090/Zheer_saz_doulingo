import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

const RHINO_IMG = require("../../../assets/images/characters/kids-rhino-mascot.png");

type Props = { size?: number };

/**
 * Animated kids rhino from kids_interactive.riv (native + web).
 * Falls back to static PNG only in Expo Go.
 */
export function KidsRhinoMascot({ size = 108 }: Props) {
  return (
    <View style={[styles.fallback, { width: size, height: size }]}>
      <Image
        source={RHINO_IMG}
        style={styles.image}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={150}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
