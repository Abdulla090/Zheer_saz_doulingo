import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { PremiumPressable } from "../../components/PremiumPressable";
import { TwinoBrandMark } from "../../components/branding/twino-brand-mark";
import { TwinoMascot } from "../../components/mascot/TwinoMascot";
import { AppText } from "../../components/ui/AppText";
import { PRIMARY_ACTION } from "../../constants/primary-action";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { supabase } from "../../lib/supabase";

type CreditPack = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  creditAmount: number;
  priceIqd: number;
  currency: "IQD";
};

type Notice = {
  tone: "info" | "success" | "error";
  text: string;
};

const COPY = {
  en: {
    back: "Back to learning",
    eyebrow: "TWINO CREDITS",
    title: "Keep learning when you need more AI practice.",
    body: "Buy credits once and use them for eligible TWINO AI features. No subscription and no automatic renewal.",
    balance: "Your balance",
    signIn: "Sign in to view credit packs",
    packsTitle: "Choose a credit pack",
    packsBody: "You will finish payment securely on Wayl.",
    buy: "Continue to Wayl",
    waiting: "Credit packs are not configured yet",
    waitingBody:
      "Your Wayl account can stay unfinished for now. Add pack prices after the merchant account and API token are ready.",
    setup: "Checkout is waiting for your Wayl merchant credentials.",
    pending: "Payment is being confirmed. Your balance updates after Wayl verifies it.",
    paid: "Payment confirmed. Your credits are ready.",
    failed: "This payment was not completed. Your balance was not changed.",
    secure: "Payments are handled on Wayl’s hosted checkout. TWINO never receives your card details.",
    oneTime: "One-time purchase",
    noRenewal: "No automatic renewal",
    serverBalance: "Server-protected balance",
  },
  ku: {
    back: "گەڕانەوە بۆ فێربوون",
    eyebrow: "کرێدیتی TWINO",
    title: "کاتێک ڕاهێنانی AI ـی زیاتر دەوێت، بەردەوام بە لە فێربوون.",
    body: "تەنها یەکجار کرێدیت بکڕە و بۆ تایبەتمەندییە شیاوەکانی AI بەکاریبهێنە. هیچ بەشداریکردن و نوێکردنەوەی خۆکار نییە.",
    balance: "باڵانسی تۆ",
    signIn: "بچۆ ژوورەوە بۆ بینینی پاکەتەکان",
    packsTitle: "پاکەتێکی کرێدیت هەڵبژێرە",
    packsBody: "پارەدان بە پارێزراوی لە Wayl تەواو دەکەیت.",
    buy: "بەردەوامبوون بۆ Wayl",
    waiting: "پاکەتەکانی کرێدیت هێشتا ڕێکنەخراون",
    waitingBody:
      "هەژماری Wayl دەتوانێت ئێستا ناتەواو بێت. دوای ئامادەبوونی API token نرخەکان زیاد بکە.",
    setup: "Checkout چاوەڕێی زانیارییەکانی بازرگانی Wayl ـە.",
    pending: "پارەدان پشتڕاست دەکرێتەوە. دوای پشتڕاستکردنەوەی Wayl باڵانسەکەت نوێ دەبێتەوە.",
    paid: "پارەدان پشتڕاست کرایەوە. کرێدیتەکانت ئامادەن.",
    failed: "پارەدان تەواو نەبوو. باڵانسەکەت نەگۆڕا.",
    secure: "پارەدان لە checkout ـی Wayl ئەنجام دەدرێت و TWINO زانیاری کارتەکەت نابینێت.",
    oneTime: "کڕینی یەکجار",
    noRenewal: "بێ نوێکردنەوەی خۆکار",
    serverBalance: "باڵانسی پارێزراو لە سێرڤەر",
  },
  ar: {
    back: "العودة إلى التعلم",
    eyebrow: "رصيد TWINO",
    title: "واصل التعلم عندما تحتاج إلى تدريب إضافي بالذكاء الاصطناعي.",
    body: "اشترِ الرصيد مرة واحدة واستخدمه في ميزات TWINO المؤهلة. لا اشتراك ولا تجديد تلقائي.",
    balance: "رصيدك",
    signIn: "سجّل الدخول لعرض حزم الرصيد",
    packsTitle: "اختر حزمة رصيد",
    packsBody: "ستُكمل الدفع بأمان على Wayl.",
    buy: "المتابعة إلى Wayl",
    waiting: "لم يتم إعداد حزم الرصيد بعد",
    waitingBody:
      "يمكن أن يبقى حساب Wayl غير مكتمل الآن. أضف الأسعار بعد جاهزية حساب التاجر ورمز API.",
    setup: "صفحة الدفع بانتظار بيانات تاجر Wayl.",
    pending: "يتم تأكيد الدفع. سيُحدّث رصيدك بعد تحقق Wayl.",
    paid: "تم تأكيد الدفع. رصيدك جاهز.",
    failed: "لم تكتمل عملية الدفع ولم يتغير رصيدك.",
    secure: "تتم معالجة الدفع في صفحة Wayl المستضافة ولا يستلم TWINO بيانات بطاقتك.",
    oneTime: "شراء لمرة واحدة",
    noRenewal: "بدون تجديد تلقائي",
    serverBalance: "رصيد محمي على الخادم",
  },
} as const;

function formatIqd(value: number) {
  return `${new Intl.NumberFormat("en-IQ", { maximumFractionDigits: 0 }).format(value)} IQD`;
}

async function functionErrorMessage(error: unknown, fallback: string) {
  const context = (error as { context?: Response } | null)?.context;
  if (context && typeof context.clone === "function") {
    try {
      const payload = (await context.clone().json()) as { message?: unknown };
      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
      }
    } catch {
      // The fallback below is intentionally user-safe.
    }
  }
  return fallback;
}

export function SubscriptionScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const { isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;
  const copy = isKu ? COPY.ku : isAr ? COPY.ar : COPY.en;
  const { user, profile } = useAuth();
  const { colors, isDark } = useThemeColors();
  const params = useLocalSearchParams<{ payment?: string | string[] }>();
  const returnedPayment = Array.isArray(params.payment)
    ? params.payment[0]
    : params.payment;
  const styles = useMemo(
    () => createStyles(colors, isDark, compact),
    [colors, compact, isDark],
  );

  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingPackId, setProcessingPackId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const loadWallet = useCallback(async () => {
    if (!user) {
      setPacks([]);
      setBalance(null);
      return;
    }

    setLoading(true);
    const [packsResult, balanceResult] = await Promise.all([
      supabase.functions.invoke("wayl-checkout", {
        body: { action: "packs" },
      }),
      supabase.functions.invoke("credits", {
        body: { action: "balance" },
      }),
    ]);

    if (!packsResult.error && Array.isArray(packsResult.data?.packs)) {
      setPacks(packsResult.data.packs as CreditPack[]);
    } else {
      setPacks([]);
    }
    if (
      !balanceResult.error &&
      typeof balanceResult.data?.balance === "number"
    ) {
      setBalance(balanceResult.data.balance);
    } else {
      setBalance(null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadWallet();
  }, [loadWallet]);

  useEffect(() => {
    if (!user || !returnedPayment) return;

    let stopped = false;
    let attempts = 0;
    setNotice({ tone: "info", text: copy.pending });

    const checkStatus = async () => {
      attempts += 1;
      const { data, error } = await supabase.functions.invoke("wayl-checkout", {
        body: { action: "status", paymentId: returnedPayment },
      });
      if (stopped || error) return;

      const status = data?.payment?.status;
      if (status === "paid") {
        stopped = true;
        setNotice({ tone: "success", text: copy.paid });
        void loadWallet();
      } else if (["failed", "expired", "refunded"].includes(status)) {
        stopped = true;
        setNotice({ tone: "error", text: copy.failed });
      }
    };

    void checkStatus();
    const interval = setInterval(() => {
      if (stopped || attempts >= 24) {
        clearInterval(interval);
        return;
      }
      void checkStatus();
    }, 2500);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [copy.failed, copy.paid, copy.pending, loadWallet, returnedPayment, user]);

  const buyPack = async (pack: CreditPack) => {
    if (!user) {
      router.push({ pathname: "/auth", params: { redirect: "/credits" } });
      return;
    }

    setProcessingPackId(pack.id);
    setNotice(null);
    const { data, error } = await supabase.functions.invoke("wayl-checkout", {
      body: { action: "create", creditPackId: pack.id },
    });

    if (error) {
      setNotice({
        tone: "error",
        text: await functionErrorMessage(error, copy.setup),
      });
      setProcessingPackId(null);
      return;
    }

    const checkoutUrl =
      typeof data?.checkoutUrl === "string" ? data.checkoutUrl : "";
    if (
      Platform.OS === "web" &&
      checkoutUrl.startsWith("https://checkout.thewayl.com/")
    ) {
      window.location.assign(checkoutUrl);
      return;
    }

    setNotice({ tone: "error", text: copy.setup });
    setProcessingPackId(null);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topbar}>
          <PremiumPressable
            accessibilityRole="link"
            accessibilityLabel={copy.back}
            onPress={() => router.replace("/")}
            style={[
              styles.backButton,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
            containerStyle={styles.backButtonContainer}
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={18}
              color={colors.foreground}
              strokeWidth={2.4}
              style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}
            />
            <AppText
              style={styles.backText}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {copy.back}
            </AppText>
          </PremiumPressable>
          <TwinoBrandMark size={38} showName nameSize={23} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <View style={styles.eyebrow}>
              <HugeiconsIcon
                icon={Wallet02Icon}
                size={18}
                color="#168BD2"
                strokeWidth={2.5}
              />
              <AppText style={styles.eyebrowText} forceLatinFont latinRole="bold">
                {copy.eyebrow}
              </AppText>
            </View>
            <AppText
              style={[styles.title, { textAlign: isRtl ? "right" : "left" }]}
              forceKurdishFont={isKu}
              forceLatinFont={!isRtl}
              latinRole="bold"
            >
              {copy.title}
            </AppText>
            <AppText
              style={[styles.body, { textAlign: isRtl ? "right" : "left" }]}
              forceKurdishFont={isKu}
            >
              {copy.body}
            </AppText>
            <View style={styles.benefits}>
              {[copy.oneTime, copy.noRenewal, copy.serverBalance].map((item) => (
                <View
                  key={item}
                  style={[
                    styles.benefit,
                    { flexDirection: isRtl ? "row-reverse" : "row" },
                  ]}
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    color="#168BD2"
                    strokeWidth={2.6}
                  />
                  <AppText style={styles.benefitText} forceKurdishFont={isKu}>
                    {item}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.mascotStage}>
            <View style={styles.mascotHalo} />
            <View style={styles.twinoMascot}>
              <TwinoMascot
                size={compact ? 148 : 190}
                mascotId="pingo"
                pose="winning"
              />
            </View>
            <View style={styles.violetMascot}>
              <TwinoMascot
                size={compact ? 112 : 142}
                mascotId="violet"
                pose="encouraging"
              />
            </View>
          </View>
        </View>

        {user ? (
          <View style={styles.accountRow}>
            <View>
              <AppText style={styles.accountLabel} forceKurdishFont={isKu}>
                {copy.balance}
              </AppText>
              <AppText style={styles.accountName} numberOfLines={1}>
                {profile?.display_name || user.email || "TWINO learner"}
              </AppText>
            </View>
            <View style={styles.balancePill}>
              <HugeiconsIcon
                icon={Wallet02Icon}
                size={21}
                color="#168BD2"
                strokeWidth={2.6}
              />
              <AppText style={styles.balanceValue} forceLatinFont latinRole="bold">
                {balance === null ? "—" : balance.toLocaleString()}
              </AppText>
            </View>
          </View>
        ) : (
          <PremiumPressable
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: "/auth",
                params: { redirect: "/credits" },
              })
            }
            style={styles.signInButton}
            containerStyle={styles.signInButtonContainer}
          >
            <AppText
              style={styles.signInText}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {copy.signIn}
            </AppText>
          </PremiumPressable>
        )}

        {notice ? (
          <View
            style={[
              styles.notice,
              notice.tone === "success" && styles.noticeSuccess,
              notice.tone === "error" && styles.noticeError,
            ]}
            accessibilityRole="alert"
          >
            <AppText style={styles.noticeText} forceKurdishFont={isKu}>
              {notice.text}
            </AppText>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <AppText
            style={styles.sectionTitle}
            forceKurdishFont={isKu}
            latinRole="bold"
          >
            {copy.packsTitle}
          </AppText>
          <AppText style={styles.sectionBody} forceKurdishFont={isKu}>
            {copy.packsBody}
          </AppText>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#168BD2" size="large" />
          </View>
        ) : packs.length > 0 ? (
          <View style={styles.packGrid}>
            {packs.map((pack) => {
              const processing = processingPackId === pack.id;
              return (
                <View key={pack.id} style={styles.packCard}>
                  <View style={styles.packIcon}>
                    <HugeiconsIcon
                      icon={Wallet02Icon}
                      size={25}
                      color="#168BD2"
                      strokeWidth={2.5}
                    />
                  </View>
                  <AppText style={styles.packName} latinRole="bold">
                    {pack.name}
                  </AppText>
                  <View style={styles.creditRow}>
                    <AppText
                      style={styles.creditAmount}
                      forceLatinFont
                      latinRole="bold"
                    >
                      {pack.creditAmount.toLocaleString()}
                    </AppText>
                    <AppText style={styles.creditLabel}>credits</AppText>
                  </View>
                  {pack.description ? (
                    <AppText style={styles.packDescription}>
                      {pack.description}
                    </AppText>
                  ) : null}
                  <AppText style={styles.price} forceLatinFont latinRole="bold">
                    {formatIqd(pack.priceIqd)}
                  </AppText>
                  <PremiumPressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: processing }}
                    disabled={processing}
                    onPress={() => void buyPack(pack)}
                    style={styles.buyButton}
                  >
                    {processing ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <AppText
                        style={styles.buyText}
                        forceKurdishFont={isKu}
                        latinRole="bold"
                      >
                        {copy.buy}
                      </AppText>
                    )}
                  </PremiumPressable>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <HugeiconsIcon
                icon={Wallet02Icon}
                size={29}
                color="#168BD2"
                strokeWidth={2.4}
              />
            </View>
            <AppText
              style={styles.emptyTitle}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {copy.waiting}
            </AppText>
            <AppText style={styles.emptyBody} forceKurdishFont={isKu}>
              {copy.waitingBody}
            </AppText>
          </View>
        )}

        <AppText style={styles.securityNote} forceKurdishFont={isKu}>
          {copy.secure}
        </AppText>
      </ScrollView>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useThemeColors>["colors"],
  isDark: boolean,
  compact: boolean,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: isDark ? "#0B1220" : "#F5F8FB",
    },
    content: {
      width: "100%",
      maxWidth: 1180,
      alignSelf: "center",
      paddingHorizontal: compact ? 18 : 32,
      paddingTop: compact ? 18 : 28,
      paddingBottom: 76,
    },
    topbar: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: compact ? 20 : 30,
    },
    backButtonContainer: { alignSelf: "auto" },
    backButton: {
      minHeight: 42,
      alignItems: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.surfaceRaised,
      paddingHorizontal: 12,
      cursor: "pointer",
    } as any,
    backText: { color: colors.foreground, fontSize: 13 },
    hero: {
      minHeight: compact ? 570 : 390,
      flexDirection: compact ? "column" : "row",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.11)" : "#D7EAF4",
      borderRadius: compact ? 24 : 32,
      backgroundColor: isDark ? "#10263A" : "#EAF7FF",
      marginBottom: 22,
    },
    heroCopy: {
      width: compact ? "100%" : "62%",
      justifyContent: "center",
      paddingHorizontal: compact ? 24 : 52,
      paddingVertical: compact ? 34 : 44,
      zIndex: 2,
    },
    eyebrow: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(22,139,210,0.18)" : "#D6F0FF",
      paddingHorizontal: 10,
      paddingVertical: 7,
      marginBottom: 18,
    },
    eyebrowText: {
      color: isDark ? "#8DD7FF" : "#0E6FA9",
      fontSize: 11.5,
      letterSpacing: 1,
    },
    title: {
      maxWidth: 650,
      color: colors.foreground,
      fontSize: compact ? 36 : 50,
      lineHeight: compact ? 43 : 57,
      letterSpacing: compact ? -1.1 : -1.7,
    },
    body: {
      maxWidth: 620,
      color: colors.mutedForeground,
      fontSize: compact ? 15 : 16.5,
      lineHeight: compact ? 23 : 26,
      marginTop: 15,
    },
    benefits: { gap: 9, marginTop: 22 },
    benefit: { alignItems: "center", gap: 9 },
    benefitText: { color: colors.foreground, fontSize: 13.5, lineHeight: 19 },
    mascotStage: {
      width: compact ? "100%" : "38%",
      minHeight: compact ? 230 : 390,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    mascotHalo: {
      position: "absolute",
      width: compact ? 230 : 320,
      height: compact ? 230 : 320,
      borderRadius: compact ? 115 : 160,
      backgroundColor: isDark
        ? "rgba(91,192,244,0.12)"
        : "rgba(255,255,255,0.72)",
    },
    twinoMascot: {
      position: "absolute",
      left: compact ? "23%" : "5%",
      bottom: compact ? 2 : 44,
      zIndex: 2,
    },
    violetMascot: {
      position: "absolute",
      right: compact ? "22%" : "7%",
      bottom: compact ? 20 : 60,
      zIndex: 3,
    },
    accountRow: {
      minHeight: 78,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 18,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      backgroundColor: colors.surfaceRaised,
      paddingHorizontal: compact ? 18 : 24,
      paddingVertical: 14,
      marginBottom: 18,
    },
    accountLabel: { color: colors.mutedForeground, fontSize: 12.5 },
    accountName: {
      maxWidth: compact ? 190 : 450,
      color: colors.foreground,
      fontSize: 14.5,
      marginTop: 3,
    },
    balancePill: {
      minHeight: 46,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderRadius: 14,
      backgroundColor: isDark ? "rgba(22,139,210,0.14)" : "#ECF8FE",
      paddingHorizontal: 15,
    },
    balanceValue: {
      color: isDark ? "#8DD7FF" : "#0E6FA9",
      fontSize: 18,
      fontVariant: ["tabular-nums"],
    },
    signInButtonContainer: {
      width: "100%",
      maxWidth: 430,
      alignSelf: "center",
      marginBottom: 18,
    },
    signInButton: {
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      borderBottomWidth: 3,
      borderBottomColor: PRIMARY_ACTION.rim,
      backgroundColor: PRIMARY_ACTION.face,
      cursor: "pointer",
    } as any,
    signInText: { color: "#FFFFFF", fontSize: 14.5 },
    notice: {
      borderWidth: 1,
      borderColor: "#B9DFF3",
      borderRadius: 14,
      backgroundColor: isDark ? "rgba(22,139,210,0.12)" : "#EFF9FE",
      padding: 15,
      marginBottom: 20,
    },
    noticeSuccess: {
      borderColor: "#86D4A0",
      backgroundColor: isDark ? "rgba(34,197,94,0.10)" : "#EFFBF3",
    },
    noticeError: {
      borderColor: "#F1B5B5",
      backgroundColor: isDark ? "rgba(239,68,68,0.10)" : "#FFF5F5",
    },
    noticeText: { color: colors.foreground, fontSize: 13.5, lineHeight: 20 },
    sectionHeader: { alignItems: "center", marginTop: 30, marginBottom: 25 },
    sectionTitle: {
      color: colors.foreground,
      fontSize: compact ? 27 : 31,
      lineHeight: compact ? 34 : 38,
      textAlign: "center",
    },
    sectionBody: {
      color: colors.mutedForeground,
      fontSize: 14,
      lineHeight: 21,
      textAlign: "center",
      marginTop: 6,
    },
    loading: { minHeight: 220, alignItems: "center", justifyContent: "center" },
    packGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "stretch",
      gap: 16,
    },
    packCard: {
      width: compact ? "100%" : ("31.8%" as const),
      minWidth: compact ? 0 : 280,
      minHeight: 355,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 22,
      backgroundColor: colors.surfaceRaised,
      padding: 24,
      boxShadow: isDark
        ? "0 16px 40px rgba(0,0,0,0.16)"
        : "0 16px 40px rgba(31,70,92,0.07)",
    } as any,
    packIcon: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 15,
      backgroundColor: isDark ? "rgba(22,139,210,0.14)" : "#EAF7FE",
      marginBottom: 18,
    },
    packName: { color: colors.foreground, fontSize: 20, lineHeight: 26 },
    creditRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 7,
      marginTop: 12,
    },
    creditAmount: {
      color: colors.foreground,
      fontSize: 36,
      lineHeight: 42,
      letterSpacing: -1,
    },
    creditLabel: { color: colors.mutedForeground, fontSize: 13 },
    packDescription: {
      minHeight: 42,
      color: colors.mutedForeground,
      fontSize: 13.5,
      lineHeight: 20,
      marginTop: 10,
    },
    price: {
      color: "#168BD2",
      fontSize: 16,
      marginTop: "auto",
      marginBottom: 16,
    },
    buyButton: {
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      borderBottomWidth: 3,
      borderBottomColor: PRIMARY_ACTION.rim,
      backgroundColor: PRIMARY_ACTION.face,
      cursor: "pointer",
    } as any,
    buyText: { color: "#FFFFFF", fontSize: 14 },
    emptyState: {
      maxWidth: 720,
      width: "100%",
      minHeight: 245,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.border,
      borderRadius: 22,
      backgroundColor: colors.surfaceRaised,
      padding: 28,
    },
    emptyIcon: {
      width: 58,
      height: 58,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 18,
      backgroundColor: isDark ? "rgba(22,139,210,0.14)" : "#EAF7FE",
      marginBottom: 16,
    },
    emptyTitle: {
      color: colors.foreground,
      fontSize: 20,
      lineHeight: 26,
      textAlign: "center",
    },
    emptyBody: {
      maxWidth: 560,
      color: colors.mutedForeground,
      fontSize: 14,
      lineHeight: 21,
      textAlign: "center",
      marginTop: 8,
    },
    securityNote: {
      maxWidth: 720,
      alignSelf: "center",
      color: colors.mutedForeground,
      fontSize: 12.5,
      lineHeight: 19,
      textAlign: "center",
      marginTop: 24,
    },
  });
}
