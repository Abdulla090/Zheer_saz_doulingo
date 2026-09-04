import { describe, expect, it } from "@jest/globals";
import { getTargetLanguagesForSource, LANGUAGES } from "../../../../config/languages";
import { useLocaleStore } from "../../../../stores/useLocaleStore";

describe("Duolingo Course Dropdown Logic", () => {
  it("resolves available courses for Kurdish learner", () => {
    const targets = getTargetLanguagesForSource("ku");
    const targetCodes = targets.map((t) => t.id);

    expect(targetCodes).toContain("en");
    expect(targetCodes).toContain("ar");
    expect(targetCodes).toContain("ru");
  });

  it("updates target language in useLocaleStore", () => {
    // Initial state
    useLocaleStore.getState().setLanguagePair("ku", "en");
    expect(useLocaleStore.getState().selectedTargetLanguage).toBe("en");
    expect(useLocaleStore.getState().selectedSourceLanguage).toBe("ku");

    // Switch to Arabic
    useLocaleStore.getState().setLanguagePair("ku", "ar");
    expect(useLocaleStore.getState().selectedTargetLanguage).toBe("ar");

    // Switch to Russian
    useLocaleStore.getState().setLanguagePair("ku", "ru");
    expect(useLocaleStore.getState().selectedTargetLanguage).toBe("ru");

    // Switch back to English
    useLocaleStore.getState().setLanguagePair("ku", "en");
    expect(useLocaleStore.getState().selectedTargetLanguage).toBe("en");
  });

  it("rejects unsupported language pair transitions", () => {
    useLocaleStore.getState().setLanguagePair("ku", "en");
    // 'es' is not supported as target in SUPPORTED_LANGUAGE_PAIRS
    useLocaleStore.getState().setLanguagePair("ku", "es");
    expect(useLocaleStore.getState().selectedTargetLanguage).toBe("en");
  });

  it("has Spanish registered with preview metadata", () => {
    expect(LANGUAGES.es).toBeDefined();
    expect(LANGUAGES.es.code).toBe("es");
    expect(LANGUAGES.es.supportedAsTarget).toBe(false);
  });
});
