import { PressableScale } from "@/components/animations";
import { WidgetPreviewCard } from "@/components/widgets/WidgetPreviewCard";
import { AppText } from "@/components/ui/AppText";
import { useI18n } from "@/hooks/useI18n";
import {
  buildWidgetPayload,
  syncHomeWidget,
} from "@/services/home-widget-sync";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const isExpoGo = Constants.appOwnership === "expo";

export function WidgetsGalleryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, isKu } = useI18n();
  const [syncing, setSyncing] = useState(false);
  const payload = buildWidgetPayload();

  const onRefresh = useCallback(async () => {
    setSyncing(true);
    try {
      await syncHomeWidget();
    } finally {
      setSyncing(false);
    }
  }, []);

  const steps =
    Platform.OS === "ios"
      ? [
          t("widgets.stepIos1"),
          t("widgets.stepIos2"),
          t("widgets.stepIos3"),
        ]
      : Platform.OS === "android"
        ? [
            t("widgets.stepAndroid1"),
            t("widgets.stepAndroid2"),
            t("widgets.stepAndroid3"),
          ]
        : [t("widgets.stepWeb")];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <ArrowLeft size={22} color="#1A2B48" strokeWidth={2.5} />
        </Pressable>
        <AppText style={styles.title} forceKurdishFont={isKu} numberOfLines={2}>
          {t("widgets.title")}
        </AppText>
        <View style={styles.backSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isExpoGo ? (
          <View style={styles.banner}>
            <AppText style={styles.bannerText} forceKurdishFont={isKu}>
              {t("widgets.expoGoHint")}
            </AppText>
          </View>
        ) : null}

        <AppText style={styles.lead} forceKurdishFont={isKu}>
          {t("widgets.subtitle")}
        </AppText>

        <AppText style={styles.sectionLabel} forceKurdishFont={isKu}>
          {t("widgets.howToAdd")}
        </AppText>
        <View style={styles.stepsCard}>
          {steps.map((step, i) => (
            <View
              key={step}
              style={[styles.stepRow, i < steps.length - 1 && styles.stepBorder]}
            >
              <Text style={styles.stepNum}>{i + 1}</Text>
              <AppText style={styles.stepText} forceKurdishFont={isKu}>
                {step}
              </AppText>
            </View>
          ))}
        </View>

        <AppText style={[styles.sectionLabel, styles.sectionSpaced]} forceKurdishFont={isKu}>
          {t("widgets.available")}
        </AppText>

        <View style={styles.grid}>
          <WidgetPreviewCard
            kind="streak"
            title={t("widgets.streakTitle")}
            subtitle={t("widgets.streakSub")}
            streak={payload.streak}
            dailyXp={payload.dailyXp}
            dailyGoalXp={payload.dailyGoalXp}
          />
          <WidgetPreviewCard
            kind="daily"
            title={t("widgets.dailyTitle")}
            subtitle={t("widgets.dailySub")}
            streak={payload.streak}
            dailyXp={payload.dailyXp}
            dailyGoalXp={payload.dailyGoalXp}
          />
          <WidgetPreviewCard
            kind="lesson"
            title={t("widgets.lessonTitle")}
            subtitle={t("widgets.lessonSub")}
            nextTitle={payload.nextTitle}
          />
          <WidgetPreviewCard
            kind="progress"
            title={t("widgets.progressTitle")}
            subtitle={t("widgets.progressSub")}
            streetPct={payload.streetPercent}
            normalPct={payload.normalPercent}
          />
        </View>

        <PressableScale
          onPress={() => void onRefresh()}
          scaleDown={0.98}
          style={styles.syncBtn}
        >
          <AppText style={styles.syncLabel} forceKurdishFont={isKu}>
            {syncing ? t("widgets.syncing") : t("widgets.syncNow")}
          </AppText>
        </PressableScale>

        <AppText style={styles.footnote} forceKurdishFont={isKu}>
          {t("widgets.footnote")}
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F7FF",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EDF2",
  },
  back: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: {
    width: 40,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#1A2B48",
    fontFamily: "DINNextRoundedBold",
  },
  banner: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFE08A",
  },
  bannerText: {
    fontSize: 14,
    color: "#7A5B00",
    lineHeight: 20,
    fontFamily: "DINNextRoundedMedium",
  },
  lead: {
    fontSize: 15,
    color: "#5C6B7A",
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: "DINNextRoundedMedium",
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1A2B48",
    marginBottom: 10,
    fontFamily: "DINNextRoundedBold",
  },
  sectionSpaced: {
    marginTop: 8,
  },
  stepsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EDF2",
    marginBottom: 20,
    overflow: "hidden",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
  },
  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2B59F3",
    color: "#FFF",
    textAlign: "center",
    lineHeight: 26,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: "#1A2B48",
    lineHeight: 22,
    fontFamily: "DINNextRoundedMedium",
  },
  grid: {
    gap: 14,
  },
  syncBtn: {
    marginTop: 20,
    backgroundColor: "#2B59F3",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  syncLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
    fontFamily: "DINNextRoundedBold",
  },
  footnote: {
    marginTop: 14,
    fontSize: 13,
    color: "#8A96A3",
    lineHeight: 19,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
  },
});
