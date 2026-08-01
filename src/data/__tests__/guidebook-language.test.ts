import { describe, expect, it, jest } from "@jest/globals";
import { buildGuidebookFromUnit } from "../guidebook-data";
import { ALL_UNITS } from "../units";

jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("react-native-mmkv", () => ({
  createMMKV: () => ({
    getString: () => undefined,
    set: () => undefined,
    remove: () => undefined,
  }),
}));

describe("guidebook language context", () => {
  it("builds Russian target entries instead of falling back to English", () => {
    const russianUnit = JSON.parse(JSON.stringify(ALL_UNITS[0])) as typeof ALL_UNITS[0];
    russianUnit[0].words[0].english = "Привет";
    const english = buildGuidebookFromUnit(
      0,
      ALL_UNITS[0],
      { displayTheme: "blue" },
      "Unit 1",
      "ku",
      "en",
    );
    const russian = buildGuidebookFromUnit(
      0,
      russianUnit,
      { displayTheme: "blue" },
      "Unit 1",
      "ku",
      "ru",
    );

    expect(russian?.sourceLanguage).toBe("ku");
    expect(russian?.targetLanguage).toBe("ru");
    expect(english?.lessons[0]?.words[0]?.english).toBe("Hello");
    expect(russian?.lessons[0]?.words[0]?.english).toBe("Привет");
    expect(russian?.lessons[0]?.words[0]?.english).toMatch(/[А-Яа-яЁё]/);
  });
});
