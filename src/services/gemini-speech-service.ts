import {
  GEMINI_SPEECH_MODEL,
  getGeminiApiKey,
  isGeminiConfigured,
} from "@/constants/gemini";
import { matchesTarget } from "@/utils/speech-match";

export type GeminiSpeechEvaluation = {
  transcript: string;
  matches: boolean;
};

const API_TIMEOUT_MS = 20_000;

type GeminiGenerateResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
  }[];
  error?: { message?: string };
};

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

function parseEvaluationPayload(
  text: string,
  targetPhrase: string,
): GeminiSpeechEvaluation {
  const jsonText = extractJsonObject(text);
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText) as {
        transcript?: unknown;
        matches?: unknown;
      };
      const transcript =
        typeof parsed.transcript === "string" ? parsed.transcript.trim() : "";
      if (transcript) {
        const matches =
          typeof parsed.matches === "boolean"
            ? parsed.matches
            : matchesTarget(transcript, targetPhrase);
        return { transcript, matches };
      }
    } catch {
      /* fall through */
    }
  }

  const transcript = text.trim();
  return {
    transcript,
    matches: matchesTarget(transcript, targetPhrase),
  };
}

export { isGeminiConfigured };

function normalizeGeminiMimeType(mimeType: string): string {
  const base = mimeType.split(";")[0]?.trim().toLowerCase() || "audio/webm";
  if (base === "audio/x-m4a") return "audio/mp4";
  if (base.startsWith("audio/")) return base;
  return "audio/webm";
}

export async function evaluateSpeechWithGemini(input: {
  audioBase64: string;
  mimeType: string;
  targetPhrase: string;
}): Promise<GeminiSpeechEvaluation> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  if (!input.audioBase64) {
    throw new Error("No audio was captured.");
  }

  const mimeType = normalizeGeminiMimeType(input.mimeType);

  const prompt = [
    "You evaluate English speaking practice for language learners.",
    `The learner was asked to say: "${input.targetPhrase}"`,
    "Listen to the audio and reply with ONLY valid JSON (no markdown):",
    '{"transcript":"what they said in English","matches":true}',
    "Set matches to true when the meaning matches the target phrase, allowing minor wording or pronunciation differences.",
    "Set matches to false when unrelated or clearly wrong.",
  ].join("\n");

  const controller = new AbortController();

  const fetchPromise = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_SPEECH_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: input.audioBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 256,
        },
      }),
      signal: controller.signal,
    },
  );

  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error("Network timeout: Gemini request took too long."));
    }, API_TIMEOUT_MS);
  });

  try {
    const res = (await Promise.race([
      fetchPromise,
      timeoutPromise,
    ])) as Response;
    clearTimeout(timeoutId!);

    const data = (await res.json()) as GeminiGenerateResponse;
    if (!res.ok) {
      throw new Error(
        data.error?.message ?? `Gemini request failed (${res.status})`,
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return parseEvaluationPayload(text, input.targetPhrase);
  } finally {
    clearTimeout(timeoutId!);
  }
}
