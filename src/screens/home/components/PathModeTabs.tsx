import {
  PathSwitcher,
  type PathMode,
} from "@/screens/home/components/PathSwitcher";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function parseMode(raw: string | string[] | undefined): PathMode {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "normal" ? "normal" : "street";
}

export const PATH_SWITCHER_HEIGHT = 48;

export function PathModeTabs() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeMode = parseMode(params.mode);

  const handleSwitch = useCallback(
    (next: PathMode) => {
      router.replace({
        pathname: "/dashboard",
        params: { mode: next },
      });
    },
    [router],
  );

  return (
    <View
      style={[styles.bar, { paddingTop: insets.top + 6 }]}
      pointerEvents="box-none"
    >
      <PathSwitcher activeMode={activeMode} onSwitch={handleSwitch} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: "center",
    paddingBottom: 6,
    backgroundColor: "transparent",
  },
});
