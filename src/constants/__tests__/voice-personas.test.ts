import { describe, expect, it } from "@jest/globals";
import {
  VOICE_PERSONAS,
  DEFAULT_PERSONA_ID,
  getPersonaById,
  getDefaultPersonaForLanguage,
  getPersonasByLanguage,
} from "../voice-personas";

describe("Voice Personas Catalog", () => {
  it("includes personas for English, Kurdish, Arabic, Spanish, and Global", () => {
    expect(DEFAULT_PERSONA_ID).toBe("rebwar");
    const languages = new Set(VOICE_PERSONAS.map((p) => p.language));
    expect(languages.has("en")).toBe(true);
    expect(languages.has("ku")).toBe(true);
    expect(languages.has("ar")).toBe(true);
    expect(languages.has("es")).toBe(true);
    expect(languages.has("global")).toBe(true);
  });

  it("ensures every persona has required fields and non-empty personality prompts", () => {
    for (const persona of VOICE_PERSONAS) {
      expect(persona.id).toBeTruthy();
      expect(persona.name).toBeTruthy();
      expect(persona.nativeName).toBeTruthy();
      expect(persona.geminiVoice).toBeTruthy();
      expect(persona.openAiFallbackVoice).toBeTruthy();
      expect(persona.accentKey).toBeTruthy();
      expect(persona.tagKey).toBeTruthy();
      expect(persona.descriptionKey).toBeTruthy();
      expect(persona.personalityPrompt.length).toBeGreaterThan(20);
    }
  });

  it("contains specific key personas requested including expanded Kurdish female roster", () => {
    const ids = VOICE_PERSONAS.map((p) => p.id);
    expect(ids).toContain("emma");
    expect(ids).toContain("arthur");
    expect(ids).toContain("shanya");
    expect(ids).toContain("tanya");
    expect(ids).toContain("lanah");
    expect(ids).toContain("viyan");
    expect(ids).toContain("rojin");
    expect(ids).toContain("dilar");
    expect(ids).toContain("rebwar");
    expect(ids).toContain("aso");
    expect(ids).toContain("hewa");
    expect(ids).toContain("zayd");
    expect(ids).toContain("layla");
    expect(ids).toContain("mateo");
    expect(ids).toContain("sofia");

    // Verify rich Kurdish female representation:
    const kurdishPersonas = VOICE_PERSONAS.filter((p) => p.language === "ku");
    const kurdishFemale = kurdishPersonas.filter((p) => p.gender === "female");
    expect(kurdishFemale.length).toBeGreaterThanOrEqual(5);

    // Verify Kurdish personas have authentic Sorani instructions:
    for (const kp of kurdishPersonas) {
      expect(kp.nativeName).toBeTruthy();
      expect(kp.personalityPrompt).toContain("Kurdish");
    }
  });

  it("resolves personas by ID and falls back gracefully", () => {
    expect(getPersonaById("rebwar").name).toBe("Rebwar");
    expect(getPersonaById("zayd").name).toBe("Zayd");
    expect(getPersonaById("emma").name).toBe("Emma");

    // Legacy voice mapping fallback:
    expect(getPersonaById("Aoede").geminiVoice).toBe("Aoede");
    expect(getPersonaById("Charon").geminiVoice).toBe("Charon");

    // Unknown id fallback:
    expect(getPersonaById("non-existent-id").id).toBe(VOICE_PERSONAS[0].id);
    expect(getPersonaById(null).id).toBe(VOICE_PERSONAS[0].id);
  });

  it("resolves default persona per source language", () => {
    expect(getDefaultPersonaForLanguage("ku").id).toBe("rebwar");
    expect(getDefaultPersonaForLanguage("ar").id).toBe("zayd");
    expect(getDefaultPersonaForLanguage("es").id).toBe("mateo");
    expect(getDefaultPersonaForLanguage("en").id).toBe("emma");
  });

  it("filters personas by language correctly", () => {
    const englishPersonas = getPersonasByLanguage("en");
    expect(englishPersonas.every((p) => p.language === "en")).toBe(true);
    expect(englishPersonas.length).toBeGreaterThanOrEqual(2);

    const kurdishPersonas = getPersonasByLanguage("ku");
    expect(kurdishPersonas.every((p) => p.language === "ku")).toBe(true);
    expect(kurdishPersonas.length).toBeGreaterThanOrEqual(2);

    const arabicPersonas = getPersonasByLanguage("ar");
    expect(arabicPersonas.every((p) => p.language === "ar")).toBe(true);
    expect(arabicPersonas.length).toBeGreaterThanOrEqual(2);

    const allPersonas = getPersonasByLanguage("all");
    expect(allPersonas.length).toBe(VOICE_PERSONAS.length);
  });
});
