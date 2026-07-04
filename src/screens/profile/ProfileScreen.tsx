import { AppText } from "../../components/ui/AppText";
import { GsapEnterBlock } from "../../components/animations/skia-gsap-opening";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { useI18n } from "../../hooks/useI18n";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticSelection } from "../../utils/haptics";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Fire02Icon,
  Shield01Icon,
  Award01Icon,
  BookOpen02Icon,
  Settings01Icon,
  Edit01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Layers01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { PressableScale, GlassCard } from "../../components/animations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabBarScrollPadding } from "../../constants/layout";
import { HomeMeshBackground, HomeLiquidCard } from "../../components/ui/ios-liquid-home";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { TwinoMascot, type TwinoPose } from "../../components/mascot/TwinoMascot";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, isKu } = useI18n();

  const streakDays = useProgressStore((s) => s.streakDays);
  const totalXp = useProgressStore((s) => s.totalXp);
  const dailyXp = useProgressStore((s) => s.dailyXp);
  const lastActivity = useProgressStore((s) => s.lastActivity);
  const pathMode = useSettingsStore((s) => s.pathMode);
  
  const userName = useSettingsStore((s) => s.userName);
  const setUserName = useSettingsStore((s) => s.setUserName);
  
  const userAge = useSettingsStore((s) => s.userAge);

  // Path index progress
  const pathIndexes = useProgressStore((s) => s.pathIndexes);
  const normalPathIndexes = useProgressStore((s) => s.normalPathIndexes);
  const kidsPathIndexes = useProgressStore((s) => s.kidsPathIndexes);
  
  const sourceLang = useLocaleStore((s) => s.selectedSourceLanguage);
  const targetLang = useLocaleStore((s) => s.selectedTargetLanguage);
  const langPair = `${sourceLang}-${targetLang}`;

  const streetCompleted = pathIndexes[langPair] || 0;
  const normalCompleted = normalPathIndexes[langPair] || 0;
  const kidsCompleted = kidsPathIndexes[langPair] || 0;

  // Editing username state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  // Selected Achievement Detail state
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);



  // Calculate learning level based on total XP
  const computedLevel = useMemo(() => {
    return Math.max(1, Math.floor(totalXp / 120) + 1);
  }, [totalXp]);

  const pathLabel = useMemo(() => {
    if (pathMode === "normal") return t("home.normalPath") || "Normal English";
    if (pathMode === "kids") return t("home.kidsPath") || "Kids English";
    return t("home.streetPath") || "Street English";
  }, [pathMode, t]);

  const nextLevelXp = computedLevel * 120;
  const prevLevelXp = (computedLevel - 1) * 120;
  const levelProgress = useMemo(() => {
    const earned = totalXp - prevLevelXp;
    const required = nextLevelXp - prevLevelXp;
    return Math.min(1, Math.max(0, earned / required));
  }, [totalXp, prevLevelXp, nextLevelXp]);

  // SVG Circular progress dimensions
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - levelProgress * circumference;

  // Weekly Activity Chart Data (Mocking Duolingo weekly bar chart)
  const weekDays = useMemo(() => {
    const today = new Date().getDay(); // 0 is Sun, 1 is Mon, etc.
    const days = [
      { name: isKu ? "ش" : "M", active: today === 1, xp: today === 1 ? dailyXp : 0 },
      { name: isKu ? "ی" : "T", active: today === 2, xp: today === 2 ? dailyXp : 0 },
      { name: isKu ? "د" : "W", active: today === 3, xp: today === 3 ? dailyXp : 0 },
      { name: isKu ? "س" : "T", active: today === 4, xp: today === 4 ? dailyXp : 0 },
      { name: isKu ? "چ" : "F", active: today === 5, xp: today === 5 ? dailyXp : 0 },
      { name: isKu ? "پ" : "S", active: today === 6, xp: today === 6 ? dailyXp : 0 },
      { name: isKu ? "ج" : "S", active: today === 0, xp: today === 0 ? dailyXp : 0 },
    ];
    return days;
  }, [dailyXp, isKu]);

  // Duolingo-style achievements
  const achievements = useMemo(() => [
    {
      id: "streak_master",
      title: isKu ? "پادشای بەردەوامی" : "Streak Master",
      desc: isKu ? "بەردەوام بە بۆ ماوەی ٣ ڕۆژ" : "Reach a 3-day learning streak",
      hint: isKu ? "٣ ڕۆژ بەردەوام بە لەسەر فێربوون بۆ بەدەستهێنانی تاجی بەردەوامی." : "Keep learning for 3 days in a row to unlock this fiery badge.",
      unlocked: streakDays >= 3,
      icon: Fire02Icon,
      color: "#FF9209",
    },
    {
      id: "xp_champion",
      title: isKu ? "پاڵەوانی خاڵ" : "XP Champion",
      desc: isKu ? "کۆکردنەوەی ١٥٠ خاڵی ئەزموون" : "Earn 150 total XP points",
      hint: isKu ? "کۆکردنەوەی ١٥٠ خاڵ لە هەر چالاکی یان وانەیەکی بەردەست لە ئەپەکەدا." : "Accumulate 150 XP from lessons, conversations, or games.",
      unlocked: totalXp >= 150,
      icon: Shield01Icon,
      color: "#1890FF",
    },
    {
      id: "quick_learner",
      title: isKu ? "فێربووی خێرا" : "Level Up",
      desc: isKu ? "گەیشتن بە ئاستی ٢ لە فێربوون" : "Reach Level 2 in learning",
      hint: isKu ? "خاڵ کۆبکەرەوە بۆ گەیشتن بە ئاستی فێربوونی بەرزتر لە پرۆفایلەکەتدا." : "Earn XP to advance to Level 2 and upgrade your ranking.",
      unlocked: computedLevel >= 2,
      icon: Award01Icon,
      color: "#52C41A",
    },
    {
      id: "fluent_voice",
      title: isKu ? "دەنگی ڕەوان" : "Active Learner",
      desc: isKu ? "تەواوکردنی یەکەم چالاکی فێربوون" : "Complete your first learning activity",
      hint: isKu ? "یەکەمین وانەی خۆت دەستپێبکە و بە سەرکەوتوویی تەواوی بکە." : "Take and complete your very first lesson to open this trophy.",
      unlocked: totalXp > 0,
      icon: Award01Icon,
      color: "#EB2F96",
    },
  ], [streakDays, totalXp, computedLevel, isKu]);

  const selectedAchievement = useMemo(() => {
    return achievements.find(a => a.id === selectedAchievementId);
  }, [achievements, selectedAchievementId]);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
      setIsEditingName(false);
      hapticSelection();
    }
  };

  const handleCancelEdit = () => {
    setNameInput(userName);
    setIsEditingName(false);
  };

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      
      {/* HEADER */}
      <GsapEnterBlock index={0}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <AppText style={styles.headerTitle} forceLatinFont latinRole="bold">
            {isKu ? "پڕۆفایل" : "Profile"}
          </AppText>
          <PressableScale
            style={styles.settingsBtn}
            onPress={() => {
              hapticSelection();
              router.push("/settings");
            }}
            scaleDown={0.9}
          >
            <HugeiconsIcon icon={Settings01Icon} size={22} color="#0F172A" strokeWidth={2.5} />
          </PressableScale>
        </View>
      </GsapEnterBlock>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarScrollPadding(insets.bottom) + 24,
          paddingHorizontal: 20,
        }}
        style={{ flex: 1 }}
      >
        {/* AVATAR & INFO CARD */}
        <GsapEnterBlock index={1}>
          <GlassCard style={styles.profileCard} intensity={35} borderRadius={24}>
            <View style={styles.profileCardTop}>
              <LinearGradient
                colors={["#4F46E5", "#3B82F6"]}
                style={styles.avatarGradient}
              >
                <AppText style={styles.avatarText} forceLatinFont latinRole="bold">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </AppText>
                <View style={styles.avatarRing} />
              </LinearGradient>

              <View style={styles.profileInfo}>
                {isEditingName ? (
                  <View style={styles.nameEditRow}>
                    <TextInput
                      style={styles.nameInput}
                      value={nameInput}
                      onChangeText={setNameInput}
                      placeholder={isKu ? "ناو بنووسە..." : "Enter name..."}
                      maxLength={18}
                      autoFocus
                    />
                    <View style={styles.editActionBtns}>
                      <TouchableOpacity onPress={handleSaveName} style={styles.actionBtn}>
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} color="#10B981" strokeWidth={3} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleCancelEdit} style={styles.actionBtn}>
                        <HugeiconsIcon icon={Cancel01Icon} size={18} color="#EF4444" strokeWidth={3} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.nameViewRow}>
                    <AppText style={styles.userNameText} forceLatinFont latinRole="bold">
                      {userName ? userName : "Student"}
                    </AppText>
                    <TouchableOpacity
                      onPress={() => {
                        setIsEditingName(true);
                        setNameInput(userName);
                        hapticSelection();
                      }}
                      style={styles.editIconBtn}
                    >
                      <HugeiconsIcon icon={Edit01Icon} size={16} color="#64748B" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                )}
                {userAge ? (
                  <AppText style={styles.userSubText}>
                    {isKu ? `${userAge} ساڵ` : `${userAge} years old`}
                  </AppText>
                ) : null}
                <View style={styles.pathBadge}>
                  <AppText style={styles.pathBadgeText} forceLatinFont latinRole="bold">
                    {pathLabel}
                  </AppText>
                </View>
              </View>
            </View>
          </GlassCard>
        </GsapEnterBlock>



        {/* CIRCULAR LEVEL PROGRESS */}
        <GsapEnterBlock index={3}>
          <GlassCard style={styles.levelCard} intensity={25} borderRadius={24}>
            <View style={styles.levelProgressContainer}>
              <View style={{ position: "relative", width: size, height: size }}>
                <Svg width={size} height={size}>
                  <Defs>
                    <SvgGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#10B981" />
                      <Stop offset="100%" stopColor="#059669" />
                    </SvgGradient>
                  </Defs>
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#progressGrad)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
                </Svg>
                <View style={styles.levelCircleInner}>
                  <AppText style={styles.levelNumberText} forceLatinFont latinRole="bold">
                    {computedLevel}
                  </AppText>
                  <AppText style={styles.levelLabelText} forceLatinFont latinRole="bold">
                    LVL
                  </AppText>
                </View>
              </View>
              
              <View style={styles.levelProgressTextCol}>
                <AppText style={styles.levelProgressHeading} forceLatinFont latinRole="bold">
                  {isKu ? "ئاستی پێشکەوتن" : "Level Progress"}
                </AppText>
                <AppText style={styles.levelProgressSub}>
                  {isKu ? `کۆبکەرەوە ${nextLevelXp - totalXp} خاڵی تر بۆ ئاستی نوێ` : `Earn ${nextLevelXp - totalXp} more XP to reach level ${computedLevel + 1}`}
                </AppText>
                <View style={styles.xpBadgeRow}>
                  <AppText style={styles.xpTextCount} forceLatinFont latinRole="bold">
                    {totalXp} / {nextLevelXp} XP
                  </AppText>
                </View>
              </View>
            </View>
          </GlassCard>
        </GsapEnterBlock>

        {/* CORE STATS GRID */}
        <GsapEnterBlock index={4}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <HomeLiquidCard contentStyle={styles.statItemInner} radius={20}>
                {streakDays > 0 && <View style={styles.flameGlow} />}
                <View style={[styles.statIconBox, { backgroundColor: "#FFEFE6" }]}>
                  <HugeiconsIcon icon={Fire02Icon} size={24} color="#FF7A00" strokeWidth={2.5} />
                </View>
                <AppText style={styles.statValue} forceLatinFont latinRole="bold">
                  {streakDays}
                </AppText>
                <AppText style={styles.statLabel} forceLatinFont latinRole="bold">
                  {isKu ? "ڕۆژی بەردەوامی" : "Day Streak"}
                </AppText>
              </HomeLiquidCard>
            </View>

            <View style={styles.statItem}>
              <HomeLiquidCard contentStyle={styles.statItemInner} radius={20}>
                <View style={[styles.statIconBox, { backgroundColor: "#E6F4FF" }]}>
                  <HugeiconsIcon icon={Shield01Icon} size={24} color="#0050B3" strokeWidth={2.5} />
                </View>
                <AppText style={styles.statValue} forceLatinFont latinRole="bold">
                  {totalXp}
                </AppText>
                <AppText style={styles.statLabel} forceLatinFont latinRole="bold">
                  {isKu ? "کۆی خاڵەکان" : "Total XP"}
                </AppText>
              </HomeLiquidCard>
            </View>
          </View>
        </GsapEnterBlock>

        {/* WEEKLY XP CHART */}
        <GsapEnterBlock index={5}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle} forceLatinFont latinRole="bold">
              {isKu ? "چالاکی هەفتانە" : "Weekly Activity"}
            </AppText>
          </View>
          <GlassCard style={styles.weeklyChartCard} intensity={25} borderRadius={24}>
            <View style={styles.weeklyChartRow}>
              {weekDays.map((day, idx) => {
                const heightPercent = day.xp > 0 ? Math.min(100, (day.xp / 15) * 100) : 10;
                return (
                  <View key={idx} style={styles.chartCol}>
                    <View style={styles.chartBarTrack}>
                      <LinearGradient
                        colors={day.active ? ["#38BDF8", "#0284C7"] : ["#E2E8F0", "#CBD5E1"]}
                        style={[styles.chartBarFill, { height: `${heightPercent}%` }]}
                      />
                    </View>
                    <AppText style={[styles.chartDayText, day.active && styles.chartDayTextActive]} forceLatinFont latinRole="bold">
                      {day.name}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </GsapEnterBlock>

        {/* DETAILED PATH PROGRESS */}
        <GsapEnterBlock index={6}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle} forceLatinFont latinRole="bold">
              {isKu ? "پێشکەوتنی ڕێڕەوەکان" : "Path Progress"}
            </AppText>
          </View>
          <GlassCard style={styles.pathsCard} intensity={20} borderRadius={24}>
            {[
              {
                id: "street",
                title: isKu ? "ڕێڕەوی کوردی (Street)" : "Kurdish Path (Street)",
                lessons: streetCompleted,
                color: "#1CB0F6",
                icon: Fire02Icon,
              },
              {
                id: "normal",
                title: isKu ? "ئینگلیزی ئاسایی (Normal)" : "Classic Path (Normal)",
                lessons: normalCompleted,
                color: "#7C3AED",
                icon: Layers01Icon,
              },
              {
                id: "kids",
                title: isKu ? "ئینگلیزی منداڵان (Kids)" : "Kids Path (Kids)",
                lessons: kidsCompleted,
                color: "#FF9600",
                icon: Award01Icon,
              },
            ].map((p, idx) => (
              <View
                key={p.id}
                style={[
                  styles.pathRow,
                  idx < 2 && styles.pathRowBorder,
                  pathMode === p.id && styles.activePathRow,
                ]}
              >
                <View style={[styles.pathIconWrapper, { backgroundColor: `${p.color}15` }]}>
                  <HugeiconsIcon icon={p.icon} size={20} color={p.color} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.pathRowTitle} forceLatinFont latinRole="bold">
                    {p.title}
                  </AppText>
                  <AppText style={styles.pathRowLessonsCount} forceLatinFont>
                    {isKu ? `${p.lessons} وانەی تەواوکراو` : `${p.lessons} lessons completed`}
                  </AppText>
                </View>
                {pathMode === p.id && (
                  <View style={[styles.activePathBadge, { backgroundColor: p.color }]}>
                    <AppText style={styles.activePathBadgeText} forceLatinFont latinRole="bold">
                      {isKu ? "چالاک" : "Active"}
                    </AppText>
                  </View>
                )}
              </View>
            ))}
          </GlassCard>
        </GsapEnterBlock>

        {/* ACHIEVEMENTS */}
        <GsapEnterBlock index={7}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle} forceLatinFont latinRole="bold">
              {isKu ? "دەستکەوتەکان" : "Achievements"}
            </AppText>
          </View>
          
          <View style={styles.achievementsList}>
            {achievements.map((item) => (
              <PressableScale
                key={item.id}
                onPress={() => {
                  setSelectedAchievementId(selectedAchievementId === item.id ? null : item.id);
                  hapticSelection();
                }}
                scaleDown={0.97}
              >
                <GlassCard
                  style={[
                    styles.achievementCard,
                    !item.unlocked && styles.lockedAchievement,
                    selectedAchievementId === item.id && styles.selectedAchievementBorder,
                  ]}
                  intensity={item.unlocked ? 30 : 15}
                  borderRadius={20}
                >
                  <View style={[
                    styles.achievementIconBox,
                    { backgroundColor: item.unlocked ? `${item.color}15` : "#F1F5F9" }
                  ]}>
                    <HugeiconsIcon
                      icon={item.icon}
                      size={28}
                      color={item.unlocked ? item.color : "#94A3B8"}
                      strokeWidth={2.5}
                    />
                  </View>
                  <View style={styles.achievementInfo}>
                    <AppText
                      style={[styles.achievementTitle, !item.unlocked && { color: "#64748B" }]}
                      forceLatinFont
                      latinRole="bold"
                    >
                      {item.title}
                    </AppText>
                    <AppText style={styles.achievementDesc}>
                      {item.desc}
                    </AppText>
                  </View>
                  
                  {item.unlocked ? (
                    <View style={styles.unlockedDot} />
                  ) : (
                    <View style={styles.lockBadge}>
                      <HugeiconsIcon icon={Shield01Icon} size={12} color="#64748B" strokeWidth={2.5} />
                    </View>
                  )}
                </GlassCard>
              </PressableScale>
            ))}
          </View>

          {/* Achievement detail modal overlay/card */}
          {selectedAchievement && (
            <GlassCard style={styles.detailOverlayCard} intensity={40} borderRadius={24}>
              <View style={styles.detailHeader}>
                <View style={[styles.detailIconBox, { backgroundColor: `${selectedAchievement.color}15` }]}>
                  <HugeiconsIcon icon={selectedAchievement.icon} size={24} color={selectedAchievement.color} strokeWidth={2.5} />
                </View>
                <AppText style={styles.detailTitle} forceLatinFont latinRole="bold">
                  {selectedAchievement.title}
                </AppText>
                <TouchableOpacity
                  onPress={() => setSelectedAchievementId(null)}
                  style={styles.closeDetailBtn}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} color="#64748B" strokeWidth={3} />
                </TouchableOpacity>
              </View>
              <AppText style={styles.detailDesc}>
                {selectedAchievement.hint}
              </AppText>
              <View style={styles.detailRewardRow}>
                <AppText style={styles.detailStatusText} forceLatinFont latinRole="bold">
                  {selectedAchievement.unlocked ? (isKu ? "تەواوبووە ✓" : "Unlocked ✓") : (isKu ? "داخراوە" : "In Progress")}
                </AppText>
                <View style={[styles.rewardBadge, { backgroundColor: selectedAchievement.unlocked ? "#10B981" : "#64748B" }]}>
                  <AppText style={styles.rewardText} forceLatinFont latinRole="bold">
                    +50 XP
                  </AppText>
                </View>
              </View>
            </GlassCard>
          )}
        </GsapEnterBlock>

        {/* RECENT ACTIVITY */}
        {lastActivity ? (
          <GsapEnterBlock index={8}>
            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle} forceLatinFont latinRole="bold">
                {isKu ? "دوایین چالاکی" : "Recent Activity"}
              </AppText>
            </View>
            <GlassCard style={styles.activityCard} intensity={25} borderRadius={20}>
              <View style={styles.activityIconBox}>
                <HugeiconsIcon icon={BookOpen02Icon} size={22} color="#0F172A" strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={styles.activityTitle} forceLatinFont latinRole="bold">
                  {lastActivity.kind === "lesson" ? (isKu ? "وانە تەواوکراوە" : "Lesson Completed") : (isKu ? "یاری تەواوکراوە" : "Game Completed")}
                </AppText>
                <AppText style={styles.activityDesc} forceLatinFont>
                  {lastActivity.label}
                </AppText>
              </View>
            </GlassCard>
          </GsapEnterBlock>
        ) : null}
      </ScrollView>
      <BottomScrollFade />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
    fontFamily: "DINNextRoundedBold",
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  profileCard: {
    padding: 20,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  profileCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarGradient: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarRing: {
    position: "absolute",
    top: -3,
    bottom: -3,
    left: -3,
    right: -3,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  avatarText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  nameViewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  nameInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "bold",
    borderWidth: 1.5,
    borderColor: "#4F46E5",
  },
  editActionBtns: {
    flexDirection: "row",
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  editIconBtn: {
    padding: 4,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  userSubText: {
    fontSize: 14,
    color: "#64748B",
    fontFamily: "DINNextRoundedMedium",
  },
  pathBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  pathBadgeText: {
    fontSize: 12,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mascotBuddyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  mascotLeftCol: {
    flex: 1,
    gap: 4,
  },
  mascotCardTitle: {
    fontSize: 16,
    color: "#0F172A",
  },
  mascotCardSub: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  poseIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  poseIndicatorText: {
    fontSize: 10,
    color: "#4F46E5",
  },
  mascotRightCol: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  levelCard: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  levelProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  levelCircleInner: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  levelNumberText: {
    fontSize: 28,
    color: "#0F172A",
    lineHeight: 32,
  },
  levelLabelText: {
    fontSize: 10,
    color: "#64748B",
    letterSpacing: 0.5,
  },
  levelProgressTextCol: {
    flex: 1,
    gap: 4,
  },
  levelProgressHeading: {
    fontSize: 16,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  levelProgressSub: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  xpBadgeRow: {
    alignSelf: "flex-start",
    backgroundColor: "#E6F4FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  xpTextCount: {
    fontSize: 12,
    color: "#0958D9",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    position: "relative",
  },
  statItemInner: {
    padding: 16,
    alignItems: "center",
    gap: 6,
    position: "relative",
    overflow: "hidden",
  },
  flameGlow: {
    position: "absolute",
    top: -20,
    bottom: -20,
    left: -20,
    right: -20,
    borderRadius: 999,
    backgroundColor: "#FF7A00",
    opacity: 0.08,
    zIndex: 0,
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    zIndex: 1,
  },
  statValue: {
    fontSize: 22,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    zIndex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "DINNextRoundedMedium",
    zIndex: 1,
  },
  weeklyChartCard: {
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  weeklyChartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 90,
  },
  chartCol: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  chartBarTrack: {
    width: 14,
    height: 60,
    backgroundColor: "#F1F5F9",
    borderRadius: 99,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 99,
  },
  chartDayText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  chartDayTextActive: {
    color: "#0284C7",
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  pathsCard: {
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  pathRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
    borderRadius: 16,
  },
  pathRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  activePathRow: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  pathIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pathRowTitle: {
    fontSize: 14,
    color: "#0F172A",
  },
  pathRowLessonsCount: {
    fontSize: 12,
    color: "#64748B",
  },
  activePathBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activePathBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  achievementsList: {
    gap: 12,
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  lockedAchievement: {
    opacity: 0.75,
  },
  selectedAchievementBorder: {
    borderColor: "#4F46E5",
  },
  achievementIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementInfo: {
    flex: 1,
    gap: 2,
  },
  achievementTitle: {
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  achievementDesc: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "DINNextRoundedMedium",
  },
  unlockedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  lockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  detailOverlayCard: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "rgba(79, 70, 229, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 16,
    color: "#0F172A",
    flex: 1,
  },
  closeDetailBtn: {
    padding: 4,
  },
  detailDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 12,
  },
  detailRewardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailStatusText: {
    fontSize: 13,
    color: "#4F46E5",
  },
  rewardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  activityIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: {
    fontSize: 14,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  activityDesc: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "DINNextRoundedMedium",
  },
});
