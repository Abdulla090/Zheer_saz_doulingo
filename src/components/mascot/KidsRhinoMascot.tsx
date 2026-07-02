import Constants, { ExecutionEnvironment } from "expo-constants";
import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";

/* eslint-disable @typescript-eslint/no-require-imports */
const RHINO_IMG = require("../../../assets/images/characters/kids-rhino-mascot.png");

type Props = { size?: number };

/**
 * Animated kids rhino from kids_interactive.riv (native + web).
 * Falls back to static PNG only in Expo Go.
 */
export function KidsRhinoMascot({ size = 108 }: Props) {
  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (isExpoGo) {
    return (
      <View style={[styles.fallback, { width: size, height: size }]}>
        <Image source={RHINO_IMG} style={styles.image} resizeMode="contain" />
      </View>
    );
  }

  if (Platform.OS === "web") {
     
    const KidsRhinoMascotImplWeb = require("./KidsRhinoMascotImpl.web").default;
    return <KidsRhinoMascotImplWeb size={size} />;
  }

   
  const KidsRhinoMascotImpl = require("./KidsRhinoMascotImpl").default;
  return <KidsRhinoMascotImpl size={size} />;
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
