import { DolphinFlat } from "@/components/icons/HomeDashboardIcons";
import {
  ListenUpGameIcon,
  OrderWordsGameIcon,
  PairWordsGameIcon,
  RolePlayGameIcon,
  SpeakUpGameIcon,
} from "@/components/icons/GameHubIcons";
import {
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import {
  buildPracticeLessonParams,
  type PracticeGameKind,
} from "@/data/game-practice";
import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = HomePalette;

type GameTile = {
  id: string;
  title: string;
  stars: number;
  bestPercent: number;
  kind?: PracticeGameKind;
  href?: "/roleplay";
  renderIcon: () => React.ReactNode;
};

const PRACTICE_TILES: GameTile[] = [
  {
    id: "order",
    title: "Order Words",
    stars: 3,
    bestPercent: 92,
    kind: "sentence_builder",
    renderIcon: () => <OrderWordsGameIcon size={52} />,
  },
  {
    id: "pair",
    title: "Pair Words",
    stars: 2,
    bestPercent: 88,
    kind: "pair_match",
    renderIcon: () => <PairWordsGameIcon size={52} />,
  },
  {
    id: "listen",
    title: "Listen Up",
    stars: 2,
    bestPercent: 76,
    kind: "voice_listen",
    renderIcon: () => <ListenUpGameIcon size={52} />,
  },
  {
    id: "speak",
    title: "Speak Up",
    stars: 1,
    bestPercent: 64,
    kind: "voice_speak",
    renderIcon: () => <SpeakUpGameIcon size={52} />,
  },
];

const AI_TILES: GameTile[] = [
  {
    id: "roleplay",
    title: "AI Role Play",
    stars: 0,
    bestPercent: 0,
    href: "/roleplay",
    renderIcon: () => <RolePlayGameIcon size={52} />,
  },
];

function StarRow({ filled }: { filled: number }) {
  return (
    <View style={styles.starsRow}>
      {[0, 1, 2].map((i) => (
        <Text key={i} style={[styles.star, i >= filled && styles.starMuted]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function GameCard({
  tile,
  width,
  onPress,
}: {
  tile: GameTile;
  width: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ width }, anim]}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 18, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 260 });
        }}
        style={[
          styles.gameCard,
          crossShadow({
            color: "#1A2B48",
            offsetY: 8,
            blur: 20,
            opacity: 0.06,
            elevation: 4,
          }),
        ]}
      >
        {tile.renderIcon()}
        <View style={styles.gameCardText}>
          <Text style={styles.gameTitle} numberOfLines={1}>
            {tile.title}
          </Text>
          {tile.stars > 0 ? <StarRow filled={tile.stars} /> : null}
          {tile.bestPercent > 0 ? (
            <Text style={styles.gameBest}>Best: {tile.bestPercent}%</Text>
          ) : (
            <Text style={styles.gameBest}>Practice with AI</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const horizontalPad = 20;
  const gap = 12;
  const cardWidth = (width - horizontalPad * 2 - gap) / 2;

  const openPractice = useCallback(
    (kind: PracticeGameKind) => {
      router.push(buildPracticeLessonParams(kind));
    },
    [router],
  );

  const openTile = useCallback(
    (tile: GameTile) => {
      if (tile.href) {
        router.push(tile.href);
        return;
      }
      if (tile.kind) openPractice(tile.kind);
    },
    [openPractice, router],
  );

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: horizontalPad,
        }}
      >
        <Text style={styles.pageTitle}>Games</Text>

        <Text style={styles.sectionTitle}>Play & learn</Text>
        <View style={styles.grid}>
          {PRACTICE_TILES.map((tile) => (
            <GameCard
              key={tile.id}
              tile={tile}
              width={cardWidth}
              onPress={() => openTile(tile)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>AI experiences</Text>
        {AI_TILES.map((tile) => (
          <GameCard
            key={tile.id}
            tile={tile}
            width={width - horizontalPad * 2}
            onPress={() => openTile(tile)}
          />
        ))}

        <HomeLiquidCard
          style={styles.encourageCard}
          contentStyle={styles.encourageInner}
        >
          <DolphinFlat width={64} height={64} />
          <View style={styles.encourageBubble}>
            <Text style={styles.encourageText}>
              Practice games make perfect! Keep going! 💙
            </Text>
          </View>
        </HomeLiquidCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.meshBottom,
  },
  pageTitle: {
    ...HomeType.heading,
    fontSize: 22,
    color: C.navy,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    ...HomeType.section,
    color: C.navy,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  gameCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: C.divider,
    minHeight: 88,
  },
  gameCardText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.2,
  },
  starsRow: {
    flexDirection: "row",
    gap: 1,
    marginTop: 2,
  },
  star: {
    fontSize: 14,
    color: C.gold,
  },
  starMuted: {
    color: "#E5E7EB",
  },
  gameBest: {
    ...HomeType.caption,
    color: C.grayLight,
    marginTop: 2,
  },
  encourageCard: {
    marginTop: 8,
  },
  encourageInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  encourageBubble: {
    flex: 1,
    backgroundColor: "#E8F2FF",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  encourageText: {
    ...HomeType.body,
    color: C.navy,
    fontWeight: "600",
  },
});
