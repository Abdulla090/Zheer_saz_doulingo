import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getCreditBalance } from "../services/credit-wallet";

export function useCreditBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setBalance(null);
      return null;
    }

    setLoading(true);
    try {
      const nextBalance = await getCreditBalance();
      setBalance(nextBalance);
      return nextBalance;
    } catch {
      // The wallet stays hidden until its migration and Edge Function are live.
      setBalance(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { balance, loading, refresh };
}
