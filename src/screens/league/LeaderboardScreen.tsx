/**
 * LeaderboardScreen — Premium Duolingo-style leaderboard with playful 3D podium and professional UI.
 */

import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import {
  LEAGUE_ENTRIES,
  LeagueEntry,
} from "../../data/league-items";
import { Image } from "expo-image";
import { useI18n } from "../../hooks/useI18n";
import { PressableScale } from "../../components/animations";
import { hapticImpact } from "../../utils/haptics";
import { GsapEnterBlock } from "../../components/animations/skia-gsap-opening";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabBarScrollPadding } from "../../constants/layout";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Trophy, ArrowUp01Icon, Clock01Icon, ZapIcon, StarIcon } from "@hugeicons/core-free-icons";

const getAvatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(seed)}`;

const Colors = {
  background: "#FFFFFF",
  surface: "#F8FAFC",
  foreground: "#0F172A",
  mutedForeground: "#64748B",
  border: "#E2E8F0",
  promotion: "#22C55E",
  promotionBg: "rgba(34, 197, 94, 0.08)",
  currentUser: "#0F172A",
  currentUserBg: "#FFF7ED", // soft orange bg
  currentUserBorder: "#FF963C", // soft orange border
  purpleText: "#6B5AED", // sophisticated slate-purple (not AI slop purple)
  purpleBg: "#F5F3FF", // soft lavender bg
};

export const LeaderboardScreen = () => {
  const insets = useSafeAreaInsets();
  const { t, locale, isKu } = useI18n();
  const isRtl = isKu || locale === 'ar';

  const top3 = useMemo(() => LEAGUE_ENTRIES.slice(0, 3), []);
  const rest = useMemo(() => LEAGUE_ENTRIES.slice(3), []);

  const podiumOrder = useMemo(() => {
    // 2nd | 1st | 3rd
    if (top3.length < 3) return top3;
    return [top3[1], top3[0], top3[2]];
  }, [top3]);

  const renderPodiumItem = (item: LeagueEntry) => {
    const isFirst = item.rank === 1;
    const isSecond = item.rank === 2;

    const avatarSize = isFirst ? 76 : 60;
    const pedestalHeight = isFirst ? 110 : isSecond ? 80 : 64;

    // Playful 3D Pedestal Colors - Rank 3 is soft blue
    let pedestalBg = "#EFF6FF"; 
    let pedestalBorder = "#BFDBFE";
    let pedestalBottom = "#3B82F6";
    let badgeColor = "#3B82F6";
    let trophyColor = "#3B82F6";

    if (isFirst) {
      pedestalBg = "#FFF7ED"; // Soft Orange
      pedestalBorder = "#FFD8A8";
      pedestalBottom = "#FF963C";
      badgeColor = "#FF963C";
      trophyColor = "#FF963C";
    } else if (isSecond) {
      pedestalBg = "#F5F3FF"; // Soft Purple
      pedestalBorder = "#D8D4FD";
      pedestalBottom = "#6B5AED";
      badgeColor = "#6B5AED";
      trophyColor = "#6B5AED";
    }

    return (
      <View key={item.id} style={styles.podiumSlot}>
        {/* Crown/Star overlay on top of 1st place */}
        {isFirst && (
          <View style={styles.crownContainer}>
            <HugeiconsIcon icon={StarIcon} size={18} color="#FF963C" strokeWidth={2.5} />
          </View>
        )}

        {/* Avatar Ring */}
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatarRing,
              {
                width: avatarSize + 8,
                height: avatarSize + 8,
                borderRadius: (avatarSize + 8) / 2,
                borderColor: pedestalBorder,
                backgroundColor: Colors.background,
              },
            ]}
          >
            <Image
              source={{ uri: getAvatarUrl(item.avatarSeed) }}
              contentFit="cover"
              style={[
                styles.podiumAvatar,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                },
              ]}
            />
          </View>
          
          {/* Badge */}
          <View style={[styles.podiumRankBadge, { backgroundColor: badgeColor }]}>
            <AppText style={styles.podiumRankText} forceLatinFont latinRole="bold">
              {item.rank}
            </AppText>
          </View>
        </View>

        {/* Name */}
        <AppText
          style={[styles.podiumName, isFirst && styles.podiumNameFirst]}
          numberOfLines={1}
          forceLatinFont
          latinRole="bold"
        >
          {item.name.split(" ")[0]}
        </AppText>

        {/* XP */}
        <View style={styles.podiumXpBadge}>
          <HugeiconsIcon icon={ZapIcon} size={10} color="#F59E0B" strokeWidth={3} />
          <AppText style={styles.podiumXpText} forceLatinFont latinRole="bold">
            {item.xp}
          </AppText>
        </View>

        {/* Playful 3D Pedestal Bar */}
        <View
          style={[
            styles.pedestalBar,
            {
              height: pedestalHeight,
              backgroundColor: pedestalBg,
              borderColor: pedestalBorder,
              borderBottomColor: pedestalBottom,
            },
          ]}
        >
          <HugeiconsIcon icon={Trophy} size={22} color={trophyColor} strokeWidth={2.5} />
        </View>
      </View>
    );
  };

  const renderListItem = (item: LeagueEntry) => {
    const isMe = item.isCurrentUser;

    return (
      <PressableScale
        key={item.id}
        onPress={() => hapticImpact()}
        scaleDown={0.98}
        style={[
          styles.listRow,
          isMe && styles.listRowMe,
        ]}
      >
        {/* Rank column */}
        <View style={styles.listRankWrap}>
          <AppText
            style={[styles.listRank, isMe && styles.listRankMe]}
            forceLatinFont
            latinRole="bold"
          >
            {item.rank}
          </AppText>
        </View>

        {/* Avatar */}
        <Image
          source={{ uri: getAvatarUrl(item.avatarSeed) }}
          contentFit="cover"
          style={styles.listAvatar}
        />

        {/* Name and Level */}
        <View style={[styles.listNameCol, isRtl && { alignItems: "flex-end" }]}>
          <AppText
            style={[styles.listName, isMe && styles.listNameMe]}
            numberOfLines={1}
            forceLatinFont
            latinRole="bold"
          >
            {item.name}
          </AppText>
          <View style={styles.metaRow}>
            <AppText style={styles.flagText}>{item.countryFlag}</AppText>
            <View style={styles.levelChip}>
              <AppText style={styles.levelText} forceLatinFont>
                Lvl {item.level}
              </AppText>
            </View>
          </View>
        </View>

        {/* XP Value */}
        <View style={[styles.xpChip, isMe && styles.xpChipMe]}>
          <HugeiconsIcon icon={ZapIcon} size={12} color={isMe ? "#FFFFFF" : "#F59E0B"} strokeWidth={3} />
          <AppText
            style={[styles.listXp, isMe && styles.listXpMe]}
            forceLatinFont
            latinRole="bold"
          >
            {item.xp} XP
          </AppText>
        </View>
      </PressableScale>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header section */}
      <GsapEnterBlock index={0}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
          <View style={styles.headerTop}>
            <View style={isRtl && { alignItems: "flex-end" }}>
              <AppText style={[styles.headerTitle, isRtl && { textAlign: "right" }]} forceLatinFont={!isRtl} latinRole="bold">
                {t("league.title")}
              </AppText>
              {/* Promotion zone indicator */}
              <View style={styles.promotionBadge}>
                <HugeiconsIcon icon={ArrowUp01Icon} size={12} color={Colors.promotion} strokeWidth={2.5} />
                <AppText style={styles.promotionText} forceLatinFont={!isRtl} latinRole="bold">
                  {t("league.promotionZone")}
                </AppText>
              </View>
            </View>
            
            <View style={styles.headerTimeBadge}>
              <HugeiconsIcon icon={Clock01Icon} size={14} color={Colors.mutedForeground} strokeWidth={2} />
              <AppText style={styles.headerTimeText} forceLatinFont={!isRtl} latinRole="bold">
                {t("league.daysLeft").replace("{count}", "5")}
              </AppText>
            </View>
          </View>
        </View>
      </GsapEnterBlock>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarScrollPadding(insets.bottom) + 24,
        }}
      >
        {/* Podium Layout */}
        <GsapEnterBlock index={1}>
          <View style={styles.podiumSection}>
            {podiumOrder.map((item) => renderPodiumItem(item))}
          </View>
        </GsapEnterBlock>

        {/* List Section */}
        <GsapEnterBlock index={2}>
          <View style={styles.listSection}>
            {rest.map((item) => renderListItem(item))}
          </View>
        </GsapEnterBlock>
      </ScrollView>

      <BottomScrollFade />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    color: Colors.foreground,
  },
  headerTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  headerTimeText: {
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  promotionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  promotionText: {
    fontSize: 12,
    color: Colors.promotion,
  },

  // -- Podium --
  podiumSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
  },
  podiumSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  crownContainer: {
    position: "absolute",
    top: -24,
    zIndex: 10,
    backgroundColor: "#FEF08A",
    padding: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EAB308",
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarRing: {
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  podiumAvatar: {
    backgroundColor: "#F1F5F9",
  },
  podiumRankBadge: {
    position: "absolute",
    bottom: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },
  podiumRankText: {
    fontSize: 11,
    color: "#FFFFFF",
  },
  podiumName: {
    fontSize: 13,
    color: Colors.foreground,
    marginTop: 10,
  },
  podiumNameFirst: {
    fontSize: 15,
  },
  podiumXpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  podiumXpText: {
    fontSize: 11,
    color: "#D97706",
  },
  pedestalBar: {
    width: "82%",
    borderWidth: 1.5,
    borderBottomWidth: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  // -- List Section --
  listSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    borderBottomWidth: 4,
    borderBottomColor: "#E2E8F0",
  },
  listRowMe: {
    backgroundColor: Colors.currentUserBg,
    borderColor: "#FFE4D6",
    borderBottomColor: "#FFC29E",
  },
  listRankWrap: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  listRank: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  listRankMe: {
    color: Colors.currentUserBorder,
  },
  listAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F5F9",
    marginStart: 8,
  },
  listNameCol: {
    flex: 1,
    marginStart: 12,
  },
  listName: {
    fontSize: 14,
    color: Colors.foreground,
  },
  listNameMe: {
    color: Colors.foreground,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  flagText: {
    fontSize: 12,
  },
  levelChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 10,
    color: Colors.mutedForeground,
  },
  xpChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FEF3C7",
    borderBottomWidth: 3,
    borderBottomColor: "#FDE68A",
  },
  xpChipMe: {
    backgroundColor: Colors.currentUserBorder,
    borderColor: "#EA580C",
    borderBottomColor: "#C2410C",
  },
  listXp: {
    fontSize: 12,
    color: "#D97706",
  },
  listXpMe: {
    color: "#FFFFFF",
  },
});
