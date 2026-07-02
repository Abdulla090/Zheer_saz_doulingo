import { appStorage } from "./app-storage";

const STORAGE_KEY = "twino.app.progress";

export function migrateProgress() {
  const savedRaw = appStorage.getItemSync(STORAGE_KEY);
  if (!savedRaw) return;

  try {
    const parsed = JSON.parse(savedRaw);
    let migrated = false;

    // If it has the old flat structure, migrate it to the ku-en map structure
    if (parsed.pathIndexes === undefined) {
      parsed.pathIndexes = {
        "ku-en": parsed.nextLessonPathIndex ?? 0
      };
      parsed.normalPathIndexes = {
        "ku-en": parsed.normalNextLessonPathIndex ?? 0
      };
      parsed.kidsPathIndexes = {
        "ku-en": parsed.kidsNextLessonPathIndex ?? 0
      };
      
      delete parsed.nextLessonPathIndex;
      delete parsed.normalNextLessonPathIndex;
      delete parsed.kidsNextLessonPathIndex;
      
      migrated = true;
    }

    if (migrated) {
      appStorage.setItemSync(STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch (err) {
    console.error("Failed to migrate progress:", err);
  }
}
