import type { AppLocale, I18nKey } from "@/i18n";
import { translate } from "@/i18n";
import type { LessonPathMode } from "./lesson-content";
import type { SectionDataItem } from "./list-items";

const STREET_UNIT_KEYS = [
  "path.street.unit1",
  "path.street.unit2",
  "path.street.unit3",
  "path.street.unit4",
  "path.street.unit5",
  "path.street.unit6",
  "path.street.unit7",
  "path.street.unit8",
  "path.street.unit9",
  "path.street.unit10",
  "path.street.unit11",
  "path.street.unit12",
] as const satisfies readonly I18nKey[];

const NORMAL_UNIT_KEYS = [
  "path.normal.unit1",
  "path.normal.unit2",
  "path.normal.unit3",
  "path.normal.unit4",
  "path.normal.unit5",
  "path.normal.unit6",
  "path.normal.unit7",
  "path.normal.unit8",
  "path.normal.unit9",
  "path.normal.unit10",
  "path.normal.unit11",
  "path.normal.unit12",
  "path.normal.unit13",
] as const satisfies readonly I18nKey[];

export function getPathUnitTitle(
  mode: LessonPathMode,
  unitIndex: number,
  locale: AppLocale,
): string {
  const keys = mode === "normal" ? NORMAL_UNIT_KEYS : STREET_UNIT_KEYS;
  const key = keys[unitIndex];
  if (!key) return "";
  return translate(locale, key);
}

export function splitPathUnitTitle(fullTitle: string) {
  const colonIdx = fullTitle.indexOf(":");
  if (colonIdx === -1) {
    const trimmed = fullTitle.trim();
    return { unitLabel: trimmed, sectionTitle: trimmed };
  }
  return {
    unitLabel: fullTitle.slice(0, colonIdx).trim(),
    sectionTitle: fullTitle.slice(colonIdx + 1).trim(),
  };
}

export function localizePathSections(
  sections: SectionDataItem[],
  mode: LessonPathMode,
  locale: AppLocale,
): SectionDataItem[] {
  return sections.map((section) => ({
    ...section,
    title: getPathUnitTitle(mode, section.unitIndex, locale),
  }));
}
