import type { AppLocale } from "@/utils/rtl";

export type OnboardingLocale = AppLocale;

export const ONBOARDING_COPY = {
  en: {
    skip: "Skip",
    continue: "Continue",
    getStarted: "Get started",
    swipeHint: "Swipe to continue",
    languageEn: "English",
    languageKu: "کوردی",
    steps: [
      {
        title: "Welcome to Phingo",
        subtitle: "Premium English learning built for Kurdish speakers — clear, focused, flagship-quality.",
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
        title: "Track your momentum",
        subtitle: "Daily XP, streaks, dual-path progress, and home widgets keep you on track.",
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
    swipeHint: "بۆ لای ڕاست بخشێنە بۆ دواتر",
    languageEn: "ئینگلیزی",
    languageKu: "کوردی",
    steps: [
      {
        title: "Phingo ـ بناسە",
        subtitle:
          "هاوڕێی زمانی AIـەکەت بۆ گفتوگۆی ڕاستەقینە و فێربوونی ئینگلیزی ڕۆژانە.",
      },
      {
        title: "ڕێگاکەت هەڵبژێرە",
        subtitle:
          "ئینگلیزی شەقامی بۆ قسەی ڕۆژانە، یان ئینگلیزی ئاسایی بۆ وانەی ڕێکخراو.",
      },
      {
        title: "بە کردەوە فێربە",
        subtitle:
          "یاری، قسەکردن و ڕۆڵـلێدان — وانەی کورت کە لەبیر دەمێنێتەوە.",
      },
      {
        title: "بەردەوام بە",
        subtitle:
          "دڵ، خاڵی ئەزموون و زنجیرەی ڕۆژانە یارمەتیت دەدەن بە پێشەوە بچیت.",
      },
      {
        title: "ئامادەیت!",
        subtitle: "کاتێک ئامادە بوویت، یەکەم وانەکەت دەست پێ بکە.",
      },
    ],
    pathStreetTitle: "ئینگلیزی شەقام",
    pathStreetSub: "دەربڕینی ڕۆژانە و سروشت",
    pathNormalTitle: "ئینگلیزی ئاسایی",
    pathNormalSub: "وانە و یەکەی ڕێکخراو",
  },
} as const;
