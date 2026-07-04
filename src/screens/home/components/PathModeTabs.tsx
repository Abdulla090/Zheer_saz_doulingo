import {
  PathSwitcher,
  type PathMode,
} from "./PathSwitcher";
import { useSettingsStore } from "../../../stores/useSettingsStore";
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

/** PathSwitcher pill + bar padding (continue CTA is not in this chrome).
 *  44px back-button row + 56px switcher pill + 14px gap to unit bar = 114 */
export const PATH_SWITCHER_HEIGHT = 56;

export const PATH_TOP_CHROME_HEIGHT = 44 + PATH_SWITCHER_HEIGHT + 14;

export function PathModeTabs({
  hasSafeArea = true,
  absolute = true,
}: {
  hasSafeArea?: boolean;
  absolute?: boolean;
} = {}) {
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
    <View
      style={[
        styles.bar,
        !absolute && {
          position: "relative",
          top: undefined,
          left: undefined,
          right: undefined,
          zIndex: undefined,
        },
        hasSafeArea && { paddingTop: insets.top + 6 },
        { pointerEvents: "box-none" },
      ]}
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
