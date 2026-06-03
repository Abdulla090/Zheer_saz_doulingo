import { isGeminiConfigured } from "@/constants/gemini";
import {
  GeminiLiveSession,
  type LiveSessionPhase,
} from "@/services/gemini-live-client";
import {
  LivePcmPlayer,
  startMicPcmStream,
  isLiveAudioSupported,
} from "@/utils/gemini-live-audio";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export type LiveTutorStatus =
  | "idle"
  | "connecting"
  | "live"
  | "speaking"
  | "listening"
  | "error";

async function uriToBase64(uri: string) {
  const res = await fetch(uri);
  const blob = await res.blob();
  const mimeType = blob.type || "audio/mp4";
  return new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      resolve({ base64: dataUrl.split(",")[1] ?? "", mimeType });
    };
    reader.onerror = () => reject(new Error("Failed to read audio."));
    reader.readAsDataURL(blob);
  });
}

export function useGeminiLiveTutor() {
  const configured = isGeminiConfigured();
  const supported = isLiveAudioSupported();
  const nativeRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const sessionRef = useRef<GeminiLiveSession | null>(null);
  const playerRef = useRef<LivePcmPlayer | null>(null);
  const micRef = useRef<{ stop: () => void } | null>(null);
  const nativeLoopRef = useRef(false);
  const micActiveRef = useRef(false);

  const [phase, setPhase] = useState<LiveSessionPhase>("intro_ku");
  const [status, setStatus] = useState<LiveTutorStatus>("idle");
  const [sessionActive, setSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stopMic = useCallback(() => {
    micActiveRef.current = false;
    micRef.current?.stop();
    micRef.current = null;
    nativeLoopRef.current = false;
    if (nativeRecorder.isRecording) {
      void nativeRecorder.stop();
    }
    sessionRef.current?.sendAudioStreamEnd();
  }, [nativeRecorder]);

  const stopPlayer = useCallback(() => {
    playerRef.current?.stop();
    setSpeaking(false);
  }, []);

  const stopAll = useCallback(() => {
    stopMic();
    stopPlayer();
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    playerRef.current?.destroy();
    playerRef.current = null;
    setSessionActive(false);
    setStatus("idle");
    setSpeaking(false);
    setPhase("intro_ku");
  }, [stopMic, stopPlayer]);

  useEffect(() => () => stopAll(), [stopAll]);

  const startNativeMicLoop = useCallback(async () => {
    if (Platform.OS === "web" || micActiveRef.current) return;

    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      throw new Error("Microphone permission is required.");
    }

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    micActiveRef.current = true;
    nativeLoopRef.current = true;
    setStatus("listening");

    const loop = async () => {
      while (nativeLoopRef.current && micActiveRef.current) {
        try {
          await nativeRecorder.prepareToRecordAsync();
          nativeRecorder.record();
          await new Promise((r) => setTimeout(r, 650));
          if (!nativeLoopRef.current) break;

          if (nativeRecorder.isRecording) {
            await nativeRecorder.stop();
          }
          const uri = nativeRecorder.uri;
          if (uri && sessionRef.current) {
            const audio = await uriToBase64(uri);
            if (audio.base64) {
              sessionRef.current.sendAudioChunk(audio.base64, audio.mimeType);
            }
          }
        } catch {
          await new Promise((r) => setTimeout(r, 180));
        }
      }
    };

    void loop();
  }, [nativeRecorder]);

  const startMic = useCallback(async () => {
    if (micActiveRef.current) return;

    if (Platform.OS === "web") {
      micRef.current = await startMicPcmStream((chunk: string) => {
        sessionRef.current?.sendPcmChunk(chunk);
      });
      micActiveRef.current = true;
      setStatus("listening");
      return;
    }

    await startNativeMicLoop();
  }, [startNativeMicLoop]);

  const connectSession = useCallback(async () => {
    if (!configured) {
      setError("Add EXPO_PUBLIC_GEMINI_API_KEY to enable Live Voice Tutor.");
      setStatus("error");
      return;
    }

    if (!supported && Platform.OS === "web") {
      setError("Live voice requires microphone access in this browser.");
      setStatus("error");
      return;
    }

    setError(null);
    setStatus("connecting");
    setSessionActive(true);
    setPhase("intro_ku");

    playerRef.current?.destroy();
    playerRef.current = new LivePcmPlayer();

    const session = new GeminiLiveSession();
    sessionRef.current = session;

    try {
      await session.connect({
        onSetupComplete: () => {
          setStatus("live");
          session.startGreeting();
          void startMic();
        },
        onAudio: (pcm) => {
          setSpeaking(true);
          setStatus("speaking");
          playerRef.current?.enqueueBase64Pcm(pcm);
        },
        onTurnComplete: () => {
          setSpeaking(false);
          if (micActiveRef.current) {
            setStatus("listening");
          } else {
            setStatus("live");
          }
        },
        onInterrupted: () => {
          stopPlayer();
          if (micActiveRef.current) {
            setStatus("listening");
          }
        },
        onError: (msg) => {
          setError(msg);
          setStatus("error");
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not connect to Live tutor.";
      setError(msg);
      setStatus("error");
    }
  }, [configured, startMic, stopPlayer, supported]);

  const handleMicPress = useCallback(() => {
    switch (statusRef.current) {
      case "idle":
      case "error":
        void connectSession();
        break;
      case "speaking":
        stopPlayer();
        sessionRef.current?.sendAudioStreamEnd();
        if (!micActiveRef.current) void startMic();
        break;
      case "listening":
        stopMic();
        setStatus("live");
        break;
      case "live":
        void startMic();
        break;
      default:
        break;
    }
  }, [connectSession, startMic, stopMic, stopPlayer]);

  return {
    configured,
    supported,
    phase,
    status,
    sessionActive,
    speaking,
    listening: status === "listening",
    thinking: status === "connecting",
    error,
    handleMicPress,
    stopAll,
  };
}
