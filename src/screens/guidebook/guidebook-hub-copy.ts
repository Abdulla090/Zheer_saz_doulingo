/*
 * Copy for the guidebook hub and its reference screens, in the app's UI
 * languages. Follows the same shape as `../guidebook/guidebook-copy.ts` — the
 * existing guide screen keeps its own copy module, so the guidebook family
 * stays independent of the global i18n key tables.
 */

export type GuidebookHubCopy = {
  hubTitle: string;
  hubSubtitle: string;
  unitEyebrow: (unitLabel: string) => string;
  lettersTitle: string;
  lettersSubtitle: string;
  lettersCount: (count: number) => string;
  nounsTitle: string;
  nounsSubtitle: string;
  nounsCount: (count: number) => string;
  verbsTitle: string;
  verbsSubtitle: string;
  verbsCount: (count: number) => string;
  everydayTitle: string;
  everydaySubtitle: string;
  everydayCount: (count: number) => string;
  back: string;
};

export type ReferenceScreenCopy = {
  /** Label above a letter's spoken name. */
  letterName: string;
  /** Label above how a letter sounds, in the learner's language. */
  letterSound: string;
  /** Label above a letter's example word. */
  letterExample: string;
  /** Accessible label on every audio chip. */
  listen: string;
};

export type GuidebookSectionsCopy = GuidebookHubCopy & ReferenceScreenCopy;

const COPY: Record<"en" | "ku" | "ar", GuidebookSectionsCopy> = {
  en: {
    hubTitle: "Guidebook",
    hubSubtitle: "Reference material for your course, always one tap away.",
    unitEyebrow: (unitLabel) => unitLabel,
    lettersTitle: "Letters",
    lettersSubtitle: "The alphabet, its letter names and sounds.",
    lettersCount: (count) => `${count} letters`,
    nounsTitle: "Nouns",
    nounsSubtitle: "Articles, plurals and how naming works.",
    nounsCount: (count) => `${count} rules`,
    verbsTitle: "Verbs",
    verbsSubtitle: "Tenses and conjugation, clearly laid out.",
    verbsCount: (count) => `${count} rules`,
    everydayTitle: "Everyday Talking",
    everydaySubtitle: "Phrases from your current unit, ready to use.",
    everydayCount: (count) => `${count} lessons`,
    back: "Back",
    letterName: "Letter name",
    letterSound: "How it sounds",
    letterExample: "Example word",
    listen: "Listen",
  },
  ku: {
    hubTitle: "ڕێبەر",
    hubSubtitle: "سەرچاوەکانی خولەکەت، هەمیشە بە یەک دەستنشان.",
    unitEyebrow: (unitLabel) => unitLabel,
    lettersTitle: "پیتەکان",
    lettersSubtitle: "ئەلفوبێ، ناوی پیتەکان و دەنگەکانیان.",
    lettersCount: (count) => `${count} پیت`,
    nounsTitle: "ناوەکان",
    nounsSubtitle: "دیاریکردن، کۆ و شێوەی ناوەکان.",
    nounsCount: (count) => `${count} یاسا`,
    verbsTitle: "کردارەکان",
    verbsSubtitle: "کاتەکان و شێوەی کردارەکان.",
    verbsCount: (count) => `${count} یاسا`,
    everydayTitle: "قسەکردنی ڕۆژانە",
    everydaySubtitle: "دەستەواژەکانی یەکەی ئێستات، ئامادە بۆ بەکارهێنان.",
    everydayCount: (count) => `${count} وانە`,
    back: "گەڕانەوە",
    letterName: "ناوی پیت",
    letterSound: "چۆن دەنگ دەدات",
    letterExample: "وشەی نموونە",
    listen: "گوێبگرە",
  },
  ar: {
    hubTitle: "الدليل",
    hubSubtitle: "مراجع دورتك، على بعد لمسة واحدة دائماً.",
    unitEyebrow: (unitLabel) => unitLabel,
    lettersTitle: "الحروف",
    lettersSubtitle: "الأبجدية وأسماء الحروف وأصواتها.",
    lettersCount: (count) => `${count} حرف`,
    nounsTitle: "الأسماء",
    nounsSubtitle: "التعريف والجمع وقواعد الأسماء.",
    nounsCount: (count) => `${count} قاعدة`,
    verbsTitle: "الأفعال",
    verbsSubtitle: "الأزمنة والتصريف بوضوح.",
    verbsCount: (count) => `${count} قاعدة`,
    everydayTitle: "الحديث اليومي",
    everydaySubtitle: "عبارات وحدتك الحالية، جاهزة للاستخدام.",
    everydayCount: (count) => `${count} دروس`,
    back: "رجوع",
    letterName: "اسم الحرف",
    letterSound: "كيف يُنطق",
    letterExample: "كلمة مثال",
    listen: "استمع",
  },
};

export function getGuidebookSectionsCopy(
  locale: string,
): GuidebookSectionsCopy {
  return COPY[locale as "en" | "ku" | "ar"] ?? COPY.en;
}
