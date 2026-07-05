import { PremiumPressable } from '../../components/PremiumPressable';
import { crossShadow } from '../../utils/shadows';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { HugeiconsIcon } from "@hugeicons/react-native";
import Fire from '../../../assets/images/svg/header/fire.svg';
import Dictionary from '../../../assets/images/svg/dictionary.svg';
import { useRouter } from 'expo-router';
import { useProgressStore } from '../../stores/useProgressStore';
import { useI18n } from '../../hooks/useI18n';
import { AppText } from '../../components/ui/AppText';
import { 
  HeadphonesIcon, 
  Mic01Icon, 
  Message01Icon, 
  Robot02Icon, 
  Book01Icon, 
  BookOpen02Icon,
  CrownIcon,
  ArrowRight01Icon,
  FireIcon,
  StarIcon,
  Diamond01Icon,
  ChartBarLineIcon,
  Chatting01Icon,
  MaskTheater02Icon,
  TeacherIcon
} from "@hugeicons/core-free-icons";

const { width } = Dimensions.get('window');

/* ──────────────────────────────────────────────
   Design tokens – matches the reference image
   ────────────────────────────────────────────── */
const C = {
  // Base
  bg: '#F8F7FC',           // soft lavender-tinted background
  card: '#FFFFFF',
  text: '#111827',
  sub: '#6B7280',
  // Brand indigo
  indigo: '#4338CA',
  indigoDark: '#1E1B4B',
  indigoMid: '#312E81',
  indigoLight: '#EEF2FF',
  // Accent
  amber: '#F59E0B',
  orange: '#F97316',
  blue: '#3B82F6',
  violet: '#8B5CF6',
  violetLight: '#F3E8FF',
  // Role play card gradient
  rpStart: '#2D2A6E',
  rpEnd: '#1A1744',
  // Badge
  badgeBg: '#EDE9FE',
  badgeText: '#7C3AED',
  hotBg: '#EF4444',
  hotText: '#FFFFFF',
};

export function GamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { dailyXp, dailyGoalXp } = useProgressStore();
  const { t, locale, isKu } = useI18n();
  const isRtl = isKu || locale === 'ar';

  const xp = dailyXp || 0;
  const goal = dailyGoalXp || 15;
  const percent = Math.min(100, Math.max(0, (xp / goal) * 100));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <View style={styles.brandDots}>
              <View style={[styles.dot, { backgroundColor: C.indigo }]} />
              <View style={[styles.dot, { backgroundColor: C.indigo, opacity: 0.5 }]} />
            </View>
            <Text style={styles.brandText}>TWINO LABS</Text>
          </View>
          <View style={styles.proPill}>
            <HugeiconsIcon icon={CrownIcon} size={14} color={C.amber} />
            <Text style={styles.proText}>Pro</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroTitle, isRtl && { textAlign: 'right' }]}>{t("games.title")}</Text>
            <Text style={[styles.heroSub, isRtl && { textAlign: 'right' }]}>
              {t("games.subtitle")}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Quick Actions Row ── */}
      <View style={styles.quickActionsOuter}>
        <View style={styles.quickActionsCard}>
          <PremiumPressable style={styles.quickItem} pressScale={0.94}>
            <View style={[styles.quickIcon, { backgroundColor: '#F4F0FF', borderWidth: 1, borderColor: '#EDE9FE' }]}>  
              <HugeiconsIcon icon={HeadphonesIcon} size={26} color={C.violet} strokeWidth={2} />
            </View>
            <Text style={[styles.quickLabel, isRtl && { textAlign: 'center' }]}>{t("games.listenTitle")}</Text>
            <Text style={[styles.quickSub, isRtl && { textAlign: 'center' }]}>{t("games.listenSub")}</Text>
          </PremiumPressable>

          <PremiumPressable style={styles.quickItem} pressScale={0.94}>
            <View style={[styles.quickIcon, { backgroundColor: '#EEF5FF', borderWidth: 1, borderColor: '#E0E7FF' }]}>  
              <HugeiconsIcon icon={Mic01Icon} size={26} color={C.blue} strokeWidth={2} />
            </View>
            <Text style={[styles.quickLabel, isRtl && { textAlign: 'center' }]}>{t("games.speakTitle")}</Text>
            <Text style={[styles.quickSub, isRtl && { textAlign: 'center' }]}>{t("games.speakSub")}</Text>
          </PremiumPressable>

          <PremiumPressable style={styles.quickItem} pressScale={0.94}>
            <View style={[styles.quickIcon, { backgroundColor: '#FFF5F0', borderWidth: 1, borderColor: '#FFE4E6' }]}>  
              <HugeiconsIcon icon={Chatting01Icon} size={26} color={C.orange} strokeWidth={2} />
            </View>
            <Text style={[styles.quickLabel, isRtl && { textAlign: 'center' }]}>{t("games.conversationTitle")}</Text>
            <Text style={[styles.quickSub, isRtl && { textAlign: 'center' }]}>{t("games.conversationSub")}</Text>
          </PremiumPressable>
        </View>
      </View>

      {/* ── Daily Goal Card ── */}
      <View style={styles.dailyGoalContainer}>
        <LinearGradient
          colors={['#FFA04A', '#FF7300']}
          style={[styles.dailyGoalCard, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.goalLeft, isRtl ? { paddingLeft: 110, paddingRight: 0 } : {}]}>
            <View style={[styles.goalHeaderRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.goalFireCircle, isRtl ? { marginLeft: 12, marginRight: 0 } : {}]}>
                <Fire width={22} height={22} fill="#FF7300" />
              </View>
              <View style={styles.goalTextCol}>
                <AppText style={[styles.goalTitle, { textAlign: isRtl ? 'right' : 'left' }]} forceKurdishFont={isKu}>{t("games.timeToLearn")}</AppText>
                <AppText style={[styles.goalSub, { textAlign: isRtl ? 'right' : 'left' }]} forceKurdishFont={isKu}>{t("games.reachGoal")}</AppText>
              </View>
            </View>

            {/* Progress bar */}
            <View style={[styles.goalProgressBg, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.goalProgressFill, { width: `${percent}%` }]} />
            </View>
            <AppText style={[styles.goalXPText, { textAlign: isRtl ? 'right' : 'left' }]} forceLatinFont latinRole="bold">{xp} / {goal} XP</AppText>
          </View>
          
          <Image
            source={require('../../../assets/images/svg/gamescreenmascotorange.png')}
            style={[styles.mascotImg, isRtl ? { left: -16, right: undefined, transform: [{ scaleX: -1 }] } : {}]}
            resizeMode="contain"
          />
        </LinearGradient>
      </View>

      {/* ── Bento Grid ── */}
      <View style={styles.bentoContainer}>
        {/* Live Voice Tutor (Full Width) */}
        <PremiumPressable style={styles.cardWhite} pressScale={0.97} onPress={() => router.push("/voice-tutor")}>
          <View style={[styles.cardTop, isRtl && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.iconBox, { backgroundColor: C.indigoLight }]}>
              <HugeiconsIcon icon={Robot02Icon} size={20} color={C.indigo} strokeWidth={2} />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t("games.badgeNew")}</Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, isRtl && { textAlign: 'right' }]}>{t("games.voiceTutorTitle")}</Text>
          <Text style={[styles.cardSub, isRtl && { textAlign: 'right' }]}>{t("games.voiceTutorSub")}</Text>
          <View style={[styles.arrowRow, isRtl ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
            <View style={[styles.arrowCircle, isRtl && { transform: [{ rotate: "180deg" }] }]}>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={C.sub} />
            </View>
          </View>
        </PremiumPressable>

        {/* Side-by-Side Row (AI Podcast and AI Role Play) */}
        <View style={styles.bentoRow}>
          {(() => {
            const bentoCards = [
              <PremiumPressable key="podcast" style={[styles.cardWhite, styles.bentoHalfCard]} pressScale={0.97} onPress={() => router.push("/podcast")}>
                <View style={[styles.cardTop, isRtl && { flexDirection: 'row-reverse' }]}>
                  <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                    <HugeiconsIcon icon={HeadphonesIcon} size={20} color={C.violet} strokeWidth={2} />
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{t("games.badgeNew")}</Text>
                  </View>
                </View>
                <Text style={[styles.cardTitle, isRtl && { textAlign: 'right' }]}>{t("games.podcastTitle")}</Text>
                <Text style={[styles.cardSub, isRtl && { textAlign: 'right' }]}>{t("games.podcastSub")}</Text>
                <View style={[styles.arrowRow, isRtl ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
                  <View style={[styles.arrowCircle, isRtl && { transform: [{ rotate: "180deg" }] }]}>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={C.sub} />
                  </View>
                </View>
              </PremiumPressable>,

              <PremiumPressable key="roleplay" style={[styles.cardDark, styles.bentoHalfCard]} pressScale={0.97} onPress={() => router.push("/roleplay")}>
                <LinearGradient
                  colors={[C.rpStart, C.rpEnd]}
                  style={styles.rolePlayGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <View style={[styles.cardTop, isRtl && { flexDirection: 'row-reverse' }]}>
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}>
                      <HugeiconsIcon icon={MaskTheater02Icon} size={20} color="#FFF" strokeWidth={2} />
                    </View>
                    <View style={styles.hotBadge}>
                      <Text style={styles.hotBadgeText}>{t("games.badgeHot")}</Text>
                    </View>
                  </View>

                  <Text style={[styles.rpTitle, isRtl && { textAlign: 'right' }]}>{t("games.rolePlayTitle")}</Text>
                  <Text style={[styles.rpSub, isRtl && { textAlign: 'right' }]}>
                    {t("games.rolePlaySub")}
                  </Text>

                  <View style={[styles.arrowRow, isRtl ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
                    <View style={[styles.arrowCircle, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }, isRtl && { transform: [{ rotate: "180deg" }] }]}>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="#FFF" />
                    </View>
                  </View>
                </LinearGradient>
              </PremiumPressable>
            ];
            return isRtl ? bentoCards.reverse() : bentoCards;
          })()}
        </View>
      </View>

      {/* ── Reading Practice (full width) ── */}
      <PremiumPressable style={[styles.readingCard, isRtl && { flexDirection: 'row-reverse' }]} pressScale={0.97} onPress={() => router.push("/reading-practice")}>
        <View style={styles.readingLeft}>
          <View style={[styles.cardTop, isRtl && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <HugeiconsIcon icon={BookOpen02Icon} size={20} color={C.blue} strokeWidth={2} />
            </View>
          </View>
          <Text style={[styles.cardTitle, isRtl && { textAlign: 'right' }]}>{t("games.paragraphSpeechTitle")}</Text>
          <Text style={[styles.cardSub, isRtl && { textAlign: 'right' }]}>
            {t("games.paragraphSpeechSub")}
          </Text>
        </View>
        <View style={[styles.readingRight, isRtl && { alignItems: 'flex-start' }]}>
          <View style={[styles.readingBadgePos, isRtl ? { right: undefined, left: 0 } : { right: 0, left: undefined }]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t("games.badgeNew")}</Text>
            </View>
          </View>
          {/* Book illustration — Bolder, playful book */}
          <View style={[styles.readingBookIllustration, isRtl ? { marginLeft: 8, marginRight: 0 } : { marginRight: 8, marginLeft: 0 }]}>
            <HugeiconsIcon icon={BookOpen02Icon} size={42} color={C.violet} strokeWidth={1.8} />
            {/* Chat dots decoration */}
            <View style={styles.readingDots}>
              <View style={[styles.chatDot, { backgroundColor: C.violet }]} />
              <View style={[styles.chatDot, { backgroundColor: C.violet, opacity: 0.7 }]} />
              <View style={[styles.chatDot, { backgroundColor: C.violet, opacity: 0.4 }]} />
            </View>
          </View>
          <View style={[styles.readingArrowPos, isRtl ? { right: undefined, left: 0 } : { right: 0, left: undefined }]}>
            <View style={[styles.arrowCircle, isRtl && { transform: [{ rotate: "180deg" }] }]}>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={C.sub} />
            </View>
          </View>
        </View>
      </PremiumPressable>

      {/* ── Bottom 2-col: AI Teacher + Slang Dictionary ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bottomScrollContainer}
      >
        {(() => {
          const cards = [
            <PremiumPressable key="teacher" style={[styles.cardWhite, styles.bottomCard]} pressScale={0.97} onPress={() => router.push("/ai-teacher")}>
              <View style={[styles.cardTop, isRtl && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                  <HugeiconsIcon icon={TeacherIcon} size={20} color={C.violet} strokeWidth={2} />
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t("games.badgeNew")}</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, isRtl && { textAlign: 'right' }]}>{t("games.teacherTitle")}</Text>
              <Text style={[styles.cardSub, isRtl && { textAlign: 'right' }]}>{t("games.teacherSub")}</Text>
              <View style={[styles.arrowRow, isRtl ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
                <View style={[styles.arrowCircle, isRtl && { transform: [{ rotate: "180deg" }] }]}>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={C.sub} />
                </View>
              </View>
            </PremiumPressable>,

            <PremiumPressable key="slang" style={[styles.cardWhite, styles.bottomCard]} pressScale={0.97} onPress={() => router.push("/slang")}>
              <View style={[styles.cardTop, isRtl && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#E0E7FF' }]}>
                  <Dictionary width={20} height={20} fill={C.indigo} />
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{t("games.badgeNew")}</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, isRtl && { textAlign: 'right' }]}>{t("games.slangTitle")}</Text>
              <Text style={[styles.cardSub, isRtl && { textAlign: 'right' }]}>{t("games.slangSub")}</Text>
              <View style={[styles.arrowRow, isRtl ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
                <View style={[styles.arrowCircle, isRtl && { transform: [{ rotate: "180deg" }] }]}>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={C.sub} />
                </View>
              </View>
            </PremiumPressable>
          ];
          return isRtl ? cards.reverse() : cards;
        })()}
      </ScrollView>

      {/* ── Your Progress ── */}
      <View style={styles.progressCard}>
        <View style={[styles.progressHeader, isRtl && { flexDirection: 'row-reverse' }]}>
          <Text style={[styles.progressTitle, isRtl && { textAlign: 'right' }]}>{t("games.yourProgress")}</Text>
          <PremiumPressable hitSlop={12} pressScale={0.95}>
            <Text style={styles.viewAll}>{t("games.viewAll")}  {isRtl ? '<' : '>'}</Text>
          </PremiumPressable>
        </View>

        <View style={[styles.statsGrid, isRtl && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.statItem, isRtl && { flexDirection: 'row-reverse' }]}>
            <HugeiconsIcon icon={FireIcon} size={22} color={C.orange} />
            <View style={[styles.statText, isRtl ? { marginRight: 0, marginLeft: 10 } : { marginLeft: 10, marginRight: 0 }]}>
              <Text style={[styles.statValue, isRtl && { textAlign: 'right' }]}>12</Text>
              <Text style={[styles.statLabel, isRtl && { textAlign: 'right' }]}>{t("games.dayStreak")}</Text>
            </View>
          </View>

          <View style={[styles.statItem, isRtl && { flexDirection: 'row-reverse' }]}>
            <HugeiconsIcon icon={StarIcon} size={22} color={C.amber} />
            <View style={[styles.statText, isRtl ? { marginRight: 0, marginLeft: 10 } : { marginLeft: 10, marginRight: 0 }]}>
              <Text style={[styles.statValue, isRtl && { textAlign: 'right' }]}>4,250</Text>
              <Text style={[styles.statLabel, isRtl && { textAlign: 'right' }]}>{t("games.xpEarned")}</Text>
            </View>
          </View>

          <View style={[styles.statItem, isRtl && { flexDirection: 'row-reverse' }]}>
            <HugeiconsIcon icon={Mic01Icon} size={22} color={C.blue} />
            <View style={[styles.statText, isRtl ? { marginRight: 0, marginLeft: 10 } : { marginLeft: 10, marginRight: 0 }]}>
              <Text style={[styles.statValue, isRtl && { textAlign: 'right' }]}>36</Text>
              <Text style={[styles.statLabel, isRtl && { textAlign: 'right' }]}>{t("games.conversations")}</Text>
            </View>
          </View>

          <View style={[styles.statItem, isRtl && { flexDirection: 'row-reverse' }]}>
            <HugeiconsIcon icon={Diamond01Icon} size={22} color={C.violet} />
            <View style={[styles.statText, isRtl ? { marginRight: 0, marginLeft: 10 } : { marginLeft: 10, marginRight: 0 }]}>
              <Text style={[styles.statValue, isRtl && { textAlign: 'right' }]}>8</Text>
              <Text style={[styles.statLabel, isRtl && { textAlign: 'right' }]}>{t("games.badges")}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

/* ──────────────────────────────────────────────
   Styles
   ────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  /* ── Header ── */
  header: {
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDots: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 14,
    borderRadius: 3,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '800',
    color: C.indigo,
    letterSpacing: 1.5,
  },
  proPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    ...crossShadow({ color: '#F59E0B', offsetY: 2, blur: 8, opacity: 0.08 }),
  },
  proText: {
    fontSize: 12,
    fontWeight: '800',
    color: C.amber,
  },

  /* ── Hero ── */
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroLeft: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: C.text,
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: C.sub,
    fontWeight: '500',
    lineHeight: 22,
  },
  heroMascot: {
    width: 120,
    height: 110,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotBlobOrange: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FB923C',
    justifyContent: 'center',
    alignItems: 'center',
    ...crossShadow({ color: '#FB923C', offsetY: 6, blur: 16, opacity: 0.3 }),
  },
  mascotBlobBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    right: 8,
    ...crossShadow({ color: '#6366F1', offsetY: 4, blur: 12, opacity: 0.3 }),
  },
  sparkle: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.amber,
  },

  /* ── Daily Goal Card ── */
  dailyGoalContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
    overflow: 'visible',
  },
  dailyGoalCard: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    height: 145,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'visible',
    ...crossShadow({ color: '#FF7300', offsetY: 8, blur: 24, opacity: 0.16 }),
  },
  goalLeft: {
    flex: 1,
    paddingRight: 110,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalFireCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...crossShadow({ color: '#FF7300', offsetY: 2, blur: 6, opacity: 0.1 }),
  },
  goalTextCol: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  goalSub: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 2,
  },
  goalProgressBg: {
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 7,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 8,
    flexDirection: 'row',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
  },
  goalXPText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  goalRight: {
    width: 130,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  mascotImg: {
    width: 190,
    height: 160,
    position: 'absolute',
    bottom: -10,
    right: -16,
  },

  /* ── Quick Actions ── */
  quickActionsOuter: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  quickActionsCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 8,
    ...crossShadow({ color: '#000', offsetY: 6, blur: 24, opacity: 0.04 }),
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
  },
  quickSub: {
    fontSize: 11,
    color: C.sub,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
  },

  /* ── Bento Grid ── */
  bentoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  bentoLeft: {
    width: '48%',
    gap: 14,
  },
  bentoRight: {
    width: '48%',
  },

  /* ── White Card (shared) ── */
  cardWhite: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 4.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    ...crossShadow({ color: '#0F172A', offsetY: 4, blur: 12, opacity: 0.04 }),
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: C.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.badgeText,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  cardSub: {
    fontSize: 12,
    color: C.sub,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 14,
  },
  arrowRow: {
    alignItems: 'flex-end',
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ── AI Role Play Card ── */
  cardDark: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: C.rpEnd,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderBottomWidth: 4.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    ...crossShadow({ color: C.indigoDark, offsetY: 8, blur: 20, opacity: 0.15 }),
  },
  rolePlayGradient: {
    borderRadius: 22,
    padding: 16,
  },
  hotBadge: {
    backgroundColor: C.hotBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: C.hotText,
  },
  rpTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  rpSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 14,
  },

  /* ── Reading Practice ── */
  readingCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 14,
    minHeight: 125,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 4.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    ...crossShadow({ color: '#0F172A', offsetY: 4, blur: 12, opacity: 0.04 }),
  },
  readingLeft: {
    flex: 1,
  },
  readingRight: {
    width: 110,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
  },
  readingBadgePos: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  readingBookIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  readingDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  chatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  readingArrowPos: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  /* ── Bottom Grid ── */
  bottomGrid: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  bottomCard: {
    flex: 1,
    minWidth: 140,
  },
  aaIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4338CA',
    letterSpacing: -0.5,
  },

  /* ── Progress ── */
  progressCard: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomWidth: 4.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    ...crossShadow({ color: '#0F172A', offsetY: 4, blur: 12, opacity: 0.04 }),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.text,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '700',
    color: C.indigo,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 115,
    flex: 1,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
  },
  statLabel: {
    fontSize: 11,
    color: C.sub,
    fontWeight: '500',
  },
  bentoContainer: {
    paddingHorizontal: 24,
    marginBottom: 14,
    gap: 14,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 14,
  },
  bentoHalfCard: {
    flex: 1,
  },
  bottomScrollContainer: {
    paddingHorizontal: 24,
    gap: 14,
    marginBottom: 24,
  },
});
