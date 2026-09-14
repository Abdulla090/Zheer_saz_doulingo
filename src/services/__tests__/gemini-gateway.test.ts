import { afterEach, beforeEach, expect, it, jest } from "@jest/globals";
import { supabase } from "../../lib/supabase";
import { generateGeminiContent } from "../gemini-gateway";

jest.mock("../../constants/gemini", () => ({ isGeminiConfigured: () => true }));
jest.mock("../../lib/supabase", () => ({ supabase: { auth: { getSession: jest.fn() }, functions: { invoke: jest.fn() } } }));
const session = jest.mocked(supabase.auth.getSession);
const invoke = jest.mocked(supabase.functions.invoke);
beforeEach(() => {
  jest.resetAllMocks();
  session.mockResolvedValue({ data: { session: { access_token: "test" } }, error: null } as never);
});
afterEach(() => {
  jest.useRealTimers();
});
it("requires sign-in before any billable AI request", async () => {
  session.mockResolvedValue({ data: { session: null }, error: null });
  await expect(generateGeminiContent("model", { contents: [] }, { featureKey: "study_tutor" })).rejects.toThrow("Sign in");
  expect(invoke).not.toHaveBeenCalled();
});
it("preserves the caller's idempotency key through the authenticated gateway", async () => {
  invoke.mockResolvedValue({ data: { answer: "ok" }, error: null });
  await expect(generateGeminiContent("model", { contents: [] }, { featureKey: "study_tutor", idempotencyKey: "study:one-request" })).resolves.toEqual({ answer: "ok" });
  expect(invoke.mock.calls[0][1]?.body).toMatchObject({ featureKey: "study_tutor", idempotencyKey: "study:one-request" });
});
it("aborts timed-out transport without silently retrying a paid request", async () => {
  jest.useFakeTimers();
  invoke.mockImplementation(() => new Promise(() => {}));
  const request = generateGeminiContent("model", { contents: [] }, { featureKey: "study_tutor", timeoutMs: 100 });
  const rejection = expect(request).rejects.toThrow("Network timeout");
  await jest.advanceTimersByTimeAsync(100);
  await rejection;
  expect(invoke.mock.calls[0][1]?.signal?.aborted).toBe(true);
  expect(invoke).toHaveBeenCalledTimes(1);
});
