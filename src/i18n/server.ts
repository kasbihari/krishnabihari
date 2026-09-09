/* Server-side i18n helpers for Astro pages (frontmatter / layouts). */
import { DEFAULT_LANG, LANG_COOKIE, getDict, isLang, type Lang } from './index';
import type { AstroCookies } from 'astro';

export function getLangFromCookies(cookies: AstroCookies): Lang {
  const raw = cookies.get(LANG_COOKIE)?.value;
  return isLang(raw) ? raw : DEFAULT_LANG;
}

export function localizedMeta(lang: Lang): { title: string; description: string } {
  const t = getDict(lang).meta;
  return { title: t.title, description: t.description };
}
