import { Trophy, ZapIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  LegendList,
  type LegendListRenderItemProps,
} from "@legendapp/list/react-native";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { getMascot } from "../../constants/mascots";
import { tabBarScrollPadding } from "../../constants/layout";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { supabase } from "../../lib/supabase";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { hapticImpact } from "../../utils/haptics";

export type LeaderboardEntry = {
  userId: string;
  rank: number;
  name: string;
  avatarUrl: string | null;
  selectedMascotId: string;
  xp: number;
};

type LeaderboardRow = {
  user_id: string;
  rank: number | string;
  display_name: string;
  avatar_url: string | null;
  selected_mascot_id: string;
  total_xp: number;
};

const keyExtractor = (item: LeaderboardEntry) => item.userId;

export const LeaderboardScreen = () => {
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const insets = useSafeAreaInsets();
  const { t, locale, isKu } = useI18n();
  const { user } = useAuth();
  const isRtl = isKu || locale === "ar";
  const localAvatarUrl = useSettingsStore((state) => state.avatarUrl);
  const localMascotId = useSettingsStore((state) => state.selectedMascotId);
  const localUserName = useSettingsStore((state) => state.userName);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setLoadFailed(false);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const { data, error } = await supabase.rpc("get_leaderboard", { p_limit: 50 });
    if (error) {
      console.error("Failed to load leaderboard:", error.message);
      setEntries([]);
      setLoadFailed(true);
    } else {
      setEntries(
        ((data ?? []) as LeaderboardRow[]).map((row) => ({
          userId: row.user_id,
          rank: Number(row.rank),
          name: row.display_name,
          avatarUrl: row.avatar_url,
          selectedMascotId: row.selected_mascot_id,
          xp: row.total_xp,
        })),
      );
      setLoadFailed(false);
    }
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadLeaderboard();
  };

  const renderAvatar = (item: LeaderboardEntry) => {
    const isMe = item.userId === user?.id;
    const uploadedUrl = isMe && localAvatarUrl ? localAvatarUrl : item.avatarUrl;
    if (
      uploadedUrl &&
      /^(https?:|file:|content:|data:|blob:)/i.test(uploadedUrl) &&
      !/\.svg(?:[?#]|$)|\/premade\//i.test(uploadedUrl)
    ) {
      return <Image source={{ uri: uploadedUrl }} contentFit="cover" style={styles.avatar} />;
    }

    const mascot = getMascot(isMe ? localMascotId : item.selectedMascotId);
    return (
      <View style={styles.avatar}>
        <Image source={mascot.source} contentFit="contain" style={styles.mascotImage} />
      </View>
    );
  };

  const renderItem = ({ item }: LegendListRenderItemProps<LeaderboardEntry>) => {
    const isMe = item.userId === user?.id;
    const level = Math.max(1, Math.floor(item.xp / 120) + 1);
    return (
      <PressableScale
        onPress={() => hapticImpact()}
        scaleDown={0.985}
        style={[styles.row, isMe && styles.currentUserRow, isRtl && styles.rowRtl]}
      >
        <View style={[styles.rank, item.rank <= 3 && styles.topRank]}>
          <AppText style={[styles.rankText, item.rank <= 3 && styles.topRankText]} forceLatinFont latinRole="bold">
            {item.rank}
          </AppText>
        </View>
        {renderAvatar(item)}
        <View style={styles.nameColumn}>
          <AppText
            style={styles.name}
            numberOfLines={1}
            align="start"
            languageCode={locale}
            latinRole="bold"
          >
            {isMe && localUserName ? localUserName : item.name}
          </AppText>
          <AppText style={styles.level} forceLatinFont>
            Level {level}
          </AppText>
        </View>
        <View style={styles.xp}>
          <HugeiconsIcon icon={ZapIcon} size={13} color="#F59E0B" strokeWidth={3} />
          <AppText style={styles.xpText} forceLatinFont latinRole="bold">
            {item.xp} XP
          </AppText>
        </View>
      </PressableScale>
    );
  };

  const emptyTitle = loadFailed
    ? "Leaderboard unavailable"
    : user
      ? "Be the first learner here"
      : "Sign in to join the leaderboard";
  const emptyBody = loadFailed
    ? "Pull down to try again."
    : user
      ? "Complete a lesson to earn XP and start the ranking."
      : "Your real XP and profile pet will appear after you sign in.";

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <View style={[styles.titleRow, isRtl && styles.rowRtl]}>
          <View style={styles.trophy}>
            <HugeiconsIcon icon={Trophy} size={22} color="#F59E0B" strokeWidth={2.4} />
          </View>
          <View>
            <AppText style={styles.title} languageCode={locale} align="start" latinRole="bold">
              {t("league.title")}
            </AppText>
            <AppText style={styles.subtitle} languageCode={locale} align="start">
              Real learners ranked by total XP
            </AppText>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <LegendList
          data={entries}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          recycleItems
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{
            paddingTop: 14,
            paddingBottom: tabBarScrollPadding(insets.bottom) + 24,
          }}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <View style={styles.emptyIcon}>
                <HugeiconsIcon icon={Trophy} size={30} color={colors.mutedForeground} strokeWidth={1.8} />
              </View>
              <AppText style={styles.emptyTitle} languageCode={locale} align="center" latinRole="bold">
                {emptyTitle}
              </AppText>
              <AppText style={styles.emptyBody} languageCode={locale} align="center">
                {emptyBody}
              </AppText>
            </View>
          }
        />
      )}
      <BottomScrollFade />
    </View>
  );
};

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowRtl: { flexDirection: "row-reverse" },
    trophy: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(245,158,11,0.12)" : "#FFFBEB",
    },
    title: { fontSize: 25, color: colors.foreground },
    subtitle: { marginTop: 2, fontSize: 12, color: colors.mutedForeground },
    row: {
      minHeight: 72,
      marginHorizontal: 16,
      marginBottom: 9,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      borderRadius: 18,
      borderWidth: 1,
      borderBottomWidth: 3,
      borderColor: colors.border,
      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
    },
    currentUserRow: {
      borderColor: isDark ? "rgba(249,115,22,0.45)" : "#FED7AA",
      backgroundColor: isDark ? "rgba(249,115,22,0.10)" : "#FFF7ED",
    },
    rank: { width: 28, alignItems: "center", justifyContent: "center" },
    topRank: {
      width: 28,
      height: 28,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "#FEF3C7",
    },
    rankText: { fontSize: 14, color: colors.mutedForeground },
    topRankText: { color: "#D97706" },
    avatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
    },
    mascotImage: { width: 42, height: 42 },
    nameColumn: { flex: 1, minWidth: 0 },
    name: { fontSize: 15, color: colors.foreground },
    level: { marginTop: 2, fontSize: 11, color: colors.mutedForeground },
    xp: { flexDirection: "row", alignItems: "center", gap: 4 },
    xpText: { fontSize: 12, color: colors.foreground },
    centerState: {
      flex: 1,
      minHeight: 360,
      paddingHorizontal: 34,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC",
      marginBottom: 16,
    },
    emptyTitle: { fontSize: 18, color: colors.foreground },
    emptyBody: {
      maxWidth: 310,
      marginTop: 7,
      fontSize: 13,
      lineHeight: 19,
      color: colors.mutedForeground,
    },
  });
}
