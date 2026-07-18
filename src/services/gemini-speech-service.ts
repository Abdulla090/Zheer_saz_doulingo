import {
  GEMINI_SPEECH_MODEL,
  isGeminiConfigured,
} from "../constants/gemini";
import { generateGeminiContent } from "./gemini-gateway";
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
  timeoutMs = API_TIMEOUT_MS,
  model?: string,
): Promise<GeminiGenerateResponse> {
  return generateGeminiContent<GeminiGenerateResponse>(
    model || GEMINI_SPEECH_MODEL,
    body,
    timeoutMs,
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

  const data = await requestGeminiGenerateContent({
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
  });

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

const AI_PODCAST_TEMPLATE_PROMPTS: Record<AiPodcastTemplateId, string> = {
  daily_lesson:
    "Make it a clear daily English lesson with useful vocabulary, examples, and one short recap.",
  story_mode:
    "Make it a mini story podcast that teaches English naturally through a simple scene.",
  exam_coach:
    "Make it an IELTS/TOEFL style coaching podcast with polished phrases and one practice prompt.",
  conversation:
    "Make it a two-host conversational podcast with short back-and-forth lines.",
  quick_explainer:
    "Make it a focused explainer podcast: define the topic, give two useful examples, then close with a tiny challenge.",
  pronunciation_drill:
    "Make it a pronunciation drill podcast with short repeatable phrases, stress hints, and one final practice line.",
};

const splitPodcastText = (value: string) =>
  value
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);

function normalizeAiPodcastEpisode(
  episode: Partial<AiPodcastEpisode>,
  topic: string,
  templateId: AiPodcastTemplateId,
): AiPodcastEpisode {
  const rawSegments = Array.isArray(episode.segments) ? episode.segments : [];
  const parsedSegments = rawSegments
    .flatMap((segment) => {
      const text =
        typeof segment?.text === "string"
          ? segment.text.replace(/\s+/g, " ").trim()
          : "";
      return splitPodcastText(text).map((line) => ({
        text: line,
        lang: segment?.lang === "ku" ? ("ku" as const) : ("en" as const),
      }));
    })
    .filter((segment) => segment.text.length > 0);

  const fallbackByTemplate: Record<AiPodcastTemplateId, string[]> = {
    daily_lesson: [
      `Welcome. Today we will learn useful English for ${topic}.`,
      `First, listen for simple words you can use immediately.`,
      `A natural sentence is: I want to talk about ${topic} clearly.`,
      "Repeat it slowly, then say it again with more confidence.",
      `Use this topic in one real sentence today: ${topic}.`,
      "That is your short recap. Listen again and repeat the strongest line.",
    ],
    story_mode: [
      `Imagine a simple scene about ${topic}.`,
      "One person feels nervous, but they try to speak clearly.",
      `They use one short sentence connected to ${topic}.`,
      "The other person understands and answers in friendly English.",
      "The scene becomes easier because the language is simple.",
      "Now repeat the story in your own words.",
    ],
    exam_coach: [
      `Today's exam topic is ${topic}.`,
      "Start with a clear opinion before adding details.",
      `A strong phrase is: This topic matters because it affects daily life.`,
      "Add one example, then explain why the example is important.",
      "Keep your answer organized, calm, and direct.",
      "Now practice a thirty-second answer using that structure.",
    ],
    conversation: [
      `Host one: Today we are talking about ${topic}.`,
      "Host two: Good topic. Let's make it practical for English learners.",
      "Host one: Give me one sentence I can use today.",
      `Host two: I would like to learn more about ${topic}.`,
      "Host one: Nice. Short, clear, and easy to repeat.",
      "Host two: Say it twice, then make your own version.",
    ],
    quick_explainer: [
      `Here is a quick explanation of ${topic}.`,
      "Think of the topic as one idea you can explain simply.",
      `Example one: ${topic} can appear in everyday conversations.`,
      "Example two: you can ask a question to learn more details.",
      "Your mini challenge is to explain it in one sentence.",
      "Keep the sentence short, natural, and easy to repeat.",
    ],
    pronunciation_drill: [
      `Let's practice pronunciation with ${topic}.`,
      "Listen first, then repeat without rushing.",
      `Say this clearly: I am practicing ${topic} today.`,
      "Stress the important words and keep your rhythm steady.",
      "Now repeat the sentence a little faster.",
      "Finish by saying one new sentence about the same topic.",
    ],
  };

  const segments = [...parsedSegments];
  for (const fallbackLine of fallbackByTemplate[templateId]) {
    if (segments.length >= 6) break;
    segments.push({ text: fallbackLine, lang: "en" });
  }

  return {
    title:
      typeof episode.title === "string" && episode.title.trim()
        ? episode.title.trim().slice(0, 64)
        : topic,
    subtitle:
      typeof episode.subtitle === "string" && episode.subtitle.trim()
        ? episode.subtitle.trim().slice(0, 96)
        : "Generated English podcast",
    segments: segments.slice(0, 10),
  };
}

function parseAiPodcastEpisode(
  text: string,
  topic: string,
  templateId: AiPodcastTemplateId,
): AiPodcastEpisode {
  const jsonText = extractJsonObject(text);
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText) as Partial<AiPodcastEpisode>;
      return normalizeAiPodcastEpisode(parsed, topic, templateId);
    } catch {
      /* fall through */
    }
  }

  return normalizeAiPodcastEpisode({
    title: topic,
    subtitle: "Generated English podcast",
    segments: splitPodcastText(text).map((line) => ({ text: line, lang: "en" })),
  }, topic, templateId);
}

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
  const model = "gemini-3.1-flash-tts-preview";
  const data = await generateGeminiContent<any>(model, {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      },
    },
  }, 50_000);

  const base64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) {
    throw new Error("Gemini TTS did not return audio data.");
  }

  return base64;
}

export async function generateAiPodcastEpisode(input: {
  topic: string;
  templateId: AiPodcastTemplateId;
}): Promise<AiPodcastEpisode> {
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
}

export type ParagraphSpeechEvaluation = {
  transcript: string;
  accuracyScore: number;
  wordAnalysis: { word: string; correct: boolean }[];
};

const READING_BEGINNER_FALLBACKS = [
  "The weather is beautiful and warm today. The yellow sun is shining, and small birds are singing near the garden. I walk to the quiet park with my friends after breakfast. We see colorful flowers, tall green trees, and children playing together. Later, we sit under a tree, drink cold water, and talk about our plans for the afternoon. It is a simple day, but it feels peaceful and happy.",
  "My best friend lives near my house, and we often study English together. We read short stories, repeat useful sentences, and help each other when a word is difficult. Sometimes we make mistakes, but we do not stop. We laugh, try again, and slowly improve our speaking. Learning feels easier when someone kind practices with you every day.",
  "In the morning, I prepare my school bag before I leave home. I put my notebook, pencil, phone, and water bottle inside. On the way, I meet my cousin at the bus stop. We talk about our favorite lessons and the games we want to play later. A good morning routine helps me feel ready for the whole day.",
];

const READING_HIGHER_FALLBACKS = [
  "Learning a new language opens meaningful opportunities for personal growth and cultural understanding. It helps learners connect with people from different countries, follow international media, and express ideas with more confidence. The process requires patience because vocabulary, grammar, and pronunciation improve through steady repetition. Even ten minutes of focused speaking or reading every day can build a stronger habit and make English feel more natural over time.",
  "Consistency is the foundation of mastering any complex intellectual skill. When learners dedicate focused time to reading aloud, they train their eyes, mouth, and memory to work together. This practice improves pronunciation, rhythm, and confidence under pressure. Distractions can slow progress, but a clear routine creates measurable improvement. The goal is not perfection in one attempt; it is becoming a little more fluent with each careful repetition.",
  "Modern technology is changing the way students practice language skills. Smartphones, tablets, and artificial intelligence can provide quick access to lessons, pronunciation feedback, and realistic conversations. These tools are useful, but they cannot replace attention, curiosity, and active effort. A learner still needs to read carefully, listen closely, and speak often. The best results come when technology supports a strong personal routine instead of replacing it.",
];

export function countReadingWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function normalizeReadingPracticeParagraphs(
  values: string[],
  difficulty: ReadingDifficulty,
  paragraphCount: number,
  wordCountPerParagraph: number,
): string[] {
  const safeParagraphCount = Math.max(1, Math.min(3, Math.round(paragraphCount)));
  const safeWordCount = Math.max(80, Math.min(220, Math.round(wordCountPerParagraph)));
  const fallbackPool =
    difficulty === "Beginner" ? READING_BEGINNER_FALLBACKS : READING_HIGHER_FALLBACKS;

  const padParagraph = (value: string, index: number) => {
    const parts = [value.replace(/\s+/g, " ").trim()].filter(Boolean);
    let nextIndex = index;
    while (countReadingWords(parts.join(" ")) < safeWordCount) {
      parts.push(fallbackPool[nextIndex % fallbackPool.length]);
      nextIndex += 1;
    }
    return parts.join(" ");
  };

  return Array.from({ length: safeParagraphCount }, (_, index) =>
    padParagraph(values[index] ?? fallbackPool[index % fallbackPool.length], index),
  );
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
    const data = await requestGeminiGenerateContent({
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
        maxOutputTokens: 2048,
      },
    }, API_TIMEOUT_MS * 2);

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

    const evaluation = JSON.parse(text) as ParagraphSpeechEvaluation;
    return evaluation;
  } catch (err: any) {
    console.error("[evaluateParagraphSpeechWithGemini] Error:", err);
    throw new Error(err.message || "Failed to evaluate paragraph speech.");
  }
}

export async function generateReadingPracticeParagraphs(
  difficulty: ReadingDifficulty,
  paragraphCount: number,
  wordCountPerParagraph: number = 80
): Promise<string[]> {
  const safeParagraphCount = Math.max(1, Math.min(3, Math.round(paragraphCount)));
  const safeWordCount = Math.max(80, Math.min(220, Math.round(wordCountPerParagraph)));
  const maxOutputTokens = Math.round(
    Math.max(600, Math.min(2400, safeParagraphCount * safeWordCount * 1.8)),
  );

  const prompt = `Generate ${safeParagraphCount} English reading passage(s), ${difficulty} level, ~${safeWordCount} words each. Each passage must be split into exactly 3 short sub-paragraphs separated by \\n within the string. Topics: tech, nature, self-improvement, or stories. Reply ONLY with a JSON array of strings. No markdown. Example: ["First sub-paragraph here.\\nSecond sub-paragraph here.\\nThird sub-paragraph here."]`;

  try {
    const data = await requestGeminiGenerateContent(
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens,
        },
      },
      45_000,
      "gemini-3.1-flash-lite",
    );

    const text = extractGeminiText(data);
    const jsonText = extractJsonArray(text) || text.trim();
    
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeReadingPracticeParagraphs(
          parsed.map(String).filter(Boolean),
          difficulty,
          safeParagraphCount,
          safeWordCount,
        );
      }
    } catch {
      // Fallback if it fails to parse
    }

    // Manual fallback: split by double newline
    return normalizeReadingPracticeParagraphs(
      text.split('\n\n').map(p => p.trim()).filter(Boolean),
      difficulty,
      safeParagraphCount,
      safeWordCount,
    );

  } catch (err) {
    console.error("[generateReadingPracticeParagraphs] Failed:", err);
    return normalizeReadingPracticeParagraphs([], difficulty, safeParagraphCount, safeWordCount);
  }
}
