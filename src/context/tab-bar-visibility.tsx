import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type TabBarVisibilityContextValue = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue>({
  hidden: false,
  setHidden: () => {},
});

export function TabBarVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hidden, setHiddenState] = useState(false);
  const setHidden = useCallback((next: boolean) => {
    setHiddenState(next);
  }, []);

  const value = useMemo(
    () => ({
      hidden,
      setHidden,
    }),
    [hidden, setHidden],
  );

  return (
    <TabBarVisibilityContext value={value}>{children}</TabBarVisibilityContext>
  );
}

export function useTabBarVisibility() {
  return useContext(TabBarVisibilityContext);
}
