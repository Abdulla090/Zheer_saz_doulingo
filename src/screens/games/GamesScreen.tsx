import {
  AiTeacherGameIcon,
  OrderWordsGameIcon,
  PairWordsGameIcon,
  PodcastGameIcon,
  RolePlayGameIcon,
  SlangDictionaryGameIcon,
  SpeakUpGameIcon,
  VoiceTutorGameIcon,
} from "@/components/icons/GameHubIcons";
import {
  HomeLiquidCard,
  HomeLiquidLessonTile,
  HomeMeshBackground,
  HomePalette as C,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { tabBarScrollPadding } from "@/constants/layout";
import {
  buildPracticeLessonParams,
  type PracticeGameKind,
} from "@/data/game-practice";
import { useI18n } from "@/hooks/useI18n";
import type { I18nKey } from "@/i18n";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { hapticSelection } from "@/utils/haptics";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HubTile = {
  id: string;
  titleKey: I18nKey;
  subtitleKey: I18nKey;
  badgeKey?: I18nKey;
  kind?: PracticeGameKind;
  href?: "/roleplay" | "/ai-teacher" | "/voice-tutor" | "/slang" | "/podcast";
  renderIcon: (size: number) => React.ReactNode;
};

function StatusPill({
  label,
  onDark = false,
}: {
  label: string;
  onDark?: boolean;
}) {
  return (
    <View style={[styles.pill, onDark && styles.pillOnDark]}>
      <Text style={[styles.pillText, onDark && styles.pillTextOnDark]}>
        {label}
      </Text>
    </View>
  );
}

const HubRow = memo(function HubRow({
  title,
  subtitle,
  badge,
  renderIcon,
  onPress,
  isLast,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  renderIcon: (size: number) => React.ReactNode;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      style={[styles.hubRow, !isLast && styles.hubRowBorder]}
      accessibilityRole="button"
    >
      <View style={styles.hubRowIcon}>{renderIcon(44)}</View>
      <View style={styles.hubRowCopy}>
        <View style={styles.hubRowTitleLine}>
          <Text style={styles.hubRowTitle} numberOfLines={1}>
            {title}
          </Text>
          {badge ? <StatusPill label={badge} /> : null}
        </View>
        <Text style={styles.hubRowSub} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <Text style={styles.chevron} accessibilityElementsHidden>
        ›
      </Text>
    </Pressable>
  );
});

const ExperienceCard = memo(function ExperienceCard({
  title,
  subtitle,
  badge,
  renderIcon,
  onPress,
  width,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  renderIcon: (size: number) => React.ReactNode;
  onPress: () => void;
  width: number;
}) {
  return (
    <Pressable
      onPress={() => {
        hapticSelection();
        onPress();
      }}
      style={{ width }}
      accessibilityRole="button"
    >
      <HomeLiquidCard interactive contentStyle={styles.experienceInner}>
        {renderIcon(48)}
        <View style={styles.experienceCopy}>
          <View style={styles.hubRowTitleLine}>
            <Text style={styles.experienceTitle} numberOfLines={2}>
              {title}
            </Text>
            {badge ? <StatusPill label={badge} /> : null}
          </View>
          <Text style={styles.experienceSub} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </HomeLiquidCard>
    </Pressable>
  );
});

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
  const gap = 12;
  const contentWidth = width - horizontalPad * 2;
  const halfWidth = (contentWidth - gap) / 2;

  const immersiveTile = useMemo<HubTile>(
    () => ({
      id: "voice-tutor",
      titleKey: "games.voiceTutorTitle",
      subtitleKey: "games.voiceTutorSub",
      badgeKey: "games.badgeNew",
      href: "/voice-tutor",
      renderIcon: (size) => <VoiceTutorGameIcon size={size} />,
    }),
    [],
  );

  const experienceTiles = useMemo<HubTile[]>(
    () => [
      {
        id: "roleplay",
        titleKey: "games.rolePlayTitle",
        subtitleKey: "games.rolePlaySub",
        badgeKey: "games.badgeHot",
        href: "/roleplay",
        renderIcon: (size) => <RolePlayGameIcon size={size} />,
      },
      {
        id: "slang",
        titleKey: "games.slangTitle",
        subtitleKey: "games.slangSub",
        badgeKey: "games.badgeNew",
        href: "/slang",
        renderIcon: (size) => <SlangDictionaryGameIcon size={size} />,
      },
      {
        id: "podcast",
        titleKey: "games.podcastTitle",
        subtitleKey: "games.podcastSub",
        badgeKey: "games.badgeNew",
        href: "/podcast",
        renderIcon: (size) => <PodcastGameIcon size={size} />,
      },
      {
        id: "ai-teacher",
        titleKey: "games.teacherTitle",
        subtitleKey: "games.teacherSub",
        href: "/ai-teacher",
        renderIcon: (size) => <AiTeacherGameIcon size={size} />,
      },
    ],
    [],
  );

  const drillTiles = useMemo<HubTile[]>(
    () => [
      {
        id: "conversation",
        titleKey: "games.conversationTitle",
        subtitleKey: "games.conversationSub",
        kind: "conversation_pick",
        renderIcon: (size) => <RolePlayGameIcon size={size} />,
      },
      {
        id: "speak",
        titleKey: "games.speakTitle",
        subtitleKey: "games.speakSub",
        kind: "voice_speak",
        renderIcon: (size) => <SpeakUpGameIcon size={size} />,
      },
      {
        id: "listen",
        titleKey: "games.listenTitle",
        subtitleKey: "games.listenSub",
        kind: "voice_listen",
        renderIcon: (size) => <SpeakUpGameIcon size={size} />,
      },
      {
        id: "fill",
        titleKey: "games.fillTitle",
        subtitleKey: "games.fillSub",
        kind: "fill_blank",
        renderIcon: (size) => <OrderWordsGameIcon size={size} />,
      },
      {
        id: "order",
        titleKey: "games.orderTitle",
        subtitleKey: "games.orderSub",
        kind: "sentence_builder",
        renderIcon: (size) => <OrderWordsGameIcon size={size} />,
      },
      {
        id: "pair",
        titleKey: "games.pairTitle",
        subtitleKey: "games.pairSub",
        kind: "pair_match",
        renderIcon: (size) => <PairWordsGameIcon size={size} />,
      },
    ],
    [],
  );

  const openPractice = useCallback(
    (kind: PracticeGameKind) => {
      const pi = pathMode === "normal" ? normalNext : streetNext;
      router.push(buildPracticeLessonParams(kind, { pi, mode: pathMode }));
    },
    [router, pathMode, normalNext, streetNext],
  );

  const openTile = useCallback(
    (tile: HubTile) => {
      recordGamePlayed(t(tile.titleKey), tile.id);
      if (tile.href) {
        router.push(tile.href as any);
        return;
      }
      if (tile.kind) openPractice(tile.kind);
    },
    [openPractice, recordGamePlayed, router, t],
  );

  const heroTitle = t(immersiveTile.titleKey);
  const heroSub = t(immersiveTile.subtitleKey);

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: tabBarScrollPadding(insets.bottom) + 16,
          paddingHorizontal: horizontalPad,
        }}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>PINGO</Text>
          <Text style={styles.pageTitle}>{t("games.title")}</Text>
          <Text style={styles.pageSub}>{t("games.subtitle")}</Text>
        </View>

        <Text style={styles.sectionLabel}>{t("games.sectionImmersive")}</Text>
        <HomeLiquidLessonTile
          onPress={() => openTile(immersiveTile)}
          style={styles.sectionBlock}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <View style={styles.heroTitleRow}>
                <Text style={styles.heroLabel} numberOfLines={1}>
                  {heroTitle}
                </Text>
                {immersiveTile.badgeKey ? (
                  <StatusPill label={t(immersiveTile.badgeKey)} onDark />
                ) : null}
              </View>
              <Text style={styles.heroSub} numberOfLines={2}>
                {heroSub}
              </Text>
              <Text style={styles.heroHint}>{t("home.tapToContinue")}</Text>
            </View>
            <View style={styles.heroIcon}>{immersiveTile.renderIcon(72)}</View>
          </View>
        </HomeLiquidLessonTile>

        <Text style={styles.sectionLabel}>{t("games.sectionExperiences")}</Text>
        <View style={[styles.experienceGrid, { gap, marginBottom: 8 }]}>
          {experienceTiles.map((tile) => (
            <ExperienceCard
              key={tile.id}
              width={halfWidth}
              title={t(tile.titleKey)}
              subtitle={t(tile.subtitleKey)}
              badge={tile.badgeKey ? t(tile.badgeKey) : undefined}
              renderIcon={tile.renderIcon}
              onPress={() => openTile(tile)}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t("games.sectionDrills")}</Text>
        <HomeLiquidCard contentStyle={styles.drillsCard}>
          {drillTiles.map((tile, index) => (
            <HubRow
              key={tile.id}
              title={t(tile.titleKey)}
              subtitle={t(tile.subtitleKey)}
              renderIcon={tile.renderIcon}
              onPress={() => openTile(tile)}
              isLast={index === drillTiles.length - 1}
            />
          ))}
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
  header: {
    marginBottom: 8,
  },
  logo: {
    ...HomeType.logo,
    fontSize: 26,
    color: C.blue,
    marginBottom: 4,
  },
  pageTitle: {
    ...HomeType.heading,
    color: C.navy,
    marginBottom: 4,
  },
  pageSub: {
    ...HomeType.body,
    color: C.gray,
  },
  sectionLabel: {
    ...HomeType.section,
    color: C.navy,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionBlock: {
    marginTop: 0,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  heroLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.88)",
    lineHeight: 20,
    fontFamily: "DINNextRoundedMedium",
  },
  heroHint: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.72)",
    marginTop: 10,
    fontFamily: "DINNextRoundedMedium",
  },
  heroIcon: {
    flexShrink: 0,
  },
  experienceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  experienceInner: {
    padding: 14,
    minHeight: 148,
    justifyContent: "space-between",
  },
  experienceCopy: {
    marginTop: 12,
    flex: 1,
  },
  experienceTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.2,
  },
  experienceSub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: C.gray,
    lineHeight: 17,
    fontFamily: "DINNextRoundedMedium",
  },
  drillsCard: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  hubRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 12,
  },
  hubRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.divider,
  },
  hubRowIcon: {
    flexShrink: 0,
  },
  hubRowCopy: {
    flex: 1,
    minWidth: 0,
  },
  hubRowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hubRowTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  hubRowSub: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "500",
    color: C.gray,
    lineHeight: 18,
    fontFamily: "DINNextRoundedMedium",
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    color: C.grayLight,
    marginLeft: 4,
  },
  pill: {
    backgroundColor: "rgba(43, 89, 243, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "800",
    color: C.blue,
    letterSpacing: 0.5,
    fontFamily: "DINNextRoundedBold",
  },
  pillOnDark: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  pillTextOnDark: {
    color: "#FFFFFF",
  },
});
