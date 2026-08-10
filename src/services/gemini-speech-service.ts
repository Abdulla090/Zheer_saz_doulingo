import {
  GEMINI_SPEECH_MODEL,
  isGeminiConfigured,
} from "../constants/gemini";
import { generateGeminiContent } from "./gemini-gateway";
import type { AiFeatureKey } from "../types/entitlements";
import { matchesTarget } from "../utils/speech-match";

export type GeminiSpeechEvaluation = {
  transcript: string;
  matches: boolean;
};

const API_TIMEOUT_MS = 25_000;

type GeminiGenerateResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
  }[];
  error?: { message?: string };
};

type GeminiGenerateBody = {
  contents: {
    role?: "user" | "model";
    parts: ({ text: string } | { inline_data: { mime_type: string; data: string } })[];
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
};

type ReadingDifficulty = "Beginner" | "Intermediate" | "Advanced";

function extractGeminiText(data: GeminiGenerateResponse): string {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

async function requestGeminiGenerateContent(
  body: GeminiGenerateBody,
  featureKey: Exclude<AiFeatureKey, `live_tutor_${number}`>,
  timeoutMs = API_TIMEOUT_MS,
  model?: string,
): Promise<GeminiGenerateResponse> {
  return generateGeminiContent<GeminiGenerateResponse>(
    model || GEMINI_SPEECH_MODEL,
    body,
    { featureKey, timeoutMs },
  );
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

function extractJsonArray(text: string): string | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
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
  if (!input.audioBase64) {
    console.warn("[evaluateSpeechWithGemini] audioBase64 missing!");
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

  const data = await requestGeminiGenerateContent(
    {
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
    },
    "reading_pronunciation_evaluation",
  );

  const text = extractGeminiText(data);
  if (!text) throw new Error("Gemini returned an empty response.");
  return parseEvaluationPayload(text, input.targetPhrase);
}

export async function generateRolePlayResponse(
  scenarioId: string,
  userText: string,
  history: { sender: "user" | "ai"; text: string }[]
): Promise<string> {
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
    .slice(-8)
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

  const data = await requestGeminiGenerateContent(
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 96,
      },
    },
    "roleplay_voice_response",
    12_000,
  );

  const text = extractGeminiText(data);

  return text || "Of course! Let's continue.";
}

export type AiPodcastTemplateId =
  | "daily_lesson"
  | "story_mode"
  | "exam_coach"
  | "conversation"
  | "quick_explainer"
  | "pronunciation_drill";

export type AiPodcastSegment = {
  text: string;
  lang: "en" | "ku";
};

export type AiPodcastEpisode = {
  title: string;
  subtitle: string;
  segments: AiPodcastSegment[];
  audioSource?: any;
};

function decodeBase64(b64: string): Uint8Array {
  if (typeof globalThis.atob === "function") {
    const binary = globalThis.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  throw new Error("Base64 decode unavailable.");
}

function encodeBase64(bytes: Uint8Array): string {
  if (typeof globalThis.btoa === "function") {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return globalThis.btoa(binary);
  }
  throw new Error("Base64 encode unavailable.");
}

export function pcmBase64ToWavBase64(pcmBase64: string, sampleRate = 24000): string {
  const pcmBytes = decodeBase64(pcmBase64);
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const dataSize = pcmBytes.length;

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  const wav = new Uint8Array(44 + dataSize);
  wav.set(new Uint8Array(header), 0);
  wav.set(pcmBytes, 44);
  return encodeBase64(wav);
}

export async function generateGeminiSpeech(text: string, voiceName = "Aoede"): Promise<string> {
  void text;
  void voiceName;
  throw new Error(
    "Dynamic cloud TTS is not enabled until duration billing and static-content caching are enforced.",
  );
}

export async function generateAiPodcastEpisode(input: {
  topic: string;
  templateId: AiPodcastTemplateId;
}): Promise<AiPodcastEpisode> {
  void input;
  throw new Error(
    "AI podcast creation is not included in this release. Packaged episodes remain available.",
  );
  /* istanbul ignore next -- retained prompt is documentation for a future priced product. */
  /*
  const topic = input.topic.replace(/\s+/g, " ").trim();
  if (!topic) {
    throw new Error("Podcast topic is required.");
  }

  const template =
    AI_PODCAST_TEMPLATE_PROMPTS[input.templateId] ??
    AI_PODCAST_TEMPLATE_PROMPTS.daily_lesson;

  const prompt = [
    "You create short spoken English-learning podcast scripts for a mobile language app.",
    `Topic: ${topic}`,
    `Format: ${template}`,
    "Target learner: A2-B1 English.",
    "Write natural speech, not an essay.",
    "The hosts/speakers of the podcast must be Kurdish speakers who speak English, but naturally mix in some Sorani Kurdish words (written in English transliteration, e.g. 'slaw', 'zor basha', 'spas', 'basha', 'choni') to explain concepts or make it feel relatable.",
    "Every spoken segment must directly relate to the user's topic.",
    "Each segment must be 1 short spoken line, 7-22 words.",
    "Write the Kurdish words using English transliteration (Latin script) so that native text-to-speech engine/TTS can read them phonetically.",
    "Do not mention JSON, AI, model names, or the prompt.",
    "No markdown, numbering, bullets, stage directions, or speaker labels unless the format is two-host conversation.",
    "Return ONLY valid JSON. No markdown. No extra text.",
    '{"title":"short title","subtitle":"short subtitle","segments":[{"text":"spoken line","lang":"en"}]}',
    "Generate 7 to 9 segments.",
  ].join("\n");

  const data = await requestGeminiGenerateContent(
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.72,
        maxOutputTokens: 1200,
      },
    },
    18_000,
    "gemini-3.1-flash-lite",
  );

  const text = extractGeminiText(data);
  if (!text) {
    throw new Error("Gemini returned an empty podcast.");
  }

  return parseAiPodcastEpisode(text, topic, input.templateId);
  */
}

export type ParagraphSpeechEvaluation = {
  transcript: string;
  accuracyScore: number;
  wordAnalysis: { word: string; correct: boolean }[];
};

export function countReadingWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function countReadingSentences(value: string): number {
  return (value.match(/[^.!?\n]+[.!?]?/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter(Boolean).length;
}

export function validateGeneratedReadingPracticeParagraphs(
  values: string[],
  paragraphCount: number,
  wordCountPerParagraph: number,
): string[] {
  const safeParagraphCount = Math.max(1, Math.min(3, Math.round(paragraphCount)));
  const safeWordCount = Math.max(30, Math.min(220, Math.round(wordCountPerParagraph)));

  if (values.length < safeParagraphCount) {
    throw new Error("Twino AI returned fewer passages than requested. Please generate again.");
  }

  return values.slice(0, safeParagraphCount).map((value) => {
    const words = value.replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean);
    const minimumWords = Math.max(20, Math.floor(safeWordCount * 0.7));

    if (words.length < minimumWords) {
      throw new Error("Twino AI returned an incomplete passage. Please generate again.");
    }

    const limitedWords = words.slice(0, Math.ceil(safeWordCount * 1.2));
    const chunkSize = Math.ceil(limitedWords.length / 3);
    return [0, 1, 2]
      .map((chunk) =>
        limitedWords.slice(chunk * chunkSize, (chunk + 1) * chunkSize).join(" "),
      )
      .filter(Boolean)
      .join("\n");
  });
}

export async function evaluateParagraphSpeechWithGemini(
  audioBase64: string,
  mimeType: string,
  targetParagraphs: string[]
): Promise<ParagraphSpeechEvaluation> {
  if (!audioBase64) {
    throw new Error("No audio was captured.");
  }

  const normalizedMimeType = normalizeGeminiMimeType(mimeType);
  const targetText = targetParagraphs.join(" ");
  const targetWords = targetText.split(/\s+/).filter(Boolean);

  const prompt = [
    "You evaluate English speaking practice for language learners.",
    `The learner was asked to read the following text aloud:`,
    `"${targetText}"`,
    `Listen to the audio and evaluate their pronunciation word by word.`,
    `Return ONLY a valid JSON object with the following structure:`,
    `{`,
    `  "transcript": "exactly what you heard them say",`,
    `  "accuracyScore": 85, // an integer from 0 to 100 representing overall pronunciation accuracy`,
    `  "wordAnalysis": [`,
    `    { "word": "word1 from target text", "correct": true },`,
    `    { "word": "word2 from target text", "correct": false }`,
    `  ]`,
    `}`,
    `IMPORTANT RULES:`,
    `- The "wordAnalysis" array MUST contain every single word from the target text, in the exact original order.`,
    `- Set "correct" to true if the user pronounced the word intelligibly (allow minor accent differences).`,
    `- Set "correct" to false if they skipped it, completely mispronounced it, or said the wrong word.`,
    `- Strip punctuation from the "word" field in wordAnalysis for cleaner UI mapping, but keep it in the transcript.`
  ].join("\n");

  try {
    const data = await requestGeminiGenerateContent(
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: normalizedMimeType,
                  data: audioBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: Math.max(2048, Math.min(8192, targetWords.length * 14)),
        },
      },
      "reading_pronunciation_evaluation",
      90_000,
    );

    let text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(text) as Partial<ParagraphSpeechEvaluation>;
    const parsedWords = Array.isArray(parsed.wordAnalysis) ? parsed.wordAnalysis : [];
    return {
      transcript: typeof parsed.transcript === "string" ? parsed.transcript.trim() : "",
      accuracyScore: Math.max(
        0,
        Math.min(100, Math.round(Number(parsed.accuracyScore) || 0)),
      ),
      wordAnalysis: targetWords.map((word, index) => ({
        word: word.replace(/[^a-z0-9']/gi, ""),
        correct: parsedWords[index]?.correct === true,
      })),
    };
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    const isExpectedAuthError = message === "Sign in to use Twino's cloud AI features.";
    if (!isExpectedAuthError) {
      console.warn("[evaluateParagraphSpeechWithGemini] Failed:", err);
    }
    throw new Error(err.message || "Failed to evaluate paragraph speech.");
  }
}

export async function generateReadingPracticeParagraphs(
  difficulty: ReadingDifficulty,
  paragraphCount: number,
  wordCountPerParagraph: number = 80
): Promise<string[]> {
  const safeParagraphCount = Math.max(1, Math.min(3, Math.round(paragraphCount)));
  const safeWordCount = Math.max(30, Math.min(220, Math.round(wordCountPerParagraph)));
  const maxOutputTokens = Math.round(
    Math.max(600, Math.min(2400, safeParagraphCount * safeWordCount * 1.8)),
  );

  const prompt = `Generate ${safeParagraphCount} English reading passage(s), ${difficulty} level, ~${safeWordCount} words each. Each passage must be split into exactly 3 short sub-paragraphs separated by \\n within the string. Topics: tech, nature, self-improvement, or stories. Reply ONLY with a JSON array of strings. No markdown. Example: ["First sub-paragraph here.\\nSecond sub-paragraph here.\\nThird sub-paragraph here."]`;

  const data = await requestGeminiGenerateContent(
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens,
      },
    },
    "reading_passage_generation",
    45_000,
    "gemini-3.1-flash-lite",
  );

  const text = extractGeminiText(data);
  if (!text) {
    throw new Error("Twino AI returned an empty passage. Please generate again.");
  }

  const jsonText = extractJsonArray(text) || text.trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Twino AI returned an invalid passage. Please generate again.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Twino AI returned an invalid passage. Please generate again.");
  }

  return validateGeneratedReadingPracticeParagraphs(
    parsed.filter((value): value is string => typeof value === "string"),
    safeParagraphCount,
    safeWordCount,
  );
}
