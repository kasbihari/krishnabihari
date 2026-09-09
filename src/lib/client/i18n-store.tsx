/* Client-side language state: a tiny store so every mounted island stays in
   sync when the visitor switches language (no context tree needed across
   islands). The initial server-rendered language is passed in as a prop and
   the store keeps later switches consistent. */
import { useEffect, useState } from 'react';
import {
  DEFAULT_LANG,
  LANG_COOKIE,
  getDict,
  isLang,
  type Lang,
  type TranslationDict,
} from '../../i18n';

type Listener = () => void;

let currentLang: Lang = DEFAULT_LANG;
const listeners = new Set<Listener>();

function readCookie(): Lang {
  if (typeof document === 'undefined') return DEFAULT_LANG;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LANG_COOKIE}=`));
  const value = match?.split('=')[1];
  return isLang(value) ? value : DEFAULT_LANG;
}

if (typeof document !== 'undefined') {
  currentLang = readCookie();
}

function notify() {
  listeners.forEach((fn) => fn());
}

export function getClientLang(): Lang {
  return currentLang;
}

export function subscribeLang(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setClientLang(lang: Lang) {
  currentLang = lang;
  if (typeof document !== 'undefined') {
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = lang;
  }
  notify();
}

/**
 * React hook for translated copy.
 * `initialLang` is the server-rendered language (read from the cookie in the
 * Astro frontmatter) so hydration never mismatches. Once mounted, switching
 * language updates every subscribed island through the store.
 */
export function useI18n(initialLang: Lang = DEFAULT_LANG): {
  lang: Lang;
  t: TranslationDict;
  setLang: (lang: Lang) => void;
} {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    // A later-mounted island must adopt the language that is already active.
    setLangState(currentLang);
    return subscribeLang(() => setLangState(currentLang));
  }, []);

  return {
    lang,
    t: getDict(lang),
    setLang: (next: Lang) => {
      if (next === lang) return;
      setLangState(next);
      setClientLang(next);
    },
  };
}
