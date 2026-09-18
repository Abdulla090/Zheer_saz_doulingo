import { getAiRequestPolicy, isRequestObject } from "./ai-request-policy.ts";

Deno.test("unknown and inherited features cannot acquire a provider policy", () => {
  for (const feature of [null, undefined, [], {}, "__proto__", "constructor", "premium_model"]) {
    if (getAiRequestPolicy(feature) !== null) throw new Error("Unexpected policy");
  }
});
Deno.test("cheap roleplay retains its server budget; study has its own policy", () => {
  const roleplay = getAiRequestPolicy("roleplay_text_response");
  const voiceRoleplay = getAiRequestPolicy("roleplay_voice_response");
  const study = getAiRequestPolicy("study_tutor");
  if (roleplay?.maxOutputTokens !== 512 || study?.maxOutputTokens !== 4096) throw new Error("Incorrect output budget");
  if (roleplay.model !== "gemini-3.5-flash-lite" || study.model !== "gemini-3.6-flash") throw new Error("Incorrect server model");
  if (voiceRoleplay?.model !== "gemini-3.6-flash" || voiceRoleplay.maxOutputTokens !== 640) throw new Error("Voice roleplay must use the audio-capable policy");
  if (roleplay.responseMimeType !== "application/json" || study.responseMimeType !== "application/json") throw new Error("Structured features must enforce JSON");
});
Deno.test("JSON null, arrays and primitives are rejected at the request boundary", () => {
  for (const value of [null, [], "", 0, true]) {
    if (isRequestObject(value)) throw new Error("Invalid object accepted");
  }
  if (!isRequestObject({ featureKey: "study_tutor" })) throw new Error("Valid object rejected");
});
