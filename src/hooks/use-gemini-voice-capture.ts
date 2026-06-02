import { isGeminiConfigured } from "@/constants/gemini";
import { evaluateSpeechWithGemini } from "@/services/gemini-speech-service";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";

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

async function uriToBase64(uri: string) {
  const res = await fetch(uri);
  const blob = await res.blob();
  const mimeType = blob.type || "audio/mp4";
  return { base64: await blobToBase64(blob), mimeType };
}

/** Strip codec suffixes so Gemini receives a supported MIME type. */
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

  const handlersRef = useRef<GeminiVoiceHandlers | null>(null);
  const listeningRef = useRef(false);
  const processingRef = useRef(false);
  const webRecorderRef = useRef<MediaRecorder | null>(null);
  const webChunksRef = useRef<Blob[]>([]);
  const webStreamRef = useRef<MediaStream | null>(null);
  const webMimeTypeRef = useRef("audio/webm");

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

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

    try {
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
        if (event.data.size > 0) webChunksRef.current.push(event.data);
      };
      // Timeslice ensures browsers emit chunks during recording, not only on stop.
      mr.start(250);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Microphone permission denied.";
      setError(message);
      cleanupWebStream();
      return false;
    }
  }, [cleanupWebStream]);

  const stopWebRecording = useCallback(async () => {
    const mr = webRecorderRef.current;
    if (!mr || mr.state === "inactive") return null;

    return new Promise<{ base64: string; mimeType: string } | null>(
      (resolve) => {
        mr.onstop = async () => {
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

          resolve({
            base64: await blobToBase64(blob),
            mimeType: normalizeAudioMimeType(blob.type || webMimeTypeRef.current),
          });
        };

        try {
          if (mr.state === "recording") {
            mr.requestData();
          }
          mr.stop();
        } catch {
          cleanupWebStream();
          resolve(null);
        }
      },
    );
  }, [cleanupWebStream]);

  const startNativeRecording = useCallback(async (): Promise<boolean> => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setError("Microphone permission is required for speaking practice.");
      return false;
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  }, [recorder]);

  const stopNativeRecording = useCallback(async () => {
    if (recorder.isRecording) {
      await recorder.stop();
    }
    const uri = recorder.uri;
    if (!uri) return null;
    const audio = await uriToBase64(uri);
    return {
      ...audio,
      mimeType: normalizeAudioMimeType(audio.mimeType),
    };
  }, [recorder]);

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
      if (!available) return false;

      handlersRef.current = handlers;
      setError(null);

      try {
        const ok =
          Platform.OS === "web"
            ? await startWebRecording()
            : await startNativeRecording();
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
    [available, setListeningState, startNativeRecording, startWebRecording],
  );

  const stopAndEvaluate = useCallback(
    async (targetPhrase: string) => {
      if (!listeningRef.current || processingRef.current) return;

      setListeningState(false);
      try {
        const audio =
          Platform.OS === "web"
            ? await stopWebRecording()
            : await stopNativeRecording();

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
      stopNativeRecording,
      stopWebRecording,
    ],
  );

  const abort = useCallback(async () => {
    handlersRef.current = null;

    if (Platform.OS === "web") {
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
    } else if (recorder.isRecording) {
      await recorder.stop();
    }

    setListeningState(false);
    setProcessingState(false);
  }, [cleanupWebStream, recorder, setListeningState, setProcessingState]);

  return {
    available,
    listening,
    processing,
    error,
    start,
    stopAndEvaluate,
    abort,
  };
}
