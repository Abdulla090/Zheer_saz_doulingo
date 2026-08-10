import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

export function useCreditBalance() {
  const { user, billingAccount, refreshBillingAccount } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setBalance(null);
      return null;
    }

    setLoading(true);
    try {
      const account = await refreshBillingAccount();
      const nextBalance = account?.wallet.creditBalance ?? null;
      setBalance(nextBalance);
      return nextBalance;
    } catch {
      // The wallet stays hidden until its migration and Edge Function are live.
      setBalance(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshBillingAccount, user]);

  useEffect(() => {
    setBalance(billingAccount?.wallet.creditBalance ?? null);
  }, [billingAccount]);

  useEffect(() => {
    if (user && !billingAccount) void refresh();
  }, [billingAccount, refresh, user]);

  return { balance, loading, refresh };
}
