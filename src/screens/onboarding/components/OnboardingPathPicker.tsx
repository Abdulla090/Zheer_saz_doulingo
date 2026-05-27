import { Icon3DLayers, Icon3DZapBlue } from "@/components/icons/Icon3D";
import { crossShadow } from "@/utils/shadows";
import { rtlTextCenter } from "@/utils/rtl";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useOnboardingLocale } from "../OnboardingLocaleContext";

type PathMode = "street" | "normal";

type Props = {
  selected: PathMode;
  onSelect: (mode: PathMode) => void;
  streetTitle: string;
  streetSub: string;
  normalTitle: string;
  normalSub: string;
};

export function OnboardingPathPicker({
  selected,
  onSelect,
  streetTitle,
  streetSub,
  normalTitle,
  normalSub,
}: Props) {
  const { isRtl, locale } = useOnboardingLocale();
  const fontFamily = locale === "ku" ? "Rabar_011" : undefined;

  return (
    <View style={styles.row}>
      <PathCard
        active={selected === "street"}
        onPress={() => onSelect("street")}
        title={streetTitle}
        subtitle={streetSub}
        icon={<Icon3DZapBlue size={32} active={selected === "street"} />}
        accent="#208AEF"
        isRtl={isRtl}
        fontFamily={fontFamily}
      />
      <PathCard
        active={selected === "normal"}
        onPress={() => onSelect("normal")}
        title={normalTitle}
        subtitle={normalSub}
        icon={<Icon3DLayers size={32} active={selected === "normal"} />}
        accent="#7C3AED"
        isRtl={isRtl}
        fontFamily={fontFamily}
      />
    </View>
  );
}

function PathCard({
  active,
  onPress,
  title,
  subtitle,
  icon,
  accent,
  isRtl,
  fontFamily,
}: {
  active: boolean;
  onPress: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  isRtl: boolean;
  fontFamily?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        active && { borderColor: accent, backgroundColor: "rgba(32,138,239,0.06)" },
        crossShadow({
          color: "#0F172A",
          offsetY: 6,
          blur: 16,
          opacity: active ? 0.08 : 0.04,
          elevation: active ? 4 : 2,
        }),
      ]}
    >
      {active && (
        <LinearGradient
          colors={[`${accent}18`, "transparent"]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      <View style={styles.iconWrap}>{icon}</View>
      <Text
        style={[
          styles.title,
          rtlTextCenter(isRtl),
          active && { color: accent },
          fontFamily && { fontFamily },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
      <Text
        style={[styles.sub, rtlTextCenter(isRtl), fontFamily && { fontFamily }]}
        numberOfLines={2}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    width: "100%",
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    overflow: "hidden",
    minHeight: 128,
  },
  iconWrap: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 20,
  },
  sub: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 6,
    lineHeight: 16,
  },
});
