import type { PlanId } from "../types/entitlements";

export type SubscriptionLocale = "en" | "ku" | "ar";

export const SUBSCRIPTION_PLAN_ORDER: PlanId[] = ["free", "plus", "pro", "max"];

export const SUBSCRIPTION_PLAN_DATA: Record<
  PlanId,
  {
    priceIqd: number;
    includedCredits: number;
    durationDays: number | null;
    liveTutorMinutes: number | null;
  }
> = {
  free: {
    priceIqd: 0,
    includedCredits: 250,
    durationDays: null,
    liveTutorMinutes: null,
  },
  plus: {
    priceIqd: 10_000,
    includedCredits: 2_500,
    durationDays: 30,
    liveTutorMinutes: 60,
  },
  pro: {
    priceIqd: 15_000,
    includedCredits: 4_500,
    durationDays: 30,
    liveTutorMinutes: 110,
  },
  max: {
    priceIqd: 25_000,
    includedCredits: 8_000,
    durationDays: 30,
    liveTutorMinutes: 200,
  },
};

const COPY = {
  en: {
    tags: {
      free: "FREE",
      plus: "PLUS",
      pro: "MOST POPULAR",
      max: "BEST VALUE",
    },
    descriptions: {
      free: "Full core learning path with a 250 AI credit welcome allowance.",
      plus: "Expanded learning paths, daily AI access, and 2,500 AI credits.",
      pro: "Advanced daily AI capacity, exam tools, and 4,500 AI credits.",
      max: "The ultimate Twino experience: Unlimited AI features and 8,000 AI credits.",
    },
    credits: (amount: number, welcome: boolean) =>
      `${amount.toLocaleString()} AI credits ${welcome ? "one-time welcome allowance" : "every 30 days"}`,
    duration: "30 days",
    liveTutor: (minutes: number) =>
      `Live Tutor equivalent: ${minutes === 60 ? "up to ~1 hour" : minutes === 110 ? "up to ~1h 50m" : "up to ~3h 20m"}`,
    benefits: {
      free: [
        "Full Normal English path (No credits needed)",
        "Slang Dictionary & AI Podcast included",
        "Reading Practice included",
        "AI Teacher — 5 practice sessions/day",
        "250 one-time AI welcome credits",
      ],
      plus: [
        "Everything in Free",
        "Full Street English & Kids English paths",
        "AI Teacher — 25 practice sessions/day",
        "AI Role Play — 15 scenarios/day",
        "IELTS & DET Preparation Preview",
        "2,500 AI credits (Up to ~1 hour Live Tutor)",
      ],
      pro: [
        "Everything in Plus",
        "AI Teacher — 100 practice sessions/day",
        "AI Role Play — 50 scenarios/day",
        "Expanded IELTS & DET preparation & strategies",
        "Standard Mock Exams included",
        "4,500 AI credits (Up to ~1h 50m Live Tutor)",
      ],
      max: [
        "Everything in Pro",
        "Unlimited AI Teacher (Smart Fair-Use)",
        "Unlimited AI Role Play (Smart Fair-Use)",
        "Full Unlimited IELTS & DET preparation",
        "Full Unlimited Mock Exam generation",
        "8,000 AI credits (Up to ~3h 20m Live Tutor)",
      ],
    },
    walletNote: "AI credits are valid for 30 days. Renew to receive a fresh monthly allowance.",
    accessNote: "Slang Dictionary, AI Podcasts, Reading Practice, and Normal Path require no credits and are included with your plan.",
    ttsNote: "Dynamic TTS costs 40 credits per minute. Static lesson audio is generated once, cached, and free to replay.",
    checkoutPaused: "Purchases remain paused until Wayl or Rasedi merchant activation is verified.",
  },
  ku: {
    tags: {
      free: "بەخۆڕایی",
      plus: "PLUS",
      pro: "زۆرترین هەڵبژاردە",
      max: "باشترین بەها",
    },
    descriptions: {
      free: "ڕێڕەوی فێربوونی سەرەکی بە تەواوی لەگەڵ ٢٥٠ کرێدیتی بەخێرهاتنی AI.",
      plus: "ڕێڕەوە نوێیەکان، بەکارهێنانی زیاتری ڕۆژانەی AI، و ٢,٥٠٠ کرێدیتی AI.",
      pro: "توانستی ڕۆژانەی بەرز بۆ AI، ئامرازەکانی تاقیکردنەوە، و ٤,٥٠٠ کرێدیتی AI.",
      max: "ئەزموونی بێسنووری TWINO: تایبەتمەندی بێسنوور و ٨,٠٠٠ کرێدیتی AI.",
    },
    credits: (amount: number, welcome: boolean) =>
      `${amount.toLocaleString()} کرێدیتی AI ${welcome ? "تەنها یەکجار" : "بۆ هەر ٣٠ ڕۆژێک"}`,
    duration: "٣٠ ڕۆژ",
    liveTutor: (minutes: number) =>
      `هاوتای Live Tutor: ${minutes === 60 ? "تا نزیکەی ١ کاتژمێر" : minutes === 110 ? "تا نزیکەی ١ کاتژمێر و ٥٠ خولەک" : "تا نزیکەی ٣ کاتژمێر و ٢٠ خولەک"}`,
    benefits: {
      free: [
        "ڕێڕەوی تەواوی Normal English (بەبێ کەمکردنی کرێدیت)",
        "فەرهەنگی سلاک و پۆدکاستی AI بەخۆڕایی",
        "ڕاهێنانی خوێندنەوە (Reading Practice)",
        "مامۆستای زیرەک (AI Teacher) — ٥ گفتوگۆ لە ڕۆژێکدا",
        "٢٥٠ کرێدیتی بەخێرهاتنی یەکجارەکی",
      ],
      plus: [
        "هەموو تایبەتمەندییەکانی بەخۆڕایی",
        "ڕێڕەوی تەواوی Street English و Kids English",
        "مامۆستای زیرەک (AI Teacher) — ٢٥ گفتوگۆ لە ڕۆژێکدا",
        "ڕۆڵپڵەی AI (Role Play) — ١٥ سیناریۆ لە ڕۆژێکدا",
        "پێشبینینی ئامادەکاری IELTS و DET",
        "٢,٥٠٠ کرێدیتی AI (تا نزیکەی ١ کاتژمێر مامۆستای دەنگی زیندوو)",
      ],
      pro: [
        "هەموو تایبەتمەندییەکانی Plus",
        "مامۆستای زیرەک (AI Teacher) — ١٠٠ گفتوگۆ لە ڕۆژێکدا",
        "ڕۆڵپڵەی AI (Role Play) — ٥٠ سیناریۆ لە ڕۆژێکدا",
        "ستراتیژ و ئامادەکاری فراوانکراوی IELTS و DET",
        "تاقیکردنەوە ساختە ستانداردەکان (Mock Exams)",
        "٤,٥٠٠ کرێدیتی AI (تا نزیکەی ١ کاتژمێر و ٥٠ خولەک مامۆستای دەنگی زیندوو)",
      ],
      max: [
        "هەموو تایبەتمەندییەکانی Pro",
        "مامۆستای زیرەکی بێسنوور (Unlimited AI Teacher)",
        "ڕۆڵپڵەی AI بێسنوور (Unlimited Role Play)",
        "ئامادەکاری تەواو و بێسنووری IELTS و DET",
        "تاقیکردنەوە ساختە تەواوە بێسنوورەکان",
        "٨,٠٠٠ کرێدیتی AI (تا نزیکەی ٣ کاتژمێر و ٢٠ خولەک مامۆستای دەنگی زیندوو)",
      ],
    },
    walletNote: "کرێدیتی AI بۆ ماوەی ٣٠ ڕۆژ کارایە. لەگەڵ نوێکردنەوەی مانگانە باڵانسی نوێ وەردەگریتەوە.",
    accessNote: "فەرهەنگی سلاک، پۆدکاست، ڕاهێنانی خوێندنەوە و ڕێڕەوی ئاسایی پێویستیان بە کرێدیت نییە.",
    ttsNote: "TTSی گۆڕاو ٤٠ کرێدیت بۆ هەر خولەکێکە. دەنگی وانە تەنها یەکجار دروست و پاشەکەوت دەکرێت و دووبارە لێدانەوەی بەخۆڕاییە.",
    checkoutPaused: "کڕین وەستاوە تا چالاکبوونی بازرگانی Wayl یان Rasedi پشتڕاست بکرێتەوە.",
  },
  ar: {
    tags: {
      free: "مجاني",
      plus: "PLUS",
      pro: "الأكثر شعبية",
      max: "أفضل قيمة",
    },
    descriptions: {
      free: "مسار التعلم الأساسي كاملاً مع 250 رصيد ترحيبي لمرة واحدة.",
      plus: "مسارات تعليمية أوسع واستخدام يومي أكبر للذكاء الاصطناعي مع 2,500 رصيد.",
      pro: "سعة يومية متقدمة للذكاء الاصطناعي وأدوات الاختبارات مع 4,500 رصيد.",
      max: "تجربة TWINO المتكاملة: ميزات ذكاء اصطناعي غير محدودة و8,000 رصيد.",
    },
    credits: (amount: number, welcome: boolean) =>
      `${amount.toLocaleString()} رصيد AI ${welcome ? "لمرة واحدة كترحيب" : "كل 30 يوماً"}`,
    duration: "30 يوماً",
    liveTutor: (minutes: number) =>
      `ما يعادل Live Tutor: ${minutes === 60 ? "حتى نحو ساعة" : minutes === 110 ? "حتى نحو ساعة و50 دقيقة" : "حتى نحو 3 ساعات و20 دقيقة"}`,
    benefits: {
      free: [
        "مسار Normal English بالكامل (دون استهلاك رصيد)",
        "قاموس المصطلحات وبودكاست AI مجاناً",
        "ممارسة القراءة مضمنة",
        "معلم الذكاء الاصطناعي — 5 جلسات يومياً",
        "250 رصيد ترحيبي لمرة واحدة",
      ],
      plus: [
        "كل ما في الخطة المجانية",
        "مسارا Street English وKids English بالكامل",
        "معلم الذكاء الاصطناعي — 25 جلسة يومياً",
        "محاكاة الأدوار — 15 سيناريو يومياً",
        "معاينة تحضير اختبارات IELTS وDET",
        "2,500 رصيد AI (حتى نحو ساعة مع المعلم الصوتي المباشر)",
      ],
      pro: [
        "كل ما في خطة Plus",
        "معلم الذكاء الاصطناعي — 100 جلسة يومياً",
        "محاكاة الأدوار — 50 سيناريو يومياً",
        "تحضير واستراتيجيات متقدمة لاختبارات IELTS وDET",
        "اختبارات تجريبية قياسية مضمنة",
        "4,500 رصيد AI (حتى نحو ساعة و50 دقيقة مع المعلم الصوتي المباشر)",
      ],
      max: [
        "كل ما في خطة Pro",
        "معلم الذكاء الاصطناعي غير محدود (ضمن الاستخدام العادل)",
        "محاكاة الأدوار غير محدودة (ضمن الاستخدام العادل)",
        "تحضير كامل وغير محدود لاختبارات IELTS وDET",
        "توليد كامل للاختبارات التجريبية دون حدود",
        "8,000 رصيد AI (حتى نحو 3 ساعات و20 دقيقة مع المعلم الصوتي المباشر)",
      ],
    },
    walletNote: "رصيد الذكاء الاصطناعي صالح لمدة 30 يوماً ويتجدد مع كل اشتراك شهري جديد.",
    accessNote: "قاموس المصطلحات والبودكاست وممارسة القراءة والمسار العادي لا تستهلك أي رصيد ومضمنة في خطتك.",
    ttsNote: "يكلف TTS الديناميكي 40 رصيداً للدقيقة. ينشأ صوت الدرس الثابت مرة واحدة ويخزن مؤقتاً، وإعادة تشغيله مجانية.",
    checkoutPaused: "تظل المشتريات متوقفة حتى توثيق تفعيل التاجر لدى Wayl أو Rasedi.",
  },
} as const;

export function getSubscriptionPlanCopy(locale: SubscriptionLocale) {
  return COPY[locale];
}
