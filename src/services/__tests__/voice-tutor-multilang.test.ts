import { describe, expect, it } from "@jest/globals";
import {
  detectScriptLanguage,
  mergeStreamingTranscript,
} from "../../utils/streaming-transcript";
import { getWordBankForLanguage } from "../../data/voice-tutor-word-banks";
import {
  buildLiveTutorOpeningPrompt,
  buildLiveInputAudioTranscriptionConfig,
  buildLiveTutorSystem,
  getLocalizedLanguageName,
} from "../gemini-live-client";
import { localSpeechAndGrammarReview } from "../voice-tutor-analysis-engine";

import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";

describe("Voice Tutor Multi-Language & Streaming", () => {
  describe("detectScriptLanguage", () => {
    it("detects Russian Cyrillic script", () => {
      const result = detectScriptLanguage("Привет! Как твои дела?", "ku", "ru");
      expect(result.languageCode).toBe("ru");
      expect(result.direction).toBe("ltr");
    });

    it("detects Arabic script for Arabic context", () => {
      const result = detectScriptLanguage("مرحباً بك في تدوين", "ar", "en");
      expect(result.languageCode).toBe("ar");
      expect(result.direction).toBe("rtl");
    });

    it("detects Kurdish script for Kurdish context", () => {
      const result = detectScriptLanguage("سڵاو چۆنی باشیت", "ku", "en");
      expect(result.languageCode).toBe("ku");
      expect(result.direction).toBe("rtl");
    });

    it("detects Spanish with special characters or Spanish target", () => {
      const withAccents = detectScriptLanguage("¡Hola! ¿Cómo estás?", "ku", "es");
      expect(withAccents.languageCode).toBe("es");
      expect(withAccents.direction).toBe("ltr");

      const plainSpanish = detectScriptLanguage("buenos dias amigo", "ku", "es");
      expect(plainSpanish.languageCode).toBe("es");
      expect(plainSpanish.direction).toBe("ltr");
    });

    it("defaults to English for standard Latin text", () => {
      const result = detectScriptLanguage("Hello world", "ku", "en");
      expect(result.languageCode).toBe("en");
      expect(result.direction).toBe("ltr");
    });
  });

  describe("mergeStreamingTranscript", () => {
    it("merges Spanish inverted punctuation seamlessly", () => {
      const start = mergeStreamingTranscript("", "¡");
      const complete = mergeStreamingTranscript(start, "Hola!");
      expect(complete).toBe("¡Hola!");
    });

    it("merges Arabic commas and question marks without leading space", () => {
      const turn1 = mergeStreamingTranscript("مرحبا", "،");
      expect(turn1).toBe("مرحبا،");
      const turn2 = mergeStreamingTranscript("كيف حالك", "؟");
      expect(turn2).toBe("كيف حالك؟");
    });

    it("merges Russian Cyrillic words cleanly", () => {
      const turn1 = mergeStreamingTranscript("Привет", "друг");
      expect(turn1).toBe("Привет друг");
    });
  });

  describe("getWordBankForLanguage", () => {
    it("retrieves Spanish words for Spanish target", () => {
      const words = getWordBankForLanguage("es", 1);
      expect(words.length).toBeGreaterThan(0);
      expect(words.some((w) => w.word === "hola")).toBe(true);
      expect(words.some((w) => w.word === "gracias")).toBe(true);
    });

    it("retrieves Russian words for Russian target", () => {
      const words = getWordBankForLanguage("ru", 1);
      expect(words.length).toBeGreaterThan(0);
      expect(words.some((w) => w.word === "привет")).toBe(true);
      expect(words.some((w) => w.word === "спасибо")).toBe(true);
    });

    it("retrieves Arabic words for Arabic target", () => {
      const words = getWordBankForLanguage("ar", 1);
      expect(words.length).toBeGreaterThan(0);
      expect(words.some((w) => w.word === "مرحبا")).toBe(true);
      expect(words.some((w) => w.word === "شكرا")).toBe(true);
    });

    it("retrieves English words for English target", () => {
      const words = getWordBankForLanguage("en", 1);
      expect(words.length).toBeGreaterThan(0);
      expect(words.some((w) => w.word === "hello")).toBe(true);
    });
  });

  describe("getLocalizedLanguageName", () => {
    it("translates language names accurately across language pairs", () => {
      expect(getLocalizedLanguageName("es", "ku")).toBe("ئیسپانی");
      expect(getLocalizedLanguageName("ru", "ar")).toBe("الروسية");
      expect(getLocalizedLanguageName("en", "es")).toBe("inglés");
      expect(getLocalizedLanguageName("es", "ru")).toBe("испанском языке");
      expect(getLocalizedLanguageName("es", "en")).toBe("Spanish");
    });
  });

  describe("buildLiveTutorOpeningPrompt & System", () => {
    it("builds Spanish opening greeting when native language is Spanish", () => {
      useLocaleStore.setState({ selectedSourceLanguage: "es", selectedTargetLanguage: "en" });
      useSettingsStore.getState().setNativeLang("es");
      useSettingsStore.getState().setTargetLang("en");
      useSettingsStore.getState().setUserName("Carlos");

      const prompt = buildLiveTutorOpeningPrompt();
      expect(prompt).toContain("¡Hola Carlos!");
      expect(prompt).toContain("Soy Rebwar");

      const system = buildLiveTutorSystem();
      expect(system).toContain("native language Spanish");
      expect(system).toContain("saved learning language English");
    });

    it("builds Russian opening greeting when native language is Russian", () => {
      useLocaleStore.setState({ selectedSourceLanguage: "ru", selectedTargetLanguage: "es" });
      useSettingsStore.getState().setNativeLang("ru");
      useSettingsStore.getState().setTargetLang("es");
      useSettingsStore.getState().setUserName("Алексей");

      const prompt = buildLiveTutorOpeningPrompt();
      expect(prompt).toContain("Привет, Алексей!");
      expect(prompt).toContain("Я Rebwar");
      expect(prompt).toContain("в испанском языке");

      const system = buildLiveTutorSystem();
      expect(system).toContain("native language Russian");
      expect(system).toContain("saved learning language Spanish");
    });

    it("restores Kurdish defaults cleanly", () => {
      useLocaleStore.setState({ selectedSourceLanguage: "ku", selectedTargetLanguage: "en" });
      useSettingsStore.getState().setNativeLang("ku");
      useSettingsStore.getState().setTargetLang("en");
      useSettingsStore.getState().setUserName("Aza");

      const prompt = buildLiveTutorOpeningPrompt();
      expect(prompt).toContain("سڵاو Aza گیان!");

      const system = buildLiveTutorSystem();
      expect(system).toContain('Central Kurdish (Sorani), BCP-47 "ku"');
      expect(system).toContain("Never reinterpret it as Turkish, English, Persian, Urdu, or Arabic");
      expect(system).toContain("teach me Spanish");
      expect(system).toContain("saved learning language is only the session default");
      expect(system).not.toContain("3-STAGE INTERACTION WORKFLOW");
    });

    it("keeps Live Tutor synchronized with the language pair changed in settings", () => {
      useLocaleStore.getState().setLanguagePair("ar", "ru");

      expect(useSettingsStore.getState().nativeLang).toBe("ar");
      expect(useSettingsStore.getState().targetLang).toBe("ru");
      expect(buildLiveTutorOpeningPrompt()).toContain("في الروسية");

      useLocaleStore.getState().setLanguagePair("ku", "en");
    });
  });

  describe("live input transcription language bias", () => {
    it("makes Sorani the sole transcription language in Kurdish sessions", () => {
      const config = buildLiveInputAudioTranscriptionConfig("ku", "en");

      expect(config.languageCodes).toEqual(["ku"]);
      expect(config.mode).toBe("VERBATIM");
      expect(config.customVocabulary).toEqual(
        expect.arrayContaining([
          "کوردی",
          "سۆرانی",
          "سلێمانی",
          "هەولێر",
          "سڵاو",
          "بە کوردی قسە بکە",
          "دەکرێت هێواشتر قسە بکەیت",
          "ئەم وشەیە واتای چییە",
        ]),
      );
    });

    it("keeps code-switching support without Sorani vocabulary for other sources", () => {
      expect(buildLiveInputAudioTranscriptionConfig("ar", "es")).toEqual({
        languageCodes: ["ar", "es-419"],
        mode: "VERBATIM",
      });
    });
  });

  describe("localSpeechAndGrammarReview multi-language", () => {
    it("detects Spanish grammar and phrasing mistakes", () => {
      const errors = localSpeechAndGrammarReview("Yo soy de acuerdo con tu plan.");
      expect(errors.some((e) => e.corrected === "estoy de acuerdo")).toBe(true);

      const hungryError = localSpeechAndGrammarReview("Ahora estoy hambriento.");
      expect(hungryError.some((e) => e.corrected === "tengo hambre")).toBe(true);
    });

    it("detects Russian phrasing and grammar mistakes", () => {
      const errors = localSpeechAndGrammarReview("Я есть согласен с вами.");
      expect(errors.some((e) => e.corrected === "я согласен")).toBe(true);

      const morningError = localSpeechAndGrammarReview("В этом утре я гулял.");
      expect(morningError.some((e) => e.corrected.includes("сегодня утром"))).toBe(true);
    });

    it("detects Arabic phrasing mistakes", () => {
      const errors = localSpeechAndGrammarReview("أنا أكون متفق معك.");
      expect(errors.some((e) => e.corrected === "أنا متفق")).toBe(true);
    });
  });
});
