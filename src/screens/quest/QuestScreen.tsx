import ProgressBar from "@/components/shared/progress-bar";
import SafeContainer from "@/components/shared/safe-container";
import { SvgAppButton } from "@/components/shared/svg-app-button";
import { ChestUnlockedV2 } from "@/constants/icons";
import { Image } from "expo-image";
import { Clock, Gift } from "lucide-react-native";
import { ReactNode } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

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

type QuestActionButtonProps = {
  width: number;
  label: string;
  leftNode: ReactNode;
};

const QuestActionButton = ({
  width,
  label,
  leftNode,
}: QuestActionButtonProps) => (
  <SvgAppButton
    color="#FFFFFF"
    backgroundColor={TRACK_COLOR}
    onPress={() => {}}
    leftRadius={13}
    pressDepth={3}
    rightRadius={13}
    contentContainerStyle={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: TRACK_COLOR,
      borderRadius: 13,
    }}
    width={width}
    height={40}
  >
    {leftNode}
    <Text className="text-text-primary text-sm font-rd-medium">{label}</Text>
  </SvgAppButton>
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
              <Clock color="#e5e5e5" size={16} />
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
      <ScrollView contentContainerClassName="pb-10">
        {/* Friends Quest */}
        <View className="px-5 mt-6 gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-tertiary text-xl font-rd-bold">
              ئەرکی هاوڕێیان
            </Text>
            <View className="flex-row items-center gap-1">
              <Clock color="#a7a7a7" size={16} />
              <Text className=" text-text-tertiary text-sm font-rd-medium">
                ٣ ڕۆژ
              </Text>
            </View>
          </View>

          <View className="w-full rounded-2xl justify-center items-center  bg-[#C6EBFD]">
            <Image
              source={require("@/assets/images/characters/boys.png")}
              contentFit="contain"
              style={{
                width: 120,
                height: 120,
                transform: [{ scale: 3.1 }, { translateY: 2.5 }],
              }}
            />
          </View>
        </View>
        {/* Friends Quest Progress */}
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
          <View className="flex-row items-center justify-between">
            <QuestActionButton
              width={windowWidth * 0.4}
              label="ئاگادارکردنەوە"
              leftNode={<Text className="text-2xl">👋</Text>}
            />
            <QuestActionButton
              width={windowWidth * 0.4}
              label="خەڵات"
              leftNode={<Gift width={25} height={25} color="#CE82FE" />}
            />
          </View>
          <View className="h-[2] w-full mt-4 mb-4 bg-gray-200" />

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-base font-rd-medium">
                ئەرکەکانی ڕۆژانە
              </Text>
              <View className="flex-row items-center gap-1">
                <Clock color="#ffc800" size={16} />
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
        </View>
      </ScrollView>
    </View>
  );
};

export default QuestScreen;
