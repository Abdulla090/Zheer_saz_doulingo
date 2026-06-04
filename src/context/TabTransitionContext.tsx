import { getTabVisualIndex } from "@/constants/tab-order";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

type TabTransitionContextValue = {
  /** -1 = moving left in tab bar, 1 = moving right, 0 = none */
  consumeDirection: () => number;
  prepareTransition: (fromRoute: string, toRoute: string) => void;
};

const TabTransitionContext = createContext<TabTransitionContextValue | null>(
  null,
);

export function TabTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pendingDirection = useRef(0);

  const prepareTransition = useCallback((fromRoute: string, toRoute: string) => {
    const from = getTabVisualIndex(fromRoute);
    const to = getTabVisualIndex(toRoute);
    if (from === to) {
      pendingDirection.current = 0;
      return;
    }
    pendingDirection.current = to > from ? 1 : -1;
  }, []);

  const consumeDirection = useCallback(() => {
    const dir = pendingDirection.current;
    pendingDirection.current = 0;
    return dir;
  }, []);

  const value = useMemo(
    () => ({ prepareTransition, consumeDirection }),
    [consumeDirection, prepareTransition],
  );

  return (
    <TabTransitionContext.Provider value={value}>
      {children}
    </TabTransitionContext.Provider>
  );
}

export function useTabTransition() {
  const ctx = useContext(TabTransitionContext);
  if (!ctx) {
    return {
      prepareTransition: () => {},
      consumeDirection: () => 0,
    };
  }
  return ctx;
}
