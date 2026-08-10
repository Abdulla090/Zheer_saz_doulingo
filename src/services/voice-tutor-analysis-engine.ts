import { RealConversationTurn, RealAnalysis, SessionWordState, GrammarError } from "../data/voice-tutor-types";

// QA test mode flags. Can be toggled via env or runtime.
let testForceFailAnalysis = false;

export function setTestForceFailAnalysis(fail: boolean) {
  testForceFailAnalysis = fail;
}

function localGrammarReview(text: string): GrammarError[] {
  const rules: { pattern: RegExp; corrected: string; explanation: string }[] = [
    {
      pattern: /\bi am agree\b/i,
      corrected: "I agree.",
      explanation: "Agree is a verb, so it does not use am here.",
    },
    {
      pattern: /\bhe go\b/i,
      corrected: "He goes.",
      explanation: "Use goes with he in the present simple.",
    },
    {
      pattern: /\bshe go\b/i,
      corrected: "She goes.",
      explanation: "Use goes with she in the present simple.",
    },
    {
      pattern: /\bi didn't went\b/i,
      corrected: "I didn't go.",
      explanation: "After didn't, use the base form of the verb.",
    },
    {
      pattern: /\bmore better\b/i,
      corrected: "Better.",
      explanation: "Better is already comparative, so more is unnecessary.",
    },
  ];

  return rules
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => ({
      original: text.match(rule.pattern)?.[0] ?? "",
      corrected: rule.corrected,
      explanation: rule.explanation,
    }));
}

/**
 * Computes a real conversation analysis session summary.
 * Builds the included post-session summary locally from the transcript and
 * Live-session word signals, so it never creates a second AI charge.
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

  try {
    // The Live token purchase already covers analysis. Keep the post-session
    // summary local so opening it never creates a second AI charge.
    const grammarErrors = localGrammarReview(userTextJoined);

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
  } catch (err: unknown) {
    console.warn("[voice-tutor-analysis-engine] Error compiling real analysis:", err);
    return emptyAnalysisWithError("Analysis server is currently unavailable. Please verify your connection.");
  }
}
