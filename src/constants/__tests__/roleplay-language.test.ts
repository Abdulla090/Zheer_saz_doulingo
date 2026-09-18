import { describe, expect, it } from "@jest/globals";
import {
  getLocalizedRolePlayScenario,
  getRolePlayLanguageName,
  getRolePlaySpeechLocale,
  resolveRolePlayTargetCode,
} from "../roleplay-language";

describe("roleplay target-language configuration", () => {
  it("resolves supported learning targets and safely falls back", () => {
    expect(resolveRolePlayTargetCode("ar")).toBe("ar");
    expect(resolveRolePlayTargetCode("ru")).toBe("ru");
    expect(resolveRolePlayTargetCode("ku")).toBe("en");
  });

  it("uses the target language for scenario copy and TTS", () => {
    expect(getRolePlayLanguageName("ar")).toBe("Arabic");
    expect(getRolePlaySpeechLocale("ar")).toBe("ar-SA");
    expect(getRolePlaySpeechLocale("ru")).toBe("ru-RU");
    expect(getLocalizedRolePlayScenario("cafe", "ar").initialMessage).toContain("ماذا تحب");
    expect(getLocalizedRolePlayScenario("job", "ru").phrases[0]).toContain("Проект");
  });
});
