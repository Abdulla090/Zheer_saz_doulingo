import ProgressBar from "@/components/shared/progress-bar";
import SafeContainer from "@/components/shared/safe-container";
import { ChestUnlockedV2 } from "@/constants/icons";
import { Image } from "expo-image";
import { Icon3DClock } from "@/components/icons/Icon3D";
import { tabBarScrollPadding } from "@/constants/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { AnimatedCard } from "@/components/animations";

const TRACK_COLOR = "#E5E5E5";
const HERO_FILL_COLOR = "#1CB0F5";
const HERO_GLOSS_COLOR = "#48C0F7";
const GOAL_FILL_COLOR = "#0070B5";
const GOAL_GLOSS_COLOR = "#338CC4";

type QuestProgressBarProps = {
  progress: number;
  width: number;
  value: string;
  valueColor: string;
  fillColor?: string;
  glossColor?: string;
};

const QuestProgressBar = ({
  progress,
  width,
  value,
  valueColor,
  fillColor = GOAL_FILL_COLOR,
  glossColor = GOAL_GLOSS_COLOR,
}: QuestProgressBarProps) => (
  <ProgressBar
    progress={progress}
    trackColor={TRACK_COLOR}
    fillColor={fillColor}
    glossColor={glossColor}
    width={width}
    value={value}
    valueColor={valueColor}
    valueFontFamily="DINNextRoundedMedium"
    valueFontSize={14}
  />
);

type ParticipantRowProps = {
  name: string;
  lessonsLabel: string;
  dotColor: string;
};

const ParticipantRow = ({
  name,
  lessonsLabel,
  dotColor,
}: ParticipantRowProps) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center gap-2">
      <View
        className="rounded-full p-2"
        style={{ backgroundColor: dotColor }}
      />
      <Text className="text-text-primary text-base font-rd-bold">{name}</Text>
    </View>
    <Text className="text-text-secondary text-sm font-rd-medium">
      {lessonsLabel}
    </Text>
  </View>
);

type QuestGoalRowProps = {
  title: string;
  progress: number;
  value: string;
  valueColor: string;
  barWidth: number;
};

const QuestGoalRow = ({
  title,
  progress,
  value,
  valueColor,
  barWidth,
}: QuestGoalRowProps) => (
  <View className="flex-row items-center justify-between">
    <View className="justify-between">
      <Text className="text-text-primary text-base font-rd-bold">{title}</Text>
      <QuestProgressBar
        progress={progress}
        width={barWidth}
        value={value}
        valueColor={valueColor}
      />
    </View>
    <ChestUnlockedV2 width={50} height={50} />
  </View>
);

const QuestScreen = () => {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const goalBarWidth = windowWidth - 128;

  return (
    <View className="flex-1 bg-white">
      <SafeContainer className={`bg-blue-medium px-4 py-4 gap-2`}>
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="text-white  text-xl font-rd-bold">
              ئەرکی نیسان
            </Text>
            <View className="flex-row items-center gap-1">
              <Icon3DClock size={18} />
              <Text className=" text-gray-6 text-sm font-rd-medium">
                ٢٤ ڕۆژ
              </Text>
            </View>
          </View>
          <Image
            source={require("@/assets/images/characters/zari.png")}
            contentFit="contain"
            style={{ width: 100, height: 100 }}
          />
        </View>

        <View className="gap-2 bg-white rounded-2xl p-4 bottom-4">
          <Text className="text-text-primary text-base font-rd-bold">
            ٣٠ خاڵی ئەرک بەدەست بهێنە
          </Text>
          <QuestProgressBar
            progress={0.1}
            width={windowWidth - 64}
            value="3 / 30"
            valueColor="#878383"
            fillColor={HERO_FILL_COLOR}
            glossColor={HERO_GLOSS_COLOR}
          />
        </View>
      </SafeContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarScrollPadding(insets.bottom) }}
      >
        {/* Friends Quest */}
        <AnimatedCard index={0} delay={200}>
          <View className="px-5 mt-6 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-tertiary text-xl font-rd-bold">
                ئەرکی هاوڕێیان
              </Text>
              <View className="flex-row items-center gap-1">
                <Icon3DClock size={18} />
                <Text className=" text-text-tertiary text-sm font-rd-medium">
                  ٣ ڕۆژ
                </Text>
              </View>
            </View>

            <View className="w-full rounded-2xl justify-center items-center overflow-hidden bg-[#C6EBFD] py-4">
              <Image
                source={require("@/assets/images/characters/boys.png")}
                contentFit="contain"
                style={{ width: 200, height: 100 }}
              />
            </View>
          </View>
        </AnimatedCard>

        {/* Friends Quest Progress */}
        <AnimatedCard index={1} delay={200}>
          <View className="px-5 mt-6 gap-2">
            <QuestGoalRow
              title="وانەی داهاتووت تەواو بکە"
              progress={0}
              value="1 / 1"
              valueColor="#afafaf"
              barWidth={goalBarWidth}
            />
            {/* You Quest */}
            <ParticipantRow
              name="تۆ"
              lessonsLabel="١ وانە"
              dotColor="#C894F9"
            />
            <ParticipantRow
              name="ئاکام"
              lessonsLabel="٣ وانە"
              dotColor="#D5B8E8"
            />
            <View className="h-[2] w-full mt-4 mb-4 bg-gray-200" />

            <AnimatedCard index={2} delay={300}>
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-text-secondary text-base font-rd-medium">
                    ئەرکەکانی ڕۆژانە
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Icon3DClock size={18} />
                    <Text className="text-gold-base text-sm font-rd-medium">
                      ٣ ڕۆژ
                    </Text>
                  </View>
                </View>
                <View className="gap-6">
                  <QuestGoalRow
                    title="وانەی داهاتووت تەواو بکە"
                    progress={0.2}
                    value="2 / 14"
                    valueColor="#afafaf"
                    barWidth={goalBarWidth}
                  />
                  <QuestGoalRow
                    title="١٠ خولەک تەرخان بکە بۆ فێربوون"
                    progress={0}
                    value="0 / 14"
                    valueColor="#afafaf"
                    barWidth={goalBarWidth}
                  />
                  <QuestGoalRow
                    title="گوێ لە ٥ ڕاهێنان بگرە"
                    progress={0}
                    value="0 / 14"
                    valueColor="#afafaf"
                    barWidth={goalBarWidth}
                  />
                </View>
              </View>
            </AnimatedCard>
          </View>
        </AnimatedCard>
      </ScrollView>
    </View>
  );
};

export default QuestScreen;
