/* eslint-disable */
/**
 * PathSwitcher — Street / Normal / Kids pill with sliding active chip.
 */

import {
  Icon3DLayers,
  Icon3DStar,
  Icon3DZapBlue,
} from "@/components/icons/Icon3D";
import { LiquidGlassSurface } from "@/components/LiquidGlassSurface";
import { useI18n } from "@/hooks/useI18n";
import { useContentPackStore } from "@/stores/useContentPackStore";
import { springMotion } from "@/utils/motion-spring";
import { crossShadow } from "@/utils/shadows";
import React, { useCallback, useEffect, useRef } from "react";
import {
  LayoutChangeEvent,
  Pressable,
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
    icon: (active) => <Icon3DZapBlue size={16} active={active} />,
  },
  {
    key: "normal",
    label: "Normal",
    activeColor: "#7C3AED",
    icon: (active) => <Icon3DLayers size={16} active={active} />,
  },
  {
    key: "kids",
    label: "Kids",
    activeColor: "#FF9600",
    icon: (active) => <Icon3DStar size={16} active={active} />,
  },
];

const TAB_INDEX: Record<PathMode, number> = { street: 0, normal: 1, kids: 2 };
const PILL_PAD = 4;

export function PathSwitcher({ activeMode, onSwitch }: Props) {
  const { width } = useWindowDimensions();
  const { isKu } = useI18n();
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
      return isKu ? TABS.length - 1 - idx : idx;
    },
    [isKu],
  );

  const tabWidthSV = useSharedValue((pillW - PILL_PAD * 2) / TABS.length);
  const slideX = useSharedValue(getVisualIndex(activeMode) * tabWidthSV.value);

  const springTo = useCallback(
    (mode: PathMode) => {
      const vIdx = getVisualIndex(mode);
      slideX.value = springMotion(vIdx * tabWidthSV.value);
    },
    [slideX, tabWidthSV, getVisualIndex],
  );

  const onTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      const nextTabW = (w - PILL_PAD * 2) / TABS.length;
      if (nextTabW <= 0) return;
      tabWidthSV.value = nextTabW;
      slideX.value = getVisualIndex(activeMode) * nextTabW;
    },
    [activeMode, slideX, tabWidthSV, getVisualIndex],
  );

  useEffect(() => {
    if (pressedSwitch.current) {
      pressedSwitch.current = false;
      return;
    }
    springTo(activeMode);
  }, [activeMode, springTo]);

  const handleSwitch = useCallback(
    (mode: PathMode) => {
      if (mode === activeMode) return;
      pressedSwitch.current = true;
      springTo(mode);
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
      switchTimerRef.current = setTimeout(() => {
        onSwitch(mode);
      }, 160);
    },
    [activeMode, onSwitch, springTo],
  );

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
        {TABS.map((tab) => {
          const active = activeMode === tab.key;
          const downloaded = isDownloaded(tab.key);
          return (
            <Pressable
              key={tab.key}
              onPress={() => handleSwitch(tab.key)}
              style={[styles.tab, { flexDirection: isKu ? "row-reverse" : "row" }]}
            >
              {tab.icon(active)}
              <Text
                style={[styles.tabLabel, active && { color: tab.activeColor }]}
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

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(255,255,255,0.94)",
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
    color: "#9CA3AF",
  },
  downloadDot: {
    position: "absolute",
    top: 6,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
});
