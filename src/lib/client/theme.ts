/*
  Centralised theme state for the whole site.

  There is exactly one theme system. Every route (/, /client, /admin) renders
  the same `HeadMeta` bootstrap, reads the same storage key and drives the same
  `data-theme` attribute, so the theme a visitor picks on one route is the
  theme they get on the next.

  Three modes are supported:
    light  — pinned light
    dark   — pinned dark
    system — follows the operating system through prefers-color-scheme, and
             keeps following it while the page stays open

  `system` is the default when nothing has been stored, which means "respect
  the visitor's device" out of the box.
*/

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'kb-theme';
export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

const DARK_QUERY = '(prefers-color-scheme: dark)';

type Listener = () => void;

let currentMode: ThemeMode = DEFAULT_THEME_MODE;
const listeners = new Set<Listener>();

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    value === 'light' || value === 'dark' || value === 'system'
  );
}

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

/**
 * The stored mode, or `system` when the visitor has never chosen.
 * Values written by earlier builds are still valid, so an existing visitor
 * keeps the theme they had.
 */
export function readStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_THEME_MODE;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(raw) ? raw : DEFAULT_THEME_MODE;
  } catch {
    /* private mode / storage disabled — fall back to following the OS */
    return DEFAULT_THEME_MODE;
  }
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === 'system' ? systemTheme() : mode;
}

export function getThemeMode(): ThemeMode {
  return currentMode;
}

export function getResolvedTheme(): ResolvedTheme {
  return resolveTheme(currentMode);
}

export function subscribeTheme(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function notify() {
  listeners.forEach((fn) => fn());
}

function paint(mode: ThemeMode, animate: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const resolved = resolveTheme(mode);

  /*
    The transition class is added around the swap so colours cross-fade, then
    removed again. It is skipped for the very first paint, where a fade would
    read as a flash of the wrong theme.
  */
  if (animate) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 560);
  }

  root.setAttribute('data-theme', resolved);
  /* Lets the markup advertise what the visitor actually chose. */
  root.setAttribute('data-theme-mode', mode);
}

/* ──────────────────────────────────────────────────────────────
   React entry points
   ────────────────────────────────────────────────────────────── */

/**
 * Adopt the persisted mode and keep `system` live.
 *
 * Returns a teardown function. Only the resolved theme is written to the DOM;
 * the stored mode is the source of truth.
 */
export function initTheme(): () => void {
  if (typeof window === 'undefined') return () => {};

  currentMode = readStoredThemeMode();
  paint(currentMode, false);

  const media =
    typeof window.matchMedia === 'function'
      ? window.matchMedia(DARK_QUERY)
      : null;

  const onSystemChange = () => {
    /* Only an un-pinned theme follows the OS. */
    if (currentMode !== 'system') return;
    paint(currentMode, true);
    notify();
  };

  media?.addEventListener('change', onSystemChange);

  return () => {
    media?.removeEventListener('change', onSystemChange);
  };
}

export function setThemeMode(mode: ThemeMode, animate = true) {
  currentMode = mode;

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* The theme still applies for this session. */
    }
  }

  paint(mode, animate);
  notify();
}
