export type AnswerTier = "great" | "good" | "bad" | "terrible";

export const CONVERSATION_TIER_ORDER: AnswerTier[] = [
  "great",
  "good",
  "bad",
  "terrible",
];

export function tierPasses(tier: AnswerTier): boolean {
  return tier === "great" || tier === "good";
}

export function buildConversationOptionTiers(entry: {
  correct: string;
  wrong1: string;
  wrong2: string;
  wrong3: string;
}): Record<string, AnswerTier> {
  return {
    [entry.correct]: "great",
    [entry.wrong1]: "good",
    [entry.wrong2]: "bad",
    [entry.wrong3]: "terrible",
  };
}

export function tierLabelKey(tier: AnswerTier): `lessons.tier${Capitalize<AnswerTier>}` {
  return `lessons.tier${tier.charAt(0).toUpperCase()}${tier.slice(1)}` as `lessons.tier${Capitalize<AnswerTier>}`;
}

export function tierFeedbackKey(tier: AnswerTier): `lessons.tierFeedback${Capitalize<AnswerTier>}` {
  return `lessons.tierFeedback${tier.charAt(0).toUpperCase()}${tier.slice(1)}` as `lessons.tierFeedback${Capitalize<AnswerTier>}`;
}

export const TIER_COLORS = {
  great: { accent: "#E8A317", deep: "#B87A00", bg: "#FFF8E0" },
  good: { accent: "#58CC02", deep: "#46A302", bg: "#E7F9E0" },
  bad: { accent: "#F5A623", deep: "#C47D00", bg: "#FFF4E0" },
  terrible: { accent: "#FF4B4B", deep: "#E53838", bg: "#FFE8E8" },
} as const;
