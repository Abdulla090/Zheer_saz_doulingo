import { useThemeColors } from "../../hooks/useThemeColors";
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
import { AppClockIcon } from "../../components/icons/AppHugeIcons";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../components/ui/AppText";
import { useI18n } from "../../hooks/useI18n";
import { PressableScale } from "../../components/animations";
import { hapticImpact } from "../../utils/haptics";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { getLocalPremadeAvatar } from "../../constants/avatars";
import React, { useMemo } from "react";

const getAvatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(seed)}`;

const keyExtractor = (item: LeagueEntry) => item.id;

export const LeagueScreen = () => {
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const { t, isKu } = useI18n();

  const avatarUrl = useSettingsStore((s) => s.avatarUrl);
  const userName = useSettingsStore((s) => s.userName);

  const renderAvatar = (item: LeagueEntry, size: number, style: any) => {
    if (item.isCurrentUser && avatarUrl) {
      const SVGComponent = getLocalPremadeAvatar(avatarUrl);
      if (SVGComponent) {
        return <SVGComponent width={size} height={size} style={style} />;
      }
      return (
        <Image
          source={{ uri: avatarUrl }}
          contentFit="cover"
          style={style}
        />
      );
    }
    return (
      <Image
        source={{ uri: getAvatarUrl(item.avatarSeed) }}
        contentFit="cover"
        style={style}
      />
    );
  };

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
        {renderAvatar(item, 40, styles.avatar)}
        <View style={[styles.nameCol, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
          <AppText
            style={[
              styles.userName,
              item.isCurrentUser ? styles.currentUserText : styles.normalText,
            ]}
            numberOfLines={1}
            forceLatinFont
          >
            {item.isCurrentUser ? (userName || item.name) : item.name}
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
            <AppClockIcon size={16} />
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

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  headerContent: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: colors.mutedForeground,
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
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    borderColor: colors.border,
  },
  currentUserRow: {
    backgroundColor: isDark ? "rgba(34, 197, 94, 0.12)" : "#E8F9E9",
    borderColor: isDark ? "rgba(34, 197, 94, 0.3)" : "#A3E4A8",
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
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedBold",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#EEF0F2",
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
    color: colors.foreground,
  },
  currentUserText: {
    color: isDark ? "#4ADE80" : "#2E7D32",
  },
  subText: {
    color: colors.mutedForeground,
  },
  xpText: {
    fontSize: 15,
    fontFamily: "DINNextRoundedBold",
  },
  xpTextNormal: {
    color: colors.mutedForeground,
  },
  });
}
