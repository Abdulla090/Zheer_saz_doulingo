import { getUnitsForPath } from "../../data/content-access";
import type { LessonPathMode } from "../../data/types";
import { AdminButton, AdminCard } from "./admin-ui";
import { AppText } from "../../components/ui/AppText";
import { useContentAdminStore } from "../../stores/useContentAdminStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminUnitScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; unit?: string }>();
  const mode = (params.mode === "normal" ? "normal" : "street") as LessonPathMode;
  const unitIndex = Math.max(0, Number(params.unit ?? 0));

  const pathOverride = useContentAdminStore((s) => s.overrides[mode]);
  const addLesson = useContentAdminStore((s) => s.addLesson);
  const removeLesson = useContentAdminStore((s) => s.removeLesson);
  const duplicateLesson = useContentAdminStore((s) => s.duplicateLesson);
  const moveLesson = useContentAdminStore((s) => s.moveLesson);
  const removeUnit = useContentAdminStore((s) => s.removeUnit);
  const duplicateUnit = useContentAdminStore((s) => s.duplicateUnit);
  void pathOverride;

  const unit = getUnitsForPath(mode)[unitIndex];

  if (!unit) {
    return (
      <View style={styles.empty}>
        <AppText forceLatinFont>Unit not found.</AppText>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AdminButton
          label="← Units"
          variant="ghost"
          small
          onPress={() => router.push({ pathname: "/admin", params: { mode } })}
        />
        <AppText style={styles.title} forceLatinFont>
          Unit {unitIndex + 1}
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.actions}>
          <AdminButton label="+ Lesson" onPress={() => addLesson(mode, unitIndex)} />
          <AdminButton
            label="Duplicate unit"
            variant="ghost"
            onPress={() => duplicateUnit(mode, unitIndex)}
          />
          <AdminButton
            label="Delete unit"
            variant="danger"
            onPress={() =>
              Alert.alert("Delete unit?", "This cannot be undone.", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    removeUnit(mode, unitIndex);
                    router.back();
                  },
                },
              ])
            }
          />
        </View>

        {unit.map((lesson, lessonIndex) => (
          <AdminCard
            key={`lesson-${lessonIndex}`}
            title={`Lesson ${lessonIndex + 1}: ${lesson.topic}`}
            actions={
              <View style={styles.cardActions}>
                <AdminButton
                  label="↑"
                  variant="ghost"
                  small
                  onPress={() => moveLesson(mode, unitIndex, lessonIndex, -1)}
                />
                <AdminButton
                  label="↓"
                  variant="ghost"
                  small
                  onPress={() => moveLesson(mode, unitIndex, lessonIndex, 1)}
                />
                <AdminButton
                  label="Edit"
                  small
                  onPress={() =>
                    router.push({
                      pathname: "/admin/lesson",
                      params: {
                        mode,
                        unit: String(unitIndex),
                        lesson: String(lessonIndex),
                      },
                    })
                  }
                />
              </View>
            }
          >
            <AppText style={styles.meta} forceKurdishFont>
              {lesson.topicKu}
            </AppText>
            <AppText style={styles.counts} forceLatinFont>
              {lesson.words.length} words · {lesson.voices.length} voice ·{" "}
              {lesson.sentences.length} sentences · {lesson.fillBlanks.length} fill ·{" "}
              {lesson.conversations.length} convo
            </AppText>
            <View style={styles.row}>
              <AdminButton
                label="Duplicate"
                variant="ghost"
                small
                onPress={() => duplicateLesson(mode, unitIndex, lessonIndex)}
              />
              <AdminButton
                label="Delete"
                variant="danger"
                small
                onPress={() =>
                  Alert.alert("Delete lesson?", lesson.topic, [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => removeLesson(mode, unitIndex, lessonIndex),
                    },
                  ])
                }
              />
              <AdminButton
                label="Preview"
                variant="ghost"
                small
                onPress={() =>
                  router.push({
                    pathname: "/lesson",
                    params: {
                      id: String(unitIndex),
                      li: String(lessonIndex),
                      pi: "0",
                      mode,
                    },
                  })
                }
              />
            </View>
          </AdminCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F7FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#152238" },
  scroll: { padding: 16, paddingBottom: 48, gap: 8 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  meta: { fontSize: 15, color: "#334155", marginBottom: 6 },
  counts: { fontSize: 12, color: "#64748B", marginBottom: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cardActions: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
