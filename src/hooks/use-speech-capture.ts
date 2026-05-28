import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export type SpeechCaptureHandlers = {
  onResult: (text: string, isFinal: boolean) => void;
  onEnd?: () => void;
  /** Native speech engine error (e.g. no-speech). */
  onError?: (code: string, message: string) => void;
};

function joinTranscript(
  results: { transcript?: string | null }[] | undefined,
): string {
  if (!results?.length) return "";
  return results
    .map((r) => r.transcript?.trim() ?? "")
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function useSpeechCapture(lang = "en-US") {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handlersRef = useRef<SpeechCaptureHandlers | null>(null);

  const available = ExpoSpeechRecognitionModule.isRecognitionAvailable();

  useSpeechRecognitionEvent("start", () => {
    setListening(true);
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setListening(false);
    handlersRef.current?.onEnd?.();
  });

  useSpeechRecognitionEvent("result", (event) => {
    const transcript = joinTranscript(event.results);
    if (!transcript) return;
    handlersRef.current?.onResult(transcript, Boolean(event.isFinal));
  });

  useSpeechRecognitionEvent("error", (event) => {
    setListening(false);
    const message = event.message || "Speech recognition unavailable";
    setError(message);
    handlersRef.current?.onError?.(event.error ?? "unknown", message);
  });

  const start = useCallback(
    async (
      handlers: SpeechCaptureHandlers,
      options?: { continuous?: boolean },
    ) => {
      handlersRef.current = handlers;

      if (!available) {
        setError("Speech recognition is not available on this device.");
        return false;
      }

      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        setError("Microphone permission is required for speaking practice.");
        return false;
      }

      setError(null);
      ExpoSpeechRecognitionModule.start({
        lang,
        interimResults: true,
        continuous:
          options?.continuous ??
          (Platform.OS === "android" || Platform.OS === "ios"),
      });
      return true;
    },
    [available, lang],
  );

  const stop = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      /* noop */
    }
  }, []);

  const abort = useCallback(() => {
    handlersRef.current = null;
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch {
      /* noop */
    }
  }, []);

  return {
    listening,
    error,
    available,
    start,
    stop,
    abort,
    setError,
  };
}
