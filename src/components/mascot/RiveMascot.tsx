import Constants, { ExecutionEnvironment } from "expo-constants";
import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import type { TwinoPose } from "./TwinoMascot";

/* eslint-disable @typescript-eslint/no-require-imports */
const RHINO_IMG = require("../../../assets/images/characters/kids-rhino-mascot.png");

type Props = {
  size?: number;
  pose?: TwinoPose | "sad" | "fail";
};

/**
 * Renders the Rive mascot on native dev builds,
 * and a high-quality static rhino image on web / Expo Go.
 */
export function RiveMascot({ size = 100, pose = "wave" }: Props) {
  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  // Rive native module doesn't work on web or Expo Go — use static rhino image
  if (isExpoGo || Platform.OS === "web") {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Image
          source={RHINO_IMG}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  const { default: RiveMascotImpl } = require("./RiveMascotImpl") as {
    default: React.ComponentType<{ size: number; pose: string }>;
  };

  return <RiveMascotImpl size={size} pose={pose} />;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
