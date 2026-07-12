import { ProgressBar } from "../../components/shared/progress-bar";
import SafeContainer from "../../components/shared/safe-container";
import { SvgAppButton } from "../../components/shared/svg-app-button";
import { ChestUnlockedV2 } from "../../constants/icons";
import { Image } from "expo-image";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { Clock01Icon, GiftIcon, Notification01Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { AnimatedCard } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import { useI18n } from "../../hooks/useI18n";
import { HomeMeshBackground, HomePalette as C } from "../../components/ui/ios-liquid-home";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hapticImpact } from "../../utils/haptics";
import { useThemeColors } from "../../hooks/useThemeColors";

const TRACK_COLOR = "#E2E8F0";
const HERO_FILL_COLOR = "#0F172A";
const HERO_GLOSS_COLOR = "#334155";
const GOAL_FILL_COLOR = "#475569";
const GOAL_GLOSS_COLOR = "#64748B";

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
}: QuestProgressBarProps) => {
  const { isDark } = useThemeColors();
  return <ProgressBar
    progress={progress}
    trackColor={isDark ? "rgba(255,255,255,0.12)" : TRACK_COLOR}
    fillColor={fillColor}
    glossColor={glossColor}
    width={width}
    value={value}
    valueColor={valueColor}
    valueFontFamily="DINNextRoundedMedium"
    valueFontSize={14}
  />;
};

type ParticipantRowProps = {
  name: string;
  lessonsLabel: string;
  dotColor: string;
  isKu: boolean;
};

const ParticipantRow = ({
  name,
  lessonsLabel,
  dotColor,
  isKu,
}: ParticipantRowProps) => {
  const styles = useQuestStyles();
  return (
  <View style={[styles.participantRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
    <View style={[styles.participantInfo, { flexDirection: isKu ? "row-reverse" : "row" }]}>
      <View
        style={[styles.participantDot, { backgroundColor: dotColor }]}
      />
      <AppText style={styles.participantName} forceKurdishFont={isKu}>{name}</AppText>
    </View>
    <AppText style={styles.participantLessons} forceKurdishFont={isKu}>
      {lessonsLabel}
    </AppText>
  </View>
  );
};

type QuestActionButtonProps = {
  width: number;
  label: string;
  leftNode: React.ReactNode;
  onPress: () => void;
};

const QuestActionButton = ({
  width,
  label,
  leftNode,
  onPress,
}: QuestActionButtonProps) => {
  const { isDark } = useThemeColors();
  const styles = useQuestStyles();
  return <SvgAppButton
    color="#FFFFFF"
    backgroundColor={isDark ? "#334155" : TRACK_COLOR}
    onPress={onPress}
    leftRadius={14}
    pressDepth={3}
    rightRadius={14}
    contentContainerStyle={styles.actionBtnContent}
    width={width}
    height={40}
  >
    {leftNode}
    <AppText style={styles.actionBtnLabel}>{label}</AppText>
  </SvgAppButton>;
};

type QuestGoalRowProps = {
  title: string;
  progress: number;
  value: string;
  valueColor: string;
  barWidth: number;
  isKu: boolean;
};

const QuestGoalRow = ({
  title,
  progress,
  value,
  valueColor,
  barWidth,
  isKu,
}: QuestGoalRowProps) => {
  const styles = useQuestStyles();
  return <View style={[styles.goalRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
    <View style={[styles.goalLeft, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
      <AppText style={[styles.goalTitle, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{title}</AppText>
      <QuestProgressBar
        progress={progress}
        width={barWidth}
        value={value}
        valueColor={valueColor}
      />
    </View>
    <ChestUnlockedV2 width={50} height={50} />
  </View>;
};

const QuestScreen = () => {
  const { isDark } = useThemeColors();
  const styles = useQuestStyles();
  const { t, isKu } = useI18n();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const goalBarWidth = windowWidth - 128;

  // Calculate dynamic days left in current month
  const diffDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const nextMonth = new Date(year, month + 1, 1);
    const diffTime = Math.abs(nextMonth.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  const questTitle = useMemo(() => {
    const monthIndex = new Date().getMonth();
    const monthsKu = ["کانوونی دووەم", "شوبات", "ئادار", "نیسان", "ئایار", "حوزەیران", "تەممووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"];
    const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = isKu ? monthsKu[monthIndex] : monthsEn[monthIndex];
    return isKu ? `ئەرکی ${monthName}` : `${monthName} Quest`;
  }, [isKu]);

  return (
    <View style={styles.root}>
      {!isDark && <HomeMeshBackground />}

      <SafeContainer style={[styles.safeHeader, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.headerRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
          <View style={[styles.headerTexts, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
            <AppText style={styles.headerTitle} forceKurdishFont={isKu}>
              {questTitle}
            </AppText>
            <View style={[styles.timeRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
              <HugeiconsIcon icon={Clock01Icon} size={16} color="#0F172A" />
              <AppText style={styles.timeText} forceKurdishFont={isKu}>
                {t("quest.daysLeft").replace("{count}", String(diffDays))}
              </AppText>
            </View>
          </View>
          <Image
            source={require("../../../assets/images/characters/zari.png")}
            contentFit="contain"
            style={styles.zariMascot}
          />
        </View>

        <View style={styles.topCard}>
          <AppText style={[styles.topCardTitle, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>
            {t("quest.monthlyGoal")}
          </AppText>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Friends Quest */}
        <AnimatedCard index={0} delay={200}>
          <View style={styles.sectionHeaderRow}>
            <AppText style={[styles.sectionTitle, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>
              {t("quest.friendsQuest")}
            </AppText>
            <View style={[styles.timeRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
              <HugeiconsIcon icon={Clock01Icon} size={16} color="#475569" />
              <AppText style={styles.timeTextGray} forceKurdishFont={isKu}>
                {t("quest.daysLeft").replace("{count}", "3")}
              </AppText>
            </View>
          </View>

          <View style={styles.boysCard}>
            <Image
              source={require("../../../assets/images/characters/boys.png")}
              contentFit="contain"
              style={styles.boysImage}
            />
          </View>
        </AnimatedCard>

        {/* Friends Quest Progress */}
        <AnimatedCard index={1} delay={200}>
          <View style={styles.friendsProgressCard}>
            <QuestGoalRow
              title={t("quest.nextLesson")}
              progress={1.0}
              value="1 / 1"
              valueColor="#0F172A"
              barWidth={goalBarWidth}
              isKu={isKu}
            />
            
            <ParticipantRow
              name={t("quest.you")}
              lessonsLabel={t("quest.oneLesson")}
              dotColor="#C894F9"
              isKu={isKu}
            />
            <ParticipantRow
              name={t("quest.akam")}
              lessonsLabel={t("quest.mLessons").replace("{count}", "3")}
              dotColor="#D5B8E8"
              isKu={isKu}
            />

            <View style={[styles.actionRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
              <QuestActionButton
                width={windowWidth * 0.4}
                label={t("quest.nudge")}
                leftNode={<HugeiconsIcon icon={Notification01Icon} size={20} color="#0F172A" />}
                onPress={() => hapticImpact()}
              />
              <QuestActionButton
                width={windowWidth * 0.4}
                label={t("quest.gift")}
                leftNode={<HugeiconsIcon icon={GiftIcon} size={20} color="#0F172A" />}
                onPress={() => hapticImpact()}
              />
            </View>
            
            <View style={styles.cardDivider} />

            {/* Daily Quests */}
            <AnimatedCard index={2} delay={300}>
              <View style={styles.dailyHeaderRow}>
                <AppText style={styles.dailyTitle} forceKurdishFont={isKu}>
                  {t("quest.dailyQuests")}
                </AppText>
                <View style={[styles.timeRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  <HugeiconsIcon icon={Clock01Icon} size={16} color="#334155" />
                  <AppText style={styles.timeTextGold} forceKurdishFont={isKu}>
                    {t("quest.daysLeft").replace("{count}", "1")}
                  </AppText>
                </View>
              </View>
              
              <View style={styles.dailyGoalsList}>
                <QuestGoalRow
                  title={t("quest.nextLesson")}
                  progress={0.14}
                  value="2 / 14"
                  valueColor="#afafaf"
                  barWidth={goalBarWidth}
                  isKu={isKu}
                />
                <QuestGoalRow
                  title={t("quest.spendTenMins")}
                  progress={0}
                  value="0 / 10"
                  valueColor="#afafaf"
                  barWidth={goalBarWidth}
                  isKu={isKu}
                />
                <QuestGoalRow
                  title={t("quest.listenFive")}
                  progress={0}
                  value="0 / 5"
                  valueColor="#afafaf"
                  barWidth={goalBarWidth}
                  isKu={isKu}
                />
              </View>
            </AnimatedCard>
          </View>
        </AnimatedCard>
      </ScrollView>
    </View>
  );
};

function useQuestStyles() {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => createStyles(colors, isDark), [colors, isDark]);
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeHeader: {
    paddingHorizontal: 20,
    backgroundColor: "#0F172A",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTexts: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: "#E0F2FE",
    fontFamily: "DINNextRoundedMedium",
  },
  timeTextGray: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedMedium",
  },
  timeTextGold: {
    fontSize: 14,
    color: "#D97706",
    fontFamily: "DINNextRoundedMedium",
  },
  zariMascot: {
    width: 90,
    height: 90,
  },
  topCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
    flex: 1,
  },
  boysCard: {
    width: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDark ? "rgba(59,130,246,0.16)" : "#C6EBFD",
    height: 120,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: isDark ? "rgba(96,165,250,0.28)" : "#A3D8F5",
  },
  boysImage: {
    width: 150,
    height: 110,
  },
  friendsProgressCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 18,
    marginTop: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  participantDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  participantName: {
    fontSize: 16,
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  participantLessons: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedMedium",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionBtnContent: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionBtnLabel: {
    fontSize: 14,
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  cardDivider: {
    height: 1.5,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  dailyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  dailyGoalsList: {
    gap: 16,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  goalLeft: {
    flex: 1,
    gap: 6,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  });
}

export default QuestScreen;
