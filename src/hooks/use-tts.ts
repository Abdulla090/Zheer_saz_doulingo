import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";

/**
 * Cross-platform TTS hook using the browser's SpeechSynthesis API.
 * Works on web; on native it's a no-op (graceful fallback).
 */
export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: "en" | "ku" = "en", id?: string) => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Cancel any in-progress speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ku" ? "ar" : "en-US"; // Kurdish falls back to Arabic voice
    utterance.rate = 0.9;
    utterance.pitch = 1;

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
  }, []);

  const stop = useCallback(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setActiveId(null);
  }, []);

  return { speak, stop, speaking, activeId };
}
