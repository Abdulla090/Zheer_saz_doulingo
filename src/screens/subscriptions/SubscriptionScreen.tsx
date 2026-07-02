import SafeContainer from "../../components/shared/safe-container";
import { SvgAppButton } from "../../components/shared/svg-app-button";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { useI18n } from "../../hooks/useI18n";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabBarScrollPadding } from "../../constants/layout";
import { hapticImpact } from "../../utils/haptics";
import { TwinoMascot } from "../../components/mascot/TwinoMascot";

export const SubscriptionScreen = () => {
  const { t, isKu } = useI18n();
  const insets = useSafeAreaInsets();

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

  return (
    <View style={styles.root}>
      {/* Premium Gradient Header */}
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
                onPress={() => {
                  hapticImpact();
                }}
                contentContainerStyle={styles.planBtnContent}
              >
                <AppText style={styles.planBtnText} forceKurdishFont={isKu}>
                  {t("subscription.unlockBtn").replace("{price}", String(plan.price))}
                </AppText>
              </SvgAppButton>
            </View>
          );
        })}
      </ScrollView>

      {/* Blurred Gradient Overlay above Navbar */}
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
});
