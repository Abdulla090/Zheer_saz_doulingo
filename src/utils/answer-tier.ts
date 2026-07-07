export type AnswerTier = "great" | "good" | "bad" | "terrible";

export const CONVERSATION_TIER_ORDER: AnswerTier[] = [
  "great",
  "good",
  "bad",
  "terrible",
];

export function tierPasses(tier: AnswerTier): boolean {
  return tier === "great";
}

export function buildConversationOptionTiers(entry: {
  correct: string;
  wrong1: string;
  wrong2: string;
  wrong3: string;
}): Record<string, AnswerTier> {
  return {
    [entry.correct]: "great",
    [entry.wrong1]: "terrible",
    [entry.wrong2]: "terrible",
    [entry.wrong3]: "terrible",
  };
}

export function tierLabelKey(tier: AnswerTier): `lessons.tier${Capitalize<AnswerTier>}` {
  return `lessons.tier${tier.charAt(0).toUpperCase()}${tier.slice(1)}` as `lessons.tier${Capitalize<AnswerTier>}`;
}

export function tierFeedbackKey(tier: AnswerTier): `lessons.tierFeedback${Capitalize<AnswerTier>}` {
  return `lessons.tierFeedback${tier.charAt(0).toUpperCase()}${tier.slice(1)}` as `lessons.tierFeedback${Capitalize<AnswerTier>}`;
}

/** Best → worst: green for correct, red for all incorrect. */
export const TIER_COLORS = {
  great: { accent: "#58CC02", deep: "#46A302", bg: "#E7F9E0" },
  good: { accent: "#FF4B4B", deep: "#E53838", bg: "#FFE8E8" },
  bad: { accent: "#FF4B4B", deep: "#E53838", bg: "#FFE8E8" },
  terrible: { accent: "#FF4B4B", deep: "#E53838", bg: "#FFE8E8" },
} as const;
