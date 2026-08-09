import {
  OpenAIRealtimeSession,
  OPENAI_REALTIME_SAMPLE_RATE,
} from "../services/openai-realtime-client";
import {
  LivePcmPlayer,
  isLiveAudioSupported,
  startMicPcmStream,
} from "../utils/gemini-live-audio";
import {
  RealConversationTurn,
  SessionWordState,
  createEmptySessionWordState,
} from "../data/voice-tutor-types";
import { WORD_BANKS } from "../data/voice-tutor-word-banks";
import { computeSessionAnalysis } from "../services/voice-tutor-analysis-engine";
import { useSettingsStore } from "../stores/useSettingsStore";
import { mergeStreamingTranscript } from "../utils/streaming-transcript";
import { useCallback, useEffect, useRef, useState } from "react";

export type OpenAILiveTutorStatus =
  | "idle"
  | "starting"
  | "speaking"
  | "listening"
  | "thinking"
  | "error";

export function useOpenAILiveTutor() {
  const supported = isLiveAudioSupported();
  const configured = Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY &&
      supported,
  );

  const sessionRef = useRef<OpenAIRealtimeSession | null>(null);
  const playerRef = useRef<LivePcmPlayer | null>(null);
  const micRef = useRef<{ stop: () => void } | null>(null);
  const micMutedRef = useRef(false);
  const statusRef = useRef<OpenAILiveTutorStatus>("idle");
  const sessionTokenRef = useRef(0);
  const sessionStartTimeRef = useRef(0);
  const activeWordRef = useRef<string | null>(null);
  const aiTextRef = useRef("");
  const transcriptFlushRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<OpenAILiveTutorStatus>("idle");
  const [sessionActive, setSessionActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<RealConversationTurn[]>([]);
  const [sessionWords, setSessionWords] = useState<SessionWordState>(
    createEmptySessionWordState(),
  );
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const recordUserTurn = useCallback((text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const target = activeWordRef.current;
    const wordCorrect = target
      ? new RegExp(`\\b${target}\\b`, "i").test(clean)
      : undefined;

    if (target) {
      setSessionWords((previous) => ({
        ...previous,
        correct: wordCorrect && !previous.correct.includes(target)
          ? [...previous.correct, target]
          : previous.correct,
        needsReview: wordCorrect
          ? previous.needsReview.filter((word) => word !== target)
          : previous.needsReview.includes(target)
            ? previous.needsReview
            : [...previous.needsReview, target],
      }));
    }

    setTurns((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: clean,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        targetWord: target || undefined,
        wordCorrect,
      },
    ]);
  }, []);

  const recordAiTurn = useCallback((text: string) => {
    const clean = text.trim();
    if (!clean) return;

    const level = useSettingsStore.getState().englishLevel || 5;
    const detected =
      (WORD_BANKS[level] || []).find((entry) =>
        new RegExp(`\\b${entry.word}\\b`, "i").test(clean),
      )?.word ?? null;

    if (detected) {
      activeWordRef.current = detected;
      setSessionWords((previous) =>
        previous.introduced.includes(detected)
          ? previous
          : {
              ...previous,
              introduced: [...previous.introduced, detected],
              wordsSinceLastConversation:
                previous.wordsSinceLastConversation + 1,
            },
      );
    }

    setTurns((previous) => [
      ...previous,
      {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: clean,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        targetWord: detected || undefined,
      },
    ]);
  }, []);

  const appendTranscript = useCallback((delta: string) => {
    if (!delta) return;
    const current = aiTextRef.current;
    const merged = mergeStreamingTranscript(current, delta);
    if (merged === current) return;
    aiTextRef.current = merged;

    if (transcriptFlushRef.current) clearTimeout(transcriptFlushRef.current);
    transcriptFlushRef.current = setTimeout(() => {
      transcriptFlushRef.current = null;
      setTranscript(aiTextRef.current);
    }, 60);
  }, []);

  const stopMic = useCallback(() => {
    micRef.current?.stop();
    micRef.current = null;
  }, []);

  const startMic = useCallback(async () => {
    if (micRef.current) {
      micMutedRef.current = false;
      setStatus("listening");
      return;
    }

    try {
      micRef.current = await startMicPcmStream(
        (chunk) => {
          if (!micMutedRef.current) sessionRef.current?.sendPcmChunk(chunk);
        },
        {
          sampleRate: OPENAI_REALTIME_SAMPLE_RATE,
          // Send silence too so OpenAI's server VAD can detect clean turn endings.
          filterSilence: false,
        },
      );
      micMutedRef.current = false;
      setStatus("listening");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Microphone permission is required.",
      );
      setStatus("error");
    }
  }, []);

  const stopPlayer = useCallback(() => {
    void playerRef.current?.stop();
    setSpeaking(false);
  }, []);

  const stopAll = useCallback(() => {
    sessionTokenRef.current += 1;
    if (transcriptFlushRef.current) {
      clearTimeout(transcriptFlushRef.current);
      transcriptFlushRef.current = null;
    }
    stopMic();
    stopPlayer();
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    playerRef.current?.destroy();
    playerRef.current = null;
    micMutedRef.current = false;
    aiTextRef.current = "";
    setTranscript("");
    setSpeaking(false);
    setSessionActive(false);
    setStatus("idle");
  }, [stopMic, stopPlayer]);

  useEffect(() => () => stopAll(), [stopAll]);

  const startSession = useCallback(async () => {
    stopAll();
    // The app's onboarding already captured the learner's current level.
    if (!useSettingsStore.getState().tutorOnboardingComplete) {
      useSettingsStore.getState().setTutorOnboardingComplete(true);
    }
    const token = sessionTokenRef.current + 1;
    sessionTokenRef.current = token;
    const isCurrent = () => sessionTokenRef.current === token;

    setSessionActive(true);
    setStatus("starting");
    setError(null);
    setTranscript("");
    setTurns([]);
    setSessionWords(createEmptySessionWordState());
    sessionStartTimeRef.current = Date.now();
    activeWordRef.current = null;
    aiTextRef.current = "";

    playerRef.current = new LivePcmPlayer((isPlaying) => {
      if (!isCurrent()) return;
      setSpeaking(isPlaying);
      if (isPlaying) {
        micMutedRef.current = true;
        setStatus("speaking");
      } else {
        micMutedRef.current = false;
        setStatus("listening");
      }
    });

    const session = new OpenAIRealtimeSession();
    sessionRef.current = session;

    try {
      await session.connect({
        onReady: () => {
          if (!isCurrent()) return;
          void startMic();
          session.startGreeting();
        },
        onAudio: (pcm) => {
          if (!isCurrent()) return;
          micMutedRef.current = true;
          setStatus("speaking");
          playerRef.current?.enqueueBase64Pcm(pcm);
        },
        onInputTranscription: (text) => {
          if (!isCurrent()) return;
          recordUserTurn(text);
        },
        onOutputTranscription: (text) => {
          if (isCurrent()) appendTranscript(text);
        },
        onSpeechStarted: () => {
          if (!isCurrent() || !playerRef.current?.isPlaying) return;
          stopPlayer();
        },
        onTurnComplete: () => {
          if (!isCurrent()) return;
          void playerRef.current?.finishTurn();
          const completed = aiTextRef.current.trim();
          aiTextRef.current = "";
          if (completed) {
            setTranscript(completed);
            recordAiTurn(completed);
          }
        },
        onError: (message) => {
          if (!isCurrent()) return;
          setError(message);
          setStatus("error");
        },
        onClose: (reason) => {
          if (!isCurrent() || statusRef.current === "idle") return;
          setError(reason || "The live tutor connection ended.");
          setStatus("error");
        },
      });
    } catch (cause) {
      if (!isCurrent()) return;
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not start the live tutor.",
      );
      setStatus("error");
    }
  }, [
    appendTranscript,
    recordAiTurn,
    recordUserTurn,
    startMic,
    stopAll,
    stopPlayer,
  ]);

  const handleMicPress = useCallback(() => {
    if (!sessionActive || statusRef.current === "error") {
      void startSession();
      return;
    }

    if (statusRef.current === "speaking") {
      sessionRef.current?.cancelResponse();
      stopPlayer();
      micMutedRef.current = false;
      setStatus("listening");
      return;
    }

    if (statusRef.current === "listening") {
      micMutedRef.current = true;
      setStatus("idle");
      return;
    }

    micMutedRef.current = false;
    void startMic();
  }, [sessionActive, startMic, startSession, stopPlayer]);

  const interruptAi = useCallback(() => {
    sessionRef.current?.cancelResponse();
    stopPlayer();
    micMutedRef.current = false;
    if (sessionActive) setStatus("listening");
  }, [sessionActive, stopPlayer]);

  const sendText = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      if (!sessionActive) await startSession();
      recordUserTurn(clean);
      sessionRef.current?.sendText(clean);
    },
    [recordUserTurn, sessionActive, startSession],
  );

  const signalReady = useCallback(async () => {
    await sendText("I'm ready");
  }, [sendText]);

  const runAnalysis = useCallback(async () => {
    if (turns.length === 0) return;
    setAnalysisLoading(true);
    try {
      const result = await computeSessionAnalysis(
        turns,
        sessionWords,
        sessionStartTimeRef.current,
      );
      useSettingsStore.getState().setLastAnalysis(result);
    } catch (cause) {
      console.warn("Live tutor analysis failed:", cause);
    } finally {
      setAnalysisLoading(false);
    }
  }, [sessionWords, turns]);

  return {
    configured,
    status,
    sessionActive,
    speaking,
    listening: status === "listening",
    thinking: status === "starting" || status === "thinking",
    transcript,
    error,
    turns,
    sessionWords,
    analysisLoading,
    startSession,
    signalReady,
    handleMicPress,
    interruptAi,
    runAnalysis,
    sendText,
    stopAll,
  };
}
