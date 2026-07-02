import { getLanguage } from "../../config/languages";

export interface PromptContext {
  sourceLanguageCode: string;
  targetLanguageCode: string;
  difficulty: number | string;
  concept: string;
}

function getLanguageNames(ctx: PromptContext) {
  const src = getLanguage(ctx.sourceLanguageCode)?.name || ctx.sourceLanguageCode;
  const tgt = getLanguage(ctx.targetLanguageCode)?.name || ctx.targetLanguageCode;
  return { src, tgt };
}

export const AIPrompts = {
  explanation: (ctx: PromptContext) => {
    const { src, tgt } = getLanguageNames(ctx);
    return `Act as a bilingual language teacher. Explain the ${tgt} concept "${ctx.concept}" to a native ${src} speaker. Keep it extremely brief, use simple terms, and provide 2 clear examples. The explanation must be in ${src}, and the examples must be in ${tgt} with ${src} translations. Difficulty level: ${ctx.difficulty}.`;
  },
  
  multipleChoice: (ctx: PromptContext) => {
    const { src, tgt } = getLanguageNames(ctx);
    return `Generate a multiple choice question to test the ${tgt} concept "${ctx.concept}" for a ${src} speaker. Provide 1 correct answer and 3 plausible but incorrect answers. Format the output as JSON.`;
  },
  
  fillBlank: (ctx: PromptContext) => {
    const { src, tgt } = getLanguageNames(ctx);
    return `Generate a fill-in-the-blank exercise for the ${tgt} concept "${ctx.concept}". Provide a sentence in ${tgt} with one missing word, and its translation in ${src}. Format as JSON containing the sentence parts, the answer, and 3 wrong options.`;
  },
  
  conversation: (ctx: PromptContext) => {
    const { src, tgt } = getLanguageNames(ctx);
    return `Create a realistic conversation scenario in ${tgt} focusing on "${ctx.concept}". The user is asked a question by another person. Provide 1 excellent response, and 3 poor or incorrect responses. Format as JSON. Give the situation description in ${src}.`;
  },
  
  correction: (ctx: PromptContext) => {
    const { src, tgt } = getLanguageNames(ctx);
    return `The user is learning ${tgt}. They made a mistake related to "${ctx.concept}". Provide a polite, constructive correction explaining the grammar rule in ${src}.`;
  }
};
