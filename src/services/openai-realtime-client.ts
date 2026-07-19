import { supabase } from "../lib/supabase";
import { buildLiveTutorSystem } from "./gemini-live-client";
import { useSettingsStore } from "../stores/useSettingsStore";

export const OPENAI_REALTIME_MODEL = "gpt-realtime-2.1";
export const OPENAI_REALTIME_SAMPLE_RATE = 24_000;

type RealtimeCallbacks = {
  onReady?: () => void;
  onAudio?: (pcmBase64: string) => void;
  onInputTranscription?: (text: string) => void;
  onOutputTranscription?: (text: string) => void;
  onTurnComplete?: () => void;
  onSpeechStarted?: () => void;
  onError?: (message: string) => void;
  onClose?: (reason?: string) => void;
};

type ClientSecretResponse = {
  value?: string;
  model?: string;
};

const OPENAI_VOICES = new Set([
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
]);

function selectedOpenAIVoice(): string {
  const selected = useSettingsStore.getState().tutorVoice || "Aoede";
  if (OPENAI_VOICES.has(selected.toLowerCase())) return selected.toLowerCase();

  const legacyMap: Record<string, string> = {
    Aoede: "marin",
    Charon: "cedar",
    Fenrir: "ash",
    Kore: "coral",
    Puck: "verse",
  };
  return legacyMap[selected] ?? "marin";
}

async function createClientSecret(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.access_token) {
    throw new Error("Sign in to use the live AI tutor.");
  }

  const { data, error } = await supabase.functions.invoke<ClientSecretResponse>(
    "openai-realtime-token",
    {
      body: {
        instructions: buildLiveTutorSystem(),
        voice: selectedOpenAIVoice(),
      },
    },
  );

  if (error) throw new Error(error.message || "Live tutor session could not start.");
  if (!data?.value) throw new Error("Live tutor session token was empty.");
  return data.value;
}

function eventText(event: MessageEvent): Promise<string | null> {
  if (typeof event.data === "string") return Promise.resolve(event.data);
  if (event.data instanceof Blob) return event.data.text();
  if (event.data instanceof ArrayBuffer) {
    return Promise.resolve(new TextDecoder().decode(event.data));
  }
  return Promise.resolve(null);
}

export class OpenAIRealtimeSession {
  private ws: WebSocket | null = null;
  private callbacks: RealtimeCallbacks = {};
  private ready = false;

  async connect(callbacks: RealtimeCallbacks): Promise<void> {
    this.callbacks = callbacks;
    this.ready = false;
    const clientSecret = await createClientSecret();
    const url = `wss://api.openai.com/v1/realtime?model=${OPENAI_REALTIME_MODEL}`;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const ws = new WebSocket(url, [
        "realtime",
        `openai-insecure-api-key.${clientSecret}`,
      ]);
      this.ws = ws;

      const fail = (message: string) => {
        this.callbacks.onError?.(message);
        if (!settled) {
          settled = true;
          reject(new Error(message));
        }
      };

      ws.onopen = () => {
        // The short-lived token already carries the complete session config.
      };

      ws.onmessage = async (message) => {
        const raw = await eventText(message);
        if (!raw) return;

        let event: Record<string, any>;
        try {
          event = JSON.parse(raw) as Record<string, any>;
        } catch {
          return;
        }

        switch (event.type) {
          case "session.created":
          case "session.updated":
            if (!this.ready) {
              this.ready = true;
              this.callbacks.onReady?.();
              if (!settled) {
                settled = true;
                resolve();
              }
            }
            break;
          case "response.output_audio.delta":
            if (typeof event.delta === "string") this.callbacks.onAudio?.(event.delta);
            break;
          case "response.output_audio_transcript.delta":
          case "response.output_audio_transcript.done":
            if (typeof event.delta === "string") {
              this.callbacks.onOutputTranscription?.(event.delta);
            } else if (typeof event.transcript === "string") {
              this.callbacks.onOutputTranscription?.(event.transcript);
            }
            break;
          case "conversation.item.input_audio_transcription.completed":
            if (typeof event.transcript === "string") {
              this.callbacks.onInputTranscription?.(event.transcript);
            }
            break;
          case "input_audio_buffer.speech_started":
            this.callbacks.onSpeechStarted?.();
            break;
          case "response.done":
            this.callbacks.onTurnComplete?.();
            break;
          case "error":
            fail(
              typeof event.error?.message === "string"
                ? event.error.message
                : "OpenAI Realtime returned an error.",
            );
            break;
          default:
            break;
        }
      };

      ws.onerror = () => fail("Could not connect to OpenAI Realtime.");
      ws.onclose = (event) => {
        this.callbacks.onClose?.(event.reason || undefined);
        if (!settled) fail(event.reason || "Live tutor connection closed.");
      };
    });
  }

  private send(event: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }

  sendPcmChunk(audio: string) {
    this.send({ type: "input_audio_buffer.append", audio });
  }

  startGreeting() {
    const onboardingComplete =
      useSettingsStore.getState().tutorOnboardingComplete;
    const text = onboardingComplete
      ? "Start the live tutoring session. Greet the student briefly and ask if they are ready for the first word."
      : "Start now with exactly: Hi! I'm your English tutor. لە ١ بۆ ١٠، ئاستی ئینگلیزیت چەندە؟";
    this.sendText(text);
  }

  sendText(text: string) {
    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    });
    this.send({ type: "response.create" });
  }

  cancelResponse() {
    this.send({ type: "response.cancel" });
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.ready = false;
  }
}
