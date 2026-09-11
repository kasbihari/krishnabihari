/*
  Navigation.

  Simple by construction. In its resting state the header shows one thing: the
  brand mark, centred. There is no persistent link bar and no separate floating
  control cluster.

  Activating the mark expands the header into a single glass surface that holds
  everything — the four section links, the client portal and the language and
  theme pickers. The mark stays inside that surface, so the open state reads as
  one object rather than a logo plus a menu plus some stray buttons.

  The panel is a disclosure, not a modal: it does not lock the page, Escape
  closes it, an outside pointer press closes it, and `visibility: hidden` while
  collapsed keeps its controls out of the tab order.
*/
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../lib/client/i18n-store';
import type { Lang } from '../i18n';
import ThemeSwitcher from './ThemeSwitcher';
import LangSwitcher from './LangSwitcher';

/** Section order follows the page: story, trajectory, work, invitation. */
const LINKS = [
  { key: 'story', href: '#about' },
  { key: 'journey', href: '#journey' },
  { key: 'work', href: '#projects' },
  { key: 'contact', href: '#contact' },
] as const;

export default function Navbar({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const [open, setOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Escape closes, and returns nothing else to the page. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  /* A press anywhere outside the surface dismisses it. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const shell = shellRef.current;
      if (shell && !shell.contains(event.target as Node)) close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  /* Leaving the page open behind a cross-document navigation would flash the
     expanded surface on arrival, so collapse as soon as a link is taken. */
  useEffect(() => {
    if (!open) return;
    const onPageHide = () => setOpen(false);
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [open]);

  return (
    <header className="kb-nav">
      <div
        ref={shellRef}
        className="kb-nav__shell"
        data-open={open ? 'true' : 'false'}
      >
        <button
          type="button"
          className="kb-nav__mark"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="kb-nav-panel"
          aria-label={`Krishna Bihari — ${open ? t.nav.closeMenu : t.nav.openMenu}`}
        >
          {/* The supplied mark, used as authored. */}
          <img
            src="/images/logo-mark.svg"
            alt=""
            aria-hidden="true"
            className="kb-logo-mark kb-nav__logo"
            width="500"
            height="500"
            decoding="async"
          />
        </button>

        <div
          id="kb-nav-panel"
          className="kb-nav__panel"
          aria-hidden={!open}
          data-open={open ? 'true' : 'false'}
        >
          <div className="kb-nav__panel-inner">
            <nav aria-label="Primary" className="kb-nav__links">
              {LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="kb-nav__link"
                  onClick={close}
                >
                  {t.nav[link.key]}
                </a>
              ))}
            </nav>

            <div className="kb-nav__tools">
              <a href="/client" className="kb-nav__portal">
                {t.nav.clientPortal}
                <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
              </a>

              <div className="kb-nav__pickers">
                <ThemeSwitcher
                  ariaLabel={t.nav.switchTheme}
                  labels={{
                    light: t.nav.themeLight,
                    dark: t.nav.themeDark,
                    system: t.nav.themeSystem,
                  }}
                />
                <LangSwitcher
                  lang={initialLang}
                  ariaLabel={t.nav.switchLanguage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .kb-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-nav);
          display: flex;
          justify-content: center;
          padding: clamp(0.7rem, 2vw, 1.1rem) clamp(0.75rem, 4vw, 4rem);
          pointer-events: none;
        }

        /* ── The surface ──
           Transparent while collapsed — only the mark is visible. It becomes
           the glass surface the moment it opens, and the mark's own backing
           steps aside so there is exactly one plane. */
        .kb-nav__shell {
          pointer-events: auto;
          position: relative;
          width: 100%;
          max-width: 620px;
          border-radius: 22px;
          border: 1px solid transparent;
          background: transparent;
          transition:
            background var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            box-shadow var(--dur-base) var(--ease-out);
        }

        .kb-nav__shell[data-open='true'] {
          border-color: var(--glass-border);
          background: var(--glass-surface);
          -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
          backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
          box-shadow: var(--glass-inner), var(--glass-shadow);
        }

        /* Without blur support, translucency alone would let text bleed through. */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .kb-nav__shell[data-open='true'] {
            background: var(--surface-2);
          }
        }

        /* ── The mark ── */
        .kb-nav__mark {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          width: 56px;
          height: 56px;
          padding: 0;
          border-radius: var(--radius-pill);
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          -webkit-backdrop-filter: blur(var(--glass-blur-1));
          backdrop-filter: blur(var(--glass-blur-1));
          cursor: pointer;
          transition:
            background var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            transform var(--dur-base) var(--ease-out);
        }

        .kb-nav__mark:hover {
          border-color: var(--glass-border-hover);
          background: var(--glass-2);
        }

        .kb-nav__mark:active {
          transform: scale(0.97);
        }

        /* Open: the shell is the surface, so the mark's own backing goes. */
        .kb-nav__shell[data-open='true'] .kb-nav__mark {
          border-color: transparent;
          background: transparent;
          -webkit-backdrop-filter: none;
          backdrop-filter: none;
        }

        /*
          The artwork is generous with its own margin — the drawn mark occupies
          roughly two thirds of the viewBox — so the box is sized larger than
          the mark you actually see. A 46px box yields a mark of about 31px
          inside the 56px target, which is the usual proportion for a brand
          mark in a circular button, and it can never clip at any size because
          the image is contained rather than cropped.
        */
        .kb-nav__logo {
          --kb-logo-size: 46px;
        }

        /* ── The panel ── */
        .kb-nav__panel {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          visibility: hidden;
          transition:
            max-height var(--dur-base) var(--ease-out),
            opacity var(--dur-fast) var(--ease-out),
            visibility 0s linear var(--dur-base);
        }

        .kb-nav__panel[data-open='true'] {
          max-height: var(--kb-panel-max, 320px);
          opacity: 1;
          visibility: visible;
          transition:
            max-height var(--dur-slow) var(--ease-out),
            opacity var(--dur-base) var(--ease-out) 60ms,
            visibility 0s;
        }

        .kb-nav__panel-inner {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 0.35rem 0.9rem 0.9rem;
        }

        .kb-nav__links {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.15rem;
          padding-top: 0.35rem;
          border-top: 1px solid var(--line-soft);
        }

        .kb-nav__link {
          display: inline-flex;
          align-items: center;
          min-height: 40px;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: var(--text-soft);
          white-space: nowrap;
          transition:
            color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out);
        }

        .kb-nav__link:hover {
          color: var(--text);
          background: var(--glass-2);
        }

        .kb-nav__tools {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
          padding-top: 0.7rem;
          border-top: 1px solid var(--line-soft);
        }

        .kb-nav__portal {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          min-height: 40px;
          padding: 0 0.95rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--verde-ink);
          white-space: nowrap;
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out);
        }

        .kb-nav__portal:hover {
          color: var(--text);
          border-color: var(--glass-border-hover);
          background: var(--glass-2);
        }

        .kb-nav__pickers {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        /* ── Narrow viewports ──
           One column, everything reachable with a thumb, no horizontal
           overflow: the panel grows taller instead of wider. */
        @media (max-width: 560px) {
          .kb-nav__shell {
            --kb-panel-max: 520px;
          }

          .kb-nav__panel-inner {
            padding: 0.35rem 0.75rem 0.85rem;
          }

          .kb-nav__links {
            flex-direction: column;
            align-items: stretch;
          }

          .kb-nav__link {
            justify-content: center;
            font-size: 0.82rem;
          }

          .kb-nav__tools {
            justify-content: center;
          }

          .kb-nav__portal {
            justify-content: center;
            width: 100%;
          }

          .kb-nav__pickers {
            justify-content: center;
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .kb-nav__panel,
          .kb-nav__panel[data-open='true'] {
            transition: none;
          }
        }
      `}</style>
    </header>
  );
}
