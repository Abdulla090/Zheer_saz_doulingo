import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../hooks/useI18n";
import { useThemeColors } from "../hooks/useThemeColors";
import { AppText } from "./ui/AppText";
import { IOSPressable } from "./ui/ios-pressable";

/** An unavailable balance is not a zero balance. Keep the last verified data. */
export function BillingStatusNotice() {
  const { billingError, refreshBillingAccount } = useAuth();
  const { isKu, isAr } = useI18n();
  const { colors } = useThemeColors();
  const [retrying, setRetrying] = useState(false);
  if (!billingError) return null;
  const message = isKu
    ? "هەژمارەکەت نوێ نەبووەوە. تکایە دووبارە هەوڵ بدەوە."
    : isAr ? "تعذر تحديث حسابك. حاول مرة أخرى." : "We couldn’t refresh your account. Please try again.";
  const retry = isKu ? "هەوڵدانەوە" : isAr ? "إعادة المحاولة" : "Retry";
  return (
    <View style={[styles.notice, { borderColor: colors.border }]} accessibilityLiveRegion="polite">
      <AppText style={styles.message}>{message}</AppText>
      <IOSPressable
        accessibilityRole="button"
        accessibilityLabel={retry}
        accessibilityState={{ disabled: retrying, busy: retrying }}
        disabled={retrying}
        style={styles.retry}
        onPress={async () => {
          setRetrying(true);
          try { await refreshBillingAccount(); } finally { setRetrying(false); }
        }}
      >
        {retrying ? <ActivityIndicator color={colors.foreground} /> : <AppText style={styles.label}>{retry}</AppText>}
      </IOSPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { borderWidth: 1, borderRadius: 16, borderCurve: "continuous", padding: 12, gap: 8, flexDirection: "row", alignItems: "center" },
  message: { flex: 1, fontSize: 14, lineHeight: 21 },
  retry: { minWidth: 48, minHeight: 48, justifyContent: "center", paddingHorizontal: 8 },
  label: { fontWeight: "700", fontSize: 14 },
});
