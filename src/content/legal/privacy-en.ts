import type { LegalDocument } from "./types";

export const privacyEn: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "May 27, 2026",
  sections: [
    {
      title: "Overview",
      paragraphs: [
        "Phingo English (“Phingo”, “we”, “our”) helps Kurdish speakers learn English. This policy explains what data the app uses on your device and when optional online features are enabled.",
        "Phingo is free to use. We do not sell your personal data.",
      ],
    },
    {
      title: "Data stored on your device",
      paragraphs: [
        "The app may store locally: learning progress (lessons completed, XP, streak), app language preference, Kurdish font choice, optional AI Teacher practice history, and settings such as haptics.",
        "This data stays on your phone unless you clear app storage or uninstall the app. We do not operate user accounts in this version.",
      ],
    },
    {
      title: "Microphone & speech",
      paragraphs: [
        "Speaking practice (lessons, Speak Up, AI Role Play, AI Teacher) may use the device microphone and on-device or OS speech recognition to transcribe your voice.",
        "Audio is used to provide practice feedback. We do not record or upload voice audio to our servers unless you connect a future cloud AI service and we update this policy.",
      ],
    },
    {
      title: "Optional online services",
      paragraphs: [
        "Lesson content is bundled in the app and works offline.",
        "If you configure an AI Teacher API URL (developer setting), typed or transcribed answers may be sent to that HTTPS endpoint for scoring. Only enable endpoints you trust.",
        "The app may load non-essential images from the internet (for example decorative avatars). No account is required.",
      ],
    },
    {
      title: "Children",
      paragraphs: [
        "Phingo is an education app suitable for learners of many ages. Parents or guardians should supervise younger children’s use of microphone and online features.",
      ],
    },
    {
      title: "Your choices",
      paragraphs: [
        "You can deny microphone permission; voice features will be limited.",
        "You can clear app data in system settings or uninstall to remove local storage.",
        "Contact us to ask questions about this policy (see Support in Settings).",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "We may update this policy when features change. The “Last updated” date at the top will change accordingly. Continued use after updates means you accept the revised policy.",
      ],
    },
  ],
};
