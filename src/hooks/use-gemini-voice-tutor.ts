import { isGeminiConfigured } from "@/constants/gemini";
import { useGeminiVoiceCapture } from "@/hooks/use-gemini-voice-capture";
import { useSpeechCapture } from "@/hooks/use-speech-capture";
import { useTTS } from "@/hooks/use-tts";
import {
  sendTutorTurn,
  type TutorMessage,
  type TutorPhase,
  type TutorTurnResponse,
} from "@/services/gemini-voice-tutor-service";
import { useCallback, useEffect, useRef, useState } from "react";

export type TutorStatus =
  | "idle"
  | "starting"
  | "speaking"
  | "listening"
  | "thinking"
  | "error";

const LISTEN_TIMEOUT_MS = 14_000;

export function useGeminiVoiceTutor() {
  const configured = isGeminiConfigured();
  const { speak, stop: stopTts, speaking } = useTTS();
  const speechEn = useSpeechCapture("en-US");
  const geminiCapture = useGeminiVoiceCapture();

  const [phase, setPhase] = useState<TutorPhase>("intro_ku");
  const [status, setStatus] = useState<TutorStatus>("idle");
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [wordHighlight, setWordHighlight] = useState<string | null>(null);
  const [teachNote, setTeachNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);

  const phaseRef = useRef(phase);
  const statusRef = useRef(status);
  const messagesRef = useRef(messages);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAutoListenRef = useRef(false);
  const usingGeminiMicRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const clearListenTimeout = useCallback(() => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    clearListenTimeout();
    speechEn.stop();
    usingGeminiMicRef.current = false;
    void geminiCapture.abort();
  }, [clearListenTimeout, geminiCapture, speechEn]);

  const stopAll = useCallback(() => {
    stopListening();
    void stopTts();
    pendingAutoListenRef.current = false;
  }, [stopListening, stopTts]);

  useEffect(() => () => stopAll(), [stopAll]);

  const applyTurn = useCallback((turn: TutorTurnResponse, userText?: string) => {
    const userLine = userText?.trim() || turn.userTranscript?.trim();
    if (userLine) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: userLine,
          lang: phaseRef.current === "english" ? "en" : "ku",
        },
      ]);
    }

    const nextPhase = turn.readyDetected ? "english" : turn.phase;
    setPhase(nextPhase);
    setWordHighlight(turn.wordHighlight ?? null);
    setTeachNote(turn.teachNote ?? null);

    setMessages((prev) => [
      ...prev,
      {
        role: "tutor",
        text: turn.reply,
        lang: turn.replyLang,
        teachNote: turn.teachNote,
        wordHighlight: turn.wordHighlight,
      },
    ]);

    return turn;
  }, []);

  const speakReply = useCallback(
    async (turn: TutorTurnResponse) => {
      pendingAutoListenRef.current = true;
      setStatus("speaking");
      await speak(turn.reply, turn.replyLang === "ku" ? "ku" : "en", "tutor");
    },
    [speak],
  );

  const processTurn = useCallback(
    async (input: Parameters<typeof sendTutorTurn>[0]) => {
      setStatus("thinking");
      setError(null);
      try {
        const turn = await sendTutorTurn(input);
        applyTurn(turn, input.userText);
        await speakReply(turn);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not reach the tutor.";
        setError(message);
        setStatus("error");
      }
    },
    [applyTurn, speakReply],
  );

  const finishGeminiAudioTurn = useCallback(async () => {
    if (!usingGeminiMicRef.current) return;
    clearListenTimeout();
    setStatus("thinking");

    const audio = await geminiCapture.stopAndGetAudio();
    usingGeminiMicRef.current = false;

    if (!audio?.base64) {
      setStatus("idle");
      return;
    }

    await processTurn({
      phase: phaseRef.current,
      history: messagesRef.current,
      audioBase64: audio.base64,
      mimeType: audio.mimeType,
    });
  }, [clearListenTimeout, geminiCapture, processTurn]);

  const startGeminiListening = useCallback(async () => {
    if (!geminiCapture.available) return false;

    setStatus("listening");
    usingGeminiMicRef.current = true;

    const started = await geminiCapture.start({
      onResult: () => {},
      onError: (message) => {
        setError(message);
        setStatus("error");
        usingGeminiMicRef.current = false;
      },
    });

    if (!started) {
      usingGeminiMicRef.current = false;
      setStatus("idle");
      return false;
    }

    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (statusRef.current === "listening" && usingGeminiMicRef.current) {
        void finishGeminiAudioTurn();
      }
    }, LISTEN_TIMEOUT_MS);

    return true;
  }, [clearListenTimeout, finishGeminiAudioTurn, geminiCapture]);

  const startSpeechListening = useCallback(async () => {
    setStatus("listening");
    const started = await speechEn.start({
      onResult: (text, isFinal) => {
        if (!isFinal || !text.trim()) return;
        clearListenTimeout();
        speechEn.stop();
        void processTurn({
          phase: phaseRef.current,
          history: messagesRef.current,
          userText: text.trim(),
        });
      },
      onEnd: () => {
        if (statusRef.current === "listening") {
          setStatus("idle");
        }
      },
    });

    if (!started) return false;

    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (statusRef.current === "listening") {
        speechEn.stop();
        setStatus("idle");
      }
    }, LISTEN_TIMEOUT_MS);

    return true;
  }, [clearListenTimeout, processTurn, speechEn]);

  const startListening = useCallback(async () => {
    if (!sessionActive) return;

    stopListening();
    void stopTts();

    const preferSpeech =
      phaseRef.current === "english" && speechEn.available;

    if (preferSpeech) {
      const ok = await startSpeechListening();
      if (ok) return;
    }

    const ok = await startGeminiListening();
    if (!ok) setStatus("idle");
  }, [
    sessionActive,
    speechEn.available,
    startGeminiListening,
    startSpeechListening,
    stopListening,
    stopTts,
  ]);

  useEffect(() => {
    if (!speaking && statusRef.current === "speaking") {
      if (pendingAutoListenRef.current && sessionActive) {
        pendingAutoListenRef.current = false;
        void startListening();
      } else {
        setStatus("idle");
      }
    }
  }, [speaking, sessionActive, startListening]);

  const startSession = useCallback(async () => {
    stopAll();
    setSessionActive(true);
    setPhase("intro_ku");
    setMessages([]);
    setWordHighlight(null);
    setTeachNote(null);
    setError(null);
    setStatus("starting");

    await processTurn({
      phase: "intro_ku",
      history: [],
      sessionStart: true,
    });
  }, [processTurn, stopAll]);

  const signalReady = useCallback(async () => {
    if (statusRef.current === "thinking" || statusRef.current === "speaking") {
      return;
    }
    stopListening();
    await processTurn({
      phase: phaseRef.current,
      history: messagesRef.current,
      userReadySignal: true,
      userText: "I'm ready",
    });
  }, [processTurn, stopListening]);

  const handleMicPress = useCallback(() => {
    switch (statusRef.current) {
      case "idle":
      case "error":
        if (!sessionActive) {
          void startSession();
        } else {
          void startListening();
        }
        break;
      case "speaking":
        void stopTts();
        pendingAutoListenRef.current = false;
        void startListening();
        break;
      case "listening":
        if (usingGeminiMicRef.current) {
          void finishGeminiAudioTurn();
        } else {
          stopListening();
          setStatus("idle");
        }
        break;
      case "thinking":
        setStatus("idle");
        break;
      default:
        break;
    }
  }, [
    finishGeminiAudioTurn,
    sessionActive,
    startListening,
    startSession,
    stopListening,
    stopTts,
  ]);

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      stopListening();
      if (!sessionActive) {
        setSessionActive(true);
      }
      await processTurn({
        phase: phaseRef.current,
        history: messagesRef.current,
        userText: trimmed,
      });
    },
    [processTurn, sessionActive, stopListening],
  );

  return {
    configured,
    phase,
    status,
    messages,
    wordHighlight,
    teachNote,
    error,
    sessionActive,
    speaking,
    listening:
      status === "listening" || speechEn.listening || geminiCapture.listening,
    thinking: status === "thinking" || geminiCapture.processing,
    startSession,
    signalReady,
    handleMicPress,
    sendText,
    stopAll,
  };
}
