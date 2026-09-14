import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { supabase } from "../../lib/supabase";
import { fallbackEntitlements, getBillingAccount, getBillingCatalog } from "../billing";

jest.mock("../../lib/supabase", () => ({
  supabase: { auth: { getSession: jest.fn() }, functions: { invoke: jest.fn() } },
}));
const session = jest.mocked(supabase.auth.getSession);
const invoke = jest.mocked(supabase.functions.invoke);
const account = () => ({
  wallet: { creditBalance: 250, updatedAt: null },
  subscription: { plan: "free", status: "active", startsAt: null, expiresAt: null, provider: null, updatedAt: null },
  entitlements: fallbackEntitlements("free", 250),
});

beforeEach(() => {
  jest.resetAllMocks();
  session.mockResolvedValue({ data: { session: { access_token: "test" } }, error: null } as never);
});

describe("billing failure and trust boundaries", () => {
  it("returns a guest account only for a confirmed signed-out session", async () => {
    session.mockResolvedValue({ data: { session: null }, error: null });
    expect((await getBillingAccount()).wallet.creditBalance).toBe(0);
    expect(invoke).not.toHaveBeenCalled();
  });
  it("does not turn a session-storage error into a free account", async () => {
    session.mockRejectedValue(new Error("Storage unavailable"));
    await expect(getBillingAccount()).rejects.toThrow("Storage unavailable");
  });
  it("does not turn a server outage into a zero balance", async () => {
    invoke.mockResolvedValue({ data: null, error: new Error("Offline") });
    await expect(getBillingAccount()).rejects.toThrow("Offline");
  });
  it("retains the verified response and bounds the request", async () => {
    const expected = account();
    invoke.mockResolvedValue({ data: expected, error: null });
    expect(await getBillingAccount()).toEqual(expected);
    expect(invoke).toHaveBeenCalledWith("billing-account", { body: {}, timeout: 15000 });
  });
  it.each([-1, 1.5, Number.MAX_SAFE_INTEGER + 1])("rejects invalid balance %s", async balance => {
    const data = account();
    data.wallet.creditBalance = balance;
    invoke.mockResolvedValue({ data, error: null });
    await expect(getBillingAccount()).rejects.toThrow("Invalid billing account");
  });
  it("rejects contradictory balances and incomplete entitlements", async () => {
    const data = account();
    data.entitlements.creditBalance = 99;
    invoke.mockResolvedValue({ data, error: null });
    await expect(getBillingAccount()).rejects.toThrow("Invalid billing account");
    invoke.mockResolvedValue({ data: { ...account(), entitlements: { creditBalance: 250 } }, error: null });
    await expect(getBillingAccount()).rejects.toThrow("Invalid billing account");
  });
  it("distinguishes an unavailable catalogue from paused purchasing", async () => {
    invoke.mockResolvedValue({ data: null, error: new Error("Offline") });
    await expect(getBillingCatalog()).rejects.toThrow("Offline");
    invoke.mockResolvedValue({ data: { products: [], providerReady: false }, error: null });
    expect(await getBillingCatalog()).toEqual({ products: [], providerReady: false, provider: null });
  });
});
