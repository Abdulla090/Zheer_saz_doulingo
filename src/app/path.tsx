import { PathSwitcher, type PathMode } from "../screens/home/components/PathSwitcher";
import { LearningPathScreen } from "../screens/home/LearningPathScreen";
import { useSettingsStore } from "../stores/useSettingsStore";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../hooks/useThemeColors";
import { useLocaleStore } from "../stores/useLocaleStore";

export default function PathRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const savedMode = useSettingsStore((s) => s.pathMode);
  const setPathMode = useSettingsStore((s) => s.setPathMode);
  const [activeMode, setActiveMode] = useState<PathMode>(savedMode);
  const locale = useLocaleStore((s) => s.locale);
  const isRTL = locale === "ku" || locale === "ar";
  
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const handleSwitch = useCallback(
    (next: PathMode) => {
      setActiveMode(next);
      setPathMode(next);
    },
    [setPathMode],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, [router]);

  return (
    <View style={styles.root}>
      {/* Full-screen path content */}
      <LearningPathScreen overrideMode={activeMode} />

      {/* Floating header overlay */}
      <View
        style={[
          styles.topChrome,
          { paddingTop: Math.max(insets.top, 20) + 44 },
        ]}
        pointerEvents="box-none"
      >
        {/* Back button - absolutely positioned above tabs */}
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { top: Math.max(insets.top, 20) + 4 }, isRTL ? { right: 8, left: "auto" } : { left: 8, right: "auto" }]}
          activeOpacity={0.8}
        >
          <HugeiconsIcon
            icon={isRTL ? ArrowRight01Icon : ArrowLeft01Icon}
            size={22}
            color={isDark ? "#FFFFFF" : "#0F172A"}
            strokeWidth={2.5}
          />
        </TouchableOpacity>

        {/* Tabs - centered with bottom spacing for unit bar gap */}
        <View style={{ marginBottom: 14 }}>
          <PathSwitcher activeMode={activeMode} onSwitch={handleSwitch} />
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    topChrome: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
    },
    backButton: {
      position: "absolute",
      left: 8,
      zIndex: 100,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.92)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    },
  });
}
