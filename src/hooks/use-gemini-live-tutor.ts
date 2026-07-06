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
import { useSettingsStore } from "../stores/useSettingsStore";
import {
  RealConversationTurn,
  SessionWordState,
  createEmptySessionWordState,
} from "../data/voice-tutor-types";
import { WORD_BANKS } from "../data/voice-tutor-word-banks";
import { computeSessionAnalysis } from "../services/voice-tutor-analysis-engine";

export type LiveTutorStatus =
  | "idle"
  | "connecting"
  | "live"
  | "speaking"
  | "listening"
  | "error";

function parseLevelFromTranscript(text: string): number | null {
  const clean = text.toLowerCase();
  const wordMap: Record<string, number> = {
    one: 1, first: 1, "١": 1, "sê": 3, "sē": 3, "yazda": 10,
    two: 2, second: 2, "٢": 2,
    three: 3, third: 3, "٣": 3,
    four: 4, fourth: 4, "٤": 4,
    five: 5, fifth: 5, "٥": 5,
    six: 6, sixth: 6, "٦": 6,
    seven: 7, seventh: 7, "٧": 7,
    eight: 8, eighth: 8, "٨": 8,
    nine: 9, ninth: 9, "٩": 9,
    ten: 10, tenth: 10, "١٠": 10,
    beginner: 1, elementary: 3, intermediate: 5, advanced: 9, fluent: 10
  };

  const matchNum = clean.match(/\b(10|[1-9])\b/);
  if (matchNum) return parseInt(matchNum[1], 10);

  for (const [word, val] of Object.entries(wordMap)) {
    if (clean.includes(word)) {
      return val;
    }
  }

  return null;
}

export function useGeminiLiveTutor() {
  const configured = isGeminiConfigured();
  const supported = isLiveAudioSupported();

  const sessionRef = useRef<GeminiLiveSession | null>(null);
  const playerRef = useRef<LivePcmPlayer | null>(null);
  const micRef = useRef<{ stop: () => void } | null>(null);
  const micActiveRef = useRef(false);
  const autoLiveRef = useRef(false);
  const micMutedRef = useRef(false);

  const [phase, setPhase] = useState<LiveSessionPhase>("intro_ku");
  const [status, setStatus] = useState<LiveTutorStatus>("idle");
  const [sessionActive, setSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");

  // ─── Real state tracking ───
  const [turns, setTurns] = useState<RealConversationTurn[]>([]);
  const [sessionWords, setSessionWords] = useState<SessionWordState>(createEmptySessionWordState());
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const sessionStartTimeRef = useRef<number>(0);
  const activeWordRef = useRef<string | null>(null);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stopMic = useCallback(async () => {
    micMutedRef.current = true;
    micActiveRef.current = false;
    if (micRef.current) {
      try {
        micRef.current.stop();
      } catch (e) {
        console.warn("Error stopping mic stream:", e);
      }
      micRef.current = null;
    }
  }, []);

  const startMic = useCallback(async () => {
    if (micActiveRef.current) return;
    micMutedRef.current = false;

    try {
      micRef.current = await startMicPcmStream((chunk: string) => {
        if (!micMutedRef.current) {
          sessionRef.current?.sendPcmChunk(chunk);
        }
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
    activeWordRef.current = null;
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
    setTurns([]);
    setSessionWords(createEmptySessionWordState());
    sessionStartTimeRef.current = Date.now();
    activeWordRef.current = null;

    playerRef.current?.destroy();
    playerRef.current = new LivePcmPlayer((isPlaying) => {
      setSpeaking(isPlaying);
      if (isPlaying) {
        setStatus("speaking");
      } else {
        if (autoLiveRef.current) {
          void startMic();
        } else {
          setStatus("live");
        }
      }
    });

    const session = new GeminiLiveSession();
    sessionRef.current = session;

    try {
      await session.connect({
        onSetupComplete: () => {
          setStatus("live");
          session.startGreeting();
        },
        onAudio: (pcm) => {
          micMutedRef.current = true;
          if (statusRef.current !== "speaking" && statusRef.current !== "listening") {
            setTranscript("");
          }
          playerRef.current?.enqueueBase64Pcm(pcm);
          if (micActiveRef.current) {
            void stopMic();
          }
        },
        onText: (text) => {
          setTranscript((prev) => prev + text);
        },
        onTurnComplete: () => {
          const aiResponseText = transcript.trim();

          // 1. Process AI response text for word introductions
          const currentLevel = useSettingsStore.getState().englishLevel || 5;
          const levelWordBank = WORD_BANKS[currentLevel] || [];
          let detectedWord: string | null = null;

          for (const entry of levelWordBank) {
            if (new RegExp(`\\b${entry.word}\\b`, 'i').test(aiResponseText)) {
              detectedWord = entry.word;
              break;
            }
          }

          if (detectedWord) {
            activeWordRef.current = detectedWord;
            setSessionWords((prev) => {
              if (prev.introduced.includes(detectedWord!)) return prev;
              return {
                ...prev,
                introduced: [...prev.introduced, detectedWord!],
                wordsSinceLastConversation: prev.wordsSinceLastConversation + 1,
              };
            });
          }

          // 2. Add AI turn to history log
          if (aiResponseText.length > 0) {
            setTurns((prev) => [
              ...prev,
              {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: aiResponseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                targetWord: detectedWord || undefined,
              },
            ]);
          }

          // 3. Fallback: if player isn't playing and has no pending chunks, recover state
          if (!playerRef.current?.isPlaying) {
            setSpeaking(false);
            if (autoLiveRef.current) {
              void startMic();
            } else {
              setStatus("live");
            }
          }
        },
        onInterrupted: () => {
          stopPlayer();
          if (!playerRef.current?.isPlaying) {
            setSpeaking(false);
            if (autoLiveRef.current) {
              void startMic();
            } else {
              setStatus("live");
            }
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

  // Intercept client inputs to track speech and parse onboarding
  const sendClientTextWithTracking = useCallback((text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const onboardingComplete = useSettingsStore.getState().tutorOnboardingComplete;

    // 1. Onboarding parsing
    if (!onboardingComplete) {
      const detectedLevel = parseLevelFromTranscript(cleanText);
      if (detectedLevel) {
        useSettingsStore.getState().setEnglishLevel(detectedLevel);
        useSettingsStore.getState().setTutorOnboardingComplete(true);
        // Reconnect session to launch the Level-specific curriculum prompt
        stopAll();
        setTimeout(() => {
          void connectSession();
        }, 300);
        return;
      }
    }

    // 2. Word mastery evaluation tracking
    if (activeWordRef.current) {
      const target = activeWordRef.current;
      const userSpokeWord = new RegExp(`\\b${target}\\b`, 'i').test(cleanText);
      
      setSessionWords((prev) => {
        if (userSpokeWord) {
          const isAlreadyCorrect = prev.correct.includes(target);
          return {
            ...prev,
            correct: isAlreadyCorrect ? prev.correct : [...prev.correct, target],
            needsReview: prev.needsReview.filter((w) => w !== target),
          };
        } else {
          const isAlreadyWrong = prev.needsReview.includes(target);
          return {
            ...prev,
            needsReview: isAlreadyWrong ? prev.needsReview : [...prev.needsReview, target],
          };
        }
      });
    }

    // 3. Add User turn to history
    setTurns((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        targetWord: activeWordRef.current || undefined,
        wordCorrect: activeWordRef.current ? new RegExp(`\\b${activeWordRef.current}\\b`, 'i').test(cleanText) : undefined,
      },
    ]);

    // Send chunk to Gemini Live socket
    sessionRef.current?.sendClientText(cleanText);
  }, [connectSession, stopAll]);

  // Intercept microphone press to use text tracking when sending transcripts
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

  // Runs full transcript analysis and saves results to storage
  const runAnalysis = useCallback(async () => {
    if (turns.length === 0) return;
    setAnalysisLoading(true);
    try {
      const result = await computeSessionAnalysis(turns, sessionWords, sessionStartTimeRef.current);
      useSettingsStore.getState().setLastAnalysis(result);
    } catch (err) {
      console.warn("Analysis run error:", err);
    } finally {
      setAnalysisLoading(false);
    }
  }, [turns, sessionWords]);

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
    turns,
    analysisLoading,
    sessionWords,
    handleMicPress,
    interruptAi,
    runAnalysis,
    sendClientText: sendClientTextWithTracking,
    stopAll,
  };
}
