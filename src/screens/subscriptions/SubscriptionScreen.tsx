import SafeContainer from "../../components/shared/safe-container";
import { AppText } from "../../components/ui/AppText";
import { tabBarScrollPadding } from "../../constants/layout";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Public free-release boundary.
 *
 * Paid plans are intentionally unavailable until store-native billing and a
 * signed, server-authoritative entitlement flow are ready. Keeping this route
 * safe also protects users who reach the hidden tab through an old deep link.
 */
export function SubscriptionScreen() {
  const { isKu } = useI18n();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
              FREE RELEASE
            </AppText>
          </View>

          <Image
            source={require("../../../assets/images/mascots/pet-violet.webp")}
            style={styles.mascot}
            contentFit="contain"
            accessibilityLabel={isKu ? "هاوڕێی مۆری TWINO" : "TWINO violet learning companion"}
          />

          <AppText style={styles.title} forceKurdishFont={isKu}>
            {isKu ? "TWINO لەم وەشانەدا بەخۆڕاییە" : "TWINO is free in this release"}
          </AppText>
          <AppText style={styles.body} forceKurdishFont={isKu}>
            {isKu
              ? "هیچ پارەدان یان بەشدارییەک چالاک نییە. هەموو تایبەتمەندییە بەردەستەکانت بەبێ کڕین بەکاربهێنە."
              : "Payments and subscriptions are disabled. Enjoy every currently available learning feature without a purchase."}
          </AppText>
        </View>

        <View style={styles.notice}>
          <AppText style={styles.noticeTitle} forceKurdishFont={isKu}>
            {isKu ? "پارەدانێکی دەرەکی نییە" : "No external checkout"}
          </AppText>
          <AppText style={styles.noticeBody} forceKurdishFont={isKu}>
            {isKu
              ? "ئەگەر لە داهاتوودا پلانی پارەدان زیاد بکەین، تەنها لە ڕێگای سیستەمی فەرمی فرۆشگای ئەپەوە دەبێت."
              : "If paid plans are introduced later, they will use the official store billing flow with clear pricing and cancellation controls."}
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
      justifyContent: "center",
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
      backgroundColor: colors.warningBg,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    badgeText: {
      color: colors.warning,
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
      borderRadius: 22,
      borderWidth: 1,
      borderColor: isDark ? colors.border : "#FED7AA",
      backgroundColor: colors.warningBg,
      padding: 20,
      gap: 6,
    },
    noticeTitle: {
      color: colors.foreground,
      fontSize: 17,
      fontWeight: "800",
    },
    noticeBody: {
      color: colors.mutedForeground,
      fontSize: 14,
      lineHeight: 21,
    },
  });
}
