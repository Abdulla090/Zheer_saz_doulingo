import type { LegalDocument } from "./types";

export const aiSafetyEn: LegalDocument = {
  title: "AI & practice features",
  lastUpdated: "May 27, 2026",
  sections: [
    {
      title: "Not official exams",
      paragraphs: [
        "AI Teacher shows indicative practice bands inspired by IELTS-style criteria. These are not official IELTS, TOEFL, or school exam scores. Do not use them for visa, university, or employment decisions.",
      ],
    },
    {
      title: "AI Teacher",
      paragraphs: [
        "By default, scoring uses on-device heuristics (word count, structure hints) for practice only.",
        "If a secure HTTPS API is configured, your written or transcribed answer may be sent to that service. Never submit passwords, ID numbers, or sensitive personal information.",
      ],
    },
    {
      title: "AI Role Play",
      paragraphs: [
        "Scenes use scripted or rule-based replies for English conversation practice. Responses may be inaccurate or unrealistic. This is not human tutoring and not emergency or professional advice.",
      ],
    },
    {
      title: "Microphone use",
      paragraphs: [
        "Speak clearly in a private setting when possible. Speech recognition can mishear words, especially with background noise or accents.",
      ],
    },
    {
      title: "Wellbeing",
      paragraphs: [
        "Take breaks during long study sessions. If AI feedback feels discouraging, focus on lesson content and try again later.",
        "For mental health or crisis support, contact qualified local services — Phingo cannot provide crisis help.",
      ],
    },
    {
      title: "Reporting issues",
      paragraphs: [
        "If you see harmful or incorrect content in a lesson, contact us via Support in Settings so we can improve content.",
      ],
    },
  ],
};
