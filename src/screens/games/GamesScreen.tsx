import { LiquidGlassSurface } from "../../components/LiquidGlassSurface";
import { tabBarScrollPadding } from "../../constants/layout";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import {
  buildPracticeLessonParams,
  type PracticeGameKind,
} from "../../data/game-practice";
import { useI18n } from "../../hooks/useI18n";
import type { I18nKey } from "../../i18n";
import { useProgressStore, useCurrentProgress } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { PATH_LIST_REMOVE_CLIPPED } from "../../utils/native-perf";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import {
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { ChatBotIcon, Chat01Icon, BookOpen02Icon, HeadphonesIcon, Mic01Icon, RobotIcon } from "@hugeicons/core-free-icons/dist/cjs/index.js";

const Theme = {
  background: C.meshBottom,
  surface: "rgba(255,255,255,0.86)",
  text: C.navy,
  textSec: C.gray,
  divider: "rgba(26,43,72,0.08)",
  accent: C.blue,
};

type HubTile = {
  id: string;
  titleKey: I18nKey;
  subtitleKey: I18nKey;
  badgeKey?: I18nKey;
  kind?: PracticeGameKind;
  href?: "/roleplay" | "/ai-teacher" | "/voice-tutor" | "/slang" | "/podcast";
  icon: any;
};

function StatusPill({
  label,
  inverted = false,
}: {
  label: string;
  inverted?: boolean;
}) {
  return (
    <View style={[styles.pill, inverted && styles.pillInverted]}>
      <Text style={[styles.pillText, inverted && styles.pillTextInverted]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const HubRow = memo(function HubRow({
  title,
  subtitle,
  icon,
  onPress,
  isLast,
}: {
  title: string;
  subtitle?: string;
  icon: any;
  onPress: () => void;
  isLast?: boolean;
}) {
  const { isKu } = useI18n();
  const scale = useSharedValue(1);
  const iconTranslateX = useSharedValue(0);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: iconTranslateX.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 90 });
    iconTranslateX.value = withTiming(isKu ? -4 : 4, { duration: 90 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 220 });
    iconTranslateX.value = withSpring(0, { damping: 12, stiffness: 180 });
  };

  return (
    <Animated.View style={rowStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress();
        }}
        style={[
          styles.hubRow,
          !isLast && styles.hubRowBorder,
          { flexDirection: isKu ? "row-reverse" : "row" },
        ]}
      >
        <Animated.View style={iconStyle}>
          <HugeiconsIcon
            icon={icon}
            size={24}
            color={Theme.text}
            strokeWidth={2.2}
          />
        </Animated.View>
        <View style={styles.hubRowCopy}>
          <AppText
            style={[styles.hubRowTitle, { textAlign: isKu ? "right" : "left" }]}
            numberOfLines={1}
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText
              style={[styles.hubRowSub, { textAlign: isKu ? "right" : "left" }]}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <Text
          style={[styles.chevron, { transform: [{ scaleX: isKu ? -1 : 1 }] }]}
          accessibilityElementsHidden
        >
          ›
        </Text>
      </Pressable>
    </Animated.View>
  );
});

const ExperienceCard = memo(function ExperienceCard({
  title,
  subtitle,
  badge,
  icon,
  onPress,
  width,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  icon: any;
  onPress: () => void;
  width: number;
}) {
  const { isKu } = useI18n();
  const cardScale = useSharedValue(1);
  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);
  const iconTranslateY = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
      { translateY: iconTranslateY.value },
    ],
  }));

  const handlePressIn = () => {
    cardScale.value = withTiming(0.96, { duration: 90 });
    iconScale.value = withTiming(1.15, { duration: 90 });
    iconRotate.value = withTiming(isKu ? -6 : 6, { duration: 90 });
    iconTranslateY.value = withTiming(-4, { duration: 90 });
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 220 });
    iconScale.value = withSpring(1, { damping: 12, stiffness: 180 });
    iconRotate.value = withSpring(0, { damping: 12, stiffness: 180 });
    iconTranslateY.value = withSpring(0, { damping: 12, stiffness: 180 });
  };

  return (
    <Animated.View style={[cardStyle, { width }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress();
        }}
      >
        <LiquidGlassSurface
          borderRadius={24}
          style={styles.experienceCardShell}
          contentStyle={styles.experienceInner}
          edgeShading={false}
        >
          <View
            style={[
              styles.experienceTopRow,
              { flexDirection: isKu ? "row-reverse" : "row" },
            ]}
          >
            <Animated.View style={iconStyle}>
              <HugeiconsIcon
                icon={icon}
                size={32}
                color={Theme.text}
                strokeWidth={2.2}
              />
            </Animated.View>
            {badge ? <StatusPill label={badge} /> : null}
          </View>
          <View style={{ marginTop: 12 }}>
            <AppText
              style={[
                styles.experienceTitle,
                { textAlign: isKu ? "right" : "left" },
              ]}
              numberOfLines={1}
            >
              {title}
            </AppText>
            {subtitle ? (
              <AppText
                style={[
                  styles.experienceSub,
                  { textAlign: isKu ? "right" : "left" },
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </AppText>
            ) : null}
          </View>
        </LiquidGlassSurface>
      </Pressable>
    </Animated.View>
  );
});

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, isKu } = useI18n();
  const streetNext = useCurrentProgress().nextLessonPathIndex;
  const normalNext = useCurrentProgress().normalNextLessonPathIndex;
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
      icon: ChatBotIcon,
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
        icon: Chat01Icon,
      },
      {
        id: "slang",
        titleKey: "games.slangTitle",
        subtitleKey: "games.slangSub",
        badgeKey: "games.badgeNew",
        href: "/slang",
        icon: BookOpen02Icon,
      },
      {
        id: "podcast",
        titleKey: "games.podcastTitle",
        subtitleKey: "games.podcastSub",
        badgeKey: "games.badgeNew",
        href: "/podcast",
        icon: HeadphonesIcon,
      },
      {
        id: "ai-teacher",
        titleKey: "games.teacherTitle",
        subtitleKey: "games.teacherSub",
        href: "/ai-teacher",
        icon: RobotIcon,
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
        icon: Chat01Icon,
      },
      {
        id: "speak",
        titleKey: "games.speakTitle",
        subtitleKey: "games.speakSub",
        kind: "voice_speak",
        icon: Mic01Icon,
      },
      {
        id: "listen",
        titleKey: "games.listenTitle",
        subtitleKey: "games.listenSub",
        kind: "voice_listen",
        icon: HeadphonesIcon,
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

  // Reanimated Hooks for Immersive Hero Card
  const heroScale = useSharedValue(1);
  const heroIconScale = useSharedValue(1);
  const heroIconRotate = useSharedValue(0);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
  }));

  const heroIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: heroIconScale.value },
      { rotate: `${heroIconRotate.value}deg` },
    ],
  }));

  const handleHeroPressIn = () => {
    heroScale.value = withTiming(0.97, { duration: 90 });
    heroIconScale.value = withTiming(1.15, { duration: 90 });
    heroIconRotate.value = withTiming(isKu ? -8 : 8, { duration: 90 });
  };

  const handleHeroPressOut = () => {
    heroScale.value = withSpring(1, { damping: 15, stiffness: 220 });
    heroIconScale.value = withSpring(1, { damping: 12, stiffness: 180 });
    heroIconRotate.value = withSpring(0, { damping: 12, stiffness: 180 });
  };

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: tabBarScrollPadding(insets.bottom) + 24,
          paddingHorizontal: horizontalPad,
        }}
      >
        <View
          style={[
            styles.header,
            { alignItems: isKu ? "flex-end" : "flex-start" },
          ]}
        >
          <AppText
            style={[styles.pageTitle, { textAlign: isKu ? "right" : "left" }]}
          >
            {t("games.title")}
          </AppText>
          <View
            style={[
              styles.titleUnderline,
              { alignSelf: isKu ? "flex-end" : "flex-start" },
            ]}
          />
        </View>

        <AppText
          style={[styles.sectionLabel, { textAlign: isKu ? "right" : "left" }]}
        >
          {t("games.sectionImmersive")}
        </AppText>

        <Animated.View style={heroStyle}>
          <Pressable
            onPressIn={handleHeroPressIn}
            onPressOut={handleHeroPressOut}
            onPress={() => {
              if (Platform.OS !== "web") void Haptics.selectionAsync();
              openTile(immersiveTile);
            }}
          >
            <LiquidGlassSurface
              borderRadius={28}
              style={styles.heroShell}
              edgeShading={false}
            >
              <View
                style={[
                  styles.heroRow,
                  { flexDirection: isKu ? "row-reverse" : "row" },
                ]}
              >
                <View style={styles.heroCopy}>
                  <View
                    style={[
                      styles.heroTitleRow,
                      { flexDirection: isKu ? "row-reverse" : "row" },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.heroLabel,
                        { textAlign: isKu ? "right" : "left" },
                      ]}
                      numberOfLines={1}
                    >
                      {t(immersiveTile.titleKey)}
                    </AppText>
                    {immersiveTile.badgeKey ? (
                      <StatusPill label={t(immersiveTile.badgeKey)} inverted />
                    ) : null}
                  </View>
                  <AppText
                    style={[
                      styles.heroHint,
                      { textAlign: isKu ? "right" : "left" },
                    ]}
                    numberOfLines={2}
                  >
                    {t(immersiveTile.subtitleKey)}
                  </AppText>
                </View>
                <Animated.View style={heroIconStyle}>
                  <HugeiconsIcon
                    icon={immersiveTile.icon}
                    size={48}
                    color={Theme.text}
                    strokeWidth={2.0}
                  />
                </Animated.View>
              </View>
            </LiquidGlassSurface>
          </Pressable>
        </Animated.View>

        <AppText
          style={[styles.sectionLabel, { textAlign: isKu ? "right" : "left" }]}
        >
          {t("games.sectionExperiences")}
        </AppText>
        <View
          style={[
            styles.experienceGrid,
            {
              gap,
              marginBottom: 8,
              flexDirection: isKu ? "row-reverse" : "row",
            },
          ]}
        >
          {experienceTiles.map((tile) => (
            <ExperienceCard
              key={tile.id}
              width={halfWidth}
              title={t(tile.titleKey)}
              subtitle={undefined}
              badge={tile.badgeKey ? t(tile.badgeKey) : undefined}
              icon={tile.icon}
              onPress={() => openTile(tile)}
            />
          ))}
        </View>

        <AppText
          style={[styles.sectionLabel, { textAlign: isKu ? "right" : "left" }]}
        >
          {t("games.sectionDrills")}
        </AppText>
        <LiquidGlassSurface
          borderRadius={28}
          contentStyle={styles.drillsCard}
          edgeShading={false}
        >
          {drillTiles.map((tile, index) => (
            <HubRow
              key={tile.id}
              title={t(tile.titleKey)}
              subtitle={undefined}
              icon={tile.icon}
              onPress={() => openTile(tile)}
              isLast={index === drillTiles.length - 1}
            />
          ))}
        </LiquidGlassSurface>
      </ScrollView>
      <BottomScrollFade />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  header: {
    marginBottom: 18,
    gap: 8,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: Theme.text,
    letterSpacing: -1,
  },
  titleUnderline: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: C.coral,
  },
  pageSubtitle: {
    display: "none",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: Theme.textSec,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 26,
    marginBottom: 12,
  },
  heroShell: {
    minHeight: 132,
    borderWidth: 1,
    borderColor: "rgba(26,43,72,0.08)",
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 22,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 16,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  heroLabel: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: Theme.text,
    letterSpacing: -0.4,
  },
  heroHint: {
    fontSize: 14,
    fontWeight: "500",
    color: Theme.textSec,
    lineHeight: 20,
  },
  experienceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  experienceCardShell: {
    borderWidth: 1,
    borderColor: "rgba(26,43,72,0.08)",
  },
  experienceInner: {
    padding: 16,
    minHeight: 112,
    justifyContent: "space-between",
  },
  experienceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.text,
    letterSpacing: -0.3,
  },
  experienceSub: {
    fontSize: 12,
    color: Theme.textSec,
    marginTop: 4,
    fontWeight: "500",
    lineHeight: 16,
  },
  drillsCard: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  hubRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  hubRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.divider,
  },
  hubRowCopy: {
    flex: 1,
    minWidth: 0,
  },
  hubRowTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.text,
  },
  hubRowSub: {
    fontSize: 13,
    color: Theme.textSec,
    marginTop: 2,
    fontWeight: "500",
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    color: "rgba(26,43,72,0.35)",
    marginLeft: 4,
  },
  pill: {
    backgroundColor: "rgba(43,89,243,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillInverted: {
    backgroundColor: C.navy,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "800",
    color: C.blue,
    letterSpacing: 0.6,
  },
  pillTextInverted: {
    color: "#FFFFFF",
  },
});
