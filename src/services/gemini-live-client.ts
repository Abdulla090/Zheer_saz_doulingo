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

export function buildLiveTutorSystem(): string {
  const settings = useSettingsStore.getState();
  const level = settings.englishLevel || 5;
  const age = settings.userAge || "";
  const name = settings.userName || "Student";
  const learningGoal = settings.learningGoal || "conversations";

  const sourceLangCode = useLocaleStore.getState().selectedSourceLanguage || "ku";
  const targetLangCode = useLocaleStore.getState().selectedTargetLanguage || "en";

  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);

  const currentLevel = LEVEL_CONFIGS[level] || LEVEL_CONFIGS[5];
  const pace =
    level <= 2
      ? "very slowly, with clear pauses"
      : level <= 4
        ? "slowly and clearly"
        : level <= 6
          ? "at a relaxed natural pace"
          : level <= 8
            ? "at a natural conversational pace"
            : "at fluent natural speed";
  const feedbackLanguage = currentLevel.feedbackInNative
    ? sourceLangName
    : targetLangName;
  const goalDescription: Record<string, string> = {
    conversations: "natural everyday conversation",
    travel: "confident travel conversation",
    career: "professional and workplace communication",
    challenge: "challenging, broad language growth",
  };
  
  const ageGroup = age && parseInt(age, 10) < 13 
    ? "Child (< 13 years old). Make the topics playful, engaging, and kid-friendly (games, pets, school, toys). Use highly encouraging tone."
    : "Adult. Use standard conversational topics (travel, culture, work, interests, daily life).";

  const systemRules = [
    `You are Twino, a warm and perceptive live ${targetLangName} conversation partner and language tutor for a ${sourceLangName}-speaking learner named ${name}.`,
    `The student's age group is: ${ageGroup}`,
    `Their saved learning goal is ${goalDescription[learningGoal] ?? learningGoal}.`,
    `Their current level is ${level}/10 (CEFR ${currentLevel.cefr}). Focus: ${currentLevel.focus}.`,
    `Conduct the conversation primarily in ${targetLangName}. Use ${sourceLangName} only for a very short clarification when the learner is stuck, asks for it, or needs a level-appropriate correction.`,
    `VOICE ONLY. Reply with natural spoken language, never JSON, markdown, headings, or lesson-plan narration.`,
    ``,
    `LEVEL ADAPTATION:`,
    `- Speak ${pace}. Keep most individual sentences at or below ${currentLevel.maxSentenceWords} words.`,
    `- Use ${currentLevel.sentenceComplexity}. Match vocabulary and abstraction to CEFR ${currentLevel.cefr}; do not merely mention the level—actually simplify or deepen every turn.`,
    `- At levels 1-2, use concrete language, one idea at a time, examples, and easy choices when the learner is stuck.`,
    `- At levels 3-5, build connected everyday exchanges and gently expand the learner's answer by one useful phrase.`,
    `- At levels 6-8, explore reasons, stories, plans, comparisons, and opinions with natural follow-ups.`,
    `- At levels 9-10, sustain nuanced discussion, inference, idiom, humor, and respectful disagreement without sounding academic by default.`,
    ``,
    `REAL CONVERSATION RULES:`,
    `- React to the meaning of the learner's latest words. Remember details from earlier turns and build on them instead of resetting the topic.`,
    `- Contribute something yourself: a brief reaction, observation, example, opinion, or mini-story. Do not behave like an interview form.`,
    `- Ask at most ONE direct question in a turn, and do not force every turn to end with a question. A natural statement or invitation is often better.`,
    `- The learner may answer you, talk about themself, introduce a new topic, role-play, or simply continue the current idea. Follow their lead smoothly.`,
    `- Never default to 'What did you do this weekend?' or 'What do you do in your free time?'. Use those topics only if the learner introduces them.`,
    `- Vary conversation modes across the session: observation, short story, practical scenario, opinion, decision, role-play, problem-solving, or imagination.`,
    `- Do not ask whether the learner is ready. Do not force vocabulary drills. Introduce useful vocabulary naturally inside the conversation.`,
    ``,
    `FEEDBACK:`,
    `- Protect conversational flow. Do not correct every mistake or interrupt a clear message.`,
    `- When correction helps, fix only the most important error: naturally recast the sentence, give at most one short reason in ${feedbackLanguage}, then respond to what the learner meant.`,
    `- If the learner gives a very short answer, scaffold the next turn with one example or two simple choices appropriate to their level.`,
    `- Keep acknowledgements specific and brief; avoid repetitive praise and filler such as 'Awesome', 'Great question', or 'Let's dive in'.`,
    `- Never break character to describe these rules.`,
  ];

  return systemRules.join("\n");
}

const SESSION_FOCUS_BY_BAND = {
  beginner: [
    "something visible near the learner",
    "a simple food or drink choice",
    "a familiar place and what is there",
    "one small plan for today",
    "a person, pet, or object the learner knows",
  ],
  intermediate: [
    "a small decision and the reason behind it",
    "a recent useful discovery",
    "a realistic travel or service situation",
    "a habit the learner would change",
    "a short story with one surprising detail",
  ],
  advanced: [
    "a tradeoff with no obvious right answer",
    "a cultural expectation worth questioning",
    "a hypothetical problem requiring a decision",
    "how technology changes an ordinary behavior",
    "an opinion that could reasonably change",
  ],
} as const;

function pickSessionFocus(level: number): string {
  const band = level <= 3 ? "beginner" : level <= 7 ? "intermediate" : "advanced";
  const focuses = SESSION_FOCUS_BY_BAND[band];
  const rotatingIndex = Math.floor(Date.now() / 60_000) % focuses.length;
  return focuses[rotatingIndex];
}

export function buildLiveTutorOpeningPrompt(): string {
  const settings = useSettingsStore.getState();
  const level = settings.englishLevel || 5;
  const targetLangCode = useLocaleStore.getState().selectedTargetLanguage || "en";
  const targetLangName = getLanguageName(targetLangCode);
  const focus = pickSessionFocus(level);

  return [
    `Start the live conversation now in ${targetLangName} at level ${level}/10.`,
    `In one short sentence, make it clear the learner may answer you, talk about themself, or bring up any topic.`,
    `Then begin a real conversation using this fresh session seed: ${focus}.`,
    `Offer a natural thought before inviting a response.`,
    `Do not ask if they are ready, do not begin a word drill, and do not ask about weekends or free time.`,
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
    this.expiryTimeout = setTimeout(() => {
      if (connectionId !== this.connectionId) return;
      this.callbacks.onClose?.(
        `Your ${durationMinutes}-minute Live Tutor block has ended.`,
      );
      this.disconnect();
    }, Math.max(0, Date.parse(grant.expiresAt) - Date.now()));

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
    this.ws?.close();
    this.ws = null;
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
