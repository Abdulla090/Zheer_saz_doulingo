/* eslint-disable */
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhingoMascot from "../../../assets/images/svg/phingo charecter.svg";
import { useRouter } from "expo-router";
import {
  AnimatedCard,
  PressableScale,
  GlassCard,
} from "../../components/animations";
import {
  Icon3DCheck,
  Icon3DStar,
  Icon3DFire,
  Icon3DDiamond,
  Icon3DBell,
  Icon3DShield,
  Icon3DStarPurple,
  Icon3DZap,
  Icon3DAward,
  Icon3DLock,
  Icon3DTarget,
  Icon3DBook,
  Icon3DGamepad,
  Icon3DPencil,
  Icon3DFlag,
  Icon3DSearch,
  Icon3DMic,
} from "../../components/icons/Icon3D";

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#F5F9FF",
  card: "#FFFFFF",
  border: "#F1F5F9",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  accent: "#1A73E8",
  accentLight: "#DBEAFE",
  streak: "#F97316",
};

import { crossShadow } from "../../utils/shadows";

const shadow = (elevation = 1) => ({
  borderWidth: 1,
  borderColor: C.border,
  ...crossShadow({
    color: "#000",
    offsetY: elevation,
    blur: elevation * 3,
    opacity: 0.04,
    elevation,
  }),
});

export function MainDashboardScreen({
  onSwitchToNormal,
}: {
  onSwitchToNormal?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={s.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#DBEAFE", "transparent"]}
        style={[s.bgGradient, { pointerEvents: "none" as any }]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
        }}
        style={s.scroll}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <AnimatedCard index={0} delay={100}>
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.logoCol}>
                <Text style={s.logoText}>Phingo</Text>
                <Text style={s.logoSub}>Dolphin AI</Text>
              </View>
            </View>

            <View style={s.headerRight}>
              {/* Streak pill */}
              <PressableScale style={[s.pill, shadow(1)]}>
                <Icon3DFire size={18} />
                <Text style={s.pillText}>12</Text>
              </PressableScale>
              {/* Gems pill */}
              <PressableScale style={[s.pill, shadow(1)]}>
                <Icon3DDiamond size={18} />
                <Text style={s.pillText}>340</Text>
              </PressableScale>
              {/* Bell */}
              <PressableScale style={s.bellBtn} hapticStyle={"light" as any}>
                <Icon3DBell size={22} />
                <View style={s.bellDot} />
              </PressableScale>
            </View>
          </View>
        </AnimatedCard>

        {/* ── Hero Banner ─────────────────────────────────────── */}
        <AnimatedCard index={1} delay={100}>
          <View style={s.heroWrap}>
            <GlassCard style={s.heroBubble} intensity={50} borderRadius={24}>
              <Text style={s.heroTitle}>Hi Arjun! 👋🏼</Text>
              <Text style={s.heroSub}>
                Ready to dive into something amazing today?
              </Text>
              {/* Speech bubble tail */}
              <View style={s.bubbleTail} />
            </GlassCard>
            <View style={s.mascotWrap}>
              <PhingoMascot width="100%" height="100%" />
            </View>
          </View>
        </AnimatedCard>

        {/* ── Search Bar ──────────────────────────────────────── */}
        <AnimatedCard index={2} delay={100}>
          <GlassCard
            style={[s.searchBar, shadow(1)]}
            intensity={35}
            borderRadius={99}
          >
            <Icon3DSearch size={20} />
            <TextInput
              placeholder="Search anything to learn..."
              placeholderTextColor={C.textTertiary}
              style={s.searchInput}
            />
            <Icon3DMic size={20} />
          </GlassCard>
        </AnimatedCard>

        {/* ── Grid: Goal + Streak / XP ────────────────────────── */}
        <AnimatedCard index={3} delay={100} style={s.gridRow}>
          {/* Today's Goal */}
          <View style={[s.gridCard, s.gridCardSmall, shadow(1)]}>
            <View style={s.cardHeaderRow}>
              <Icon3DTarget size={14} />
              <Text style={s.cardLabel}>Today's Goal</Text>
            </View>
            <View style={s.goalMiddle}>
              <View style={s.goalTextCol}>
                <View style={s.goalNumbers}>
                  <Text style={s.goalBig}>2</Text>
                  <Text style={s.goalSlash}>/3</Text>
                </View>
                <Text style={s.goalUnit}>Lessons</Text>
              </View>
              {/* Goal ring */}
              <View style={s.goalRing}>
                <Icon3DCheck size={22} />
              </View>
            </View>
          </View>

          {/* Learning Streak */}
          <View style={[s.gridCard, s.gridCardSmall, shadow(1)]}>
            <View style={s.cardHeaderRow}>
              <Icon3DFire size={14} />
              <Text style={s.cardLabel}>Learning Streak</Text>
            </View>
            <View style={s.streakMiddle}>
              <Text style={s.streakBig}>12</Text>
              <Text style={s.streakUnit}>days</Text>
            </View>
            <View style={s.streakDots}>
              {["S", "S", "F", "T", "W", "T", "M"].map((day, i) => {
                const isActive = i < 5;
                const isStar = i === 6;
                return (
                  <View key={i} style={s.streakDay}>
                    <Text style={s.streakDayLabel}>{day}</Text>
                    {isActive ? (
                      <Icon3DCheck size={18} />
                    ) : isStar ? (
                      <Icon3DStar size={18} />
                    ) : (
                      <View style={s.streakInactive}>
                        <View style={s.streakInactiveDot} />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </AnimatedCard>

        {/* XP Progress */}
        <AnimatedCard index={4} delay={100} style={[s.xpCard, shadow(1)]}>
          <View style={s.xpHeader}>
            <View style={s.xpHeaderLeft}>
              <Icon3DShield size={20} />
              <Text style={s.cardLabel}>XP Progress</Text>
            </View>
            <Text style={s.xpLevel}>Level 12</Text>
          </View>
          <View style={s.xpBarBg}>
            <View style={[s.xpBarFill, { width: "65%" }]} />
          </View>
          <Text style={s.xpText}>3200 / 5000 XP</Text>
        </AnimatedCard>

        {/* ── Journey Card ────────────────────────────────────── */}
        <AnimatedCard index={5} delay={100}>
          <LinearGradient
            colors={["#93C5FD", "#BFDBFE", "#DBEAFE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.journeyCard}
          >
            <View style={s.journeyContent}>
              <Text style={s.journeyTitle}>Continue Your Journey</Text>
              <View style={s.journeyLessonRow}>
                <Icon3DCheck size={18} />
                <Text style={s.journeyLessonName}>AI Basics</Text>
              </View>
              <Text style={s.journeyLessonSub}>Lesson 3: What is AI?</Text>
              <View style={s.journeyProgressRow}>
                <View style={s.journeyBarBg}>
                  <View style={[s.journeyBarFill, { width: "60%" }]} />
                </View>
                <Text style={s.journeyPercent}>60%</Text>
              </View>
              <PressableScale
                style={[s.journeyCta, shadow(2)]}
                onPress={onSwitchToNormal}
                scaleDown={0.93}
              >
                <Text style={s.journeyCtaText}>Continue Path</Text>
              </PressableScale>
            </View>
            <View style={s.journeyMascot}>
              <Image
                source={{
                  uri: "https://ggrhecslgdflloszjkwl.supabase.co/storage/v1/object/public/user-assets/WN31PESNqnk/components/Pf9EJxsRI9K.png",
                }}
                contentFit="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </LinearGradient>
        </AnimatedCard>

        {/* ── Explore Modes ───────────────────────────────────── */}
        <AnimatedCard index={6} delay={100} style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Explore Modes</Text>
            <TouchableOpacity>
              <Text style={s.sectionLink}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={s.modesGrid}>
            {[
              {
                label: "Learn",
                sub: "Path &\nLessons",
                Icon: Icon3DBook,
                bg: "#EAF3FF",
                border: "#BFDBFE",
                onPress: onSwitchToNormal,
              },
              {
                label: "Game",
                sub: "Play & earn\nrewards",
                Icon: Icon3DGamepad,
                bg: "#F4EAFF",
                border: "#E9D5FF",
              },
              {
                label: "Practice",
                sub: "Hands-on\nexercises",
                Icon: Icon3DPencil,
                bg: "#FFFBEB",
                border: "#FDE68A",
              },
              {
                label: "Quests",
                sub: "Complete quests\n& unlock",
                Icon: Icon3DFlag,
                bg: "#EFF6FF",
                border: "#BFDBFE",
              },
            ].map(({ label, sub, Icon, bg, border, onPress }) => (
              <PressableScale
                key={label}
                onPress={onPress}
                scaleDown={0.94}
                style={[
                  s.modeCard,
                  { backgroundColor: bg, borderColor: border },
                ]}
              >
                <View style={s.modeTop}>
                  <Text style={s.modeLabel}>{label}</Text>
                  <Icon size={32} />
                </View>
                <Text style={s.modeSub}>{sub}</Text>
              </PressableScale>
            ))}
          </View>
        </AnimatedCard>

        {/* ── Your Badges ─────────────────────────────────────── */}
        <AnimatedCard index={7} delay={100} style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Your Badges</Text>
            <TouchableOpacity>
              <Text style={s.sectionLink}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={[s.badgesRow, shadow(1)]}>
            {[
              { Icon: Icon3DShield, label: "Ocean\nStarter", locked: false },
              {
                Icon: Icon3DStarPurple,
                label: "Quick\nLearner",
                locked: false,
              },
              {
                Icon: Icon3DZap,
                label: "Streak\nMaster",
                locked: false,
                badge: "3x",
              },
              { Icon: Icon3DAward, label: "Quiz\nWhiz", locked: false },
              { Icon: Icon3DLock, label: "Code\nExplorer", locked: true },
            ].map(({ Icon, label, locked, badge }, i) => (
              <View key={i} style={[s.badgeItem, locked && { opacity: 0.5 }]}>
                <View style={{ position: "relative" }}>
                  <Icon size={36} />
                  {badge && (
                    <View style={s.badgePill}>
                      <Text style={s.badgePillText}>{badge}</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[s.badgeLabel, locked && { color: C.textTertiary }]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedCard>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  bgGradient: { position: "absolute", top: 0, left: 0, right: 0, height: 256 },
  scroll: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCol: {},
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: C.accent,
    letterSpacing: -0.5,
  },
  logoSub: { fontSize: 13, fontWeight: "700", color: "#3B82F6" },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  pillText: { fontSize: 13, fontWeight: "700", color: C.textPrimary },
  bellBtn: {
    position: "relative",
    padding: 8,
    marginStart: 4,
    borderRadius: 99,
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  // Hero
  heroWrap: {
    position: "relative",
    minHeight: 170,
    marginBottom: 28,
    zIndex: 20,
  },
  heroBubble: {
    width: "60%",
    backgroundColor: C.card,
    borderRadius: 24,
    borderTopEndRadius: 0,
    padding: 20,
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 4,
  },
  heroSub: { fontSize: 14, color: "#475569", lineHeight: 20 },
  bubbleTail: {
    position: "absolute",
    ...{ right: -12 },
    top: 16,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: "transparent",
    borderBottomWidth: 12,
    borderBottomColor: "transparent",
    ...{ borderLeftWidth: 16, borderLeftColor: C.card },
  },
  mascotWrap: {
    position: "absolute",
    right: -10,
    top: -55,
    width: 240,
    height: 240,
    zIndex: 0,
  },

  // Search
  searchBar: {
    backgroundColor: C.card,
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    color: C.textPrimary,
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
    textAlign: "left",
    writingDirection: "ltr",
  },

  // Grid
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  gridCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 14,
  },
  gridCardSmall: { flex: 1 },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardLabel: { fontSize: 11, fontWeight: "700", color: C.textPrimary },

  // Goal
  goalMiddle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalTextCol: {},
  goalNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  goalBig: { fontSize: 28, fontWeight: "900", color: C.textPrimary },
  goalSlash: { fontSize: 14, fontWeight: "700", color: C.textTertiary },
  goalUnit: { fontSize: 10, fontWeight: "600", color: C.textSecondary },
  goalRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#E2E8F0",
    borderTopColor: "#14B8A6",
    borderEndColor: "#14B8A6",
    alignItems: "center",
    justifyContent: "center",
  },

  // Streak
  streakMiddle: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  streakBig: { fontSize: 28, fontWeight: "900", color: C.textPrimary },
  streakUnit: {
    fontSize: 13,
    fontWeight: "500",
    color: C.textSecondary,
    marginStart: 4,
  },
  streakDots: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  streakDay: { alignItems: "center", gap: 3 },
  streakDayLabel: { fontSize: 9, fontWeight: "700", color: C.textTertiary },
  streakInactive: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  streakInactiveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },

  // XP
  xpCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  xpHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  xpLevel: { fontSize: 13, fontWeight: "800", color: C.textPrimary },
  xpBarBg: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
    marginBottom: 6,
  },
  xpBarFill: { height: 6, borderRadius: 3, backgroundColor: "#3B82F6" },
  xpText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textTertiary,
    textAlign: "right",
  },

  // Journey
  journeyCard: {
    borderRadius: 24,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    marginBottom: 28,
  },
  journeyContent: { position: "relative", zIndex: 10, width: "65%" },
  journeyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 8,
  },
  journeyLessonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  journeyLessonName: { fontWeight: "900", color: C.textPrimary },
  journeyLessonSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 12,
  },
  journeyProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  journeyBarBg: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 99,
    height: 6,
  },
  journeyBarFill: { height: 6, borderRadius: 99, backgroundColor: C.accent },
  journeyPercent: { fontSize: 10, fontWeight: "700", color: "#334155" },
  journeyCta: {
    backgroundColor: C.accent,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 99,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
  },
  journeyCtaText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  journeyMascot: {
    position: "absolute",
    right: 0,
    bottom: -8,
    width: 176,
    height: 176,
    zIndex: 10,
  },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: C.textPrimary },
  sectionLink: { fontSize: 12, fontWeight: "700", color: C.accent },

  // Modes grid
  modesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  modeCard: {
    width: "48%",
    borderRadius: 24,
    padding: 16,
    height: 104,
    borderWidth: 1,
    justifyContent: "space-between",
  },
  modeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modeLabel: { fontWeight: "700", fontSize: 14, color: C.textPrimary },
  modeSub: {
    fontSize: 10,
    color: C.textSecondary,
    fontWeight: "500",
    lineHeight: 14,
    marginTop: 6,
  },

  // Badges
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.card,
    padding: 16,
    borderRadius: 24,
  },
  badgeItem: { alignItems: "center", gap: 6 },
  badgePill: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 99,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: "#fff",
    zIndex: 10,
  },
  badgePillText: { color: "#fff", fontSize: 8, fontWeight: "800" },
  badgeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#475569",
    textAlign: "center",
  },
});
