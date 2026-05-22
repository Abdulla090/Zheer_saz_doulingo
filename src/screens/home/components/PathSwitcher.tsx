/**
 * PathSwitcher — Animated dual-tab pill that sits at the top of the home screen.
 * Switches between "Street English" (light) and "Normal English" (dark).
 *
 * Design: sliding indicator under/inside the pill, Reanimated translateX.
 */

import { Icon3DZapBlue, Icon3DLayers } from "@/components/icons/Icon3D";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { crossShadow } from "@/utils/shadows";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type PathMode = "street" | "normal";

type Props = {
  activeMode: PathMode;
  onSwitch: (mode: PathMode) => void;
};

const TABS: { key: PathMode; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    key: "street",
    label: "Street English",
    icon: (active) => <Icon3DZapBlue size={16} active={active} />,
  },
  {
    key: "normal",
    label: "Normal English",
    icon: (active) => <Icon3DLayers size={16} active={active} />,
  },
];

export function PathSwitcher({ activeMode, onSwitch }: Props) {
  const { width } = useWindowDimensions();
  const PILL_W = Math.min(width - 32, 380);
  const TAB_W  = PILL_W / 2;

  const slideX = useSharedValue(activeMode === "street" ? 0 : TAB_W);

  const handleSwitch = useCallback(
    (mode: PathMode) => {
      onSwitch(mode);
      slideX.value = withTiming(mode === "street" ? 0 : TAB_W, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      });
    },
    [TAB_W, onSwitch],
  );

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const isStreet = activeMode === "street";

  return (
    <View style={[styles.container, { width: PILL_W }]}>
      {/* Sliding indicator */}
      <Animated.View
        style={[
          styles.slider,
          { width: TAB_W },
          isStreet ? styles.sliderLight : styles.sliderDark,
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
                active && (tab.key === "street" ? styles.tabLabelStreetActive : styles.tabLabelNormalActive),
              ]}
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
    backgroundColor: "#F0F2F5",
    borderRadius: 18,
    padding: 4,
    marginBottom: 4,
    position: "relative",
    overflow: "hidden",
  },
  slider: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 14,
  },
  sliderLight: {
    backgroundColor: "#FFFFFF",
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
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  tabLabelStreetActive: {
    color: "#1CB0F6",
  },
  tabLabelNormalActive: {
    color: "#7C3AED",
  },
});
