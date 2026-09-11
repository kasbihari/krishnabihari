/*
  Theme selector: light / dark / system.

  Reads and writes the single theme store in `lib/client/theme`. The store —
  not this component — owns the decision, so the choice made here is the same
  choice the next route renders, and `system` genuinely returns the site to
  the operating system's preference.

  Styling comes from the shared `.kb-seg` segmented control in global.css.
*/
import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import {
  THEME_MODES,
  getThemeMode,
  initTheme,
  setThemeMode,
  subscribeTheme,
  type ThemeMode,
} from '../lib/client/theme';

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

type Props = {
  ariaLabel: string;
  labels: Record<ThemeMode, string>;
  /** `sm` sits inside dense toolbars, `md` inside the navigation surface. */
  size?: 'sm' | 'md';
};

export default function ThemeSwitcher({ ariaLabel, labels, size = 'md' }: Props) {
  /*
    Starts on `system` on both the server and the first client render so
    hydration always matches; the effect below adopts whatever is stored.
  */
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const teardown = initTheme();
    setMode(getThemeMode());
    const unsubscribe = subscribeTheme(() => setMode(getThemeMode()));
    return () => {
      unsubscribe();
      teardown();
    };
  }, []);

  return (
    <div role="group" aria-label={ariaLabel} className="kb-seg" data-size={size}>
      {THEME_MODES.map((value) => {
        const Icon = MODE_ICONS[value];
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setThemeMode(value)}
            aria-pressed={active}
            data-active={active ? 'true' : 'false'}
            title={labels[value]}
            className="kb-seg__item kb-seg__item--icon"
          >
            <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
            <span className="kb-sr-only">{labels[value]}</span>
          </button>
        );
      })}
    </div>
  );
}
