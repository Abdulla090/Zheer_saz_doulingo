import { isGeminiConfigured } from "../constants/gemini";
import { evaluateSpeechWithGemini } from "../services/gemini-speech-service";
import { useCallback, useEffect, useRef, useState } from "react";

export type GeminiVoiceHandlers = {
  onResult: (text: string, matches: boolean) => void;
  onError?: (message: string) => void;
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Failed to read audio."));
    reader.readAsDataURL(blob);
  });
}

export function normalizeAudioMimeType(mimeType: string): string {
  const base = mimeType.split(";")[0]?.trim().toLowerCase() || "audio/webm";
  if (base.startsWith("audio/")) return base;
  return "audio/webm";
}

export function useGeminiVoiceCapture() {
  const available = isGeminiConfigured();
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handlersRef = useRef<GeminiVoiceHandlers | null>(null);
  const listeningRef = useRef(false);
  const processingRef = useRef(false);
  const webRecorderRef = useRef<MediaRecorder | null>(null);
  const webChunksRef = useRef<Blob[]>([]);
  const webStreamRef = useRef<MediaStream | null>(null);
  const webMimeTypeRef = useRef("audio/webm");

  const setListeningState = useCallback((value: boolean) => {
    listeningRef.current = value;
    setListening(value);
  }, []);

  const setProcessingState = useCallback((value: boolean) => {
    processingRef.current = value;
    setProcessing(value);
  }, []);

  const cleanupWebStream = useCallback(() => {
    webStreamRef.current?.getTracks().forEach((track) => track.stop());
    webStreamRef.current = null;
  }, []);

  const startWebRecording = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Microphone is not available in this browser.");
      return false;
    }
    if (typeof MediaRecorder === "undefined") {
      setError("Audio recording is not supported in this browser.");
      return false;
    }

    try {
      setPermissionDenied(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      webStreamRef.current = stream;
      webChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "";

      webMimeTypeRef.current = normalizeAudioMimeType(mimeType || "audio/webm");

      const mr = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      webRecorderRef.current = mr;
      mr.ondataavailable = (event) => {
        if (event.data.size > 0) {
          webChunksRef.current.push(event.data);
        }
      };
      mr.start(250);
      return true;
    } catch (err) {
      const errorName = err instanceof Error ? err.name : "";
      const denied = errorName === "NotAllowedError" || errorName === "SecurityError";
      setPermissionDenied(denied);
      const message = denied
        ? "Microphone access is blocked. Allow microphone access in this site's browser settings, then tap the microphone again."
        : errorName === "NotFoundError"
          ? "No microphone was found. Connect a microphone and try again."
          : "The microphone could not start. Close other apps using it and try again.";
      setError(message);
      cleanupWebStream();
      return false;
    }
  }, [cleanupWebStream]);

  const stopWebRecording = useCallback(async () => {
    const mr = webRecorderRef.current;
    if (!mr || mr.state === "inactive") {
      return null;
    }

    return new Promise<{ base64: string; mimeType: string } | null>(
      (resolve) => {
        const safetyTimeout = setTimeout(() => {
          cleanupWebStream();
          resolve(null);
        }, 4000);

        mr.onstop = async () => {
          clearTimeout(safetyTimeout);
          try {
            cleanupWebStream();
            const blob = new Blob(webChunksRef.current, {
              type: mr.mimeType || webMimeTypeRef.current,
            });
            webChunksRef.current = [];
            webRecorderRef.current = null;

            if (blob.size < 64) {
              resolve(null);
              return;
            }

            const base64 = await blobToBase64(blob);
            resolve({
              base64,
              mimeType: normalizeAudioMimeType(blob.type || webMimeTypeRef.current),
            });
          } catch (err) {
            console.error("Error in MediaRecorder.onstop (Web):", err);
            resolve(null);
          }
        };

        try {
          if (mr.state === "recording") {
            mr.requestData();
          }
          mr.stop();
        } catch {
          clearTimeout(safetyTimeout);
          cleanupWebStream();
          resolve(null);
        }
      },
    );
  }, [cleanupWebStream]);

  const processAudio = useCallback(
    async (
      audio: { base64: string; mimeType: string },
      targetPhrase: string,
    ) => {
      setProcessingState(true);
      try {
        const result = await evaluateSpeechWithGemini({
          audioBase64: audio.base64,
          mimeType: audio.mimeType,
          targetPhrase,
        });
        handlersRef.current?.onResult(result.transcript, result.matches);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Speech check failed.";
        setError(message);
        handlersRef.current?.onError?.(message);
      } finally {
        setProcessingState(false);
        setListeningState(false);
      }
    },
    [setListeningState, setProcessingState],
  );

  const start = useCallback(
    async (handlers: GeminiVoiceHandlers) => {
      if (!available) {
        setError("Twino's speech evaluator is not configured.");
        return false;
      }

      handlersRef.current = handlers;
      setError(null);

      try {
        const ok = await startWebRecording();
        if (ok) setListeningState(true);
        return ok;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not start recording.";
        setError(message);
        handlersRef.current?.onError?.(message);
        return false;
      }
    },
    [available, setListeningState, startWebRecording],
  );

  const stopAndEvaluate = useCallback(
    async (targetPhrase: string) => {
      if (!listeningRef.current || processingRef.current) {
        return;
      }

      setListeningState(false);
      try {
        const audio = await stopWebRecording();

        if (!audio?.base64) {
          const message = "No speech detected — try again.";
          setError(message);
          handlersRef.current?.onError?.(message);
          return;
        }

        await processAudio(audio, targetPhrase);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not process recording.";
        setError(message);
        handlersRef.current?.onError?.(message);
      }
    },
    [
      processAudio,
      setListeningState,
      stopWebRecording,
    ],
  );

  const stopAndGetAudio = useCallback(async () => {
    if (!listeningRef.current) {
      return null;
    }

    setListeningState(false);
    try {
      const audio = await stopWebRecording();

      if (!audio?.base64) {
        const message = "No speech detected — try again.";
        setError(message);
        handlersRef.current?.onError?.(message);
        return null;
      }

      return audio;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not process recording.";
      setError(message);
      handlersRef.current?.onError?.(message);
      return null;
    }
  }, [setListeningState, stopWebRecording]);

  const abort = useCallback(async () => {
    handlersRef.current = null;

    if (webRecorderRef.current && webRecorderRef.current.state !== "inactive") {
      try {
        webRecorderRef.current.stop();
      } catch {
        /* noop */
      }
    } else {
      cleanupWebStream();
    }
    webRecorderRef.current = null;
    webChunksRef.current = [];

    setListeningState(false);
    setProcessingState(false);
  }, [cleanupWebStream, setListeningState, setProcessingState]);

  useEffect(() => {
    return () => {
      handlersRef.current = null;
      cleanupWebStream();
    };
  }, [cleanupWebStream]);

  return {
    available,
    listening,
    processing,
    error,
    permissionDenied,
    start,
    stopAndEvaluate,
    stopAndGetAudio,
    abort,
  };
}
