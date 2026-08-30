import { RealConversationTurn, RealAnalysis, SessionWordState, GrammarError } from "../data/voice-tutor-types";

// QA test mode flags. Can be toggled via env or runtime.
let testForceFailAnalysis = false;

export function setTestForceFailAnalysis(fail: boolean) {
  testForceFailAnalysis = fail;
}

interface SpeechRule {
  pattern: RegExp;
  originalFormatter?: (match: RegExpMatchArray) => string;
  corrected: string;
  explanation: string;
  category: "natural_phrasing" | "word_choice" | "grammar" | "collocation";
  nativeTip?: string;
}

const NATIVE_SPEECH_RULES: SpeechRule[] = [
  // ── Natural Spoken Expressions & Literal Translations ──
  {
    pattern: /\btoday morning\b/i,
    corrected: "this morning",
    explanation: "Native English speakers say 'this morning' instead of 'today morning'.",
    category: "natural_phrasing",
    nativeTip: "Use 'this morning', 'this afternoon', 'this evening'.",
  },
  {
    pattern: /\byesterday night\b/i,
    corrected: "last night",
    explanation: "Native speakers use 'last night' rather than 'yesterday night'.",
    category: "natural_phrasing",
    nativeTip: "Always say 'last night' when referring to the previous evening.",
  },
  {
    pattern: /\b(?:open|close)\s+(?:the\s+)?(?:tv|television|light|lights|computer|phone|radio)\b/i,
    corrected: "turn on / turn off the device/light",
    explanation: "In English, electronic devices and lights are 'turned on' or 'turned off', not opened/closed.",
    category: "natural_phrasing",
    nativeTip: "Say 'Could you turn on the light?' or 'Turn off the TV'.",
  },
  {
    pattern: /\b(?:make|made|making|do|did|doing)\s+(?:a\s+)?(?:photo|photos|picture|pictures)\b/i,
    corrected: "take a photo / take photos",
    explanation: "Native speakers say 'take a photo' or 'take pictures', never 'make a photo'.",
    category: "natural_phrasing",
    nativeTip: "Say 'Let's take a picture together!'.",
  },
  {
    pattern: /\b(?:make|made|making|do|did|doing)\s+(?:a\s+)?walk\b/i,
    corrected: "go for a walk / take a walk",
    explanation: "The natural native idiom is 'go for a walk' or 'take a walk'.",
    category: "natural_phrasing",
    nativeTip: "Say 'I went for a walk this morning'.",
  },
  {
    pattern: /\b(?:make|made|making|do|did|doing)\s+(?:a\s+)?shower\b/i,
    corrected: "take a shower / have a shower",
    explanation: "Native speakers say 'take a shower' or 'have a shower'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\b(?:make|made|making)\s+(?:a\s+)?question\b/i,
    corrected: "ask a question",
    explanation: "In English, you 'ask a question' rather than 'make a question'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\btake\s+(?:a\s+)?decision\b/i,
    corrected: "make a decision",
    explanation: "Native speakers 'make a decision' (collocation with make, not take).",
    category: "collocation",
  },
  {
    pattern: /\b(?:give|gave|giving)\s+(?:a|an)\s+(?:exam|test)\b/i,
    corrected: "take an exam / sit a test",
    explanation: "Students 'take' or 'sit' an exam; teachers 'give' the exam.",
    category: "natural_phrasing",
  },
  {
    pattern: /\bexplain\s+me\b/i,
    corrected: "explain to me",
    explanation: "'Explain' requires the preposition 'to' before the person (e.g. 'Can you explain this to me?').",
    category: "grammar",
  },
  {
    pattern: /\brepeat\s+again\b/i,
    corrected: "repeat / say that again",
    explanation: "'Repeat' already means say again. Say 'Could you repeat that?' or 'Say that again'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\bin\s+the\s+other\s+hand\b/i,
    corrected: "on the other hand",
    explanation: "The correct conversational idiom is 'on the other hand'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\bhow\s+(?:do\s+)?you\s+call\s+this\b/i,
    corrected: "what do you call this?",
    explanation: "When asking for the name of an object, native speakers say 'What do you call this?'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\b(?:i\s+)?very\s+like\b/i,
    corrected: "I really like / I like ... a lot",
    explanation: "In natural English, use 'really like' or put 'a lot' at the end: 'I like it a lot'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\bi\s+have\s+\d{1,2}\s+years\b/i,
    corrected: "I am [age] years old",
    explanation: "In English, express age with 'I am' ('to be'), not 'I have'.",
    category: "grammar",
  },
  {
    pattern: /\bloose\s+weight\b/i,
    corrected: "lose weight",
    explanation: "'Lose' (one 'o') means shed pounds; 'loose' (two 'o's) means not tight.",
    category: "word_choice",
  },
  {
    pattern: /\b(?:lost|lose)\s+my\s+weight\b/i,
    corrected: "lose weight / lost weight",
    explanation: "Native speakers say 'lose weight' without the possessive 'my'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\b(?:on|in)\s+yesterday\b/i,
    corrected: "yesterday",
    explanation: "'Yesterday', 'today', and 'tomorrow' do not take prepositions like 'on' or 'in'.",
    category: "grammar",
  },
  {
    pattern: /\bat\s+the\s+night\b/i,
    corrected: "at night",
    explanation: "The standard phrase is 'at night' (without 'the').",
    category: "natural_phrasing",
  },
  {
    pattern: /\b(?:do|did|doing)\s+(?:a\s+)?party\b/i,
    corrected: "have a party / throw a party",
    explanation: "Native speakers 'have a party' or 'throw a party', not 'do a party'.",
    category: "collocation",
  },

  // ── Native Collocations & Prepositions ──
  {
    pattern: /\bdepend\s+of\b/i,
    corrected: "depend on",
    explanation: "The verb 'depend' is always paired with the preposition 'on'.",
    category: "collocation",
  },
  {
    pattern: /\blisten\s+music\b/i,
    corrected: "listen to music",
    explanation: "The verb 'listen' requires 'to' before an object ('listen to music').",
    category: "collocation",
  },
  {
    pattern: /\bmarried\s+with\b/i,
    corrected: "married to",
    explanation: "In English, a person is 'married to' someone, not 'married with'.",
    category: "collocation",
  },
  {
    pattern: /\barrive\s+to\s+(?:the\s+)?(?:airport|hotel|station|city|home|house)\b/i,
    corrected: "arrive at / in",
    explanation: "Use 'arrive at' for places/buildings and 'arrive in' for cities/countries.",
    category: "collocation",
  },
  {
    pattern: /\bgood\s+in\s+(?:english|math|sports|cooking|art|languages)\b/i,
    corrected: "good at [skill]",
    explanation: "Native speakers say 'good at' when describing proficiency or skills.",
    category: "collocation",
  },
  {
    pattern: /\binterested\s+(?:about|for)\b/i,
    corrected: "interested in",
    explanation: "The adjective 'interested' takes the preposition 'in'.",
    category: "collocation",
  },
  {
    pattern: /\bdiscuss\s+about\b/i,
    corrected: "discuss [topic]",
    explanation: "'Discuss' is a transitive verb and takes the topic directly without 'about'.",
    category: "grammar",
  },
  {
    pattern: /\breply\s+me\b/i,
    corrected: "reply to me / answer me",
    explanation: "Use 'reply to me' (with 'to') or 'answer me' (without 'to').",
    category: "grammar",
  },
  {
    pattern: /\bcongratulate\s+for\b/i,
    corrected: "congratulate on",
    explanation: "In English, you congratulate someone 'on' their achievement.",
    category: "collocation",
  },

  // ── Common Spoken Grammar & Agreement ──
  {
    pattern: /\bi\s+(?:am|'m)\s+agree\b/i,
    corrected: "I agree",
    explanation: "'Agree' is already a verb; native speakers say 'I agree', not 'I am agree'.",
    category: "grammar",
  },
  {
    pattern: /\bhe\s+go\b/i,
    corrected: "He goes",
    explanation: "Third-person singular 'he' requires 'goes' in the present simple.",
    category: "grammar",
  },
  {
    pattern: /\bshe\s+go\b/i,
    corrected: "She goes",
    explanation: "Third-person singular 'she' requires 'goes' in the present simple.",
    category: "grammar",
  },
  {
    pattern: /\b(?:he|she|it)\s+don't\b/i,
    corrected: "doesn't",
    explanation: "Use 'doesn't' (does not) with third-person singular subjects (he, she, it).",
    category: "grammar",
  },
  {
    pattern: /\bi\s+didn't\s+went\b/i,
    corrected: "I didn't go",
    explanation: "After 'didn't', always use the base form of the verb ('go', not 'went').",
    category: "grammar",
  },
  {
    pattern: /\b(?:didn't|did\s+not)\s+(?:saw|came|had|ate|took|bought)\b/i,
    corrected: "didn't + base verb (didn't see/come/have/eat/take/buy)",
    explanation: "After 'didn't', always use the base infinitive form of the verb.",
    category: "grammar",
  },
  {
    pattern: /\bmore\s+(?:better|easier|faster|harder|cheaper|taller|older)\b/i,
    corrected: "much better / easier / faster",
    explanation: "Comparative adjectives already end in -er/irregular. Use 'much' for emphasis.",
    category: "grammar",
  },
  {
    pattern: /\bmuch\s+(?:people|friends|cars|books|things|questions)\b/i,
    corrected: "many [plural] / a lot of [plural]",
    explanation: "Use 'many' or 'a lot of' with countable plural nouns (e.g. 'many people').",
    category: "word_choice",
  },
  {
    pattern: /\bevery\s+people\b/i,
    corrected: "everyone / everybody",
    explanation: "Say 'everyone' or 'everybody' instead of 'every people'.",
    category: "natural_phrasing",
  },
  {
    pattern: /\b(?:informations|advices|equipments|homeworks)\b/i,
    corrected: "information / advice / equipment / homework (uncountable)",
    explanation: "These words are uncountable in English and never take a plural '-s'.",
    category: "word_choice",
  },
  {
    pattern: /\bone\s+of\s+my\s+friend\b/i,
    corrected: "one of my friends",
    explanation: "The phrase 'one of my...' is always followed by a plural noun ('friends').",
    category: "grammar",
  },
  {
    pattern: /\b(?:i\s+am|i'm)\s+working\s+(?:here\s+)?since\s+\d+\s+(?:years?|months?)\b/i,
    corrected: "I have been working here for [duration]",
    explanation: "Use the present perfect continuous ('have been working') with 'for' when expressing duration.",
    category: "grammar",
  },
];

/**
 * Reviews user spoken text against authentic native speech patterns,
 * awkward literal translations, miscollocations, and grammar rules.
 */
export function localSpeechAndGrammarReview(text: string): GrammarError[] {
  const detected: GrammarError[] = [];
  const seenOriginals = new Set<string>();

  for (const rule of NATIVE_SPEECH_RULES) {
    const match = text.match(rule.pattern);
    if (match) {
      const original = match[0].trim();
      const key = original.toLowerCase();
      if (!seenOriginals.has(key)) {
        seenOriginals.add(key);
        detected.push({
          original,
          corrected: rule.corrected,
          explanation: rule.explanation,
          category: rule.category,
          nativeTip: rule.nativeTip,
        });
      }
    }
  }

  return detected;
}

/**
 * Extracts on-the-fly corrections or native speech recasts made by the AI during live conversation.
 */
export function extractTranscriptRecasts(turns: RealConversationTurn[]): GrammarError[] {
  const dynamicErrors: GrammarError[] = [];
  const seenOriginals = new Set<string>();

  for (let i = 0; i < turns.length - 1; i++) {
    const currentTurn = turns[i];
    const nextTurn = turns[i + 1];

    if (currentTurn.sender === "user" && nextTurn.sender === "ai") {
      const aiText = nextTurn.text;

      // Check for explicit recast patterns like "Native speakers say: ...", "You can say: ...", "More naturally: ..."
      const recastPatterns = [
        /(?:native speakers (?:usually )?say|more naturally|you can say|a more natural way is|instead of ['"].*?['"](?:,| )?(?:say|use))\s*[:\-]?\s*["“'‘]?([^"”'’\n.!?]+)["”'’]?/i,
      ];

      for (const pattern of recastPatterns) {
        const match = aiText.match(pattern);
        if (match && match[1]) {
          const suggested = match[1].replace(/^['"“‘]+|['"”’]+$/g, "").trim();
          const userSnippet = currentTurn.text.trim();
          if (userSnippet && suggested && !seenOriginals.has(userSnippet.toLowerCase())) {
            seenOriginals.add(userSnippet.toLowerCase());
            dynamicErrors.push({
              original: userSnippet.length > 50 ? `${userSnippet.slice(0, 47)}...` : userSnippet,
              corrected: suggested,
              explanation: "Identified and recast naturally during your live conversation.",
              category: "natural_phrasing",
            });
          }
          break;
        }
      }
    }
  }

  return dynamicErrors;
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
    const ruleErrors = localSpeechAndGrammarReview(userTextJoined);
    const recastErrors = extractTranscriptRecasts(turns);

    // Merge and deduplicate
    const combinedErrors: GrammarError[] = [...ruleErrors];
    const seenErrors = new Set(ruleErrors.map((e) => e.original.toLowerCase()));

    for (const r of recastErrors) {
      if (!seenErrors.has(r.original.toLowerCase())) {
        seenErrors.add(r.original.toLowerCase());
        combinedErrors.push(r);
      }
    }

    const grammarErrors = combinedErrors;

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
