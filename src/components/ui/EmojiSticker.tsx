import React, { useEffect } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AppText } from "./AppText";

type EmojiStickerProps = {
  emoji: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  animateOnMount?: boolean;
};

function getDeterministicRotation(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (hash % 10) - 5; // deterministic rotation between -5 and 5 degrees
}

export function EmojiSticker({
  emoji,
  size = 36,
  style,
  animateOnMount = true,
}: EmojiStickerProps) {
  const scale = useSharedValue(animateOnMount ? 0.3 : 1);
  const rotateDeg = getDeterministicRotation(emoji || "?");

  useEffect(() => {
    if (animateOnMount) {
      scale.value = 0.3;
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 140,
      });
    } else {
      scale.value = 1;
    }
  }, [emoji, animateOnMount]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotateDeg}deg` },
      ],
    };
  });

  const stickerPadding = Math.max(6, size * 0.18);
  const borderWidth = Math.max(3, size * 0.08);

  return (
    <Animated.View
      style={[
        styles.stickerContainer,
        {
          padding: stickerPadding,
          borderRadius: size * 1.5,
          borderWidth,
          shadowOffset: { width: 0, height: Math.max(3, size * 0.1) },
          shadowRadius: Math.max(4, size * 0.15),
          elevation: Math.max(3, size * 0.15),
        },
        animatedStyle,
        style,
      ]}
    >
      <AppText
        style={{
          fontSize: size,
          lineHeight: size * 1.15,
          textAlign: "center",
        }}
      >
        {emoji}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stickerContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A2B48",
    shadowOpacity: 0.16,
    borderStyle: "solid",
  },
});
