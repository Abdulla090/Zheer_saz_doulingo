import { describe, expect, it } from "@jest/globals";
import { mergeStreamingTranscript } from "../streaming-transcript";

describe("mergeStreamingTranscript", () => {
  it("preserves word boundaries supplied by Gemini deltas", () => {
    let text = "";
    for (const delta of [
      "Good.",
      " Try",
      " saying",
      " 'I",
      " need",
      " to",
      " speak",
      " very",
      " fluent",
      " English.'",
    ]) {
      text = mergeStreamingTranscript(text, delta);
    }

    expect(text).toBe("Good. Try saying 'I need to speak very fluent English.'");
  });

  it("accepts cumulative transcript snapshots without duplicating text", () => {
    expect(mergeStreamingTranscript("Good.", "Good. Try again.")).toBe(
      "Good. Try again.",
    );
  });

  it("adds a missing boundary between word-level deltas", () => {
    expect(mergeStreamingTranscript("Try", "saying")).toBe("Try saying");
  });

  it("does not insert spaces before punctuation", () => {
    expect(mergeStreamingTranscript("Try again", ".")).toBe("Try again.");
  });
});
