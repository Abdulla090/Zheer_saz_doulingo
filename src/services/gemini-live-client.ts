import {
  GEMINI_LIVE_INPUT_RATE,
  GEMINI_LIVE_MODEL,
  getGeminiLiveWebSocketUrl,
} from "../constants/gemini";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useLocaleStore } from "../stores/useLocaleStore";

export type LiveSessionPhase = "intro_ku" | "english";

export type LiveServerMessage = Record<string, unknown>;

export type LiveSessionCallbacks = {
  onOpen?: () => void;
  onSetupComplete?: () => void;
  onAudio?: (pcmBase64: string) => void;
  onText?: (text: string) => void;
  onTurnComplete?: () => void;
  onInterrupted?: () => void;
  onClose?: (reason?: string) => void;
  onError?: (message: string) => void;
};

function getLanguageName(code: string): string {
  switch (code?.toLowerCase()) {
    case "ku":
      return "Kurdish Sorani";
    case "ar":
      return "Arabic";
    case "en":
      return "English";
    default:
      return "English";
  }
}

function buildLiveTutorSystem(): string {
  const level = useSettingsStore.getState().englishLevel || 5;
  const age = useSettingsStore.getState().userAge || "";
  const name = useSettingsStore.getState().userName || "Student";
  const onboardingComplete = useSettingsStore.getState().tutorOnboardingComplete;

  const sourceLangCode = useLocaleStore.getState().selectedSourceLanguage || "ku";
  const targetLangCode = useLocaleStore.getState().selectedTargetLanguage || "en";

  const sourceLangName = getLanguageName(sourceLangCode);
  const targetLangName = getLanguageName(targetLangCode);

  const levelMapping: Record<number, { cefr: string; pace: string; vocab: string; feedback: string; desc: string }> = {
    1: { cefr: "Pre-A1", pace: "very slowly, with long pauses between words", vocab: "greetings, numbers, colors, family words", feedback: sourceLangName, desc: "Greetings, numbers, colors, family words" },
    2: { cefr: "A1", pace: "very slowly", vocab: "everyday nouns/verbs", feedback: sourceLangName, desc: "Everyday nouns/verbs" },
    3: { cefr: "A1+", pace: "slowly", vocab: "daily routine vocabulary", feedback: sourceLangName, desc: "Daily routine vocab" },
    4: { cefr: "A2", pace: "slowly", vocab: "common objects, feelings", feedback: targetLangName, desc: "Common objects, feelings" },
    5: { cefr: "A2+", pace: "moderately slowly", vocab: "shopping, travel, work basics", feedback: targetLangName, desc: "Shopping, travel, work basics" },
    6: { cefr: "B1", pace: "normal pace", vocab: "opinions, descriptions", feedback: targetLangName, desc: "Opinions, descriptions" },
    7: { cefr: "B1+", pace: "natural conversational speed", vocab: "idiomatic everyday phrases", feedback: targetLangName, desc: "Idiomatic everyday phrases" },
    8: { cefr: "B2", pace: "natural conversational speed", vocab: "abstract topics (news, work, plans)", feedback: targetLangName, desc: "Abstract topics (news, work, plans)" },
    9: { cefr: "B2+/C1", pace: "natural native speed", vocab: "professional/academic vocabulary", feedback: targetLangName, desc: "Professional/academic vocab" },
    10: { cefr: "C1/C2", pace: "fast natural native speed", vocab: "native-like range", feedback: targetLangName, desc: "Near-native conversation" },
  };

  const currentLevel = levelMapping[level] || levelMapping[5];
  
  const ageGroup = age && parseInt(age, 10) < 13 
    ? "Child (< 13 years old). Make the topics playful, engaging, and kid-friendly (games, pets, school, toys). Use highly encouraging tone."
    : "Adult. Use standard conversational topics (travel, culture, work, interests, daily life).";

  const systemRules = [
    `You are Twino — a disciplined private English tutor speaking with a ${sourceLangName}-speaking student named ${name}.`,
    `The student's age group is: ${ageGroup}`,
    `VOICE ONLY. The student uses spoken audio only. You reply with spoken audio only.`,
    `Your tone is calm, friendly, encouraging, and modern.`,
    ``,
    `STRICT RULES FOR EVERY TURN:`,
    `- Keep every turn to 1–3 short sentences (roughly 10–25 words). Never lecture.`,
    `- Ask ONE question, then STOP and wait for the student's answer. Never stack multiple questions.`,
    `- No filler phrases (e.g. 'Great question!', 'Sure, let's dive in!', 'Awesome!').`,
    `- Acknowledge briefly ('Good.', 'Nice try.', 'Almost!') and move on.`,
    `- Corrections are always short: state the fixed sentence once, no grammar essays or unsolicited lectures.`,
    `- Never break character to explain what you are doing.`,
  ];

  if (!onboardingComplete) {
    systemRules.push(
      `=== ONBOARDING FLOW ===`,
      `You are in the onboarding phase. Follow these steps exactly:`,
      `1. Greet the student with exactly one sentence in English: 'Hi! I'm your English tutor.'`,
      `2. Immediately after greeting, ask the level question in Kurdish Sorani: 'لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟'`,
      `3. Wait for the student's answer. They will say a number (1-10) or natural language (e.g. 'I am beginner').`,
      `4. Once they state their level, say 'Perfect! Let's start.' in English and set your state to 'teaching'.`,
      `5. Important: Your first response must be exactly: 'Hi! I'm your English tutor. لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟'`
    );
  } else {
    systemRules.push(
      `=== TEACHING LOOP (Level ${level}/10 - CEFR ${currentLevel.cefr}) ===`,
      `Student's level focuses on: ${currentLevel.desc}.`,
      `Use vocabulary and sentence complexity appropriate for level ${level} (CEFR ${currentLevel.cefr}).`,
      `Speak ${currentLevel.pace}.`,
      `Use vocabulary like: ${currentLevel.vocab}.`,
      `Give any linguistic corrections or feedback in ${currentLevel.feedback}.`,
      ``,
      `WORD-FIRST PEDAGOGY LOOP:`,
      `You will introduce words from the level's word list. Do the following for each word:`,
      `1. Ask: 'Do you know the word [word]?'`,
      `2. If the student answers 'yes': ask them to 'Use it in a sentence.'`,
      `   - When they reply, evaluate their sentence. Give brief confirmation or a one-line correction/better sentence.`,
      `3. If the student answers 'no' or is unsure: give a one-line definition and one example sentence at their level.`,
      `   - Then ask them to make their own sentence: 'Now, try to make your own sentence using [word].'`,
      `   - Correct/confirm their sentence briefly.`,
      `4. Repeat this loop. Every 3 words taught, pause the word drills and run a short, guided conversation (2-4 turns) reusing the words just practiced.`,
      `5. Do not output JSON. Reply with natural spoken lines only.`
    );
  }

  return systemRules.join("\n");
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

export class GeminiLiveSession {
  private ws: WebSocket | null = null;
  private callbacks: LiveSessionCallbacks = {};
  private setupDone = false;

  connect(callbacks: LiveSessionCallbacks): Promise<void> {
    this.callbacks = callbacks;
    this.setupDone = false;

    const url = getGeminiLiveWebSocketUrl();
    if (!url) {
      return Promise.reject(new Error("Gemini API key is not configured."));
    }

    return new Promise((resolve, reject) => {
      let settled = false;
      const ws = new WebSocket(url);
      this.ws = ws;

      ws.onopen = () => {
        this.callbacks.onOpen?.();
        this.sendSetup();
      };

      ws.onmessage = async (event) => {
        let data: string | null = null;
        if (typeof event.data === "string") {
          data = event.data;
        } else if (event.data instanceof Blob) {
          data = await event.data.text();
        } else if (event.data instanceof ArrayBuffer) {
          data = new TextDecoder().decode(event.data);
        } else if (event.data?.text) {
          data = await event.data.text();
        }
        console.log("WS MESSAGE:", data?.substring(0, 500));
        if (!data) return;

        const msg = parseServerMessage(data);
        if (!msg) return;

        const err = pick<{ message?: string }>(msg, "error", "error");
        if (err?.message) {
          this.callbacks.onError?.(err.message);
          if (!settled) {
            settled = true;
            reject(new Error(err.message));
          }
          return;
        }

        if ((msg.setupComplete || msg.setup_complete) && !this.setupDone) {
          this.setupDone = true;
          this.callbacks.onSetupComplete?.();
          if (!settled) {
            settled = true;
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

        const serverContent = pick<Record<string, unknown>>(msg, "serverContent", "server_content");
        if (serverContent?.interrupted) {
          this.callbacks.onInterrupted?.();
        }
        if (serverContent?.turnComplete || serverContent?.turn_complete) {
          this.callbacks.onTurnComplete?.();
        }
      };

      ws.onerror = (event) => {
        console.error("WS ERROR:", event);
        const err = new Error("Live connection failed.");
        this.callbacks.onError?.(err.message);
        if (!settled) {
          settled = true;
          reject(err);
        }
      };

      ws.onclose = (event) => {
        console.warn("WS CLOSE:", event.code, event.reason);
        this.callbacks.onClose?.(event.reason || undefined);
        if (!settled) {
          settled = true;
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

  private sendSetup() {
    // Raw WebSocket wire format uses snake_case (see Google cookbook).
    this.send({
      setup: {
        model: `models/${GEMINI_LIVE_MODEL}`,
        generation_config: {
          response_modalities: ["AUDIO"],
          speech_config: {
            voice_config: {
              prebuilt_voice_config: { voice_name: useSettingsStore.getState().tutorVoice || "Aoede" },
            },
          },
          max_output_tokens: 150, // Hard limit to enforce turn length constraint
        },
        system_instruction: {
          parts: [{ text: buildLiveTutorSystem() }],
        },
      },
    });
  }

  startGreeting() {
    const onboardingComplete = useSettingsStore.getState().tutorOnboardingComplete;
    const promptText = onboardingComplete
      ? "Start this live voice tutor session now. Greet the student briefly in English, and ask if they are ready for their first word drill."
      : "Start this live voice tutor session now. Greet the student with exactly: 'Hi! I'm your English tutor. لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟'";

    this.send({
      client_content: {
        turns: [
          {
            role: "user",
            parts: [{ text: promptText }],
          },
        ],
        turn_complete: true,
      },
    });
  }

  sendPcmChunk(pcmBase64: string) {
    this.sendAudioChunk(pcmBase64, `audio/pcm;rate=${GEMINI_LIVE_INPUT_RATE}`);
  }

  sendAudioChunk(base64: string, mimeType: string) {
    // Use the new `realtime_input.audio` format.
    // `media_chunks` was deprecated and causes 1007 WebSocket close on newer models.
    this.send({
      realtime_input: {
        audio: { data: base64, mime_type: mimeType },
      },
    });
  }

  sendAudioStreamEnd() {
    this.send({ client_content: { turn_complete: true } });
  }

  sendClientAudio(base64: string, mimeType: string) {
    this.send({
      client_content: {
        turns: [
          {
            role: "user",
            parts: [{ inline_data: { mime_type: mimeType, data: base64 } }],
          },
        ],
        turn_complete: true,
      },
    });
  }

  sendClientText(text: string) {
    this.send({
      client_content: {
        turns: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        turn_complete: true,
      },
    });
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.setupDone = false;
  }
}
