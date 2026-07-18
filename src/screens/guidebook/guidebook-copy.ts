export type GuidebookCopy = {
  screenTitle: string;
  study: string;
  practice: string;
  vocabulary: string;
  keyPhrases: string;
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
    screenTitle: "Study guide",
    study: "Study",
    practice: "Practice",
    vocabulary: "Vocabulary",
    keyPhrases: "Useful phrases",
    meaningsOn: "Hide meanings",
    meaningsOff: "Show meanings",
    listen: "Listen",
    practiceTitle: "Quick recall",
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
    screenTitle: "ڕێبەری خوێندن",
    study: "خوێندن",
    practice: "ڕاهێنان",
    vocabulary: "فەرهەنگ",
    keyPhrases: "دەستەواژەکان",
    meaningsOn: "واتاکان بشارەوە",
    meaningsOff: "واتاکان پیشان بدە",
    listen: "گوێبگرە",
    practiceTitle: "بیرەوەری",
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
    screenTitle: "دليل الدراسة",
    study: "دراسة",
    practice: "تدريب",
    vocabulary: "المفردات",
    keyPhrases: "العبارات",
    meaningsOn: "إخفاء المعاني",
    meaningsOff: "إظهار المعاني",
    listen: "استمع",
    practiceTitle: "تذكّر",
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
