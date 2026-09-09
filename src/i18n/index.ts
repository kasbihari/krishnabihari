import { en, type Dict, type Lang, type TranslationDict } from './en';
import { nl } from './nl';
import { es } from './es';

export type { Dict, Lang, TranslationDict };

export const LANGUAGES: readonly Lang[] = ['en', 'nl', 'es'];
export const DEFAULT_LANG: Lang = 'en';
export const LANG_COOKIE = 'kb_lang';
export const LANG_NAMES: Record<Lang, string> = {
  en: 'EN',
  nl: 'NL',
  es: 'ES',
};

export const dictionaries: Record<Lang, TranslationDict> = { en, nl, es };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && LANGUAGES.includes(value as Lang);
}

export function getDict(lang: Lang): TranslationDict {
  return dictionaries[lang] ?? en;
}
