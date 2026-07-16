import { LiquidGlassSurface } from "./LiquidGlassSurface";
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
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  CSS_PRESS_MS,
  IOS_BUTTON_PRESS_OPACITY,
  IOS_BUTTON_PRESS_SCALE,
  IOS_BUTTON_PRESS_Y,
  IOS_BUTTON_RELEASE_SPRING,
} from "./animations/motion";

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
  pressScale = IOS_BUTTON_PRESS_SCALE,
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
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const pressIn = () => {
    if (reduceMotion) {
      opacity.value = IOS_BUTTON_PRESS_OPACITY;
      return;
    }
    scale.value = withTiming(pressScale, { duration: CSS_PRESS_MS });
    opacity.value = withTiming(IOS_BUTTON_PRESS_OPACITY, { duration: CSS_PRESS_MS });
    translateY.value = withTiming(IOS_BUTTON_PRESS_Y, { duration: CSS_PRESS_MS });
  };

  const pressOut = () => {
    if (reduceMotion) {
      opacity.value = 1;
      return;
    }
    scale.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
    opacity.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
    translateY.value = withSpring(0, IOS_BUTTON_RELEASE_SPRING);
  };

  const body = glass ? (
    <LiquidGlassSurface borderRadius={glassRadius} style={style}>
      <Pressable
        {...rest}
        {...(disableSystemHighlight ? noSystemHighlightProps : undefined)}
        onLongPress={onLongPress}
        onPressIn={(e) => {
          pressIn();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          pressOut();
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
        pressIn();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressOut();
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
    <Animated.View
      style={[
        containerStyle,
        animStyle,
        { alignSelf: "stretch", borderCurve: "continuous" },
      ]}
    >
      {body}
    </Animated.View>
  );
}


