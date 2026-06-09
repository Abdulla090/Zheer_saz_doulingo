import SafeContainer from "../../components/shared/safe-container";
import { Medal1, Medal2, Medal3 } from "../../constants/icons";
import {
  LEAGUE_ENTRIES,
  LeagueEntry,
} from "../../data/league-items";
import {
  LegendList,
  LegendListRenderItemProps,
} from "@legendapp/list/react-native";
import { Image } from "expo-image";
import { Icon3DClock } from "../../components/icons/Icon3D";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../components/ui/AppText";
import { useI18n } from "../../hooks/useI18n";
import { PressableScale } from "../../components/animations";
import { hapticImpact } from "../../utils/haptics";
import React from "react";

const getAvatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(seed)}`;

const keyExtractor = (item: LeagueEntry) => item.id;

export const LeagueScreen = () => {
  const { t, isKu } = useI18n();

  const renderRankBadge = (item: LeagueEntry) => {
    if (item.rank === 1) {
      return <Medal1 width={28} height={28} color="#FFC800" />;
    }
    if (item.rank === 2) {
      return <Medal2 width={28} height={28} color="#B7B7B7" />;
    }
    if (item.rank === 3) {
      return <Medal3 width={28} height={28} color="#D9A066" />;
    }

    return (
      <AppText
        style={[
          styles.rankNumber,
          item.isCurrentUser && styles.currentUserText,
        ]}
        forceLatinFont
        latinRole="bold"
      >
        {item.rank}
      </AppText>
    );
  };

  const renderLeagueItem = ({ item }: LegendListRenderItemProps<LeagueEntry>) => (
    <PressableScale
      onPress={() => hapticImpact()}
      scaleDown={0.99}
      style={[
        styles.rowItem,
        { flexDirection: isKu ? "row-reverse" : "row" },
        item.isCurrentUser ? styles.currentUserRow : styles.normalRow,
      ]}
    >
      <View style={[styles.rowLeft, { flexDirection: isKu ? "row-reverse" : "row" }]}>
        <View style={styles.badgeWrap}>
          {renderRankBadge(item)}
        </View>
        <Image
          source={{ uri: getAvatarUrl(item.avatarSeed) }}
          contentFit="cover"
          style={styles.avatar}
        />
        <View style={[styles.nameCol, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
          <AppText
            style={[
              styles.userName,
              item.isCurrentUser ? styles.currentUserText : styles.normalText,
            ]}
            numberOfLines={1}
            forceLatinFont
          >
            {item.name}
          </AppText>
          <AppText
            style={[
              styles.userSub,
              item.isCurrentUser ? styles.currentUserText : styles.subText,
            ]}
            forceLatinFont
          >
            {item.countryFlag} {item.level}
          </AppText>
        </View>
      </View>
      <AppText
        style={[
          styles.xpText,
          item.isCurrentUser ? styles.currentUserText : styles.xpTextNormal,
        ]}
        forceLatinFont
        latinRole="bold"
      >
        {item.xp} XP
      </AppText>
    </PressableScale>
  );

  return (
    <View style={styles.root}>
      <SafeContainer style={styles.header}>
        <View style={[styles.headerContent, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
          <AppText style={styles.headerTitle} forceKurdishFont={isKu}>
            {t("league.title")}
          </AppText>
          <View style={[styles.timeRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            <Icon3DClock size={16} />
            <AppText style={styles.timeText} forceKurdishFont={isKu}>
              {t("league.daysLeft").replace("{count}", "5")}
            </AppText>
          </View>
        </View>
      </SafeContainer>

      <LegendList
        data={LEAGUE_ENTRIES}
        keyExtractor={keyExtractor}
        renderItem={renderLeagueItem}
        recycleItems
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAF8",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1.5,
    borderBottomColor: "#EEF0F2",
  },
  headerContent: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A2B48",
    fontFamily: "DINNextRoundedBold",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: "#777777",
    fontFamily: "DINNextRoundedMedium",
  },
  listContent: {
    paddingBottom: 40,
    paddingTop: 8,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  normalRow: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF0F2",
  },
  currentUserRow: {
    backgroundColor: "#E8F9E9",
    borderColor: "#A3E4A8",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  badgeWrap: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  rankNumber: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "DINNextRoundedBold",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF0F2",
  },
  nameCol: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DINNextRoundedBold",
  },
  userSub: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: "DINNextRoundedMedium",
  },
  normalText: {
    color: "#1A2B48",
  },
  currentUserText: {
    color: "#2E7D32",
  },
  subText: {
    color: "#777777",
  },
  xpText: {
    fontSize: 15,
    fontFamily: "DINNextRoundedBold",
  },
  xpTextNormal: {
    color: "#4B4B4B",
  },
});
