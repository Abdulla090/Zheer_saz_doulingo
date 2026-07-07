import { getTabVisualIndex } from "../constants/tab-order";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

type TabTransitionContextValue = {
  /** -1 = new page enters from left, 1 = new page enters from right, 0 = none */
  consumeDirection: () => number;
  prepareTransition: (fromRoute: string, toRoute: string, isRtl?: boolean) => void;
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

  const prepareTransition = useCallback((fromRoute: string, toRoute: string, isRtl = false) => {
    const from = getTabVisualIndex(fromRoute);
    const to = getTabVisualIndex(toRoute);
    if (from === to) {
      pendingDirection.current = 0;
      return;
    }
    const ltrDirection = to > from ? 1 : -1;
    pendingDirection.current = isRtl ? -ltrDirection : ltrDirection;
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
