import React, { useCallback, useMemo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Ellipse } from "react-native-svg";
import { PATH_NODE_SIMPLE_SHINE } from "@/utils/native-perf";

export type SvgButtonVariant = keyof typeof SVG_BUTTON_COLOR_SETS;

export const SVG_BUTTON_COLOR_SETS = {
  green: { rim: "#58a700", face: "#58cc02" },
  purple: { rim: "#a568cc", face: "#ce82ff" },
  blue: { rim: "#2b70c9", face: "#1cb0f6" },
  mint: { rim: "#0B8A6C", face: "#08c296" },
  gray: { rim: "#8A8A8A", face: "#BDBDBD" },
  yellow: { rim: "#ff9600", face: "#ffc800" },
  gold: { rim: "#e5a000", face: "#ffc800" },
  orange: { rim: "#E65100", face: "#FF9800" },
  red: { rim: "#B71C1C", face: "#F44336" },
} as const;

type SvgButtonProps = {
  size?: number;
  onPress?: () => void;
  translateX?: number;
  variant?: SvgButtonVariant;
  icon?: React.ReactNode;
  isLocked?: boolean;
};

const BUTTON_CENTER_X = 50;
const FACE_BASE_CY = 40;
const RIM_CY = 53;
const FACE_PRESSED_CY = 52;
const RX = 50;
const RY = 50;
const SVG_VIEWBOX = "-10 -10 120 130";

export const SvgButton = React.memo(
  ({
    size = 70,
    onPress,
    translateX,
    variant = "green",
    icon,
    isLocked = false,
  }: SvgButtonProps) => {
    const colors = useMemo(() => SVG_BUTTON_COLOR_SETS[variant], [variant]);
    const offsetY = useSharedValue(0);

    const faceAnimStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: offsetY.value }],
    }));

    const handlePressIn = useCallback(() => {
      offsetY.value = withTiming(FACE_PRESSED_CY - FACE_BASE_CY, { duration: 100 });
    }, [offsetY]);

    const handlePressOut = useCallback(() => {
      offsetY.value = withTiming(0, { duration: 100 });
    }, [offsetY]);

    const shineOpacity = isLocked ? 0.12 : 0.22;

    return (
      <Pressable
        onPressIn={isLocked ? undefined : handlePressIn}
        onPressOut={isLocked ? undefined : handlePressOut}
        onPress={onPress}
        disabled={isLocked}
        style={{
          width: size,
          height: size,
          transform: [{ translateX: translateX || 0 }],
        }}
      >
        <View style={styles.stack}>
          <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX} pointerEvents="none">
            <Ellipse
              cx={BUTTON_CENTER_X}
              cy={RIM_CY}
              rx={RX}
              ry={RY}
              fill={colors.rim}
            />
          </Svg>

          <Animated.View style={[styles.faceLayer, faceAnimStyle]} pointerEvents="none">
            <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
              <Ellipse
                cx={BUTTON_CENTER_X}
                cy={FACE_BASE_CY}
                rx={RX}
                ry={RY}
                fill={colors.face}
              />
              {!PATH_NODE_SIMPLE_SHINE ? (
                <>
                  <Ellipse
                    cx={BUTTON_CENTER_X - 8}
                    cy={FACE_BASE_CY - 12}
                    rx={RX * 0.55}
                    ry={RY * 0.35}
                    fill="rgba(255,255,255,0.28)"
                  />
                  <Ellipse
                    cx={BUTTON_CENTER_X}
                    cy={FACE_BASE_CY}
                    rx={RX}
                    ry={RY}
                    fill="rgba(255,255,255,0.12)"
                  />
                </>
              ) : (
                <Ellipse
                  cx={BUTTON_CENTER_X}
                  cy={FACE_BASE_CY - 8}
                  rx={RX * 0.7}
                  ry={RY * 0.4}
                  fill={`rgba(255,255,255,${shineOpacity})`}
                />
              )}
            </Svg>
          </Animated.View>

          {icon ? (
            <Animated.View
              style={[styles.iconLayer, faceAnimStyle]}
              pointerEvents="none"
            >
              {icon}
            </Animated.View>
          ) : null}
        </View>
      </Pressable>
    );
  },
);

SvgButton.displayName = "SvgButton";

const styles = StyleSheet.create({
  stack: {
    width: "100%",
    height: "100%",
  },
  faceLayer: {
    ...StyleSheet.absoluteFill,
  },
  iconLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Platform.OS === "android" ? 4 : 2,
  },
});
