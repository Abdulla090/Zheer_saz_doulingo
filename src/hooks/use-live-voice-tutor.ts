import { useCallback, useEffect, useRef, useState } from "react";
import { useGeminiLiveTutor } from "./use-gemini-live-tutor";
import { useOpenAILiveTutor } from "./use-openai-live-tutor";

type Provider = "openai" | "gemini";

const OPENAI_REALTIME_ENABLED =
  process.env.EXPO_PUBLIC_OPENAI_REALTIME_ENABLED === "true";

export function useLiveVoiceTutor() {
  const openai = useOpenAILiveTutor();
  const gemini = useGeminiLiveTutor();
  const [requestedProvider, setRequestedProvider] = useState<Provider>(
    OPENAI_REALTIME_ENABLED ? "openai" : "gemini",
  );
  // Fast Refresh preserves hook state. Always force Gemini while OpenAI is
  // disabled so a previously cached "openai" state cannot strand the tutor.
  const provider: Provider = OPENAI_REALTIME_ENABLED
    ? requestedProvider
    : "gemini";
  const fallbackStartedRef = useRef(false);

  useEffect(() => {
    if (
      provider !== "openai" ||
      !OPENAI_REALTIME_ENABLED ||
      !openai.sessionActive ||
      openai.status !== "error" ||
      fallbackStartedRef.current
    ) {
      return;
    }

    fallbackStartedRef.current = true;
    openai.stopAll();
    setRequestedProvider("gemini");
    void gemini.startSession();
  }, [gemini, openai, provider]);

  const startSession = useCallback(async () => {
    if (provider === "gemini") {
      await gemini.startSession();
      return;
    }
    fallbackStartedRef.current = false;
    await openai.startSession();
  }, [gemini, openai, provider]);

  const handleMicPress = useCallback(() => {
    if (provider === "gemini") {
      gemini.handleMicPress();
    } else {
      openai.handleMicPress();
    }
  }, [gemini, openai, provider]);

  const stopAll = useCallback(() => {
    openai.stopAll();
    gemini.stopAll();
  }, [gemini, openai]);

  const active = provider === "openai" ? openai : gemini;

  return {
    ...active,
    provider,
    configured: openai.configured || gemini.configured,
    phase: provider === "gemini" ? gemini.phase : "english" as const,
    messages: provider === "gemini" ? gemini.messages : [],
    wordHighlight:
      provider === "gemini" ? gemini.wordHighlight : null,
    teachNote: provider === "gemini" ? gemini.teachNote : null,
    startSession,
    handleMicPress,
    signalReady:
      provider === "gemini" ? gemini.signalReady : openai.signalReady,
    interruptAi:
      provider === "gemini" ? gemini.interruptAi : openai.interruptAi,
    runAnalysis:
      provider === "gemini" ? gemini.runAnalysis : openai.runAnalysis,
    sendText: provider === "gemini" ? gemini.sendText : openai.sendText,
    stopAll,
  };
}
