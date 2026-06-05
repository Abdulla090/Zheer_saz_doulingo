/**
 * PathSwitcher — Street / Normal / Kids pill with sliding active chip.
 */

import {
  Icon3DLayers,
  Icon3DStar,
  Icon3DZapBlue,
} from "@/components/icons/Icon3D";
import { LiquidGlassSurface } from "@/components/LiquidGlassSurface";
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
    icon: () => <Icon3DStar size={16} />,
  },
];

const TAB_INDEX: Record<PathMode, number> = { street: 0, normal: 1, kids: 2 };
const PILL_PAD = 4;

export function PathSwitcher({ activeMode, onSwitch }: Props) {
  const { width } = useWindowDimensions();
  const pillW = width > 0 ? Math.min(width - 32, 380) : 340;
  const pressedSwitch = useRef(false);

  const tabWidthSV = useSharedValue((pillW - PILL_PAD * 2) / TABS.length);
  const slideX = useSharedValue(TAB_INDEX[activeMode] * tabWidthSV.value);

  const springTo = useCallback(
    (index: number) => {
      slideX.value = springMotion(index * tabWidthSV.value);
    },
    [slideX, tabWidthSV],
  );

  const onTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      const nextTabW = (w - PILL_PAD * 2) / TABS.length;
      if (nextTabW <= 0) return;
      tabWidthSV.value = nextTabW;
      slideX.value = TAB_INDEX[activeMode] * nextTabW;
    },
    [activeMode, slideX, tabWidthSV],
  );

  useEffect(() => {
    if (pressedSwitch.current) {
      pressedSwitch.current = false;
      return;
    }
    springTo(TAB_INDEX[activeMode]);
  }, [activeMode, springTo]);

  const handleSwitch = useCallback(
    (mode: PathMode) => {
      if (mode === activeMode) return;
      pressedSwitch.current = true;
      springTo(TAB_INDEX[mode]);
      onSwitch(mode);
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
        contentStyle={styles.track}
      >
        <Animated.View
          style={[styles.slider, { pointerEvents: "none" }, sliderStyle]}
        />
        {TABS.map((tab) => {
          const active = activeMode === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => handleSwitch(tab.key)}
              style={styles.tab}
            >
              {tab.icon(active)}
              <Text
                style={[styles.tabLabel, active && { color: tab.activeColor }]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
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
});
