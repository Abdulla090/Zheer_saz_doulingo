import AsyncStorage from "@react-native-async-storage/async-storage";

const MIGRATION_FLAG = "twino.storage.migrated-v1";

const KEY_MAPPING = {
  "phingo.app.progress": "twino.app.progress",
  "phingo.app.settings": "twino.app.settings",
  "phingo.admin.content": "twino.admin.content",
  "phingo.onboarding.completed": "twino.onboarding.completed",
  "phingo.app.locale": "twino.app.locale",
  "phingo.widget.snapshot": "twino.widget.snapshot",
  "phingo.ai-teacher.last-attempt": "twino.ai-teacher.last-attempt",
  "selectedFont": "selectedFont",
} as const;

type MmkvLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

export async function migrateLegacyAsyncStorageOnce(
  mmkv: MmkvLike,
): Promise<void> {
  if (mmkv.getString(MIGRATION_FLAG) === "1") return;

  // 1) Try to migrate from old "phingo-app" MMKV if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createMMKV } = require("react-native-mmkv") as {
      createMMKV: (opts: { id: string }) => MmkvLike;
    };
    const oldMmkv = createMMKV({ id: "phingo-app" });
    for (const [oldKey, newKey] of Object.entries(KEY_MAPPING)) {
      const val = oldMmkv.getString(oldKey);
      if (val != null && mmkv.getString(newKey) == null) {
        mmkv.set(newKey, val);
      }
    }
  } catch {
    /* old mmkv unavailable or failed */
  }

  // 2) Migrate from legacy AsyncStorage if present
  for (const [oldKey, newKey] of Object.entries(KEY_MAPPING)) {
    try {
      if (mmkv.getString(newKey) != null) continue;
      const legacy = await AsyncStorage.getItem(oldKey);
      if (legacy != null) {
        mmkv.set(newKey, legacy);
      }
    } catch {
      /* skip key */
    }
  }

  mmkv.set(MIGRATION_FLAG, "1");
}
