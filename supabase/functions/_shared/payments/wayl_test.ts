import { normalizeWaylStatus, signWaylWebhook } from "./wayl.ts";

// Deno convention intentionally avoids Jest's `*.test.ts` collector.

function assertEquals(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`Expected ${String(expected)}, received ${String(actual)}`);
  }
}

Deno.test("Wayl statuses are normalized without granting unknown states", () => {
  assertEquals(normalizeWaylStatus("Complete"), "completed");
  assertEquals(normalizeWaylStatus("Delivered"), "completed");
  assertEquals(normalizeWaylStatus("Processing"), "processing");
  assertEquals(normalizeWaylStatus("Returned"), "refunded");
  assertEquals(normalizeWaylStatus("unexpected"), "pending");
});

Deno.test("Wayl webhook HMAC signs the exact raw body", async () => {
  const signature = await signWaylWebhook(
    "The quick brown fox jumps over the lazy dog",
    "key",
  );
  assertEquals(
    signature,
    "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8",
  );
});
