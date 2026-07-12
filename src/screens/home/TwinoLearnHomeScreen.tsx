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
import {
  Airplane01Icon,
  BankIcon,
  BookOpen02Icon,
  Briefcase01Icon,
  Bus01Icon,
  Chat01Icon,
  Clock01Icon,
  Coffee01Icon,
  CrownIcon,
  Fire02Icon,
  HealthIcon,
  Home01Icon,
  LockIcon,
  MapingIcon,
  Mic01Icon,
  PlayIcon,
  RestaurantIcon,
  SchoolIcon,
  Settings01Icon,
  ShoppingBasket01Icon,
  Store01Icon,
  UserGroupIcon,
  WavingHand01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import React, { useCallback, useMemo } from "react";
import { I18nManager, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { PressableScale } from "../../components/animations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../../hooks/useThemeColors";
import { tabBarScrollPadding } from "../../constants/layout";
import { getLanguageDirection } from "../../i18n/direction";

const BRAND_ICON = require("../../../assets/images/logo-compressed.png");

type LessonTopicSource = {
  topic?: string;
  topicKu?: string;
  topicAr?: string;
  words?: { english?: string; kurdish?: string; arabic?: string }[];
  voices?: { prompt?: string; target?: string; targetKurdish?: string }[];
  conversations?: { situation?: string; theyAsk?: string }[];
};

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getLessonTopicText(bank?: LessonTopicSource) {
  if (!bank) return "";

  const parts = [bank.topic, bank.topicKu, bank.topicAr];
  bank.words?.forEach((word) => {
    parts.push(word.english, word.kurdish, word.arabic);
  });
  bank.voices?.forEach((voice) => {
    parts.push(voice.prompt, voice.target, voice.targetKurdish);
  });
  bank.conversations?.forEach((conversation) => {
    parts.push(conversation.situation, conversation.theyAsk);
  });

  return parts.filter(Boolean).join(" ").toLowerCase();
}

const RTL_NAME_WORDS: Record<string, string> = {
  abdulla: "عەبدوڵا",
  abdullah: "عەبدوڵا",
  abdalla: "عەبدوڵا",
  aziz: "عەزیز",
  ahmad: "ئەحمەد",
  ahmed: "ئەحمەد",
  ali: "عەلی",
  amir: "ئەمیر",
  ara: "ئارا",
  aram: "ئارام",
  ava: "ئاڤا",
  ayan: "ئایان",
  baran: "باران",
  dana: "دانا",
  darya: "دەریا",
  hawar: "هاوار",
  karwan: "کاروان",
  muhammad: "محەمەد",
  mohammed: "محەمەد",
  mohammad: "محەمەد",
  omar: "عومەر",
  rawand: "ڕەوەند",
  rebin: "ڕێبین",
  roj: "ڕۆژ",
  sara: "سارا",
  shvan: "شڤان",
  sirwan: "سیروان",
  total: "تۆتاڵ",
};

function localizeNameForRtl(name: string) {
  const words = name.trim().split(/\s+/);
  if (!words.length) return name;

  const localized = words.map((word) => {
    const stripped = word.toLowerCase().replace(/[^a-z]/g, "");
    return RTL_NAME_WORDS[stripped];
  });

  return localized.every(Boolean) ? localized.join(" ") : name;
}

function getHomeColors(colors: any, isDark: boolean) {
  return {
    background: isDark ? '#0F172A' : '#FFFFFF',
    foreground: isDark ? '#FFFFFF' : '#0F172A',
    primary: isDark ? '#FFFFFF' : '#0F172A',
    secondary: isDark ? '#FFFFFF' : '#0F172A',
    muted: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
    mutedForeground: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
    destructive: isDark ? '#EF4444' : '#0F172A',
    card: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
    cardSurface: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
    borderStrong: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.06)',
    warmBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
    darkBg: '#0F172A',
  };
}


export function TwinoLearnHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale } = useI18n();
  const isRtl = getLanguageDirection(locale) === "rtl";
  const { colors, isDark } = useThemeColors();

  const Colors = useMemo(() => getHomeColors(colors, isDark), [colors, isDark]);
  const { width: screenWidth } = useWindowDimensions();
  const styles = useMemo(() => createStyles(Colors, isDark, screenWidth), [Colors, isDark, screenWidth]);

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
  
  const practiceMinutes = ready ? Math.round(dailyXp * 0.3) : null;

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

  const displayName = (userName?.trim() || (isRtl ? "هاوڕێ" : "Friend")).trim();
  const localizedDisplayName = isRtl ? localizeNameForRtl(displayName) : displayName;
  const upgradeLabel = locale === "ku" ? "نوێکردنەوە" : locale === "ar" ? "ترقية" : "Upgrade";
  const getLocalizedLessonTopic = (bank?: LessonTopicSource) => {
    if (!bank) return undefined;
    if (locale === "ku") return bank.topicKu ?? bank.topic;
    if (locale === "ar") return bank.topicAr ?? bank.topic;
    return bank.topic;
  };

  const getLessonIcon = (type: string, bank?: LessonTopicSource) => {
    const text = getLessonTopicText(bank);

    if (includesAny(text, ["shop", "store", "market", "shopping", "buy", "order", "فرۆشگا", "بازاڕ", "کڕین", "داواکاری"])) {
      return includesAny(text, ["basket", "cart", "shopping", "کڕین"]) ? ShoppingBasket01Icon : Store01Icon;
    }
    if (includesAny(text, ["restaurant", "food", "eat", "coffee", "hungry", "meal", "خواردن", "چێشت", "نان", "قاوە", "برسی"])) {
      return RestaurantIcon;
    }
    if (includesAny(text, ["travel", "airport", "abroad", "flight", "hotel", "گەشت", "فڕۆکە", "دەرەوە"])) {
      return Airplane01Icon;
    }
    if (includesAny(text, ["bus", "taxi", "car", "train", "transport", "street", "کوچە", "شەقام", "پاس", "تاکسی", "ئۆتۆمبێل"])) {
      return Bus01Icon;
    }
    if (includesAny(text, ["lost", "direction", "location", "map", "address", "وەرگبوون", "ناونیشان", "شوێن", "ڕێگا"])) {
      return MapingIcon;
    }
    if (includesAny(text, ["work", "job", "business", "office", "meeting", "career", "کار", "ئۆفیس", "کۆبوونەوە", "پرۆژە"])) {
      return Briefcase01Icon;
    }
    if (includesAny(text, ["bank", "money", "pay", "price", "card", "refund", "پارە", "بانک", "نرخ", "کارت"])) {
      return BankIcon;
    }
    if (includesAny(text, ["health", "medical", "doctor", "hospital", "emergency", "injured", "تەندروستی", "دکتۆر", "نەخۆشخانە", "بریکاری", "بریندار"])) {
      return HealthIcon;
    }
    if (includesAny(text, ["school", "teacher", "student", "class", "قوتاب", "مامۆستا", "پۆل", "خوێندن"])) {
      return SchoolIcon;
    }
    if (includesAny(text, ["family", "home", "house", "friend", "خێزان", "ماڵ", "خانوو", "هاوڕێ"])) {
      return includesAny(text, ["family", "خێزان"]) ? UserGroupIcon : Home01Icon;
    }
    if (type === "speaking") return Mic01Icon;
    if (type === "conversation") return Chat01Icon;
    return BookOpen02Icon;
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
      <View style={[styles.header, isRtl && styles.headerRtl, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerLeft}>
          <Image source={BRAND_ICON} style={styles.headerLogo} contentFit="contain" />
          <AppText style={styles.headerTitle} forceLatinFont latinRole="bold">
            Twino
          </AppText>
        </View>
        <View style={[styles.headerRight, isRtl && styles.headerRightRtl]}>
          <PressableScale
            style={styles.upgradeBtn}
            onPress={() => {
              hapticSelection();
              router.push("/subscription");
            }}
            scaleDown={0.9}
          >
            <HugeiconsIcon icon={CrownIcon} size={18} color="#92700A" strokeWidth={2.5} />
            <AppText style={styles.upgradeBtnText} languageCode={locale} align="center" latinRole="bold">
              {upgradeLabel}
            </AppText>
          </PressableScale>
          <PressableScale
            style={styles.notificationBtn}
            onPress={() => {
              hapticSelection();
              router.push("/settings");
            }}
            scaleDown={0.9}
          >
            <HugeiconsIcon icon={Settings01Icon} size={20} color={Colors.foreground} strokeWidth={2.5} />
          </PressableScale>
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
          <View style={[styles.greetingSection, isRtl && styles.greetingSectionRtl]}>
            <AppText
              style={[styles.greetingSub, isRtl && styles.greetingSubRtl]}
              languageCode={locale}
              align="start"
              fullWidth
            >
              {t("twinoHome.welcomeBack")}
            </AppText>
            <View style={[styles.greetingNameRow, isRtl && styles.greetingNameRowRtl]}>
              <AppText
                style={[styles.greetingTitle, isRtl && styles.greetingTitleRtl]}
                languageCode={locale}
                align="start"
                latinRole="bold"
              >
                {localizedDisplayName}
              </AppText>
              <HugeiconsIcon icon={WavingHand01Icon} size={28} color={Colors.foreground} strokeWidth={2.5} />
            </View>
          </View>
          </GsapEnterBlock>

          {/* AI LIVE TUTOR */}
          <GsapEnterBlock index={2}>
          <View style={styles.aiCard}>
            <View 
              style={[
                styles.aiCardContent, 
                isRtl
                  ? (I18nManager.isRTL ? { paddingRight: 75, paddingLeft: 0 } : { paddingRight: 0, paddingLeft: 75 }) 
                  : { paddingRight: 75, paddingLeft: 0 }
              ]}
            >
              <View 
                style={[
                  styles.aiBadge, 
                  isRtl && {
                    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end", 
                    flexDirection: I18nManager.isRTL ? "row" : "row-reverse" 
                  }
                ]}
              >
                <View style={styles.aiPulseWrap}>
                  <View style={styles.aiPulsePing} />
                  <View style={styles.aiPulseDot} />
                </View>
                <AppText style={styles.aiBadgeText} languageCode={locale} align="start">{t("twinoHome.aiLiveTutor")}</AppText>
              </View>
              
              <AppText style={[styles.aiCardTitle, isRtl && styles.rtlText]} languageCode={locale} align="start" fullWidth latinRole="bold">{t("twinoHome.speakNatural")}</AppText>
              <AppText style={[styles.aiCardSub, isRtl && styles.rtlText]} languageCode={locale} align="start" fullWidth>
                {t("twinoHome.aiTutorDesc")}
              </AppText>
            </View>
              
            <View style={styles.aiCardBtnRow}>
              <PressableScale 
                style={[
                  styles.aiCardBtn, 
                  styles.btn3DPrimary, 
                  isRtl && { flexDirection: I18nManager.isRTL ? "row" : "row-reverse" }
                ]}
                onPress={onOpenVoiceTutor}
                scaleDown={0.96}
              >
                <HugeiconsIcon icon={Mic01Icon} size={18} color={isDark ? "#0F172A" : "#FFFFFF"} strokeWidth={2.5} />
                <AppText style={styles.aiCardBtnText} languageCode={locale} align="center" latinRole="bold">{t("twinoHome.startConversation")}</AppText>
              </PressableScale>

              <PressableScale 
                style={[
                  styles.learnBtn, 
                  styles.btnFlat, 
                  isRtl && { flexDirection: I18nManager.isRTL ? "row" : "row-reverse" }
                ]}
                onPress={onOpenPath}
                scaleDown={0.96}
              >
                <HugeiconsIcon icon={BookOpen02Icon} size={18} color={Colors.foreground} strokeWidth={2.5} />
                <AppText style={styles.learnBtnText} languageCode={locale} align="center" latinRole="bold">{t("twinoHome.learn")}</AppText>
              </PressableScale>
            </View>
            
            <Image 
              source={BRAND_ICON} 
              style={[
                styles.aiCardLogo, 
                isRtl
                  ? (I18nManager.isRTL ? { right: -20, left: 'auto' } : { right: 'auto', left: -20 }) 
                  : { right: -20, left: 'auto' }
              ]} 
              contentFit="contain" 
            />
          </View>
          </GsapEnterBlock>

          {/* STATS ROW */}
          <GsapEnterBlock index={3}>
          <View style={[styles.statsRow, isRtl && styles.statsRowRtl]}>
            <PressableScale style={styles.statBox} scaleDown={0.96} onPress={() => {}}>
              <View style={[styles.statHeader, isRtl && styles.statHeaderRtl]}>
                <View style={styles.statIconWrap}>
                  <HugeiconsIcon icon={Fire02Icon} size={32} color={Colors.primary} strokeWidth={2.5} />
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={Colors.mutedForeground} strokeWidth={2.5} />
              </View>
              <View>
                <AppText style={styles.statNumber} forceLatinFont latinRole="bold">{streakDays}</AppText>
                <AppText
                  style={[styles.statLabel, isRtl && styles.rtlText]}
                  languageCode={locale}
                  align="start"
                  fullWidth
                  latinRole="bold"
                >
                  {t("twinoHome.dayStreak")}
                </AppText>
              </View>
            </PressableScale>

            <PressableScale style={styles.statBox} scaleDown={0.96} onPress={() => {}}>
              <View style={[styles.statHeader, isRtl && styles.statHeaderRtl]}>
                <View style={styles.statIconWrap}>
                  <HugeiconsIcon icon={Clock01Icon} size={32} color={Colors.secondary} strokeWidth={2.5} />
                </View>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color={Colors.mutedForeground} strokeWidth={2.5} />
              </View>
              <View>
                <View style={[styles.statValueRow, isRtl && styles.statValueRowRtl]}>
                  <AppText style={styles.statNumber} forceLatinFont latinRole="bold">
                    {practiceMinutes !== null ? practiceMinutes : "--"}
                  </AppText>
                  <AppText
                    style={[styles.statUnit, isRtl && styles.rtlText]}
                    languageCode={locale}
                    align="start"
                    latinRole="bold"
                  >
                    {t("twinoHome.min")}
                  </AppText>
                </View>
                <AppText
                  style={[styles.statLabel, isRtl && styles.rtlText]}
                  languageCode={locale}
                  align="start"
                  fullWidth
                  latinRole="bold"
                >
                  {t("twinoHome.practiceToday")}
                </AppText>
              </View>
            </PressableScale>
          </View>
          </GsapEnterBlock>

          {/* UP NEXT */}
          <GsapEnterBlock index={4}>
          <View style={[styles.upNextHeader, isRtl && styles.upNextHeaderRtl]}>
            <AppText
              style={[styles.upNextTitle, isRtl && styles.rtlText]}
              languageCode={locale}
              align="start"
              latinRole="bold"
            >
              {t("twinoHome.upNext")}
            </AppText>
            <AppText
              style={[styles.viewAllText, isRtl && styles.rtlText]}
              languageCode={locale}
              align="start"
              latinRole="bold"
            >
              {t("twinoHome.viewAll")}
            </AppText>
          </View>

          <View style={styles.lessonsList}>
            {/* Active Lesson */}
            <PressableScale 
              style={[styles.lessonItem, styles.lessonItemActive, isRtl && styles.lessonItemRtl]} 
              onPress={onStartLesson}
              scaleDown={0.97}
            >
              <View style={styles.lessonEmojiBox}>
                <HugeiconsIcon icon={activeItem ? getLessonIcon(activeItem.type, activeBank) : Coffee01Icon} size={32} color={Colors.primary} strokeWidth={2.5} />
              </View>
              <View style={[styles.lessonDetails, isRtl && styles.lessonDetailsRtl]}>
                <AppText
                  style={[styles.lessonTitle, isRtl && styles.rtlText]}
                  languageCode={locale}
                  align="start"
                  fullWidth
                  latinRole="bold"
                >
                  {getLocalizedLessonTopic(activeBank) ?? t("twinoHome.fallbackActive")}
                </AppText>
                <View style={[styles.lessonMeta, isRtl && styles.lessonMetaRtl]}>
                  <AppText
                    style={[styles.lessonCategory, isRtl && styles.rtlText]}
                    languageCode={locale}
                    align="start"
                  >
                    {activeItem ? t(getLessonCategoryKey(activeItem.type)) : t("twinoHome.categoryPractice")}
                  </AppText>
                  <View style={styles.lessonDot} />
                  <AppText
                    style={[styles.lessonDurationActive, isRtl && styles.rtlText]}
                    languageCode={locale}
                    align="start"
                    latinRole="bold"
                  >
                    {activeItem?.type === "conversation" ? `10 ${t("twinoHome.mins")}` : `5 ${t("twinoHome.mins")}`}
                  </AppText>
                </View>
              </View>
              <View style={styles.playBtn}>
                <HugeiconsIcon icon={PlayIcon} size={14} color={isDark ? "#0F172A" : "#FFFFFF"} strokeWidth={2.5} style={{ marginLeft: 1 }} />
              </View>
            </PressableScale>

            {/* Locked Lesson */}
            {lockedItem && (
              <View style={[styles.lessonItem, styles.lessonItemLocked, isRtl && styles.lessonItemRtl]}>
                <View style={styles.lessonEmojiBox}>
                  <HugeiconsIcon icon={lockedItem ? getLessonIcon(lockedItem.type, lockedBank) : Airplane01Icon} size={32} color="#94A3B8" strokeWidth={2.5} />
                </View>
                <View style={[styles.lessonDetails, isRtl && styles.lessonDetailsRtl]}>
                  <AppText
                    style={[styles.lessonTitle, isRtl && styles.rtlText]}
                    languageCode={locale}
                    align="start"
                    fullWidth
                    latinRole="bold"
                  >
                    {getLocalizedLessonTopic(lockedBank) ?? t("twinoHome.fallbackLocked")}
                  </AppText>
                  <View style={[styles.lessonMeta, isRtl && styles.lessonMetaRtl]}>
                    <AppText
                      style={[styles.lessonCategory, isRtl && styles.rtlText]}
                      languageCode={locale}
                      align="start"
                    >
                      {lockedItem ? t(getLessonCategoryKey(lockedItem.type)) : t("twinoHome.categoryPractice")}
                    </AppText>
                    <View style={styles.lessonDot} />
                    <AppText
                      style={[styles.lessonDuration, isRtl && styles.rtlText]}
                      languageCode={locale}
                      align="start"
                    >
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

function createStyles(Colors: any, isDark: boolean, screenWidth: number = 400) {
  const isSmall = screenWidth < 380;
  return StyleSheet.create({
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
  headerRtl: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLogo: {
    width: isSmall ? 48 : 44,
    height: isSmall ? 48 : 44,
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: isSmall ? 24 : 22,
    color: Colors.foreground,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRightRtl: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? "rgba(218, 165, 32, 0.15)" : "#FFF8E1",
    borderWidth: 1.5,
    borderColor: isDark ? "rgba(218, 165, 32, 0.4)" : "#F5D060",
  },
  upgradeBtnText: {
    fontSize: 13,
    color: isDark ? "#F5D060" : "#92700A",
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
    width: "100%",
    marginTop: 8,
    marginBottom: 32,
  },
  greetingSectionRtl: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
    width: "100%",
  },
  greetingSub: {
    width: "100%",
    fontSize: 16,
    color: Colors.mutedForeground,
    marginBottom: 4,
  },
  greetingNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  greetingNameRowRtl: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  greetingTitle: {
    fontSize: 32,
    color: Colors.foreground,
  },
  greetingSubRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  greetingTitleRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  aiCard: {
    backgroundColor: Colors.warmBg,
    borderRadius: 28,
    padding: 18,
    marginBottom: 24,
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
  },
  aiCardLogo: {
    position: "absolute",
    top: isSmall ? 8 : 14,
    width: isSmall ? 160 : 150,
    height: isSmall ? 160 : 150,
    opacity: 0.9,
    zIndex: 1,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: 14,
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
    fontSize: 21,
    color: Colors.foreground,
    marginBottom: 8,
    lineHeight: 28,
  },
  aiCardSub: {
    fontSize: 13.5,
    color: Colors.mutedForeground,
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: "100%",
  },
  aiCardBtn: {
    width: "100%",
    minHeight: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  aiCardBtnText: {
    color: isDark ? "#0F172A" : "#FFFFFF",
    fontSize: 12,
  },
  aiCardBtnRow: {
    flexDirection: "column",
    gap: 10,
    zIndex: 2,
    width: "100%",
    marginTop: 8,
  },
  learnBtn: {
    width: "100%",
    minHeight: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
  },
  learnBtnText: {
    color: Colors.foreground,
    fontSize: 13,
  },
  btn3DPrimary: {
    backgroundColor: isDark ? "#FFFFFF" : "#0F172A",
    borderWidth: 1.5,
    borderColor: isDark ? "#E2E8F0" : "#1E293B",
    borderBottomWidth: 5,
    borderBottomColor: isDark ? "#CBD5E1" : "#020617",
  },
  btn3DSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderBottomWidth: 5,
    borderBottomColor: "#CBD5E1",
  },
  btn3DOrange: {
    backgroundColor: "#FF9600",
    borderWidth: 1.5,
    borderColor: "#EA580C",
    borderBottomWidth: 5,
    borderBottomColor: "#B33E00",
  },
  btnFlat: {
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9",
    borderWidth: 1,
    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    gap: isSmall ? 10 : 16,
    marginBottom: isSmall ? 28 : 36,
  },
  statsRowRtl: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.cardSurface,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    padding: isSmall ? 14 : 20,
    borderRadius: isSmall ? 20 : 24,
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
    marginBottom: isSmall ? 12 : 20,
  },
  statIconWrap: {
    width: isSmall ? 42 : 48,
    height: isSmall ? 42 : 48,
    borderRadius: isSmall ? 21 : 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: isSmall ? 26 : 28,
    color: Colors.foreground,
  },
  statUnit: {
    fontSize: 14,
    color: Colors.mutedForeground,
    marginLeft: 4,
  },
  statLabel: {
    fontSize: isSmall ? 11 : 13,
    color: Colors.mutedForeground,
    marginTop: 4,
    lineHeight: isSmall ? 15 : 18,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statValueRowRtl: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  upNextHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmall ? 12 : 20,
  },
  statHeaderRtl: {
    flexDirection: "row-reverse",
  },
  upNextHeaderRtl: {
    flexDirection: "row-reverse",
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
    padding: isSmall ? 14 : 20,
    borderRadius: isSmall ? 20 : 24,
    gap: isSmall ? 12 : 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  lessonItemRtl: {
    flexDirection: "row",
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
    width: isSmall ? 52 : 60,
    height: isSmall ? 52 : 60,
    borderRadius: isSmall ? 18 : 20,
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
    minWidth: 0,
  },
  lessonDetailsRtl: {
    alignItems: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  lessonTitle: {
    fontSize: isSmall ? 15 : 16,
    color: Colors.foreground,
    marginBottom: 6,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lessonMetaRtl: {
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    alignSelf: I18nManager.isRTL ? "flex-start" : "flex-end",
  },
  lessonCategory: {
    fontSize: 12,
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
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
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
}
