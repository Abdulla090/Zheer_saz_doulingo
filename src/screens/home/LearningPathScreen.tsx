/* eslint-disable */
import { ContentPackCard } from "../../components/ContentPackCard";
import { KidsEnglishPathScreen } from "./KidsEnglishPathScreen";
import { NormalEnglishPathScreen } from "./NormalEnglishPathScreen";
import { StreetEnglishPathScreen } from "./StreetEnglishPathScreen";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { TopScrollFade } from "../../components/ui/TopScrollFade";
import { useSettingsStore } from "../../stores/useSettingsStore";
import {
  CONTENT_PACKS,
  useContentPackStore,
} from "../../stores/useContentPackStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../../hooks/useThemeColors";

import type { PathMode } from "../../stores/useSettingsStore";

function parseMode(raw: string | string[] | undefined): PathMode | null {
  if (raw == null) return null;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "normal") return "normal";
  if (value === "kids") return "kids";
  return "street";
}

export function LearningPathScreen({ overrideMode }: { overrideMode?: PathMode }) {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const savedMode = useSettingsStore((s) => s.pathMode);
  const activeMode = overrideMode ?? parseMode(params.mode) ?? savedMode;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const streetStatus = useContentPackStore((s) => s.streetStatus);
  const kidsStatus = useContentPackStore((s) => s.kidsStatus);

  const [showPath, setShowPath] = React.useState(() => {
    if (activeMode === "normal") return true;
    if (activeMode === "street") return streetStatus === "downloaded";
    if (activeMode === "kids") return kidsStatus === "downloaded";
    return false;
  });

  const prevStatusRef = React.useRef<Record<string, string>>({});

  React.useEffect(() => {
    if (activeMode === "normal") {
      setShowPath(true);
      return;
    }

    const status = activeMode === "street" ? streetStatus : kidsStatus;
    const prevStatus = prevStatusRef.current[activeMode];
    prevStatusRef.current[activeMode] = status;

    if (status === "downloaded") {
      if (prevStatus === "downloading") {
        // Just finished downloading! Wait 1000ms for checkmark/success banner animation
        const timer = setTimeout(() => {
          setShowPath(true);
        }, 1000);
         return () => clearTimeout(timer);
      } else {
        setShowPath(true);
      }
    } else {
      setShowPath(false);
    }
  }, [activeMode, streetStatus, kidsStatus]);

  // If the selected mode is not downloaded, show the download card
  if (!showPath) {
    const packMeta = CONTENT_PACKS.find((p) => p.id === activeMode);
    if (packMeta) {
      return (
        <View style={styles.lockRoot}>
          <ScrollView
            contentContainerStyle={[
              styles.lockScroll,
              { paddingTop: insets.top + 70, paddingBottom: insets.bottom + 120 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <ContentPackCard pack={packMeta} />
          </ScrollView>
        </View>
      );
    }
  }

  // Lazy rendering: only the active tab mounts; inactive tabs are fully unmounted
  const renderActiveContent = () => {
    switch (activeMode) {
      case "normal":
        return <NormalEnglishPathScreen />;
      case "kids":
        return <KidsEnglishPathScreen />;
      case "street":
      default:
        return <StreetEnglishPathScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderActiveContent()}
      <BottomScrollFade />
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    lockRoot: {
      flex: 1,
      backgroundColor: colors.background,
    },
    lockScroll: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
  });
}
