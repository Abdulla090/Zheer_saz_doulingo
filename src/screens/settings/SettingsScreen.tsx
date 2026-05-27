import { PressableScale } from "@/components/animations";
import {
  Icon3DCheckCircle,
  Icon3DChevronRight,
  Icon3DSettings,
} from "@/components/icons/Icon3D";
import { AppText } from "@/components/ui/AppText";
import { ALL_RABAR_FONTS } from "@/constants/rabar-fonts";
import { useI18n } from "@/hooks/useI18n";
import type { AppLocale } from "@/i18n";
import { useFontStore } from "@/stores/useFontStore";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOCALE_OPTIONS: { id: AppLocale; labelKey: "settings.languageEn" | "settings.languageKu" }[] =
  [
    { id: "en", labelKey: "settings.languageEn" },
    { id: "ku", labelKey: "settings.languageKu" },
  ];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale, setLocale, isKu } = useI18n();
  const { selectedFont, setFont } = useFontStore();
  const [haptics, setHaptics] = useState(true);
  const [sounds, setSounds] = useState(true);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Icon3DSettings size={28} />
        <AppText style={styles.title} forceKurdishFont={isKu}>
          {t("settings.title")}
        </AppText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <AppText style={styles.sectionLabel} forceKurdishFont={isKu}>
          {t("settings.languageSection")}
        </AppText>
        <AppText style={styles.sectionHint} forceKurdishFont={isKu}>
          {t("settings.languageHint")}
        </AppText>

        <View style={styles.card}>
          {LOCALE_OPTIONS.map((opt, index) => {
            const selected = locale === opt.id;
            return (
              <PressableScale
                key={opt.id}
                onPress={() => setLocale(opt.id)}
                scaleDown={0.98}
                style={[
                  styles.row,
                  index < LOCALE_OPTIONS.length - 1 && styles.rowBorder,
                ]}
              >
                <AppText
                  style={[styles.rowLabel, selected && styles.rowLabelOn]}
                  forceKurdishFont={opt.id === "ku" || isKu}
                >
                  {t(opt.labelKey)}
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

        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
              {t("settings.haptics")}
            </AppText>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>
          <View style={[styles.toggleRow, styles.toggleRowLast]}>
            <AppText style={styles.toggleLabel} forceKurdishFont={isKu}>
              {t("settings.sounds")}
            </AppText>
            <Switch value={sounds} onValueChange={setSounds} />
          </View>
        </View>

        <AppText style={[styles.sectionLabel, styles.sectionSpaced]} forceKurdishFont>
          {t("settings.fontSection")}
        </AppText>
        <AppText style={styles.sectionHint} forceKurdishFont>
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
                  index < ALL_RABAR_FONTS.length - 1 && styles.rowBorder,
                  selected && styles.fontRowSelected,
                ]}
              >
                <View style={styles.fontRowLeft}>
                  {selected ? (
                    <Icon3DCheckCircle size={22} />
                  ) : (
                    <View style={styles.radioEmpty} />
                  )}
                  <Text
                    style={[
                      styles.fontPreview,
                      { fontFamily: font },
                      selected && styles.fontPreviewOn,
                    ]}
                  >
                    {t("settings.previewSample")}
                  </Text>
                </View>
                <Icon3DChevronRight size={20} />
              </PressableScale>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedBold",
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedBold",
    marginBottom: 6,
  },
  sectionSpaced: {
    marginTop: 20,
  },
  sectionHint: {
    fontSize: 14,
    color: "#777",
    fontFamily: "DINNextRoundedMedium",
    marginBottom: 12,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#4B4B4B",
    fontFamily: "DINNextRoundedMedium",
  },
  rowLabelOn: {
    color: "#1CB0F6",
    fontFamily: "DINNextRoundedBold",
  },
  radioEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  toggleCard: {
    marginTop: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },
  toggleRowLast: {
    borderBottomWidth: 0,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B4B4B",
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
    backgroundColor: "#E5F7FF",
  },
  fontRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  fontPreview: {
    fontSize: 20,
    color: "#4B4B4B",
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
  },
  fontPreviewOn: {
    color: "#1CB0F6",
  },
});
