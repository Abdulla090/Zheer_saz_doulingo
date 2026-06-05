import {
  PathSwitcher,
  type PathMode,
} from "@/screens/home/components/PathSwitcher";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function parseMode(raw: string | string[] | undefined): PathMode {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "normal") return "normal";
  if (value === "kids") return "kids";
  return "street";
}

/** PathSwitcher pill + bar padding (continue CTA is not in this chrome). */
export const PATH_SWITCHER_HEIGHT = 56;

export const PATH_TOP_CHROME_HEIGHT = PATH_SWITCHER_HEIGHT;

export function PathModeTabs() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const savedMode = useSettingsStore((s) => s.pathMode);
  const setPathMode = useSettingsStore((s) => s.setPathMode);
  const activeMode =
    params.mode != null ? parseMode(params.mode) : savedMode;

  const handleSwitch = useCallback(
    (next: PathMode) => {
      setPathMode(next);
      router.replace({
        pathname: "/dashboard",
        params: { mode: next },
      });
    },
    [router, setPathMode],
  );

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6, pointerEvents: "box-none" }]}>
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
