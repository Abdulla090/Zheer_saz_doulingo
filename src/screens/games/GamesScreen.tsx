import { PressableScale } from "@/components/animations";
import {
  AiTeacherGameIcon,
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
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { crossShadow } from "@/utils/shadows";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = HomePalette;

type GameTile = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  kind?: PracticeGameKind;
  href?: "/roleplay" | "/ai-teacher";
  featured?: boolean;
  renderIcon: () => React.ReactNode;
};

/** Single hub list — no duplicate voice tiles (Speak Up covers mic practice). */
const GAME_TILES: GameTile[] = [
  {
    id: "roleplay",
    title: "AI Role Play",
    subtitle: "Live conversations in real-world scenes",
    badge: "NEW",
    href: "/roleplay",
    featured: true,
    renderIcon: () => <RolePlayGameIcon size={56} />,
  },
  {
    id: "order",
    title: "Order Words",
    subtitle: "Build sentences in the right order",
    kind: "sentence_builder",
    renderIcon: () => <OrderWordsGameIcon size={52} />,
  },
  {
    id: "pair",
    title: "Pair Words",
    subtitle: "Match English with Kurdish",
    kind: "pair_match",
    renderIcon: () => <PairWordsGameIcon size={52} />,
  },
  {
    id: "speak",
    title: "Speak Up",
    subtitle: "Mic practice — say the phrase out loud",
    kind: "voice_speak",
    renderIcon: () => <SpeakUpGameIcon size={52} />,
  },
  {
    id: "ai-teacher",
    title: "AI Teacher",
    subtitle: "IELTS-style writing & speaking feedback",
    href: "/ai-teacher",
    renderIcon: () => <AiTeacherGameIcon size={52} />,
  },
];

function GameHubCard({
  tile,
  onPress,
  fullWidth,
}: {
  tile: GameTile;
  onPress: () => void;
  fullWidth: boolean;
}) {
  const content = (
    <View style={[styles.cardRow, tile.featured && styles.cardRowFeatured]}>
      <View style={styles.iconWrap}>{tile.renderIcon()}</View>
      <View style={styles.cardCopy}>
        <View style={styles.titleRow}>
          <Text style={[styles.gameTitle, tile.featured && styles.gameTitleFeatured]} numberOfLines={1}>
            {tile.title}
          </Text>
          {tile.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{tile.badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.gameSub} numberOfLines={2}>
          {tile.subtitle}
        </Text>
      </View>
      <ChevronRight size={20} color={tile.featured ? C.blue : C.grayLight} strokeWidth={2.5} />
    </View>
  );

  if (tile.featured) {
    return (
      <PressableScale onPress={onPress} scaleDown={0.99} style={{ width: fullWidth }}>
        <HomeLiquidCard
          interactive
          style={[
            styles.featuredCard,
            crossShadow({
              color: C.blue,
              offsetY: 12,
              blur: 28,
              opacity: 0.12,
              elevation: 8,
            }),
          ]}
          contentStyle={styles.featuredInner}
        >
          {content}
        </HomeLiquidCard>
      </PressableScale>
    );
  }

  return (
    <PressableScale onPress={onPress} scaleDown={0.98} style={{ width: fullWidth }}>
      <HomeLiquidCard interactive contentStyle={styles.cardInner}>
        {content}
      </HomeLiquidCard>
    </PressableScale>
  );
}

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const horizontalPad = 20;
  const cardWidth = width - horizontalPad * 2;

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
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: horizontalPad,
        }}
      >
        <Text style={styles.pageTitle}>Games</Text>
        <Text style={styles.pageSub}>Premium practice modes</Text>

        <View style={styles.list}>
          {GAME_TILES.map((tile) => (
            <GameHubCard
              key={tile.id}
              tile={tile}
              fullWidth={cardWidth}
              onPress={() => openTile(tile)}
            />
          ))}
        </View>
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
    marginBottom: 4,
  },
  pageSub: {
    ...HomeType.caption,
    color: C.grayLight,
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  featuredCard: {
    borderWidth: 1.5,
    borderColor: "rgba(43,89,243,0.22)",
  },
  featuredInner: {
    padding: 18,
  },
  cardInner: {
    padding: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  cardRowFeatured: {
    gap: 16,
  },
  iconWrap: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  gameTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.2,
  },
  gameTitleFeatured: {
    fontSize: 19,
    color: C.blue,
  },
  gameSub: {
    ...HomeType.caption,
    color: C.gray,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: C.blue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.6,
    fontFamily: "DINNextRoundedBold",
  },
});
