import { useRouter, type Href } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { replaceWithFallback } from "../utils/safe-navigation";

const BACK_LOCK_MS = 750;

/**
 * Prevents duplicate exits and returns to a known route without popping or
 * dismissing a parent tab navigator. This is intentionally deterministic for
 * screens that can be opened from tabs, deep links, redirects, or restored state.
 */
export function useSafeBack(fallback: Href) {
  const router = useRouter();
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    },
    [],
  );

  return useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    replaceWithFallback(router, fallback);

    unlockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
      unlockTimerRef.current = null;
    }, BACK_LOCK_MS);
  }, [fallback, router]);
}
