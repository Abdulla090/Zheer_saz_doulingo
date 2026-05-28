import SafeContainer from "@/components/shared/safe-container";
import { Medal1, Medal2, Medal3 } from "@/constants/icons";
import {
  LEAGUE_ENTRIES,
  LeagueEntry,
  LeagueTournamentListItem,
} from "@/data/league-items";
import {
  LegendList,
  LegendListRenderItemProps,
} from "@legendapp/list/react-native";
import { Image } from "expo-image";
import { Icon3DClock } from "@/components/icons/Icon3D";
import { tabBarScrollPadding } from "@/constants/layout";
import { useI18n } from "@/hooks/useI18n";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getAvatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(seed)}`;

const keyExtractor = (item: LeagueEntry | LeagueTournamentListItem) => item.id;

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
    <Text
      className={`text-base font-rd-bold ${
        item.isCurrentUser ? "text-green-medium" : "text-text-tertiary"
      }`}
    >
      {item.rank}
    </Text>
  );
};

export const LeagueScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const xpSuffix = t("league.xpSuffix");

  const renderLeagueItem = ({ item }: LegendListRenderItemProps<LeagueEntry>) => (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${
        item.isCurrentUser ? "bg-green-ice" : "bg-white"
      }`}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-7 items-center justify-center">
          {renderRankBadge(item)}
        </View>
        <Image
          source={{ uri: getAvatarUrl(item.avatarSeed) }}
          contentFit="cover"
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View className="flex-1">
          <Text
            className={`text-xl text-text-primary leading-8 font-rd-medium ${
              item.isCurrentUser ? "text-green-medium" : "text-text-primary"
            }`}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            className={`text-base text-text-secondary font-rd-medium ${
              item.isCurrentUser ? "text-green-medium" : "text-text-secondary"
            }`}
          >
            {item.countryFlag} {item.level}
          </Text>
        </View>
      </View>
      <Text
        className={`text-base font-rd-bold ${
          item.isCurrentUser ? "text-green-medium" : "text-text-tertiary"
        }`}
      >
        {item.xp} {xpSuffix}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <SafeContainer className="px-4 pt-2 pb-2 gap-1">
        <Text className="text-text-primary text-xl font-rd-bold">
          {t("league.title")}
        </Text>
        <View className="flex-row items-center gap-1">
          <Icon3DClock size={18} />
          <Text className="text-text-secondary text-sm font-rd-medium">
            {t("league.durationDays")}
          </Text>
        </View>
      </SafeContainer>

      <LegendList
        data={LEAGUE_ENTRIES}
        keyExtractor={keyExtractor}
        renderItem={renderLeagueItem}
        estimatedItemSize={74}
        contentContainerStyle={{ paddingBottom: tabBarScrollPadding(insets.bottom) }}
      />
    </View>
  );
};
