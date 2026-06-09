import type { AppLocale } from "../../i18n";
import { aiSafetyEn } from "./ai-safety-en";
import { aiSafetyKu } from "./ai-safety-ku";
import { privacyEn } from "./privacy-en";
import { privacyKu } from "./privacy-ku";
import { termsEn } from "./terms-en";
import { termsKu } from "./terms-ku";
import type { LegalDocument } from "./types";

export type LegalDocId = "privacy" | "ai-safety" | "terms";

const docs: Record<LegalDocId, Record<AppLocale, LegalDocument>> = {
  privacy: { en: privacyEn, ku: privacyKu },
  "ai-safety": { en: aiSafetyEn, ku: aiSafetyKu },
  terms: { en: termsEn, ku: termsKu },
};

export function getLegalDocument(
  id: LegalDocId,
  locale: AppLocale,
): LegalDocument {
  return docs[id][locale];
}
