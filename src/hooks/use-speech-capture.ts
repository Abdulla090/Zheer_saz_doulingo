import { useCallback, useRef, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export type SpeechCaptureHandlers = {
  onResult: (text: string, isFinal: boolean) => void;
  onEnd?: () => void;
};

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
    const transcript = event.results[0]?.transcript?.trim() ?? "";
    if (!transcript) return;
    handlersRef.current?.onResult(transcript, Boolean(event.isFinal));
  });

  useSpeechRecognitionEvent("error", (event) => {
    setListening(false);
    setError(event.message || "Speech recognition unavailable");
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
        continuous: options?.continuous ?? false,
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
