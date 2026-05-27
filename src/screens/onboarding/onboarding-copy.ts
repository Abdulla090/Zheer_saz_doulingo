export type OnboardingLocale = "en" | "ku";

export const ONBOARDING_COPY = {
  en: {
    skip: "Skip",
    continue: "Continue",
    getStarted: "Get started",
    swipeHint: "Swipe left for next",
    languageEn: "English",
    languageKu: "کوردی",
    steps: [
      {
        title: "Meet Phingo",
        subtitle: "Your AI language partner for real conversations and daily English.",
      },
      {
        title: "Pick your path",
        subtitle: "Street English for everyday talk, or Normal English for structured units.",
      },
      {
        title: "Learn by doing",
        subtitle: "Games, speaking, and roleplay — short sessions that stick.",
      },
      {
        title: "Stay motivated",
        subtitle: "Hearts, XP, and streaks keep you moving forward.",
      },
      {
        title: "You're all set",
        subtitle: "Start your first lesson whenever you're ready.",
      },
    ],
    pathStreetTitle: "Street English",
    pathStreetSub: "Casual, real-life phrases",
    pathNormalTitle: "Normal English",
    pathNormalSub: "Structured lessons & units",
  },
  ku: {
    skip: "تێپەڕین",
    continue: "بەردەوامبوون",
    getStarted: "دەست پێ بکە",
    swipeHint: "بۆ خوارەوە بیخشێنە",
    languageEn: "English",
    languageKu: "کوردی",
    steps: [
      {
        title: "Phingo بناسە",
        subtitle: "هاوڕێی زمانی AIـەکەت بۆ گفتوگۆی ڕاستەقینە و ئینگلیزی ڕۆژانە.",
      },
      {
        title: "ڕێگاکەت هەڵبژێرە",
        subtitle: "Street English بۆ قسەی ڕۆژانە، Normal English بۆ وانەی ڕێکخراو.",
      },
      {
        title: "بە کردەوە فێربە",
        subtitle: "یاری، قسەکردن و ڕۆڵ — وانەی کورت کە دەمێنێتەوە.",
      },
      {
        title: "بەردەوام بە",
        subtitle: "دڵ، XP و streak یارمەتیت دەدەن بەردەوام بیت.",
      },
      {
        title: "ئامادەیت",
        subtitle: "کاتێک ئامادە بوویت، یەکەم وانەکەت دەست پێ بکە.",
      },
    ],
    pathStreetTitle: "Street English",
    pathStreetSub: "دەربڕینی ڕۆژانە",
    pathNormalTitle: "Normal English",
    pathNormalSub: "وانەی ڕێکخراو",
  },
} as const;
