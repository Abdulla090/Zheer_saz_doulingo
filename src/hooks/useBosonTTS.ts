import { useState, useCallback } from "react";
import { generateSpeech, playBosonSpeech } from "../lib/boson-ai";

export function useBosonTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState(false);

  const speak = useCallback(async (text: string, voice?: string) => {
    setIsPlaying(true);
    setIsError(false);
    try {
      await playBosonSpeech(text);
    } catch (e) {
      console.error(e);
      setIsError(true);
    } finally {
      setIsPlaying(false);
    }
  }, []);

  return {
    speak,
    isPlaying,
    isError,
  };
}
