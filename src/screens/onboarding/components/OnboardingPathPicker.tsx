import { AppText } from "@/components/ui/AppText";
import { HomeLiquidCard, HomePalette } from "@/components/ui/ios-liquid-home";
import type { PathMode } from "@/screens/home/components/PathSwitcher";
import { Motion } from "@/screens/lesson/games/game-design";
import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const C = HomePalette;

const PATH_ACCENTS: Record<PathMode, string> = {
  street: C.blue,
  normal: "#58CC02",
  kids: C.orange,
};

export function OnboardingPathPicker({
  selected,
  onSelect,
  streetTitle,
  streetSub,
  normalTitle,
  normalSub,
  kidsTitle,
  kidsSub,
}: {
  selected: PathMode;
  onSelect: (mode: PathMode) => void;
  streetTitle: string;
  streetSub: string;
  normalTitle: string;
  normalSub: string;
  kidsTitle: string;
  kidsSub: string;
}) {
  const items: {
    mode: PathMode;
    title: string;
    subtitle: string;
  }[] = [
    { mode: "street", title: streetTitle, subtitle: streetSub },
    { mode: "normal", title: normalTitle, subtitle: normalSub },
    { mode: "kids", title: kidsTitle, subtitle: kidsSub },
  ];

  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {items.map((item) => (
        <PathCard
          key={item.mode}
          title={item.title}
          subtitle={item.subtitle}
          accent={PATH_ACCENTS[item.mode]}
          selected={selected === item.mode}
          onPress={() => onSelect(item.mode)}
        />
      ))}
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
    transform: [{ scale: withSpring(selected ? 1 : 0.985, Motion.soft) }],
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
              opacity: 0.22,
              elevation: 6,
            }),
        ]}
      >
        <HomeLiquidCard contentStyle={styles.cardInner} radius={20} interactive>
          <View style={styles.cardTop}>
            <View style={[styles.accentDot, { backgroundColor: accent }]} />
            {selected ? (
              <View style={[styles.check, { backgroundColor: accent }]}>
                <AppText style={styles.checkMark} forceLatinFont>
                  ✓
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText style={styles.cardTitle}>{title}</AppText>
          <AppText style={styles.cardSub}>{subtitle}</AppText>
        </HomeLiquidCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    marginTop: 18,
  },
  cardPress: {
    minHeight: 48,
  },
  cardOuter: {
    borderRadius: 22,
    borderColor: C.divider,
    backgroundColor: "transparent",
  },
  cardInner: {
    padding: 14,
    minHeight: 72,
    gap: 4,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  accentDot: {
    width: 28,
    height: 4,
    borderRadius: 2,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    lineHeight: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 18,
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
});
