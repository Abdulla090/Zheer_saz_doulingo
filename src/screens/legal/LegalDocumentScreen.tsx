import { AppText } from "../../components/ui/AppText";
import { IOSPressable as Pressable } from "../../components/ui/ios-pressable";
import type { LegalDocId } from "../../content/legal";
import { getLegalDocument } from "../../content/legal";
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL } from "../../constants/app-meta";
import { openHttpsUrl, openMailto } from "../../utils/safe-link";
import { useI18n } from "../../hooks/useI18n";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useThemeColors } from "../../hooks/useThemeColors";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  docId: LegalDocId;
};

export function LegalDocumentScreen({ docId }: Props) {
  const safeBack = useSafeBack("/");
  const insets = useSafeAreaInsets();
  const { locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || locale === "ar";
  const doc = getLegalDocument(docId, locale);
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={[styles.topBar, { flexDirection: "row" }]}>
        <Pressable onPress={safeBack} hitSlop={12} style={styles.back}>
          <HugeiconsIcon
            icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
            size={22}
            color={colors.foreground}
            strokeWidth={2.5}
          />
        </Pressable>
        <AppText
          style={styles.title}
          languageCode={locale}
          align="center"
          numberOfLines={2}
        >
          {doc.title}
        </AppText>
        <View style={styles.backSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.updated} languageCode={locale} align="start">
          {isKu ? "دوایین نوێکردنەوە: " : locale === "ar" ? "آخر تحديث: " : "Last updated: "}
          {doc.lastUpdated}
        </AppText>

        {doc.sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <AppText style={styles.sectionTitle} languageCode={locale} align="start">
              {section.title}
            </AppText>
            {section.paragraphs.map((p, i) => (
              <AppText
                key={`${section.title}-${i}`}
                style={styles.paragraph}
                languageCode={locale}
                align="start"
              >
                {p}
              </AppText>
            ))}
          </View>
        ))}

        {docId === "privacy" && PRIVACY_POLICY_URL ? (
          <Pressable
            onPress={() => void openHttpsUrl(PRIVACY_POLICY_URL)}
            style={[styles.supportBox, { marginBottom: 12 }]}
          >
            <Text style={styles.supportLabel}>
              {isKu ? "وەشانی وێب" : "Web version"}
            </Text>
            <Text style={styles.supportEmail} numberOfLines={1}>
              {PRIVACY_POLICY_URL}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => void openMailto(SUPPORT_EMAIL)}
          style={styles.supportBox}
        >
          <Text style={styles.supportLabel}>
            {isKu ? "پشتیوانی" : "Support"}
          </Text>
          <Text style={styles.supportEmail}>{SUPPORT_EMAIL}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: {
    width: 44,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: colors.foreground,
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
  },
  updated: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "DINNextRoundedMedium",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.foreground,
    marginBottom: 8,
    fontFamily: "DINNextRoundedBold",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.mutedForeground,
    marginBottom: 10,
    fontFamily: "DINNextRoundedMedium",
  },
  supportBox: {
    marginTop: 28,
    padding: 16,
    backgroundColor: isDark ? colors.surfaceRaised : "#E5F7FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: isDark ? colors.border : "#B8E4FF",
  },
  supportLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondary,
    fontFamily: "DINNextRoundedBold",
  },
  supportEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
    marginTop: 4,
    fontFamily: "DINNextRoundedMedium",
  },
  });
}
