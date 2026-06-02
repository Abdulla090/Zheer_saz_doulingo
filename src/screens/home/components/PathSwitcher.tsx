/**
 * PathSwitcher — Animated multi-tab pill at the top of the home screen.
 * Switches between "Street English", "Normal English" and "Kids".
 *
 * Design: sliding indicator under the active tab, Reanimated translateX.
 */

import {
  Icon3DLayers,
  Icon3DStar,
  Icon3DZapBlue,
} from "@/components/icons/Icon3D";
import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { crossShadow } from "@/utils/shadows";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

export function PathSwitcher({ activeMode, onSwitch }: Props) {
  const { width } = useWindowDimensions();
  const PILL_W = width > 0 ? Math.min(width - 32, 380) : 340;
  const TAB_W = PILL_W / TABS.length;

  const slideX = useSharedValue(TAB_INDEX[activeMode] * TAB_W);

  useEffect(() => {
    slideX.value = withTiming(TAB_INDEX[activeMode] * TAB_W, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeMode, TAB_W, slideX]);

  const handleSwitch = useCallback(
    (mode: PathMode) => {
      onSwitch(mode);
      slideX.value = withTiming(TAB_INDEX[mode] * TAB_W, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      });
    },
    [TAB_W, onSwitch, slideX],
  );

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  return (
    <View style={[styles.container, { width: PILL_W }]}>
      {/* Sliding indicator */}
      <Animated.View
        style={[
          styles.slider,
          { width: TAB_W },
          activeMode === "normal" ? styles.sliderDark : styles.sliderLight,
          sliderStyle,
        ]}
      />

      {/* Tab buttons */}
      {TABS.map((tab) => {
        const active = activeMode === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => handleSwitch(tab.key)}
            style={[styles.tab, { width: TAB_W }]}
          >
            {tab.icon(active)}
            <Text
              style={[
                styles.tabLabel,
                active && { color: tab.activeColor },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 18,
    padding: 4,
    marginBottom: 4,
    position: "relative",
    overflow: "hidden",
    minHeight: 44,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  slider: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 14,
  },
  sliderLight: {
    backgroundColor: "rgba(255,255,255,0.92)",
    ...crossShadow({ color: "#000", offsetY: 1, opacity: 0.08, blur: 4, elevation: 2 }),
  },
  sliderDark: {
    backgroundColor: "#1E2535",
    ...crossShadow({ color: "#000", offsetY: 2, opacity: 0.2, blur: 6, elevation: 4 }),
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 14,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
});
