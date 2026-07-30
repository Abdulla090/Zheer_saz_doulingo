import { describe, expect, it } from "@jest/globals";
import {
  SOURCE_LANGUAGES,
  TARGET_LANGUAGE_CATALOG,
  TARGET_LANGUAGES,
  UI_LANGUAGES,
  isSupportedLanguagePair,
} from "../languages";

describe("language availability", () => {
  it("keeps source and target catalogs explicit", () => {
    const sourceIds = SOURCE_LANGUAGES.map((language) => language.id);
    expect(sourceIds).toEqual(["ku", "ar"]);
    expect(sourceIds).not.toContain("ru");
    expect(sourceIds).not.toContain("es");
    expect(TARGET_LANGUAGES.map((language) => language.id)).toEqual(["ru", "ar", "en"]);
    expect(TARGET_LANGUAGE_CATALOG.map((language) => language.id)).toEqual(["en", "ar", "ru"]);
    expect(TARGET_LANGUAGE_CATALOG.find((language) => language.id === "ar")?.curriculumReady).toBe(true);
    expect(TARGET_LANGUAGE_CATALOG.find((language) => language.id === "ru")?.curriculumReady).toBe(true);
    expect(UI_LANGUAGES.map((language) => language.id)).toEqual(["ku", "ar", "en"]);
    expect(isSupportedLanguagePair("ku", "en")).toBe(true);
    expect(isSupportedLanguagePair("ar", "en")).toBe(true);
    expect(isSupportedLanguagePair("ku", "ar")).toBe(true);
    expect(isSupportedLanguagePair("ku", "ru")).toBe(true);
    expect(isSupportedLanguagePair("ar", "ru")).toBe(true);
    expect(isSupportedLanguagePair("en", "ar")).toBe(false);
  });
});
