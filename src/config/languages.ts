export interface LanguageDefinition {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  fontFamily?: string;
  supportedAsSource: boolean;
  supportedAsTarget: boolean;
  curriculumReady: boolean;
}

export const LANGUAGES: Record<string, LanguageDefinition> = {
  ku: {
    id: "ku",
    code: "ku",
    name: "Kurdish",
    nativeName: "کوردی",
    rtl: true,
    fontFamily: "Rabar",
    supportedAsSource: true,
    supportedAsTarget: false,
    curriculumReady: false,
  },
  es: {
    id: "es",
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    rtl: false,
    fontFamily: "DIN", // Default Latin font
    // UI shell only. Do not expose until a complete published curriculum pack exists.
    supportedAsSource: false,
    supportedAsTarget: false,
    curriculumReady: false,
  },
  ru: {
    id: "ru",
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    rtl: false,
    fontFamily: "DIN",
    // Full Russian curriculum is served from published editable database packs.
    supportedAsSource: false,
    supportedAsTarget: true,
    curriculumReady: true,
  },
  ar: {
    id: "ar",
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    rtl: true,
    fontFamily: "Rabar", // Assuming Rabar supports Arabic well enough for now
    supportedAsSource: true,
    supportedAsTarget: true,
    curriculumReady: true,
  },
  en: {
    id: "en",
    code: "en",
    name: "English",
    nativeName: "English",
    rtl: false,
    fontFamily: "DIN",
    supportedAsSource: false,
    supportedAsTarget: true,
    curriculumReady: true,
  },
};

export const SOURCE_LANGUAGES = Object.values(LANGUAGES).filter(l => l.supportedAsSource);
export const TARGET_LANGUAGES = Object.values(LANGUAGES).filter(l => l.supportedAsTarget);
/** Target languages shown in product surfaces; lesson readiness is enforced by the curriculum loader. */
export const TARGET_LANGUAGE_CATALOG = [LANGUAGES.en, LANGUAGES.ar, LANGUAGES.ru];
export const UI_LANGUAGES = [LANGUAGES.ku, LANGUAGES.ar, LANGUAGES.en];

export const SUPPORTED_LANGUAGE_PAIRS = [
  { source: "ku", target: "en" },
  { source: "ku", target: "ar" },
  { source: "ku", target: "ru" },
  { source: "ar", target: "en" },
  { source: "ar", target: "ru" },
] as const;

export function isSupportedLanguagePair(source: string, target: string): boolean {
  return SUPPORTED_LANGUAGE_PAIRS.some(
    (pair) => pair.source === source && pair.target === target,
  );
}

export function getTargetLanguagesForSource(source: string): LanguageDefinition[] {
  const targets = new Set<string>(
    SUPPORTED_LANGUAGE_PAIRS
      .filter((pair) => pair.source === source)
      .map((pair) => pair.target),
  );
  return TARGET_LANGUAGES.filter((language) => targets.has(language.id));
}

export function getLanguage(code: string): LanguageDefinition | undefined {
  const normalized = code.trim().replace(/_/g, "-");
  return LANGUAGES[normalized] ?? LANGUAGES[normalized.split("-")[0].toLowerCase()];
}
