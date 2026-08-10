import {
  BookOpen02Icon,
  CrownIcon,
  Trophy,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  LegendList,
  type LegendListRenderItemProps,
} from "@legendapp/list/react-native";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { tabBarScrollPadding } from "../../constants/layout";
import { getMascot } from "../../constants/mascots";
import { isDesktopWebWidth } from "../../constants/web-layout";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { supabase } from "../../lib/supabase";
import { useSettingsStore } from "../../stores/useSettingsStore";

type LeaderboardPeriod = "today" | "week" | "all";

export type LeaderboardEntry = {
  userId: string;
  rank: number;
  name: string;
  avatarUrl: string | null;
  selectedMascotId: string;
  periodXp: number;
  totalXp: number;
};

type LeaderboardRowData = {
  user_id: string;
  rank: number | string;
  display_name: string;
  avatar_url: string | null;
  selected_mascot_id: string;
  period_xp?: number;
  total_xp: number;
};

type PeriodOption = {
  id: LeaderboardPeriod;
  label: string;
};

const PHYSICAL_LTR_PROPS =
  Platform.OS === "web" ? ({ dir: "ltr" } as const) : {};

const keyExtractor = (item: LeaderboardEntry) => item.userId;

function formatXp(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.max(0, value));
}

function getClientTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Baghdad";
  } catch {
    return "Asia/Baghdad";
  }
}

function getDisplayName(
  item: LeaderboardEntry,
  currentUserId: string | undefined,
  localUserName: string,
) {
  return item.userId === currentUserId && localUserName
    ? localUserName
    : item.name;
}

type AvatarProps = {
  item: LeaderboardEntry;
  currentUserId?: string;
  localAvatarUrl: string;
  localMascotId: string;
  size: number;
  ringColor: string;
  backgroundColor: string;
};

function LeaderboardAvatar({
  item,
  currentUserId,
  localAvatarUrl,
  localMascotId,
  size,
  ringColor,
  backgroundColor,
}: AvatarProps) {
  const isMe = item.userId === currentUserId;
  const uploadedUrl = isMe && localAvatarUrl ? localAvatarUrl : item.avatarUrl;
  const imageStyle = { width: size, height: size, borderRadius: size / 2 };

  if (
    uploadedUrl &&
    /^(https?:|file:|content:|data:|blob:)/i.test(uploadedUrl) &&
    !/\.svg(?:[?#]|$)|\/premade\//i.test(uploadedUrl)
  ) {
    return (
      <View
        style={[
          staticStyles.avatar,
          imageStyle,
          { borderColor: ringColor, backgroundColor },
        ]}
      >
        <Image
          source={{ uri: uploadedUrl }}
          contentFit="cover"
          transition={160}
          cachePolicy="memory-disk"
          style={imageStyle}
        />
      </View>
    );
  }

  const mascot = getMascot(isMe ? localMascotId : item.selectedMascotId);
  return (
    <View
      style={[
        staticStyles.avatar,
        imageStyle,
        { borderColor: ringColor, backgroundColor },
      ]}
    >
      <Image
        source={mascot.source}
        contentFit="contain"
        style={{ width: size * 0.88, height: size * 0.88 }}
      />
    </View>
  );
}

type PodiumPersonProps = {
  item: LeaderboardEntry;
  place: 1 | 2 | 3;
  locale: string;
  currentUserId?: string;
  localAvatarUrl: string;
  localMascotId: string;
  localUserName: string;
  colors: any;
  styles: ReturnType<typeof createStyles>;
};

function PodiumPerson({
  item,
  place,
  locale,
  currentUserId,
  localAvatarUrl,
  localMascotId,
  localUserName,
  colors,
  styles,
}: PodiumPersonProps) {
  const isWinner = place === 1;
  const tone = place === 1 ? colors.warning : place === 2 ? "#AAB4C2" : "#B9835A";
  const avatarSize = isWinner ? 76 : 60;

  return (
    <View style={[styles.podiumPerson, isWinner && styles.winnerPerson]}>
      {isWinner ? (
        <View style={styles.crown}>
          <HugeiconsIcon
            icon={CrownIcon}
            size={27}
            color={colors.warning}
            strokeWidth={2.25}
          />
        </View>
      ) : null}

      <LeaderboardAvatar
        item={item}
        currentUserId={currentUserId}
        localAvatarUrl={localAvatarUrl}
        localMascotId={localMascotId}
        size={avatarSize}
        ringColor={tone}
        backgroundColor={colors.surfaceRaised}
      />

      <View style={[styles.placeBadge, { borderColor: tone }]}>
        <AppText
          forceLatinFont
          latinRole="bold"
          style={[styles.placeText, { color: tone }]}
        >
          {place}
        </AppText>
      </View>

      <AppText
        languageCode={locale}
        numberOfLines={1}
        align="center"
        latinRole="bold"
        style={[styles.podiumName, isWinner && styles.winnerName]}
      >
        {getDisplayName(item, currentUserId, localUserName)}
      </AppText>

      <View {...PHYSICAL_LTR_PROPS} style={styles.podiumXpLine}>
        <HugeiconsIcon
          icon={ZapIcon}
          size={isWinner ? 17 : 14}
          color={colors.warning}
          strokeWidth={2.8}
        />
        <AppText
          forceLatinFont
          latinRole="bold"
          style={[styles.podiumXp, isWinner && styles.winnerXp]}
        >
          {formatXp(item.periodXp)} XP
        </AppText>
      </View>
    </View>
  );
}

function LoadingSkeleton({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.skeletonWrap}>
      <View style={styles.skeletonSegment} />
      <View {...PHYSICAL_LTR_PROPS} style={styles.skeletonPodium}>
        <View style={styles.skeletonSide} />
        <View style={styles.skeletonWinner} />
        <View style={styles.skeletonSide} />
      </View>
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.skeletonRow} />
      ))}
    </View>
  );
}

export const LeaderboardScreen = () => {
  const { colors, isDark } = useThemeColors();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t, locale, isKu } = useI18n();
  const { user } = useAuth();
  const localAvatarUrl = useSettingsStore((state) => state.avatarUrl);
  const localMascotId = useSettingsStore((state) => state.selectedMascotId);
  const localUserName = useSettingsStore((state) => state.userName);
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodLoading, setPeriodLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const requestIdRef = useRef(0);
  const hasLoadedRef = useRef(false);
  const isDesktopWeb = Platform.OS === "web" && isDesktopWebWidth(width);
  const isRtl = isKu || locale === "ar";
  const screenStyles = useMemo(
    () => createStyles(colors, isDark, isDesktopWeb),
    [colors, isDark, isDesktopWeb],
  );

  const periodOptions = useMemo<PeriodOption[]>(() => {
    const options: Record<LeaderboardPeriod, PeriodOption> = {
      today: { id: "today", label: t("league.today") },
      week: { id: "week", label: t("league.thisWeek") },
      all: { id: "all", label: t("league.allTime") },
    };
    return isRtl
      ? [options.all, options.week, options.today]
      : [options.today, options.week, options.all];
  }, [isRtl, t]);

  const loadLeaderboard = useCallback(
    async (nextPeriod: LeaderboardPeriod, refresh = false) => {
      const requestId = ++requestIdRef.current;
      if (!user) {
        setEntries([]);
        setLoadFailed(false);
        setLoading(false);
        setPeriodLoading(false);
        setRefreshing(false);
        return;
      }

      if (refresh) setRefreshing(true);
      else if (hasLoadedRef.current) setPeriodLoading(true);

      const { data, error } = await supabase.rpc("get_leaderboard", {
        p_limit: 50,
        p_period: nextPeriod,
        p_timezone: getClientTimeZone(),
      });

      if (requestId !== requestIdRef.current) return;

      if (error) {
        console.error("Failed to load leaderboard:", error.message);
        setLoadFailed(true);
      } else {
        setEntries(
          ((data ?? []) as LeaderboardRowData[]).map((row) => ({
            userId: row.user_id,
            rank: Number(row.rank),
            name: row.display_name,
            avatarUrl: row.avatar_url,
            selectedMascotId: row.selected_mascot_id,
            periodXp: Number(row.period_xp ?? row.total_xp ?? 0),
            totalXp: Number(row.total_xp ?? 0),
          })),
        );
        setLoadFailed(false);
      }
      setLoading(false);
      setPeriodLoading(false);
      setRefreshing(false);
      hasLoadedRef.current = true;
    },
    [user],
  );

  useEffect(() => {
    void loadLeaderboard(period);
  }, [loadLeaderboard, period]);

  const onPeriodChange = useCallback(
    (nextPeriod: LeaderboardPeriod) => {
      if (nextPeriod === period) return;
      setPeriod(nextPeriod);
    },
    [period],
  );

  const onRefresh = useCallback(() => {
    void loadLeaderboard(period, true);
  }, [loadLeaderboard, period]);

  const podium = entries.slice(0, 3);
  const winner = podium.find((entry) => entry.rank === 1) ?? podium[0];
  const second = podium.find((entry) => entry.rank === 2);
  const third = podium.find((entry) => entry.rank === 3);
  const remainingEntries = entries.slice(3);
  const activePeriodLabel =
    periodOptions.find((option) => option.id === period)?.label ?? "";

  const renderListItem = useCallback(
    ({ item }: LegendListRenderItemProps<LeaderboardEntry>) => {
      const isMe = item.userId === user?.id;
      const level = Math.max(1, Math.floor(item.totalXp / 120) + 1);
      return (
        <View style={screenStyles.rowSlot}>
          <View
            {...PHYSICAL_LTR_PROPS}
            style={[
              screenStyles.rankingRow,
              isMe && screenStyles.currentUserRow,
            ]}
          >
            <View style={screenStyles.rowXpColumn}>
              <View style={screenStyles.rowMetric}>
                <HugeiconsIcon
                  icon={ZapIcon}
                  size={15}
                  color={colors.warning}
                  strokeWidth={2.8}
                />
                <AppText
                  forceLatinFont
                  latinRole="bold"
                  style={screenStyles.rowXp}
                >
                  {formatXp(item.periodXp)} XP
                </AppText>
              </View>
              <View style={screenStyles.rowMetric}>
                <HugeiconsIcon
                  icon={BookOpen02Icon}
                  size={13}
                  color={colors.mutedForeground}
                  strokeWidth={1.9}
                />
                <AppText languageCode={locale} style={screenStyles.rowLevel}>
                  {t("league.level")} {level}
                </AppText>
              </View>
            </View>

            <View style={screenStyles.rowIdentity}>
              <AppText
                languageCode={locale}
                numberOfLines={1}
                align="end"
                latinRole="bold"
                style={screenStyles.rowName}
              >
                {getDisplayName(item, user?.id, localUserName)}
              </AppText>
              <LeaderboardAvatar
                item={item}
                currentUserId={user?.id}
                localAvatarUrl={localAvatarUrl}
                localMascotId={localMascotId}
                size={44}
                ringColor={isMe ? colors.warning : colors.border}
                backgroundColor={colors.surfaceRaised}
              />
            </View>

            <AppText
              forceLatinFont
              latinRole="bold"
              style={screenStyles.rowRank}
            >
              {item.rank}
            </AppText>
          </View>
        </View>
      );
    },
    [
      colors.border,
      colors.mutedForeground,
      colors.surfaceRaised,
      colors.warning,
      localAvatarUrl,
      localMascotId,
      localUserName,
      locale,
      screenStyles,
      t,
      user?.id,
    ],
  );

  const listHeader = (
    <View style={screenStyles.listHeader}>
      <View {...PHYSICAL_LTR_PROPS} style={screenStyles.periodControl}>
        {periodOptions.map((option) => {
          const selected = option.id === period;
          return (
            <PressableScale
              key={option.id}
              onPress={() => onPeriodChange(option.id)}
              scaleDown={0.985}
              accessibilityRole="tab"
              accessibilityLabel={option.label}
              accessibilityState={{ selected, busy: selected && periodLoading }}
              style={[
                screenStyles.periodButton,
                selected && screenStyles.periodButtonSelected,
              ]}
            >
              <AppText
                languageCode={locale}
                align="center"
                latinRole={selected ? "bold" : "regular"}
                style={[
                  screenStyles.periodLabel,
                  selected && screenStyles.periodLabelSelected,
                ]}
              >
                {option.label}
              </AppText>
            </PressableScale>
          );
        })}
        {periodLoading ? (
          <ActivityIndicator
            size="small"
            color={colors.warning}
            style={screenStyles.periodSpinner}
          />
        ) : null}
      </View>

      {entries.length ? (
        <>
          <View style={screenStyles.podiumStage}>
            <View style={screenStyles.stageLine} />
            <View {...PHYSICAL_LTR_PROPS} style={screenStyles.podiumRow}>
              <View style={screenStyles.sideSlot}>
                {second ? (
                  <PodiumPerson
                    item={second}
                    place={2}
                    locale={locale}
                    currentUserId={user?.id}
                    localAvatarUrl={localAvatarUrl}
                    localMascotId={localMascotId}
                    localUserName={localUserName}
                    colors={colors}
                    styles={screenStyles}
                  />
                ) : null}
              </View>
              <View style={screenStyles.winnerSlot}>
                {winner ? (
                  <PodiumPerson
                    item={winner}
                    place={1}
                    locale={locale}
                    currentUserId={user?.id}
                    localAvatarUrl={localAvatarUrl}
                    localMascotId={localMascotId}
                    localUserName={localUserName}
                    colors={colors}
                    styles={screenStyles}
                  />
                ) : null}
              </View>
              <View style={screenStyles.sideSlot}>
                {third ? (
                  <PodiumPerson
                    item={third}
                    place={3}
                    locale={locale}
                    currentUserId={user?.id}
                    localAvatarUrl={localAvatarUrl}
                    localMascotId={localMascotId}
                    localUserName={localUserName}
                    colors={colors}
                    styles={screenStyles}
                  />
                ) : null}
              </View>
            </View>
          </View>

          {remainingEntries.length ? (
            <View {...PHYSICAL_LTR_PROPS} style={screenStyles.rankingHeading}>
              <AppText
                languageCode={locale}
                latinRole="bold"
                style={screenStyles.rankingTitle}
              >
                {t("league.ranking")}
              </AppText>
              <AppText languageCode={locale} style={screenStyles.rankingPeriod}>
                {activePeriodLabel}
              </AppText>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );

  const emptyTitle = loadFailed
    ? t("league.unavailable")
    : user
      ? period === "all"
        ? t("league.emptyTitle")
        : t("league.noPeriodActivity")
      : t("league.signInTitle");
  const emptyBody = loadFailed
    ? t("league.retryHint")
    : user
      ? period === "all"
        ? t("league.emptyBody")
        : t("league.noPeriodActivityHint")
      : t("league.signInBody");

  return (
    <View style={screenStyles.root}>
      <View
        style={[
          screenStyles.header,
          { paddingTop: Math.max(insets.top, 16) + 8 },
        ]}
      >
        <View {...PHYSICAL_LTR_PROPS} style={screenStyles.headerRow}>
          <View style={screenStyles.trophyTile}>
            <HugeiconsIcon
              icon={Trophy}
              size={27}
              color={colors.warning}
              strokeWidth={2.35}
            />
          </View>
          <View style={screenStyles.titleCopy}>
            <AppText
              languageCode={locale}
              align="end"
              latinRole="bold"
              style={screenStyles.title}
            >
              {t("league.title")}
            </AppText>
            <AppText
              languageCode={locale}
              align="end"
              style={screenStyles.subtitle}
            >
              {t("league.subtitle")}
            </AppText>
          </View>
        </View>
      </View>

      {loading ? (
        <LoadingSkeleton styles={screenStyles} />
      ) : (
        <LegendList
          data={remainingEntries}
          keyExtractor={keyExtractor}
          renderItem={renderListItem}
          recycleItems
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.warning}
              colors={[colors.warning]}
            />
          }
          contentContainerStyle={{
            paddingBottom: tabBarScrollPadding(insets.bottom) + 24,
          }}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            entries.length === 0 ? (
              <View style={screenStyles.emptyState}>
                <View style={screenStyles.emptyIcon}>
                  <HugeiconsIcon
                    icon={Trophy}
                    size={29}
                    color={colors.mutedForeground}
                    strokeWidth={1.9}
                  />
                </View>
                <AppText
                  languageCode={locale}
                  align="center"
                  latinRole="bold"
                  style={screenStyles.emptyTitle}
                >
                  {emptyTitle}
                </AppText>
                <AppText
                  languageCode={locale}
                  align="center"
                  style={screenStyles.emptyBody}
                >
                  {emptyBody}
                </AppText>
              </View>
            ) : null
          }
        />
      )}
      <BottomScrollFade />
    </View>
  );
};

function createStyles(colors: any, isDark: boolean, isDesktopWeb = false) {
  const contentWidth = isDesktopWeb ? 820 : "100%";
  const mutedFill = isDark ? "rgba(255,255,255,0.055)" : colors.muted;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      width: contentWidth,
      maxWidth: 820,
      alignSelf: "center",
      paddingHorizontal: isDesktopWeb ? 28 : 20,
      paddingBottom: 12,
    },
    headerRow: {
      minHeight: 82,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    trophyTile: {
      width: 54,
      height: 54,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: isDark ? "rgba(251,191,36,0.46)" : "rgba(217,119,6,0.35)",
      backgroundColor: colors.warningBg,
      alignItems: "center",
      justifyContent: "center",
    },
    titleCopy: { flex: 1, minWidth: 0 },
    title: {
      color: colors.foreground,
      fontSize: isDesktopWeb ? 31 : 27,
      lineHeight: isDesktopWeb ? 40 : 36,
    },
    subtitle: {
      marginTop: 3,
      color: colors.mutedForeground,
      fontSize: 12,
      lineHeight: 18,
    },
    listHeader: {
      width: contentWidth,
      maxWidth: 820,
      alignSelf: "center",
      paddingHorizontal: isDesktopWeb ? 28 : 14,
    },
    periodControl: {
      position: "relative",
      height: 50,
      padding: 4,
      flexDirection: "row",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    periodButton: {
      flex: 1,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    periodButtonSelected: { backgroundColor: colors.warningBg },
    periodLabel: { color: colors.mutedForeground, fontSize: 12 },
    periodLabelSelected: { color: colors.warning },
    periodSpinner: { position: "absolute", top: 15, right: 10 },
    podiumStage: {
      position: "relative",
      height: isDesktopWeb ? 278 : 248,
      marginTop: 18,
      justifyContent: "flex-end",
    },
    stageLine: {
      position: "absolute",
      left: 8,
      right: 8,
      bottom: 8,
      height: 1,
      backgroundColor: colors.border,
    },
    podiumRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: isDesktopWeb ? 24 : 0,
      paddingBottom: 9,
    },
    sideSlot: {
      flex: 1,
      minWidth: 0,
      height: isDesktopWeb ? 190 : 168,
      justifyContent: "flex-end",
    },
    winnerSlot: {
      flex: 1.08,
      minWidth: 0,
      height: isDesktopWeb ? 246 : 220,
      justifyContent: "flex-end",
    },
    podiumPerson: {
      minWidth: 0,
      alignItems: "center",
      paddingHorizontal: 4,
      paddingBottom: 18,
    },
    winnerPerson: {
      paddingTop: 30,
      paddingBottom: 26,
      borderBottomWidth: 3,
      borderBottomColor: colors.warning,
    },
    crown: { position: "absolute", top: -2 },
    placeBadge: {
      width: 32,
      height: 32,
      marginTop: -8,
      borderRadius: 10,
      borderWidth: 1.5,
      backgroundColor: colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
    },
    placeText: { fontSize: 15 },
    podiumName: {
      width: "100%",
      marginTop: 10,
      paddingHorizontal: 2,
      color: colors.foreground,
      fontSize: isDesktopWeb ? 14 : 12,
      lineHeight: 18,
    },
    winnerName: { fontSize: isDesktopWeb ? 16 : 14 },
    podiumXpLine: {
      marginTop: 7,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    podiumXp: { color: colors.foreground, fontSize: isDesktopWeb ? 13 : 11 },
    winnerXp: { color: colors.warning, fontSize: isDesktopWeb ? 16 : 14 },
    rankingHeading: {
      marginTop: 12,
      paddingHorizontal: 4,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rankingTitle: { color: colors.foreground, fontSize: 15 },
    rankingPeriod: { color: colors.mutedForeground, fontSize: 11 },
    rowSlot: {
      width: contentWidth,
      maxWidth: 820,
      alignSelf: "center",
      paddingHorizontal: isDesktopWeb ? 28 : 14,
    },
    rankingRow: {
      minHeight: 72,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: isDesktopWeb ? 16 : 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    currentUserRow: { backgroundColor: colors.warningBg },
    rowXpColumn: { width: isDesktopWeb ? 126 : 92, flexShrink: 0, gap: 5 },
    rowMetric: { flexDirection: "row", alignItems: "center", gap: 5 },
    rowXp: { color: colors.foreground, fontSize: isDesktopWeb ? 14 : 12 },
    rowLevel: { color: colors.mutedForeground, fontSize: 10 },
    rowIdentity: {
      flex: 1,
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 9,
    },
    rowName: { flexShrink: 1, color: colors.foreground, fontSize: 13 },
    rowRank: {
      width: 24,
      color: colors.mutedForeground,
      textAlign: "center",
      fontSize: 14,
    },
    skeletonWrap: {
      width: contentWidth,
      maxWidth: 820,
      alignSelf: "center",
      paddingHorizontal: isDesktopWeb ? 28 : 14,
    },
    skeletonSegment: {
      height: 50,
      borderRadius: 16,
      backgroundColor: mutedFill,
    },
    skeletonPodium: {
      height: 248,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 18,
      paddingHorizontal: 28,
      paddingBottom: 22,
    },
    skeletonSide: {
      flex: 1,
      height: 110,
      borderRadius: 18,
      backgroundColor: mutedFill,
    },
    skeletonWinner: {
      flex: 1.08,
      height: 158,
      borderRadius: 18,
      backgroundColor: mutedFill,
    },
    skeletonRow: {
      height: 72,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    emptyState: {
      minHeight: 390,
      paddingHorizontal: 34,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyIcon: {
      width: 62,
      height: 62,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    emptyTitle: { color: colors.foreground, fontSize: 18 },
    emptyBody: {
      maxWidth: 320,
      marginTop: 7,
      color: colors.mutedForeground,
      fontSize: 13,
      lineHeight: 20,
    },
  });
}

const staticStyles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
