import { isGeminiConfigured } from "../constants/gemini";
import {
  GeminiLiveSession,
  type LiveSessionPhase,
} from "../services/gemini-live-client";
import {
  LivePcmPlayer,
  startMicPcmStream,
  isLiveAudioSupported,
} from "../utils/gemini-live-audio";
import { useCallback, useEffect, useRef, useState } from "react";

export type LiveTutorStatus =
  | "idle"
  | "connecting"
  | "live"
  | "speaking"
  | "listening"
  | "error";

export function useGeminiLiveTutor() {
  const configured = isGeminiConfigured();
  const supported = isLiveAudioSupported();

  const sessionRef = useRef<GeminiLiveSession | null>(null);
  const playerRef = useRef<LivePcmPlayer | null>(null);
  const micRef = useRef<{ stop: () => void } | null>(null);
  const micActiveRef = useRef(false);
  const autoLiveRef = useRef(false);

  const [phase, setPhase] = useState<LiveSessionPhase>("intro_ku");
  const [status, setStatus] = useState<LiveTutorStatus>("idle");
  const [sessionActive, setSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stopMic = useCallback(async () => {
    micActiveRef.current = false;
    if (micRef.current) {
      try {
        micRef.current.stop();
      } catch (e) {
        console.warn("Error stopping mic stream:", e);
      }
      micRef.current = null;
    }
    sessionRef.current?.sendAudioStreamEnd();
  }, []);

  const startMic = useCallback(async () => {
    if (micActiveRef.current) return;

    try {
      micRef.current = await startMicPcmStream((chunk: string) => {
        sessionRef.current?.sendPcmChunk(chunk);
      });
      micActiveRef.current = true;
      setStatus("listening");
    } catch (err) {
      setError("Microphone permission is required to speak with the tutor.");
      console.warn("Mic Stream failed:", err);
      setStatus("error");
    }
  }, []);

  const stopPlayer = useCallback(() => {
    playerRef.current?.stop();
    setSpeaking(false);
  }, []);

  const stopAll = useCallback(() => {
    void stopMic();
    stopPlayer();
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    playerRef.current?.destroy();
    playerRef.current = null;
    setSessionActive(false);
    setStatus("idle");
    setSpeaking(false);
    setTranscript("");
    setPhase("intro_ku");
    autoLiveRef.current = false;
  }, [stopMic, stopPlayer]);

  useEffect(() => () => stopAll(), [stopAll]);

  const connectSession = useCallback(async () => {
    if (!configured) {
      setError("Add EXPO_PUBLIC_GEMINI_API_KEY to enable Live Voice Tutor.");
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
        },
        onAudio: (pcm) => {
          if (statusRef.current !== "speaking") setTranscript(""); // Clear previous turn's text
          setSpeaking(true);
          setStatus("speaking");
          playerRef.current?.enqueueBase64Pcm(pcm);
          // Stop mic to prevent echoing tutor audio back into stream
          if (micActiveRef.current) {
            void stopMic();
          }
        },
        onText: (text) => {
          setTranscript((prev) => prev + text);
        },
        onTurnComplete: () => {
          setSpeaking(false);
          if (autoLiveRef.current) {
            void startMic();
          } else {
            setStatus("live");
          }
        },
        onInterrupted: () => {
          stopPlayer();
          if (autoLiveRef.current) {
            void startMic();
          } else {
            setStatus("live");
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
  }, [configured, startMic, stopMic, stopPlayer]);

  const handleMicPress = useCallback(() => {
    switch (statusRef.current) {
      case "idle":
      case "error":
        autoLiveRef.current = true;
        void connectSession();
        break;
      case "speaking":
        autoLiveRef.current = true;
        stopPlayer();
        sessionRef.current?.sendAudioStreamEnd();
        if (!micActiveRef.current) void startMic();
        break;
      case "listening":
        // Manual override: stop listening and turn off auto-live
        autoLiveRef.current = false;
        void stopMic();
        setStatus("live");
        break;
      case "live":
        autoLiveRef.current = true;
        void startMic();
        break;
      default:
        break;
    }
  }, [connectSession, startMic, stopMic, stopPlayer]);

  const interruptAi = useCallback(() => {
    if (statusRef.current === "speaking") {
      stopPlayer();
      sessionRef.current?.sendAudioStreamEnd();
      setStatus("live");
    }
  }, [stopPlayer]);

  const changeTopic = useCallback((topic: string) => {
    if (sessionRef.current) {
      sessionRef.current.sendClientText(`Let's change the topic. We are now roleplaying: ${topic}. Confirm by greeting me in character in English.`);
    }
  }, []);

  return {
    configured,
    supported,
    phase,
    status,
    sessionActive,
    speaking,
    listening: status === "listening",
    thinking: status === "connecting",
    transcript,
    error,
    handleMicPress,
    interruptAi,
    changeTopic,
    stopAll,
  };
}
