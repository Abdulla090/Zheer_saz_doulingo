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
  const sessionTokenRef = useRef(0);
  const aiTurnTextRef = useRef("");
  const userTurnTextRef = useRef("");
  const transcriptFlushRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const flushTranscript = useCallback(() => {
    if (transcriptFlushRef.current) {
      clearTimeout(transcriptFlushRef.current);
      transcriptFlushRef.current = null;
    }
    setTranscript(aiTurnTextRef.current);
  }, []);

  const appendAiText = useCallback((text: string) => {
    const next = text.trimStart();
    if (!next) return;

    const current = aiTurnTextRef.current;
    if (next === current || current.endsWith(next)) {
      return;
    }

    aiTurnTextRef.current = next.startsWith(current)
      ? next
      : current + next;
    if (transcriptFlushRef.current) {
      clearTimeout(transcriptFlushRef.current);
    }
    transcriptFlushRef.current = setTimeout(() => {
      transcriptFlushRef.current = null;
      setTranscript(aiTurnTextRef.current);
    }, 80);
  }, []);

  const recordUserTurn = useCallback((text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    if (activeWordRef.current) {
      const target = activeWordRef.current;
      const userSpokeWord = new RegExp(`\\b${target}\\b`, "i").test(cleanText);

      setSessionWords((prev) => {
        if (userSpokeWord) {
          const isAlreadyCorrect = prev.correct.includes(target);
          return {
            ...prev,
            correct: isAlreadyCorrect ? prev.correct : [...prev.correct, target],
            needsReview: prev.needsReview.filter((w) => w !== target),
          };
        }

        const isAlreadyWrong = prev.needsReview.includes(target);
        return {
          ...prev,
          needsReview: isAlreadyWrong ? prev.needsReview : [...prev.needsReview, target],
        };
      });
    }

    setTurns((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        targetWord: activeWordRef.current || undefined,
        wordCorrect: activeWordRef.current
          ? new RegExp(`\\b${activeWordRef.current}\\b`, "i").test(cleanText)
          : undefined,
      },
    ]);
  }, []);

  const stopAll = useCallback(() => {
    sessionTokenRef.current += 1;
    if (transcriptFlushRef.current) {
      clearTimeout(transcriptFlushRef.current);
      transcriptFlushRef.current = null;
    }
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
    aiTurnTextRef.current = "";
    userTurnTextRef.current = "";
    setPhase("intro_ku");
    autoLiveRef.current = false;
    activeWordRef.current = null;
  }, [stopMic, stopPlayer]);

  useEffect(() => () => stopAll(), [stopAll]);

  const connectSession = useCallback(async () => {
    if (!configured) {
      setError("Live Voice Tutor is not available right now. Try Role Play or Reading Practice.");
      setStatus("error");
      return;
    }

    const sessionToken = sessionTokenRef.current + 1;
    sessionTokenRef.current = sessionToken;
    const isCurrentSession = () => sessionTokenRef.current === sessionToken;

    setError(null);
    setStatus("connecting");
    setSessionActive(true);
    setPhase("intro_ku");
    setTurns([]);
    setSessionWords(createEmptySessionWordState());
    sessionStartTimeRef.current = Date.now();
    activeWordRef.current = null;
    aiTurnTextRef.current = "";
    userTurnTextRef.current = "";
    setTranscript("");

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
          if (!isCurrentSession()) return;
          setStatus("live");
          session.startGreeting();
        },
        onAudio: (pcm) => {
          if (!isCurrentSession()) return;
          micMutedRef.current = true;
          playerRef.current?.enqueueBase64Pcm(pcm);
          if (micActiveRef.current) {
            void stopMic();
          }
        },
        onText: () => {
          // Audio-only responses are already captured by output transcription.
        },
        onInputTranscription: (text) => {
          if (!isCurrentSession()) return;
          const next = text.trim();
          if (!next) return;
          const current = userTurnTextRef.current;
          userTurnTextRef.current = next.startsWith(current) ? next : `${current} ${next}`.trim();
        },
        onOutputTranscription: (text) => {
          if (!isCurrentSession()) return;
          appendAiText(text);
        },
        onTurnComplete: () => {
          if (!isCurrentSession()) return;
          flushTranscript();
          const userResponseText = userTurnTextRef.current.trim();
          if (userResponseText) {
            recordUserTurn(userResponseText);
            userTurnTextRef.current = "";
          }

          const aiResponseText = aiTurnTextRef.current.trim();
          aiTurnTextRef.current = "";

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
          if (!isCurrentSession()) return;
          if (transcriptFlushRef.current) {
            clearTimeout(transcriptFlushRef.current);
            transcriptFlushRef.current = null;
          }
          aiTurnTextRef.current = "";
          userTurnTextRef.current = "";
          setTranscript("");
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
          if (!isCurrentSession()) return;
          setError(msg);
          setStatus("error");
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not connect to Live tutor.";
      setError(msg);
      setStatus("error");
    }
  }, [appendAiText, configured, flushTranscript, recordUserTurn, startMic, stopMic, stopPlayer]);

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

    recordUserTurn(cleanText);

    // Send chunk to Gemini Live socket
    sessionRef.current?.sendClientText(cleanText);
  }, [connectSession, recordUserTurn, stopAll]);

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
