import type {
  AiTeacherCriterion,
  AiTeacherRequest,
  AiTeacherResult,
} from "@/data/ai-teacher-types";
import {
  getGeminiApiKey,
  GEMINI_SPEECH_MODEL,
} from "@/constants/gemini";
import { AI_TEACHER_PROMPTS } from "@/data/ai-teacher-prompts";

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
const FETCH_TIMEOUT_MS = 30_000;

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

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

/** Local heuristic scorer — fallback when Gemini is unavailable. */
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

  // 1. If custom URL configured, try that first
  const customUrl = process.env.EXPO_PUBLIC_AI_TEACHER_URL;
  if (customUrl && isAllowedTeacherApiUrl(customUrl)) {
    try {
      const apiKey = process.env.EXPO_PUBLIC_AI_TEACHER_API_KEY;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const res = await fetch(customUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(safe),
        signal: controller.signal,
      });
      clearTimeout(timeout);
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
      // fall through
    }
  }

  // 2. Otherwise, check for local Gemini API key and call Gemini directly
  const geminiKey = getGeminiApiKey();
  if (geminiKey) {
    try {
      const promptDetails = AI_TEACHER_PROMPTS.find((p) => p.id === safe.promptId);
      const taskDescription = promptDetails
        ? `Task: "${promptDetails.title}"\nInstructions: ${promptDetails.scenario}`
        : `Task ID: ${safe.promptId}`;

      const prompt = [
        "You are an IELTS expert English examiner and tutor.",
        "Evaluate the learner's response for the following task:",
        taskDescription,
        "",
        `Learner's response mode: ${safe.mode}`,
        `Learner's response text: "${safe.text}"`,
        "",
        "Evaluate the response and output a detailed IELTS-style evaluation band score between 3.0 and 9.0 in steps of 0.5.",
        "Evaluate across these 4 criteria:",
        "1. fluency: Fluency & coherence score (band 3.0 to 9.0) and feedback note.",
        "2. lexical: Lexical resource score (band 3.0 to 9.0) and feedback note.",
        "3. grammar: Grammatical range and accuracy score (band 3.0 to 9.0) and feedback note.",
        "4. pronunciation: Pronunciation score (band 3.0 to 9.0) and feedback note. (If mode is writing, pronunciation note should represent spelling, punctuation, and cohesive layout).",
        "",
        "Output a valid JSON object matching the following structure. Do not output any markdown formatting or wrapper tags. Respond with ONLY the raw JSON string:",
        "{",
        '  "overallBand": 6.5,',
        '  "criteria": [',
        '    {"key": "fluency", "label": "Fluency & coherence", "band": 6.5, "note": "brief feedback note"},',
        '    {"key": "lexical", "label": "Lexical resource", "band": 6.0, "note": "brief feedback note"},',
        '    {"key": "grammar", "label": "Grammatical range", "band": 7.0, "note": "brief feedback note"},',
        '    {"key": "pronunciation", "label": "Pronunciation", "band": 6.5, "note": "brief feedback note"}',
        "  ],",
        '  "strengths": ["list 1-2 key strengths in English"],',
        '  "improvements": ["list 1-2 specific points to improve in English"],',
        '  "sampleRewrite": "An upgraded, band 8.0-9.0 rewrite of the learner\'s response."',
        "}"
      ].join("\n");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_SPEECH_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
            }
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const payload = await res.json();
        const responseText =
          payload.candidates?.[0]?.content?.parts
            ?.map((part: any) => part.text ?? "")
            .join("")
            .trim() ?? "";

        const jsonText = extractJsonObject(responseText);
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          
          // Validate structure
          if (
            typeof parsed.overallBand === "number" &&
            Array.isArray(parsed.criteria) &&
            parsed.criteria.length >= 4
          ) {
            // Re-map labels to make sure they match expected local labels
            const criteria = parsed.criteria.map((c: any) => ({
              key: c.key,
              label: CRITERION_LABELS[c.key as AiTeacherCriterion["key"]] || c.label,
              band: clampBand(c.band),
              note: c.note || "",
            }));

            return {
              overallBand: clampBand(parsed.overallBand),
              criteria,
              strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
              improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
              sampleRewrite: parsed.sampleRewrite,
            };
          }
        }
      }
    } catch (err) {
      console.warn("Direct Gemini evaluateEnglish failed, falling back to mock:", err);
    }
  }

  // 3. Fallback to mock
  await new Promise((r) => setTimeout(r, 900));
  return mockEvaluateEnglish(safe);
}
