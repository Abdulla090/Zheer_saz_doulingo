/**
 * PathSwitcher — Street / Normal / Kids pill with sliding active chip.
 */

import {
  AppLayersIcon,
  AppStarIcon,
  AppZapIcon,
} from "../../../components/icons/AppHugeIcons";
import { LiquidGlassSurface } from "../../../components/LiquidGlassSurface";
import { IOSPressable as Pressable } from "../../../components/ui/ios-pressable";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useI18n } from "../../../hooks/useI18n";
import { useContentPackStore } from "../../../stores/useContentPackStore";
import { springMotion } from "../../../utils/motion-spring";
import { crossShadow } from "../../../utils/shadows";
import React, { useCallback, useEffect, useRef, useMemo } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export type PathMode = "street" | "normal" | "kids";

type Props = {
  activeMode: PathMode;
  onSwitch: (mode: PathMode) => void;
};

type TabDef = {
  key: PathMode;
  label: string;
  activeColor: string;
  icon: (active: boolean) => React.ReactNode;
};

const TABS: TabDef[] = [
  {
    key: "street",
    label: "Street",
    activeColor: "#1CB0F6",
    icon: (active) => <AppZapIcon size={16} active={active} filled />,
  },
  {
    key: "normal",
    label: "Normal",
    activeColor: "#7C3AED",
    icon: (active) => <AppLayersIcon size={16} active={active} filled />,
  },
  {
    key: "kids",
    label: "Kids",
    activeColor: "#FF9600",
    icon: (active) => <AppStarIcon size={16} active={active} filled />,
  },
];

const TAB_INDEX: Record<string, number> = { street: 0, normal: 1, kids: 2 };
const PILL_PAD = 4;

export function PathSwitcher({ activeMode, onSwitch }: Props) {
  const { width } = useWindowDimensions();
  const { isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const streetStatus = useContentPackStore((s) => s.streetStatus);
  const kidsStatus = useContentPackStore((s) => s.kidsStatus);

  const isDownloaded = useCallback(
    (mode: PathMode) => {
      if (mode === "normal") return true;
      if (mode === "street") return streetStatus === "downloaded";
      if (mode === "kids") return kidsStatus === "downloaded";
      return false;
    },
    [streetStatus, kidsStatus],
  );

  const pillW = width > 0 ? Math.min(width - 32, 380) : 340;
  const pressedSwitch = useRef(false);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, []);

  const getVisualIndex = useCallback(
    (mode: PathMode) => {
      const idx = TAB_INDEX[mode];
      return typeof idx === "number" ? idx : 0;
    },
    [],
  );

  const activeIndex = getVisualIndex(activeMode);
  const slideX = useSharedValue(0);
  const tabWidthSV = useSharedValue(0);

  const tabWidths = useRef<number[]>([]);
  const tabXs = useRef<number[]>([]);

  const springTo = useCallback(
    (targetX: number, targetW: number, animated: boolean) => {
      slideX.value = animated ? springMotion(targetX) : targetX;
      tabWidthSV.value = animated ? springMotion(targetW) : targetW;
    },
    [slideX, tabWidthSV],
  );

  const onTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      // Re-trigger layout alignment after items measure
    },
    [],
  );

  const onTabLayout = useCallback(
    (index: number, e: LayoutChangeEvent) => {
      const { x, width: w } = e.nativeEvent.layout;
      tabWidths.current[index] = w;
      tabXs.current[index] = x;

      if (index === activeIndex) {
        springTo(x, w, false);
      }
    },
    [activeIndex, springTo],
  );

  const handleSwitch = useCallback(
    (mode: PathMode) => {
      if (mode === activeMode) return;
      onSwitch(mode);
      pressedSwitch.current = true;

      const idx = getVisualIndex(mode);
      const targetX = tabXs.current[idx];
      const targetW = tabWidths.current[idx];
      if (typeof targetX === "number" && typeof targetW === "number") {
        springTo(targetX, targetW, true);
      }

      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
      switchTimerRef.current = setTimeout(() => {
        pressedSwitch.current = false;
      }, 500);
    },
    [activeMode, onSwitch, springTo, getVisualIndex],
  );

  // Sync animation position if selection changes externally
  useEffect(() => {
    if (pressedSwitch.current) return;
    const targetX = tabXs.current[activeIndex];
    const targetW = tabWidths.current[activeIndex];
    if (typeof targetX === "number" && typeof targetW === "number") {
      springTo(targetX, targetW, true);
    }
  }, [activeIndex, springTo]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
    width: tabWidthSV.value,
  }));

  return (
    <View style={[styles.outer, { width: pillW }]} onLayout={onTrackLayout}>
      <LiquidGlassSurface
        borderRadius={18}
        style={styles.glass}
        contentStyle={[styles.track, { flexDirection: isKu ? "row-reverse" : "row" }]}
      >
        <Animated.View
          style={[styles.slider, { pointerEvents: "none" }, sliderStyle]}
        />
        {TABS.map((tab, index) => {
          const active = activeMode === tab.key;
          const downloaded = isDownloaded(tab.key);
          return (
            <Pressable
              key={tab.key}
              onPress={() => handleSwitch(tab.key)}
              onLayout={(e) => onTabLayout(index, e)}
              style={[styles.tab, { flexDirection: isKu ? "row-reverse" : "row" }]}
            >
              {tab.icon(active)}
              <Text
                style={[
                  styles.tabLabel,
                  active && { color: isDark ? "#000000" : tab.activeColor },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {!downloaded && (
                <View
                  style={[
                    styles.downloadDot,
                    { backgroundColor: tab.activeColor },
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </LiquidGlassSurface>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    outer: {
      alignSelf: "center",
      marginBottom: 4,
    },
    glass: {
      width: "100%",
    },
    track: {
      flexDirection: "row",
      position: "relative",
      minHeight: 44,
      padding: PILL_PAD,
    },
    slider: {
      position: "absolute",
      top: PILL_PAD,
      bottom: PILL_PAD,
      left: PILL_PAD,
      borderRadius: 14,
      backgroundColor: isDark ? "#FFFFFF" : "rgba(255,255,255,0.94)",
      ...crossShadow({ color: "#000", offsetY: 1, opacity: 0.08, blur: 4, elevation: 2 }),
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      paddingVertical: 8,
      borderRadius: 14,
      zIndex: 1,
    },
    tabLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? "rgba(255,255,255,0.5)" : "#9CA3AF",
    },
    downloadDot: {
      position: "absolute",
      top: 6,
      right: 10,
      width: 6,
      height: 6,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.9)",
    },
  });
}
