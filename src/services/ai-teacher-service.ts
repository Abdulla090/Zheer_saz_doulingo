import type {
  AiTeacherCriterion,
  AiTeacherRequest,
  AiTeacherResult,
} from "@/data/ai-teacher-types";

const CRITERION_LABELS: Record<
  AiTeacherCriterion["key"],
  string
> = {
  fluency: "Fluency & coherence",
  lexical: "Lexical resource",
  grammar: "Grammatical range",
  pronunciation: "Pronunciation",
};

const MAX_ANSWER_CHARS = 4000;

function clampBand(n: number): number {
  return Math.min(9, Math.max(3, Math.round(n * 2) / 2));
}

function isAllowedTeacherApiUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeRequest(request: AiTeacherRequest): AiTeacherRequest {
  return {
    ...request,
    text: request.text.trim().slice(0, MAX_ANSWER_CHARS),
    mode: request.mode === "writing" ? "writing" : "speaking",
  };
}

/** Local heuristic scorer — replace with API when `EXPO_PUBLIC_AI_TEACHER_URL` is set. */
function mockEvaluateEnglish(req: AiTeacherRequest): AiTeacherResult {
  const text = req.text.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWordsPerSentence =
    sentences.length > 0 ? wordCount / sentences.length : wordCount;
  const hasConnectors = /\b(however|because|although|therefore|for example)\b/i.test(
    text,
  );
  const variedVocab =
    new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""))).size /
    Math.max(wordCount, 1);

  const lengthScore =
    req.mode === "speaking"
      ? Math.min(9, 4 + wordCount / 18)
      : Math.min(9, 4 + wordCount / 25);

  const fluency = clampBand(
    lengthScore + (avgWordsPerSentence > 6 && avgWordsPerSentence < 22 ? 1 : 0),
  );
  const lexical = clampBand(
    4 + variedVocab * 12 + (hasConnectors ? 1.5 : 0),
  );
  const grammar = clampBand(
    5 +
      (text.match(/[.!?]/g)?.length ?? 0) * 0.3 -
      (text.match(/\bi\b/g)?.length ?? 0) * 0.05,
  );
  const pronunciation = clampBand(
    req.mode === "speaking" ? fluency * 0.9 + 0.8 : grammar * 0.85,
  );

  const bands = { fluency, lexical, grammar, pronunciation };
  const overallBand = clampBand(
    (fluency + lexical + grammar + pronunciation) / 4,
  );

  const criteria: AiTeacherCriterion[] = (
    Object.keys(bands) as AiTeacherCriterion["key"][]
  ).map((key) => ({
    key,
    label: CRITERION_LABELS[key],
    band: bands[key],
    note:
      bands[key] >= 7
        ? "Strong performance for this criterion."
        : bands[key] >= 5.5
          ? "Good foundation — a few upgrades would lift your band."
          : "Focus here in your next practice attempt.",
  }));

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount >= (req.mode === "speaking" ? 40 : 60)) {
    strengths.push("You developed your answer with enough detail for practice.");
  } else {
    improvements.push("Add more detail — aim for longer, connected ideas.");
  }
  if (hasConnectors) {
    strengths.push("Good use of linking words to connect ideas.");
  } else {
    improvements.push("Use connectors like “however”, “because”, or “for example”.");
  }
  if (variedVocab > 0.55) {
    strengths.push("Vocabulary range shows variety beyond basic words.");
  } else {
    improvements.push("Try synonyms and topic-specific vocabulary.");
  }
  if (grammar >= 6.5) {
    strengths.push("Sentence structure is generally clear.");
  } else {
    improvements.push("Check tense agreement and article use (a/an/the).");
  }

  const sampleRewrite =
    wordCount > 8
      ? `${text.trim().replace(/\s+/g, " ")} In addition, I could expand this answer with a specific example to strengthen my response.`
      : undefined;

  return {
    overallBand,
    criteria,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    sampleRewrite,
  };
}

export async function evaluateEnglish(
  request: AiTeacherRequest,
): Promise<AiTeacherResult> {
  const safe = sanitizeRequest(request);
  if (safe.text.length < 12) {
    throw new Error("Answer too short");
  }

  const url = process.env.EXPO_PUBLIC_AI_TEACHER_URL;

  if (url && isAllowedTeacherApiUrl(url)) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safe),
      });
      if (res.ok) {
        const data = (await res.json()) as AiTeacherResult;
        if (
          typeof data.overallBand === "number" &&
          Array.isArray(data.criteria) &&
          data.criteria.length >= 4
        ) {
          return data;
        }
      }
    } catch {
      /* fall through to mock */
    }
  }

  await new Promise((r) => setTimeout(r, 900));
  return mockEvaluateEnglish(safe);
}
