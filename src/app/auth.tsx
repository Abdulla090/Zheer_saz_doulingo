import { AppText } from "../components/ui/AppText";
import { IOSPressable as TouchableOpacity } from "../components/ui/ios-pressable";
import { useI18n } from "../hooks/useI18n";
import { supabase } from "../lib/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFontStore } from "../stores/useFontStore";
import { useThemeColors } from "../hooks/useThemeColors";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { redirect, showSkip } = useLocalSearchParams<{ redirect?: string; showSkip?: string }>();
  const { locale, isKu } = useI18n();
  const isRtl = isKu || locale === "ar";
  const { selectedFont } = useFontStore();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const showModal = (title: string, desc: string, type: "success" | "error" = "success") => {
    setModalTitle(title);
    setModalDesc(desc);
    setModalType(type);
    setModalVisible(true);
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage(isKu ? "تكایە ئیمەیڵ و تێپەڕەوشە بنووسە" : "Please fill in all required fields");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage(isKu ? "ناونیشانی ئیمەیڵەکە ڕاست نییە" : "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setErrorMessage(isKu ? "تێپەڕەوشە دەبێت بەلایەنی کەمەوە ٦ پیت بێت" : "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        if (!username || !displayName) {
          setErrorMessage(isKu ? "تكایە ناوی بەکارهێنەر و ناوی پیشاندان بنووسە" : "Please fill in username and display name");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.toLowerCase().trim(),
              display_name: displayName.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          showModal(
            isKu ? "تۆماربوون سەرکەوتوو بوو!" : "Registration Successful!",
            isKu ? "ئەکاونتەکەت دروستکرا و بە سەرکەوتوویی چوویە ژوورەوە." : "Your account was successfully created and you are now signed in.",
            "success"
          );
          setTimeout(() => router.replace((redirect as any) || "/more"), 1500);
        } else {
          showModal(
            isKu ? "تۆماربوون سەرکەوتوو بوو!" : "Account Created!",
            isKu ? "تکایە سەیری ئیمەیڵەکەت بکە بۆ چالاککردنی ئەکاونتەکەت." : "Please check your inbox to confirm your email before logging in.",
            "success"
          );
          setEmail("");
          setPassword("");
          setUsername("");
          setDisplayName("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        showModal(
          isKu ? "چوونەژوورەوە سەرکەوتوو بوو!" : "Welcome Back!",
          isKu ? "بە سەرکەوتوویی چوویە ژوورەوە." : "You have logged in successfully.",
          "success"
        );
        setTimeout(() => router.replace((redirect as any) || "/more"), 1000);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errMsg = err.message || (isKu ? "هەڵەیەک ڕوویدا" : "An unexpected error occurred");
      setErrorMessage(errMsg);
      showModal(
        isKu ? "هەڵەیەک ڕوویدا" : "Authentication Error",
        errMsg,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 80,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 24,
            justifyContent: "center",
          }}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={[
              styles.backBtn,
              { top: insets.top + 16 },
              isRtl ? { right: 20, left: "auto" } : { left: 20, right: "auto" },
            ]}
            onPress={() => router.back()}
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={20}
              color={colors.foreground}
              strokeWidth={2.5}
              style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}
            />
          </TouchableOpacity>

          <View style={styles.shadcnContainer}>
            <View style={styles.shadcnHeader}>
              <AppText style={styles.shadcnTitle} forceLatinFont latinRole="bold">
                {isSignUp ? (isKu ? "تۆمارکردنی ئەکاونت" : "Create an account") : (isKu ? "چوونە ژوورەوە" : "Welcome back")}
              </AppText>
              <AppText style={styles.shadcnSubTitle}>
                {isSignUp
                  ? (isKu ? "زانیارییەکانت بنووسە بۆ دروستکردنی ئەکاونتی نوێ" : "Enter your details to create your learning account")
                  : (isKu ? "ناونیشانی ئیمەیڵ و تێپەڕەوشەکەت بنووسە بۆ چوونەژوورەوە" : "Enter your email and password to access your profile")}
              </AppText>
            </View>

            {/* Tabs */}
            <View style={[styles.shadcnTabsContainer, isKu && { flexDirection: "row-reverse" }]}>
              <TouchableOpacity
                style={[styles.shadcnTab, !isSignUp && styles.shadcnActiveTab]}
                onPress={() => {
                  setIsSignUp(false);
                  setErrorMessage(null);
                }}
              >
                <AppText
                  style={[styles.shadcnTabText, !isSignUp && styles.shadcnActiveTabText]}
                  forceLatinFont
                  latinRole="bold"
                >
                  {isKu ? "چوونەژوورەوە" : "Sign In"}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shadcnTab, isSignUp && styles.shadcnActiveTab]}
                onPress={() => {
                  setIsSignUp(true);
                  setErrorMessage(null);
                }}
              >
                <AppText
                  style={[styles.shadcnTabText, isSignUp && styles.shadcnActiveTabText]}
                  forceLatinFont
                  latinRole="bold"
                >
                  {isKu ? "تۆماربوون" : "Sign Up"}
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Error Alert */}
            {errorMessage && (
              <View style={[styles.shadcnAlertError, isKu && { flexDirection: "row-reverse" }]}>
                <HugeiconsIcon icon={AlertCircleIcon} size={16} color={colors.error} strokeWidth={2.5} />
                <AppText style={styles.shadcnAlertErrorText}>{errorMessage}</AppText>
              </View>
            )}

            <View style={styles.shadcnForm}>
              {isSignUp && (
                <>
                  {/* Display Name Input */}
                  <View style={styles.shadcnField}>
                    <AppText style={styles.shadcnLabel}>
                      {isKu ? "ناوی تەواو" : "Display Name"}
                    </AppText>
                    <TextInput
                      style={[styles.shadcnInput, { fontFamily: selectedFont }, isKu && { textAlign: "right" }]}
                      placeholder={isKu ? "جەمال عەلی" : "Jamal Ali"}
                      placeholderTextColor={colors.mutedForeground}
                      value={displayName}
                      onChangeText={setDisplayName}
                      autoCapitalize="words"
                    />
                  </View>

                  {/* Username Input */}
                  <View style={styles.shadcnField}>
                    <AppText style={styles.shadcnLabel}>
                      {isKu ? "ناوی بەکارهێنەر" : "Username"}
                    </AppText>
                    <TextInput
                      style={[styles.shadcnInput, { fontFamily: selectedFont }, isKu && { textAlign: "right" }]}
                      placeholder={isKu ? "jamal_ali" : "jamal_ali"}
                      placeholderTextColor={colors.mutedForeground}
                      value={username}
                      onChangeText={(val) => setUsername(val.replace(/\s+/g, ""))}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </>
              )}

              {/* Email Input */}
              <View style={styles.shadcnField}>
                <AppText style={styles.shadcnLabel}>
                  {isKu ? "ناونیشانی ئیمەیڵ" : "Email Address"}
                </AppText>
                <TextInput
                  style={[styles.shadcnInput, { fontFamily: selectedFont }, isKu && { textAlign: "right" }]}
                  placeholder={isKu ? "jamal@example.com" : "name@example.com"}
                  placeholderTextColor={colors.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.shadcnField}>
                <AppText style={styles.shadcnLabel}>
                  {isKu ? "تێپەڕەوشە" : "Password"}
                </AppText>
                <TextInput
                  style={[styles.shadcnInput, { fontFamily: selectedFont }, isKu && { textAlign: "right" }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Action button */}
            <TouchableOpacity
              style={[styles.shadcnButton, loading && styles.shadcnButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <AppText style={styles.shadcnButtonText} forceLatinFont latinRole="bold">
                  {isSignUp
                    ? (isKu ? "تۆمارکردنی ئەکاونت" : "Create Account")
                    : (isKu ? "چوونە ژوورەوە" : "Sign In")}
                </AppText>
              )}
            </TouchableOpacity>

            {/* Skip / Guest Play Button */}
            {showSkip === "true" && (
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => router.replace((redirect as any) || "/(tabs)")}
                activeOpacity={0.7}
              >
                <AppText style={styles.guestButtonText} forceKurdishFont={isKu}>
                  {isKu ? "وەک میوان بەردەوام بە" : "Continue as Guest"}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sleek Shadcn UI Alert Dialog Overlay */}
      {modalVisible && (
        <View style={StyleSheet.absoluteFill}>
          {/* Backdrop */}
          <View style={styles.modalBackdrop} />
          {/* Dialog Container */}
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              <View style={[styles.modalHeader, isKu && { flexDirection: "row-reverse" }]}>
                <HugeiconsIcon
                  icon={modalType === "success" ? CheckmarkCircle02Icon : Cancel01Icon}
                  size={20}
                  color={modalType === "success" ? "#10B981" : "#EF4444"}
                  strokeWidth={3}
                />
                <AppText style={styles.modalTitle} forceLatinFont={modalType === "success"} latinRole="bold">
                  {modalTitle}
                </AppText>
              </View>
              <AppText style={styles.modalDesc}>
                {modalDesc}
              </AppText>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <AppText style={styles.modalCloseBtnText} forceLatinFont latinRole="bold">
                  {isKu ? "باشە" : "Dismiss"}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backBtn: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 10,
  },
  shadcnContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  shadcnHeader: {
    marginBottom: 20,
  },
  shadcnTitle: {
    fontSize: 22,
    color: colors.foreground,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  shadcnSubTitle: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 18,
    fontFamily: "DINNextRoundedMedium",
  },
  shadcnTabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.muted,
    borderRadius: 8,
    padding: 2,
    marginBottom: 20,
  },
  shadcnTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  shadcnActiveTab: {
    backgroundColor: colors.surfaceRaised,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  shadcnTabText: {
    fontSize: 13.5,
    color: colors.mutedForeground,
  },
  shadcnActiveTabText: {
    color: colors.foreground,
  },
  shadcnForm: {
    gap: 14,
    marginBottom: 20,
  },
  shadcnField: {
    gap: 6,
  },
  shadcnLabel: {
    fontSize: 13,
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  shadcnInput: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.foreground,
    backgroundColor: colors.surface,
  },
  shadcnButton: {
    height: 42,
    backgroundColor: isDark ? colors.primary : "#18181B",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  shadcnButtonDisabled: {
    opacity: 0.7,
  },
  shadcnButtonText: {
    color: "#FAFAFA",
    fontSize: 14,
  },
  shadcnAlertError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: isDark ? "rgba(239,68,68,0.12)" : "#FEF2F2",
    borderWidth: 1,
    borderColor: isDark ? "rgba(239,68,68,0.28)" : "#FEE2E2",
    borderRadius: 6,
    padding: 10,
    gap: 8,
    marginBottom: 16,
  },
  shadcnAlertErrorText: {
    fontSize: 12.5,
    color: isDark ? "#FCA5A5" : "#991B1B",
    fontFamily: "DINNextRoundedMedium",
    flex: 1,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 9, 11, 0.4)",
    zIndex: 998,
  },
  modalWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 999,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    color: colors.foreground,
    letterSpacing: -0.4,
    flex: 1,
  },
  modalDesc: {
    fontSize: 13.5,
    color: colors.mutedForeground,
    lineHeight: 19,
    marginBottom: 20,
    fontFamily: "DINNextRoundedMedium",
  },
  modalCloseBtn: {
    height: 40,
    backgroundColor: isDark ? colors.primary : "#18181B",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#FAFAFA",
    fontSize: 13.5,
  },
  guestButton: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 10,
  },
  guestButtonText: {
    color: colors.mutedForeground,
    fontSize: 14,
    fontFamily: "DINNextRoundedBold",
  },
  });
}
