import { AppText } from "../../components/ui/AppText";
import { IOSPressable as TouchableOpacity } from "../../components/ui/ios-pressable";
import { hapticSelection } from "../../utils/haptics";
import { useSafeBack } from "../../hooks/use-safe-back";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  PlayIcon,
  LockIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocaleStore } from "../../stores/useLocaleStore";
import { useThemeColors } from "../../hooks/useThemeColors";

export function CourseDetailsScreen() {
  const router = useRouter();
  const safeBack = useSafeBack("/(tabs)/play");
  const insets = useSafeAreaInsets();
  const locale = useLocaleStore((s) => s.locale);
  const isRTL = locale === "ku" || locale === "ar";
  const { colors: Colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(Colors, isDark), [Colors, isDark]);

  const handleBack = () => {
    safeBack();
  };

  const handleStartPractice = () => {
    hapticSelection();
    router.push("/voice-tutor");
  };

  // For circular progress (70%)
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (70 / 100) * circumference;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* BANNER */}
        <View style={styles.banner}>
          <Image
            source={require("../../../assets/twino_restaurant.png")}
            style={styles.bannerImg}
            contentFit="cover"
          />
          <View style={styles.bannerOverlay} />
          
          <TouchableOpacity 
            style={[styles.backBtn, { top: insets.top + 16 }, isRTL ? { right: 24, left: "auto" } : { left: 24, right: "auto" }]} 
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <HugeiconsIcon icon={isRTL ? ArrowRight01Icon : ArrowLeft01Icon} size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.bannerTextWrap}>
            <View style={styles.bannerTags}>
              <View style={styles.levelBadge}>
                <AppText style={styles.levelText} forceLatinFont latinRole="bold">BEGINNER</AppText>
              </View>
              <AppText style={styles.durationText}>15 min duration</AppText>
            </View>
            <AppText style={styles.bannerTitle}>Ordering Coffee</AppText>
          </View>
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.main}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <AppText style={styles.progressTitle}>Course Progress</AppText>
                <AppText style={styles.progressSub}>3 of 5 lessons completed</AppText>
              </View>
              <View style={styles.circularProgressWrap}>
                <Svg width={48} height={48} style={{ transform: [{ rotate: "-90deg" }] }}>
                  <Circle
                    cx={24}
                    cy={24}
                    r={radius}
                    stroke="rgba(241, 245, 249, 0.5)" // muted light
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <Circle
                    cx={24}
                    cy={24}
                    r={radius}
                    stroke={Colors.primary}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </Svg>
                <AppText style={styles.progressPercent} forceLatinFont latinRole="bold">70%</AppText>
              </View>
            </View>

            <View style={styles.lessonList}>
              {/* Completed Lesson 1 */}
              <View style={styles.lessonItem}>
                <View style={[styles.iconBox, { backgroundColor: Colors.successBg }]}>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={Colors.success} />
                </View>
                <View style={styles.lessonItemText}>
                  <AppText style={styles.lessonItemTitle}>Essential Vocabulary</AppText>
                  <AppText style={styles.lessonItemSub}>Flashcards & Pronunciation</AppText>
                </View>
                <AppText style={styles.statusDone}>DONE</AppText>
              </View>

              {/* Completed Lesson 2 */}
              <View style={styles.lessonItem}>
                <View style={[styles.iconBox, { backgroundColor: Colors.successBg }]}>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color={Colors.success} />
                </View>
                <View style={styles.lessonItemText}>
                  <AppText style={styles.lessonItemTitle}>Common Phrases</AppText>
                  <AppText style={styles.lessonItemSub}>Grammar structures</AppText>
                </View>
                <AppText style={styles.statusDone}>DONE</AppText>
              </View>

              {/* Active Lesson */}
              <TouchableOpacity 
                style={styles.activeLessonItem} 
                activeOpacity={0.8}
                onPress={handleStartPractice}
              >
                <View style={styles.activeIconBox}>
                   <HugeiconsIcon icon={PlayIcon} size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
                </View>
                <View style={styles.lessonItemText}>
                  <AppText style={styles.activeItemTitle}>Live AI Practice</AppText>
                  <AppText style={styles.activeItemSub}>Roleplay with your tutor</AppText>
                </View>
                <AppText style={styles.statusNow}>NOW</AppText>
              </TouchableOpacity>

              {/* Locked Lesson */}
              <View style={[styles.lessonItem, { opacity: 0.5 }]}>
                <View style={[styles.iconBox, { backgroundColor: Colors.muted }]}>
                   <HugeiconsIcon icon={LockIcon} size={18} color={Colors.mutedForeground} />
                </View>
                <View style={styles.lessonItemText}>
                  <AppText style={styles.lessonItemTitle}>Review Quiz</AppText>
                  <AppText style={styles.lessonItemSub}>Test your knowledge</AppText>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.continueBtn}
              onPress={handleStartPractice}
              activeOpacity={0.8}
            >
              <AppText style={styles.continueBtnText}>Continue Learning</AppText>
            </TouchableOpacity>
          </View>

          {/* AI TIP */}
          <View style={styles.tipCard}>
            <HugeiconsIcon icon={InformationCircleIcon} size={24} color={Colors.secondary} />
            <View style={{ flex: 1 }}>
              <AppText style={styles.tipTitle}>AI Tip</AppText>
              <AppText style={styles.tipText}>
                Try using {'"'}Me gustaría{'"'} instead of {'"'}Quiero{'"'} to sound more polite when ordering.
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(Colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  banner: {
    height: 288,
    position: "relative",
    backgroundColor: Colors.muted,
  },
  bannerImg: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backBtn: {
    position: "absolute",
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTextWrap: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
  },
  bannerTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  main: {
    paddingHorizontal: 24,
    marginTop: -16,
    paddingBottom: 48,
  },
  progressCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.foreground,
  },
  progressSub: {
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  circularProgressWrap: {
    width: 48,
    height: 48,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercent: {
    position: "absolute",
    fontSize: 10,
    color: Colors.foreground,
  },
  lessonList: {
    gap: 16,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  lessonItemText: {
    flex: 1,
  },
  lessonItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.foreground,
  },
  lessonItemSub: {
    fontSize: 12,
    color: Colors.mutedForeground,
  },
  statusDone: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.mutedForeground,
  },
  activeLessonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: isDark ? "rgba(255, 107, 74, 0.12)" : "rgba(255, 107, 74, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 74, 0.2)",
  },
  activeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  activeItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  activeItemSub: {
    fontSize: 12,
    color: "rgba(255, 107, 74, 0.7)",
  },
  statusNow: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
  },
  continueBtn: {
    backgroundColor: Colors.foreground,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  continueBtnText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  tipCard: {
    flexDirection: "row",
    gap: 16,
    padding: 24,
    backgroundColor: isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.05)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: isDark ? "rgba(96, 165, 250, 0.22)" : "rgba(59, 130, 246, 0.1)",
    marginTop: 24,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
  });
}
