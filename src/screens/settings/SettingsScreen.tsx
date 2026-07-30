import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  ComputerIcon,
  Delete02Icon,
  LanguageSkillIcon,
  Logout01Icon,
  Mail01Icon,
  Moon02Icon,
  PaintBrush01Icon,
  RefreshIcon,
  RotateLeft01Icon,
  Shield01Icon,
  Sun03Icon,
  TouchInteraction01Icon,
  UserIcon,
  VoiceIcon,
  VolumeHighIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import {
  SOURCE_LANGUAGES,
  TARGET_LANGUAGES,
  TARGET_LANGUAGE_CATALOG,
  UI_LANGUAGES,
  getTargetLanguagesForSource,
} from "../../config/languages";
import {
  APP_VERSION,
  PRIVACY_POLICY_URL,
  SUPPORT_EMAIL,
} from "../../constants/app-meta";
import { ENABLE_ADMIN } from "../../constants/feature-flags";
import { tabBarScrollPadding } from "../../constants/layout";
import { ALL_RABAR_FONTS } from "../../constants/rabar-fonts";
import { useAuth } from "../../context/AuthContext";
import { fontMap } from "../../fontMap";
import { useI18n } from "../../hooks/useI18n";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useFontStore } from "../../stores/useFontStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { confirmAction } from "../../utils/confirm-action";
import { openHttpsUrl, openMailto } from "../../utils/safe-link";

const LEGAL_LINKS = [
  {
    route: "/privacy-policy" as const,
    labelKey: "settings.privacyPolicy" as const,
  },
  { route: "/ai-safety" as const, labelKey: "settings.aiSafety" as const },
  { route: "/terms" as const, labelKey: "settings.termsOfUse" as const },
];

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"];

type SettingsLocale = "en" | "ku" | "ar";

const COPY = {
  en: {
    subtitle: "Tune the app to the way you learn",
    appearance: "Appearance",
    appearanceHint: "Screen and color mode",
    light: "Light",
    dark: "Dark",
    system: "System",
    languageRoute: "Language route",
    languageHint: "Your language and the language you are learning",
    interfaceLanguage: "App language",
    preview: "Preview",
    notReadyTitle: "Course not published yet",
    notReadyBody: "This target is available for preview, but its complete lesson pack has not been published yet.",
    source: "I speak",
    target: "I am learning",
    feel: "Feel and sound",
    feelHint: "Physical feedback and audio",
    voice: "Tutor voice",
    voiceHint: "Cycle through the available live tutor voices",
    type: "Sorani type",
    typeHint: "Preview each typeface before choosing it",
    sample: "Learning a language",
    previous: "Previous",
    next: "Next",
    details: "Help and information",
    account: "Account and data",
    admin: "Content administration",
    privacyWeb: "Privacy policy on the web",
    signOut: "Sign out",
    deleteAccount: "Delete account",
    deleting: "Deleting…",
    signIn: "Sign in or create an account",
    replay: "Replay the welcome flow",
    reset: "Erase learning progress",
  },
  ku: {
    subtitle: "شێوازی ئەپەکە بە دڵی خۆت ڕێک بخە",
    appearance: "ڕووکار",
    appearanceHint: "ڕووناکی و ڕەنگی شاشە",
    light: "ڕووناک",
    dark: "تاریک",
    system: "سیستەم",
    languageRoute: "ڕێڕەوی زمان",
    languageHint: "زمانی دایک و ئەو زمانەی فێری دەبیت",
    interfaceLanguage: "زمانی ئەپ",
    preview: "پێشبینین",
    notReadyTitle: "کۆرسەکە هێشتا بڵاونەکراوەتەوە",
    notReadyBody: "ئەم زمانە بۆ پێشبینین بەردەستە، بەڵام پاکێجی تەواوی وانەکان هێشتا بڵاونەکراوەتەوە.",
    source: "زمانی من",
    target: "فێری دەبم",
    feel: "هەست و دەنگ",
    feelHint: "لەرزین و دەنگ",
    voice: "دەنگی ڕاهێنەر",
    voiceHint: "لە نێوان دەنگەکانی ڕاهێنەری ڕاستەوخۆدا بگۆڕە",
    type: "شێوەنووسی سۆرانی",
    typeHint: "پێش هەڵبژاردن، هەر فۆنتێک ببینە",
    sample: "فێربوونی زمان",
    previous: "پێشوو",
    next: "دواتر",
    details: "یارمەتی و زانیاری",
    account: "ئەکاونت و داتا",
    admin: "بەڕێوەبردنی ناوەڕۆک",
    privacyWeb: "سیاسەتی تایبەتمەندی لە وێب",
    signOut: "چوونەدەرەوە",
    deleteAccount: "سڕینەوەی ئەکاونت",
    deleting: "لە سڕینەوەدایە…",
    signIn: "چوونەژوورەوە یان دروستکردنی ئەکاونت",
    replay: "دووبارەکردنەوەی بەخێرهاتن",
    reset: "سڕینەوەی پێشکەوتنی فێربوون",
  },
  ar: {
    subtitle: "اضبط التطبيق بالطريقة التي تناسب تعلمك",
    appearance: "المظهر",
    appearanceHint: "إضاءة الشاشة ونمط الألوان",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
    languageRoute: "مسار اللغة",
    languageHint: "لغتك واللغة التي تتعلمها",
    interfaceLanguage: "لغة التطبيق",
    preview: "معاينة",
    notReadyTitle: "الدورة غير منشورة بعد",
    notReadyBody: "هذه اللغة متاحة للمعاينة، لكن حزمة الدروس الكاملة لم تُنشر بعد.",
    source: "لغتي",
    target: "أتعلم",
    feel: "الإحساس والصوت",
    feelHint: "الاهتزاز والصوت",
    voice: "صوت المدرّب",
    voiceHint: "تنقل بين أصوات المدرّب المباشر",
    type: "خط السورانية",
    typeHint: "عاين كل خط قبل اختياره",
    sample: "تعلم اللغة",
    previous: "السابق",
    next: "التالي",
    details: "المساعدة والمعلومات",
    account: "الحساب والبيانات",
    admin: "إدارة المحتوى",
    privacyWeb: "سياسة الخصوصية على الويب",
    signOut: "تسجيل الخروج",
    deleteAccount: "حذف الحساب",
    deleting: "جارٍ الحذف…",
    signIn: "تسجيل الدخول أو إنشاء حساب",
    replay: "إعادة شاشة الترحيب",
    reset: "مسح تقدم التعلم",
  },
} as const;

function resolveLocale(locale: string): SettingsLocale {
  if (locale === "ku" || locale === "ar") return locale;
  return "en";
}

const FontPreviewText = React.memo(
  ({ font, style, children }: { font: string; style: StyleProp<TextStyle>; children: React.ReactNode }) => {
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
      if (Font.isLoaded(font)) {
        setLoaded(true);
        return;
      }
      const fontFile = fontMap[font as keyof typeof fontMap];
      if (!fontFile) return;
      Font.loadAsync({ [font]: fontFile })
        .then(() => setLoaded(true))
        .catch(() => {});
    }, [font]);

    return <Text style={[style, loaded ? { fontFamily: font } : null]}>{children}</Text>;
  },
);
FontPreviewText.displayName = "FontPreviewText";

function SettingsSwitch({
  value,
  onValueChange,
  activeColor,
  label,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor: string;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
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

function SectionHeading({
  title,
  hint,
  locale,
  styles,
}: {
  title: string;
  hint?: string;
  locale: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionIndex} />
      <View style={styles.sectionHeadingCopy}>
        <AppText style={styles.sectionTitle} languageCode={locale} align="start" latinRole="bold">
          {title}
        </AppText>
        {hint ? (
          <AppText style={styles.sectionHint} languageCode={locale} align="start">
            {hint}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
  languageCode,
  styles,
  disabled = false,
  statusLabel,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  languageCode: string;
  styles: ReturnType<typeof createStyles>;
  disabled?: boolean;
  statusLabel?: string;
}) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={statusLabel ? `${label}, ${statusLabel}` : label}
      onPress={onPress}
      disabled={disabled}
      scaleDown={0.96}
      style={[
        styles.choiceChip,
        selected && styles.choiceChipSelected,
        disabled && styles.choiceChipDisabled,
        statusLabel && styles.choiceChipWithStatus,
      ]}
    >
      {selected ? (
        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} color="#FFFFFF" strokeWidth={2.4} />
      ) : null}
      <AppText
        style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}
        languageCode={languageCode}
        align="center"
        latinRole="bold"
      >
        {label}
      </AppText>
      {statusLabel ? (
        <AppText style={styles.choiceChipStatus} languageCode={languageCode} align="center">
          {statusLabel}
        </AppText>
      ) : null}
    </PressableScale>
  );
}

function ControlRow({
  icon,
  title,
  subtitle,
  control,
  locale,
  styles,
  last,
}: {
  icon: HugeIcon;
  title: string;
  subtitle?: string;
  control: React.ReactNode;
  locale: string;
  styles: ReturnType<typeof createStyles>;
  last?: boolean;
}) {
  return (
    <View style={[styles.controlRow, !last && styles.rowDivider]}>
      <View style={styles.rowIconBox}>
        <HugeiconsIcon icon={icon} size={19} color={styles.iconColor.color} strokeWidth={2.1} />
      </View>
      <View style={styles.rowCopy}>
        <AppText style={styles.rowTitle} languageCode={locale} align="start" latinRole="bold">
          {title}
        </AppText>
        {subtitle ? (
          <AppText style={styles.rowSubtitle} languageCode={locale} align="start">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {control}
    </View>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  onPress,
  locale,
  isRtl,
  styles,
  destructive,
  last,
}: {
  icon: HugeIcon;
  title: string;
  subtitle?: string;
  onPress: () => void;
  locale: string;
  isRtl: boolean;
  styles: ReturnType<typeof createStyles>;
  destructive?: boolean;
  last?: boolean;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      scaleDown={0.985}
      style={[styles.actionRow, !last && styles.rowDivider]}
    >
      <View style={[styles.rowIconBox, destructive && styles.rowIconDanger]}>
        <HugeiconsIcon
          icon={icon}
          size={19}
          color={destructive ? styles.dangerColor.color : styles.iconColor.color}
          strokeWidth={2.1}
        />
      </View>
      <View style={styles.rowCopy}>
        <AppText
          style={[styles.rowTitle, destructive && styles.dangerText]}
          languageCode={locale}
          align="start"
          latinRole="bold"
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText style={styles.rowSubtitle} languageCode={locale} align="start">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <HugeiconsIcon
        icon={isRtl ? ArrowLeft01Icon : ArrowRight01Icon}
        size={18}
        color={styles.mutedColor.color}
        strokeWidth={2.2}
      />
    </PressableScale>
  );
}

function CycleSelector({
  title,
  hint,
  value,
  countLabel,
  sample,
  onPrevious,
  onNext,
  copy,
  locale,
  icon,
  styles,
  font,
}: {
  title: string;
  hint: string;
  value: string;
  countLabel: string;
  sample?: string;
  onPrevious: () => void;
  onNext: () => void;
  copy: (typeof COPY)[SettingsLocale];
  locale: string;
  icon: HugeIcon;
  styles: ReturnType<typeof createStyles>;
  font?: string;
}) {
  return (
    <View style={styles.cycleBlock}>
      <View style={styles.cycleHeader}>
        <View style={styles.rowIconBox}>
          <HugeiconsIcon icon={icon} size={19} color={styles.iconColor.color} strokeWidth={2.1} />
        </View>
        <View style={styles.rowCopy}>
          <AppText style={styles.rowTitle} languageCode={locale} align="start" latinRole="bold">
            {title}
          </AppText>
          <AppText style={styles.rowSubtitle} languageCode={locale} align="start">
            {hint}
          </AppText>
        </View>
        <AppText style={styles.counter} languageCode="en" align="center" latinRole="bold">
          {countLabel}
        </AppText>
      </View>

      <View style={styles.cycleDeck}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={copy.previous}
          onPress={onPrevious}
          scaleDown={0.9}
          style={styles.cycleArrow}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={19} color={styles.iconColor.color} strokeWidth={2.3} />
        </PressableScale>
        <View style={styles.cycleValue}>
          {sample && font ? (
            <FontPreviewText font={font} style={styles.fontSample}>
              {sample}
            </FontPreviewText>
          ) : null}
          <AppText
            style={[styles.cycleValueText, sample && styles.cycleValueTextSmall]}
            languageCode={locale}
            align="center"
            latinRole="bold"
          >
            {value}
          </AppText>
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={copy.next}
          onPress={onNext}
          scaleDown={0.9}
          style={styles.cycleArrow}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={19} color={styles.iconColor.color} strokeWidth={2.3} />
        </PressableScale>
      </View>
    </View>
  );
}

export default function SettingsScreen({ isKidsMode = false }: { isKidsMode?: boolean }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const safeBack = useSafeBack("/(tabs)/more");
  const { t, locale } = useI18n();
  const localeCode = resolveLocale(locale);
  const copy = COPY[localeCode];
  const isRtl = localeCode !== "en";
  const { user, signOut, deleteAccount } = useAuth();
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const { colors, isDark } = useThemeColors();
  const isCompact = width < 480;
  const styles = useMemo(() => createStyles(colors, isDark, isCompact), [colors, isDark, isCompact]);

  const selectedFont = useFontStore((state) => state.selectedFont);
  const setFont = useFontStore((state) => state.setFont);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const replayOnboarding = useOnboardingStore((state) => state.replayOnboarding);
  const haptics = useSettingsStore((state) => state.hapticsEnabled);
  const sounds = useSettingsStore((state) => state.soundsEnabled);
  const theme = useSettingsStore((state) => state.theme);
  const tutorVoice = useSettingsStore((state) => state.tutorVoice);
  const setHaptics = useSettingsStore((state) => state.setHapticsEnabled);
  const setSounds = useSettingsStore((state) => state.setSoundsEnabled);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setTutorVoice = useSettingsStore((state) => state.setTutorVoice);
  const targetLang = useLocaleStore((state) => state.selectedTargetLanguage);
  const nativeLang = useLocaleStore((state) => state.selectedSourceLanguage);
  const uiLanguage = useLocaleStore((state) => state.selectedUiLanguage);
  const setUiLanguage = useLocaleStore((state) => state.setUiLanguage);
  const setLanguagePair = useLocaleStore((state) => state.setLanguagePair);

  const voiceOptions = useMemo(
    () => [
      { id: "Aoede", label: t("settings.tutorVoiceAoede") },
      { id: "Puck", label: t("settings.tutorVoicePuck") },
      { id: "Charon", label: t("settings.tutorVoiceCharon") },
      { id: "Fenrir", label: t("settings.tutorVoiceFenrir") },
      { id: "Kore", label: t("settings.tutorVoiceKore") },
    ],
    [t],
  );

  const selectedVoiceIndex = Math.max(0, voiceOptions.findIndex((option) => option.id === tutorVoice));
  const selectedFontIndex = Math.max(0, ALL_RABAR_FONTS.indexOf(selectedFont));

  const changeVoice = (delta: number) => {
    const nextIndex = (selectedVoiceIndex + delta + voiceOptions.length) % voiceOptions.length;
    setTutorVoice(voiceOptions[nextIndex].id);
  };

  const changeFont = (delta: number) => {
    const nextIndex = (selectedFontIndex + delta + ALL_RABAR_FONTS.length) % ALL_RABAR_FONTS.length;
    setFont(ALL_RABAR_FONTS[nextIndex]);
  };

  const confirmReplayOnboarding = () => {
    confirmAction(
      t("settings.replayOnboarding"),
      t("settings.replayOnboardingHint"),
      replayOnboarding,
      {
        confirmLabel: t("settings.replayOnboardingConfirm"),
        cancelLabel: localeCode === "ku" ? "پاشگەزبوونەوە" : "Cancel",
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
        cancelLabel: localeCode === "ku" ? "پاشگەزبوونەوە" : "Cancel",
        destructive: true,
      },
    );
  };

  const confirmSignOut = () => {
    confirmAction(
      copy.signOut,
      localeCode === "ku" ? "دڵنیای لە چوونەدەرەوە لە ئەکاونتەکەت؟" : "Are you sure you want to sign out?",
      async () => {
        try {
          await signOut();
          router.replace("/more");
        } catch {
          Alert.alert(
            localeCode === "ku" ? "هەڵەیەک ڕوویدا" : "Could not sign out",
            localeCode === "ku" ? "تکایە دووبارە هەوڵ بدەرەوە." : "Please try again.",
          );
        }
      },
      {
        confirmLabel: copy.signOut,
        cancelLabel: localeCode === "ku" ? "پاشگەزبوونەوە" : "Cancel",
        destructive: true,
      },
    );
  };

  const confirmDeleteAccount = () => {
    if (isDeletingAccount) return;
    confirmAction(
      copy.deleteAccount,
      localeCode === "ku"
        ? "هەموو زانیاری و پێشکەوتنە هاوکاتکراوەکانت بە هەمیشەیی دەسڕێتەوە. ئەم کردارە ناگەڕێتەوە."
        : "This permanently deletes your account and synced learning progress. This cannot be undone.",
      async () => {
        setIsDeletingAccount(true);
        try {
          await deleteAccount();
          router.replace("/more");
        } catch {
          Alert.alert(
            localeCode === "ku" ? "ئەکاونتەکە نەسڕایەوە" : "Account not deleted",
            localeCode === "ku"
              ? "هیچ شتێک نەگۆڕاوە. پەیوەندیی ئینتەرنێت بپشکنە و دووبارە هەوڵ بدەرەوە."
              : "Nothing was changed. Check your connection and try again.",
          );
        } finally {
          setIsDeletingAccount(false);
        }
      },
      {
        confirmLabel: copy.deleteAccount,
        cancelLabel: localeCode === "ku" ? "پاشگەزبوونەوە" : "Cancel",
        destructive: true,
      },
    );
  };

  const themeOptions = [
    { id: "light", label: copy.light, icon: Sun03Icon },
    { id: "dark", label: copy.dark, icon: Moon02Icon },
    { id: "system", label: copy.system, icon: ComputerIcon },
  ] as const;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={isRtl ? "گەڕانەوە" : "Back"}
          onPress={safeBack}
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
        <View style={styles.headerCopy}>
          <AppText style={styles.title} languageCode={locale} align="start" latinRole="bold">
            {t("settings.title")}
          </AppText>
          <AppText style={styles.headerSubtitle} languageCode={locale} align="start">
            {copy.subtitle}
          </AppText>
        </View>
      </View>

      <View style={styles.scrollFrame}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: tabBarScrollPadding(insets.bottom) + 24 },
          ]}
        >
          <View style={styles.featurePanel}>
            <View style={styles.featureHeader}>
              <View style={styles.featureIcon}>
                <HugeiconsIcon icon={PaintBrush01Icon} size={19} color={colors.onPrimary} strokeWidth={2.1} />
              </View>
              <View style={styles.featureCopy}>
                <AppText style={styles.featureTitle} languageCode={locale} align="start" latinRole="bold">
                  {copy.appearance}
                </AppText>
                <AppText style={styles.featureHint} languageCode={locale} align="start">
                  {copy.appearanceHint}
                </AppText>
              </View>
            </View>
            <View style={styles.themeRail}>
              {themeOptions.map((option) => {
                const selected = theme === option.id;
                return (
                  <PressableScale
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={option.label}
                    onPress={() => setTheme(option.id)}
                    scaleDown={0.94}
                    style={[styles.themeOption, selected && styles.themeOptionSelected]}
                  >
                    <HugeiconsIcon
                      icon={option.icon}
                      size={18}
                      color={selected ? colors.onPrimary : styles.featureMuted.color}
                      strokeWidth={2.1}
                    />
                    <AppText
                      style={[styles.themeOptionText, selected && styles.themeOptionTextSelected]}
                      languageCode={locale}
                      align="center"
                      latinRole="bold"
                    >
                      {option.label}
                    </AppText>
                  </PressableScale>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeading
              title={copy.languageRoute}
              hint={copy.languageHint}
              locale={locale}
              styles={styles}
            />
            <View style={styles.routeSummary}>
              <View style={styles.routeNode}>
                <AppText style={styles.routeLabel} languageCode={locale} align="start">
                  {copy.source}
                </AppText>
                <AppText style={styles.routeValue} languageCode={nativeLang} align="start" latinRole="bold">
                  {SOURCE_LANGUAGES.find((language) => language.id === nativeLang)?.nativeName ?? nativeLang}
                </AppText>
              </View>
              <View style={styles.routeLine}>
                <View style={styles.routeDot} />
                <View style={styles.routeStroke} />
                <HugeiconsIcon
                  icon={isRtl ? ArrowLeft01Icon : ArrowRight01Icon}
                  size={17}
                  color={colors.primary}
                  strokeWidth={2.4}
                />
              </View>
              <View style={styles.routeNode}>
                <AppText style={styles.routeLabel} languageCode={locale} align="start">
                  {copy.target}
                </AppText>
                <AppText style={styles.routeValue} languageCode={targetLang} align="start" latinRole="bold">
                  {TARGET_LANGUAGES.find((language) => language.id === targetLang)?.nativeName ?? targetLang}
                </AppText>
              </View>
            </View>

            <View style={styles.languageControls}>
              <View style={styles.choiceGroup}>
                <AppText style={styles.choiceLabel} languageCode={locale} align="start" latinRole="bold">
                  {copy.interfaceLanguage}
                </AppText>
                <View style={styles.choiceWrap}>
                  {UI_LANGUAGES.map((language) => (
                    <ChoiceChip
                      key={language.id}
                      label={language.nativeName}
                      selected={uiLanguage === language.id}
                      onPress={() => setUiLanguage(language.id)}
                      languageCode={language.id}
                      styles={styles}
                    />
                  ))}
                </View>
              </View>

              <View style={[styles.choiceGroup, styles.choiceGroupDivider]}>
                <AppText style={styles.choiceLabel} languageCode={locale} align="start" latinRole="bold">
                  {copy.source}
                </AppText>
                <View style={styles.choiceWrap}>
                  {SOURCE_LANGUAGES.map((language) => (
                    <ChoiceChip
                      key={language.id}
                      label={language.nativeName}
                      selected={nativeLang === language.id}
                      onPress={() => {
                        const nextTarget = getTargetLanguagesForSource(language.id).some(
                          (target) => target.id === targetLang,
                        )
                          ? targetLang
                          : getTargetLanguagesForSource(language.id)[0]?.id;
                        if (nextTarget) setLanguagePair(language.id, nextTarget);
                      }}
                      languageCode={language.id}
                      styles={styles}
                    />
                  ))}
                </View>
              </View>

              <View style={[styles.choiceGroup, styles.choiceGroupDivider]}>
                <AppText style={styles.choiceLabel} languageCode={locale} align="start" latinRole="bold">
                  {copy.target}
                </AppText>
                <View style={styles.choiceWrap}>
                  {TARGET_LANGUAGE_CATALOG.map((language) => {
                    const selectable = language.supportedAsTarget;
                    return (
                      <ChoiceChip
                        key={language.id}
                        label={language.nativeName}
                        selected={targetLang === language.id}
                        onPress={() => {
                          if (!selectable) {
                            Alert.alert(copy.notReadyTitle, copy.notReadyBody);
                            return;
                          }
                          setLanguagePair(nativeLang, language.id);
                        }}
                        languageCode={language.id}
                        styles={styles}
                        disabled={false}
                        statusLabel={language.curriculumReady ? undefined : copy.preview}
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeading title={copy.feel} hint={copy.feelHint} locale={locale} styles={styles} />
            <View style={styles.controlGroup}>
              <ControlRow
                icon={TouchInteraction01Icon}
                title={t("settings.haptics")}
                locale={locale}
                styles={styles}
                control={
                  <SettingsSwitch
                    label={t("settings.haptics")}
                    value={haptics}
                    onValueChange={setHaptics}
                    activeColor={colors.primary}
                  />
                }
              />
              <ControlRow
                icon={VolumeHighIcon}
                title={t("settings.sounds")}
                locale={locale}
                styles={styles}
                control={
                  <SettingsSwitch
                    label={t("settings.sounds")}
                    value={sounds}
                    onValueChange={setSounds}
                    activeColor={colors.primary}
                  />
                }
              />
            </View>
          </View>

          <View style={styles.section}>
            <CycleSelector
              title={copy.voice}
              hint={copy.voiceHint}
              value={voiceOptions[selectedVoiceIndex].label}
              countLabel={`${selectedVoiceIndex + 1}/${voiceOptions.length}`}
              onPrevious={() => changeVoice(-1)}
              onNext={() => changeVoice(1)}
              copy={copy}
              locale={locale}
              icon={VoiceIcon}
              styles={styles}
            />
            <View style={styles.cycleDivider} />
            <CycleSelector
              title={copy.type}
              hint={copy.typeHint}
              value={selectedFont.replace("Rabar_", "Rabar ")}
              countLabel={`${selectedFontIndex + 1}/${ALL_RABAR_FONTS.length}`}
              sample={copy.sample}
              onPrevious={() => changeFont(-1)}
              onNext={() => changeFont(1)}
              copy={copy}
              locale={locale}
              icon={LanguageSkillIcon}
              styles={styles}
              font={selectedFont}
            />
          </View>

          <View style={styles.section}>
            <SectionHeading title={copy.details} locale={locale} styles={styles} />
            <View style={styles.flatList}>
              {!isKidsMode && ENABLE_ADMIN ? (
                <ActionRow
                  icon={Wrench01Icon}
                  title={copy.admin}
                  onPress={() => router.push("/admin" as never)}
                  locale={locale}
                  isRtl={isRtl}
                  styles={styles}
                />
              ) : null}
              {PRIVACY_POLICY_URL ? (
                <ActionRow
                  icon={Shield01Icon}
                  title={copy.privacyWeb}
                  onPress={() => void openHttpsUrl(PRIVACY_POLICY_URL)}
                  locale={locale}
                  isRtl={isRtl}
                  styles={styles}
                />
              ) : null}
              {LEGAL_LINKS.map((link) => (
                <ActionRow
                  key={link.route}
                  icon={Shield01Icon}
                  title={t(link.labelKey)}
                  onPress={() => router.push(link.route)}
                  locale={locale}
                  isRtl={isRtl}
                  styles={styles}
                />
              ))}
              <ActionRow
                icon={Mail01Icon}
                title={t("settings.support")}
                subtitle={SUPPORT_EMAIL}
                onPress={() => void openMailto(SUPPORT_EMAIL)}
                locale={locale}
                isRtl={isRtl}
                styles={styles}
                last
              />
            </View>
          </View>

          {!isKidsMode ? (
            <View style={styles.section}>
              <SectionHeading title={copy.account} locale={locale} styles={styles} />
              <View style={styles.accountIdentity}>
                <View style={styles.accountMark}>
                  <HugeiconsIcon icon={UserIcon} size={20} color={colors.onPrimary} strokeWidth={2.1} />
                </View>
                <View style={styles.rowCopy}>
                  <AppText style={styles.rowTitle} languageCode={locale} align="start" latinRole="bold">
                    {user?.email ?? copy.signIn}
                  </AppText>
                  <AppText style={styles.rowSubtitle} languageCode={locale} align="start">
                    {t("settings.version")} {APP_VERSION}
                  </AppText>
                </View>
              </View>

              {!user ? (
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={copy.signIn}
                  onPress={() => router.push("/auth")}
                  scaleDown={0.97}
                  style={styles.primaryAction}
                >
                  <AppText style={styles.primaryActionText} languageCode={locale} align="center" latinRole="bold">
                    {copy.signIn}
                  </AppText>
                </PressableScale>
              ) : null}

              <View style={styles.flatList}>
                {user ? (
                  <>
                    <ActionRow
                      icon={Logout01Icon}
                      title={copy.signOut}
                      onPress={confirmSignOut}
                      locale={locale}
                      isRtl={isRtl}
                      styles={styles}
                    />
                    <ActionRow
                      icon={Delete02Icon}
                      title={isDeletingAccount ? copy.deleting : copy.deleteAccount}
                      onPress={confirmDeleteAccount}
                      locale={locale}
                      isRtl={isRtl}
                      styles={styles}
                      destructive
                    />
                  </>
                ) : null}
                <ActionRow
                  icon={RefreshIcon}
                  title={copy.replay}
                  onPress={confirmReplayOnboarding}
                  locale={locale}
                  isRtl={isRtl}
                  styles={styles}
                />
                <ActionRow
                  icon={RotateLeft01Icon}
                  title={copy.reset}
                  onPress={confirmReset}
                  locale={locale}
                  isRtl={isRtl}
                  styles={styles}
                  destructive
                  last
                />
              </View>
            </View>
          ) : null}

          <View style={styles.footerRule} />
          <AppText style={styles.footerText} languageCode="en" align="center" latinRole="bold">
            TWINO · {APP_VERSION}
          </AppText>
        </ScrollView>
        <BottomScrollFade />
      </View>
    </View>
  );
}

const stylesStatic = StyleSheet.create({
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 999,
    justifyContent: "center",
    flexShrink: 0,
    ...Platform.select({
      web: { userSelect: "none", cursor: "pointer" },
    }),
  },
  switchTrackOff: {
    backgroundColor: "#CBD5E1",
  },
  switchPressed: {
    opacity: 0.8,
  },
  switchThumb: {
    position: "absolute",
    top: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.16,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
      web: { boxShadow: "0 1px 4px rgba(15, 23, 42, 0.2)" },
    }),
  },
  switchThumbOff: { left: 3 },
  switchThumbOn: { left: 23 },
});

const createStyles = (colors: any, isDark: boolean, isCompact: boolean) => {
  const featureBackground = isDark ? colors.surfaceRaised : colors.foreground;
  const raisedBackground = isDark ? colors.surface : colors.card;
  const subtleBackground = isDark ? colors.muted : "#F4F6F8";

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollFrame: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: 20,
      paddingBottom: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: raisedBackground,
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    title: {
      fontSize: 28,
      lineHeight: 34,
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.mutedForeground,
    },
    content: {
      width: "100%",
      maxWidth: 760,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      gap: 34,
    },
    featurePanel: {
      padding: 18,
      gap: 18,
      borderRadius: 26,
      borderCurve: "continuous",
      backgroundColor: featureBackground,
      ...Platform.select({
        web: { boxShadow: isDark ? "none" : "0 16px 40px rgba(15, 23, 42, 0.12)" },
        ios: {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: isDark ? 0 : 0.12,
          shadowRadius: 24,
        },
        android: { elevation: isDark ? 0 : 4 },
      }),
    },
    featureHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    featureIcon: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    featureCopy: {
      flex: 1,
      minWidth: 0,
      gap: 1,
    },
    featureTitle: {
      color: colors.onPrimary,
      fontSize: 18,
      lineHeight: 24,
    },
    featureHint: {
      color: isDark ? colors.mutedForeground : "rgba(255,255,255,0.62)",
      fontSize: 12,
      lineHeight: 17,
    },
    featureMuted: {
      color: isDark ? colors.mutedForeground : "rgba(255,255,255,0.62)",
    },
    themeRail: {
      flexDirection: "row",
      gap: 7,
      padding: 5,
      borderRadius: 18,
      borderCurve: "continuous",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    themeOption: {
      flex: 1,
      minHeight: 52,
      borderRadius: 14,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    themeOptionSelected: {
      backgroundColor: colors.primary,
    },
    themeOptionText: {
      color: isDark ? colors.mutedForeground : "rgba(255,255,255,0.62)",
      fontSize: 11,
    },
    themeOptionTextSelected: {
      color: colors.onPrimary,
    },
    section: {
      gap: 14,
    },
    sectionHeading: {
      flexDirection: "row",
      alignItems: "stretch",
      gap: 11,
    },
    sectionIndex: {
      width: 3,
      minHeight: 38,
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    sectionHeadingCopy: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    sectionTitle: {
      fontSize: 18,
      lineHeight: 24,
      color: colors.foreground,
    },
    sectionHint: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.mutedForeground,
    },
    routeSummary: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    routeNode: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    routeLabel: {
      color: colors.mutedForeground,
      fontSize: 11,
    },
    routeValue: {
      color: colors.foreground,
      fontSize: 17,
      lineHeight: 23,
    },
    routeLine: {
      width: isCompact ? 48 : 76,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    routeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    routeStroke: {
      width: isCompact ? 18 : 34,
      height: 1,
      backgroundColor: colors.primary,
    },
    languageControls: {
      overflow: "hidden",
      borderRadius: 20,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: raisedBackground,
    },
    choiceGroup: {
      gap: 8,
      paddingHorizontal: isCompact ? 10 : 14,
      paddingVertical: 12,
    },
    choiceGroupDivider: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    choiceLabel: {
      color: colors.mutedForeground,
      fontSize: 11,
    },
    choiceWrap: {
      flexDirection: "row",
      flexWrap: "nowrap",
      gap: isCompact ? 6 : 8,
    },
    choiceChip: {
      flex: 1,
      minWidth: 0,
      minHeight: 44,
      paddingHorizontal: isCompact ? 6 : 14,
      borderRadius: 14,
      borderCurve: "continuous",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: subtleBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    choiceChipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    choiceChipDisabled: {
      opacity: 0.58,
    },
    choiceChipWithStatus: {
      minHeight: 52,
      flexDirection: "column",
      gap: 1,
    },
    choiceChipText: {
      color: colors.foreground,
      fontSize: 13,
    },
    choiceChipTextSelected: {
      color: colors.onPrimary,
    },
    choiceChipStatus: {
      color: colors.mutedForeground,
      fontSize: 9,
      lineHeight: 11,
    },
    controlGroup: {
      overflow: "hidden",
      borderRadius: 20,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: raisedBackground,
    },
    controlRow: {
      minHeight: 66,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowIconBox: {
      width: 38,
      height: 38,
      flexShrink: 0,
      borderRadius: 13,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: subtleBackground,
    },
    rowIconDanger: {
      backgroundColor: isDark ? "rgba(239,68,68,0.12)" : "#FEF2F2",
    },
    rowCopy: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    rowTitle: {
      color: colors.foreground,
      fontSize: 14,
      lineHeight: 20,
    },
    rowSubtitle: {
      color: colors.mutedForeground,
      fontSize: 11,
      lineHeight: 16,
    },
    iconColor: { color: colors.foreground },
    mutedColor: { color: colors.mutedForeground },
    dangerColor: { color: colors.error },
    dangerText: { color: colors.error },
    cycleBlock: {
      gap: 12,
    },
    cycleHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    counter: {
      minWidth: 40,
      color: colors.mutedForeground,
      fontSize: 11,
      fontVariant: ["tabular-nums"],
    },
    cycleDeck: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    cycleArrow: {
      width: 44,
      height: 44,
      flexShrink: 0,
      borderRadius: 15,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: subtleBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cycleValue: {
      flex: 1,
      minWidth: 0,
      minHeight: 72,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 18,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      backgroundColor: subtleBackground,
    },
    cycleValueText: {
      color: colors.foreground,
      fontSize: 15,
      lineHeight: 21,
    },
    cycleValueTextSmall: {
      color: colors.mutedForeground,
      fontSize: 10,
      lineHeight: 14,
    },
    fontSample: {
      color: colors.foreground,
      fontSize: 21,
      lineHeight: 29,
      textAlign: "center",
      writingDirection: "rtl",
    },
    cycleDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    flatList: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    actionRow: {
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 11,
    },
    accountIdentity: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingBottom: 4,
    },
    accountMark: {
      width: 42,
      height: 42,
      borderRadius: 15,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.foreground,
    },
    primaryAction: {
      minHeight: 50,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
      borderRadius: 16,
      borderCurve: "continuous",
      backgroundColor: colors.primary,
    },
    primaryActionText: {
      color: colors.onPrimary,
      fontSize: 14,
    },
    footerRule: {
      width: 36,
      height: 3,
      alignSelf: "center",
      borderRadius: 999,
      backgroundColor: colors.border,
    },
    footerText: {
      color: colors.mutedForeground,
      fontSize: 10,
      letterSpacing: 1.2,
    },
  });
};
