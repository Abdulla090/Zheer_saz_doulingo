export type GuidebookCopy = {
  screenTitle: string;
  close: string;
  study: string;
  practice: string;
  vocabulary: string;
  keyPhrases: string;
  more: string;
  meaningsOn: string;
  meaningsOff: string;
  listen: string;
  practiceTitle: string;
  tapToReveal: string;
  revealAnswer: string;
  nextCard: string;
  previousCard: string;
  restart: string;
  completeTitle: string;
  emptyPractice: string;
  notAvailable: string;
};

const COPY: Record<"en" | "ku" | "ar", GuidebookCopy> = {
  en: {
    screenTitle: "Guide",
    close: "Close guide",
    study: "Discover",
    practice: "Remember",
    vocabulary: "Word",
    keyPhrases: "Key phrases",
    more: "More",
    meaningsOn: "Hide meanings",
    meaningsOff: "Show meanings",
    listen: "Listen",
    practiceTitle: "From memory",
    tapToReveal: "Tap to reveal",
    revealAnswer: "Reveal meaning",
    nextCard: "Next",
    previousCard: "Previous",
    restart: "Practice again",
    completeTitle: "Lesson reviewed",
    emptyPractice: "This lesson has no practice cards yet.",
    notAvailable: "This study guide is not available.",
  },
  ku: {
    screenTitle: "ڕێبەر",
    close: "داخستنی ڕێبەر",
    study: "دۆزینەوە",
    practice: "بیرخستنەوە",
    vocabulary: "وشە",
    keyPhrases: "دەستەواژە سەرەکییەکان",
    more: "زیاتر",
    meaningsOn: "واتاکان بشارەوە",
    meaningsOff: "واتاکان پیشان بدە",
    listen: "گوێبگرە",
    practiceTitle: "لەبیرەوە",
    tapToReveal: "واتاکە پیشان بدە",
    revealAnswer: "واتاکە پیشان بدە",
    nextCard: "دواتر",
    previousCard: "پێشتر",
    restart: "دووبارە",
    completeTitle: "وانەکە تەواو بوو",
    emptyPractice: "هێشتا ڕاهێنانێک نییە.",
    notAvailable: "ئەم ڕێبەرە بەردەست نییە.",
  },
  ar: {
    screenTitle: "الدليل",
    close: "إغلاق الدليل",
    study: "اكتشف",
    practice: "تذكّر",
    vocabulary: "كلمة",
    keyPhrases: "الجمل الأساسية",
    more: "المزيد",
    meaningsOn: "إخفاء المعاني",
    meaningsOff: "إظهار المعاني",
    listen: "استمع",
    practiceTitle: "من الذاكرة",
    tapToReveal: "إظهار المعنى",
    revealAnswer: "إظهار المعنى",
    nextCard: "التالي",
    previousCard: "السابق",
    restart: "مرة أخرى",
    completeTitle: "اكتمل الدرس",
    emptyPractice: "لا يوجد تدريب بعد.",
    notAvailable: "هذا الدليل غير متاح.",
  },
};

export function getGuidebookCopy(locale: string): GuidebookCopy {
  if (locale === "ku") return COPY.ku;
  if (locale === "ar") return COPY.ar;
  return COPY.en;
}
