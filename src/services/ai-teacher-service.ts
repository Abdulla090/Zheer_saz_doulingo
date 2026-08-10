import type {
  AiTeacherCriterion,
  AiTeacherRequest,
  AiTeacherResult,
} from "../data/ai-teacher-types";
import { GEMINI_SPEECH_MODEL } from "../constants/gemini";
import { AI_TEACHER_PROMPTS } from "../data/ai-teacher-prompts";
import { generateGeminiContent } from "./gemini-gateway";

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

function clampScore(n: number): number {
  return Math.min(10, Math.max(1, Math.round(n * 10) / 10));
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

function getTaskDescription(promptId?: string): string {
  const promptDetails = AI_TEACHER_PROMPTS.find((p) => p.id === promptId);
  return promptDetails
    ? `Task: "${promptDetails.title}"\nInstructions: ${promptDetails.scenario}`
    : `Task ID: ${promptId ?? "general English response"}`;
}

function normalizeMimeType(mimeType: string): string {
  const value = mimeType.split(";")[0]?.trim().toLowerCase() || "audio/webm";
  if (value === "audio/x-m4a") return "audio/mp4";
  return value.startsWith("audio/") ? value : "audio/webm";
}

function parseResult(responseText: string): AiTeacherResult | null {
  const jsonText = extractJsonObject(responseText);
  if (!jsonText) return null;

  const parsed = JSON.parse(jsonText);
  if (
    typeof parsed.overallScore !== "number" ||
    !Array.isArray(parsed.criteria) ||
    parsed.criteria.length < 4
  ) {
    return null;
  }

  const criteria = parsed.criteria
    .filter(
      (criterion: any) =>
        criterion &&
        typeof criterion.key === "string" &&
        typeof criterion.score === "number",
    )
    .slice(0, 4)
    .map((criterion: any) => ({
      key: criterion.key as AiTeacherCriterion["key"],
      label:
        CRITERION_LABELS[criterion.key as AiTeacherCriterion["key"]] ||
        criterion.label ||
        criterion.key,
      band: clampScore(criterion.score),
      note: typeof criterion.note === "string" ? criterion.note.trim() : "",
    }));

  if (criteria.length < 4) return null;

  return {
    overallBand: clampScore(parsed.overallScore),
    criteria,
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.filter((value: unknown) => typeof value === "string").slice(0, 3)
      : [],
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.filter((value: unknown) => typeof value === "string").slice(0, 3)
      : [],
    sampleRewrite:
      typeof parsed.sampleRewrite === "string"
        ? parsed.sampleRewrite.trim()
        : undefined,
    transcript:
      typeof parsed.transcript === "string" ? parsed.transcript.trim() : undefined,
    source: "ai",
  };
}

function evaluationInstructions(mode: AiTeacherRequest["mode"]): string[] {
  return [
    "Return a fair language-learning rating from 1.0 to 10.0. Use one decimal place when helpful.",
    "Judge the response against the assigned task, not only by its length.",
    "Score these four criteria: fluency, lexical, grammar, pronunciation.",
    mode === "speaking"
      ? "For pronunciation, listen to the audio for intelligibility, rhythm, stress, and clarity. Do not infer pronunciation from transcript alone."
      : "For writing mode, use pronunciation as the compatibility key but score writing clarity, spelling, punctuation, and readability.",
    "Give specific evidence from the learner's response. Never invent words the learner did not say or write.",
    "Return ONLY valid JSON with this shape:",
    '{"overallScore":7.4,"transcript":"exact learner speech or supplied text","criteria":[{"key":"fluency","label":"Fluency & coherence","score":7.2,"note":"specific feedback"},{"key":"lexical","label":"Vocabulary","score":7.6,"note":"specific feedback"},{"key":"grammar","label":"Grammar","score":7.1,"note":"specific feedback"},{"key":"pronunciation","label":"Pronunciation","score":7.5,"note":"specific feedback"}],"strengths":["specific strength"],"improvements":["specific next step"],"sampleRewrite":"a concise improved answer"}',
  ];
}

export async function evaluateEnglish(
  request: AiTeacherRequest,
): Promise<AiTeacherResult> {
  const safe = sanitizeRequest(request);
  if (safe.text.length < 12) {
    throw new Error("Answer too short");
  }

  const taskDescription = getTaskDescription(safe.promptId);

    const prompt = [
      "You are a careful English teacher.",
      "Evaluate the learner's response for the following task:",
      taskDescription,
      "",
      `Learner's response mode: ${safe.mode}`,
      `Learner's response text: "${safe.text}"`,
      "",
      ...evaluationInstructions(safe.mode),
    ].join("\n");

  async function requestEvaluation(): Promise<AiTeacherResult | null> {
      const payload = await generateGeminiContent<any>(
        GEMINI_SPEECH_MODEL,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        },
        {
          featureKey:
            safe.mode === "writing"
              ? "ai_teacher_writing"
              : "ai_teacher_speaking",
          timeoutMs: FETCH_TIMEOUT_MS,
        },
      );
      const responseText =
        payload.candidates?.[0]?.content?.parts
          ?.map((part: any) => part.text ?? "")
          .join("")
          .trim() ?? "";

      return parseResult(responseText);
    }

  const result = await requestEvaluation();
  if (result) return result;
  throw new Error("Twino AI returned an invalid evaluation. Please try again.");
}

export async function evaluateSpokenEnglish(input: {
  audioBase64: string;
  mimeType: string;
  promptId?: string;
}): Promise<AiTeacherResult> {
  if (!input.audioBase64) throw new Error("No audio was captured.");

  const prompt = [
    "You are a careful English speaking teacher.",
    "Listen to the learner's complete audio response and evaluate what they actually said.",
    getTaskDescription(input.promptId),
    "",
    ...evaluationInstructions("speaking"),
  ].join("\n");

  const payload = await generateGeminiContent<any>(
    GEMINI_SPEECH_MODEL,
    {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: normalizeMimeType(input.mimeType),
                data: input.audioBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 1400,
      },
    },
    { featureKey: "ai_teacher_speaking", timeoutMs: 90_000 },
  );

  const responseText =
    payload.candidates?.[0]?.content?.parts
      ?.map((part: any) => part.text ?? "")
      .join("")
      .trim() ?? "";
  const result = parseResult(responseText);
  if (!result?.transcript) {
    throw new Error("Twino AI could not hear enough speech to create a rating.");
  }
  return result;
}
