import { supabase } from "../lib/supabase";
import { getBillingAccount } from "./billing";

export type CreditTransaction = {
  id: string;
  type: "purchase" | "spend" | "refund" | "adjustment";
  amount: number;
  balanceAfter: number;
  reason: string | null;
  createdAt: string;
};

function validBalance(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

export async function getCreditBalance() {
  const account = await getBillingAccount();
  if (!validBalance(account.wallet.creditBalance)) {
    throw new Error("Invalid credit balance response.");
  }
  return account.wallet.creditBalance;
}

export async function getCreditHistory() {
  const { data, error } = await supabase.functions.invoke("credits", {
    body: { action: "history" },
  });
  if (error) throw error;
  return Array.isArray(data?.transactions)
    ? (data.transactions as CreditTransaction[])
    : [];
}
