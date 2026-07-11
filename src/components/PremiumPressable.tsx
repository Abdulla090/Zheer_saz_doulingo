import { LiquidGlassSurface } from "./LiquidGlassSurface";
import { Motion } from "../screens/lesson/games/game-design";
import React from "react";
import {
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  /** 0.96 default — physical press without overshoot */
  pressScale?: number;
  /** iOS liquid glass shell with edge shading */
  glass?: boolean;
  glassRadius?: number;
  /** Removes Android ripple and web tap/drag/focus highlight chrome. */
  disableSystemHighlight?: boolean;
};

const transparentRipple = { color: "transparent", borderless: false };

const noSystemHighlightStyle =
  Platform.OS === "web"
    ? (({
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        outlineColor: "transparent",
        outlineStyle: "none",
        userSelect: "none",
      } as unknown) as ViewStyle)
    : undefined;

const noSystemHighlightProps =
  Platform.OS === "web"
    ? ({
        draggable: false,
        onContextMenu: (event: any) => {
          event.preventDefault();
        },
        onDragStart: (event: any) => {
          event.preventDefault();
        },
      } as any)
    : undefined;

/** Spring press feedback for custom controls (tabs, rows, chips). No haptic. */
export function PremiumPressable({
  children,
  style,
  containerStyle,
  pressScale = 0.96,
  glass = false,
  glassRadius = 14,
  disableSystemHighlight = true,
  onPressIn,
  onPressOut,
  onLongPress,
  android_ripple,
  ...rest
}: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const body = glass ? (
    <LiquidGlassSurface borderRadius={glassRadius} style={style}>
      <Pressable
        {...rest}
        {...(disableSystemHighlight ? noSystemHighlightProps : undefined)}
        onLongPress={onLongPress}
        onPressIn={(e) => {
          scale.value = withSpring(pressScale, Motion.soft);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, Motion.soft);
          onPressOut?.(e);
        }}
        android_ripple={
          disableSystemHighlight
            ? transparentRipple
            : android_ripple ?? { color: "rgba(148, 163, 184, 0.2)", borderless: false }
        }
        style={[
          { flex: 1, alignItems: "center", justifyContent: "center" },
          disableSystemHighlight && noSystemHighlightStyle,
        ]}
      >
        {children}
      </Pressable>
    </LiquidGlassSurface>
  ) : (
    <Pressable
      {...rest}
      {...(disableSystemHighlight ? noSystemHighlightProps : undefined)}
      onLongPress={onLongPress}
      onPressIn={(e) => {
        scale.value = withSpring(pressScale, Motion.soft);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, Motion.soft);
        onPressOut?.(e);
      }}
      android_ripple={
        disableSystemHighlight
          ? transparentRipple
          : android_ripple ?? { color: "rgba(43, 89, 243, 0.12)", borderless: false }
      }
      style={[style, disableSystemHighlight && noSystemHighlightStyle]}
    >
      {children}
    </Pressable>
  );

  return (
    <Animated.View style={[containerStyle, animStyle, { alignSelf: 'stretch' }]}>
      {body}
    </Animated.View>
  );
}


