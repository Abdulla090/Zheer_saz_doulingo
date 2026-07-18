import { RealConversationTurn, RealAnalysis, SessionWordState, GrammarError } from "../data/voice-tutor-types";
import { GEMINI_SPEECH_MODEL } from "../constants/gemini";
import { generateGeminiContent } from "./gemini-gateway";

// QA test mode flags. Can be toggled via env or runtime.
let testForceFailAnalysis = false;

export function setTestForceFailAnalysis(fail: boolean) {
  testForceFailAnalysis = fail;
}

/**
 * Computes a real conversation analysis session summary.
 * Performs a batch Gemini REST call at the end of the session to extract grammar errors,
 * better alternatives, and overall feedback.
 */
export async function computeSessionAnalysis(
  turns: RealConversationTurn[],
  sessionWords: SessionWordState,
  sessionStartTime: number
): Promise<RealAnalysis> {
  const durationMs = Date.now() - sessionStartTime;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  const durationStr = `${minutes} min ${seconds} sec`;

  // Filter user turns
  const userTurns = turns.filter((t) => t.sender === "user");
  const turnCount = turns.length;

  // Extract all distinct words (>3 characters) spoken by the user for vocabulary usage statistics
  const userTextJoined = userTurns.map((t) => t.text).join(" ");
  const cleanWords = userTextJoined
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const vocabularyUsed = [...new Set(cleanWords)];

  // Basic word bank highlights
  const wordsIntroduced = [...new Set(sessionWords.introduced)];
  const wordsMastered = [...new Set(sessionWords.correct)];
  const wordsForReview = [...new Set(sessionWords.needsReview)];

  // Default fallback object in case of API failure
  const emptyAnalysisWithError = (errorMsg: string): RealAnalysis => ({
    overallScore: null,
    pronunciationScore: null,
    fluencyScore: null,
    grammarErrors: [],
    vocabularyUsed,
    wordsIntroduced,
    wordsMastered,
    wordsForReview,
    turnCount,
    duration: durationStr,
    analysisError: errorMsg,
  });

  // Force-fail check for QA testing
  if (testForceFailAnalysis || process.env.EXPO_PUBLIC_TEST_FAIL_ANALYSIS === "true") {
    return emptyAnalysisWithError("TEST MODE: Forced analysis dependency failure.");
  }

  // If no user turns, return simple blank analysis
  if (userTurns.length === 0) {
    return {
      overallScore: 100,
      pronunciationScore: 100,
      fluencyScore: 100,
      grammarErrors: [],
      vocabularyUsed: [],
      wordsIntroduced: [],
      wordsMastered: [],
      wordsForReview: [],
      turnCount: 0,
      duration: durationStr,
    };
  }

  // Build conversation transcript text for Gemini to analyze
  const transcriptText = turns
    .map((t) => `${t.sender === "user" ? "Student" : "Tutor"}: ${t.text}`)
    .join("\n");

  const prompt = `
You are an expert English language examiner. Analyze the following conversation transcript between a student learning English and their tutor.
Find all grammatical errors made by the student. Offer a corrected sentence and a short explanation for each error.

Response MUST be a single raw JSON object matching this structure. Do NOT wrap in markdown code blocks:
{
  "grammarErrors": [
    {
      "original": "I am flying to London for holiday",
      "corrected": "I am flying to London on vacation",
      "explanation": "Use 'on vacation' or 'for a holiday' instead of 'for holiday'."
    }
  ]
}

Conversation Transcript:
${transcriptText}
`;

  try {
    const data = await generateGeminiContent<any>(
      GEMINI_SPEECH_MODEL,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      },
      12_000,
    );
    const responseText =
      data.candidates?.[0]?.content?.parts
        ?.map((part: any) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!responseText) {
      throw new Error("Gemini returned empty response.");
    }

    // Clean JSON response
    const cleanJson = responseText
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(cleanJson);
    const grammarErrors: GrammarError[] = Array.isArray(parsed.grammarErrors) ? parsed.grammarErrors : [];

    // Calculate pronunciation and fluency scores honestly:
    // 1. Pronunciation is derived directly from the user's real-time vocabulary drill success rate
    // where Gemini Live actually heard and graded their spoken audio.
    let pronunciationScore = 100;
    if (wordsIntroduced.length > 0) {
      pronunciationScore = Math.round((wordsMastered.length / wordsIntroduced.length) * 100);
    }

    // 2. Fluency is estimated from sentence complexity and average user turn length in the transcript
    const userWordsCount = userTurns.reduce((acc, t) => acc + t.text.split(" ").length, 0);
    const avgTurnLength = userWordsCount / userTurns.length;
    let fluencyScore = Math.min(100, Math.round(50 + avgTurnLength * 4));

    // 3. Grammar penalty
    const grammarPenalty = grammarErrors.length * 6;

    const overallScore = Math.max(
      45,
      Math.min(100, Math.round((pronunciationScore * 0.4) + (fluencyScore * 0.3) + (100 - grammarPenalty) * 0.3))
    );

    return {
      overallScore,
      pronunciationScore,
      fluencyScore,
      grammarErrors,
      vocabularyUsed,
      wordsIntroduced,
      wordsMastered,
      wordsForReview,
      turnCount,
      duration: durationStr,
    };
  } catch (err: any) {
    console.warn("[voice-tutor-analysis-engine] Error compiling real analysis:", err);
    return emptyAnalysisWithError("Analysis server is currently unavailable. Please verify your connection.");
  }
}
