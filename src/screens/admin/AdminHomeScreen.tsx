import { getUnitsForPath } from "@/data/content-access";
import { getPathUnitTitle } from "@/data/path-unit-titles";
import type { LessonPathMode } from "@/data/types";
import { AdminButton, AdminCard, AdminSegment } from "@/screens/admin/admin-ui";
import { AppText } from "@/components/ui/AppText";
import { useContentAdminStore } from "@/stores/useContentAdminStore";
import { downloadTextFile } from "@/utils/admin-export";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [mode, setMode] = useState<LessonPathMode>("street");
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const pathOverride = useContentAdminStore((s) => s.overrides[mode]);
  const hasOverride = pathOverride !== null;
  const addUnit = useContentAdminStore((s) => s.addUnit);
  const moveUnit = useContentAdminStore((s) => s.moveUnit);
  const resetToBundled = useContentAdminStore((s) => s.resetToBundled);
  const resetAll = useContentAdminStore((s) => s.resetAll);
  const exportJson = useContentAdminStore((s) => s.exportJson);
  const importJson = useContentAdminStore((s) => s.importJson);
  const ensureEditable = useContentAdminStore((s) => s.ensureEditable);

  const units = getUnitsForPath(mode);

  const confirmReset = () => {
    Alert.alert(
      "Reset content?",
      `Restore bundled ${mode} units and discard your edits?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetToBundled(mode),
        },
      ],
    );
  };

  const handleExport = () => {
    const json = exportJson(mode);
    if (Platform.OS === "web") {
      downloadTextFile(`phingo-${mode}-units.json`, json);
    } else {
      Alert.alert("Export JSON", "Copy this JSON from the import box after export on web, or use web admin to download.");
      setImportText(json);
      setShowImport(true);
    }
  };

  const handleImport = () => {
    const result = importJson(mode, importText);
    if (!result.ok) {
      Alert.alert("Import failed", result.error);
      return;
    }
    setShowImport(false);
    setImportText("");
    Alert.alert("Imported", "Content updated for this path.");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AdminButton
          label="← Back"
          variant="ghost"
          small
          onPress={() => router.back()}
        />
        <AppText style={styles.title} forceLatinFont>
          Content Admin
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <AdminSegment
          value={mode}
          onChange={setMode}
          options={[
            { id: "street", label: "Street" },
            { id: "normal", label: "Normal" },
          ]}
        />

        <View style={styles.statusRow}>
          <AppText style={styles.status} forceLatinFont>
            {hasOverride ? "Using custom content (saved locally)" : "Using bundled content"}
          </AppText>
          <AppText style={styles.count} forceLatinFont>
            {units.length} units
          </AppText>
        </View>

        <View style={styles.actions}>
          <AdminButton label="+ Add unit" onPress={() => addUnit(mode)} />
          <AdminButton label="Export JSON" variant="ghost" onPress={handleExport} />
          <AdminButton
            label={showImport ? "Hide import" : "Import JSON"}
            variant="ghost"
            onPress={() => setShowImport((v) => !v)}
          />
          <AdminButton label="Reset path" variant="danger" onPress={confirmReset} />
        </View>

        {showImport && (
          <AdminCard title="Import JSON">
            <TextInput
              style={styles.importInput}
              multiline
              value={importText}
              onChangeText={setImportText}
              placeholder="Paste UnitBank[] JSON here…"
              placeholderTextColor="#9CA3AF"
            />
            <AdminButton label="Apply import" onPress={handleImport} />
          </AdminCard>
        )}

        {units.map((unit, unitIndex) => {
          const first = unit[0];
          const title =
            getPathUnitTitle(mode, unitIndex, "en") ||
            first?.topic ||
            `Unit ${unitIndex + 1}`;
          return (
            <AdminCard
              key={`${mode}-unit-${unitIndex}`}
              title={`Unit ${unitIndex + 1}: ${title}`}
              actions={
                <View style={styles.cardActions}>
                  <AdminButton
                    label="↑"
                    variant="ghost"
                    small
                    onPress={() => moveUnit(mode, unitIndex, -1)}
                  />
                  <AdminButton
                    label="↓"
                    variant="ghost"
                    small
                    onPress={() => moveUnit(mode, unitIndex, 1)}
                  />
                  <AdminButton
                    label="Open"
                    small
                    onPress={() =>
                      router.push({
                        pathname: "/admin/unit",
                        params: { mode, unit: String(unitIndex) },
                      })
                    }
                  />
                </View>
              }
            >
              <AppText style={styles.meta} forceLatinFont>
                {unit.length} lessons · {first?.topicKu ?? "—"}
              </AppText>
              <AppText style={styles.preview} forceLatinFont>
                Lessons: {unit.map((l) => l.topic).join(", ")}
              </AppText>
            </AdminCard>
          );
        })}

        <AdminButton
          label="Reset ALL paths"
          variant="danger"
          onPress={() =>
            Alert.alert("Reset everything?", "Clear all admin edits for street and normal?", [
              { text: "Cancel", style: "cancel" },
              { text: "Reset all", style: "destructive", onPress: resetAll },
            ])
          }
        />

        <AdminButton
          label="Make editable copy"
          variant="ghost"
          onPress={() => {
            ensureEditable(mode);
            Alert.alert("Ready", "Bundled content copied to local editor.");
          }}
        />
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
  title: { fontSize: 22, fontWeight: "800", color: "#152238" },
  scroll: { padding: 16, paddingBottom: 48, gap: 12 },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  status: { fontSize: 13, color: "#64748B", flex: 1 },
  count: { fontSize: 13, fontWeight: "700", color: "#2B59F3" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cardActions: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  importInput: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontFamily: Platform.OS === "web" ? "monospace" : undefined,
    marginBottom: 12,
    backgroundColor: "#FAFCFF",
  },
  meta: { fontSize: 13, color: "#64748B", marginBottom: 6 },
  preview: { fontSize: 12, color: "#94A3B8", lineHeight: 18 },
});
