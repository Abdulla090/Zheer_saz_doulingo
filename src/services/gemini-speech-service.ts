import {
  GEMINI_SPEECH_MODEL,
  getGeminiApiKey,
  isGeminiConfigured,
} from "../constants/gemini";
import { matchesTarget } from "../utils/speech-match";

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

export async function generateRolePlayResponse(
  scenarioId: string,
  userText: string,
  history: { sender: "user" | "ai"; text: string }[]
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const scenarioDetails: Record<string, { role: string; instructions: string }> = {
    cafe: {
      role: "a polite French café barista",
      instructions: "The user is a customer ordering a coffee or croissant. Keep it light, offer pastries, and respond in character."
    },
    space: {
      role: "a strict Mars transit flight gate agent",
      instructions: "The user is a space traveler whose baggage exceeds weight limits. Demand justifications in a robotic but amusing gate agent persona."
    },
    job: {
      role: "an AI Engineering hiring manager",
      instructions: "The user is an applicant. Ask questions about optimizing small language models, quantization, or mobile AI deployment."
    },
    market: {
      role: "a persistent bazaar merchant bargaining over a high-quality rug",
      instructions: "The user is trying to bargain. Start high (500 gold coins), be dramatic, and bargain back-and-forth."
    }
  };

  const sc = scenarioDetails[scenarioId] ?? {
    role: "a conversational partner",
    instructions: "Engage in a friendly roleplay scenario."
  };

  const historyPrompt = history
    .map((h) => `${h.sender === "user" ? "Learner" : "You (AI roleplayer)"}: ${h.text}`)
    .join("\n");

  const prompt = [
    `You are roleplaying as ${sc.role}.`,
    `Scenario Context & Instructions: ${sc.instructions}`,
    `Keep your response simple (A2-B1 English), warm, and concise (1-2 sentences).`,
    `Do not include any translations, explanations, or metadata. Reply ONLY with your in-character spoken line.`,
    `\nHistory:`,
    historyPrompt,
    `Learner: ${userText}`,
    `You (AI roleplayer):`
  ].join("\n");

  const controller = new AbortController();
  const res = await fetch(
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
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 128,
        }
      }),
      signal: controller.signal
    }
  );

  const data = (await res.json()) as GeminiGenerateResponse;
  if (!res.ok) {
    throw new Error(data.error?.message ?? `Gemini request failed (${res.status})`);
  }

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? "";

  return text || "Of course! Let's continue.";
}
