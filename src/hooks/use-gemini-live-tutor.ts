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
import { mergeStreamingTranscript } from "../utils/streaming-transcript";

export type LiveTutorStatus =
  | "idle"
  | "connecting"
  | "live"
  | "speaking"
  | "listening"
  | "paused"
  | "error";

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
    const current = aiTurnTextRef.current;
    const merged = mergeStreamingTranscript(current, text);
    if (merged === current) return;

    aiTurnTextRef.current = merged;
    if (transcriptFlushRef.current) {
      clearTimeout(transcriptFlushRef.current);
    }
    // Responsive frame-rate debounce for real-time text streaming
    transcriptFlushRef.current = setTimeout(() => {
      transcriptFlushRef.current = null;
      setTranscript(aiTurnTextRef.current);
    }, 16);
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

  const commitUserTurn = useCallback(() => {
    const text = userTurnTextRef.current.trim();
    if (text) {
      recordUserTurn(text);
      userTurnTextRef.current = "";
    }
  }, [recordUserTurn]);

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

  const connectSession = useCallback(async (
    durationMinutes: 5 | 10 | 15 = 5,
  ) => {
    if (!configured) {
      setError(
        "Live Voice Tutor is not available right now. Try Role Play or Reading Practice.",
      );
      setStatus("error");
      return;
    }

    // Onboarding already stores the learner's target-language level. The live
    // tutor consumes that value directly instead of asking for it again.
    if (!useSettingsStore.getState().tutorOnboardingComplete) {
      useSettingsStore.getState().setTutorOnboardingComplete(true);
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
            commitUserTurn();
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
            const merged = next.startsWith(current)
              ? next
              : `${current} ${next}`.trim();
            userTurnTextRef.current = merged;
            setTranscript(merged);
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
            commitUserTurn();

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
            const lower = (reason || "").toLowerCase();
            const isDurationComplete =
              lower.includes("goaway") ||
              lower.includes("session duration") ||
              lower.includes("block has ended") ||
              lower.includes("limit reached") ||
              lower.includes("completed");

            if (isDurationComplete) {
              setSessionActive(false);
              setSpeaking(false);
              setStatus("idle");
              void stopMic();
              return;
            }

            handleConnectionError(
              reason || "Gemini Live connection closed.",
              attempt,
            );
          },
        }, durationMinutes);
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

      const lower = msg.toLowerCase();
      const isDurationComplete =
        lower.includes("goaway") ||
        lower.includes("session duration") ||
        lower.includes("block has ended") ||
        lower.includes("limit reached") ||
        lower.includes("completed");

      if (isDurationComplete) {
        setSessionActive(false);
        setSpeaking(false);
        setStatus("idle");
        void stopMic();
        sessionRef.current?.disconnect();
        return;
      }

      console.warn(`[LiveTutor] Connection attempt ${attempt} failed: ${msg}`);

      // Each purchased block creates one single-use token. A transparent retry
      // would create and charge a second block, so the learner chooses retry.
      setError(msg);
      setSessionActive(false);
      setSpeaking(false);
      setStatus("error");
      void stopMic();
      sessionRef.current?.disconnect();
    };

    await attemptConnect(1);
  }, [
    appendAiText,
    configured,
    flushTranscript,
    recordUserTurn,
    startMic,
    stopMic,
    stopPlayer,
  ]);

  // Intercept typed client input so it appears in the same conversation log.
  const sendClientTextWithTracking = useCallback(
    (text: string) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      recordUserTurn(cleanText);

      // Send chunk to Gemini Live socket
      sessionRef.current?.sendClientText(cleanText);
    },
    [recordUserTurn],
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

  const startSession = useCallback(async (
    durationMinutes: 5 | 10 | 15 = 5,
  ) => {
    autoLiveRef.current = true;
    await connectSession(durationMinutes);
  }, [connectSession]);

  const signalReady = useCallback(async () => {
    sendClientTextWithTracking("I'm ready.");
  }, [sendClientTextWithTracking]);

  // Runs full transcript analysis and saves results to storage
  const runAnalysis = useCallback(async () => {
    let currentTurns = [...turns];
    const pendingUser = userTurnTextRef.current.trim();
    if (pendingUser) {
      const userTurn: RealConversationTurn = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: pendingUser,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        targetWord: activeWordRef.current || undefined,
      };
      currentTurns = [...currentTurns, userTurn];
      setTurns(currentTurns);
      userTurnTextRef.current = "";
    }
    const pendingAi = aiTurnTextRef.current.trim();
    if (pendingAi) {
      const aiTurn: RealConversationTurn = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: pendingAi,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      currentTurns = [...currentTurns, aiTurn];
      setTurns(currentTurns);
      aiTurnTextRef.current = "";
    }

    if (currentTurns.length === 0) return;
    setAnalysisLoading(true);
    try {
      const result = await computeSessionAnalysis(
        currentTurns,
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
