import type { LegalDocument } from "./types";

export const privacyEn: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "August 10, 2026",
  sections: [
    {
      title: "Overview",
      paragraphs: [
        "Twino English (“Twino”, “we”, “our”) helps Kurdish speakers learn English. This policy explains the data used on your device and by optional account, cloud-sync, and AI features.",
        "Core lessons remain available without a paid plan. We do not sell personal data or use it for advertising.",
      ],
    },
    {
      title: "Data stored on your device",
      paragraphs: [
        "The app stores learning progress, XP, streak, language, the bundled Rabar 044 font setting, AI practice history, and app settings on your device.",
        "If you create an account, Twino uses Supabase to store your email address, profile, preferences, avatar choice, and learning progress so they can sync across sessions. Authentication tokens are stored in the device's protected credential storage on iOS and Android.",
        "If you choose a photo while signed in, Twino uploads it to Supabase Storage as your public profile image. Anyone with its public URL can view it. You can use a bundled avatar instead; replacing the photo overwrites the prior upload, and deleting your account removes the uploaded photo. A guest photo stays only on that device.",
      ],
    },
    {
      title: "Microphone & speech",
      paragraphs: [
        "Speaking practice uses the microphone and may use device speech recognition or cloud AI to transcribe and evaluate your voice.",
        "When you use a Gemini-powered speech feature, the recorded audio, requested phrase, and related prompt are sent to Google Gemini for processing. Audio is used to return the requested learning feedback and is not used by Twino for advertising.",
      ],
    },
    {
      title: "Optional online services",
      paragraphs: [
        "Core lesson content is bundled in the app and can be used without an account. Account sync requires an internet connection. Cloud AI features require both an internet connection and a signed-in account so Twino can protect the service from abuse.",
        "Typed answers, transcripts, prompts, and voice audio may be processed by Google Gemini when you choose an AI feature. Account and synced learning data are processed by Supabase.",
        "For each cloud AI request, Twino stores the feature, Gemini model, token and audio usage, estimated provider cost, credits charged, account identifier, and timestamp in Supabase for billing reconciliation, abuse prevention, and cost analysis.",
        "The app may load non-essential images from public internet storage. When you choose an optional web purchase, Twino stores the product, amount, currency, provider payment reference, payment status, and resulting credits or plan. The hosted payment provider handles your payment details; Twino does not store full card or wallet credentials.",
      ],
    },
    {
      title: "Children",
      paragraphs: [
        "Twino is an education app for learners of different ages. A parent or guardian should supervise younger learners and decide whether they may create an account or use microphone and cloud AI features.",
      ],
    },
    {
      title: "Your choices",
      paragraphs: [
        "You can deny microphone permission and continue using non-voice lessons. You can also use core lessons without creating an account.",
        "You can permanently delete your Twino account and synced data in Settings → Your Account → Delete Account. You can clear remaining local app data through system settings or by uninstalling the app. If the in-app option is unavailable, contact support@twino.app from the account email address.",
        "For privacy questions or data requests, contact support@twino.app.",
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
