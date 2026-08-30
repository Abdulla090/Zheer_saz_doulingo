import { describe, expect, it } from "@jest/globals";
import {
  localSpeechAndGrammarReview,
  extractTranscriptRecasts,
  computeSessionAnalysis,
} from "../voice-tutor-analysis-engine";
import {
  RealConversationTurn,
  SessionWordState,
  createEmptySessionWordState,
} from "../../data/voice-tutor-types";

describe("voice-tutor-analysis-engine", () => {
  describe("localSpeechAndGrammarReview", () => {
    it("detects unnatural phrasing and literal translations", () => {
      const text = "Today morning I made a walk and I want to open the TV.";
      const errors = localSpeechAndGrammarReview(text);

      const morningError = errors.find((e) => e.original.toLowerCase() === "today morning");
      expect(morningError).toBeDefined();
      expect(morningError?.corrected).toBe("this morning");
      expect(morningError?.category).toBe("natural_phrasing");

      const walkError = errors.find((e) => e.original.toLowerCase().includes("walk"));
      expect(walkError).toBeDefined();
      expect(walkError?.corrected).toContain("go for a walk");

      const tvError = errors.find((e) => e.original.toLowerCase().includes("open the tv"));
      expect(tvError).toBeDefined();
      expect(tvError?.corrected).toContain("turn on / turn off");
    });

    it("detects incorrect collocations and prepositions", () => {
      const text = "It will depend of the weather. I like to listen music and I am married with Sara.";
      const errors = localSpeechAndGrammarReview(text);

      const dependError = errors.find((e) => e.original.toLowerCase() === "depend of");
      expect(dependError).toBeDefined();
      expect(dependError?.corrected).toBe("depend on");
      expect(dependError?.category).toBe("collocation");

      const musicError = errors.find((e) => e.original.toLowerCase() === "listen music");
      expect(musicError).toBeDefined();
      expect(musicError?.corrected).toBe("listen to music");

      const marriedError = errors.find((e) => e.original.toLowerCase() === "married with");
      expect(marriedError).toBeDefined();
      expect(marriedError?.corrected).toBe("married to");
    });

    it("detects spoken grammar and tense errors", () => {
      const text = "I am agree with you because he go there and I didn't went. It was more better and much people were there.";
      const errors = localSpeechAndGrammarReview(text);

      expect(errors.some((e) => e.original.toLowerCase() === "i am agree")).toBe(true);
      expect(errors.some((e) => e.original.toLowerCase() === "he go")).toBe(true);
      expect(errors.some((e) => e.original.toLowerCase() === "i didn't went")).toBe(true);
      expect(errors.some((e) => e.original.toLowerCase() === "more better")).toBe(true);
      expect(errors.some((e) => e.original.toLowerCase() === "much people")).toBe(true);
    });

    it("handles multiple errors in a single turn with accurate categorization", () => {
      const text = "He go to discuss about the informations on yesterday.";
      const errors = localSpeechAndGrammarReview(text);

      expect(errors.length).toBeGreaterThanOrEqual(3);
      expect(errors.some((e) => e.category === "grammar")).toBe(true);
      expect(errors.some((e) => e.category === "word_choice")).toBe(true);
    });

    it("handles Arabic/Kurdish/RTL or punctuation mixed in without crashing", () => {
      const text = "سڵاو I am agree لەگەڵت.";
      const errors = localSpeechAndGrammarReview(text);
      expect(errors.some((e) => e.corrected === "I agree")).toBe(true);
    });
  });

  describe("extractTranscriptRecasts", () => {
    it("extracts conversational recasts from AI turns", () => {
      const turns: RealConversationTurn[] = [
        {
          id: "1",
          sender: "user",
          text: "I did a photo with my camera.",
          timestamp: "10:00 AM",
        },
        {
          id: "2",
          sender: "ai",
          text: "Native speakers usually say: 'I took a photo'. Did you take it in the park?",
          timestamp: "10:00 AM",
        },
      ];

      const recasts = extractTranscriptRecasts(turns);
      expect(recasts.length).toBeGreaterThan(0);
      expect(recasts[0].original).toBe("I did a photo with my camera.");
      expect(recasts[0].corrected).toBe("I took a photo");
    });

    it("handles turns without recasts smoothly", () => {
      const turns: RealConversationTurn[] = [
        { id: "1", sender: "user", text: "Hello", timestamp: "10:00 AM" },
        { id: "2", sender: "ai", text: "Hi there! How are you?", timestamp: "10:00 AM" },
      ];
      const recasts = extractTranscriptRecasts(turns);
      expect(recasts).toHaveLength(0);
    });
  });

  describe("computeSessionAnalysis", () => {
    it("handles zero user turns gracefully", async () => {
      const sessionWords = createEmptySessionWordState();
      const analysis = await computeSessionAnalysis([], sessionWords, Date.now());
      expect(analysis.turnCount).toBe(0);
      expect(analysis.overallScore).toBe(100);
      expect(analysis.grammarErrors).toHaveLength(0);
    });

    it("computes overall score, speech errors and duration correctly", async () => {
      const turns: RealConversationTurn[] = [
        {
          id: "1",
          sender: "user",
          text: "Today morning I am agree with your plan.",
          timestamp: "10:00 AM",
        },
        {
          id: "2",
          sender: "ai",
          text: "Great! Let's get started.",
          timestamp: "10:00 AM",
        },
      ];

      const sessionWords: SessionWordState = {
        ...createEmptySessionWordState(),
        introduced: ["plan", "morning"],
        correct: ["plan"],
      };

      const startTime = Date.now() - 125000; // ~2 min 5 sec ago
      const analysis = await computeSessionAnalysis(turns, sessionWords, startTime);

      expect(analysis.overallScore).toBeGreaterThan(0);
      expect(analysis.grammarErrors.length).toBeGreaterThanOrEqual(2);
      expect(analysis.grammarErrors.some((e) => e.corrected === "this morning")).toBe(true);
      expect(analysis.grammarErrors.some((e) => e.corrected === "I agree")).toBe(true);
      expect(analysis.wordsIntroduced).toContain("plan");
      expect(analysis.wordsMastered).toContain("plan");
      expect(analysis.duration).toContain("2 min");
    });
  });
});
