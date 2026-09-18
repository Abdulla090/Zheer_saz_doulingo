import { getLanguage } from "../config/languages";

export type RolePlayScenarioId = "cafe" | "space" | "job" | "market";
export type RolePlayTargetCode = "en" | "ar" | "ru";

export type LocalizedRolePlayScenario = {
  initialMessage: string;
  mission: string;
  goals: [string, string, string];
  phrases: [string, string];
};

const FALLBACK_TARGET: RolePlayTargetCode = "en";

export function resolveRolePlayTargetCode(code?: string | null): RolePlayTargetCode {
  return code === "ar" || code === "ru" || code === "en" ? code : FALLBACK_TARGET;
}

export function getRolePlayLanguageName(code?: string | null): string {
  const language = getLanguage(code ?? "");
  if (!language) return "English";
  return language.id === "ku" ? "Sorani Kurdish" : language.name;
}

export function getRolePlaySpeechLocale(code?: string | null): string {
  const resolved = resolveRolePlayTargetCode(code);
  if (resolved === "ar") return "ar-SA";
  if (resolved === "ru") return "ru-RU";
  return "en-US";
}

const CONTENT: Record<
  RolePlayScenarioId,
  Record<RolePlayTargetCode, LocalizedRolePlayScenario>
> = {
  cafe: {
    en: {
      initialMessage: "Hi! Welcome in. What can I get started for you?",
      mission: "Get the exact breakfast you want without switching languages.",
      goals: ["Order a drink", "Add or change an item", "Confirm the final order"],
      phrases: ["Could I have…?", "Can I get that without…?"],
    },
    ar: {
      initialMessage: "أهلاً وسهلاً! ماذا تحب أن تطلب اليوم؟",
      mission: "اطلب الفطور الذي تريده بالكامل من دون تغيير اللغة.",
      goals: ["اطلب مشروباً", "أضف أو غيّر صنفاً", "أكّد الطلب النهائي"],
      phrases: ["ممكن أطلب…؟", "ممكن يكون من دون…؟"],
    },
    ru: {
      initialMessage: "Здравствуйте! Что бы вы хотели заказать сегодня?",
      mission: "Закажите именно тот завтрак, который хотите, не меняя язык.",
      goals: ["Заказать напиток", "Добавить или изменить блюдо", "Подтвердить заказ"],
      phrases: ["Можно мне…?", "Можно это без…?"],
    },
  },
  space: {
    en: {
      initialMessage: "Your bag is over the Mars flight limit. Why should I let it through?",
      mission: "Convince a strict gate agent that your equipment must fly.",
      goals: ["Explain what is in the bag", "Give a convincing reason", "Reach a decision"],
      phrases: ["I need it because…", "Is there any exception for…?"],
    },
    ar: {
      initialMessage: "حقيبتك تتجاوز الوزن المسموح لرحلة المريخ. لماذا أسمح بمرورها؟",
      mission: "أقنع موظف البوابة الصارم بأن معداتك يجب أن تسافر معك.",
      goals: ["اشرح ما في الحقيبة", "قدّم سبباً مقنعاً", "توصّل إلى قرار"],
      phrases: ["أحتاجها لأن…", "هل يوجد استثناء لـ…؟"],
    },
    ru: {
      initialMessage: "Ваш багаж тяжелее нормы для рейса на Марс. Почему я должен его пропустить?",
      mission: "Убедите строгого сотрудника, что оборудование должно лететь с вами.",
      goals: ["Объяснить содержимое багажа", "Привести убедительную причину", "Договориться"],
      phrases: ["Мне это нужно, потому что…", "Можно сделать исключение для…?"],
    },
  },
  job: {
    en: {
      initialMessage: "Thanks for joining us. Tell me about an AI project you are proud of.",
      mission: "Show clear thinking, real experience, and confident professional language.",
      goals: ["Describe relevant experience", "Explain a technical choice", "Ask a strong question"],
      phrases: ["A project I’m proud of…", "The trade-off was…"],
    },
    ar: {
      initialMessage: "شكراً لانضمامك إلينا. حدثني عن مشروع ذكاء اصطناعي تفتخر به.",
      mission: "أظهر تفكيراً واضحاً وخبرة حقيقية ولغة مهنية واثقة.",
      goals: ["صف خبرتك المناسبة", "اشرح قراراً تقنياً", "اطرح سؤالاً قوياً"],
      phrases: ["مشروع أفتخر به هو…", "الموازنة كانت بين…"],
    },
    ru: {
      initialMessage: "Спасибо, что пришли. Расскажите об ИИ-проекте, которым вы гордитесь.",
      mission: "Покажите ясное мышление, реальный опыт и уверенную профессиональную речь.",
      goals: ["Описать подходящий опыт", "Объяснить техническое решение", "Задать сильный вопрос"],
      phrases: ["Проект, которым я горжусь…", "Главный компромисс был…"],
    },
  },
  market: {
    en: {
      initialMessage: "My friend, this rug is a masterpiece. For you, only five hundred coins!",
      mission: "Use persuasive language to lower the price and close the deal.",
      goals: ["Make a counteroffer", "Give a reason for your price", "Close or walk away"],
      phrases: ["That’s more than I planned…", "I can offer…"],
    },
    ar: {
      initialMessage: "يا صديقي، هذه السجادة تحفة فنية. لك أنت فقط بخمسمئة قطعة!",
      mission: "استخدم لغة مقنعة لتخفيض السعر وإتمام الصفقة.",
      goals: ["قدّم سعراً مقابلاً", "اشرح سبب سعرك", "أتمم الصفقة أو انسحب"],
      phrases: ["هذا أكثر مما خططت له…", "يمكنني أن أدفع…"],
    },
    ru: {
      initialMessage: "Друг мой, этот ковёр — шедевр. Для вас всего пятьсот монет!",
      mission: "Убедительно снизьте цену и завершите сделку.",
      goals: ["Предложить свою цену", "Обосновать цену", "Купить или отказаться"],
      phrases: ["Это дороже, чем я планировал…", "Я могу предложить…"],
    },
  },
};

export function getLocalizedRolePlayScenario(
  scenarioId: RolePlayScenarioId,
  targetCode?: string | null,
): LocalizedRolePlayScenario {
  return CONTENT[scenarioId][resolveRolePlayTargetCode(targetCode)];
}
