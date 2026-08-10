import { supabase } from "../lib/supabase";
import type {
  AccountEntitlements,
  AiFeatureKey,
  FeatureKey,
  PlanId,
} from "../types/entitlements";
import { AI_CREDIT_COSTS, PLAN_FEATURES } from "../types/entitlements";

export type BillingPlan = PlanId;
export type BillingSubscriptionStatus = "active" | "expired" | "cancelled";

export type BillingAccount = {
  wallet: {
    creditBalance: number;
    updatedAt: string | null;
  };
  subscription: {
    plan: BillingPlan;
    status: BillingSubscriptionStatus;
    startsAt: string | null;
    expiresAt: string | null;
    provider: "wayl" | "rasedi" | null;
    updatedAt: string | null;
  };
  entitlements: AccountEntitlements;
};

export type BillingProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  productType: "credits" | "subscription";
  amount: number;
  currency: string;
  credits: number | null;
  includedCredits: number;
  plan: Exclude<PlanId, "free"> | null;
  subscriptionDays: number | null;
  purchasable: boolean;
};

function safeInteger(value: unknown, minimum = 0): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= minimum
  );
}

export async function getBillingAccount(): Promise<BillingAccount> {
  const { data, error } = await supabase.functions.invoke("billing-account", {
    body: {},
  });
  if (error) throw error;

  const balance = data?.wallet?.creditBalance;
  const plan = data?.subscription?.plan;
  const status = data?.subscription?.status;
  const rawEntitlements = data?.entitlements;
  if (
    !safeInteger(balance) ||
    !["free", "plus", "pro", "max"].includes(plan) ||
    !["active", "expired", "cancelled"].includes(status) ||
    !rawEntitlements ||
    !safeInteger(rawEntitlements.creditBalance)
  ) {
    throw new Error("Invalid billing account response.");
  }

  return data as BillingAccount;
}

export async function getBillingCatalog() {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: { action: "catalog" },
  });
  if (error) throw error;

  const products = Array.isArray(data?.products)
    ? data.products.filter(
        (product: BillingProduct) =>
          typeof product?.id === "string" &&
          typeof product?.name === "string" &&
          ["credits", "subscription"].includes(product?.productType) &&
          safeInteger(product?.amount, 1) &&
          safeInteger(product?.includedCredits),
      )
    : [];

  return {
    provider:
      data?.provider === "wayl" || data?.provider === "rasedi"
        ? data.provider
        : null,
    providerReady: data?.providerReady === true,
    products: products as BillingProduct[],
  };
}

export function fallbackEntitlements(
  plan: PlanId = "free",
  balance = 0,
  expiresAt: string | null = null,
): AccountEntitlements {
  return {
    currentPlan: plan,
    expiresAt,
    features: { ...PLAN_FEATURES[plan] } as Record<FeatureKey, boolean>,
    creditBalance: balance,
    aiPrices: { ...AI_CREDIT_COSTS } as Record<AiFeatureKey, number>,
  };
}

export async function createBillingCheckout(productId: string) {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: { action: "create", productId },
  });
  if (error) throw error;
  if (
    typeof data?.paymentId !== "string" ||
    typeof data?.checkoutUrl !== "string"
  ) {
    throw new Error("Invalid checkout response.");
  }
  return {
    paymentId: data.paymentId as string,
    checkoutUrl: data.checkoutUrl as string,
    provider:
      data.provider === "rasedi" ? ("rasedi" as const) : ("wayl" as const),
  };
}

export async function getBillingPaymentStatus(paymentId: string) {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: { action: "status", paymentId },
  });
  if (error) throw error;
  return data?.payment as
    | {
        id: string;
        status: string;
        provider: "wayl" | "rasedi";
        productType: "credits" | "subscription";
        verificationPending?: boolean;
      }
    | undefined;
}
