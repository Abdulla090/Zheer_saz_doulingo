import AsyncStorage from "@react-native-async-storage/async-storage";

import { WIDGET_SNAPSHOT_KEY } from "../widgets/widget-types";

const MIGRATION_FLAG = "phingo.storage.migrated-v1";

/** Keys previously stored in AsyncStorage — copy into MMKV on first native launch. */
const LEGACY_KEYS = [
  "phingo.app.progress",
  "phingo.app.settings",
  "phingo.admin.content",
  "phingo.onboarding.completed",
  "phingo.app.locale",
  "selectedFont",
  WIDGET_SNAPSHOT_KEY,
  "phingo.ai-teacher.last-attempt",
] as const;

type MmkvLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

export async function migrateLegacyAsyncStorageOnce(
  mmkv: MmkvLike,
): Promise<void> {
  if (mmkv.getString(MIGRATION_FLAG) === "1") return;

  for (const key of LEGACY_KEYS) {
    try {
      if (mmkv.getString(key) != null) continue;
      const legacy = await AsyncStorage.getItem(key);
      if (legacy != null) {
        mmkv.set(key, legacy);
      }
    } catch {
      /* skip key */
    }
  }

  mmkv.set(MIGRATION_FLAG, "1");
}
