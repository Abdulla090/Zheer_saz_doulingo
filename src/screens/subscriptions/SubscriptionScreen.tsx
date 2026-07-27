import SafeContainer from "../../components/shared/safe-container";
import { PressableScale } from "../../components/animations/PressableScale";
import { AppText } from "../../components/ui/AppText";
import { SUBSCRIPTION_URL } from "../../constants/app-meta";
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
import React, { useMemo } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PACKS = {
  en: [
    {
      name: "Starter",
      description: "A light top-up for occasional AI practice.",
      tag: "TRY IT",
    },
    {
      name: "Plus",
      description: "More credits for regular speaking and reading practice.",
      tag: "POPULAR",
    },
    {
      name: "Max",
      description: "The largest pack for frequent AI practice.",
      tag: "BEST VALUE",
    },
  ],
  ku: [
    {
      name: "دەستپێک",
      description: "پاکەتێکی بچووک بۆ ڕاهێنانی AI لە هەندێک کاتدا.",
      tag: "تاقیبکەرەوە",
    },
    {
      name: "پڵەس",
      description: "کرێدیتی زیاتر بۆ ڕاهێنانی بەردەوامی قسەکردن و خوێندنەوە.",
      tag: "بەناوبانگ",
    },
    {
      name: "ماکس",
      description: "گەورەترین پاکەت بۆ ڕاهێنانی زۆری AI.",
      tag: "باشترین نرخ",
    },
  ],
  ar: [
    {
      name: "المبتدئ",
      description: "حزمة خفيفة للتدريب بالذكاء الاصطناعي من حين لآخر.",
      tag: "جرّبها",
    },
    {
      name: "بلس",
      description: "رصيد أكبر للتدريب المنتظم على التحدث والقراءة.",
      tag: "الأكثر طلباً",
    },
    {
      name: "ماكس",
      description: "أكبر حزمة للتدريب المكثف بالذكاء الاصطناعي.",
      tag: "أفضل قيمة",
    },
  ],
} as const;

export function SubscriptionScreen() {
  const { isKu, isAr } = useI18n();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const isRtl = isKu || isAr;
  const packs = isKu ? PACKS.ku : isAr ? PACKS.ar : PACKS.en;
  const copy = isKu
    ? {
        eyebrow: "پاکەتەکانی کرێدیتی TWINO",
        title: "پاکەتێک هەڵبژێرە",
        body: "نرخ و ژمارەی نوێی کرێدیتەکان لە وێبسایت پیشان دەدرێن. هیچ کڕینێک لە ناو ئەپدا ناکرێت.",
        choose: "بینینی لە وێبسایت",
        note: "کڕینی یەکجار · بێ نوێکردنەوەی خۆکار",
      }
    : isAr
      ? {
          eyebrow: "حزم رصيد TWINO",
          title: "اختر الحزمة المناسبة لك",
          body: "ستجد أحدث الأسعار وكميات الرصيد على الموقع. لا تتم أي عملية شراء داخل التطبيق.",
          choose: "عرض على الموقع",
          note: "شراء لمرة واحدة · بدون تجديد تلقائي",
        }
      : {
          eyebrow: "TWINO CREDIT PACKS",
          title: "Choose the pack that fits you",
          body: "Current prices and credit amounts are shown on our website. No purchase happens inside the app.",
          choose: "View on website",
          note: "One-time purchase · No automatic renewal",
        };

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
          { paddingBottom: tabBarScrollPadding(insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.packList}>
          {packs.map((pack, index) => (
            <View
              key={pack.name}
              style={[styles.packCard, index === 1 && styles.packCardFeatured]}
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
          ))}
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
          </AppText>
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

type ThemeColors = ReturnType<typeof useThemeColors>["colors"];

function createStyles(colors: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 32,
      gap: 18,
    },
    hero: {
      alignItems: "center",
      borderRadius: 30,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      backgroundColor: colors.surface,
      paddingHorizontal: 24,
      paddingVertical: 30,
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
      width: 150,
      height: 150,
      marginTop: 8,
      marginBottom: 8,
    },
    title: {
      color: colors.foreground,
      fontSize: 28,
      lineHeight: 35,
      fontWeight: "800",
      textAlign: "center",
    },
    body: {
      maxWidth: 520,
      marginTop: 10,
      color: colors.mutedForeground,
      fontSize: 16,
      lineHeight: 24,
      textAlign: "center",
    },
    notice: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: isDark ? "rgba(69,180,240,0.28)" : "#CDEBFA",
      backgroundColor: isDark ? "rgba(22,139,210,0.09)" : "#F5FBFE",
      padding: 16,
      gap: 10,
      alignItems: "center",
    },
    noticeBody: {
      flex: 1,
      color: colors.mutedForeground,
      fontSize: 14,
      lineHeight: 21,
    },
    packList: {
      gap: 14,
    },
    packCard: {
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: colors.cardBorder,
      backgroundColor: colors.surface,
      padding: 18,
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
