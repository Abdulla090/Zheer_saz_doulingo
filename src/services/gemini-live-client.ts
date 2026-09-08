import {
  GEMINI_LIVE_INPUT_RATE,
  GEMINI_LIVE_MODEL,
  getGeminiLiveWebSocketUrl,
} from "../constants/gemini";
import { supabase } from "../lib/supabase";
import { createAiIdempotencyKey } from "./gemini-gateway";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useLocaleStore } from "../stores/useLocaleStore";
import { getLanguage } from "../config/languages";
import { LEVEL_CONFIGS } from "../data/voice-tutor-word-banks";

export type LiveSessionPhase = "intro_ku" | "english";

export type LiveServerMessage = Record<string, unknown>;
type GeminiLiveUsageMetadata = Record<string, unknown>;

export type LiveSessionCallbacks = {
  onOpen?: () => void;
  onSetupComplete?: () => void;
  onAudio?: (pcmBase64: string) => void;
  onText?: (text: string) => void;
  onInputTranscription?: (text: string) => void;
  onOutputTranscription?: (text: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onClose?: (reason?: string) => void;
  onError?: (message: string) => void;
};

type GeminiLiveTokenResponse = {
  token?: string;
  durationMinutes?: number;
  expiresAt?: string;
  chargedCredits?: number;
  balance?: number;
  reservationId?: string;
};

export type GeminiLiveTokenGrant = {
  token: string;
  durationMinutes: 5 | 10 | 15;
  expiresAt: string;
  chargedCredits: number;
  balance: number;
  reservationId: string;
};

async function createGeminiLiveToken(
  durationMinutes: 5 | 10 | 15,
): Promise<GeminiLiveTokenGrant> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.access_token) {
    throw new Error("Sign in to use the AI tutor.");
  }

  const { data, error } =
    await supabase.functions.invoke<GeminiLiveTokenResponse>(
      "gemini-live-token",
      {
        body: {
          durationMinutes,
          idempotencyKey: createAiIdempotencyKey(`live_tutor_${durationMinutes}`),
        },
        timeout: 12_000,
      },
    );

  if (error) {
    // Extract HTTP status and backend error message from the Edge Function response
    const response = (error as { context?: Response }).context;
    const httpStatus = response?.status ?? 0;
    let backendMessage = "";

    if (response) {
      try {
        const cloned = response.clone();
        const text = await cloned.text();
        if (text) {
          try {
            const payload = JSON.parse(text) as { error?: unknown; message?: unknown };
            const msg = payload.error ?? payload.message;
            if (typeof msg === "string") backendMessage = msg;
          } catch {
            // Response body was not JSON — use raw text if short enough
            if (text.length < 200) backendMessage = text;
          }
        }
      } catch {
        // Could not read response body at all
      }
    }

    console.warn(
      `[GeminiLiveToken] Edge Function error — status=${httpStatus}, ` +
      `backend="${backendMessage}", transport="${error.message}"`,
    );

    // Map HTTP status codes to user-friendly messages
    const userMessage =
      httpStatus === 401
        ? "Sign in to use the AI tutor."
        : httpStatus === 402
          ? "Not enough AI credits. Add credits or choose a plan on the Twino website."
        : httpStatus === 429
          ? "Daily AI limit reached. Try again tomorrow."
          : httpStatus === 502 || httpStatus === 503
            ? "AI tutor service is temporarily unavailable. Please try again."
            : backendMessage || error.message || "Could not start AI tutor session.";

    throw new Error(userMessage);
  }
  if (
    !data?.token ||
    data.durationMinutes !== durationMinutes ||
    typeof data.expiresAt !== "string" ||
    typeof data.chargedCredits !== "number" ||
    typeof data.balance !== "number" ||
    typeof data.reservationId !== "string"
  ) {
    throw new Error("Could not start AI tutor session.");
  }
  return {
    token: data.token,
    durationMinutes,
    expiresAt: data.expiresAt,
    chargedCredits: data.chargedCredits,
    balance: data.balance,
    reservationId: data.reservationId,
  };
}

function getLanguageName(code: string): string {
  const language = getLanguage(code);
  if (!language) return code || "English";
  return language.id === "ku" ? "Kurdish Sorani" : language.name;
}

function getLocalizedLanguageName(targetCode: string, inSourceCode: string): string {
  const kuNames: Record<string, string> = {
    en: "ئینگلیزی",
    ku: "کوردی",
    ar: "عەرەبی",
    es: "ئیسپانی",
    ru: "ڕووسی",
  };
  const arNames: Record<string, string> = {
    en: "الإنجليزية",
    ku: "الكردية",
    ar: "العربية",
    es: "الإسبانية",
    ru: "الروسية",
  };
  if (inSourceCode === "ku" && kuNames[targetCode]) return kuNames[targetCode];
  if (inSourceCode === "ar" && arNames[targetCode]) return arNames[targetCode];
  return getLanguageName(targetCode);
}

export function buildLiveTutorSystem(): string {
  const settings = useSettingsStore.getState();
  const level = settings.englishLevel || 5;
  const age = settings.userAge || "";
  const sex = settings.userSex || "";
  const name = settings.userName?.trim() || "Student";

  const sourceLangCode = useLocaleStore.getState().selectedSourceLanguage || "ku";
  const targetLangCode = useLocaleStore.getState().selectedTargetLanguage || "en";

  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);

  const currentLevel = LEVEL_CONFIGS[level] || LEVEL_CONFIGS[5];

  const parsedAge = age ? parseInt(age, 10) : null;
  const isChild = parsedAge !== null && !isNaN(parsedAge) && parsedAge < 13;
  const isTeen = parsedAge !== null && !isNaN(parsedAge) && parsedAge >= 13 && parsedAge < 18;

  const ageContext = isChild
    ? `Child (${age} years old). Speak with playful, warm, highly encouraging energy. Keep examples kid-friendly (games, pets, school, cartoons).`
    : isTeen
      ? `Teenager (${age} years old). Speak with upbeat, modern conversational energy.`
      : age
        ? `Adult (${age} years old). Discuss real-life situations, everyday culture, opinions, and practical topics.`
        : "Adult/General Learner.";

  const genderContext = sex
    ? `Learner gender/sex: ${sex}. Address respectfully.`
    : "Gender: Not specified.";

  const systemRules = [
    `You are Twino, an elite, highly perceptive Agentic Live AI Tutor specialized in coaching a ${sourceLangName}-speaking learner (${name}) to master ${targetLangName}.`,
    `You are not a generic chatbot. You act as an active, diagnostic, goal-oriented personal tutor who leads the session through a structured agent protocol.`,
    ``,
    `=== LEARNER PROFILE ===`,
    `- Name: ${name}`,
    `- Age Profile: ${ageContext}`,
    `- ${genderContext}`,
    `- Native Language (Mother Tongue): ${sourceLangName}`,
    `- Target Language to Learn: ${targetLangName}`,
    `- Default Profile Level: Level ${level}/10 (${currentLevel.cefr})`,
    ``,
    `=== AGENT PROTOCOL: 3-STAGE INTERACTION WORKFLOW ===`,
    `You must manage the live voice session through these exact three stages:`,
    ``,
    `STAGE 1: NATIVE GREETING & LEVEL DIAGNOSTIC (Turn 1)`,
    `- LANGUAGE: You MUST speak ONLY in the learner's native language (${sourceLangName}).`,
    `- ACTION: Greet ${name} warmly by name. Introduce yourself as Twino, their personal live tutor for ${targetLangName}.`,
    `- ASK: Inquire how much they currently know about ${targetLangName} (e.g. are they starting from scratch as a beginner, know basic words, or can already converse?).`,
    `- Do NOT list learning tracks or start lessons yet. Wait for their response.`,
    ``,
    `STAGE 2: LEARNING TRACK & GOAL SELECTION (Turn 2)`,
    `- LANGUAGE: Continue speaking in ${sourceLangName}.`,
    `- ACTION: Validate and encourage the learner's reported level in 1 warm sentence.`,
    `- ASK: Present the three learning tracks clearly and ask how they prefer to learn ${targetLangName} today:`,
    sourceLangCode === "ku"
      ? `  1) گفتوگۆی ئازاد (Open Free Conversation): قسەکردنی ئازاد دەربارەی بابەتە ڕۆژانەییەکان بۆ زیادکردنی باوەڕبەخۆبوون و ڕەوانی قسەکردن.\n  2) زاراوە و سلاینگ (Idioms & Slangs): فێربوونی دەستەواژەی باو و زمانی شەقام و قسەکردنی خەڵکی ڕەسەن.\n  3) دەوڵەمەندکردنی وشەکان (Vocabulary Builder): فێربوونی وشەی بەهێز و نوێ بۆ ئەوەی وشەی زیاتر بزانیت و دەربڕینت دەوڵەمەندتر بێت.`
      : sourceLangCode === "ar"
        ? `  1) محادثة حرة ومفتوحة (Open Free Conversation): التحدث الحر حول مواضيع يومية لبناء الثقة والطلاقة.\n  2) مصطلحات وتعبيرات عامية (Idioms & Slangs): تعبيرات دارجة ومصطلحات حقيقية يستخدمها المتحدثون الأصليون.\n  3) بناء وتوسيع المفردات (Vocabulary Builder): تعلم كلمات جديدة وقوية لإثراء حصيلتك اللغوية وبناء جمل أكثر تعبيراً.`
        : `  1) Open Free Conversation: Casual, natural everyday talking to build confidence, speaking flow, and fluency.\n  2) Idioms and Slangs: Real-world colloquial phrases, street slang, and natural idioms used by native speakers.\n  3) Vocabulary Builder: Learning powerful new words, rich collocations, and expressive vocabulary to expand word power.`,
    `- Wait for their choice before teaching.`,
    ``,
    `STAGE 3: AGENTIC ADAPTIVE TUTORING (Turn 3 & Onward)`,
    `- CONTEXT LOCK: Retain the learner's reported level and chosen track in your active memory context throughout the entire session. Adapt every question, exercise, and topic to their choice. Never restart or repeat Stage 1/2 onboarding questions.`,
    `- IMMERSION SHIFT: Enthusiastically confirm their track choice and switch into ${targetLangName} as the primary language for immersion.`,
    `- EXECUTE ACCORDING TO CHOSEN TRACK:`,
    `  * TRACK A: OPEN FREE CONVERSATION:`,
    `    - Act as an engaging, charismatic conversation partner.`,
    `    - Pick an interesting topic suited to their level (daily life, hobbies, work, culture, personal experiences).`,
    `    - Share a personal observation or thought, then ask at most ONE thoughtful question to keep the dialogue flowing.`,
    `    - When the learner makes an unnatural phrasing mistake or awkward translation, naturally recast it in your response ("In native speech, we usually say: ...") without breaking the rhythm.`,
    `  * TRACK B: IDIOMS AND SLANG:`,
    `    - Act as a phraseology and street-smarts coach.`,
    `    - Introduce ONE high-frequency, authentic idiom or slang phrase per turn.`,
    `    - Explain what it means, the vibe/context (casual, banter, friends, workplace), and give an authentic example sentence.`,
    `    - Prompt ${name} to use it in a reply or mini-roleplay.`,
    `    - Praise their attempt and refine their usage immediately.`,
    `  * TRACK C: VOCABULARY BUILDER:`,
    `    - Act as a dynamic lexical coach.`,
    `    - Introduce 1-2 powerful, high-utility words or collocations suited to their level.`,
    `    - Show how each word elevates their expression (e.g. swapping basic words like "very tired" for "exhausted", "good" for "outstanding").`,
    `    - Give a clear contextual example sentence, then ask the learner to create their own sentence using the word.`,
    ``,
    `=== NATIVE LANGUAGE BRIDGING POLICY IN STAGE 3 ===`,
    `- Conduct immersion primarily in ${targetLangName}.`,
    `- SUPPORTIVE BRIDGE: When explaining the meaning of a tricky idiom, subtle slang nuance, new vocabulary word, or whenever the student hesitates, is confused, or speaks in their native language (${sourceLangName}), provide a concise, warm explanation in ${sourceLangName} to ensure complete clarity, then smoothly return to ${targetLangName}.`,
    ``,
    `=== AUDIO SPEECH CONSTRAINTS (CRITICAL) ===`,
    `- You are speaking over a live voice stream. Everything you generate is spoken aloud by TTS.`,
    `- NEVER use markdown: no asterisks (*bold*), no bullet points (-), no numbered lists (1.), no headers (#), no JSON, and no emojis.`,
    `- Keep turns concise: 1 to 3 spoken sentences per turn (under 25 seconds). Give the learner room to speak.`,
    `- Ask at most ONE question per turn. Never interrogate the learner.`,
  ];

  return systemRules.join("\n");
}

export function buildLiveTutorOpeningPrompt(): string {
  const settings = useSettingsStore.getState();
  const name = settings.userName?.trim() || "";
  const sourceLangCode = useLocaleStore.getState().selectedSourceLanguage || "ku";
  const targetLangCode = useLocaleStore.getState().selectedTargetLanguage || "en";
  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);
  const targetLangInSource = getLocalizedLanguageName(targetLangCode, sourceLangCode);

  let nativeGreetingText = "";
  if (sourceLangCode === "ku") {
    nativeGreetingText = `سڵاو ${name ? `${name} گیان` : ""}! من توینۆم، مامۆستای زیرەکی لایڤی تۆ بۆ فێربوونی زمانی ${targetLangInSource}. دەمەوێت بزانم پێشتر چەند لەم زمانە دەزانیت؟ ئایا لە سەرەتاوە دەست پێ دەکەیت، بنچینەکان دەزانیت، یان دەتوانیت قسە بکەیت؟`;
  } else if (sourceLangCode === "ar") {
    nativeGreetingText = `مرحباً ${name ? name : ""}! أنا توينو، معلمك الذكي المباشر لتعلم اللغة ${targetLangInSource}. أود أن أعرف أولاً: كم تعرف عن اللغة ${targetLangInSource} حالياً؟ هل أنت مبتدئ تماماً، أم تعرف بعض الأساسيات، أم تستطيع التحدث بالفعل؟`;
  } else {
    nativeGreetingText = `Hello ${name ? name : ""}! I am Twino, your live AI tutor for learning ${targetLangName}. First, I would love to know: how much do you currently know about ${targetLangName}? Are you a complete beginner, do you know some basics, or can you already converse?`;
  }

  return [
    `ACTION: START THE LIVE CONVERSATION IN THE LEARNER'S NATIVE LANGUAGE NOW.`,
    `CRITICAL: You MUST speak ONLY in the learner's native language (${sourceLangName}). Do NOT speak in ${targetLangName} yet.`,
    `Greet ${name || "the learner"} warmly and ask how much they know about ${targetLangName}. For example: "${nativeGreetingText}"`,
    `Do not list learning options or word drills yet. Ask ONLY how much they know, then wait for their reply.`,
  ].join(" ");
}

function parseServerMessage(raw: string): LiveServerMessage | null {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed[0] as LiveServerMessage;
    return parsed as LiveServerMessage;
  } catch {
    return null;
  }
}

function pick<T>(obj: Record<string, unknown>, camel: string, snake: string): T | undefined {
  return (obj[camel] ?? obj[snake]) as T | undefined;
}

function extractAudioBase64Parts(msg: LiveServerMessage): string[] {
  const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
  if (!serverContent) return [];

  const modelTurn = pick<Record<string, unknown>>(
    serverContent,
    "modelTurn",
    "model_turn",
  );
  const parts = modelTurn?.parts as { inlineData?: { data?: string }; inline_data?: { data?: string } }[] | undefined;
  if (!parts?.length) return [];

  const audioParts: string[] = [];
  for (const part of parts) {
    const data = part.inlineData?.data ?? part.inline_data?.data;
    if (data) audioParts.push(data);
  }
  return audioParts;
}

function extractTextParts(msg: LiveServerMessage): string[] {
  const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
  if (!serverContent) return [];

  const modelTurn = pick<Record<string, unknown>>(
    serverContent,
    "modelTurn",
    "model_turn",
  );
  const parts = modelTurn?.parts as { text?: string }[] | undefined;
  if (!parts?.length) return [];

  const textParts: string[] = [];
  for (const part of parts) {
    if (part.text) textParts.push(part.text);
  }
  return textParts;
}

function extractTranscriptionText(
  msg: LiveServerMessage,
  field: "inputTranscription" | "outputTranscription",
): string | null {
  const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
  const snakeField = field === "inputTranscription" ? "input_transcription" : "output_transcription";
  const transcription = (serverContent?.[field] ?? serverContent?.[snakeField]) as
    | { text?: unknown }
    | undefined;
  return typeof transcription?.text === "string" ? transcription.text : null;
}

export class GeminiLiveSession {
  private ws: WebSocket | null = null;
  private callbacks: LiveSessionCallbacks = {};
  private setupDone = false;
  private incomingMessageChain: Promise<void> = Promise.resolve();
  private connectionId = 0;
  private expiryTimeout: ReturnType<typeof setTimeout> | null = null;
  private tokenGrant: GeminiLiveTokenGrant | null = null;
  private usageMetadata: GeminiLiveUsageMetadata | null = null;
  private sessionStartedAtMs: number | null = null;
  private usageReportTimer: ReturnType<typeof setTimeout> | null = null;
  private usageFinalized = false;
  private usageReportChain: Promise<void> = Promise.resolve();

  async connect(
    callbacks: LiveSessionCallbacks,
    durationMinutes: 5 | 10 | 15 = 5,
  ): Promise<void> {
    this.callbacks = callbacks;
    this.setupDone = false;
    this.usageMetadata = null;
    this.sessionStartedAtMs = Date.now();
    this.usageFinalized = false;
    const connectionId = ++this.connectionId;
    this.incomingMessageChain = Promise.resolve();

    const grant = await createGeminiLiveToken(durationMinutes);
    this.tokenGrant = grant;
    if (connectionId !== this.connectionId) {
      await this.reportLiveUsage("abandoned");
      return;
    }
    const url = getGeminiLiveWebSocketUrl(grant.token);

    if (this.expiryTimeout) clearTimeout(this.expiryTimeout);
    const msUntilExpiry = Math.max(
      0,
      Date.parse(grant.expiresAt) - Date.now() - 1500,
    );
    this.expiryTimeout = setTimeout(() => {
      if (connectionId !== this.connectionId) return;
      this.disconnect();
      this.callbacks.onClose?.(
        `Your ${durationMinutes}-minute Live Tutor block has ended.`,
      );
    }, msUntilExpiry);

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const ws = new WebSocket(url);
      this.ws = ws;
      const isCurrentConnection = () =>
        this.connectionId === connectionId && this.ws === ws;
      const setupTimeout = setTimeout(() => {
        if (settled || !isCurrentConnection()) return;
        settled = true;
        const message = "Gemini Live took too long to connect.";
        this.callbacks.onError?.(message);
        ws.close();
        reject(new Error(message));
      }, 15_000);

      ws.onopen = () => {
        if (!isCurrentConnection()) return;
        this.callbacks.onOpen?.();
        this.sendSetup();
      };

      const processMessage = async (eventData: unknown) => {
        if (!isCurrentConnection()) return;
        let data: string | null = null;
        if (typeof eventData === "string") {
          data = eventData;
        } else if (eventData instanceof Blob) {
          data = await eventData.text();
        } else if (eventData instanceof ArrayBuffer) {
          data = new TextDecoder().decode(eventData);
        } else if (
          eventData &&
          typeof (eventData as { text?: unknown }).text === "function"
        ) {
          data = await (eventData as { text: () => Promise<string> }).text();
        }
        if (!data) return;

        const msg = parseServerMessage(data);
        if (!msg) return;

        const usageMetadata = pick<GeminiLiveUsageMetadata>(
          msg,
          "usageMetadata",
          "usage_metadata",
        );
        if (usageMetadata) {
          this.usageMetadata = usageMetadata;
          this.scheduleUsageReport();
        }

        const err = pick<{ message?: string }>(msg, "error", "error");
        if (err?.message) {
          this.callbacks.onError?.(err.message);
          if (!settled) {
            settled = true;
            clearTimeout(setupTimeout);
            reject(new Error(err.message));
          }
          return;
        }

        if ((msg.setupComplete || msg.setup_complete) && !this.setupDone) {
          this.setupDone = true;
          this.callbacks.onSetupComplete?.();
          if (!settled) {
            settled = true;
            clearTimeout(setupTimeout);
            resolve();
          }
          return;
        }

        for (const audio of extractAudioBase64Parts(msg)) {
          this.callbacks.onAudio?.(audio);
        }

        for (const text of extractTextParts(msg)) {
          this.callbacks.onText?.(text);
        }

        const inputTranscription = extractTranscriptionText(msg, "inputTranscription");
        if (inputTranscription) {
          this.callbacks.onInputTranscription?.(inputTranscription);
        }

        const outputTranscription = extractTranscriptionText(msg, "outputTranscription");
        if (outputTranscription) {
          this.callbacks.onOutputTranscription?.(outputTranscription);
        }

        const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
        if (serverContent?.interrupted) {
          this.callbacks.onInterrupted?.();
        }
        if (serverContent?.turnComplete || serverContent?.turn_complete) {
          this.callbacks.onTurnComplete?.();
        }

        const goAway =
          pick<Record<string, unknown>>(msg, "goAway", "go_away") ||
          pick<Record<string, unknown>>(serverContent || {}, "goAway", "go_away");
        if (goAway) {
          this.callbacks.onClose?.("Session duration completed.");
          this.disconnect();
          return;
        }
      };

      ws.onmessage = (event) => {
        // React Native can deliver WebSocket frames as Blob objects. Reading
        // Blob.text() is async, so separate handlers can otherwise resolve out
        // of order and let turnComplete reach the hook before the final audio.
        const next = this.incomingMessageChain.then(() =>
          processMessage(event.data),
        );
        this.incomingMessageChain = next.catch((error) => {
          if (!isCurrentConnection()) return;
          const message =
            error instanceof Error ? error.message : "Live message failed.";
          this.callbacks.onError?.(message);
          if (!settled) {
            settled = true;
            clearTimeout(setupTimeout);
            reject(error instanceof Error ? error : new Error(message));
          }
        });
      };

      ws.onerror = (event) => {
        if (!isCurrentConnection()) return;
        console.error("WS ERROR:", event);
        const err = new Error("Live connection failed.");
        this.callbacks.onError?.(err.message);
        if (!settled) {
          settled = true;
          clearTimeout(setupTimeout);
          reject(err);
        }
      };

      ws.onclose = (event) => {
        if (!isCurrentConnection()) return;
        this.ws = null;
        void this.reportLiveUsage(this.setupDone ? "completed" : "abandoned");
        console.warn("WS CLOSE:", event.code, event.reason);
        this.callbacks.onClose?.(event.reason || undefined);
        if (!settled) {
          settled = true;
          clearTimeout(setupTimeout);
          reject(new Error(event.reason || "Connection closed before setup."));
        }
      };
    });
  }

  private send(raw: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(raw));
    }
  }

  private scheduleUsageReport() {
    if (this.usageReportTimer || this.usageFinalized) return;
    this.usageReportTimer = setTimeout(() => {
      this.usageReportTimer = null;
      void this.reportLiveUsage("started");
    }, 5_000);
  }

  private async reportLiveUsage(
    status: "started" | "completed" | "abandoned",
  ): Promise<void> {
    const grant = this.tokenGrant;
    if (!grant || (status !== "started" && this.usageFinalized)) return;
    if (status !== "started") this.usageFinalized = true;
    if (this.usageReportTimer) {
      clearTimeout(this.usageReportTimer);
      this.usageReportTimer = null;
    }
    const elapsedSeconds = this.sessionStartedAtMs
      ? Math.max(0, Math.min(grant.durationMinutes * 60, (Date.now() - this.sessionStartedAtMs) / 1000))
      : 0;
    const usageMetadata = this.usageMetadata;
    const sendReport = async () => {
      const { error } = await supabase.functions.invoke("gemini-live-token", {
        body: {
          action: "usage",
          reservationId: grant.reservationId,
          status,
          usageMetadata,
          audioDurationSeconds: elapsedSeconds,
        },
        timeout: 10_000,
      });
      if (error) {
        console.warn("[GeminiLiveUsage] Usage report failed", {
          status,
          message: error.message,
        });
      }
    };
    const queued = this.usageReportChain.then(sendReport, sendReport);
    this.usageReportChain = queued.catch(() => undefined);
    await queued;
  }

  private sendSetup() {
    this.send({
      setup: {
        model: `models/${GEMINI_LIVE_MODEL}`,
        generationConfig: {
          responseModalities: ["AUDIO"],
          thinkingConfig: {
            thinkingLevel: "minimal",
          },
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: useSettingsStore.getState().tutorVoice || "Aoede" },
            },
          },
          maxOutputTokens: 800,
        },
        systemInstruction: {
          parts: [{ text: buildLiveTutorSystem() }],
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });
  }

  startGreeting() {
    this.sendClientText(buildLiveTutorOpeningPrompt());
  }

  sendPcmChunk(pcmBase64: string) {
    this.sendAudioChunk(pcmBase64, `audio/pcm;rate=${GEMINI_LIVE_INPUT_RATE}`);
  }

  sendAudioChunk(base64: string, mimeType: string) {
    // Use the new `realtime_input.audio` format.
    // `media_chunks` was deprecated and causes 1007 WebSocket close on newer models.
    this.send({
      realtimeInput: {
        audio: { data: base64, mimeType },
      },
    });
  }

  sendAudioStreamEnd() {
    this.send({ realtimeInput: { audioStreamEnd: true } });
  }

  sendClientAudio(base64: string, mimeType: string) {
    this.send({
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [{ inlineData: { mimeType, data: base64 } }],
          },
        ],
        turnComplete: true,
      },
    });
  }

  sendClientText(text: string) {
    this.send({
      realtimeInput: {
        text,
      },
    });
  }

  getBillingGrant(): Omit<GeminiLiveTokenGrant, "token"> | null {
    if (!this.tokenGrant) return null;
    const { token: _token, ...grant } = this.tokenGrant;
    return grant;
  }

  disconnect() {
    void this.reportLiveUsage(this.setupDone ? "completed" : "abandoned");
    this.connectionId += 1;
    if (this.ws) {
      try {
        if (
          this.ws.readyState === WebSocket.OPEN ||
          this.ws.readyState === WebSocket.CONNECTING
        ) {
          this.ws.close(1000, "Client closed session");
        }
      } catch (e) {
        console.warn("Error closing live socket:", e);
      }
      this.ws = null;
    }
    this.setupDone = false;
    // Keep the grant until the async final usage report has captured it.
    this.tokenGrant = null;
    this.sessionStartedAtMs = null;
    if (this.expiryTimeout) {
      clearTimeout(this.expiryTimeout);
      this.expiryTimeout = null;
    }
  }
}
