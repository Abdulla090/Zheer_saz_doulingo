import {
  GEMINI_LIVE_INPUT_RATE,
  isGeminiLiveConfigured,
} from "../constants/gemini";
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
  | "paused"
  | "error";

function parseLevelFromTranscript(text: string): number | null {
  const clean = text.toLowerCase();
  const wordMap: Record<string, number> = {
    one: 1,
    first: 1,
    "١": 1,
    sê: 3,
    sē: 3,
    yazda: 10,
    two: 2,
    second: 2,
    "٢": 2,
    three: 3,
    third: 3,
    "٣": 3,
    four: 4,
    fourth: 4,
    "٤": 4,
    five: 5,
    fifth: 5,
    "٥": 5,
    six: 6,
    sixth: 6,
    "٦": 6,
    seven: 7,
    seventh: 7,
    "٧": 7,
    eight: 8,
    eighth: 8,
    "٨": 8,
    nine: 9,
    ninth: 9,
    "٩": 9,
    ten: 10,
    tenth: 10,
    "١٠": 10,
    beginner: 1,
    elementary: 3,
    intermediate: 5,
    advanced: 9,
    fluent: 10,
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
  const configured = isGeminiLiveConfigured();
  const supported = isLiveAudioSupported();

  const sessionRef = useRef<GeminiLiveSession | null>(null);
  const playerRef = useRef<LivePcmPlayer | null>(null);
  const micRef = useRef<{ stop: () => void } | null>(null);
  const micActiveRef = useRef(false);
  const micStartPromiseRef = useRef<Promise<void> | null>(null);
  const micGenerationRef = useRef(0);
  const autoLiveRef = useRef(false);
  const micMutedRef = useRef(false);
  const temporarilyPausedRef = useRef(false);
  const ignoreCurrentAiAudioRef = useRef(false);
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
  const [sessionWords, setSessionWords] = useState<SessionWordState>(
    createEmptySessionWordState(),
  );
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const sessionStartTimeRef = useRef<number>(0);
  const activeWordRef = useRef<string | null>(null);

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stopMic = useCallback(async () => {
    micGenerationRef.current += 1;
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
    micMutedRef.current = false;
    if (micActiveRef.current) {
      setStatus("listening");
      return;
    }
    if (micStartPromiseRef.current) {
      await micStartPromiseRef.current;
      return;
    }

    const generation = micGenerationRef.current;
    const startPromise = (async () => {
      try {
        const handle = await startMicPcmStream(
          (chunk: string) => {
            if (!micMutedRef.current) {
              sessionRef.current?.sendPcmChunk(chunk);
            }
          },
          {
            sampleRate: GEMINI_LIVE_INPUT_RATE,
            filterSilence: false,
          },
        );

        if (
          generation !== micGenerationRef.current ||
          micMutedRef.current ||
          temporarilyPausedRef.current
        ) {
          handle.stop();
          return;
        }

        micRef.current = handle;
        micActiveRef.current = true;
        setStatus("listening");
      } catch (err) {
        if (generation !== micGenerationRef.current) return;
        setError(
          err instanceof Error
            ? err.message
            : "Microphone permission is required to speak with the tutor.",
        );
        console.warn("Mic Stream failed:", err);
        setStatus("error");
      }
    })();

    micStartPromiseRef.current = startPromise;
    try {
      await startPromise;
    } finally {
      if (micStartPromiseRef.current === startPromise) {
        micStartPromiseRef.current = null;
      }
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

    aiTurnTextRef.current = next.startsWith(current) ? next : current + next;
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
            correct: isAlreadyCorrect
              ? prev.correct
              : [...prev.correct, target],
            needsReview: prev.needsReview.filter((w) => w !== target),
          };
        }

        const isAlreadyWrong = prev.needsReview.includes(target);
        return {
          ...prev,
          needsReview: isAlreadyWrong
            ? prev.needsReview
            : [...prev.needsReview, target],
        };
      });
    }

    setTurns((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        targetWord: activeWordRef.current || undefined,
        wordCorrect: activeWordRef.current
          ? new RegExp(`\\b${activeWordRef.current}\\b`, "i").test(cleanText)
          : undefined,
      },
    ]);
  }, []);

  const stopAll = useCallback(() => {
    sessionTokenRef.current += 1;
    autoLiveRef.current = false;
    temporarilyPausedRef.current = false;
    ignoreCurrentAiAudioRef.current = false;
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
    activeWordRef.current = null;
  }, [stopMic, stopPlayer]);

  useEffect(() => () => stopAll(), [stopAll]);

  const connectSession = useCallback(async () => {
    if (!configured) {
      setError(
        "Live Voice Tutor is not available right now. Try Role Play or Reading Practice.",
      );
      setStatus("error");
      return;
    }

    const sessionToken = sessionTokenRef.current + 1;
    sessionTokenRef.current = sessionToken;
    const isCurrentSession = () => sessionTokenRef.current === sessionToken;

    const attemptConnect = async (attempt: number): Promise<void> => {
      if (!isCurrentSession()) return;

      setError(null);
      setStatus("connecting");
      setSessionActive(true);
      if (attempt === 1) {
        setPhase("intro_ku");
        setTurns([]);
        setSessionWords(createEmptySessionWordState());
        sessionStartTimeRef.current = Date.now();
        activeWordRef.current = null;
        setTranscript("");
      }
      aiTurnTextRef.current = "";
      userTurnTextRef.current = "";

      playerRef.current?.destroy();
      playerRef.current = new LivePcmPlayer(
        (isPlaying) => {
          if (!isCurrentSession()) return;
          if (temporarilyPausedRef.current) return;
          setSpeaking(isPlaying);
          if (isPlaying) {
            micMutedRef.current = true;
            setStatus("speaking");
          } else {
            if (autoLiveRef.current) {
              micMutedRef.current = false;
              if (micActiveRef.current) {
                setStatus("listening");
              } else {
                void startMic();
              }
            } else {
              setStatus("live");
            }
          }
        },
        (message) => {
          if (!isCurrentSession()) return;
          handleConnectionError(message, attempt);
        },
      );
      void playerRef.current.prepare().catch((cause) => {
        if (!isCurrentSession()) return;
        const message =
          cause instanceof Error
            ? cause.message
            : "Live tutor audio could not start.";
        handleConnectionError(message, attempt);
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
            if (ignoreCurrentAiAudioRef.current) return;
            if (!temporarilyPausedRef.current) {
              micMutedRef.current = true;
              if (micActiveRef.current) {
                sessionRef.current?.sendAudioStreamEnd();
                void stopMic();
              }
            }
            playerRef.current?.enqueueBase64Pcm(pcm);
          },
          onText: () => {
            // Audio-only responses are already captured by output transcription.
          },
          onInputTranscription: (text) => {
            if (!isCurrentSession()) return;
            const next = text.trim();
            if (!next) return;
            const current = userTurnTextRef.current;
            userTurnTextRef.current = next.startsWith(current)
              ? next
              : `${current} ${next}`.trim();
          },
          onOutputTranscription: (text) => {
            if (!isCurrentSession()) return;
            appendAiText(text);
          },
          onTurnComplete: () => {
            if (!isCurrentSession()) return;
            const ignoredTurn = ignoreCurrentAiAudioRef.current;
            ignoreCurrentAiAudioRef.current = false;
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
              if (new RegExp(`\\b${entry.word}\\b`, "i").test(aiResponseText)) {
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
                  wordsSinceLastConversation:
                    prev.wordsSinceLastConversation + 1,
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
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  targetWord: detectedWord || undefined,
                },
              ]);
            }

            // Audio generation finishing is not the same as playback finishing.
            // Keep the microphone muted until every queued PCM chunk has drained.
            const player = playerRef.current;
            if (!player) {
              if (!temporarilyPausedRef.current && autoLiveRef.current) {
                void startMic();
              }
              return;
            }
            void player.finishTurn().then(() => {
              if (
                !isCurrentSession() ||
                temporarilyPausedRef.current ||
                player.isPlaying
              ) {
                return;
              }
              setSpeaking(false);
              if (autoLiveRef.current || ignoredTurn) {
                void startMic();
              } else {
                setStatus("live");
              }
            });
          },
          onInterrupted: () => {
            if (!isCurrentSession()) return;
            ignoreCurrentAiAudioRef.current = false;
            if (transcriptFlushRef.current) {
              clearTimeout(transcriptFlushRef.current);
              transcriptFlushRef.current = null;
            }
            aiTurnTextRef.current = "";
            setTranscript("");
            stopPlayer();
            if (
              !temporarilyPausedRef.current &&
              !playerRef.current?.isPlaying
            ) {
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
            handleConnectionError(msg, attempt);
          },
          onClose: (reason) => {
            if (!isCurrentSession()) return;
            handleConnectionError(
              reason || "Gemini Live connection closed.",
              attempt,
            );
          },
        });
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Could not connect to Live tutor.";
        handleConnectionError(msg, attempt);
      }
    };

    const handleConnectionError = (msg: string, attempt: number) => {
      if (!isCurrentSession()) return;

      console.warn(`[LiveTutor] Connection attempt ${attempt} failed: ${msg}`);

      // Determine if error is transient and we should retry
      const isTransient = !/sign in|auth|unauthorized|limit|quota|config/i.test(
        msg,
      );

      if (isTransient && attempt < 2) {
        console.log("[LiveTutor] Retrying connection in 1.5 seconds...");
        setStatus("connecting");
        void stopMic();
        sessionRef.current?.disconnect();
        setTimeout(() => {
          void attemptConnect(attempt + 1);
        }, 1500);
      } else {
        setError(msg);
        setSessionActive(false);
        setSpeaking(false);
        setStatus("error");
        void stopMic();
        sessionRef.current?.disconnect();
      }
    };

    void attemptConnect(1);
  }, [
    appendAiText,
    configured,
    flushTranscript,
    recordUserTurn,
    startMic,
    stopMic,
    stopPlayer,
  ]);

  // Intercept client inputs to track speech and parse onboarding
  const sendClientTextWithTracking = useCallback(
    (text: string) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      const onboardingComplete =
        useSettingsStore.getState().tutorOnboardingComplete;

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
    },
    [connectSession, recordUserTurn, stopAll],
  );

  const interruptAi = useCallback(() => {
    const playerHasAudio = playerRef.current?.isPlaying ?? false;
    if (statusRef.current !== "speaking" && !playerHasAudio) return;

    // Stop locally at once, then discard any late chunks from this model turn.
    // The first user audio sent through automatic VAD interrupts generation.
    ignoreCurrentAiAudioRef.current = true;
    autoLiveRef.current = true;
    stopPlayer();
    micMutedRef.current = false;
    setStatus("listening");
    void startMic();
  }, [startMic, stopPlayer]);

  const pauseInteraction = useCallback(() => {
    if (
      temporarilyPausedRef.current ||
      statusRef.current === "idle" ||
      statusRef.current === "error"
    ) {
      return;
    }

    temporarilyPausedRef.current = true;
    playerRef.current?.pause();
    if (micActiveRef.current || micStartPromiseRef.current) {
      sessionRef.current?.sendAudioStreamEnd();
      void stopMic();
    }
    setSpeaking(false);
    setStatus("paused");
  }, [stopMic]);

  const resumeInteraction = useCallback(() => {
    if (!temporarilyPausedRef.current) return;
    temporarilyPausedRef.current = false;

    const player = playerRef.current;
    if (player?.isPlaying) {
      player.resume();
      setSpeaking(true);
      setStatus("speaking");
      return;
    }

    if (autoLiveRef.current) {
      void startMic();
    } else {
      setStatus("live");
    }
  }, [startMic]);

  // A tap starts/listens or immediately barges into the current AI response.
  const handleMicPress = useCallback(() => {
    if (playerRef.current?.isPlaying) {
      interruptAi();
      return;
    }
    switch (statusRef.current) {
      case "idle":
      case "error":
        autoLiveRef.current = true;
        void connectSession();
        break;
      case "speaking":
        interruptAi();
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
  }, [connectSession, interruptAi, startMic, stopMic]);

  const startSession = useCallback(async () => {
    autoLiveRef.current = true;
    await connectSession();
  }, [connectSession]);

  const signalReady = useCallback(async () => {
    sendClientTextWithTracking("I'm ready.");
  }, [sendClientTextWithTracking]);

  // Runs full transcript analysis and saves results to storage
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
    paused: status === "paused",
    thinking: status === "connecting",
    transcript,
    error,
    turns,
    analysisLoading,
    sessionWords,
    messages: [],
    wordHighlight: null,
    teachNote: null,
    startSession,
    handleMicPress,
    signalReady,
    interruptAi,
    pauseInteraction,
    resumeInteraction,
    runAnalysis,
    sendText: sendClientTextWithTracking,
    sendClientText: sendClientTextWithTracking,
    stopAll,
  };
}
