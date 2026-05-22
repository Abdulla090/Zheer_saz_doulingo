/**
 * DolphinModel3D — Renders the 3D dolphin mascot using react-native-filament on native,
 * falls back to a static PNG on web / Expo Go.
 *
 * Path: src/screens/home/components/DolphinModel3D.tsx
 * → assets/ is 4 dirs up: ../../../../assets/
 */

import React from "react";
import { Platform, Image, View, StyleSheet } from "react-native";

// Static PNG fallback (4 levels up from src/screens/home/components/)
const FALLBACK_IMAGE = require("../../../../assets/images/characters/dolphin-mascot.png");

type Props = {
  width: number;
  height: number;
  style?: any;
};

// ── Native 3D renderer ────────────────────────────────────────────────────────
let Filament3DView: React.FC<Props> | null = null;

if (Platform.OS !== "web") {
  try {
    const {
      FilamentScene,
      FilamentView,
      Model,
      Camera,
      DefaultLight,
    } = require("react-native-filament");

    // 4 levels up from src/screens/home/components/
    const dolphinModel = require("../../../../assets/dolphin charcter/dolphin3d-opt.glb");

    Filament3DView = ({ width, height, style }: Props) => (
      <View style={[{ width, height, overflow: "hidden", borderRadius: 16 }, style]}>
        <FilamentScene>
          <FilamentView
            style={{ width, height }}
            renderMode="continuous"
          >
            <DefaultLight />
            <Camera />
            <Model source={dolphinModel} />
          </FilamentView>
        </FilamentScene>
      </View>
    );
  } catch {
    // Filament not available in this build (e.g. Expo Go), use fallback
    Filament3DView = null;
  }
}

// ── Exported component ────────────────────────────────────────────────────────
export function DolphinModel3D({ width, height, style }: Props) {
  // If native filament is available, use 3D
  if (Filament3DView) {
    return <Filament3DView width={width} height={height} style={style} />;
  }

  // Fallback to static image
  return (
    <Image
      source={FALLBACK_IMAGE}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}
