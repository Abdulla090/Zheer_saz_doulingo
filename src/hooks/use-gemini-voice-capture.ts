import { isGeminiConfigured } from "../constants/gemini";
import { evaluateSpeechWithGemini } from "../services/gemini-speech-service";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import { useCallback, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

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

async function uriToBase64Native(uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { base64, mimeType: "audio/mp4" };
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
  const recorderRef = useRef(recorder);
  recorderRef.current = recorder;

  const setListeningState = useCallback((value: boolean) => {
    console.trace("[useGeminiVoiceCapture] setListeningState called with:", value);
    listeningRef.current = value;
    setListening(value);
  }, []);

  const setProcessingState = useCallback((value: boolean) => {
    console.log("[useGeminiVoiceCapture] setProcessingState called with:", value);
    processingRef.current = value;
    setProcessing(value);
  }, []);

  const cleanupWebStream = useCallback(() => {
    webStreamRef.current?.getTracks().forEach((track) => track.stop());
    webStreamRef.current = null;
  }, []);

  const startWebRecording = useCallback(async (): Promise<boolean> => {
    console.log("[useGeminiVoiceCapture] startWebRecording called");
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      console.warn("[useGeminiVoiceCapture] navigator.mediaDevices.getUserMedia not available");
      setError("Microphone is not available in this browser.");
      return false;
    }

    try {
      console.log("[useGeminiVoiceCapture] Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("[useGeminiVoiceCapture] Microphone access granted");
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
      console.log("[useGeminiVoiceCapture] Web recording MIME type:", webMimeTypeRef.current);

      const mr = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      webRecorderRef.current = mr;
      mr.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("[useGeminiVoiceCapture] Web chunk available, size:", event.data.size);
          webChunksRef.current.push(event.data);
        }
      };
      console.log("[useGeminiVoiceCapture] Starting MediaRecorder...");
      mr.start(250);
      return true;
    } catch (err) {
      console.error("[useGeminiVoiceCapture] startWebRecording error:", err);
      const message =
        err instanceof Error ? err.message : "Microphone permission denied.";
      setError(message);
      cleanupWebStream();
      return false;
    }
  }, [cleanupWebStream]);

  const stopWebRecording = useCallback(async () => {
    console.log("[useGeminiVoiceCapture] stopWebRecording called");
    const mr = webRecorderRef.current;
    if (!mr || mr.state === "inactive") {
      console.log("[useGeminiVoiceCapture] stopWebRecording: MediaRecorder is null or inactive");
      return null;
    }

    return new Promise<{ base64: string; mimeType: string } | null>(
      (resolve) => {
        // Safety timeout in case onstop never fires (4 seconds)
        const safetyTimeout = setTimeout(() => {
          console.warn("[useGeminiVoiceCapture] stopWebRecording: safety timeout triggered (onstop did not fire).");
          cleanupWebStream();
          resolve(null);
        }, 4000);

        mr.onstop = async () => {
          clearTimeout(safetyTimeout);
          console.log("[useGeminiVoiceCapture] MediaRecorder.onstop fired");
          try {
            cleanupWebStream();
            const blob = new Blob(webChunksRef.current, {
              type: mr.mimeType || webMimeTypeRef.current,
            });
            webChunksRef.current = [];
            webRecorderRef.current = null;

            console.log("[useGeminiVoiceCapture] Audio blob size:", blob.size);
            if (blob.size < 64) {
              console.log("[useGeminiVoiceCapture] Audio blob too small (<64 bytes), resolving null");
              resolve(null);
              return;
            }

            console.log("[useGeminiVoiceCapture] Converting blob to base64...");
            const base64 = await blobToBase64(blob);
            console.log("[useGeminiVoiceCapture] Base64 conversion complete, size:", base64.length);
            resolve({
              base64,
              mimeType: normalizeAudioMimeType(blob.type || webMimeTypeRef.current),
            });
          } catch (err) {
            console.error("[useGeminiVoiceCapture] Error in MediaRecorder.onstop:", err);
            resolve(null);
          }
        };

        try {
          if (mr.state === "recording") {
            mr.requestData();
          }
          console.log("[useGeminiVoiceCapture] Calling MediaRecorder.stop()");
          mr.stop();
        } catch (err) {
          console.error("[useGeminiVoiceCapture] Error calling MediaRecorder.stop():", err);
          clearTimeout(safetyTimeout);
          cleanupWebStream();
          resolve(null);
        }
      },
    );
  }, [cleanupWebStream]);

  const startNativeRecording = useCallback(async (): Promise<boolean> => {
    let perm = await requestRecordingPermissionsAsync();
    
    // Fallback to explicit PermissionsAndroid request if not granted
    if (!perm.granted && Platform.OS === "android") {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "Phingo English needs access to your microphone for speaking practice.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          perm = { granted: true, status: "granted" as any, canAskAgain: true, expires: "never" };
        }
      } catch (err) {
        console.warn("PermissionsAndroid failed", err);
      }
    }

    if (!perm.granted) {
      setError("Microphone permission is required for speaking practice.");
      return false;
    }

    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    } catch (e) {
      console.warn("setAudioModeAsync failed:", e);
    }
    
    try {
      recorderRef.current.record();
    } catch {
      setError("Failed to start recording on Android.");
      return false;
    }
    
    return true;
  }, []);

  const stopNativeRecording = useCallback(async () => {
    if (recorderRef.current.isRecording) {
      await Promise.race([
        recorderRef.current.stop(),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
    }
    const uri = recorderRef.current.uri;
    if (!uri) return null;
    const audio = await uriToBase64Native(uri);
    return {
      ...audio,
      mimeType: normalizeAudioMimeType(audio.mimeType),
    };
  }, []);

  const processAudio = useCallback(
    async (
      audio: { base64: string; mimeType: string },
      targetPhrase: string,
    ) => {
      console.log("[useGeminiVoiceCapture] processAudio starting for phrase:", targetPhrase);
      setProcessingState(true);
      try {
        console.log("[useGeminiVoiceCapture] Sending audio to Gemini speech service...");
        const result = await evaluateSpeechWithGemini({
          audioBase64: audio.base64,
          mimeType: audio.mimeType,
          targetPhrase,
        });
        console.log("[useGeminiVoiceCapture] Speech evaluation result:", result);
        handlersRef.current?.onResult(result.transcript, result.matches);
      } catch (err) {
        console.error("[useGeminiVoiceCapture] Speech evaluation failed error:", err);
        const message =
          err instanceof Error ? err.message : "Speech check failed.";
        setError(message);
        handlersRef.current?.onError?.(message);
      } finally {
        console.log("[useGeminiVoiceCapture] processAudio finally block execution");
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
      console.log("[useGeminiVoiceCapture] stopAndEvaluate called. Target:", targetPhrase, "| listening:", listeningRef.current, "| processing:", processingRef.current);
      if (!listeningRef.current || processingRef.current) {
        console.warn("[useGeminiVoiceCapture] stopAndEvaluate ignored: listening is false or processing is true");
        return;
      }

      setListeningState(false);
      try {
        const audio =
          Platform.OS === "web"
            ? await stopWebRecording()
            : await stopNativeRecording();

        if (!audio?.base64) {
          const message = "No speech detected — try again.";
          console.warn("[useGeminiVoiceCapture] stopAndEvaluate: No audio data captured, triggering onError");
          setError(message);
          handlersRef.current?.onError?.(message);
          return;
        }

        await processAudio(audio, targetPhrase);
      } catch (err) {
        console.error("[useGeminiVoiceCapture] stopAndEvaluate error:", err);
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

  const stopAndGetAudio = useCallback(async () => {
    console.log("[useGeminiVoiceCapture] stopAndGetAudio called. listening:", listeningRef.current);
    if (!listeningRef.current) {
      console.warn("[useGeminiVoiceCapture] stopAndGetAudio ignored: listening is false");
      return null;
    }

    setListeningState(false);
    try {
      const audio =
        Platform.OS === "web"
          ? await stopWebRecording()
          : await stopNativeRecording();

      if (!audio?.base64) {
        const message = "No speech detected — try again.";
        console.warn("[useGeminiVoiceCapture] stopAndGetAudio: No audio data captured, triggering onError");
        setError(message);
        handlersRef.current?.onError?.(message);
        return null;
      }

      return audio;
    } catch (err) {
      console.error("[useGeminiVoiceCapture] stopAndGetAudio error:", err);
      const message =
        err instanceof Error ? err.message : "Could not process recording.";
      setError(message);
      handlersRef.current?.onError?.(message);
      return null;
    }
  }, [setListeningState, stopNativeRecording, stopWebRecording]);

  const abort = useCallback(async () => {
    console.trace("[useGeminiVoiceCapture] abort called");
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
    } else if (recorderRef.current.isRecording) {
      await recorderRef.current.stop();
    }

    setListeningState(false);
    setProcessingState(false);
  }, [cleanupWebStream, setListeningState, setProcessingState]);

  return {
    available,
    listening,
    processing,
    error,
    start,
    stopAndEvaluate,
    stopAndGetAudio,
    abort,
  };
}
