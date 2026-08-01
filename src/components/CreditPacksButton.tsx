import React, { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { router } from "expo-router";

import { Gem } from "../constants/icons";
import { useCreditBalance } from "../hooks/useCreditBalance";
import { useI18n } from "../hooks/useI18n";
import { useThemeColors } from "../hooks/useThemeColors";
import { AppText } from "./ui/AppText";

type CreditPacksButtonProps = {
  style?: StyleProp<ViewStyle>;
};

export function CreditPacksButton({ style }: CreditPacksButtonProps) {
  const { isKu, isAr } = useI18n();
  const { isDark } = useThemeColors();
  const { balance } = useCreditBalance();
  const label = isKu ? "پاکەتەکان" : isAr ? "الحزم" : "Packs";
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

  return (
    <Pressable
      onPress={() => router.push("/subscription")}
      accessibilityRole="button"
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
