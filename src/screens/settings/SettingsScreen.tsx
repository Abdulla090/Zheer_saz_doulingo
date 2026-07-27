/* eslint-disable */
import { PressableScale } from "../../components/animations";
import { GsapEnterBlock } from "../../components/animations/skia-gsap-opening";
import {
  AppSettingsIcon,
} from "../../components/icons/AppHugeIcons";
import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import {
  HomeMeshBackground,
} from "../../components/ui/ios-liquid-home";
import { TopScrollFade } from "../../components/ui/TopScrollFade";
import {
  APP_VERSION,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
} from "../../constants/app-meta";
import { ENABLE_ADMIN } from "../../constants/feature-flags";
import { tabBarScrollPadding } from "../../constants/layout";
import { ALL_RABAR_FONTS } from "../../constants/rabar-fonts";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useSafeBack } from "../../hooks/use-safe-back";
import type { AppLocale } from "../../i18n";
import { useFontStore } from "../../stores/useFontStore";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { SOURCE_LANGUAGES, TARGET_LANGUAGES } from "../../config/languages";
import { confirmAction } from "../../utils/confirm-action";
import { openHttpsUrl, openMailto } from "../../utils/safe-link";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import * as Font from "expo-font";
import { fontMap } from "../../fontMap";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

 

const LEGAL_LINKS = [
  {
    route: "/privacy-policy" as const,
    labelKey: "settings.privacyPolicy" as const,
  },
  { route: "/ai-safety" as const, labelKey: "settings.aiSafety" as const },
  { route: "/terms" as const, labelKey: "settings.termsOfUse" as const },
];

const FontPreviewText = React.memo(
  ({
    font,
    style,
    children,
  }: {
    font: string;
    style: any;
    children: React.ReactNode;
  }) => {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
      if (Font.isLoaded(font)) {
        setLoaded(true);
        return;
      }
      const fontFile = fontMap[font as keyof typeof fontMap];
      if (fontFile) {
        Font.loadAsync({
          [font]: fontFile,
        })
          .then(() => setLoaded(true))
          .catch(() => {});
      }
    }, [font]);

    return (
      <Text style={[style, loaded ? { fontFamily: font } : {}]}>
        {children}
      </Text>
    );
  },
);

function SettingsSwitch({
  value,
  onValueChange,
  activeColor,
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
  activeColor: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={9}
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => [
        stylesStatic.switchTrack,
        value ? { backgroundColor: activeColor } : stylesStatic.switchTrackOff,
        pressed && stylesStatic.switchPressed,
      ]}
    >
      <View
        style={[
          stylesStatic.switchThumb,
          value ? stylesStatic.switchThumbOn : stylesStatic.switchThumbOff,
        ]}
      />
    </Pressable>
  );
}

function SelectedMark({ color }: { color: string }) {
  return (
    <HugeiconsIcon
      icon={CheckmarkCircle02Icon}
      size={24}
      color={color}
      strokeWidth={2.4}
    />
  );
}

function RowChevron({ isRtl, color }: { isRtl: boolean; color: string }) {
  return (
    <HugeiconsIcon
      icon={ArrowRight01Icon}
      size={20}
      color={color}
      strokeWidth={2.3}
      style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}
    />
  );
}

const stylesStatic = StyleSheet.create({
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 999,
    padding: 2,
    justifyContent: "center",
    flexShrink: 0,
    ...Platform.select({
      web: {
        userSelect: "none",
        cursor: "pointer",
      },
    }),
  },
  switchTrackOff: {
    backgroundColor: "#E5E5EA",
  },
  switchPressed: {
    opacity: 0.84,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.16,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 1px 4px rgba(15, 23, 42, 0.2)",
      },
    }),
  },
  switchThumbOff: {
    alignSelf: "flex-start",
  },
  switchThumbOn: {
    alignSelf: "flex-end",
  },
});

export default function SettingsScreen({ isKidsMode = false }: { isKidsMode?: boolean }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const safeBack = useSafeBack("/(tabs)/more");
  const { t, locale, setLocale, isKu } = useI18n();
  const isRtl = isKu || locale === "ar";
  const { user, signOut, deleteAccount } = useAuth();
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { selectedFont, setFont } = useFontStore();
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const replayOnboarding = useOnboardingStore((s) => s.replayOnboarding);
  const haptics = useSettingsStore((s) => s.hapticsEnabled);
  const sounds = useSettingsStore((s) => s.soundsEnabled);
  const targetLang = useLocaleStore((s) => s.selectedTargetLanguage);
  const nativeLang = useLocaleStore((s) => s.selectedSourceLanguage);
  const setLanguagePair = useLocaleStore((s) => s.setLanguagePair);

  // Store the last selected non-Arabic learning language to restore when kids path Arabic is toggled off
  const prevNonArTargetRef = React.useRef<string>(targetLang !== "ar" ? targetLang : "en");
  React.useEffect(() => {
    if (targetLang !== "ar") {
      prevNonArTargetRef.current = targetLang;
    }
  }, [targetLang]);
  
  const theme = useSettingsStore((s) => s.theme);
  const tutorVoice = useSettingsStore((s) => s.tutorVoice);
  const setHaptics = useSettingsStore((s) => s.setHapticsEnabled);
  const setSounds = useSettingsStore((s) => s.setSoundsEnabled);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setTutorVoice = useSettingsStore((s) => s.setTutorVoice);

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
      {!isDark && <HomeMeshBackground />}
      <GsapEnterBlock index={0}>
        <View
          style={[
            styles.header,
            { flexDirection: "row" },
          ]}
        >
          <PressableScale
            onPress={() => {
              if (haptics) {
                try {
                  const { hapticSelection } = require("../../utils/haptics");
                  hapticSelection();
                } catch {}
              }
              safeBack();
            }}
            scaleDown={0.9}
            style={styles.backButton}
          >
            <HugeiconsIcon
              icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
              size={22}
              color={colors.foreground}
              strokeWidth={2.5}
            />
          </PressableScale>

          <AppSettingsIcon size={28} />
          <View
            style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}
          >
            <AppText style={styles.title} forceKurdishFont={isKu}>
              {t("settings.title")}
            </AppText>
            <View style={styles.titleUnderline} />
          </View>
        </View>
      </GsapEnterBlock>

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: tabBarScrollPadding(insets.bottom),
            gap: 2,
          }}
        >
          <GsapEnterBlock index={1}>
            <AppText style={styles.sectionLabel} forceKurdishFont={isKu}>
              {isKu ? "ڕووکار (دەسکاریکردنی ڕەنگ)" : "Appearance"}
            </AppText>
            <View style={styles.card}>
              {[
                { id: "light", label: isKu ? "ڕووناکی" : "Light Mode" },
                { id: "dark", label: isKu ? "تاریک" : "Dark Mode" },
                { id: "system", label: isKu ? "سیستەم" : "System Default" },
              ].map((opt, index) => {
                const selected = theme === opt.id;
                return (
                  <PressableScale
                    key={opt.id}
                    onPress={() => setTheme(opt.id as any)}
                    scaleDown={0.98}
                    style={[
                      styles.row,
                      { flexDirection: isRtl ? "row-reverse" : "row" },
                      index < 2 && styles.rowBorder,
                    ]}
                  >
                    <AppText
                      style={[styles.rowLabel, selected && styles.rowLabelOn]}
                      forceKurdishFont={isKu}
                    >
                      {opt.label}
                    </AppText>
                    {selected ? (
                      <SelectedMark color={colors.secondary} />
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                  </PressableScale>
                );
              })}
            </View>
          </GsapEnterBlock>

          <GsapEnterBlock index={2}>
            <AppText
              style={[styles.sectionLabel, styles.sectionSpaced]}
              forceKurdishFont={isKu}
            >
              {t("settings.nativeLanguage")}
            </AppText>
            <View style={styles.card}>
              {SOURCE_LANGUAGES.map((lang, index) => {
                const selected = nativeLang === lang.id;
                return (
                  <PressableScale
                    key={lang.id}
                    onPress={() => setLanguagePair(lang.id, targetLang)}
                    scaleDown={0.98}
                    style={[
                      styles.row,
                      { flexDirection: isRtl ? "row-reverse" : "row" },
                      index < SOURCE_LANGUAGES.length - 1 && styles.rowBorder,
                    ]}
                  >
                    <AppText
                      style={[styles.rowLabel, selected && styles.rowLabelOn]}
                      forceKurdishFont={lang.rtl || isKu}
                    >
                      {lang.nativeName}
                    </AppText>
                    {selected ? (
                      <SelectedMark color={colors.secondary} />
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                  </PressableScale>
                );
              })}
            </View>

            <AppText
              style={[styles.sectionLabel, styles.sectionSpaced]}
              forceKurdishFont={isKu}
            >
              {t("settings.learningLanguage")}
            </AppText>
            <View style={styles.card}>
              {TARGET_LANGUAGES.map((lang, index) => {
                const selected = targetLang === lang.id;
                return (
                  <PressableScale
                    key={lang.id}
                    onPress={() => setLanguagePair(nativeLang, lang.id)}
                    scaleDown={0.98}
                    style={[
                      styles.row,
                      { flexDirection: isRtl ? "row-reverse" : "row" },
                      index < TARGET_LANGUAGES.length - 1 && styles.rowBorder,
                    ]}
                  >
                    <AppText
                      style={[styles.rowLabel, selected && styles.rowLabelOn]}
                      forceKurdishFont={lang.rtl || isKu}
                    >
                      {lang.nativeName}
                    </AppText>
                    {selected ? (
                      <SelectedMark color={colors.secondary} />
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                  </PressableScale>
                );
              })}
            </View>
          </GsapEnterBlock>

          <GsapEnterBlock index={3}>
            <View style={styles.toggleCard}>
              <View
                style={[
                  styles.toggleRow,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
                  {t("settings.haptics")}
                </AppText>
                <SettingsSwitch
                  value={haptics}
                  onValueChange={setHaptics}
                  activeColor={colors.primary}
                />
              </View>
              <View
                style={[
                  styles.toggleRow,
                  styles.toggleRowLast,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
                  {t("settings.sounds")}
                </AppText>
                <SettingsSwitch
                  value={sounds}
                  onValueChange={setSounds}
                  activeColor={colors.primary}
                />
              </View>
            </View>

            <AppText
              style={[styles.sectionLabel, styles.sectionSpaced]}
              forceKurdishFont={isKu}
            >
              {isKu ? "ڕێڕەوی منداڵان" : "Kids Path Configuration"}
            </AppText>
            <AppText style={styles.sectionHint} forceKurdishFont={isKu}>
              {t("settings.kidsArabicHint")}
            </AppText>
            <View style={styles.toggleCard}>
              <View
                style={[
                  styles.toggleRow,
                  styles.toggleRowLast,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
                  {t("settings.kidsArabic")}
                </AppText>
                <SettingsSwitch
                  value={targetLang === "ar"}
                  onValueChange={(val: boolean) => {
                    setLanguagePair(nativeLang, val ? "ar" : prevNonArTargetRef.current);
                  }}
                  activeColor={colors.primary}
                />
              </View>
            </View>

            <AppText
              style={[styles.sectionLabel, styles.sectionSpaced]}
              forceKurdishFont={isKu}
            >
              {t("settings.tutorVoice")}
            </AppText>
            <AppText style={styles.sectionHint} forceKurdishFont={isKu}>
              {t("settings.tutorVoiceHint")}
            </AppText>
            <View style={styles.card}>
              {[
                { id: "Aoede", labelKey: "settings.tutorVoiceAoede" },
                { id: "Puck", labelKey: "settings.tutorVoicePuck" },
                { id: "Charon", labelKey: "settings.tutorVoiceCharon" },
                { id: "Fenrir", labelKey: "settings.tutorVoiceFenrir" },
                { id: "Kore", labelKey: "settings.tutorVoiceKore" },
              ].map((opt, index, arr) => {
                const selected = tutorVoice === opt.id;
                return (
                  <PressableScale
                    key={opt.id}
                    onPress={() => {
                      setTutorVoice(opt.id);
                      if (haptics) {
                        try {
                          const { hapticImpact } = require("../../utils/haptics");
                          hapticImpact();
                        } catch {}
                      }
                    }}
                    scaleDown={0.98}
                    style={[
                      styles.row,
                      { flexDirection: isRtl ? "row-reverse" : "row" },
                      index < arr.length - 1 && styles.rowBorder,
                    ]}
                  >
                    <AppText
                      style={[styles.rowLabel, selected && styles.rowLabelOn]}
                      forceKurdishFont={isKu}
                    >
                      {t(opt.labelKey as any)}
                    </AppText>
                    {selected ? (
                      <SelectedMark color={colors.secondary} />
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                  </PressableScale>
                );
              })}
            </View>

            <AppText
              style={[styles.sectionLabel, styles.sectionSpaced]}
              forceKurdishFont={isKu}
            >
              {t("settings.fontSection")}
            </AppText>
            <AppText style={styles.sectionHint} forceKurdishFont={isKu}>
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
                      { flexDirection: isRtl ? "row-reverse" : "row" },
                      index < ALL_RABAR_FONTS.length - 1 && styles.rowBorder,
                      selected && styles.fontRowSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.fontRowLeft,
                        { flexDirection: isRtl ? "row-reverse" : "row" },
                      ]}
                    >
                      {selected ? (
                        <SelectedMark color={colors.secondary} />
                      ) : (
                        <View style={styles.radioEmpty} />
                      )}
                      <FontPreviewText
                        font={font}
                        style={[
                          styles.fontPreview,
                          selected && styles.fontPreviewOn,
                        ]}
                      >
                        {t("settings.previewSample")}
                      </FontPreviewText>
                    </View>
                    <RowChevron isRtl={isRtl} color={colors.mutedForeground} />
                  </PressableScale>
                );
              })}
            </View>

            {!isKidsMode && ENABLE_ADMIN ? (
              <>
                <AppText
                  style={[styles.sectionLabel, styles.sectionSpaced]}
                  forceLatinFont
                >
                  Content Admin
                </AppText>
                <AppText style={styles.sectionHint} forceLatinFont>
                  Edit units, lessons, and game content without code.
                </AppText>
                <PressableScale
                  onPress={() => router.push("/admin" as any)}
                  scaleDown={0.98}
                  style={[
                    styles.supportRow,
                    styles.card,
                    {
                      marginTop: 0,
                      flexDirection: isRtl ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <AppText style={styles.rowLabel} forceLatinFont>
                    Open admin panel
                  </AppText>
                  <RowChevron isRtl={isRtl} color={colors.mutedForeground} />
                </PressableScale>
              </>
            ) : null}

            <AppText
              style={[styles.sectionLabel, styles.sectionSpaced]}
              forceKurdishFont={isKu}
            >
              {t("settings.legalSection")}
            </AppText>

            {PRIVACY_POLICY_URL ? (
              <PressableScale
                onPress={() => void openHttpsUrl(PRIVACY_POLICY_URL)}
                scaleDown={0.98}
                style={[
                  styles.supportRow,
                  styles.card,
                  { marginTop: 0, flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
                  {isKu ? "سیاسەت (وێب)" : "Privacy (web)"}
                </AppText>
                <RowChevron isRtl={isRtl} color={colors.mutedForeground} />
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
                    { flexDirection: isRtl ? "row-reverse" : "row" },
                    index < LEGAL_LINKS.length - 1 && styles.rowBorder,
                  ]}
                >
                  <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
                    {t(link.labelKey)}
                  </AppText>
                  <RowChevron isRtl={isRtl} color={colors.mutedForeground} />
                </PressableScale>
              ))}
            </View>

            <PressableScale
              onPress={() => void openMailto(SUPPORT_EMAIL)}
              scaleDown={0.98}
              style={[
                styles.supportRow,
                styles.card,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <View style={{ alignItems: isRtl ? "flex-end" : "flex-start" }}>
                <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
                  {t("settings.support")}
                </AppText>
                <Text
                  style={[
                    styles.supportEmail,
                    { textAlign: isRtl ? "right" : "left" },
                  ]}
                >
                  {SUPPORT_EMAIL}
                </Text>
              </View>
              <RowChevron isRtl={isRtl} color={colors.mutedForeground} />
            </PressableScale>

            <Text style={styles.versionText}>
              {t("settings.version")} {APP_VERSION}
            </Text>

            {!isKidsMode && (
              <>
                <AppText
                  style={[styles.sectionLabel, styles.sectionSpaced]}
                  forceKurdishFont={isKu}
                >
                  {isKu ? "ئەکاونتەکەت" : "Your Account"}
                </AppText>
                {user ? (
                  <>
                    <PressableScale
                      onPress={() => {
                        confirmAction(
                          isKu ? "چوونەدەرەوە" : "Sign Out",
                          isKu ? "دڵنیای لە چوونەدەرەوە لە ئەکاونتەکەت؟" : "Are you sure you want to sign out?",
                          async () => {
                            try {
                              await signOut();
                              router.replace("/more");
                            } catch {
                              Alert.alert(
                                isKu ? "هەڵەیەک ڕوویدا" : "Could not sign out",
                                isKu ? "تکایە دووبارە هەوڵ بدەرەوە." : "Please try again.",
                              );
                            }
                          },
                          {
                            confirmLabel: isKu ? "بچۆ دەرەوە" : "Sign Out",
                            cancelLabel: isKu ? "پاشگەزبوونەوە" : "Cancel",
                            destructive: true,
                          },
                        );
                      }}
                      scaleDown={0.98}
                      style={[styles.signOutBtn, styles.card]}
                    >
                      <AppText style={styles.signOutLabel} forceKurdishFont={isKu}>
                        {isKu ? "چوونەدەرەوە لە ئەکاونت" : "Sign Out"}
                      </AppText>
                    </PressableScale>

                    <PressableScale
                      onPress={() => {
                        if (isDeletingAccount) return;
                        confirmAction(
                          isKu ? "سڕینەوەی ئەکاونت" : "Delete Account",
                          isKu
                            ? "هەموو زانیاری و پێشکەوتنە هاوکاتکراوەکانت بە هەمیشەیی دەسڕێتەوە. ئەم کردارە ناگەڕێتەوە."
                            : "This permanently deletes your account and synced learning progress. This cannot be undone.",
                          async () => {
                            setIsDeletingAccount(true);
                            try {
                              await deleteAccount();
                              router.replace("/more");
                            } catch {
                              Alert.alert(
                                isKu ? "ئەکاونتەکە نەسڕایەوە" : "Account not deleted",
                                isKu
                                  ? "هیچ شتێک نەگۆڕاوە. تکایە پەیوەندیی ئینتەرنێت بپشکنە و دووبارە هەوڵ بدەرەوە."
                                  : "Nothing was changed. Check your connection and try again.",
                              );
                            } finally {
                              setIsDeletingAccount(false);
                            }
                          },
                          {
                            confirmLabel: isKu ? "بە هەمیشەیی بیسڕەوە" : "Delete Permanently",
                            cancelLabel: isKu ? "پاشگەزبوونەوە" : "Cancel",
                            destructive: true,
                          },
                        );
                      }}
                      scaleDown={0.98}
                      style={[styles.deleteAccountBtn, styles.card]}
                    >
                      <AppText style={styles.deleteAccountLabel} forceKurdishFont={isKu}>
                        {isDeletingAccount
                          ? isKu ? "لە سڕینەوەدایە..." : "Deleting..."
                          : isKu ? "سڕینەوەی ئەکاونت" : "Delete Account"}
                      </AppText>
                    </PressableScale>
                  </>
                ) : (
                  <PressableScale
                    onPress={() => {
                      router.push("/auth");
                    }}
                    scaleDown={0.98}
                    style={[styles.signInBtn, styles.card]}
                  >
                    <AppText style={styles.signInLabel} forceKurdishFont={isKu}>
                      {isKu ? "چوونەژوورەوە یان تۆماربوون" : "Sign In / Sign Up"}
                    </AppText>
                  </PressableScale>
                )}

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
              </>
            )}
          </GsapEnterBlock>
        </ScrollView>

        {/* Blurred Gradient Overlay above Navbar */}
        <BottomScrollFade />
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 10,
      backgroundColor: "transparent",
      marginBottom: 8,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.cardBorder || "rgba(0, 0, 0, 0.05)",
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        },
      }),
    },
    title: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.foreground,
      letterSpacing: -0.8,
      fontFamily: "DINNextRoundedBold",
    },
    titleUnderline: {
      width: 34,
      height: 4,
      borderRadius: 999,
      backgroundColor: colors.primary,
      marginTop: 6,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.mutedForeground,
      fontFamily: "DINNextRoundedBold",
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    sectionSpaced: {
      marginTop: 18,
    },
    sectionHint: {
      fontSize: 13,
      color: colors.mutedForeground,
      marginBottom: 8,
      marginTop: -4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 15,
      paddingHorizontal: 16,
    },
    rowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowLabel: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "DINNextRoundedMedium",
    },
    rowLabelOn: {
      color: colors.secondary,
      fontFamily: "DINNextRoundedBold",
    },
    radioEmpty: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
    },
    toggleCard: {
      marginTop: 16,
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingHorizontal: 16,
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    toggleRowLast: {
      borderBottomWidth: 0,
    },
    toggleLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
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
      backgroundColor: colors.muted,
    },
    fontRowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    fontPreview: {
      fontSize: 20,
      color: colors.foreground,
      textAlign: "right",
      writingDirection: "rtl",
      flexShrink: 1,
    },
    fontPreviewOn: {
      color: colors.secondary,
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
      color: colors.secondary,
      marginTop: 4,
      fontFamily: "DINNextRoundedMedium",
    },
    versionText: {
      fontSize: 13,
      color: colors.mutedForeground,
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
      color: colors.secondary,
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
      color: colors.error,
      fontFamily: "DINNextRoundedBold",
    },
    signOutBtn: {
      marginTop: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: "center",
      backgroundColor: colors.card,
    },
    signOutLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.error,
      fontFamily: "DINNextRoundedBold",
    },
    deleteAccountBtn: {
      marginTop: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.error,
      backgroundColor: "transparent",
    },
    deleteAccountLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.error,
      fontFamily: "DINNextRoundedBold",
    },
    signInBtn: {
      marginTop: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: "center",
      backgroundColor: colors.secondary,
    },
    signInLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: "#FFFFFF",
      fontFamily: "DINNextRoundedBold",
    },
    inputField: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 12,
      fontSize: 16,
      color: colors.foreground,
      backgroundColor: colors.card,
    },
    saveBtn: {
      backgroundColor: colors.secondary,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    saveBtnText: {
      color: "#FFF",
      fontWeight: "700",
      fontSize: 16,
      fontFamily: "DINNextRoundedBold",
    },
  });
