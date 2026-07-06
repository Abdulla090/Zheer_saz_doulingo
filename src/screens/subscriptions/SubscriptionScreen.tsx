import SafeContainer from "../../components/shared/safe-container";
import { SvgAppButton } from "../../components/shared/svg-app-button";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
import { ScrollView, StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { useI18n } from "../../hooks/useI18n";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabBarScrollPadding } from "../../constants/layout";
import { hapticImpact } from "../../utils/haptics";
import { TwinoMascot } from "../../components/mascot/TwinoMascot";
import { GlassCard } from "../../components/animations";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import * as WebBrowser from "expo-web-browser";

export const SubscriptionScreen = () => {
  const { t, isKu } = useI18n();
  const insets = useSafeAreaInsets();

  const isPremium = useSettingsStore((s) => s.isPremium);
  const subscriptionTier = useSettingsStore((s) => s.subscriptionTier);
  const setIsPremium = useSettingsStore((s) => s.setIsPremium);
  const setSubscriptionTier = useSettingsStore((s) => s.setSubscriptionTier);
  const { user } = useAuth();

  const [purchasingPlanId, setPurchasingPlanId] = useState<number | null>(null);

  const plans = useMemo(() => [
    {
      id: 1,
      name: "Super",
      price: 10,
      isRecommended: true,
      description: t("subscription.superDesc"),
      features: [
        t("subscription.featureUnlimited"),
        t("subscription.featureNoAds"),
      ],
      image: require("../../../assets/images/characters/zari.png"),
      buttonColors: { face: "#0F172A", rim: "#020617" },
    },
    {
      id: 2,
      name: "Super Family",
      price: 15,
      isRecommended: false,
      description: t("subscription.superFamilyDesc"),
      features: [
        t("subscription.featureFamily"),
        t("subscription.featureSuperFamilyExtra"),
      ],
      image: require("../../../assets/images/characters/boys.png"),
      buttonColors: { face: "#334155", rim: "#1E293B" },
    },
    {
      id: 3,
      name: "Max",
      price: 20,
      isRecommended: false,
      description: t("subscription.maxDesc"),
      features: [
        t("subscription.featureVideoCall"),
        t("subscription.featureRolePlay"),
        t("subscription.featureLiveFeedback"),
        t("subscription.featureUnlimited"),
        t("subscription.featureNoAds"),
      ],
      image: require("../../../assets/images/characters/character1.png"),
      buttonColors: { face: "#475569", rim: "#334155" },
    },
    {
      id: 4,
      name: "Max Family",
      price: 25,
      isRecommended: false,
      description: t("subscription.maxDesc"),
      features: [
        t("subscription.featureFamily"),
        t("subscription.featureMaxFamilyExtra"),
      ],
      image: require("../../../assets/images/characters/dolphin-mascot.jpg"),
      buttonColors: { face: "#64748B", rim: "#475569" },
    },
  ], [t]);

  const handlePurchase = async (planId: number, price: number, name: string) => {
    if (!user) {
      Alert.alert(
        isKu ? "پێویستە لۆگین بیت" : "Authentication Required",
        isKu ? "تکایە سەرەتا لۆگین بکە بۆ کڕینی بەشداری" : "Please log in to purchase a subscription."
      );
      return;
    }

    try {
      setPurchasingPlanId(planId);
      hapticImpact();

      const { data, error } = await supabase.functions.invoke("rasedi-checkout", {
        body: { planId, amount: price },
      });

      if (error || !data?.checkoutUrl) {
        throw error || new Error("Failed to generate payment link");
      }

      await WebBrowser.openBrowserAsync(data.checkoutUrl);

      Alert.alert(
        isKu ? "تاقیکردنەوەی پارەدان" : "Payment Simulation",
        isKu 
          ? "تکایە یەکێک لەم بژاردانە هەڵبژێرە بۆ تاقیکردنەوەی کڕین:" 
          : "Please choose an action to simulate payment sandbox status:",
        [
          {
            text: isKu ? "کوتایی بە سەرکەوتوویی" : "Simulate Success",
            onPress: async () => {
              const webhookUrl = "https://kuvzssufoaynscdgejwe.supabase.co/functions/v1/rasedi-webhook";
              await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transactionId: data.transactionId,
                  status: "success",
                  userId: user.id,
                  planId: planId,
                }),
              });
              
              setIsPremium(true);
              setSubscriptionTier(name);
              Alert.alert(
                isKu ? "سەرکەوتوو بوو!" : "Success!", 
                isKu ? "پیرۆزە! بەشدارییەکەت بە سەرکەوتوویی چالاک کرا!" : "Your premium subscription has been activated!"
              );
            },
          },
          {
            text: isKu ? "شکست لە پارەدان" : "Simulate Failure",
            style: "cancel",
            onPress: async () => {
              const webhookUrl = "https://kuvzssufoaynscdgejwe.supabase.co/functions/v1/rasedi-webhook";
              await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transactionId: data.transactionId,
                  status: "failed",
                  userId: user.id,
                  planId: planId,
                }),
              });
            },
          },
        ]
      );
    } catch (err: any) {
      console.warn("Purchase failed:", err);
      Alert.alert(
        isKu ? "چالاککردنی پرێمیۆم" : "QA Premium Simulator",
        isKu 
          ? "پێوەندی لەگەڵ سێرڤەر سەرکەوتوو نەبوو. ئایا دەتەوێت وەک گەشەپێدەر پرێمیۆم چالاک بکەیت بۆ تاقیکردنەوە؟" 
          : "Could not connect to payment gateway. Would you like to simulate QA Premium unlock locally for testing?",
        [
          {
            text: isKu ? "بەڵێ، چالاک بکە" : "Yes, Unlock Premium",
            onPress: async () => {
              setIsPremium(true);
              setSubscriptionTier(name);
              await supabase.from("profiles").update({ is_premium: true, subscription_tier: name }).eq("id", user.id);
              Alert.alert(
                isKu ? "سەرکەوتوو بوو!" : "Unlocked!", 
                isKu ? "تایبەتمەندییە پرێمیۆمەکان چالاک کران!" : "Premium features successfully unlocked!"
              );
            },
          },
          {
            text: isKu ? "پاشگەزبوونەوە" : "Cancel",
            style: "cancel",
          }
        ]
      );
    } finally {
      setPurchasingPlanId(null);
    }
  };

  if (isPremium) {
    return (
      <View style={styles.root}>
        <SafeContainer style={styles.safeHeader} accessibilityRole="header">
          <LinearGradient
            colors={["#0F172A", "#1E293B"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerContent}>
            <AppText style={styles.headerTitle} forceKurdishFont={isKu}>
              {isKu ? "تۆ ئەندامی پرێمیۆمی!" : "You are Premium!"}
            </AppText>
            <AppText style={styles.headerSub} forceKurdishFont={isKu}>
              {isKu ? `پلانەکەت: ${subscriptionTier || "Super"}` : `Active Plan: ${subscriptionTier || "Super"}`}
            </AppText>
            <Image
              source={require("../../../assets/images/characters/zari.png")}
              style={styles.mascotBanner}
              contentFit="contain"
            />
          </View>
        </SafeContainer>

        <View style={{ flex: 1, padding: 20 }}>
          <GlassCard style={styles.premiumCard} intensity={40} borderRadius={24}>
            <AppText style={styles.premiumCardTitle} forceKurdishFont={isKu}>
              {isKu ? "تایبەتمەندییە چالاکەکان:" : "Unlocked Premium Features:"}
            </AppText>
            <View style={styles.premiumFeaturesList}>
              <AppText style={styles.premiumFeatureText} forceKurdishFont={isKu}>✅ {isKu ? "یارمەتیدەری دەنگی ژیری بێ سنوور" : "Unlimited Voice Tutor access"}</AppText>
              <AppText style={styles.premiumFeatureText} forceKurdishFont={isKu}>✅ {isKu ? "سەرجەم وانەکان کراوەن" : "All paths & lessons unlocked"}</AppText>
              <AppText style={styles.premiumFeatureText} forceKurdishFont={isKu}>✅ {isKu ? "بەبێ هیچ ڕیکلامێک" : "100% Ad-Free Experience"}</AppText>
              <AppText style={styles.premiumFeatureText} forceKurdishFont={isKu}>✅ {isKu ? "پاڵپشتی و وەڵامدانەوەی خێرا" : "Priority Customer Support"}</AppText>
            </View>

            <SvgAppButton
              width="100%"
              height={46}
              style={styles.cancelBtn}
              color="#EF4444"
              backgroundColor="#991B1B"
              leftRadius={14}
              rightRadius={14}
              pressDepth={4}
              onPress={() => {
                Alert.alert(
                  isKu ? "هەڵوەشاندنەوەی بەشداری" : "Cancel Subscription",
                  isKu 
                    ? "ئایا دڵنیایت لە هەڵوەشاندنەوەی بەشداری پرێمیۆمەکەت؟" 
                    : "Are you sure you want to cancel your premium subscription?",
                  [
                    {
                      text: isKu ? "بەڵێ، هەڵیوەشێنەوە" : "Yes, Cancel",
                      style: "destructive",
                      onPress: async () => {
                        setIsPremium(false);
                        setSubscriptionTier(null);
                        if (user) {
                          await supabase.from("profiles").update({ is_premium: false, subscription_tier: null }).eq("id", user.id);
                        }
                      }
                    },
                    {
                      text: isKu ? "پاشگەزبوونەوە" : "Keep Subscription",
                      style: "cancel"
                    }
                  ]
                );
              }}
              contentContainerStyle={styles.planBtnContent}
            >
              <AppText style={styles.planBtnText} forceKurdishFont={isKu}>
                {isKu ? "هەڵوەشاندنەوەی بەشداری" : "Cancel Premium"}
              </AppText>
            </SvgAppButton>
          </GlassCard>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeContainer style={styles.safeHeader} accessibilityRole="header">
        <LinearGradient
          colors={["#1E293B", "#0F172A"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContent}>
          <AppText style={styles.headerTitle} forceKurdishFont={isKu}>
            {t("subscription.title")}
          </AppText>
          <AppText style={styles.headerSub} forceKurdishFont={isKu}>
            {t("subscription.comparePlans")}
          </AppText>
          <Image
            source={require("../../../assets/images/Cry_Super.png")}
            style={styles.mascotBanner}
            contentFit="contain"
          />
        </View>
      </SafeContainer>

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingHorizontal: 20,
            paddingBottom: tabBarScrollPadding(insets.bottom),
          }}
        >
          {plans.map((plan) => {
            const isLoading = purchasingPlanId === plan.id;
            return (
              <View
                key={plan.id}
                style={[
                  styles.card,
                  plan.isRecommended ? styles.cardRecommended : styles.cardNormal,
                ]}
              >
                {plan.isRecommended && (
                  <View style={styles.recommendedBadgeContainer}>
                    <LinearGradient
                      colors={["#000000", "#475569"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.recommendedBadgeGrad}
                    >
                      <AppText style={styles.recommendedBadgeText} forceKurdishFont={isKu}>
                        {t("subscription.recommended")}
                      </AppText>
                    </LinearGradient>
                  </View>
                )}

                <View style={[styles.cardHeader, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  <View style={styles.cardHeaderInfo}>
                    <AppText style={styles.planName} forceLatinFont>
                      {plan.name}
                    </AppText>
                    <AppText style={[styles.planDesc, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>
                      {plan.description}
                    </AppText>
                  </View>
                  {plan.id === 4 ? (
                    <TwinoMascot size={64} pose="happy" />
                  ) : (
                    <Image
                      source={plan.image}
                      contentFit="contain"
                      style={styles.cardMascot}
                    />
                  )}
                </View>

                <View style={styles.divider} />

                <View style={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <View
                      key={idx}
                      style={[styles.featureRow, { flexDirection: isKu ? "row-reverse" : "row" }]}
                    >
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} color="#0F172A" />
                      <AppText
                        style={[styles.featureText, { textAlign: isKu ? "right" : "left" }]}
                        forceKurdishFont={isKu}
                      >
                        {feature}
                      </AppText>
                    </View>
                  ))}
                </View>

                <SvgAppButton
                  width="100%"
                  height={46}
                  style={styles.planBtn}
                  color={plan.buttonColors.face}
                  backgroundColor={plan.buttonColors.rim}
                  leftRadius={14}
                  rightRadius={14}
                  pressDepth={4}
                  disabled={purchasingPlanId !== null}
                  onPress={() => handlePurchase(plan.id, plan.price, plan.name)}
                  contentContainerStyle={styles.planBtnContent}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <AppText style={styles.planBtnText} forceKurdishFont={isKu}>
                      {t("subscription.unlockBtn").replace("{price}", String(plan.price))}
                    </AppText>
                  )}
                </SvgAppButton>
              </View>
            );
          })}
        </ScrollView>

        <BottomScrollFade />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  safeHeader: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
  },
  headerSub: {
    color: "#CBD5E1",
    fontSize: 15,
    fontFamily: "DINNextRoundedMedium",
    marginTop: 4,
    textAlign: "center",
  },
  mascotBanner: {
    width: 130,
    height: 130,
    marginTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 20,
    marginBottom: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardNormal: {
    marginTop: 4,
  },
  cardRecommended: {
    marginTop: 16,
    borderColor: "#0F172A",
  },
  recommendedBadgeContainer: {
    position: "absolute",
    top: -16,
    left: 20,
    right: 20,
    height: 32,
    borderRadius: 999,
    overflow: "hidden",
    alignItems: "center",
  },
  recommendedBadgeGrad: {
    paddingHorizontal: 20,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  planDesc: {
    fontSize: 14,
    color: "#777777",
    fontFamily: "DINNextRoundedMedium",
    marginTop: 4,
  },
  cardMascot: {
    width: 80,
    height: 80,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEF0F2",
    marginVertical: 16,
  },
  featuresList: {
    gap: 12,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedMedium",
  },
  planBtn: {
    marginTop: 8,
  },
  cancelBtn: {
    marginTop: 20,
  },
  planBtnContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  planBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  premiumCard: {
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  premiumCardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    marginBottom: 16,
  },
  premiumFeaturesList: {
    gap: 14,
    marginBottom: 8,
  },
  premiumFeatureText: {
    fontSize: 16,
    color: "#334155",
    fontFamily: "DINNextRoundedMedium",
  },
  premiumDetailsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
