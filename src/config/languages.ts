export interface LanguageDefinition {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  fontFamily?: string;
  supportedAsSource: boolean;
  supportedAsTarget: boolean;
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
  },
  es: {
    id: "es",
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    rtl: false,
    fontFamily: "DIN", // Default Latin font
    supportedAsSource: true,
    supportedAsTarget: false,
  },
  ru: {
    id: "ru",
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    rtl: false,
    fontFamily: "DIN",
    supportedAsSource: true,
    supportedAsTarget: false,
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
  },
  en: {
    id: "en",
    code: "en",
    name: "English",
    nativeName: "English",
    rtl: false,
    fontFamily: "DIN",
    supportedAsSource: true, // Let's support it as source just in case, but definitely target
    supportedAsTarget: true,
  },
};

export const SOURCE_LANGUAGES = Object.values(LANGUAGES).filter(l => l.supportedAsSource);
export const TARGET_LANGUAGES = Object.values(LANGUAGES).filter(l => l.supportedAsTarget);

export function getLanguage(code: string): LanguageDefinition | undefined {
  return LANGUAGES[code];
}
