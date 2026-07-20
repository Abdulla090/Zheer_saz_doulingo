import { supabase } from "../lib/supabase";

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
  const { data, error } = await supabase.functions.invoke("credits", {
    body: { action: "balance" },
  });
  if (error) throw error;
  if (!validBalance(data?.balance)) {
    throw new Error("Invalid credit balance response.");
  }
  return data.balance;
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

export async function spendCredits(input: {
  amount: number;
  reason: string;
  idempotencyKey: string;
}) {
  const { data, error } = await supabase.functions.invoke("credits", {
    body: {
      action: "spend",
      amount: input.amount,
      reason: input.reason,
      idempotencyKey: input.idempotencyKey,
    },
  });
  if (error) throw error;
  if (!validBalance(data?.balance)) {
    throw new Error("Invalid credit spend response.");
  }
  return {
    balance: data.balance,
    transactionId:
      typeof data.transactionId === "string" ? data.transactionId : null,
    duplicate: data.duplicate === true,
  };
}
