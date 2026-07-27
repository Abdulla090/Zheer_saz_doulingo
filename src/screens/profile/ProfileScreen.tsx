import {
  Award01Icon,
  BookOpen02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Edit01Icon,
  Fire02Icon,
  Layers01Icon,
  Settings01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image as ExpoImage } from "expo-image";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale } from "../../components/animations";
import { IOSPressable as TouchableOpacity } from "../../components/ui/ios-pressable";
import { AppText } from "../../components/ui/AppText";
import { BottomScrollFade } from "../../components/ui/BottomScrollFade";
import { getMascot } from "../../constants/mascots";
import { tabBarScrollPadding } from "../../constants/layout";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { supabase } from "../../lib/supabase";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { hapticSelection } from "../../utils/haptics";
import { crossShadow } from "../../utils/shadows";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function resolveAvatarMimeType(asset: ImagePicker.ImagePickerAsset): string | null {
  const declared = asset.mimeType?.toLowerCase() === "image/jpg"
    ? "image/jpeg"
    : asset.mimeType?.toLowerCase();
  if (declared && ALLOWED_AVATAR_MIME_TYPES.has(declared)) return declared;

  const extension = asset.uri.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  return null;
}

const CameraIcon = ({ size = 14, color = "#FFFFFF" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

type LocaleCode = "en" | "ku" | "ar";

type ScreenCopy = {
  title: string;
  settings: string;
  guestTitle: string;
  guestBody: string;
  signIn: string;
  student: string;
  editName: string;
  saveName: string;
  cancelEdit: string;
  namePlaceholder: string;
  uploadPhoto: string;
  useMyPet: string;
  progress: string;
  level: string;
  levelMessage: (remaining: number, next: number) => string;
  streak: string;
  totalXp: string;
  todayXp: string;
  paths: string;
  lessonsCompleted: (count: number) => string;
  active: string;
  achievements: string;
  unlocked: string;
  inProgress: string;
  recentActivity: string;
  lessonCompleted: string;
  gameCompleted: string;
  galleryPermission: string;
  invalidPhoto: string;
  uploadFailed: string;
};

const COPY: Record<LocaleCode, ScreenCopy> = {
  en: {
    title: "Profile",
    settings: "Open settings",
    guestTitle: "Keep your progress",
    guestBody: "Sign in to sync your XP, streak, and achievements across devices.",
    signIn: "Sign in",
    student: "Student",
    editName: "Edit name",
    saveName: "Save name",
    cancelEdit: "Cancel editing",
    namePlaceholder: "Enter your name",
    uploadPhoto: "Upload a photo",
    useMyPet: "Use my onboarding pet",
    progress: "Learning progress",
    level: "Level",
    levelMessage: (remaining, next) => `${remaining} XP to reach level ${next}`,
    streak: "Day streak",
    totalXp: "Total XP",
    todayXp: "Today",
    paths: "Learning paths",
    lessonsCompleted: (count) => `${count} lessons completed`,
    active: "Active",
    achievements: "Achievements",
    unlocked: "Unlocked",
    inProgress: "In progress",
    recentActivity: "Recent activity",
    lessonCompleted: "Lesson completed",
    gameCompleted: "Game completed",
    galleryPermission: "Gallery access permission is required.",
    invalidPhoto: "Choose a JPG, PNG, or WebP image smaller than 5 MB.",
    uploadFailed: "Failed to upload image",
  },
  ku: {
    title: "پڕۆفایل",
    settings: "کردنەوەی ڕێکخستنەکان",
    guestTitle: "پێشکەوتنەکەت بپارێزە",
    guestBody: "بچۆ ژوورەوە بۆ هاوکاتکردنی خاڵ، بەردەوامی و دەستکەوتەکانت لە نێوان ئامێرەکاندا.",
    signIn: "چوونەژوورەوە",
    student: "فێرخواز",
    editName: "دەستکاریکردنی ناو",
    saveName: "پاشەکەوتکردنی ناو",
    cancelEdit: "هەڵوەشاندنەوەی دەستکاری",
    namePlaceholder: "ناوەکەت بنووسە",
    uploadPhoto: "بارکردنی وێنە",
    useMyPet: "ئاژەڵە هەڵبژێردراوەکەم بەکاربهێنە",
    progress: "پێشکەوتنی فێربوون",
    level: "ئاست",
    levelMessage: (remaining, next) => `${remaining} خاڵ بۆ گەیشتن بە ئاستی ${next}`,
    streak: "بەردەوامی ڕۆژانە",
    totalXp: "کۆی خاڵ",
    todayXp: "ئەمڕۆ",
    paths: "ڕێڕەوەکانی فێربوون",
    lessonsCompleted: (count) => `${count} وانە تەواوکراوە`,
    active: "چالاک",
    achievements: "دەستکەوتەکان",
    unlocked: "کراوەتەوە",
    inProgress: "لە پێشکەوتندایە",
    recentActivity: "دوایین چالاکی",
    lessonCompleted: "وانە تەواوکراوە",
    gameCompleted: "یاری تەواوکراوە",
    galleryPermission: "مۆڵەتی دەستگەیشتن بە گالێری پێویستە.",
    invalidPhoto: "وێنەی JPG، PNG یان WebP هەڵبژێرە کە لە ٥ MB بچووکتر بێت.",
    uploadFailed: "بارکردنی وێنەکە سەرکەوتوو نەبوو",
  },
  ar: {
    title: "الملف الشخصي",
    settings: "فتح الإعدادات",
    guestTitle: "احتفظ بتقدمك",
    guestBody: "سجل الدخول لمزامنة نقاطك وسلسلة أيامك وإنجازاتك بين أجهزتك.",
    signIn: "تسجيل الدخول",
    student: "متعلم",
    editName: "تعديل الاسم",
    saveName: "حفظ الاسم",
    cancelEdit: "إلغاء التعديل",
    namePlaceholder: "اكتب اسمك",
    uploadPhoto: "رفع صورة",
    useMyPet: "استخدم حيواني المختار",
    progress: "تقدم التعلم",
    level: "المستوى",
    levelMessage: (remaining, next) => `${remaining} نقطة للوصول إلى المستوى ${next}`,
    streak: "سلسلة الأيام",
    totalXp: "مجموع النقاط",
    todayXp: "اليوم",
    paths: "مسارات التعلم",
    lessonsCompleted: (count) => `${count} دروس مكتملة`,
    active: "نشط",
    achievements: "الإنجازات",
    unlocked: "مفتوح",
    inProgress: "قيد التقدم",
    recentActivity: "النشاط الأخير",
    lessonCompleted: "اكتمل الدرس",
    gameCompleted: "اكتملت اللعبة",
    galleryPermission: "يلزم السماح بالوصول إلى معرض الصور.",
    invalidPhoto: "اختر صورة JPG أو PNG أو WebP أصغر من 5 ميغابايت.",
    uploadFailed: "تعذر رفع الصورة",
  },
};

function resolveLocale(locale: string): LocaleCode {
  if (locale === "ku" || locale === "ar") return locale;
  return "en";
}

function isUploadedAvatarUrl(value: string | null | undefined) {
  if (!value || /\.svg(?:[?#]|$)/i.test(value) || /\/premade\//i.test(value)) {
    return false;
  }
  return /^(https?:|file:|content:|data:|blob:)/i.test(value);
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, locale } = useI18n();
  const localeCode = resolveLocale(locale);
  const copy = COPY[localeCode];
  const isRtl = localeCode !== "en";
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const { user } = useAuth();

  const avatarUrl = useSettingsStore((state) => state.avatarUrl);
  const setAvatarUrl = useSettingsStore((state) => state.setAvatarUrl);
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const userName = useSettingsStore((state) => state.userName);
  const setUserName = useSettingsStore((state) => state.setUserName);
  const userAge = useSettingsStore((state) => state.userAge);
  const pathMode = useSettingsStore((state) => state.pathMode);

  const streakDays = useProgressStore((state) => state.streakDays);
  const totalXp = useProgressStore((state) => state.totalXp);
  const dailyXp = useProgressStore((state) => state.dailyXp);
  const lastActivity = useProgressStore((state) => state.lastActivity);
  const pathIndexes = useProgressStore((state) => state.pathIndexes);
  const normalPathIndexes = useProgressStore((state) => state.normalPathIndexes);
  const kidsPathIndexes = useProgressStore((state) => state.kidsPathIndexes);

  const sourceLanguage = useLocaleStore((state) => state.selectedSourceLanguage);
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);
  const languagePair = `${sourceLanguage}-${targetLanguage}`;

  const [uploading, setUploading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);

  const computedLevel = Math.max(1, Math.floor(totalXp / 120) + 1);
  const previousLevelXp = (computedLevel - 1) * 120;
  const nextLevelXp = computedLevel * 120;
  const levelProgress = Math.min(1, Math.max(0, (totalXp - previousLevelXp) / 120));
  const remainingXp = Math.max(0, nextLevelXp - totalXp);

  const pathLabel = useMemo(() => {
    if (pathMode === "normal") return t("home.normalPath") || "Normal English";
    if (pathMode === "kids") return t("home.kidsPath") || "Kids English";
    return t("home.streetPath") || "Street English";
  }, [pathMode, t]);

  const paths = useMemo(
    () => [
      {
        id: "street",
        title:
          localeCode === "ku"
            ? "ڕێڕەوی ئینگلیزیی شەقام"
            : localeCode === "ar"
              ? "مسار الإنجليزية اليومية"
              : "Street English",
        lessons: pathIndexes[languagePair] || 0,
        icon: Fire02Icon,
      },
      {
        id: "normal",
        title:
          localeCode === "ku"
            ? "ئینگلیزیی ئاسایی"
            : localeCode === "ar"
              ? "الإنجليزية الأساسية"
              : "Classic English",
        lessons: normalPathIndexes[languagePair] || 0,
        icon: Layers01Icon,
      },
      {
        id: "kids",
        title:
          localeCode === "ku"
            ? "ئینگلیزیی منداڵان"
            : localeCode === "ar"
              ? "الإنجليزية للأطفال"
              : "Kids English",
        lessons: kidsPathIndexes[languagePair] || 0,
        icon: Award01Icon,
      },
    ],
    [kidsPathIndexes, languagePair, localeCode, normalPathIndexes, pathIndexes],
  );

  const achievements = useMemo(
    () => [
      {
        id: "streak_master",
        title: localeCode === "ku" ? "بەردەوام" : localeCode === "ar" ? "مواظب" : "Consistent",
        description:
          localeCode === "ku"
            ? "٣ ڕۆژ بەردەوام فێربە"
            : localeCode === "ar"
              ? "تعلم لثلاثة أيام متتالية"
              : "Learn for 3 days in a row",
        hint:
          localeCode === "ku"
            ? "سێ ڕۆژ بەردەوام وانە تەواو بکە."
            : localeCode === "ar"
              ? "أكمل درساً يومياً لمدة ثلاثة أيام متتالية."
              : "Complete a lesson on three consecutive days.",
        unlocked: streakDays >= 3,
        icon: Fire02Icon,
      },
      {
        id: "xp_champion",
        title: localeCode === "ku" ? "خاڵکۆکەرەوە" : localeCode === "ar" ? "جامع النقاط" : "XP Collector",
        description:
          localeCode === "ku"
            ? "١٥٠ خاڵ کۆبکەرەوە"
            : localeCode === "ar"
              ? "اجمع 150 نقطة"
              : "Earn 150 total XP",
        hint:
          localeCode === "ku"
            ? "لە وانە، گفتوگۆ و یارییەکاندا ١٥٠ خاڵ کۆبکەرەوە."
            : localeCode === "ar"
              ? "اجمع 150 نقطة من الدروس والمحادثات والألعاب."
              : "Collect 150 XP from lessons, conversations, and games.",
        unlocked: totalXp >= 150,
        icon: Shield01Icon,
      },
      {
        id: "level_up",
        title: localeCode === "ku" ? "ئاست بەرزکراوە" : localeCode === "ar" ? "تقدم المستوى" : "Level Up",
        description:
          localeCode === "ku"
            ? "بگە بە ئاستی ٢"
            : localeCode === "ar"
              ? "صل إلى المستوى الثاني"
              : "Reach learning level 2",
        hint:
          localeCode === "ku"
            ? "خاڵ کۆبکەرەوە و بگە بە ئاستی دوو."
            : localeCode === "ar"
              ? "اجمع النقاط حتى تصل إلى المستوى الثاني."
              : "Earn enough XP to advance to level 2.",
        unlocked: computedLevel >= 2,
        icon: Award01Icon,
      },
      {
        id: "first_activity",
        title: localeCode === "ku" ? "دەستپێک" : localeCode === "ar" ? "البداية" : "First Step",
        description:
          localeCode === "ku"
            ? "یەکەم چالاکی تەواو بکە"
            : localeCode === "ar"
              ? "أكمل أول نشاط تعليمي"
              : "Complete your first activity",
        hint:
          localeCode === "ku"
            ? "یەکەم وانە یان یاریی خۆت تەواو بکە."
            : localeCode === "ar"
              ? "أكمل أول درس أو لعبة تعليمية."
              : "Finish your first lesson or learning game.",
        unlocked: totalXp > 0,
        icon: BookOpen02Icon,
      },
    ],
    [computedLevel, localeCode, streakDays, totalXp],
  );

  const handleDeviceUpload = async () => {
    try {
      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          if (permission.canAskAgain === false) {
            Alert.alert(copy.galleryPermission, undefined, [
              { text: copy.settings, onPress: () => void Linking.openSettings() },
            ]);
          } else {
            Alert.alert(copy.galleryPermission);
          }
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const selectedUri = asset.uri;
      const contentType = resolveAvatarMimeType(asset);
      if (
        !contentType ||
        (typeof asset.fileSize === "number" && asset.fileSize > MAX_AVATAR_BYTES)
      ) {
        alert(copy.invalidPhoto);
        return;
      }
      setUploading(true);

      if (!user) {
        setAvatarUrl(selectedUri);
        hapticSelection();
        return;
      }

      // Supabase's React Native client does not reliably upload Blob/File.
      // Expo File gives Storage the ArrayBuffer it expects on native.
      const fileData =
        Platform.OS === "web"
          ? await (await fetch(selectedUri)).arrayBuffer()
          : await new File(selectedUri).arrayBuffer();
      if (fileData.byteLength > MAX_AVATAR_BYTES) {
        alert(copy.invalidPhoto);
        return;
      }

      // One deterministic object per user prevents abandoned uploads and makes
      // the Storage ownership policy exact and auditable.
      const filePath = `${user.id}/avatar`;
      const { error } = await supabase.storage.from("avatars").upload(filePath, fileData, {
        contentType,
        upsert: true,
      });

      if (error) throw error;
      const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
      if (profileError) throw profileError;

      setAvatarUrl(`${publicUrl}?v=${Date.now()}`);
      hapticSelection();
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert(copy.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const useOnboardingPet = async () => {
    try {
      setUploading(true);
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: null, selected_mascot_id: selectedMascotId })
          .eq("id", user.id);
        if (error) throw error;

        const { error: storageError } = await supabase.storage
          .from("avatars")
          .remove([`${user.id}/avatar`]);
        if (storageError && !/not found/i.test(storageError.message)) {
          console.warn("Could not remove previous avatar object:", storageError.message);
        }
      }
      setAvatarUrl("");
      hapticSelection();
    } catch (error) {
      console.error("Avatar reset error:", error);
      alert(copy.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const renderAvatar = (size = 84) => {
    if (uploading) {
      return (
        <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      );
    }

    if (isUploadedAvatarUrl(avatarUrl)) {
      return (
        <ExpoImage
          source={{ uri: avatarUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          transition={180}
        />
      );
    }

    const mascot = getMascot(selectedMascotId);
    return (
      <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
        <ExpoImage
          source={mascot.source}
          style={{ width: size - 8, height: size - 8 }}
          contentFit="contain"
          transition={180}
        />
      </View>
    );
  };

  const saveName = () => {
    const nextName = nameInput.trim();
    if (!nextName) return;
    setUserName(nextName);
    setIsEditingName(false);
    hapticSelection();
  };

  const cancelNameEdit = () => {
    setNameInput(userName);
    setIsEditingName(false);
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.header,
          isRtl && styles.headerRtl,
          { paddingTop: Math.max(insets.top, 20) },
        ]}
      >
        <AppText style={styles.headerTitle} languageCode={locale} align="start" latinRole="bold">
          {copy.title}
        </AppText>
        <PressableScale
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel={copy.settings}
          scaleDown={0.94}
        >
          <HugeiconsIcon icon={Settings01Icon} size={21} color={colors.foreground} strokeWidth={2.2} />
        </PressableScale>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarScrollPadding(insets.bottom) + 28 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!user ? (
          <View style={[styles.guestStrip, isRtl && styles.rowRtl]}>
            <View style={styles.guestCopy}>
              <AppText style={styles.guestTitle} languageCode={locale} align="start" latinRole="bold">
                {copy.guestTitle}
              </AppText>
              <AppText style={styles.guestBody} languageCode={locale} align="start">
                {copy.guestBody}
              </AppText>
            </View>
            <PressableScale
              style={styles.signInButton}
              onPress={() => router.push("/auth")}
              accessibilityRole="button"
              accessibilityLabel={copy.signIn}
              scaleDown={0.96}
            >
              <AppText style={styles.signInText} languageCode={locale} align="center" latinRole="bold">
                {copy.signIn}
              </AppText>
            </PressableScale>
          </View>
        ) : null}

        <View style={[styles.identitySection, isRtl && styles.rowRtl]}>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={handleDeviceUpload}
            style={styles.avatarButton}
            accessibilityRole="button"
            accessibilityLabel={copy.uploadPhoto}
          >
            {renderAvatar()}
            <View style={styles.cameraBadge}>
              <CameraIcon size={12} />
            </View>
          </TouchableOpacity>

          <View style={styles.identityCopy}>
            {isEditingName ? (
              <View style={[styles.nameEditRow, isRtl && styles.rowRtl]}>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder={copy.namePlaceholder}
                  placeholderTextColor={colors.mutedForeground}
                  maxLength={28}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={saveName}
                  style={[styles.nameInput, isRtl && styles.textInputRtl]}
                />
                <TouchableOpacity
                  onPress={saveName}
                  style={styles.compactAction}
                  accessibilityRole="button"
                  accessibilityLabel={copy.saveName}
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={19} color={colors.success} strokeWidth={2.4} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelNameEdit}
                  style={styles.compactAction}
                  accessibilityRole="button"
                  accessibilityLabel={copy.cancelEdit}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={19} color={colors.mutedForeground} strokeWidth={2.4} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.nameRow, isRtl && styles.rowRtl]}>
                <AppText style={styles.name} languageCode={locale} align="start" latinRole="bold">
                  {userName || copy.student}
                </AppText>
                <TouchableOpacity
                  onPress={() => {
                    setNameInput(userName);
                    setIsEditingName(true);
                  }}
                  style={styles.editNameButton}
                  accessibilityRole="button"
                  accessibilityLabel={copy.editName}
                >
                  <HugeiconsIcon icon={Edit01Icon} size={16} color={colors.mutedForeground} strokeWidth={2.2} />
                </TouchableOpacity>
              </View>
            )}

            {user?.email ? (
              <AppText style={styles.email} languageCode="en" align={isRtl ? "end" : "start"} selectable>
                {user.email}
              </AppText>
            ) : null}
            <View style={[styles.metadataRow, isRtl && styles.rowRtl]}>
              <AppText style={styles.pathLabel} languageCode={locale} align="start" latinRole="bold">
                {pathLabel}
              </AppText>
              {userAge ? <View style={styles.metadataDot} /> : null}
              {userAge ? (
                <AppText style={styles.ageLabel} languageCode={locale} align="start">
                  {localeCode === "ku"
                    ? `${userAge} ساڵ`
                    : localeCode === "ar"
                      ? `${userAge} سنة`
                      : `${userAge} years old`}
                </AppText>
              ) : null}
            </View>
          </View>
        </View>

        <View style={[styles.photoActions, isRtl && styles.rowRtl]}>
          <PressableScale
            style={styles.photoAction}
            onPress={handleDeviceUpload}
            accessibilityRole="button"
            accessibilityLabel={copy.uploadPhoto}
            scaleDown={0.96}
          >
            <CameraIcon size={16} color={colors.foreground} />
            <AppText style={styles.photoActionText} languageCode={locale} align="center" latinRole="bold">
              {copy.uploadPhoto}
            </AppText>
          </PressableScale>
          {isUploadedAvatarUrl(avatarUrl) ? (
            <PressableScale
              style={styles.photoAction}
              onPress={useOnboardingPet}
              accessibilityRole="button"
              accessibilityLabel={copy.useMyPet}
              scaleDown={0.96}
            >
              <AppText style={styles.photoActionText} languageCode={locale} align="center" latinRole="bold">
                {copy.useMyPet}
              </AppText>
            </PressableScale>
          ) : null}
        </View>

        <View style={styles.progressPanel}>
          <View style={[styles.progressHeader, isRtl && styles.rowRtl]}>
            <View style={styles.progressHeadingWrap}>
              <AppText style={styles.progressEyebrow} languageCode={locale} align="start" latinRole="bold">
                {copy.progress}
              </AppText>
              <AppText style={styles.progressMessage} languageCode={locale} align="start">
                {copy.levelMessage(remainingXp, computedLevel + 1)}
              </AppText>
            </View>
            <View style={styles.levelBadge}>
              <AppText style={styles.levelNumber} languageCode="en" align="center" latinRole="bold">
                {computedLevel}
              </AppText>
              <AppText style={styles.levelCaption} languageCode={locale} align="center" latinRole="bold">
                {copy.level}
              </AppText>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(4, levelProgress * 100)}%` }]} />
          </View>
          <AppText style={styles.progressNumbers} languageCode="en" align="start" latinRole="bold">
            {totalXp} / {nextLevelXp} XP
          </AppText>

          <View style={[styles.statsRow, isRtl && styles.rowRtl]}>
            {[
              { value: streakDays, label: copy.streak },
              { value: totalXp, label: copy.totalXp },
              { value: dailyXp, label: copy.todayXp },
            ].map((stat, index) => (
              <View key={stat.label} style={[styles.stat, index > 0 && styles.statDivider]}>
                <AppText style={styles.statValue} languageCode="en" align="center" latinRole="bold">
                  {stat.value}
                </AppText>
                <AppText style={styles.statLabel} languageCode={locale} align="center">
                  {stat.label}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle} languageCode={locale} align="start" latinRole="bold">
            {copy.paths}
          </AppText>
          <View style={styles.groupedList}>
            {paths.map((path, index) => (
              <View
                key={path.id}
                style={[
                  styles.listRow,
                  isRtl && styles.rowRtl,
                  index < paths.length - 1 && styles.rowDivider,
                ]}
              >
                <View style={[styles.rowIcon, pathMode === path.id && styles.rowIconActive]}>
                  <HugeiconsIcon
                    icon={path.icon}
                    size={20}
                    color={pathMode === path.id ? colors.primary : colors.mutedForeground}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={styles.rowCopy}>
                  <AppText style={styles.rowTitle} languageCode={locale} align="start" latinRole="bold">
                    {path.title}
                  </AppText>
                  <AppText style={styles.rowDescription} languageCode={locale} align="start">
                    {copy.lessonsCompleted(path.lessons)}
                  </AppText>
                </View>
                {pathMode === path.id ? (
                  <AppText style={styles.activeLabel} languageCode={locale} align="center" latinRole="bold">
                    {copy.active}
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle} languageCode={locale} align="start" latinRole="bold">
            {copy.achievements}
          </AppText>
          <View style={styles.groupedList}>
            {achievements.map((achievement, index) => {
              const selected = selectedAchievementId === achievement.id;
              return (
                <View key={achievement.id} style={index < achievements.length - 1 && styles.rowDivider}>
                  <PressableScale
                    style={[styles.listRow, isRtl && styles.rowRtl]}
                    onPress={() => setSelectedAchievementId(selected ? null : achievement.id)}
                    accessibilityRole="button"
                    accessibilityLabel={achievement.title}
                    scaleDown={0.985}
                  >
                    <View style={[styles.rowIcon, achievement.unlocked && styles.achievementUnlocked]}>
                      <HugeiconsIcon
                        icon={achievement.icon}
                        size={20}
                        color={achievement.unlocked ? colors.primary : colors.mutedForeground}
                        strokeWidth={2.2}
                      />
                    </View>
                    <View style={styles.rowCopy}>
                      <AppText style={styles.rowTitle} languageCode={locale} align="start" latinRole="bold">
                        {achievement.title}
                      </AppText>
                      <AppText style={styles.rowDescription} languageCode={locale} align="start">
                        {achievement.description}
                      </AppText>
                    </View>
                    <View style={[styles.statusDot, achievement.unlocked && styles.statusDotUnlocked]} />
                  </PressableScale>
                  {selected ? (
                    <View style={styles.achievementDetail}>
                      <AppText style={styles.detailText} languageCode={locale} align="start">
                        {achievement.hint}
                      </AppText>
                      <AppText
                        style={[styles.detailStatus, achievement.unlocked && styles.detailStatusUnlocked]}
                        languageCode={locale}
                        align="start"
                        latinRole="bold"
                      >
                        {achievement.unlocked ? copy.unlocked : copy.inProgress}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        {lastActivity ? (
          <View style={styles.section}>
            <AppText style={styles.sectionTitle} languageCode={locale} align="start" latinRole="bold">
              {copy.recentActivity}
            </AppText>
            <View style={[styles.activityRow, isRtl && styles.rowRtl]}>
              <View style={styles.activityIcon}>
                <HugeiconsIcon icon={BookOpen02Icon} size={20} color={colors.foreground} strokeWidth={2.2} />
              </View>
              <View style={styles.rowCopy}>
                <AppText style={styles.rowTitle} languageCode={locale} align="start" latinRole="bold">
                  {lastActivity.kind === "lesson" ? copy.lessonCompleted : copy.gameCompleted}
                </AppText>
                <AppText style={styles.rowDescription} languageCode={locale} align="start">
                  {lastActivity.label}
                </AppText>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <BottomScrollFade />
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  const surface = isDark ? "rgba(255,255,255,0.045)" : "#FFFFFF";
  const softSurface = isDark ? "rgba(255,255,255,0.06)" : "#F4F6F8";
  const panel = isDark ? "#18243A" : "#172033";
  const panelMuted = isDark ? "#A9B5C9" : "#B8C2D3";

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: colors.background,
    },
    headerRtl: {
      flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    },
    headerTitle: {
      fontSize: 28,
      lineHeight: 34,
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    settingsButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: softSurface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      gap: 28,
    },
    rowRtl: {
      flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    },
    guestStrip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      padding: 16,
      borderRadius: 18,
      borderCurve: "continuous",
      backgroundColor: isDark ? "rgba(255,107,74,0.12)" : "#FFF1EC",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,107,74,0.24)" : "#FFD8CE",
    },
    guestCopy: {
      flex: 1,
      gap: 3,
    },
    guestTitle: {
      fontSize: 15,
      color: colors.foreground,
    },
    guestBody: {
      fontSize: 12,
      lineHeight: 17,
      color: colors.mutedForeground,
    },
    signInButton: {
      minWidth: 84,
      minHeight: 44,
      paddingHorizontal: 15,
      borderRadius: 14,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },
    signInText: {
      color: "#FFFFFF",
      fontSize: 13,
    },
    identitySection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
      paddingVertical: 6,
    },
    avatarButton: {
      width: 88,
      height: 88,
      position: "relative",
    },
    avatarFallback: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: panel,
    },
    cameraBadge: {
      position: "absolute",
      right: -1,
      bottom: -1,
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderWidth: 3,
      borderColor: colors.background,
    },
    identityCopy: {
      flex: 1,
      minWidth: 0,
      gap: 5,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    name: {
      flexShrink: 1,
      fontSize: 24,
      lineHeight: 29,
      color: colors.foreground,
      letterSpacing: -0.4,
    },
    editNameButton: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    email: {
      fontSize: 13,
      color: colors.mutedForeground,
    },
    metadataRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 7,
    },
    pathLabel: {
      fontSize: 12,
      color: colors.primary,
    },
    metadataDot: {
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.mutedForeground,
    },
    ageLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    nameEditRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    nameInput: {
      flex: 1,
      minWidth: 0,
      height: 44,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderCurve: "continuous",
      backgroundColor: softSurface,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.foreground,
      fontSize: 15,
      fontFamily: "DINNextRoundedMedium",
    },
    textInputRtl: {
      textAlign: "right",
      writingDirection: "rtl",
    },
    compactAction: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: softSurface,
    },
    photoActions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    photoAction: {
      minHeight: 44,
      paddingHorizontal: 15,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      backgroundColor: surface,
    },
    photoActionText: {
      color: colors.foreground,
      fontSize: 13,
    },
    progressPanel: {
      padding: 20,
      borderRadius: 24,
      borderCurve: "continuous",
      backgroundColor: panel,
      ...crossShadow({ color: "#111827", offsetY: 8, blur: 22, opacity: isDark ? 0.18 : 0.13, elevation: 4 }),
    },
    progressHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
    },
    progressHeadingWrap: {
      flex: 1,
      gap: 4,
    },
    progressEyebrow: {
      fontSize: 17,
      color: "#FFFFFF",
    },
    progressMessage: {
      fontSize: 12,
      lineHeight: 17,
      color: panelMuted,
    },
    levelBadge: {
      minWidth: 58,
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 14,
      borderCurve: "continuous",
      backgroundColor: "rgba(255,255,255,0.09)",
    },
    levelNumber: {
      fontSize: 22,
      lineHeight: 25,
      color: "#FFFFFF",
      fontVariant: ["tabular-nums"],
    },
    levelCaption: {
      fontSize: 11,
      color: panelMuted,
    },
    progressTrack: {
      height: 7,
      marginTop: 18,
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "rgba(255,255,255,0.11)",
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    progressNumbers: {
      marginTop: 7,
      fontSize: 11,
      color: panelMuted,
      fontVariant: ["tabular-nums"],
    },
    statsRow: {
      flexDirection: "row",
      marginTop: 18,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "rgba(255,255,255,0.1)",
    },
    stat: {
      flex: 1,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      gap: 2,
    },
    statDivider: {
      borderLeftWidth: 1,
      borderLeftColor: "rgba(255,255,255,0.1)",
    },
    statValue: {
      fontSize: 19,
      color: "#FFFFFF",
      fontVariant: ["tabular-nums"],
    },
    statLabel: {
      fontSize: 11,
      color: panelMuted,
    },
    section: {
      gap: 11,
    },
    sectionTitle: {
      fontSize: 18,
      color: colors.foreground,
      letterSpacing: -0.2,
    },
    groupedList: {
      overflow: "hidden",
      borderRadius: 20,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: surface,
    },
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 74,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 12,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: softSurface,
    },
    rowIconActive: {
      backgroundColor: isDark ? "rgba(255,107,74,0.13)" : "#FFF1EC",
    },
    achievementUnlocked: {
      backgroundColor: isDark ? "rgba(255,107,74,0.13)" : "#FFF1EC",
    },
    rowCopy: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    rowTitle: {
      fontSize: 14,
      color: colors.foreground,
    },
    rowDescription: {
      fontSize: 12,
      lineHeight: 17,
      color: colors.mutedForeground,
    },
    activeLabel: {
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 9,
      overflow: "hidden",
      backgroundColor: isDark ? "rgba(255,107,74,0.13)" : "#FFF1EC",
      color: colors.primary,
      fontSize: 11,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    statusDotUnlocked: {
      backgroundColor: colors.success,
    },
    achievementDetail: {
      gap: 8,
      paddingHorizontal: 68,
      paddingTop: 2,
      paddingBottom: 14,
    },
    detailText: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.mutedForeground,
    },
    detailStatus: {
      fontSize: 11,
      color: colors.mutedForeground,
    },
    detailStatusUnlocked: {
      color: colors.success,
    },
    activityRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 18,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: surface,
    },
    activityIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: softSurface,
    },
  });
}
