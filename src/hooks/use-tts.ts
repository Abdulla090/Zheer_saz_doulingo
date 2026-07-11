import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";
import { createAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { generateSpeech, isBosonConfigured } from "../lib/boson-ai";
import { isGeminiConfigured } from "../constants/gemini";
import { generateGeminiSpeech, pcmBase64ToWavBase64 } from "../services/gemini-speech-service";

let Speech: typeof import("expo-speech") | null = null;

async function getSpeech() {
  if (Speech) return Speech;
  if (Platform.OS === "web") return null;
  Speech = await import("expo-speech");
  return Speech;
}

/**
 * Cross-platform TTS: expo-speech on native, SpeechSynthesis on web.
 */
export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const speakTokenRef = useRef(0);
  const bosonPlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const bosonUriRef = useRef<string | null>(null);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopActiveAudio = useCallback(async () => {
    if (bosonPlayerRef.current) {
      try {
        bosonPlayerRef.current.pause();
      } catch {
        /* noop */
      }
      try {
        bosonPlayerRef.current.remove();
      } catch {
        /* noop */
      }
      bosonPlayerRef.current = null;
    }
    if (webAudioRef.current) {
      try {
        webAudioRef.current.pause();
      } catch {
        /* noop */
      }
      webAudioRef.current = null;
    }
    if (bosonUriRef.current && bosonUriRef.current.startsWith("file://")) {
      try {
        await FileSystem.deleteAsync(bosonUriRef.current, { idempotent: true });
      } catch {
        /* noop */
      }
    }
    bosonUriRef.current = null;
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    } else {
      const mod = await getSpeech();
      mod?.stop();
    }
    setSpeaking(false);
    setActiveId(null);
  }, []);

  const speak = useCallback(async (
    text: string,
    lang: "en" | "ku" = "en",
    id?: string,
    options?: {
      rate?: number;
      pitch?: number;
      onDone?: () => void;
    },
  ) => {
    const normalized = text
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .trim();
    if (!normalized) return;

    speakTokenRef.current += 1;
    const token = speakTokenRef.current;
    await stopActiveAudio();

    const finish = () => {
      if (speakTokenRef.current !== token) return;
      setSpeaking(false);
      setActiveId(null);
      options?.onDone?.();
    };

    if (isGeminiConfigured()) {
      try {
        setSpeaking(true);
        setActiveId(id ?? null);

        let voice = "Aoede";
        const hasMaleIndicator = 
          normalized.startsWith("Host two:") || 
          normalized.startsWith("Host 2:") || 
          normalized.startsWith("Zanyar:") || 
          normalized.startsWith("Karwan:") || 
          normalized.startsWith("Aram:") ||
          normalized.includes("Zanyar") ||
          normalized.includes("Karwan");
        if (hasMaleIndicator) {
          voice = "Puck";
        }

        const rawPcmB64 = await generateGeminiSpeech(normalized, voice);
        const wavB64 = pcmBase64ToWavBase64(rawPcmB64, 24000);

        if (speakTokenRef.current !== token) return;

        if (Platform.OS === "web") {
          if (typeof window !== "undefined") {
            const binary = globalThis.atob(wavB64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            webAudioRef.current = audio;
            audio.onended = finish;
            audio.onerror = finish;
            await audio.play();
          } else {
            finish();
          }
          return;
        } else {
          const cacheDir = FileSystem.cacheDirectory;
          if (!cacheDir) {
            throw new Error("Audio cache directory unavailable.");
          }

          const fileUri = `${cacheDir}gemini-tts-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.wav`;
          await FileSystem.writeAsStringAsync(fileUri, wavB64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (speakTokenRef.current !== token) {
            try {
              await FileSystem.deleteAsync(fileUri, { idempotent: true });
            } catch {}
            return;
          }

          bosonUriRef.current = fileUri;
          const player = createAudioPlayer(fileUri, {
            keepAudioSessionActive: true,
            updateInterval: 100,
          });
          bosonPlayerRef.current = player;
          const sub = player.addListener("playbackStatusUpdate", async (status: any) => {
            if (status.didJustFinish || (status.currentTime > 0 && !status.playing && !status.isBuffering)) {
              sub.remove();
              if (bosonPlayerRef.current === player) {
                bosonPlayerRef.current = null;
              }
              const playedUri = bosonUriRef.current;
              bosonUriRef.current = null;
              try {
                player.remove();
              } catch {}
              if (playedUri && playedUri.startsWith("file://")) {
                try {
                  await FileSystem.deleteAsync(playedUri, { idempotent: true });
                } catch {}
              }
              finish();
            }
          });
          player.play();
          return;
        }
      } catch (err) {
        console.error("Gemini TTS failed, falling back to other providers:", err);
        webAudioRef.current = null;
        bosonPlayerRef.current = null;
        bosonUriRef.current = null;
        setSpeaking(false);
        setActiveId(null);
      }
    }

    if (Platform.OS !== "web" && isBosonConfigured()) {
      try {
        setSpeaking(true);
        setActiveId(id ?? null);
        const uri = await generateSpeech(normalized, "default");
        if (speakTokenRef.current !== token) {
          if (uri.startsWith("file://")) {
            try {
              await FileSystem.deleteAsync(uri, { idempotent: true });
            } catch {
              /* noop */
            }
          }
          return;
        }

        bosonUriRef.current = uri;
        const player = createAudioPlayer(uri, {
          keepAudioSessionActive: true,
          updateInterval: 100,
        });
        bosonPlayerRef.current = player;
        const sub = player.addListener("playbackStatusUpdate", async (status: any) => {
          if (status.didJustFinish || (status.currentTime > 0 && !status.playing && !status.isBuffering)) {
            sub.remove();
            if (bosonPlayerRef.current === player) {
              bosonPlayerRef.current = null;
            }
            const playedUri = bosonUriRef.current;
            bosonUriRef.current = null;
            try {
              player.remove();
            } catch {
              /* noop */
            }
            if (playedUri && playedUri.startsWith("file://")) {
              try {
                await FileSystem.deleteAsync(playedUri, { idempotent: true });
              } catch {
                /* noop */
              }
            }
            finish();
          }
        });
        player.play();
        return;
      } catch {
        bosonPlayerRef.current = null;
        bosonUriRef.current = null;
        setSpeaking(false);
        setActiveId(null);
        // fall through to the native speech fallback below
      }
    }

    setSpeaking(true);
    setActiveId(id ?? null);

    if (Platform.OS === "web") {
      if (typeof window === "undefined") {
        finish();
        return;
      }
      const synth = window.speechSynthesis;
      if (!synth) {
        finish();
        return;
      }

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(normalized);
      utterance.lang = lang === "ku" ? "ar" : "en-US";
      utterance.rate = options?.rate ?? 0.95;
      utterance.pitch = options?.pitch ?? 1;
      utterance.onend = finish;
      utterance.onerror = finish;
      synth.speak(utterance);
      return;
    }

    const mod = await getSpeech();
    if (!mod || speakTokenRef.current !== token) {
      finish();
      return;
    }

    mod.stop();
    mod.speak(normalized, {
      language: lang === "ku" ? "ar-IQ" : "en-US",
      rate: options?.rate ?? 0.96,
      pitch: options?.pitch ?? 1,
      onDone: finish,
      onStopped: finish,
      onError: finish,
    });
  }, [stopActiveAudio]);

  const stop = useCallback(async () => {
    speakTokenRef.current += 1;
    await stopActiveAudio();
  }, [stopActiveAudio]);

  return { speak, stop, speaking, activeId };
}
