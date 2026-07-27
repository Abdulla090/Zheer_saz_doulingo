import { isGeminiConfigured } from "../constants/gemini";
import { evaluateSpeechWithGemini } from "../services/gemini-speech-service";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import { useCallback, useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

export type GeminiVoiceHandlers = {
  onResult: (text: string, matches: boolean) => void;
  onError?: (message: string) => void;
};

async function uriToBase64Native(uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { base64, mimeType: "audio/mp4" };
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

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderRef = useRef(recorder);

  useEffect(() => {
    recorderRef.current = recorder;
  }, [recorder]);

  const setListeningState = useCallback((value: boolean) => {
    listeningRef.current = value;
    setListening(value);
  }, []);

  const setProcessingState = useCallback((value: boolean) => {
    processingRef.current = value;
    setProcessing(value);
  }, []);

  const startNativeRecording = useCallback(async (): Promise<boolean> => {
    let perm = await requestRecordingPermissionsAsync();
    
    if (!perm.granted && Platform.OS === "android") {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "Twino English needs access to your microphone for speaking practice.",
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
      setPermissionDenied(true);
      setError(
        perm.canAskAgain === false
          ? "Microphone access is blocked. Enable it for Twino in your device Settings, then try again."
          : "Microphone access is required to check your speaking.",
      );
      return false;
    }

    setPermissionDenied(false);
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    } catch (e) {
      console.warn("setAudioModeAsync failed:", e);
    }
    
    try {
      await recorderRef.current.prepareToRecordAsync();
      recorderRef.current.record();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Failed to start recording: ${message}`);
      return false;
    }
    
    return true;
  }, []);

  const stopNativeRecording = useCallback(async () => {
    try {
      const rec = recorderRef.current;
      if (!rec) return null;

      let isRecording = false;
      try {
        isRecording = rec.isRecording;
      } catch (err) {
        console.warn("[useGeminiVoiceCapture] isRecording check failed:", err);
      }

      if (isRecording) {
        try {
          await Promise.race([
            rec.stop(),
            new Promise((resolve) => setTimeout(resolve, 3000)),
          ]);
        } catch (err) {
          console.warn("[useGeminiVoiceCapture] stop() failed:", err);
        }
      }

      let uri = null;
      try {
        uri = rec.uri;
      } catch (err) {
        console.warn("[useGeminiVoiceCapture] uri read failed:", err);
      }

      if (!uri) return null;
      const audio = await uriToBase64Native(uri);
      return {
        ...audio,
        mimeType: normalizeAudioMimeType(audio.mimeType),
      };
    } catch (err) {
      console.error("[useGeminiVoiceCapture] stopNativeRecording failed:", err);
      return null;
    }
  }, []);

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
        const ok = await startNativeRecording();
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
    [available, setListeningState, startNativeRecording],
  );

  const stopAndEvaluate = useCallback(
    async (targetPhrase: string) => {
      if (!listeningRef.current || processingRef.current) {
        return;
      }

      setListeningState(false);
      try {
        const audio = await stopNativeRecording();

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
    ],
  );

  const stopAndGetAudio = useCallback(async () => {
    if (!listeningRef.current) {
      return null;
    }

    setListeningState(false);
    try {
      const audio = await stopNativeRecording();

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
  }, [setListeningState, stopNativeRecording]);

  const abort = useCallback(async () => {
    handlersRef.current = null;

    const rec = recorderRef.current;
    if (rec) {
      let isRecording = false;
      try {
        isRecording = rec.isRecording;
      } catch {
        // ignore
      }
      if (isRecording) {
        try {
          await rec.stop();
        } catch {
          // ignore
        }
      }
    }

    setListeningState(false);
    setProcessingState(false);
  }, [setListeningState, setProcessingState]);

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
