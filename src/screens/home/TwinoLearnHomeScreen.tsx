import { AppText } from "../../components/ui/AppText";
import { GsapEnterBlock } from "../../components/animations/skia-gsap-opening";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { useI18n } from "../../hooks/useI18n";
import { useProgressStore, useCurrentProgress } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { hapticSelection } from "../../utils/haptics";
import {
  buildLessonRouteForMode,
  buildLessonRouteFromMeta,
  getCurrentLessonMeta,
} from "../../utils/lesson-navigation";
import { buildSectionData } from "../../data/list-items";
import { buildNormalSectionData } from "../../data/normal-english";
import { buildKidsSectionData } from "../../data/kids-english";
import { getLessonBank } from "../../data/content-access";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Fire02Icon, Clock01Icon, Coffee01Icon, Airplane01Icon, LockIcon, Mic01Icon, Notification01Icon, PlayIcon, ArrowRight01Icon, BookOpen02Icon } from "@hugeicons/core-free-icons";
import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PressableScale } from "../../components/animations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabBarScrollPadding } from "../../constants/layout";

const BRAND_ICON = require("../../../assets/images/logo-compressed.png");

// Safely map Tailwind colors from HTML
const Colors = {
  background: "#FFFFFF",
  foreground: "#0F172A",
  primary: "#0F172A",
  secondary: "#0F172A",
  muted: "#F8FAFC",
  mutedForeground: "#64748B",
  border: "#E2E8F0",
  destructive: "#0F172A",
  card: "#FFFFFF",
  cardSurface: "#FFFFFF",
  borderStrong: "rgba(0,0,0,0.06)",
  warmBg: "#FFFFFF",
  darkBg: "#0F172A",
};


export function TwinoLearnHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale, isKu } = useI18n();

  const streakDays = useProgressStore((s) => s.streakDays);
  const streetNext = useCurrentProgress().nextLessonPathIndex;
  const normalNext = useCurrentProgress().normalNextLessonPathIndex;
  const kidsNext = useCurrentProgress().kidsNextLessonPathIndex;
  const pathMode = useSettingsStore((s) => s.pathMode);
  const userName = useSettingsStore((s) => s.userName);

  const onStartLesson = useCallback(() => {
    hapticSelection();
    const meta = getCurrentLessonMeta(
      pathMode,
      streetNext,
      normalNext,
      locale,
      kidsNext,
    );
    const route = meta
      ? buildLessonRouteFromMeta(meta)
      : buildLessonRouteForMode(pathMode, streetNext, normalNext, kidsNext);
    if (route) {
      router.push(route);
      return;
    }
    router.push({
      pathname: "/dashboard",
      params: { mode: pathMode },
    });
  }, [kidsNext, locale, normalNext, pathMode, router, streetNext]);

  const onOpenVoiceTutor = useCallback(() => {
    hapticSelection();
    router.push("/voice-tutor");
  }, [router]);

  const onOpenPath = useCallback(() => {
    hapticSelection();
    router.push("/path");
  }, [router]);

  const ready = useProgressStore((s) => s.ready);
  const dailyXp = useProgressStore((s) => s.dailyXp);
  
  // Calculate practice minutes: estimate 3 minutes per 10 XP
  const practiceMinutes = ready ? Math.round(dailyXp * 0.3) : null;

  // Flatten lessons to resolve the active and subsequent locked lesson dynamically
  const sections = React.useMemo(() => {
    if (pathMode === "normal") return buildNormalSectionData(normalNext);
    if (pathMode === "kids") return buildKidsSectionData(kidsNext);
    return buildSectionData(streetNext);
  }, [pathMode, normalNext, kidsNext, streetNext]);

  const allLessons = React.useMemo(() => {
    return sections.flatMap((section) => section.data);
  }, [sections]);

  const activeLessonIndex = React.useMemo(() => {
    const idx = allLessons.findIndex((l) => l.status === "current");
    if (idx !== -1) return idx;
    const lockedIdx = allLessons.findIndex((l) => l.status === "locked");
    if (lockedIdx !== -1) return lockedIdx;
    return 0;
  }, [allLessons]);

  const activeItem = allLessons[activeLessonIndex];
  const lockedItem = allLessons[activeLessonIndex + 1];

  const activeBank = React.useMemo(() => {
    if (!activeItem) return undefined;
    return getLessonBank(pathMode, activeItem.lessonId, activeItem.sectionItemIndex);
  }, [pathMode, activeItem]);

  const lockedBank = React.useMemo(() => {
    if (!lockedItem) return undefined;
    return getLessonBank(pathMode, lockedItem.lessonId, lockedItem.sectionItemIndex);
  }, [pathMode, lockedItem]);

  const getLessonCategory = (type: string) => {
    switch (type) {
      case "speaking":
        return "Speaking";
      case "conversation":
        return "Conversation";
      case "gift":
        return "Bonus";
      default:
        return "Practice";
    }
  };

  const getLessonIcon = (type: string) => {
    if (type === "speaking") return Mic01Icon;
    if (type === "conversation") return Coffee01Icon;
    return Coffee01Icon;
  };

  const getLessonCategoryKey = (type: string) => {
    switch (type) {
      case "speaking":
        return "twinoHome.categorySpeaking";
      case "conversation":
        return "twinoHome.categoryConversation";
      case "gift":
        return "twinoHome.categoryBonus";
      default:
        return "twinoHome.categoryPractice";
    }
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <GsapEnterBlock index={0}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerLeft}>
          <Image source={BRAND_ICON} style={styles.headerLogo} contentFit="contain" />
          <AppText style={styles.headerTitle} forceLatinFont latinRole="bold">
            Twino
          </AppText>
        </View>
        <View style={styles.notificationBtn}>
          <HugeiconsIcon icon={Notification01Icon} size={20} color={Colors.foreground} strokeWidth={2.5} />
          <View style={styles.notificationDot} />
        </View>
      </View>
      </GsapEnterBlock>

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: tabBarScrollPadding(insets.bottom) + 24,
            paddingHorizontal: 24,
          }}
        >
          {/* GREETING */}
          <GsapEnterBlock index={1}>
          <View style={styles.greetingSection}>
            <AppText style={styles.greetingSub}>{t("twinoHome.welcomeBack")}</AppText>
            <AppText style={styles.greetingTitle} forceLatinFont latinRole="bold">
              {userName ? `${userName} 👋` : "Friend 👋"}
            </AppText>
          </View>
          </GsapEnterBlock>

          {/* AI LIVE TUTOR */}
          <GsapEnterBlock index={2}>
          <View style={styles.aiCard}>
            <View style={styles.aiCardContent}>
              <View style={styles.aiBadge}>
                <View style={styles.aiPulseWrap}>
                  <View style={styles.aiPulsePing} />
                  <View style={styles.aiPulseDot} />
                </View>
                <AppText style={styles.aiBadgeText}>{t("twinoHome.aiLiveTutor")}</AppText>
              </View>
              
              <AppText style={styles.aiCardTitle} forceLatinFont latinRole="bold">{t("twinoHome.speakNatural")}</AppText>
              <AppText style={styles.aiCardSub}>
                {t("twinoHome.aiTutorDesc")}
              </AppText>
            </View>
              
            <View style={styles.aiCardBtnRow}>
              <PressableScale 
                style={[styles.aiCardBtn, styles.btn3DPrimary]}
                onPress={onOpenVoiceTutor}
                scaleDown={0.96}
              >
                <HugeiconsIcon icon={Mic01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
                <AppText style={styles.aiCardBtnText} forceLatinFont latinRole="bold">{t("twinoHome.startConversation")}</AppText>
              </PressableScale>

              <PressableScale 
                style={[styles.learnBtn, styles.btn3DSecondary]}
                onPress={onOpenPath}
                scaleDown={0.96}
              >
                <HugeiconsIcon icon={BookOpen02Icon} size={20} color="#2B59F3" strokeWidth={2.5} />
                <AppText style={styles.learnBtnText} forceLatinFont latinRole="bold">{t("twinoHome.learn")}</AppText>
              </PressableScale>
            </View>
            
            <Image 
              source={BRAND_ICON} 
              style={styles.aiCardLogo} 
              contentFit="contain" 
            />
          </View>
          </GsapEnterBlock>

          {/* STATS ROW */}
          <GsapEnterBlock index={3}>
          <View style={styles.statsRow}>
            <PressableScale style={styles.statBox} scaleDown={0.96} onPress={() => {}}>
              <View style={styles.statHeader}>
                <View style={styles.statIconWrap}>
                  <HugeiconsIcon icon={Fire02Icon} size={32} color={Colors.primary} strokeWidth={2.5} />
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={Colors.mutedForeground} strokeWidth={2.5} />
              </View>
              <View>
                <AppText style={styles.statNumber} forceLatinFont latinRole="bold">{streakDays}</AppText>
                <AppText style={styles.statLabel} forceLatinFont latinRole="bold">{t("twinoHome.dayStreak")}</AppText>
              </View>
            </PressableScale>

            <PressableScale style={styles.statBox} scaleDown={0.96} onPress={() => {}}>
              <View style={styles.statHeader}>
                <View style={styles.statIconWrap}>
                  <HugeiconsIcon icon={Clock01Icon} size={32} color={Colors.secondary} strokeWidth={2.5} />
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={Colors.mutedForeground} strokeWidth={2.5} />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <AppText style={styles.statNumber} forceLatinFont latinRole="bold">
                    {practiceMinutes !== null ? practiceMinutes : "--"}
                  </AppText>
                  <AppText style={styles.statUnit} forceLatinFont latinRole="bold">{t("twinoHome.min")}</AppText>
                </View>
                <AppText style={styles.statLabel} forceLatinFont latinRole="bold">{t("twinoHome.practiceToday")}</AppText>
              </View>
            </PressableScale>
          </View>
          </GsapEnterBlock>

          {/* UP NEXT */}
          <GsapEnterBlock index={4}>
          <View style={styles.upNextHeader}>
            <AppText style={styles.upNextTitle} forceLatinFont latinRole="bold">{t("twinoHome.upNext")}</AppText>
            <AppText style={styles.viewAllText} forceLatinFont latinRole="bold">{t("twinoHome.viewAll")}</AppText>
          </View>

          <View style={styles.lessonsList}>
            {/* Active Lesson */}
            {/* Active Lesson */}
            <PressableScale 
              style={[styles.lessonItem, styles.lessonItemActive]} 
              onPress={onStartLesson}
              scaleDown={0.97}
            >
              <View style={styles.lessonEmojiBox}>
                <HugeiconsIcon icon={activeItem ? getLessonIcon(activeItem.type) : Coffee01Icon} size={32} color={Colors.primary} strokeWidth={2.5} />
              </View>
              <View style={styles.lessonDetails}>
                <AppText style={styles.lessonTitle} forceLatinFont latinRole="bold">
                  {activeBank ? (isKu ? activeBank.topicKu : activeBank.topic) : t("twinoHome.fallbackActive")}
                </AppText>
                <View style={styles.lessonMeta}>
                  <AppText style={styles.lessonCategory}>
                    {activeItem ? t(getLessonCategoryKey(activeItem.type)) : t("twinoHome.categoryPractice")}
                  </AppText>
                  <View style={styles.lessonDot} />
                  <AppText style={styles.lessonDurationActive} forceLatinFont latinRole="bold">
                    {activeItem?.type === "conversation" ? `10 ${t("twinoHome.mins")}` : `5 ${t("twinoHome.mins")}`}
                  </AppText>
                </View>
              </View>
              <View style={styles.playBtn}>
                <HugeiconsIcon icon={PlayIcon} size={14} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 1 }} />
              </View>
            </PressableScale>

            {/* Locked Lesson */}
            {lockedItem && (
              <View style={[styles.lessonItem, styles.lessonItemLocked]}>
                <View style={styles.lessonEmojiBox}>
                  <HugeiconsIcon icon={lockedItem ? getLessonIcon(lockedItem.type) : Airplane01Icon} size={32} color="#94A3B8" strokeWidth={2.5} />
                </View>
                <View style={styles.lessonDetails}>
                  <AppText style={styles.lessonTitle} forceLatinFont latinRole="bold">
                    {lockedBank ? (isKu ? lockedBank.topicKu : lockedBank.topic) : t("twinoHome.fallbackLocked")}
                  </AppText>
                  <View style={styles.lessonMeta}>
                    <AppText style={styles.lessonCategory}>
                      {lockedItem ? t(getLessonCategoryKey(lockedItem.type)) : t("twinoHome.categoryPractice")}
                    </AppText>
                    <View style={styles.lessonDot} />
                    <AppText style={styles.lessonDuration}>
                      {lockedItem?.type === "conversation" ? `10 ${t("twinoHome.mins")}` : `5 ${t("twinoHome.mins")}`}
                    </AppText>
                  </View>
                </View>
                <View style={styles.lockBtn}>
                  <HugeiconsIcon icon={LockIcon} size={16} color={Colors.mutedForeground} strokeWidth={2.5} />
                </View>
              </View>
            )}
          </View>
          </GsapEnterBlock>

        </ScrollView>

        {/* Blurred Gradient Overlay above Navbar */}
        <BottomScrollFade />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.foreground,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: Colors.destructive,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  greetingSection: {
    marginTop: 8,
    marginBottom: 32,
  },
  greetingSub: {
    fontSize: 16,
    color: Colors.mutedForeground,
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 32,
    color: Colors.foreground,
  },
  aiCard: {
    backgroundColor: Colors.warmBg,
    borderRadius: 28,
    padding: 24,
    marginBottom: 32,
    position: "relative",
    overflow: "hidden", // To crop logo if it overflows
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.06)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  aiCardContent: {
    zIndex: 2,
    paddingRight: 100,
  },
  aiCardLogo: {
    position: "absolute",
    right: -25,
    top: 0,
    width: 200,
    height: 200,
    opacity: 0.9,
    zIndex: 1,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  aiPulseWrap: {
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  aiPulsePing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  aiPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: Colors.foreground,
  },
  aiCardTitle: {
    fontSize: 26,
    color: Colors.foreground,
    marginBottom: 12,
    lineHeight: 32,
  },
  aiCardSub: {
    fontSize: 15,
    color: Colors.mutedForeground,
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: "100%",
  },
  aiCardBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  aiCardBtnText: {
    color: Colors.background,
    fontSize: 14,
  },
  aiCardBtnRow: {
    flexDirection: "row",
    gap: 12,
    zIndex: 2,
    width: "100%",
    marginTop: 8,
  },
  learnBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  learnBtnText: {
    color: "#2B59F3",
    fontSize: 14,
  },
  btn3DPrimary: {
    backgroundColor: "#2B59F3",
    borderWidth: 1.5,
    borderColor: "#1A49D3",
    borderBottomWidth: 5,
    borderBottomColor: "#102F9C",
  },
  btn3DSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderBottomWidth: 5,
    borderBottomColor: "#CBD5E1",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 16,
    marginBottom: 36,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.cardSurface,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    padding: 20,
    borderRadius: 24,
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 28,
    color: Colors.foreground,
  },
  statUnit: {
    fontSize: 14,
    color: Colors.mutedForeground,
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 4,
  },
  upNextHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  upNextTitle: {
    fontSize: 22,
    color: Colors.foreground,
  },
  viewAllText: {
    fontSize: 15,
    color: Colors.primary,
  },
  lessonsList: {
    gap: 16,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardSurface,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    padding: 20,
    borderRadius: 24,
    gap: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  lessonItemActive: {
    borderColor: "rgba(0, 0, 0, 0.15)",
    backgroundColor: Colors.warmBg,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  lessonItemLocked: {
    opacity: 0.6,
  },
  lessonEmojiBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    color: Colors.foreground,
    marginBottom: 6,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lessonCategory: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  lessonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  lessonDuration: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  lessonDurationActive: {
    fontSize: 13,
    color: Colors.primary,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lockBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
});
