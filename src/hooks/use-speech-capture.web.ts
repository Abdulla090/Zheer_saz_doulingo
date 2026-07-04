import { useCallback, useRef, useState, useEffect } from "react";

export type SpeechCaptureHandlers = {
  onResult: (text: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (code: string, message: string) => void;
};

export function useSpeechCapture(lang = "en-US") {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const handlersRef = useRef<SpeechCaptureHandlers | null>(null);

  const available = typeof window !== "undefined" && 
    (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);

  const start = useCallback(
    async (
      handlers: SpeechCaptureHandlers,
      options?: { continuous?: boolean; contextualStrings?: string[] },
    ) => {
      handlersRef.current = handlers;

      if (!available) {
        setError("Speech recognition is not available in this browser.");
        return false;
      }

      try {
        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SpeechRecognitionClass();
        recognitionRef.current = rec;

        rec.lang = lang;
        rec.interimResults = true;
        rec.continuous = options?.continuous ?? false;

        rec.onstart = () => {
          setListening(true);
          setError(null);
        };

        rec.onresult = (event: any) => {
          let transcript = "";
          let isFinal = false;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            transcript += result[0].transcript;
            if (result.isFinal) {
              isFinal = true;
            }
          }

          if (transcript) {
            handlersRef.current?.onResult(transcript.trim(), isFinal);
          }
        };

        rec.onerror = (event: any) => {
          setListening(false);
          const errCode = event.error || "unknown";
          let message = "Speech recognition error";
          if (errCode === "not-allowed") {
            message = "Microphone permission denied.";
          } else if (errCode === "no-speech") {
            message = "No speech detected.";
          }
          setError(message);
          handlersRef.current?.onError?.(errCode, message);
        };

        rec.onend = () => {
          setListening(false);
          handlersRef.current?.onEnd?.();
        };

        rec.start();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError("Failed to start speech recognition: " + message);
        return false;
      }
    },
    [available, lang],
  );

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
  }, []);

  const abort = useCallback(() => {
    handlersRef.current = null;
    try {
      recognitionRef.current?.abort();
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {}
    };
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
