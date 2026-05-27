import { en, type TranslationKey } from "./locales/en";
import { ku } from "./locales/ku";

export type AppLocale = "en" | "ku";

const catalogs = {
  en,
  ku,
} satisfies Record<AppLocale, TranslationKey>;

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        : Prefix extends ""
          ? K
          : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

export type I18nKey = NestedKeyOf<TranslationKey>;

function resolve(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function translate(locale: AppLocale, key: I18nKey): string {
  const value = resolve(catalogs[locale] as unknown as Record<string, unknown>, key);
  if (value) return value;
  return resolve(en as unknown as Record<string, unknown>, key) ?? key;
}

export { en, ku };
