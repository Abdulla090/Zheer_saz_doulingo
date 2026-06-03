import { PressableScale } from "@/components/animations";
import {
  AiTeacherGameIcon,
  OrderWordsGameIcon,
  PairWordsGameIcon,
  RolePlayGameIcon,
  SpeakUpGameIcon,
  VoiceTutorGameIcon,
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
import { useI18n } from "@/hooks/useI18n";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { tabBarScrollPadding } from "@/constants/layout";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { crossShadow } from "@/utils/shadows";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
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
  href?: "/roleplay" | "/ai-teacher" | "/voice-tutor";
  featured?: boolean;
  renderIcon: () => React.ReactNode;
};

function GameHubCard({
  tile,
  onPress,
  cardWidth,
}: {
  tile: GameTile;
  onPress: () => void;
  cardWidth: number;
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
      <PressableScale onPress={onPress} scaleDown={0.99} style={{ width: cardWidth }}>
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
    <PressableScale onPress={onPress} scaleDown={0.98} style={{ width: cardWidth }}>
      <HomeLiquidCard interactive contentStyle={styles.cardInner}>
        {content}
      </HomeLiquidCard>
    </PressableScale>
  );
}

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useI18n();
  const streetNext = useProgressStore((s) => s.nextLessonPathIndex);
  const normalNext = useProgressStore((s) => s.normalNextLessonPathIndex);
  const pathMode = useSettingsStore((s) => s.pathMode);
  const recordGamePlayed = useProgressStore((s) => s.recordGamePlayed);
  const { width } = useWindowDimensions();
  const horizontalPad = 20;
  const cardWidth = width - horizontalPad * 2;

  const gameTiles = useMemo<GameTile[]>(
    () => [
      {
        id: "voice-tutor",
        title: t("games.voiceTutorTitle"),
        subtitle: t("games.voiceTutorSub"),
        badge: t("games.badgeNew"),
        href: "/voice-tutor",
        featured: true,
        renderIcon: () => <VoiceTutorGameIcon size={68} />,
      },
      {
        id: "roleplay",
        title: t("games.rolePlayTitle"),
        subtitle: t("games.rolePlaySub"),
        badge: t("games.badgeNew"),
        href: "/roleplay",
        featured: true,
        renderIcon: () => <RolePlayGameIcon size={68} />,
      },
      {
        id: "conversation",
        title: t("games.conversationTitle"),
        subtitle: t("games.conversationSub"),
        kind: "conversation_pick",
        badge: t("games.badgeHot"),
        featured: true,
        renderIcon: () => <RolePlayGameIcon size={64} />, // Temporarily re-using icon, will update if needed
      },
      {
        id: "speak",
        title: t("games.speakTitle"),
        subtitle: t("games.speakSub"),
        kind: "voice_speak",
        renderIcon: () => <SpeakUpGameIcon size={64} />,
      },
      {
        id: "listen",
        title: t("games.listenTitle"),
        subtitle: t("games.listenSub"),
        kind: "voice_listen",
        renderIcon: () => <SpeakUpGameIcon size={64} />, // Reusing voice icon
      },
      {
        id: "ai-teacher",
        title: t("games.teacherTitle"),
        subtitle: t("games.teacherSub"),
        href: "/ai-teacher",
        renderIcon: () => <AiTeacherGameIcon size={64} />,
      },
      {
        id: "fill",
        title: t("games.fillTitle"),
        subtitle: t("games.fillSub"),
        kind: "fill_blank",
        renderIcon: () => <OrderWordsGameIcon size={64} />,
      },
      {
        id: "order",
        title: t("games.orderTitle"),
        subtitle: t("games.orderSub"),
        kind: "sentence_builder",
        renderIcon: () => <OrderWordsGameIcon size={64} />,
      },
      {
        id: "pair",
        title: t("games.pairTitle"),
        subtitle: t("games.pairSub"),
        kind: "pair_match",
        renderIcon: () => <PairWordsGameIcon size={64} />,
      },
    ],
    [t],
  );

  const openPractice = useCallback(
    (kind: PracticeGameKind) => {
      const pi = pathMode === "normal" ? normalNext : streetNext;
      router.push(buildPracticeLessonParams(kind, { pi, mode: pathMode }));
    },
    [router, pathMode, normalNext, streetNext],
  );

  const openTile = useCallback(
    (tile: GameTile) => {
      recordGamePlayed(tile.title, tile.id);
      if (tile.href) {
        router.push(tile.href);
        return;
      }
      if (tile.kind) openPractice(tile.kind);
    },
    [openPractice, recordGamePlayed, router],
  );

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: tabBarScrollPadding(insets.bottom),
          paddingHorizontal: horizontalPad,
        }}
      >
        <Text style={styles.pageTitle}>{t("games.title")}</Text>
        <Text style={styles.pageSub}>{t("games.subtitle")}</Text>

        <View style={styles.list}>
          {gameTiles.map((tile) => (
            <GameHubCard
              key={tile.id}
              tile={tile}
              cardWidth={cardWidth}
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
    width: 72,
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
