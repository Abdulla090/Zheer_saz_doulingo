import SafeContainer from "../../components/shared/safe-container";
import { PressableScale } from "../../components/animations/PressableScale";
import { AppText } from "../../components/ui/AppText";
import { SUBSCRIPTION_URL } from "../../constants/app-meta";
import { useAuth } from "../../context/AuthContext";
import { tabBarScrollPadding } from "../../constants/layout";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { openHttpsUrl } from "../../utils/safe-link";
import {
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { isDesktopWebWidth } from "../../constants/web-layout";
import { useWindowDimensions, Platform, Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getSubscriptionPlanCopy,
  SUBSCRIPTION_PLAN_DATA,
  SUBSCRIPTION_PLAN_ORDER,
} from "../../constants/subscription-plans";

export function SubscriptionScreen() {
  const { isKu, isAr } = useI18n();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && isDesktopWebWidth(width);
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark, isDesktop), [colors, isDark, isDesktop]);
  const isRtl = isKu || isAr;
  const { billingAccount, refreshBillingAccount } = useAuth();
  const planLocale = isKu ? "ku" : isAr ? "ar" : "en";
  const planCopy = getSubscriptionPlanCopy(planLocale);
  const plans = SUBSCRIPTION_PLAN_ORDER.map((id) => ({
    id,
    name: id[0].toUpperCase() + id.slice(1),
    tag: planCopy.tags[id],
    description: planCopy.descriptions[id],
    benefits: planCopy.benefits[id],
    ...SUBSCRIPTION_PLAN_DATA[id],
  }));
  const currentPlan =
    billingAccount?.subscription.status === "active"
      ? billingAccount.subscription.plan
      : "free";
  const copy = isKu
    ? {
        eyebrow: "کرێدیت و پلانەکانی TWINO",
        title: "هەژمارەکەت لە هەموو ئامێرەکان یەکە",
        body: "باڵانس و پلانەکانی Free، Plus، Pro و Max لێرە نوێ دەبنەوە. هەموو پارەدانێک لە وێبسایت ئەنجام دەدرێت.",
        choose: "بینینی لە وێبسایت",
        note: "پارەدان تەنها لە وێب · پلانە پارەدراوەکان بۆ ٣٠ ڕۆژ",
        credits: "کرێدیت",
        plan: "پلانی ئێستا",
        expiry: "بەسەرچوون",
      }
    : isAr
      ? {
          eyebrow: "رصيد وخطط TWINO",
          title: "حساب واحد على جميع أجهزتك",
          body: "يتحدث رصيدك وخطط Free وPlus وPro وMax هنا. تتم جميع عمليات الدفع على الموقع.",
          choose: "عرض على الموقع",
          note: "الدفع على الويب فقط · الخطط المدفوعة لمدة 30 يوماً",
          credits: "الرصيد",
          plan: "الخطة الحالية",
          expiry: "الانتهاء",
        }
      : {
          eyebrow: "TWINO CREDITS & PLANS",
          title: "One account on every device",
          body: "Your balance and Free, Plus, Pro, or Max plan refresh here. Every purchase happens on the website.",
          choose: "View on website",
          note: "Web checkout only · Paid plans last 30 days",
          credits: "Credits",
          plan: "Current plan",
          expiry: "Expires",
        };

  useFocusEffect(
    useCallback(() => {
      void refreshBillingAccount();
    }, [refreshBillingAccount]),
  );

  const openWebsite = async () => {
    const opened = await openHttpsUrl(SUBSCRIPTION_URL);
    if (!opened) {
      Alert.alert(
        isKu
          ? "وێبسایت نەکرایەوە"
          : isAr
            ? "تعذر فتح الموقع"
            : "Could not open website",
        SUBSCRIPTION_URL,
      );
    }
  };

  return (
    <SafeContainer style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarScrollPadding(insets.bottom) + (isDesktop ? 32 : 16) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerColumn}>
          <View style={styles.hero}>
            <View style={styles.badge}>
              <AppText style={styles.badgeText} languageCode="en">
                {copy.eyebrow}
              </AppText>
            </View>

            <Image
              source={require("../../../assets/images/mascots/pet-violet.webp")}
              style={styles.mascot}
              contentFit="contain"
              accessibilityLabel={
                isKu ? "هاوڕێی مۆری TWINO" : "TWINO violet learning companion"
              }
            />

            <AppText style={styles.title} forceKurdishFont={isKu}>
              {copy.title}
            </AppText>
            <AppText style={styles.body} forceKurdishFont={isKu}>
              {copy.body}
            </AppText>
          </View>

          <View style={styles.accountStrip}>
            <View style={styles.accountMetric}>
              <AppText style={styles.accountLabel} forceKurdishFont={isKu}>{copy.credits}</AppText>
              <AppText style={styles.accountValue} forceLatinFont latinRole="bold">
                {(billingAccount?.wallet.creditBalance ?? 0).toLocaleString()}
              </AppText>
            </View>
            <View style={styles.accountMetric}>
              <AppText style={styles.accountLabel} forceKurdishFont={isKu}>{copy.plan}</AppText>
              <AppText style={styles.accountValue} forceLatinFont latinRole="bold">
                {currentPlan.toUpperCase()}
              </AppText>
            </View>
            <View style={styles.accountMetric}>
              <AppText style={styles.accountLabel} forceKurdishFont={isKu}>{copy.expiry}</AppText>
              <AppText style={styles.accountValue} forceLatinFont latinRole="bold">
                {billingAccount?.subscription.expiresAt
                  ? new Date(billingAccount.subscription.expiresAt).toLocaleDateString()
                  : "—"}
              </AppText>
            </View>
          </View>

          <View style={styles.packList}>
            {plans.map((pack) => {
              const planKey = pack.id;
              const isCurrent = currentPlan === planKey;
              return (
              <View
                key={pack.name}
                style={[styles.packCard, isCurrent && styles.packCardFeatured]}
              >
                <View
                  style={[
                    styles.packTop,
                    { flexDirection: isRtl ? "row-reverse" : "row" },
                  ]}
                >
                  <View style={styles.packIcon}>
                    <HugeiconsIcon
                      icon={Wallet02Icon}
                      size={24}
                      color="#168BD2"
                      strokeWidth={2.4}
                    />
                  </View>
                  <View style={styles.packCopy}>
                    <AppText
                      style={[styles.packTag, isRtl && styles.rtlText]}
                      forceKurdishFont={isKu}
                    >
                      {pack.tag}
                    </AppText>
                    <AppText
                      style={[styles.packName, isRtl && styles.rtlText]}
                      forceKurdishFont={isKu}
                      latinRole="bold"
                    >
                      {pack.name}
                    </AppText>
                  </View>
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={23}
                    color="#22A06B"
                    strokeWidth={2.3}
                  />
                </View>
                <AppText
                  style={[styles.packDescription, isRtl && styles.rtlText]}
                  forceKurdishFont={isKu}
                >
                  {pack.description}
                </AppText>
                <AppText style={[styles.packPrice, isRtl && styles.rtlText]} forceLatinFont latinRole="bold">
                  {pack.priceIqd.toLocaleString()} IQD{pack.durationDays ? ` / ${planCopy.duration}` : ""}
                </AppText>
                <AppText style={[styles.creditGrant, isRtl && styles.rtlText]} forceKurdishFont={isKu}>
                  {planCopy.credits(pack.includedCredits, pack.id === "free")}
                </AppText>
                {pack.liveTutorMinutes ? (
                  <AppText style={[styles.liveTutorEquivalent, isRtl && styles.rtlText]} forceKurdishFont={isKu}>
                    {planCopy.liveTutor(pack.liveTutorMinutes)}
                  </AppText>
                ) : null}
                <View style={styles.benefitList}>
                  {pack.benefits.map((benefit) => (
                    <View key={benefit} style={[styles.benefitRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} color="#22A06B" strokeWidth={2.3} />
                      <AppText style={[styles.benefitText, isRtl && styles.rtlText]} forceKurdishFont={isKu}>{benefit}</AppText>
                    </View>
                  ))}
                </View>
                <PressableScale
                  accessibilityRole="link"
                  accessibilityLabel={`${copy.choose}: ${pack.name}`}
                  onPress={() => void openWebsite()}
                  style={styles.chooseButton}
                >
                  <AppText
                    style={styles.chooseText}
                    forceKurdishFont={isKu}
                    latinRole="bold"
                  >
                    {copy.choose}
                  </AppText>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={19}
                    color="#FFFFFF"
                    strokeWidth={2.5}
                  />
                </PressableScale>
              </View>
              );
            })}
          </View>

          <View
            style={[
              styles.notice,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={20}
              color="#168BD2"
              strokeWidth={2.4}
            />
            <AppText
              style={[styles.noticeBody, isRtl && styles.rtlText]}
              forceKurdishFont={isKu}
            >
              {copy.note}
              {"\n"}{planCopy.walletNote}
              {"\n"}{planCopy.accessNote}
              {"\n"}{planCopy.ttsNote}
              {"\n"}{planCopy.checkoutPaused}
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

type ThemeColors = ReturnType<typeof useThemeColors>["colors"];

function createStyles(colors: ThemeColors, isDark: boolean, isDesktop = false) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      alignItems: "center",
      paddingHorizontal: isDesktop ? 32 : 16,
      paddingTop: isDesktop ? 32 : 20,
    },
    centerColumn: {
      width: "100%",
      maxWidth: isDesktop ? 860 : undefined,
      gap: 18,
    },
    hero: {
      alignItems: "center",
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      backgroundColor: colors.surface,
      paddingHorizontal: isDesktop ? 32 : 20,
      paddingVertical: isDesktop ? 32 : 24,
      overflow: "hidden",
    },
    badge: {
      alignSelf: "flex-start",
      borderRadius: 999,
      backgroundColor: isDark ? "rgba(22,139,210,0.14)" : "#EFF9FE",
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    badgeText: {
      color: isDark ? "#75CCFA" : "#0E6FA9",
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1.1,
    },
    mascot: {
      width: isDesktop ? 140 : 130,
      height: isDesktop ? 140 : 130,
      marginTop: 6,
      marginBottom: 6,
    },
    title: {
      color: colors.foreground,
      fontSize: isDesktop ? 28 : 24,
      lineHeight: isDesktop ? 36 : 32,
      fontWeight: "800",
      textAlign: "center",
    },
    body: {
      maxWidth: 560,
      marginTop: 8,
      color: colors.mutedForeground,
      fontSize: isDesktop ? 15.5 : 14.5,
      lineHeight: 23,
      textAlign: "center",
    },
    notice: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: isDark ? "rgba(69,180,240,0.28)" : "#CDEBFA",
      backgroundColor: isDark ? "rgba(22,139,210,0.09)" : "#F5FBFE",
      padding: 16,
      gap: 12,
      alignItems: "center",
    },
    noticeBody: {
      flex: 1,
      color: colors.mutedForeground,
      fontSize: 13.5,
      lineHeight: 21,
    },
    packList: {
      flexDirection: isDesktop ? "row" : "column",
      flexWrap: isDesktop ? "wrap" : "nowrap",
      gap: 16,
    },
    accountStrip: {
      flexDirection: "row",
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      backgroundColor: colors.surface,
      paddingVertical: 14,
      paddingHorizontal: 8,
    },
    accountMetric: {
      flex: 1,
      minWidth: 0,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
    },
    accountLabel: {
      color: colors.mutedForeground,
      fontSize: 12,
      textAlign: "center",
    },
    accountValue: {
      color: colors.foreground,
      fontSize: 16,
      textAlign: "center",
      marginTop: 4,
    },
    packCard: {
      width: isDesktop ? "48.8%" : "100%",
      flexGrow: isDesktop ? 1 : 0,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
      backgroundColor: colors.surface,
      padding: isDesktop ? 20 : 18,
      gap: 14,
    },
    packCardFeatured: {
      borderColor: "#168BD2",
      backgroundColor: isDark ? "rgba(22,139,210,0.08)" : "#F7FCFF",
    },
    packTop: {
      alignItems: "center",
      gap: 12,
    },
    packIcon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(22,139,210,0.14)" : "#E9F6FD",
    },
    packCopy: {
      flex: 1,
      gap: 2,
    },
    packTag: {
      color: "#168BD2",
      fontSize: 11,
      lineHeight: 15,
      fontWeight: "800",
      letterSpacing: 0.8,
    },
    packName: {
      color: colors.foreground,
      fontSize: 21,
      lineHeight: 27,
      fontWeight: "800",
    },
    packDescription: {
      color: colors.mutedForeground,
      fontSize: 14.5,
      lineHeight: 21,
    },
    packPrice: {
      color: colors.foreground,
      fontSize: 18,
      lineHeight: 24,
    },
    creditGrant: {
      color: "#168BD2",
      fontSize: 13.5,
      lineHeight: 20,
      fontWeight: "700",
    },
    liveTutorEquivalent: {
      color: colors.foreground,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 4,
    },
    benefitList: { gap: 8 },
    benefitRow: { alignItems: "flex-start", gap: 8 },
    benefitText: {
      flex: 1,
      color: colors.mutedForeground,
      fontSize: 13,
      lineHeight: 19,
    },
    chooseButton: {
      minHeight: 50,
      borderRadius: 16,
      backgroundColor: "#168BD2",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 18,
    },
    chooseText: {
      color: "#FFFFFF",
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "800",
    },
    rtlText: {
      textAlign: "right",
      writingDirection: "rtl",
    },
  });
}
