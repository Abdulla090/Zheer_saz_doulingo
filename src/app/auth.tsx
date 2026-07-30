import { AppText } from "../components/ui/AppText";
import { IOSPressable as TouchableOpacity } from "../components/ui/ios-pressable";
import {
  LoginPrimaryButton,
  LoginPrimaryButtonLabel,
} from "../components/ui/LoginPrimaryButton";
import { TwinoBrandMark } from "../components/branding/twino-brand-mark";
import { TwinoMascot } from "../components/mascot/TwinoMascot";
import { PRIMARY_ACTION } from "../constants/primary-action";
import { useI18n } from "../hooks/useI18n";
import { supabase } from "../lib/supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFontStore } from "../stores/useFontStore";
import { useThemeColors } from "../hooks/useThemeColors";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useSafeBack } from "../hooks/use-safe-back";

type AuthMode = "signIn" | "signUp" | "forgot" | "recovery";

function getInitialMode(mode?: string): AuthMode {
  if (mode === "forgot") return "forgot";
  if (mode === "recovery" || mode === "reset") return "recovery";
  if (mode === "signup") return "signUp";
  return "signIn";
}

function getRecoveryRedirectUrl() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/auth?mode=recovery`;
  }
  return "twino://auth?mode=recovery";
}

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    redirect,
    mode: modeParam,
  } = useLocalSearchParams<{
    redirect?: string;
    mode?: string;
  }>();
  const safeBack = useSafeBack(
    (typeof redirect === "string" && redirect ? redirect : "/more") as any,
  );
  const { locale, isKu } = useI18n();
  const isRtl = isKu || locale === "ar";
  const { selectedFont } = useFontStore();
  const { colors, isDark } = useThemeColors();
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === "web" && windowWidth >= 900;
  const styles = useMemo(
    () => createStyles(colors, isDark, isDesktopWeb),
    [colors, isDark, isDesktopWeb],
  );

  const [authMode, setAuthMode] = useState<AuthMode>(() =>
    getInitialMode(modeParam),
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(
    getInitialMode(modeParam) === "recovery",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const showModal = (
    title: string,
    desc: string,
    type: "success" | "error" = "success",
  ) => {
    setModalTitle(title);
    setModalDesc(desc);
    setModalType(type);
    setModalVisible(true);
  };

  const changeMode = (nextMode: AuthMode) => {
    setAuthMode(nextMode);
    setErrorMessage(null);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordVisible(false);
  };

  useEffect(() => {
    const nextMode = getInitialMode(modeParam);
    setAuthMode(nextMode);
    setCheckingRecovery(nextMode === "recovery");
  }, [modeParam]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setAuthMode("recovery");
        setCheckingRecovery(false);
        setErrorMessage(null);
      }
    });

    if (authMode === "recovery") {
      void supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setCheckingRecovery(false);
          return;
        }

        setCheckingRecovery(false);
        setAuthMode("forgot");
        showModal(
          isKu ? "بەستەرەکە بەسەرچووە" : "Reset link expired",
          isKu
            ? "تکایە داواکارییەکی نوێی گۆڕینی تێپەڕەوشە بنێرە."
            : "This recovery link is invalid or expired. Request a fresh password reset email.",
          "error",
        );
      });
    }

    return () => subscription.unsubscribe();
  }, [authMode, isKu]);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validateStrongPassword = (value: string) =>
    value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);

  const handleAuthSubmit = async () => {
    setErrorMessage(null);
    const isSignUp = authMode === "signUp";
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage(
        isKu
          ? "تکایە ئیمەیڵ و تێپەڕەوشە بنووسە"
          : "Enter your email and password to continue.",
      );
      return;
    }
    if (!validateEmail(normalizedEmail)) {
      setErrorMessage(
        isKu ? "ناونیشانی ئیمەیڵەکە ڕاست نییە" : "Enter a valid email address.",
      );
      return;
    }
    if (isSignUp && !validateStrongPassword(password)) {
      setErrorMessage(
        isKu
          ? "تێپەڕەوشە دەبێت لانیکەم ٨ پیت بێت و پیت و ژمارەی تێدا بێت"
          : "Use at least 8 characters with both letters and numbers.",
      );
      return;
    }
    if (isSignUp && (!username.trim() || !displayName.trim())) {
      setErrorMessage(
        isKu
          ? "تکایە ناوی بەکارهێنەر و ناوی پیشاندان بنووسە"
          : "Add a display name and username.",
      );
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              username: username.toLowerCase().trim(),
              display_name: displayName.trim(),
              selected_mascot_id: selectedMascotId,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          showModal(
            isKu ? "ئەکاونتەکەت ئامادەیە" : "Your account is ready",
            isKu
              ? "بە سەرکەوتوویی چوویتە ژوورەوە."
              : "Account created. You are securely signed in.",
          );
          setTimeout(() => router.replace((redirect as any) || "/more"), 900);
        } else {
          showModal(
            isKu ? "ئیمەیڵەکەت بپشکنە" : "Check your email",
            isKu
              ? "کۆد یان بەستەری پشتڕاستکردنەوەمان بۆ ناردیت."
              : "We sent your confirmation code or secure link. Open it to finish creating your account.",
          );
          setPassword("");
          setUsername("");
          setDisplayName("");
          setAuthMode("signIn");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;

        showModal(
          isKu ? "بەخێربێیتەوە" : "Welcome back",
          isKu
            ? "بە سەرکەوتوویی چوویتە ژوورەوە."
            : "You are signed in. Your learning progress is ready.",
        );
        setTimeout(() => router.replace((redirect as any) || "/more"), 700);
      }
    } catch (error: any) {
      const message =
        error?.message ||
        (isKu ? "هەڵەیەک ڕوویدا" : "Something went wrong. Please try again.");
      setErrorMessage(message);
      showModal(
        isKu ? "نەتوانرا بەردەوام بێت" : "Could not continue",
        message,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmail(normalizedEmail)) {
      setErrorMessage(
        isKu
          ? "ئیمەیڵێکی دروست بنووسە بۆ گەڕاندنەوەی ئەکاونتەکەت"
          : "Enter the email address connected to your account.",
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        { redirectTo: getRecoveryRedirectUrl() },
      );
      if (error) throw error;

      showModal(
        isKu ? "ئیمەیڵەکەت بپشکنە" : "Reset email sent",
        isKu
          ? "کۆد یان بەستەری پارێزراوی گۆڕینی تێپەڕەوشەمان بۆ ناردیت. ئەگەر نەیبینیت، سپام بپشکنە."
          : "Use the code or secure link in your inbox to reset your password. Check spam if it does not arrive.",
      );
    } catch (error: any) {
      const message =
        error?.message ||
        (isKu
          ? "نەتوانرا ئیمەیڵی گۆڕینی تێپەڕەوشە بنێردرێت"
          : "We could not send the reset email. Try again shortly.");
      setErrorMessage(message);
      showModal(
        isKu ? "ناردن سەرکەوتوو نەبوو" : "Email not sent",
        message,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setErrorMessage(null);
    if (!validateStrongPassword(newPassword)) {
      setErrorMessage(
        isKu
          ? "تێپەڕەوشە دەبێت لانیکەم ٨ پیت بێت و پیت و ژمارەی تێدا بێت"
          : "Use at least 8 characters with both letters and numbers.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(
        isKu ? "تێپەڕەوشەکان یەکسان نین" : "The passwords do not match.",
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      showModal(
        isKu ? "تێپەڕەوشە گۆڕدرا" : "Password updated",
        isKu
          ? "تێپەڕەوشە نوێیەکەت پارێزرا و بە سەرکەوتوویی چوویتە ژوورەوە."
          : "Your new password is saved and you are securely signed in.",
      );
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => router.replace((redirect as any) || "/more"), 1000);
    } catch (error: any) {
      const message =
        error?.message ||
        (isKu
          ? "نەتوانرا تێپەڕەوشەکە بگۆڕدرێت"
          : "We could not update your password. Request a new reset link.");
      setErrorMessage(message);
      showModal(
        isKu ? "گۆڕین سەرکەوتوو نەبوو" : "Password not updated",
        message,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = authMode === "signUp";
  const isForgot = authMode === "forgot";
  const isRecovery = authMode === "recovery";

  const title = isRecovery
    ? isKu
      ? "تێپەڕەوشەی نوێ دابنێ"
      : "Create a new password"
    : isForgot
      ? isKu
        ? "گەڕاندنەوەی ئەکاونت"
        : "Reset your password"
      : isSignUp
        ? isKu
          ? "ئەکاونتێک دروست بکە"
          : "Create your account"
        : isKu
          ? "بەخێربێیتەوە"
          : "Welcome back";

  const subtitle = isRecovery
    ? isKu
      ? "تێپەڕەوشەیەکی بەهێز هەڵبژێرە کە پێشتر بەکارت نەهێناوە."
      : "Choose a strong password you have not used before."
    : isForgot
      ? isKu
        ? "ئیمەیڵەکەت بنووسە تا بەستەر یان کۆدی گۆڕینت بۆ بنێرین."
        : "Enter your account email and we will send a secure recovery link or code."
      : isSignUp
        ? isKu
          ? "پێشکەوتنت بپارێزە و لە هەر ئامێرێکەوە بەردەوام بە."
          : "Save your progress and keep learning from any device."
        : isKu
          ? "لەو شوێنەوە بەردەوام بە کە وازت لێهێنا."
          : "Sign in to continue exactly where you left off.";

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + (isDesktopWeb ? 32 : 72),
              paddingBottom: insets.bottom + 32,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.backBtn,
              { top: insets.top + 16 },
              isRtl ? { right: 20 } : { left: 20 },
            ]}
            onPress={() => {
              if (isForgot || isRecovery) {
                changeMode("signIn");
              } else {
                safeBack();
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={isKu ? "گەڕانەوە" : "Go back"}
          >
            <HugeiconsIcon
              icon={isRtl ? ArrowRight02Icon : ArrowLeft02Icon}
              size={20}
              color={colors.foreground}
              strokeWidth={2.5}
            />
          </TouchableOpacity>

          <View style={styles.authShell}>
            {isDesktopWeb ? (
              <View style={styles.brandPanel}>
                <View style={styles.brandOrbOne} />
                <View style={styles.brandOrbTwo} />
                <View style={styles.brandWordmark}>
                  <TwinoBrandMark size={42} showName nameSize={24} />
                </View>
                <View style={styles.brandCopy}>
                  <View style={styles.brandBadge}>
                    <View style={styles.brandBadgeDot} />
                    <AppText style={styles.brandBadgeText} forceLatinFont latinRole="bold">
                      BUILT FOR DAILY PROGRESS
                    </AppText>
                  </View>
                  <AppText style={styles.brandTitle} forceLatinFont latinRole="bold">
                    Small lessons.{"\n"}Real confidence.
                  </AppText>
                  <AppText style={styles.brandBody} forceLatinFont>
                    Speaking, listening, and practical English in one focused learning path.
                  </AppText>
                  <View style={styles.benefitList}>
                    {[
                      "Progress synced across devices",
                      "Short sessions that fit your day",
                      "A private, secure learning account",
                    ].map((benefit) => (
                      <View key={benefit} style={styles.benefitRow}>
                        <View style={styles.benefitCheck}>
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={18}
                            color="#FFFFFF"
                            strokeWidth={2.8}
                          />
                        </View>
                        <AppText style={styles.benefitText} forceLatinFont>
                          {benefit}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.brandMascot}>
                  <TwinoMascot size={180} mascotId="pingo" pose="encouraging" />
                </View>
              </View>
            ) : null}

            <View style={styles.formPanel}>
              <View style={styles.mobileBrand}>
                <TwinoBrandMark size={54} showName nameSize={28} />
              </View>

              <View style={styles.formWrap}>
                <View style={styles.header}>
                  <AppText
                    style={[styles.title, { textAlign: isRtl ? "right" : "left" }]}
                    forceLatinFont={!isKu}
                    forceKurdishFont={isKu}
                    latinRole="bold"
                  >
                    {title}
                  </AppText>
                  <AppText
                    style={[styles.subtitle, { textAlign: isRtl ? "right" : "left" }]}
                    forceKurdishFont={isKu}
                  >
                    {subtitle}
                  </AppText>
                </View>

                {!isForgot && !isRecovery ? (
                  <View
                    style={[
                      styles.tabs,
                      isRtl && { flexDirection: "row-reverse" },
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.tab, !isSignUp && styles.activeTab]}
                      onPress={() => changeMode("signIn")}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: !isSignUp }}
                    >
                      <AppText
                        style={[styles.tabText, !isSignUp && styles.activeTabText]}
                        forceLatinFont={!isKu}
                        forceKurdishFont={isKu}
                        latinRole="bold"
                      >
                        {isKu ? "چوونەژوورەوە" : "Sign in"}
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tab, isSignUp && styles.activeTab]}
                      onPress={() => changeMode("signUp")}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: isSignUp }}
                    >
                      <AppText
                        style={[styles.tabText, isSignUp && styles.activeTabText]}
                        forceLatinFont={!isKu}
                        forceKurdishFont={isKu}
                        latinRole="bold"
                      >
                        {isKu ? "تۆماربوون" : "Create account"}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {errorMessage ? (
                  <View
                    style={[
                      styles.errorAlert,
                      isRtl && { flexDirection: "row-reverse" },
                    ]}
                    accessibilityRole="alert"
                  >
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      size={18}
                      color={colors.error}
                      strokeWidth={2.5}
                    />
                    <AppText style={styles.errorText}>{errorMessage}</AppText>
                  </View>
                ) : null}

                {checkingRecovery ? (
                  <View style={styles.recoveryLoader}>
                    <ActivityIndicator size="small" color="#168BD2" />
                    <AppText style={styles.recoveryLoaderText}>
                      {isKu ? "بەستەرە پارێزراوەکە دەپشکنین..." : "Verifying your secure reset link…"}
                    </AppText>
                  </View>
                ) : (
                  <View style={styles.form}>
                    {isSignUp ? (
                      <View style={styles.nameRow}>
                        <View style={styles.growField}>
                          <Field
                            label={isKu ? "ناوی پیشاندان" : "Display name"}
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder={isKu ? "جەمال عەلی" : "Jamal Ali"}
                            selectedFont={selectedFont}
                            colors={colors}
                            styles={styles}
                            isRtl={isRtl}
                            autoCapitalize="words"
                          />
                        </View>
                        <View style={styles.growField}>
                          <Field
                            label={isKu ? "ناوی بەکارهێنەر" : "Username"}
                            value={username}
                            onChangeText={(value) =>
                              setUsername(value.replace(/\s+/g, ""))
                            }
                            placeholder="jamal_ali"
                            selectedFont={selectedFont}
                            colors={colors}
                            styles={styles}
                            isRtl={isRtl}
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                        </View>
                      </View>
                    ) : null}

                    {!isRecovery ? (
                      <Field
                        label={isKu ? "ناونیشانی ئیمەیڵ" : "Email address"}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@example.com"
                        selectedFont={selectedFont}
                        colors={colors}
                        styles={styles}
                        isRtl={isRtl}
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    ) : null}

                    {!isForgot ? (
                      <>
                        <PasswordField
                          label={
                            isRecovery
                              ? isKu
                                ? "تێپەڕەوشەی نوێ"
                                : "New password"
                              : isKu
                                ? "تێپەڕەوشە"
                                : "Password"
                          }
                          value={isRecovery ? newPassword : password}
                          onChangeText={isRecovery ? setNewPassword : setPassword}
                          visible={passwordVisible}
                          onToggle={() => setPasswordVisible((value) => !value)}
                          selectedFont={selectedFont}
                          colors={colors}
                          styles={styles}
                          isRtl={isRtl}
                          showLabel={isKu ? "پیشاندان" : "Show"}
                          hideLabel={isKu ? "شاردنەوە" : "Hide"}
                          autoComplete={isRecovery ? "new-password" : "current-password"}
                        />
                        {isSignUp || isRecovery ? (
                          <AppText style={styles.passwordHint}>
                            {isKu
                              ? "لانیکەم ٨ پیت، لەگەڵ پیت و ژمارە"
                              : "At least 8 characters, including letters and numbers"}
                          </AppText>
                        ) : null}
                      </>
                    ) : null}

                    {isRecovery ? (
                      <PasswordField
                        label={isKu ? "دووبارەکردنەوەی تێپەڕەوشە" : "Confirm new password"}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        visible={passwordVisible}
                        onToggle={() => setPasswordVisible((value) => !value)}
                        selectedFont={selectedFont}
                        colors={colors}
                        styles={styles}
                        isRtl={isRtl}
                        showLabel={isKu ? "پیشاندان" : "Show"}
                        hideLabel={isKu ? "شاردنەوە" : "Hide"}
                        autoComplete="new-password"
                      />
                    ) : null}

                    {authMode === "signIn" ? (
                      <TouchableOpacity
                        onPress={() => changeMode("forgot")}
                        style={[
                          styles.forgotLink,
                          { alignSelf: isRtl ? "flex-start" : "flex-end" },
                        ]}
                        accessibilityRole="link"
                      >
                        <AppText
                          style={styles.forgotLinkText}
                          forceKurdishFont={isKu}
                          latinRole="bold"
                        >
                          {isKu ? "تێپەڕەوشەت لەبیرکردووە؟" : "Forgot password?"}
                        </AppText>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}

                {!checkingRecovery ? (
                  <LoginPrimaryButton
                    style={styles.authPrimaryButton}
                    onPress={
                      isForgot
                        ? handleForgotPassword
                        : isRecovery
                          ? handlePasswordUpdate
                          : handleAuthSubmit
                    }
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <LoginPrimaryButtonLabel
                        forceLatinFont={!isKu}
                        forceKurdishFont={isKu}
                      >
                        {isForgot
                          ? isKu
                            ? "ناردنی بەستەری گۆڕین"
                            : "Send reset link"
                          : isRecovery
                            ? isKu
                              ? "پاراستنی تێپەڕەوشە"
                              : "Save new password"
                            : isSignUp
                              ? isKu
                                ? "دروستکردنی ئەکاونت"
                                : "Create account"
                              : isKu
                                ? "چوونە ژوورەوە"
                                : "Sign in"}
                      </LoginPrimaryButtonLabel>
                    )}
                  </LoginPrimaryButton>
                ) : null}

                {isForgot ? (
                  <TouchableOpacity
                    style={styles.secondaryAction}
                    onPress={() => changeMode("signIn")}
                  >
                    <AppText style={styles.secondaryActionText} latinRole="bold">
                      {isKu ? "گەڕانەوە بۆ چوونەژوورەوە" : "Back to sign in"}
                    </AppText>
                  </TouchableOpacity>
                ) : null}

                {Platform.OS === "web" ? (
                  <TouchableOpacity
                    style={styles.plansLink}
                    onPress={() => router.push("/credits")}
                    accessibilityRole="link"
                  >
                    <AppText
                      style={styles.plansLinkText}
                      forceKurdishFont={isKu}
                      forceLatinFont={!isKu}
                      latinRole="bold"
                    >
                      {isKu ? "کرێدیتی TWINO ببینە" : "View TWINO credits"}
                    </AppText>
                  </TouchableOpacity>
                ) : null}

                <AppText style={styles.legalText} forceKurdishFont={isKu}>
                  {isKu
                    ? "بە بەردەوامبوون، ڕازی دەبیت بە مەرجەکان و سیاسەتی تایبەتمەندی TWINO."
                    : "By continuing, you agree to TWINO’s Terms and Privacy Policy."}
                </AppText>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {modalVisible ? (
        <View
          style={StyleSheet.absoluteFill}
          accessibilityViewIsModal
          accessibilityRole="alert"
        >
          <View style={styles.modalBackdrop} />
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              <View
                style={[
                  styles.modalHeader,
                  isRtl && { flexDirection: "row-reverse" },
                ]}
              >
                <View
                  style={[
                    styles.modalIcon,
                    modalType === "error" && styles.modalErrorIcon,
                  ]}
                >
                  <HugeiconsIcon
                    icon={
                      modalType === "success"
                        ? CheckmarkCircle02Icon
                        : Cancel01Icon
                    }
                    size={22}
                    color={modalType === "success" ? "#168BD2" : "#EF4444"}
                    strokeWidth={2.8}
                  />
                </View>
                <AppText
                  style={styles.modalTitle}
                  forceKurdishFont={isKu}
                  latinRole="bold"
                >
                  {modalTitle}
                </AppText>
              </View>
              <AppText style={styles.modalDesc} forceKurdishFont={isKu}>
                {modalDesc}
              </AppText>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <AppText style={styles.modalCloseText} latinRole="bold">
                  {isKu ? "باشە" : "Got it"}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  selectedFont: string;
  colors: any;
  styles: ReturnType<typeof createStyles>;
  isRtl: boolean;
  keyboardType?: "default" | "email-address";
  autoComplete?: "email" | "current-password" | "new-password";
  autoCapitalize?: "none" | "words";
  autoCorrect?: boolean;
};

function Field({
  label,
  selectedFont,
  colors,
  styles,
  isRtl,
  ...inputProps
}: FieldProps) {
  return (
    <View style={styles.field}>
      <AppText
        style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}
        latinRole="bold"
      >
        {label}
      </AppText>
      <TextInput
        {...inputProps}
        style={[
          styles.input,
          { fontFamily: selectedFont, textAlign: isRtl ? "right" : "left" },
        ]}
        placeholderTextColor={colors.mutedForeground}
      />
    </View>
  );
}

type PasswordFieldProps = Omit<
  FieldProps,
  "placeholder" | "keyboardType"
> & {
  visible: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
};

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
  showLabel,
  hideLabel,
  selectedFont,
  colors,
  styles,
  isRtl,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <View style={styles.field}>
      <AppText
        style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}
        latinRole="bold"
      >
        {label}
      </AppText>
      <View style={styles.passwordInputWrap}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            {
              fontFamily: selectedFont,
              textAlign: isRtl ? "right" : "left",
              ...(Platform.OS === "web"
                ? {
                    paddingRight: isRtl ? 14 : 68,
                    paddingLeft: isRtl ? 68 : 14,
                  }
                : {
                    paddingStart: 14,
                    paddingEnd: 76,
                  }),
            },
          ]}
          placeholder="••••••••"
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
        />
        <TouchableOpacity
          style={[
            styles.passwordToggle,
            Platform.OS === "web"
              ? isRtl
                ? { left: 8 }
                : { right: 8 }
              : { end: 8 },
          ]}
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={visible ? hideLabel : showLabel}
        >
          <AppText style={styles.passwordToggleText} latinRole="bold">
            {visible ? hideLabel : showLabel}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean, isDesktopWeb: boolean) {
  return StyleSheet.create({
    flex: { flex: 1 },
    root: {
      flex: 1,
      backgroundColor: isDark ? "#0B1220" : "#F3F7FA",
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: isDesktopWeb ? 32 : 20,
      justifyContent: "center",
      alignItems: "center",
    },
    backBtn: {
      position: "absolute",
      width: 44,
      height: 44,
      borderRadius: 13,
      backgroundColor: colors.surfaceRaised,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 20,
      ...Platform.select({
        web: {
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
          cursor: "pointer",
        } as any,
      }),
    },
    authShell: {
      width: "100%",
      maxWidth: isDesktopWeb ? 1080 : 520,
      minHeight: isDesktopWeb ? 680 : undefined,
      flexDirection: isDesktopWeb ? "row" : "column",
      overflow: "hidden",
      borderRadius: isDesktopWeb ? 30 : 0,
      borderWidth: isDesktopWeb ? 1 : 0,
      borderColor: colors.border,
      backgroundColor: isDesktopWeb ? colors.surfaceRaised : "transparent",
      ...Platform.select({
        web: isDesktopWeb
          ? ({
              boxShadow: isDark
                ? "0 30px 80px rgba(0, 0, 0, 0.28)"
                : "0 30px 80px rgba(15, 23, 42, 0.12)",
            } as any)
          : undefined,
      }),
    },
    brandPanel: {
      width: "43%",
      minHeight: 680,
      backgroundColor: "#0E5F95",
      padding: 38,
      position: "relative",
      overflow: "hidden",
    },
    brandOrbOne: {
      position: "absolute",
      width: 320,
      height: 320,
      borderRadius: 160,
      right: -150,
      top: -100,
      backgroundColor: "rgba(87, 194, 255, 0.18)",
    },
    brandOrbTwo: {
      position: "absolute",
      width: 230,
      height: 230,
      borderRadius: 115,
      left: -110,
      bottom: -70,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    brandWordmark: {
      alignSelf: "flex-start",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: "#FFFFFF",
    },
    brandCopy: {
      marginTop: 68,
      zIndex: 2,
    },
    brandBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 18,
    },
    brandBadgeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#8EE3FF",
    },
    brandBadgeText: {
      color: "#BEEBFF",
      fontSize: 11,
      letterSpacing: 1.2,
    },
    brandTitle: {
      color: "#FFFFFF",
      fontSize: 39,
      lineHeight: 45,
      letterSpacing: -1.4,
    },
    brandBody: {
      color: "#D6F1FF",
      fontSize: 15,
      lineHeight: 23,
      marginTop: 16,
      maxWidth: 335,
    },
    benefitList: {
      gap: 13,
      marginTop: 28,
    },
    benefitRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
    },
    benefitCheck: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    benefitText: {
      color: "#FFFFFF",
      fontSize: 13.5,
      lineHeight: 19,
    },
    brandMascot: {
      position: "absolute",
      right: 12,
      bottom: -18,
      zIndex: 1,
    },
    formPanel: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: isDesktopWeb ? 58 : 0,
      paddingVertical: isDesktopWeb ? 42 : 0,
      backgroundColor: isDesktopWeb ? colors.surfaceRaised : "transparent",
    },
    mobileBrand: {
      display: isDesktopWeb ? "none" : "flex",
      alignItems: "center",
      marginBottom: 30,
    },
    formWrap: {
      width: "100%",
      maxWidth: 470,
      alignSelf: "center",
    },
    header: {
      marginBottom: 24,
    },
    title: {
      color: colors.foreground,
      fontSize: isDesktopWeb ? 31 : 28,
      lineHeight: isDesktopWeb ? 38 : 34,
      letterSpacing: -0.9,
    },
    subtitle: {
      color: colors.mutedForeground,
      fontSize: 14.5,
      lineHeight: 21,
      marginTop: 8,
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#EEF3F7",
      borderRadius: 15,
      padding: 4,
      marginBottom: 22,
    },
    tab: {
      flex: 1,
      minHeight: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
    },
    activeTab: {
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        web: {
          boxShadow: "0 3px 10px rgba(15, 23, 42, 0.07)",
        } as any,
      }),
    },
    tabText: {
      color: colors.mutedForeground,
      fontSize: 13.5,
    },
    activeTabText: {
      color: colors.foreground,
    },
    errorAlert: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 9,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? "rgba(239,68,68,0.30)" : "#FECACA",
      backgroundColor: isDark ? "rgba(239,68,68,0.10)" : "#FEF2F2",
      marginBottom: 16,
    },
    errorText: {
      flex: 1,
      color: isDark ? "#FCA5A5" : "#991B1B",
      fontSize: 13,
      lineHeight: 18,
    },
    form: {
      gap: 15,
    },
    nameRow: {
      flexDirection: isDesktopWeb ? "row" : "column",
      gap: 12,
    },
    growField: {
      flex: 1,
      minWidth: 0,
    },
    field: {
      gap: 7,
    },
    label: {
      color: colors.foreground,
      fontSize: 13,
      lineHeight: 18,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 13,
      paddingHorizontal: 14,
      color: colors.foreground,
      backgroundColor: isDark ? colors.surface : "#FFFFFF",
      fontSize: 14.5,
      ...Platform.select({
        web: {
          outlineStyle: "none",
        } as any,
      }),
    },
    passwordInputWrap: {
      position: "relative",
      justifyContent: "center",
    },
    passwordInput: {
      paddingHorizontal: 14,
    },
    passwordToggle: {
      position: "absolute",
      top: 8,
      minWidth: 50,
      height: 34,
      paddingHorizontal: 8,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 9,
      ...Platform.select({
        web: { cursor: "pointer" } as any,
      }),
    },
    passwordToggleText: {
      color: "#168BD2",
      fontSize: 12,
    },
    passwordHint: {
      color: colors.mutedForeground,
      fontSize: 12,
      lineHeight: 17,
      marginTop: -7,
    },
    forgotLink: {
      minHeight: 28,
      justifyContent: "center",
      marginTop: -5,
      ...Platform.select({
        web: { cursor: "pointer" } as any,
      }),
    },
    forgotLinkText: {
      color: "#168BD2",
      fontSize: 13,
    },
    authPrimaryButton: {
      marginTop: 22,
    },
    secondaryAction: {
      minHeight: 40,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    secondaryActionText: {
      color: colors.foreground,
      fontSize: 13.5,
    },
    plansLink: {
      alignSelf: "center",
      minHeight: 34,
      justifyContent: "center",
      marginTop: 10,
      ...Platform.select({
        web: { cursor: "pointer" } as any,
      }),
    },
    plansLinkText: {
      color: "#168BD2",
      fontSize: 12.5,
    },
    legalText: {
      color: colors.mutedForeground,
      fontSize: 11.5,
      lineHeight: 17,
      textAlign: "center",
      marginTop: 8,
      paddingHorizontal: 10,
    },
    recoveryLoader: {
      minHeight: 180,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    recoveryLoaderText: {
      color: colors.mutedForeground,
      fontSize: 13.5,
    },
    modalBackdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(5, 12, 24, 0.56)",
    },
    modalWrapper: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: "center",
      alignItems: "center",
      padding: 22,
      zIndex: 2,
    },
    modalContent: {
      width: "100%",
      maxWidth: 420,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      backgroundColor: colors.surfaceRaised,
      padding: 24,
      ...Platform.select({
        web: {
          boxShadow: "0 28px 70px rgba(5, 12, 24, 0.28)",
        } as any,
        android: { elevation: 12 },
      }),
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 13,
    },
    modalIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(22,139,210,0.15)" : "#E9F7FF",
    },
    modalErrorIcon: {
      backgroundColor: isDark ? "rgba(239,68,68,0.13)" : "#FEF2F2",
    },
    modalTitle: {
      flex: 1,
      color: colors.foreground,
      fontSize: 19,
      lineHeight: 24,
    },
    modalDesc: {
      color: colors.mutedForeground,
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 20,
    },
    modalCloseButton: {
      height: 46,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: PRIMARY_ACTION.face,
    },
    modalCloseText: {
      color: "#FFFFFF",
      fontSize: 14,
    },
  });
}
