import { HomeLiquidCard, HomePalette } from "@/components/ui/ios-liquid-home";
import { Motion } from "@/screens/lesson/games/game-design";
import { crossShadow } from "@/utils/shadows";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const C = HomePalette;

export function OnboardingPathPicker({
  selected,
  onSelect,
  streetTitle,
  streetSub,
  normalTitle,
  normalSub,
}: {
  selected: "street" | "normal";
  onSelect: (mode: "street" | "normal") => void;
  streetTitle: string;
  streetSub: string;
  normalTitle: string;
  normalSub: string;
}) {
  return (
    <View style={styles.row}>
      <PathCard
        title={streetTitle}
        subtitle={streetSub}
        accent={C.blue}
        selected={selected === "street"}
        onPress={() => onSelect("street")}
      />
      <PathCard
        title={normalTitle}
        subtitle={normalSub}
        accent="#58CC02"
        selected={selected === "normal"}
        onPress={() => onSelect("normal")}
      />
    </View>
  );
}

function PathCard({
  title,
  subtitle,
  accent,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  accent: string;
  selected: boolean;
  onPress: () => void;
}) {
  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(selected ? 1 : 0.98, Motion.soft) }],
    borderWidth: withSpring(selected ? 2.5 : 1, Motion.soft),
  }));

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== "web") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      style={styles.cardPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Animated.View
        style={[
          styles.cardOuter,
          ring,
          { borderColor: selected ? accent : C.divider },
          selected &&
            crossShadow({
              color: accent,
              offsetY: 8,
              blur: 20,
              opacity: 0.2,
              elevation: 6,
            }),
        ]}
      >
        <HomeLiquidCard contentStyle={styles.cardInner} radius={20} interactive>
          <View style={[styles.accentBar, { backgroundColor: accent }]} />
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{subtitle}</Text>
        </HomeLiquidCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cardPress: {
    flex: 1,
  },
  cardOuter: {
    borderRadius: 22,
    borderColor: C.divider,
    backgroundColor: "transparent",
  },
  cardInner: {
    padding: 16,
    minHeight: 108,
    gap: 6,
  },
  accentBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 12,
    lineHeight: 16,
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
});
