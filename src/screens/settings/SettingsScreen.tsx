import { PressableScale } from "@/components/animations";
import {
  Icon3DCheckCircle,
  Icon3DChevronRight,
  Icon3DSettings,
} from "@/components/icons/Icon3D";
import { AppText } from "@/components/ui/AppText";
import {
  APP_VERSION,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
} from "@/constants/app-meta";
import { ENABLE_ADMIN } from "@/constants/feature-flags";
import { tabBarScrollPadding } from "@/constants/layout";
import { ALL_RABAR_FONTS } from "@/constants/rabar-fonts";
import { useI18n } from "@/hooks/useI18n";
import type { AppLocale } from "@/i18n";
import { useFontStore } from "@/stores/useFontStore";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { confirmAction } from "@/utils/confirm-action";
import { openHttpsUrl, openMailto } from "@/utils/safe-link";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOCALE_OPTIONS: { id: AppLocale; labelKey: "settings.languageEn" | "settings.languageKu" }[] =
  [
    { id: "en", labelKey: "settings.languageEn" },
    { id: "ku", labelKey: "settings.languageKu" },
  ];

const LEGAL_LINKS = [
  { route: "/privacy-policy" as const, labelKey: "settings.privacyPolicy" as const },
  { route: "/ai-safety" as const, labelKey: "settings.aiSafety" as const },
  { route: "/terms" as const, labelKey: "settings.termsOfUse" as const },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale, setLocale, isKu } = useI18n();
  const { selectedFont, setFont } = useFontStore();
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const replayOnboarding = useOnboardingStore((s) => s.replayOnboarding);
  const haptics = useSettingsStore((s) => s.hapticsEnabled);
  const sounds = useSettingsStore((s) => s.soundsEnabled);
  const setHaptics = useSettingsStore((s) => s.setHapticsEnabled);
  const setSounds = useSettingsStore((s) => s.setSoundsEnabled);

  const confirmReplayOnboarding = () => {
    confirmAction(
      t("settings.replayOnboarding"),
      t("settings.replayOnboardingHint"),
      replayOnboarding,
      {
        confirmLabel: t("settings.replayOnboardingConfirm"),
        cancelLabel: isKu ? "پاشگەزبوونەوە" : "Cancel",
      },
    );
  };

  const confirmReset = () => {
    confirmAction(
      t("settings.resetProgress"),
      t("settings.resetProgressHint"),
      resetProgress,
      {
        confirmLabel: t("settings.resetConfirm"),
        cancelLabel: isKu ? "پاشگەزبوونەوە" : "Cancel",
        destructive: true,
      },
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Icon3DSettings size={28} />
        <AppText style={styles.title} forceKurdishFont={isKu}>
          {t("settings.title")}
        </AppText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: tabBarScrollPadding(insets.bottom),
        }}
      >
        <AppText style={styles.sectionLabel} forceKurdishFont={isKu}>
          {t("settings.languageSection")}
        </AppText>
        <AppText style={styles.sectionHint} forceKurdishFont={isKu}>
          {t("settings.languageHint")}
        </AppText>

        <View style={styles.card}>
          {LOCALE_OPTIONS.map((opt, index) => {
            const selected = locale === opt.id;
            return (
              <PressableScale
                key={opt.id}
                onPress={() => setLocale(opt.id)}
                scaleDown={0.98}
                style={[
                  styles.row,
                  index < LOCALE_OPTIONS.length - 1 && styles.rowBorder,
                ]}
              >
                <AppText
                  style={[styles.rowLabel, selected && styles.rowLabelOn]}
                  forceKurdishFont={opt.id === "ku" || isKu}
                >
                  {t(opt.labelKey)}
                </AppText>
                {selected ? (
                  <Icon3DCheckCircle size={22} />
                ) : (
                  <View style={styles.radioEmpty} />
                )}
              </PressableScale>
            );
          })}
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
              {t("settings.haptics")}
            </AppText>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>
          <View style={[styles.toggleRow, styles.toggleRowLast]}>
            <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
              {t("settings.sounds")}
            </AppText>
            <Switch value={sounds} onValueChange={setSounds} />
          </View>
        </View>

        <AppText style={[styles.sectionLabel, styles.sectionSpaced]} forceKurdishFont>
          {t("settings.fontSection")}
        </AppText>
        <AppText style={styles.sectionHint} forceKurdishFont>
          {t("settings.fontHint")}
        </AppText>

        <View style={styles.card}>
          {ALL_RABAR_FONTS.map((font, index) => {
            const selected = selectedFont === font;
            return (
              <PressableScale
                key={font}
                onPress={() => setFont(font)}
                scaleDown={0.98}
                style={[
                  styles.fontRow,
                  index < ALL_RABAR_FONTS.length - 1 && styles.rowBorder,
                  selected && styles.fontRowSelected,
                ]}
              >
                <View style={styles.fontRowLeft}>
                  {selected ? (
                    <Icon3DCheckCircle size={22} />
                  ) : (
                    <View style={styles.radioEmpty} />
                  )}
                  <Text
                    style={[
                      styles.fontPreview,
                      { fontFamily: font },
                      selected && styles.fontPreviewOn,
                    ]}
                  >
                    {t("settings.previewSample")}
                  </Text>
                </View>
                <Icon3DChevronRight size={20} />
              </PressableScale>
            );
          })}
        </View>

        {ENABLE_ADMIN ? (
          <>
            <AppText style={[styles.sectionLabel, styles.sectionSpaced]} forceLatinFont>
              Content Admin
            </AppText>
            <AppText style={styles.sectionHint} forceLatinFont>
              Edit units, lessons, and game content without code.
            </AppText>
            <PressableScale
              onPress={() => router.push("/admin")}
              scaleDown={0.98}
              style={[styles.supportRow, styles.card, { marginTop: 0 }]}
            >
              <AppText style={styles.rowLabel} forceLatinFont>
                Open admin panel
              </AppText>
              <Icon3DChevronRight size={20} />
            </PressableScale>
          </>
        ) : null}

        <AppText style={[styles.sectionLabel, styles.sectionSpaced]} forceKurdishFont={isKu}>
          {t("settings.legalSection")}
        </AppText>

        {PRIVACY_POLICY_URL ? (
          <PressableScale
            onPress={() => void openHttpsUrl(PRIVACY_POLICY_URL)}
            scaleDown={0.98}
            style={[styles.supportRow, styles.card, { marginTop: 0 }]}
          >
            <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
              {isKu ? "سیاسەت (وێب)" : "Privacy (web)"}
            </AppText>
            <Icon3DChevronRight size={20} />
          </PressableScale>
        ) : null}

        <View style={[styles.card, { marginTop: 16 }]}>
          {LEGAL_LINKS.map((link, index) => (
            <PressableScale
              key={link.route}
              onPress={() => router.push(link.route)}
              scaleDown={0.98}
              style={[
                styles.row,
                index < LEGAL_LINKS.length - 1 && styles.rowBorder,
              ]}
            >
              <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
                {t(link.labelKey)}
              </AppText>
              <Icon3DChevronRight size={20} />
            </PressableScale>
          ))}
        </View>

        <PressableScale
          onPress={() => void openMailto(SUPPORT_EMAIL)}
          scaleDown={0.98}
          style={[styles.supportRow, styles.card]}
        >
          <View>
            <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
              {t("settings.support")}
            </AppText>
            <Text style={styles.supportEmail}>{SUPPORT_EMAIL}</Text>
          </View>
          <Icon3DChevronRight size={20} />
        </PressableScale>

        <Text style={styles.versionText}>
          {t("settings.version")} {APP_VERSION}
        </Text>

        <PressableScale
          onPress={confirmReplayOnboarding}
          scaleDown={0.98}
          style={[styles.replayBtn, styles.card]}
        >
          <AppText style={styles.replayLabel} forceKurdishFont={isKu}>
            {t("settings.replayOnboarding")}
          </AppText>
        </PressableScale>

        <PressableScale
          onPress={confirmReset}
          scaleDown={0.98}
          style={[styles.resetBtn, styles.card]}
        >
          <AppText style={styles.resetLabel} forceKurdishFont={isKu}>
            {t("settings.resetProgress")}
          </AppText>
        </PressableScale>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedBold",
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedBold",
    marginBottom: 6,
  },
  sectionSpaced: {
    marginTop: 20,
  },
  sectionHint: {
    fontSize: 14,
    color: "#777",
    fontFamily: "DINNextRoundedMedium",
    marginBottom: 12,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedMedium",
  },
  rowLabelOn: {
    color: "#1CB0F6",
    fontFamily: "DINNextRoundedBold",
  },
  radioEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  toggleCard: {
    marginTop: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },
  toggleRowLast: {
    borderBottomWidth: 0,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedMedium",
  },
  fontRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  fontRowSelected: {
    backgroundColor: "#E5F7FF",
  },
  fontRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  fontPreview: {
    fontSize: 20,
    color: "#4B4B4B",
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
  },
  fontPreviewOn: {
    color: "#1CB0F6",
  },
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  supportEmail: {
    fontSize: 14,
    color: "#1CB0F6",
    marginTop: 4,
    fontFamily: "DINNextRoundedMedium",
  },
  versionText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginTop: 12,
    fontFamily: "DINNextRoundedMedium",
  },
  replayBtn: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  replayLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B59F3",
    fontFamily: "DINNextRoundedBold",
  },
  resetBtn: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  resetLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E53935",
    fontFamily: "DINNextRoundedBold",
  },
});
