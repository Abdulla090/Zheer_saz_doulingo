import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";

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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(async (text: string, lang: "en" | "ku" = "en", id?: string) => {
    if (!text.trim()) return;

    if (Platform.OS === "web") {
      if (typeof window === "undefined") return;
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ku" ? "ar" : "en-US";
      utterance.rate = 0.9;
      utterance.onstart = () => {
        setSpeaking(true);
        setActiveId(id ?? null);
      };
      utterance.onend = () => {
        setSpeaking(false);
        setActiveId(null);
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setActiveId(null);
      };
      utteranceRef.current = utterance;
      synth.speak(utterance);
      return;
    }

    const mod = await getSpeech();
    if (!mod) return;
    mod.stop();
    setSpeaking(true);
    setActiveId(id ?? null);
    mod.speak(text, {
      language: lang === "ku" ? "ar-IQ" : "en-US",
      rate: 0.92,
      onDone: () => {
        setSpeaking(false);
        setActiveId(null);
      },
      onStopped: () => {
        setSpeaking(false);
        setActiveId(null);
      },
      onError: () => {
        setSpeaking(false);
        setActiveId(null);
      },
    });
  }, []);

  const stop = useCallback(async () => {
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

  return { speak, stop, speaking, activeId };
}
