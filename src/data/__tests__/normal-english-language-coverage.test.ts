import { describe, expect, it, jest } from "@jest/globals";
import { NORMAL_UNITS } from "../normal-english";

jest.mock("../../stores/useSettingsStore", () => ({
  useSettingsStore: { getState: () => ({ englishLevel: 5 }) },
}));

function countPresent<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.filter(predicate).length;
}

describe("Normal English production language coverage", () => {
  it("requires complete Kurdish and Arabic learner-facing fields", () => {
    const lessons = NORMAL_UNITS.flat();
    const words = lessons.flatMap((lesson) => lesson.words);
    const voices = lessons.flatMap((lesson) => lesson.voices);
    const sentences = lessons.flatMap((lesson) => lesson.sentences);
    const fills = lessons.flatMap((lesson) => lesson.fillBlanks);
    const conversations = lessons.flatMap((lesson) => lesson.conversations);

    const coverage = {
      units: NORMAL_UNITS.length,
      lessons: lessons.length,
      topicsKu: countPresent(lessons, (lesson) => Boolean(lesson.topicKu.trim())),
      topicsAr: countPresent(lessons, (lesson) => Boolean(lesson.topicAr?.trim())),
      words: words.length,
      wordsKu: countPresent(words, (word) => Boolean(word.kurdish.trim())),
      wordsAr: countPresent(words, (word) => Boolean(word.arabic?.trim())),
      voices: voices.length,
      voicesKu: countPresent(voices, (voice) => Boolean(voice.prompt.trim() && voice.targetKurdish.trim())),
      voicesAr: countPresent(voices, (voice) => Boolean(voice.promptAr?.trim() && voice.targetArabic?.trim())),
      sentences: sentences.length,
      sentencesKu: countPresent(sentences, (sentence) => Boolean(sentence.kurdish.trim())),
      sentencesAr: countPresent(sentences, (sentence) => Boolean(sentence.arabic?.trim())),
      fills: fills.length,
      fillsKu: countPresent(fills, (fill) => Boolean(fill.hint.trim())),
      fillsAr: countPresent(fills, (fill) => Boolean(fill.arabicHint?.trim())),
      conversations: conversations.length,
      conversationsKu: countPresent(conversations, (conversation) => Boolean(conversation.situation.trim() && conversation.explanation.trim())),
      conversationsAr: countPresent(conversations, (conversation) => Boolean(conversation.situationAr?.trim() && conversation.explanationAr?.trim())),
    };
    expect(coverage.units).toBe(18);
    expect(coverage.lessons).toBe(180);
    expect(NORMAL_UNITS.every((unit) => unit.length === 10)).toBe(true);
    expect(coverage.topicsKu).toBe(coverage.lessons);
    expect(coverage.topicsAr).toBe(coverage.lessons);
    expect(coverage.wordsKu).toBe(coverage.words);
    expect(coverage.wordsAr).toBe(coverage.words);
    expect(coverage.voicesKu).toBe(coverage.voices);
    expect(coverage.voicesAr).toBe(coverage.voices);
    expect(coverage.sentencesKu).toBe(coverage.sentences);
    expect(coverage.sentencesAr).toBe(coverage.sentences);
    expect(coverage.fillsKu).toBe(coverage.fills);
    expect(coverage.fillsAr).toBe(coverage.fills);
    expect(coverage.conversationsKu).toBe(coverage.conversations);
    expect(coverage.conversationsAr).toBe(coverage.conversations);
    expect(
      fills.filter((fill) => fill.wrongs.join("|") === "maybe|just|really"),
    ).toHaveLength(0);
  });
});
