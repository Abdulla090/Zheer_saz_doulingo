import { PressableScale } from "@/components/animations";
import {
  AiTeacherGameIcon,
  OrderWordsGameIcon,
  PairWordsGameIcon,
  RolePlayGameIcon,
  SlangDictionaryGameIcon,
  SpeakUpGameIcon,
  VoiceTutorGameIcon,
} from "@/components/icons/GameHubIcons";
import {
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette as C,
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
import { Sparkles, ArrowRight } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GameTile = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  kind?: PracticeGameKind;
  href?: "/roleplay" | "/ai-teacher" | "/voice-tutor" | "/slang";
  featured?: boolean;
  renderIcon: (size?: number) => React.ReactNode;
  colorTheme?: string;
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
  const isFullWidth = tile.featured;

  if (isFullWidth) {
    return (
      <PressableScale onPress={onPress} scaleDown={0.98} style={{ width: cardWidth }}>
        <HomeLiquidCard
          interactive
          style={[
            styles.featuredCardShell,
            crossShadow({
              color: tile.colorTheme || C.blue,
              offsetY: 10,
              blur: 24,
              opacity: 0.15,
              elevation: 8,
            }),
          ]}
          contentStyle={[styles.featuredCardContent, { borderColor: tile.colorTheme ? `${tile.colorTheme}40` : "rgba(43,89,243,0.3)" }]}
        >
          <View style={styles.featuredIconArea}>
            <View style={[styles.featuredIconGlow, { backgroundColor: tile.colorTheme ? `${tile.colorTheme}15` : "rgba(43,89,243,0.15)" }]}>
              {tile.renderIcon(60)}
            </View>
          </View>
          <View style={styles.featuredCopyArea}>
            <View style={styles.titleRow}>
              <Text style={[styles.featuredTitle, { color: tile.colorTheme || C.blue }]} numberOfLines={1}>
                {tile.title}
              </Text>
              {tile.badge ? (
                <View style={[styles.badge, { backgroundColor: tile.colorTheme || C.blue }]}>
                  <Sparkles size={10} color="#FFFFFF" style={{ marginRight: 2 }} />
                  <Text style={styles.badgeText}>{tile.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.featuredSubtitle} numberOfLines={2}>
              {tile.subtitle}
            </Text>
            <View style={styles.featuredAction}>
              <Text style={[styles.featuredActionText, { color: tile.colorTheme || C.blue }]}>{tile.badge === "NEW" ? "Play Now" : "Continue"}</Text>
              <ArrowRight size={14} color={tile.colorTheme || C.blue} strokeWidth={2.5} />
            </View>
          </View>
        </HomeLiquidCard>
      </PressableScale>
    );
  }

  return (
    <PressableScale onPress={onPress} scaleDown={0.97} style={{ width: cardWidth }}>
      <HomeLiquidCard interactive style={styles.gridCardShell} contentStyle={styles.gridCardContent}>
        <View style={styles.gridIconWrap}>
          {tile.renderIcon(48)}
        </View>
        <Text style={styles.gridTitle} numberOfLines={1}>
          {tile.title}
        </Text>
        <Text style={styles.gridSubtitle} numberOfLines={2}>
          {tile.subtitle}
        </Text>
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
  
  const horizontalPad = 16;
  const gap = 12;
  const fullWidth = width - horizontalPad * 2;
  const halfWidth = (fullWidth - gap) / 2;

  const gameTiles = useMemo<GameTile[]>(
    () => [
      {
        id: "slang",
        title: t("games.slangTitle"),
        subtitle: t("games.slangSub"),
        badge: t("games.badgeNew"),
        href: "/slang",
        featured: true,
        colorTheme: "#8B5CF6", // Vibrant Purple
        renderIcon: (size) => <SlangDictionaryGameIcon size={size || 68} />,
      },
      {
        id: "voice-tutor",
        title: t("games.voiceTutorTitle"),
        subtitle: t("games.voiceTutorSub"),
        badge: t("games.badgeNew"),
        href: "/voice-tutor",
        featured: true,
        colorTheme: "#2B59F3", // Brand Blue
        renderIcon: (size) => <VoiceTutorGameIcon size={size || 68} />,
      },
      {
        id: "roleplay",
        title: t("games.rolePlayTitle"),
        subtitle: t("games.rolePlaySub"),
        badge: t("games.badgeHot"),
        href: "/roleplay",
        featured: true,
        colorTheme: "#F59E0B", // Amber/Gold
        renderIcon: (size) => <RolePlayGameIcon size={size || 68} />,
      },
      {
        id: "conversation",
        title: t("games.conversationTitle"),
        subtitle: t("games.conversationSub"),
        kind: "conversation_pick",
        renderIcon: (size) => <RolePlayGameIcon size={size || 52} />,
      },
      {
        id: "speak",
        title: t("games.speakTitle"),
        subtitle: t("games.speakSub"),
        kind: "voice_speak",
        renderIcon: (size) => <SpeakUpGameIcon size={size || 52} />,
      },
      {
        id: "listen",
        title: t("games.listenTitle"),
        subtitle: t("games.listenSub"),
        kind: "voice_listen",
        renderIcon: (size) => <SpeakUpGameIcon size={size || 52} />,
      },
      {
        id: "ai-teacher",
        title: t("games.teacherTitle"),
        subtitle: t("games.teacherSub"),
        href: "/ai-teacher",
        renderIcon: (size) => <AiTeacherGameIcon size={size || 52} />,
      },
      {
        id: "fill",
        title: t("games.fillTitle"),
        subtitle: t("games.fillSub"),
        kind: "fill_blank",
        renderIcon: (size) => <OrderWordsGameIcon size={size || 52} />,
      },
      {
        id: "order",
        title: t("games.orderTitle"),
        subtitle: t("games.orderSub"),
        kind: "sentence_builder",
        renderIcon: (size) => <OrderWordsGameIcon size={size || 52} />,
      },
      {
        id: "pair",
        title: t("games.pairTitle"),
        subtitle: t("games.pairSub"),
        kind: "pair_match",
        renderIcon: (size) => <PairWordsGameIcon size={size || 52} />,
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
        router.push(tile.href as any);
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
          paddingTop: insets.top + 16,
          paddingBottom: tabBarScrollPadding(insets.bottom) + 20,
          paddingHorizontal: horizontalPad,
        }}
      >
        <View style={styles.headerArea}>
          <Text style={styles.pageTitle}>{t("games.title")}</Text>
          <Text style={styles.pageSub}>{t("games.subtitle")}</Text>
        </View>

        <View style={[styles.masonryContainer, { gap }]}>
          {gameTiles.map((tile) => (
            <GameHubCard
              key={tile.id}
              tile={tile}
              cardWidth={tile.featured ? fullWidth : halfWidth}
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
  headerArea: {
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F1A30",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSub: {
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "500",
    lineHeight: 22,
  },
  masonryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  
  // Featured (Full Width) Card Styles
  featuredCardShell: {
    borderRadius: 20,
  },
  featuredCardContent: {
    flexDirection: "row",
    padding: 18,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1.5,
    borderRadius: 20,
  },
  featuredIconArea: {
    marginRight: 16,
  },
  featuredIconGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredCopyArea: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 19,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  featuredSubtitle: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 10,
  },
  featuredAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featuredActionText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Grid (Half Width) Card Styles
  gridCardShell: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  gridCardContent: {
    padding: 16,
    alignItems: "center",
  },
  gridIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F1A30",
    textAlign: "center",
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
  },
});
