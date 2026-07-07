/* eslint-disable */
import { PressableScale } from "../../components/animations";
import { GsapEnterBlock } from "../../components/animations/skia-gsap-opening";
import {
  Icon3DCheckCircle,
  Icon3DChevronRight,
  Icon3DSettings,
} from "../../components/icons/Icon3D";
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
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

function IosSwitch({
  value,
  onValueChange,
  activeColor = "#34C759",
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
  activeColor?: string;
}) {
  const t = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    t.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value]);

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      t.value,
      [0, 1],
      ["#E5E5EA", activeColor]
    );
    return {
      backgroundColor,
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: t.value * 20,
        },
      ],
    };
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <Animated.View
        style={[
          {
            width: 51,
            height: 31,
            borderRadius: 16,
            padding: 2,
            justifyContent: "center",
          },
          animatedTrackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: 27,
              height: 27,
              borderRadius: 13.5,
              backgroundColor: "#FFFFFF",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                },
                android: {
                  elevation: 2,
                },
                web: {
                  boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
                },
              }),
            },
            animatedThumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

export default function SettingsScreen({ isKidsMode = false }: { isKidsMode?: boolean }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale, setLocale, isKu } = useI18n();
  const { user, signOut } = useAuth();
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

  const [apiKeyInput, setApiKeyInput] = React.useState("");

  React.useEffect(() => {
    if (Platform.OS !== "web") {
      try {
        const SecureStore = require("expo-secure-store");
        SecureStore.getItemAsync("twino.gemini.apikey")
          .then((key: string | null) => {
            if (key) setApiKeyInput(key);
          })
          .catch(() => {});
      } catch {}
    } else {
      try {
        if (typeof localStorage !== "undefined") {
          const key = localStorage.getItem("twino.gemini.apikey");
          if (key) setApiKeyInput(key);
        }
      } catch {}
    }
  }, []);

  const saveApiKey = async () => {
    try {
      const { setRuntimeGeminiApiKey } = require("../../constants/gemini");
      const keyToSave = apiKeyInput.trim();

      if (Platform.OS !== "web") {
        const SecureStore = require("expo-secure-store");
        if (keyToSave) {
          await SecureStore.setItemAsync("twino.gemini.apikey", keyToSave);
        } else {
          await SecureStore.deleteItemAsync("twino.gemini.apikey");
        }
      } else {
        if (typeof localStorage !== "undefined") {
          if (keyToSave) {
            localStorage.setItem("twino.gemini.apikey", keyToSave);
          } else {
            localStorage.removeItem("twino.gemini.apikey");
          }
        }
      }

      setRuntimeGeminiApiKey(keyToSave || undefined);

      Alert.alert(
        isKu ? "سەرکەوتوو بوو" : "Success",
        isKu
          ? "کلیلی API بە سەرکەوتوویی پاشەکەوت کرا."
          : "API Key updated successfully.",
      );
    } catch (err) {
      Alert.alert(
        isKu ? "کێشەیەک ڕوویدا" : "Error",
        isKu ? "پاشەکەوتکردن سەرکەوتوو نەبوو." : "Failed to update API key.",
      );
    }
  };

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
            { flexDirection: isKu ? "row-reverse" : "row" },
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
              router.back();
            }}
            scaleDown={0.9}
            style={styles.backButton}
          >
            <HugeiconsIcon
              icon={isKu ? ArrowRight01Icon : ArrowLeft01Icon}
              size={22}
              color={colors.foreground}
              strokeWidth={2.5}
            />
          </PressableScale>

          <Icon3DSettings size={28} />
          <View
            style={{ flex: 1, alignItems: isKu ? "flex-end" : "flex-start" }}
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
                      { flexDirection: isKu ? "row-reverse" : "row" },
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
                      <Icon3DCheckCircle size={22} />
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
                      { flexDirection: isKu ? "row-reverse" : "row" },
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
                      <Icon3DCheckCircle size={22} />
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
                      { flexDirection: isKu ? "row-reverse" : "row" },
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
                      <Icon3DCheckCircle size={22} />
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
                  { flexDirection: isKu ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
                  {t("settings.haptics")}
                </AppText>
                <IosSwitch
                  value={haptics}
                  onValueChange={setHaptics}
                  activeColor={colors.primary}
                />
              </View>
              <View
                style={[
                  styles.toggleRow,
                  styles.toggleRowLast,
                  { flexDirection: isKu ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
                  {t("settings.sounds")}
                </AppText>
                <IosSwitch
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
                  { flexDirection: isKu ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
                  {t("settings.kidsArabic")}
                </AppText>
                <IosSwitch
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
                      { flexDirection: isKu ? "row-reverse" : "row" },
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
                      <Icon3DCheckCircle size={22} />
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
                      { flexDirection: isKu ? "row-reverse" : "row" },
                      index < ALL_RABAR_FONTS.length - 1 && styles.rowBorder,
                      selected && styles.fontRowSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.fontRowLeft,
                        { flexDirection: isKu ? "row-reverse" : "row" },
                      ]}
                    >
                      {selected ? (
                        <Icon3DCheckCircle size={22} />
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
                    <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
                      <Icon3DChevronRight size={20} />
                    </View>
                  </PressableScale>
                );
              })}
            </View>

            {!isKidsMode && (
              <>
                <AppText
                  style={[styles.sectionLabel, styles.sectionSpaced]}
                  forceKurdishFont={isKu}
                >
                  {isKu ? "مفتاحی Gemini API" : "Gemini API Key"}
                </AppText>
                <AppText style={styles.sectionHint} forceKurdishFont={isKu}>
                  {Platform.OS === "web"
                    ? (isKu
                        ? "کلیلەکەت لە بیرگەی ناوخۆیی وێبگەڕەکەتدا پاشەکەوت دەکرێت."
                        : "Your key is stored in your browser's local storage.")
                    : (isKu
                        ? "کلیلەکەت بە شێوەیەکی پارێزراو لەسەر مۆبایلەکەت پاشەکەوت دەکرێت."
                        : "Your key is stored securely in the device's native Keychain/Keystore.")}
                </AppText>
                <View style={[styles.card, { padding: 16, gap: 12 }]}>
                  <TextInput
                    secureTextEntry
                    placeholder={
                      isKu ? "کلیلەکە لێرە بنووسە..." : "Enter Gemini API key..."
                    }
                    placeholderTextColor={colors.mutedForeground}
                    value={apiKeyInput}
                    onChangeText={setApiKeyInput}
                    style={[styles.inputField, isKu && { textAlign: "right" }]}
                  />
                  <PressableScale
                    onPress={saveApiKey}
                    scaleDown={0.98}
                    style={styles.saveBtn}
                  >
                    <AppText style={styles.saveBtnText} forceKurdishFont={isKu}>
                      {isKu ? "پاشەکەوتکردن" : "Save Key"}
                    </AppText>
                  </PressableScale>
                </View>
              </>
            )}

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
                      flexDirection: isKu ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <AppText style={styles.rowLabel} forceLatinFont>
                    Open admin panel
                  </AppText>
                  <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
                    <Icon3DChevronRight size={20} />
                  </View>
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
                  { marginTop: 0, flexDirection: isKu ? "row-reverse" : "row" },
                ]}
              >
                <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
                  {isKu ? "سیاسەت (وێب)" : "Privacy (web)"}
                </AppText>
                <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
                  <Icon3DChevronRight size={20} />
                </View>
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
                    { flexDirection: isKu ? "row-reverse" : "row" },
                    index < LEGAL_LINKS.length - 1 && styles.rowBorder,
                  ]}
                >
                  <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
                    {t(link.labelKey)}
                  </AppText>
                  <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
                    <Icon3DChevronRight size={20} />
                  </View>
                </PressableScale>
              ))}
            </View>

            <PressableScale
              onPress={() => void openMailto(SUPPORT_EMAIL)}
              scaleDown={0.98}
              style={[
                styles.supportRow,
                styles.card,
                { flexDirection: isKu ? "row-reverse" : "row" },
              ]}
            >
              <View style={{ alignItems: isKu ? "flex-end" : "flex-start" }}>
                <AppText style={styles.rowLabel} forceKurdishFont={isKu}>
                  {t("settings.support")}
                </AppText>
                <Text
                  style={[
                    styles.supportEmail,
                    { textAlign: isKu ? "right" : "left" },
                  ]}
                >
                  {SUPPORT_EMAIL}
                </Text>
              </View>
              <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
                <Icon3DChevronRight size={20} />
              </View>
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
                  <PressableScale
                    onPress={() => {
                      confirmAction(
                        isKu ? "چوونەدەرەوە" : "Sign Out",
                        isKu ? "دڵنیای لە چوونەدەرەوە لە ئەکاونتەکەت؟" : "Are you sure you want to sign out?",
                        async () => {
                          await signOut();
                          router.replace("/more");
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
      width: 40,
      height: 40,
      borderRadius: 20,
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
