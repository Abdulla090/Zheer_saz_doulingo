import React, { useMemo } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Gem } from "../constants/icons";
import { SUBSCRIPTION_URL } from "../constants/app-meta";
import { useCreditBalance } from "../hooks/useCreditBalance";
import { useI18n } from "../hooks/useI18n";
import { useThemeColors } from "../hooks/useThemeColors";
import { openHttpsUrl } from "../utils/safe-link";
import { AppText } from "./ui/AppText";
import { ENABLE_SHOP } from "../constants/feature-flags";

type CreditPacksButtonProps = {
  style?: StyleProp<ViewStyle>;
};

export function CreditPacksButton({ style }: CreditPacksButtonProps) {
  const { isKu, isAr } = useI18n();
  const { isDark } = useThemeColors();
  const { balance } = useCreditBalance();
  const label = ENABLE_SHOP
    ? isKu ? "پاکەتەکان" : isAr ? "الحزم" : "Packs"
    : balance === null
      ? isKu ? "کرێدیت" : isAr ? "الرصيد" : "Credits"
      : balance.toLocaleString();
  const accessibilityLabel =
    balance === null
      ? isKu
        ? "پاکەتەکانی کرێدیتی TWINO ببینە"
        : isAr
          ? "عرض حزم رصيد TWINO"
          : "View TWINO credit packs"
      : isKu
        ? `کرێدیتی TWINO: ${balance}. پاکەتەکان ببینە`
        : isAr
          ? `رصيد TWINO: ${balance}. عرض حزم الرصيد`
          : `TWINO credits: ${balance}. View credit packs`;
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const openPricing = async () => {
    const opened = await openHttpsUrl(SUBSCRIPTION_URL);
    if (!opened) {
      Alert.alert(
        isKu
          ? "وێبسایت نەکرایەوە"
          : isAr
            ? "تعذر فتح الموقع"
            : "Could not open website",
        SUBSCRIPTION_URL,
      );
    }
  };

  return (
    <Pressable
      onPress={() => void openPricing()}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
      ]}
    >
      <Gem width={16} height={16} color={isDark ? "#75CCFA" : "#168BD2"} fill={isDark ? "#75CCFA" : "#168BD2"} />
      <AppText
        style={styles.label}
        forceKurdishFont={isKu || isAr}
        forceLatinFont={!isKu && !isAr}
        latinRole="bold"
        numberOfLines={1}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    button: {
      minHeight: 36,
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 11,
      borderWidth: 1,
      borderColor: isDark ? "rgba(69,180,240,0.30)" : "#CDEBFA",
      borderRadius: 12,
      borderCurve: "continuous",
      backgroundColor: isDark ? "rgba(22,139,210,0.12)" : "#EFF9FE",
    },
    label: {
      color: isDark ? "#75CCFA" : "#0E6FA9",
      fontSize: 12.5,
      lineHeight: 16,
    },
    pressed: {
      opacity: 0.74,
      transform: [{ translateY: 1 }, { scale: 0.97 }],
    },
  });
}
