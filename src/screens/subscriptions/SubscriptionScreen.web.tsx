import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { PremiumPressable } from "../../components/PremiumPressable";
import { TwinoBrandMark } from "../../components/branding/twino-brand-mark";
import { AppText } from "../../components/ui/AppText";
import { PRIMARY_ACTION } from "../../constants/primary-action";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  createBillingCheckout,
  getBillingCatalog,
  getBillingPaymentStatus,
  type BillingProduct,
} from "../../services/billing";
import {
  getSubscriptionPlanCopy,
  SUBSCRIPTION_PLAN_DATA,
  SUBSCRIPTION_PLAN_ORDER,
} from "../../constants/subscription-plans";
import type { PlanId } from "../../types/entitlements";

type Notice = { tone: "info" | "success" | "error"; text: string };

const COPY = {
  en: {
    back: "Back to learning",
    eyebrow: "TWINO PRICING",
    title: "Credits when you need them. Plans when you want more.",
    body: "Checkout stays on the web. Your balance and plan sync to the same Twino account on every device.",
    balance: "Credits",
    currentPlan: "Current plan",
    expires: "Expires",
    signIn: "Sign in to continue",
    creditsTitle: "Credit packages",
    creditsBody: "One-time top-ups for eligible AI practice.",
    plansTitle: "Plans",
    plansBody: "Plus, Pro, and Max are 30-day purchases. Each purchase or renewal adds its credits to your permanent wallet.",
    free: "Free",
    plus: "Plus",
    pro: "Pro",
    max: "Max",
    active: "Current",
    buy: "Buy",
    renew: "Renew",
    unavailable: "Purchases paused",
    downgradeBlocked: "Available after your higher plan expires",
    noProducts: "Add real package prices after your merchant account is approved.",
    setup: "Checkout is ready and waiting for verified merchant activation.",
    pending: "Confirming payment with the provider…",
    paid: "Payment confirmed. Your Twino account is updated.",
    failed: "Payment was not completed. Your account was not changed.",
    secure: "Provider-hosted checkout · Verified webhooks · No card details stored by Twino",
  },
  ku: {
    back: "گەڕانەوە بۆ فێربوون",
    eyebrow: "نرخەکانی TWINO",
    title: "کاتێک پێویستت بوو کرێدیت، و کاتێک زیاتر دەوێت پلان.",
    body: "پارەدان لە وێبە. باڵانس و پلانەکەت لە هەمان هەژماری Twino لە هەموو ئامێرەکان نوێ دەبێتەوە.",
    balance: "کرێدیت",
    currentPlan: "پلانی ئێستا",
    expires: "بەسەردەچێت",
    signIn: "بچۆ ژوورەوە بۆ بەردەوامبوون",
    creditsTitle: "پاکەتەکانی کرێدیت",
    creditsBody: "زیادکردنی یەکجار بۆ ڕاهێنانی AI.",
    plansTitle: "پلانەکان",
    plansBody: "Plus و Pro و Max بۆ ٣٠ ڕۆژن. هەر کڕین یان نوێکردنەوەیەک کرێدیتەکانی بۆ جزدانە هەمیشەییەکەت زیاد دەکات.",
    free: "Free",
    plus: "Plus",
    pro: "Pro",
    max: "Max",
    active: "پلانی ئێستا",
    buy: "کڕین",
    renew: "نوێکردنەوە",
    unavailable: "کڕین وەستێنراوە",
    downgradeBlocked: "دوای بەسەرچوونی پلانی بەرزتر بەردەستە",
    noProducts: "دوای پەسەندکردنی هەژماری بازرگانی، نرخە ڕاستەقینەکان زیاد بکە.",
    setup: "Checkout چاوەڕێی چالاککردنی پشتڕاستکراوەی هەژماری بازرگانییە.",
    pending: "پارەدان لەلایەن دابینکەرەوە پشتڕاست دەکرێتەوە…",
    paid: "پارەدان پشتڕاست کرایەوە و هەژماری Twino نوێ بووەوە.",
    failed: "پارەدان تەواو نەبوو و هەژمارەکەت نەگۆڕا.",
    secure: "Checkout ـی دابینکەر · Webhook ـی پشتڕاستکراو · Twino زانیاری کارت هەڵناگرێت",
  },
  ar: {
    back: "العودة إلى التعلم",
    eyebrow: "أسعار TWINO",
    title: "رصيد عند الحاجة، وخطة عندما تريد المزيد.",
    body: "يتم الدفع على الويب، ويتزامن رصيدك وخطتك مع حساب Twino نفسه على جميع أجهزتك.",
    balance: "الرصيد",
    currentPlan: "الخطة الحالية",
    expires: "تنتهي",
    signIn: "سجّل الدخول للمتابعة",
    creditsTitle: "حزم الرصيد",
    creditsBody: "شحن لمرة واحدة لتدريبات الذكاء الاصطناعي المؤهلة.",
    plansTitle: "الخطط",
    plansBody: "Plus وPro وMax خطط لمدة 30 يوماً. يضيف كل شراء أو تجديد رصيده إلى محفظتك الدائمة.",
    free: "Free",
    plus: "Plus",
    pro: "Pro",
    max: "Max",
    active: "الحالية",
    buy: "شراء",
    renew: "تجديد",
    unavailable: "الشراء متوقف",
    downgradeBlocked: "متاح بعد انتهاء خطتك الأعلى",
    noProducts: "أضف الأسعار الحقيقية بعد اعتماد حساب التاجر.",
    setup: "صفحة الدفع جاهزة وتنتظر تفعيل حساب التاجر بعد التحقق منه.",
    pending: "يتم تأكيد الدفع مع المزوّد…",
    paid: "تم تأكيد الدفع وتحديث حساب Twino.",
    failed: "لم تكتمل عملية الدفع ولم يتغير حسابك.",
    secure: "صفحة دفع مستضافة · Webhooks موثقة · لا يخزن Twino بيانات البطاقة",
  },
} as const;

function formatMoney(amount: number, currency: string) {
  return `${new Intl.NumberFormat("en-IQ", { maximumFractionDigits: 0 }).format(amount)} ${currency}`;
}

function formatDate(value: string | null, locale: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
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
      // Keep the localized fallback.
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
  const planLocale = isKu ? "ku" : isAr ? "ar" : "en";
  const planCopy = getSubscriptionPlanCopy(planLocale);
  const locale = isKu ? "ku" : isAr ? "ar-IQ" : "en-IQ";
  const { user, billingAccount, refreshBillingAccount } = useAuth();
  const { colors, isDark } = useThemeColors();
  const params = useLocalSearchParams<{ payment?: string | string[] }>();
  const returnedPayment = Array.isArray(params.payment) ? params.payment[0] : params.payment;
  const styles = useMemo(
    () => createStyles(colors, isDark, compact),
    [colors, compact, isDark],
  );

  const [products, setProducts] = useState<BillingProduct[]>([]);
  const [provider, setProvider] = useState<"wayl" | "rasedi" | null>(null);
  const [providerReady, setProviderReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const loadCatalog = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setProvider(null);
      setProviderReady(false);
      return;
    }
    setLoading(true);
    try {
      const catalog = await getBillingCatalog();
      setProducts(catalog.products);
      setProvider(catalog.provider);
      setProviderReady(catalog.providerReady);
      await refreshBillingAccount();
    } catch {
      setProducts([]);
      setProvider(null);
      setProviderReady(false);
    } finally {
      setLoading(false);
    }
  }, [refreshBillingAccount, user]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (!user || !returnedPayment) return;
    let stopped = false;
    let attempts = 0;
    setNotice({ tone: "info", text: copy.pending });

    const check = async () => {
      attempts += 1;
      try {
        const payment = await getBillingPaymentStatus(returnedPayment);
        if (stopped || !payment) return;
        if (payment.status === "completed") {
          stopped = true;
          setNotice({ tone: "success", text: copy.paid });
          await refreshBillingAccount();
        } else if (["failed", "cancelled", "expired", "refunded"].includes(payment.status)) {
          stopped = true;
          setNotice({ tone: "error", text: copy.failed });
        }
      } catch {
        // Keep the pending notice; provider reconciliation may still complete.
      }
    };

    void check();
    const interval = setInterval(() => {
      if (stopped || attempts >= 24) {
        clearInterval(interval);
      } else {
        void check();
      }
    }, 2500);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [copy.failed, copy.paid, copy.pending, refreshBillingAccount, returnedPayment, user]);

  const startCheckout = async (product: BillingProduct) => {
    if (!user) {
      router.push({ pathname: "/auth", params: { redirect: "/pricing" } });
      return;
    }
    setProcessingId(product.id);
    setNotice(null);
    try {
      const checkout = await createBillingCheckout(product.id);
      const url = new URL(checkout.checkoutUrl);
      const waylHostAllowed =
        checkout.provider === "wayl" &&
        (url.hostname === "checkout.thewayl.com" ||
          url.hostname.endsWith(".checkout.thewayl.com"));
      if (url.protocol !== "https:" || !waylHostAllowed) {
        throw new Error("Untrusted checkout URL");
      }
      window.location.assign(url.toString());
    } catch (error) {
      setNotice({
        tone: "error",
        text: await functionErrorMessage(error, copy.setup),
      });
      setProcessingId(null);
    }
  };

  const creditProducts = products.filter((product) => product.productType === "credits");
  const subscriptionProducts = products.filter(
    (product) => product.productType === "subscription",
  );
  const productForPlan = (plan: Exclude<PlanId, "free">) =>
    subscriptionProducts.find((product) => product.plan === plan);
  const currentPlan =
    billingAccount?.subscription.status === "active"
      ? billingAccount.subscription.plan
      : "free";

  const planRank: Record<PlanId, number> = { free: 0, plus: 1, pro: 2, max: 3 };
  const renderProductAction = (
    product: BillingProduct | undefined,
    plan?: Exclude<PlanId, "free">,
  ) => {
    if (plan && planRank[plan] < planRank[currentPlan]) {
      return <AppText style={styles.unavailable}>{copy.downgradeBlocked}</AppText>;
    }
    if (!product) {
      return <AppText style={styles.unavailable}>{copy.unavailable}</AppText>;
    }
    if (!product.purchasable || !providerReady) {
      return <AppText style={styles.unavailable}>{copy.unavailable}</AppText>;
    }
    const processing = processingId === product.id;
    return (
      <PremiumPressable
        accessibilityRole="button"
        accessibilityState={{ disabled: processing }}
        disabled={processing}
        onPress={() => void startCheckout(product)}
        style={styles.buyButton}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <AppText style={styles.buyText} forceKurdishFont={isKu} latinRole="bold">
            {plan === currentPlan ? copy.renew : copy.buy}
          </AppText>
        )}
      </PremiumPressable>
    );
  };

  return (
    <View
      {...({ dir: isRtl ? "rtl" : "ltr" } as { dir: "rtl" | "ltr" })}
      style={styles.root}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}>
          <PremiumPressable
            accessibilityRole="link"
            accessibilityLabel={copy.back}
            onPress={() => router.replace("/")}
            style={[styles.backButton, { flexDirection: isRtl ? "row-reverse" : "row" }]}
          >
            <HugeiconsIcon
              icon={isRtl ? ArrowRight02Icon : ArrowLeft02Icon}
              size={18}
              color={colors.foreground}
              strokeWidth={2.4}
            />
            <AppText style={styles.backText} forceKurdishFont={isKu} latinRole="bold">
              {copy.back}
            </AppText>
          </PremiumPressable>
          <TwinoBrandMark size={38} showName nameSize={23} />
        </View>

        <View style={styles.hero}>
          <AppText style={styles.eyebrow} forceLatinFont latinRole="bold">
            {copy.eyebrow}
          </AppText>
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
        </View>

        {user ? (
          <View style={styles.accountStrip}>
            <AccountMetric label={copy.balance} value={(billingAccount?.wallet.creditBalance ?? 0).toLocaleString()} styles={styles} isKu={isKu} />
            <AccountMetric label={copy.currentPlan} value={currentPlan.toUpperCase()} styles={styles} isKu={isKu} />
            <AccountMetric label={copy.expires} value={formatDate(billingAccount?.subscription.expiresAt ?? null, locale)} styles={styles} isKu={isKu} />
          </View>
        ) : (
          <PremiumPressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: "/auth", params: { redirect: "/pricing" } })}
            style={styles.signInButton}
          >
            <AppText style={styles.signInText} forceKurdishFont={isKu} latinRole="bold">
              {copy.signIn}
            </AppText>
          </PremiumPressable>
        )}

        {notice ? (
          <View
            accessibilityRole="alert"
            style={[
              styles.notice,
              notice.tone === "success" && styles.noticeSuccess,
              notice.tone === "error" && styles.noticeError,
            ]}
          >
            <AppText style={styles.noticeText} forceKurdishFont={isKu}>{notice.text}</AppText>
          </View>
        ) : null}

        <PricingSection title={copy.creditsTitle} body={copy.creditsBody} styles={styles} isKu={isKu}>
          {loading ? (
            <View style={styles.loading}><ActivityIndicator color="#168BD2" /></View>
          ) : creditProducts.length ? (
            creditProducts.map((product, index) => (
              <View key={product.id} style={[styles.priceRow, index > 0 && styles.rowDivider]}>
                <View style={styles.rowMain}>
                  <AppText style={styles.rowTitle} latinRole="bold">{product.name}</AppText>
                  <AppText style={styles.rowDescription}>{product.credits?.toLocaleString()} credits{product.description ? ` · ${product.description}` : ""}</AppText>
                </View>
                <AppText style={styles.price}>{formatMoney(product.amount, product.currency)}</AppText>
                {renderProductAction(product)}
              </View>
            ))
          ) : (
            <View style={styles.emptyRow}>
              <HugeiconsIcon icon={Wallet02Icon} size={22} color="#168BD2" strokeWidth={2.4} />
              <AppText style={styles.emptyText} forceKurdishFont={isKu}>{copy.noProducts}</AppText>
            </View>
          )}
        </PricingSection>

        <PricingSection title={copy.plansTitle} body={copy.plansBody} styles={styles} isKu={isKu}>
          {SUBSCRIPTION_PLAN_ORDER.map((plan, index) => {
            const product = plan === "free" ? undefined : productForPlan(plan);
            const planData = SUBSCRIPTION_PLAN_DATA[plan];
            return (
              <View key={plan} style={[styles.priceRow, index > 0 && styles.rowDivider]}>
                <View style={styles.planIcon}>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={21} color={plan === currentPlan ? "#22A06B" : "#168BD2"} strokeWidth={2.5} />
                </View>
                <View style={styles.rowMain}>
                  <View style={styles.planTitleRow}>
                    <AppText style={styles.rowTitle} latinRole="bold">{copy[plan]}</AppText>
                    {plan === "pro" || plan === "max" ? (
                      <AppText style={styles.planTag} forceKurdishFont={isKu} latinRole="bold">
                        {planCopy.tags[plan]}
                      </AppText>
                    ) : null}
                    {plan === currentPlan ? <AppText style={styles.currentTag}>{copy.active}</AppText> : null}
                  </View>
                  <AppText style={styles.rowDescription} forceKurdishFont={isKu}>
                    {planCopy.descriptions[plan]}
                  </AppText>
                  <AppText style={styles.creditLine} forceKurdishFont={isKu}>
                    {planCopy.credits(planData.includedCredits, plan === "free")}
                  </AppText>
                  {planData.liveTutorMinutes ? (
                    <AppText style={styles.liveTutorLine} forceKurdishFont={isKu}>
                      {planCopy.liveTutor(planData.liveTutorMinutes)}
                    </AppText>
                  ) : null}
                  <View style={styles.benefitList}>
                    {planCopy.benefits[plan].map((benefit) => (
                      <View key={benefit} style={[styles.benefitRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} color="#22A06B" strokeWidth={2.4} />
                        <AppText style={[styles.benefitText, { textAlign: isRtl ? "right" : "left" }]} forceKurdishFont={isKu}>{benefit}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
                <AppText style={styles.price}>{product ? formatMoney(product.amount, product.currency) : `${planData.priceIqd.toLocaleString()} IQD`}</AppText>
                {plan === "free" ? <View style={styles.actionSpacer} /> : renderProductAction(product, plan)}
              </View>
            );
          })}
        </PricingSection>

        <AppText style={styles.securityNote} forceKurdishFont={isKu}>
          {planCopy.walletNote}{"\n"}{planCopy.accessNote}{"\n"}{planCopy.ttsNote}{"\n"}{planCopy.checkoutPaused}{"\n"}
          {copy.secure}{provider ? ` · ${provider === "wayl" ? "Wayl" : "Rasedi"}` : ""}
        </AppText>
      </ScrollView>
    </View>
  );
}

function AccountMetric({ label, value, styles, isKu }: { label: string; value: string; styles: ReturnType<typeof createStyles>; isKu: boolean }) {
  return (
    <View style={styles.metric}>
      <AppText style={styles.metricLabel} forceKurdishFont={isKu}>{label}</AppText>
      <AppText style={styles.metricValue} forceLatinFont latinRole="bold" numberOfLines={1}>{value}</AppText>
    </View>
  );
}

function PricingSection({ title, body, children, styles, isKu }: { title: string; body: string; children: React.ReactNode; styles: ReturnType<typeof createStyles>; isKu: boolean }) {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle} forceKurdishFont={isKu} latinRole="bold">{title}</AppText>
        <AppText style={styles.sectionBody} forceKurdishFont={isKu}>{body}</AppText>
      </View>
      <View style={styles.rows}>{children}</View>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useThemeColors>["colors"],
  isDark: boolean,
  compact: boolean,
) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    content: {
      width: "100%",
      maxWidth: 1040,
      alignSelf: "center",
      paddingHorizontal: compact ? 18 : 32,
      paddingTop: compact ? 18 : 28,
      paddingBottom: 72,
      gap: 22,
    },
    topbar: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
    backButton: { minHeight: 44, alignItems: "center", gap: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, cursor: "pointer" } as any,
    backText: { color: colors.foreground, fontSize: 13 },
    hero: { maxWidth: 820, paddingVertical: compact ? 24 : 40 },
    eyebrow: { color: "#168BD2", fontSize: 12, letterSpacing: 1.2, marginBottom: 14 },
    title: { color: colors.foreground, fontSize: compact ? 38 : 58, lineHeight: compact ? 45 : 64, letterSpacing: compact ? -1.2 : -2.1 },
    body: { maxWidth: 700, color: colors.mutedForeground, fontSize: compact ? 15 : 17, lineHeight: compact ? 23 : 27, marginTop: 14 },
    accountStrip: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 14 },
    metric: { minWidth: compact ? "50%" : 210, flex: 1, paddingHorizontal: 12, paddingVertical: 7 },
    metricLabel: { color: colors.mutedForeground, fontSize: 12 },
    metricValue: { color: colors.foreground, fontSize: 18, marginTop: 4, fontVariant: ["tabular-nums"] },
    signInButton: { minHeight: 52, maxWidth: 380, alignItems: "center", justifyContent: "center", borderRadius: 14, borderBottomWidth: 3, borderBottomColor: PRIMARY_ACTION.rim, backgroundColor: PRIMARY_ACTION.face, cursor: "pointer" } as any,
    signInText: { color: "#FFFFFF", fontSize: 14.5 },
    notice: { borderWidth: 1, borderColor: "#B9DFF3", borderRadius: 14, backgroundColor: isDark ? "rgba(22,139,210,0.12)" : "#EFF9FE", padding: 15 },
    noticeSuccess: { borderColor: "#86D4A0", backgroundColor: isDark ? "rgba(34,197,94,0.10)" : "#EFFBF3" },
    noticeError: { borderColor: "#F1B5B5", backgroundColor: isDark ? "rgba(239,68,68,0.10)" : "#FFF5F5" },
    noticeText: { color: colors.foreground, fontSize: 13.5, lineHeight: 20 },
    sectionWrap: { gap: 12 },
    sectionHeader: { paddingHorizontal: 2 },
    sectionTitle: { color: colors.foreground, fontSize: 25, lineHeight: 32 },
    sectionBody: { color: colors.mutedForeground, fontSize: 14, lineHeight: 21, marginTop: 3 },
    rows: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, backgroundColor: colors.surfaceRaised, overflow: "hidden" },
    priceRow: { minHeight: 92, flexDirection: compact ? "column" : "row", alignItems: compact ? "stretch" : "center", gap: compact ? 10 : 18, paddingHorizontal: compact ? 18 : 22, paddingVertical: 17 },
    rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
    rowMain: { flex: 1, minWidth: 0 },
    rowTitle: { color: colors.foreground, fontSize: 18, lineHeight: 24 },
    rowDescription: { color: colors.mutedForeground, fontSize: 13.5, lineHeight: 20, marginTop: 3 },
    creditLine: { color: "#168BD2", fontSize: 13, lineHeight: 19, fontWeight: "700", marginTop: 5 },
    liveTutorLine: { color: colors.foreground, fontSize: 12.5, lineHeight: 18, marginTop: 3 },
    benefitList: { gap: 5, marginTop: 8 },
    benefitRow: { alignItems: "flex-start", gap: 7 },
    benefitText: { flex: 1, color: colors.mutedForeground, fontSize: 12.5, lineHeight: 18 },
    price: { minWidth: compact ? 0 : 128, color: colors.foreground, fontSize: 15, fontWeight: "700", fontVariant: ["tabular-nums"] },
    buyButton: { minWidth: compact ? 0 : 104, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: PRIMARY_ACTION.face, paddingHorizontal: 16, cursor: "pointer" } as any,
    buyText: { color: "#FFFFFF", fontSize: 13.5 },
    unavailable: { minWidth: compact ? 0 : 124, color: colors.mutedForeground, fontSize: 12.5, textAlign: compact ? "left" : "right" },
    emptyRow: { minHeight: 88, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 22 },
    emptyText: { flex: 1, color: colors.mutedForeground, fontSize: 14, lineHeight: 21 },
    loading: { minHeight: 88, alignItems: "center", justifyContent: "center" },
    planIcon: { width: 30, alignItems: "center" },
    planTitleRow: { flexDirection: "row", alignItems: "center", gap: 9 },
    currentTag: { color: "#168353", fontSize: 11, fontWeight: "800", backgroundColor: isDark ? "rgba(34,197,94,0.12)" : "#EAF8EF", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
    planTag: { color: "#168BD2", fontSize: 10.5, letterSpacing: 0.4, backgroundColor: isDark ? "rgba(22,139,210,0.13)" : "#EAF7FE", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
    actionSpacer: { minWidth: compact ? 0 : 104 },
    securityNote: { alignSelf: "center", color: colors.mutedForeground, fontSize: 12.5, lineHeight: 19, textAlign: "center", marginTop: 4 },
  });
}
