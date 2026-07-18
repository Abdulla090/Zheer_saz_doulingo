import {
  DEFAULT_MASCOT_ID,
  isMascotId,
  type MascotId,
} from "./mascots";

export const MASCOT_EXPRESSIONS = [
  "happy",
  "winning",
  "losing",
  "comfy",
  "encouraging",
  "thinking",
  "surprised",
  "sleepy",
] as const;

export type MascotExpression = (typeof MASCOT_EXPRESSIONS)[number];

export const MASCOT_EXPRESSION_SOURCES = {
  pingo: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-pingo-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-pingo-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-pingo-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-pingo-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-pingo-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-pingo-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-pingo-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-pingo-sleepy.webp"),
  },
  violet: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-violet-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-violet-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-violet-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-violet-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-violet-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-violet-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-violet-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-violet-sleepy.webp"),
  },
  biscuit: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-biscuit-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-biscuit-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-biscuit-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-biscuit-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-biscuit-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-biscuit-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-biscuit-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-biscuit-sleepy.webp"),
  },
  waddle: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-waddle-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-waddle-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-waddle-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-waddle-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-waddle-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-waddle-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-waddle-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-waddle-sleepy.webp"),
  },
  sparkle: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-sparkle-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-sparkle-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-sparkle-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-sparkle-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-sparkle-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-sparkle-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-sparkle-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-sparkle-sleepy.webp"),
  },
  orbit: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-orbit-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-orbit-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-orbit-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-orbit-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-orbit-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-orbit-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-orbit-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-orbit-sleepy.webp"),
  },
  ember: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-ember-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-ember-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-ember-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-ember-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-ember-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-ember-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-ember-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-ember-sleepy.webp"),
  },
  quacks: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-quacks-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-quacks-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-quacks-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-quacks-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-quacks-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-quacks-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-quacks-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-quacks-sleepy.webp"),
  },
  momo: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-momo-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-momo-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-momo-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-momo-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-momo-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-momo-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-momo-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-momo-sleepy.webp"),
  },
  buzzwell: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-buzzwell-sleepy.webp"),
  },
  sprout: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-sprout-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-sprout-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-sprout-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-sprout-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-sprout-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-sprout-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-sprout-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-sprout-sleepy.webp"),
  },
  moonbun: {
    happy: require("../../assets/images/mascots/expressions/poses/pet-moonbun-happy.webp"),
    winning: require("../../assets/images/mascots/expressions/poses/pet-moonbun-winning.webp"),
    losing: require("../../assets/images/mascots/expressions/poses/pet-moonbun-losing.webp"),
    comfy: require("../../assets/images/mascots/expressions/poses/pet-moonbun-comfy.webp"),
    encouraging: require("../../assets/images/mascots/expressions/poses/pet-moonbun-encouraging.webp"),
    thinking: require("../../assets/images/mascots/expressions/poses/pet-moonbun-thinking.webp"),
    surprised: require("../../assets/images/mascots/expressions/poses/pet-moonbun-surprised.webp"),
    sleepy: require("../../assets/images/mascots/expressions/poses/pet-moonbun-sleepy.webp"),
  },
} as const satisfies Record<
  MascotId,
  Record<MascotExpression, ReturnType<typeof require>>
>;

export function getMascotExpressionSource(
  mascotId: unknown,
  expression: MascotExpression,
) {
  const safeMascotId = isMascotId(mascotId) ? mascotId : DEFAULT_MASCOT_ID;
  return MASCOT_EXPRESSION_SOURCES[safeMascotId][expression];
}
