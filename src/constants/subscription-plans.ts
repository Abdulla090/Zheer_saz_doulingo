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
      free: "Core learning stays free, with a one-time AI welcome wallet.",
      plus: "All normal learning plus Street, Kids, and future exam previews.",
      pro: "More AI credit and stronger future exam and AI access.",
      max: "The largest wallet and complete future exam access.",
    },
    credits: (amount: number, welcome: boolean) =>
      `${amount.toLocaleString()} AI credits ${welcome ? "one time" : "per purchase or renewal"}`,
    duration: "30 days",
    liveTutor: (minutes: number) =>
      `Live Tutor equivalent: ${minutes === 60 ? "up to ~1 hour" : minutes === 110 ? "up to ~1h 50m" : "up to ~3h 20m"}`,
    benefits: {
      free: [
        "All Normal English lessons",
        "AI tools available while credits remain",
        "Street and Kids require Plus or higher",
        "IELTS, DET, and mock exams are locked",
      ],
      plus: [
        "All normal learning content",
        "Street and Kids paths included",
        "IELTS and DET preview — Coming Soon",
        "Limited mock-exam preview — Coming Soon",
      ],
      pro: [
        "Everything in Plus",
        "Better IELTS and DET access — Coming Soon",
        "More advanced AI features",
        "Credits never expire",
      ],
      max: [
        "Everything in Pro",
        "Full IELTS and DET preparation — Coming Soon",
        "Full mock exams — Coming Soon",
        "Advanced AI evaluation features",
        "Credits never expire",
      ],
    },
    walletNote: "Unused AI credits never expire, even after your plan ends.",
    accessNote: "When a plan ends, premium access ends. Your unused purchased credits stay in your wallet.",
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
      free: "فێربوونی سەرەکی بەخۆڕایی دەمێنێتەوە و کرێدیتی بەخێرهاتنی یەکجار هەیە.",
      plus: "هەموو فێربوونی ئاسایی لەگەڵ Street و Kids و پێشبینینی تاقیکردنەوەکان.",
      pro: "کرێدیتی AI زیاتر و دەستگەیشتنی باشتر بە تایبەتمەندییەکانی داهاتوو.",
      max: "گەورەترین باڵانس و دەستگەیشتنی تەواو بە تاقیکردنەوەکانی داهاتوو.",
    },
    credits: (amount: number, welcome: boolean) =>
      `${amount.toLocaleString()} کرێدیتی AI ${welcome ? "تەنها یەکجار" : "لە هەر کڕین یان نوێکردنەوەیەکدا"}`,
    duration: "٣٠ ڕۆژ",
    liveTutor: (minutes: number) =>
      `هاوتای Live Tutor: ${minutes === 60 ? "تا نزیکەی ١ کاتژمێر" : minutes === 110 ? "تا نزیکەی ١ کاتژمێر و ٥٠ خولەک" : "تا نزیکەی ٣ کاتژمێر و ٢٠ خولەک"}`,
    benefits: {
      free: [
        "هەموو وانەکانی Normal English",
        "ئامرازەکانی AI تا کرێدیت هەبێت",
        "Street و Kids پلانی Plus یان بەرزتر دەوێت",
        "IELTS و DET و تاقیکردنەوە ساختەکان داخراون",
      ],
      plus: [
        "هەموو ناوەڕۆکی فێربوونی ئاسایی",
        "ڕێڕەوی Street و Kids لەخۆدەگرێت",
        "پێشبینینی IELTS و DET — بەم زووانە",
        "پێشبینینی سنوورداری تاقیکردنەوە — بەم زووانە",
      ],
      pro: [
        "هەموو شتەکانی Plus",
        "دەستگەیشتنی باشتر بە IELTS و DET — بەم زووانە",
        "تایبەتمەندی AI پێشکەوتووتر",
        "کرێدیتەکان بەسەرناچن",
      ],
      max: [
        "هەموو شتەکانی Pro",
        "ئامادەکاری تەواوی IELTS و DET — بەم زووانە",
        "تاقیکردنەوە ساختە تەواوەکان — بەم زووانە",
        "هەڵسەنگاندنی پێشکەوتووی AI",
        "کرێدیتەکان بەسەرناچن",
      ],
    },
    walletNote: "کرێدیتی AI بەکارنەهاتوو هەرگیز بەسەرناچێت، تەنانەت دوای کۆتایی پلان.",
    accessNote: "کاتێک پلان کۆتایی دێت، دەستگەیشتنی تایبەت کۆتایی دێت؛ کرێدیتی کڕدراوی بەکارنەهاتوو لە جزدانەکەت دەمێنێتەوە.",
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
      free: "يبقى التعلم الأساسي مجانياً مع رصيد ترحيبي لمرة واحدة.",
      plus: "كل التعلم العادي مع مساري Street وKids ومعاينات الاختبارات المستقبلية.",
      pro: "رصيد AI أكبر ووصول أفضل للاختبارات وميزات AI المستقبلية.",
      max: "أكبر رصيد ووصول كامل للاختبارات المستقبلية.",
    },
    credits: (amount: number, welcome: boolean) =>
      `${amount.toLocaleString()} رصيد AI ${welcome ? "لمرة واحدة" : "مع كل شراء أو تجديد"}`,
    duration: "30 يوماً",
    liveTutor: (minutes: number) =>
      `ما يعادل Live Tutor: ${minutes === 60 ? "حتى نحو ساعة" : minutes === 110 ? "حتى نحو ساعة و50 دقيقة" : "حتى نحو 3 ساعات و20 دقيقة"}`,
    benefits: {
      free: [
        "جميع دروس Normal English",
        "أدوات AI متاحة ما دام لديك رصيد",
        "يتطلب Street وKids خطة Plus أو أعلى",
        "IELTS وDET والاختبارات التجريبية مقفلة",
      ],
      plus: [
        "كل محتوى التعلم العادي",
        "مسارا Street وKids مضمنان",
        "معاينة IELTS وDET — قريباً",
        "معاينة محدودة للاختبارات التجريبية — قريباً",
      ],
      pro: [
        "كل ما في Plus",
        "وصول أفضل إلى IELTS وDET — قريباً",
        "ميزات AI أكثر تقدماً",
        "الرصيد لا ينتهي",
      ],
      max: [
        "كل ما في Pro",
        "تحضير IELTS وDET الكامل — قريباً",
        "اختبارات تجريبية كاملة — قريباً",
        "ميزات تقييم AI متقدمة",
        "الرصيد لا ينتهي",
      ],
    },
    walletNote: "رصيد AI غير المستخدم لا ينتهي أبداً، حتى بعد انتهاء خطتك.",
    accessNote: "عند انتهاء الخطة ينتهي الوصول المميز، لكن الرصيد المشترى غير المستخدم يبقى في محفظتك.",
    ttsNote: "يكلف TTS الديناميكي 40 رصيداً للدقيقة. ينشأ صوت الدرس الثابت مرة واحدة ويخزن مؤقتاً، وإعادة تشغيله مجانية.",
    checkoutPaused: "تظل المشتريات متوقفة حتى توثيق تفعيل التاجر لدى Wayl أو Rasedi.",
  },
} as const;

export function getSubscriptionPlanCopy(locale: SubscriptionLocale) {
  return COPY[locale];
}
