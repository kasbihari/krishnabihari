import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useI18n } from '../lib/client/i18n-store';
import { LANG_NAMES, LANGUAGES, type Lang } from '../i18n';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { key: 'work', href: '#projects' },
  { key: 'story', href: '#about' },
  { key: 'journey', href: '#journey' },
  { key: 'contact', href: '#contact' },
] as const;

export default function Navbar({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { lang, t, setLang } = useI18n(initialLang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkLabel = (key: (typeof LINKS)[number]['key']) => t.nav[key];

  const navLinkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.72rem',
    fontWeight: 500,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
    padding: '0.3rem 0',
    whiteSpace: 'nowrap',
    transition: 'color var(--dur-base) var(--ease-out)',
  };

  return (
    <header className="kb-nav" data-scrolled={scrolled ? 'true' : 'false'}>
      <div className="kb-nav__bar">
        <nav aria-label="Primary" className="kb-nav__inner">
          {/* Left cluster — desktop links */}
          <div className="kb-nav__side kb-nav__side--left">
            {LINKS.slice(0, 2).map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="kb-nav__link"
                style={navLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                {linkLabel(link.key)}
              </a>
            ))}
          </div>

          {/* Center — the name, always Amsterdam Four */}
          <a href="#home" aria-label="Krishna Bihari — home" className="kb-nav__mark font-name--bounded">
            Krishna Bihari
          </a>

          {/* Right cluster — desktop links + tools */}
          <div className="kb-nav__side kb-nav__side--right">
            {LINKS.slice(2).map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="kb-nav__link"
                style={navLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                {linkLabel(link.key)}
              </a>
            ))}

            <a href="/client" className="kb-nav__portal">
              {t.nav.clientPortal}
              <ArrowUpRight size={12} strokeWidth={2} />
            </a>

            <div className="kb-nav__tools">
              <div role="group" aria-label={t.nav.switchLanguage} className="kb-nav__langs">
                {LANGUAGES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className="kb-nav__lang"
                    data-active={lang === code ? 'true' : 'false'}
                  >
                    {LANG_NAMES[code]}
                  </button>
                ))}
              </div>
              <ThemeToggle ariaLabel={t.nav.switchTheme} />
            </div>
          </div>

          {/* Mobile — mark + burger */}
          <a href="#home" aria-label="Krishna Bihari — home" className="kb-nav__mark-mobile font-name--bounded">
            Krishna Bihari
          </a>
          <button
            type="button"
            className="kb-nav__burger"
            onClick={() => setOpen(true)}
            aria-label={t.nav.openMenu}
          >
            <Menu size={17} strokeWidth={1.6} />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="kb-menu">
          <div className="kb-menu__top">
            <span className="font-name--bounded kb-menu__mark">
              Krishna Bihari
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.nav.closeMenu}
              className="kb-menu__close"
            >
              <X size={17} strokeWidth={1.6} />
            </button>
          </div>

          <nav aria-label="Menu" className="kb-menu__nav">
            {LINKS.map((link, i) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display kb-menu__link"
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              >
                {linkLabel(link.key)}
                <ArrowUpRight size={18} strokeWidth={1.4} style={{ color: 'var(--verde-ink)' }} />
              </a>
            ))}
          </nav>

          <div className="kb-menu__foot">
            <div role="group" aria-label={t.nav.switchLanguage} className="kb-nav__langs">
              {LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className="kb-nav__lang kb-nav__lang--lg"
                  data-active={lang === code ? 'true' : 'false'}
                >
                  {LANG_NAMES[code]}
                </button>
              ))}
            </div>
            <div className="kb-menu__foot-row">
              <ThemeToggle ariaLabel={t.nav.switchTheme} />
              <a href="/client" onClick={() => setOpen(false)} className="kb-menu__portal">
                {t.nav.clientPortal}
                <ArrowUpRight size={13} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .kb-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-nav);
          padding: 0.85rem var(--container-pad);
          pointer-events: none;
          transition: padding var(--dur-slow) var(--ease-out);
        }

        .kb-nav__bar {
          max-width: var(--container-wide);
          margin: 0 auto;
          border-radius: var(--radius-pill);
          border: 1px solid transparent;
          background: transparent;
          transition:
            background var(--dur-slow) var(--ease-out),
            border-color var(--dur-slow) var(--ease-out),
            box-shadow var(--dur-slow) var(--ease-out),
            backdrop-filter var(--dur-slow) var(--ease-out);
        }

        .kb-nav[data-scrolled='true'] .kb-nav__bar {
          border-color: var(--glass-border);
          background: var(--glass-2);
          -webkit-backdrop-filter: blur(var(--glass-blur-2)) saturate(var(--glass-sat));
          backdrop-filter: blur(var(--glass-blur-2)) saturate(var(--glass-sat));
          box-shadow: var(--glass-inner), 0 18px 44px -30px rgba(0, 0, 0, 0.8);
        }

        .kb-nav__inner {
          pointer-events: auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1.5rem;
          height: 58px;
          padding: 0 1.4rem;
        }

        .kb-nav__side {
          display: flex;
          align-items: center;
          gap: 1.7rem;
        }

        .kb-nav__side--right {
          justify-content: flex-end;
          gap: 1.4rem;
        }

        .kb-nav__mark {
          font-size: 1.2rem;
          color: var(--text);
          letter-spacing: 0.015em;
          white-space: nowrap;
          transition: opacity var(--dur-base) var(--ease-out);
        }

        .kb-nav__mark:hover {
          opacity: 0.75;
        }

        .kb-nav__portal {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--verde-ink);
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          border-radius: var(--radius-pill);
          padding: 0.42rem 0.9rem;
          white-space: nowrap;
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out);
        }

        .kb-nav__portal:hover {
          color: var(--text);
          border-color: var(--glass-border-hover);
          background: var(--glass-3);
        }

        .kb-nav__tools {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Language switching reads as text, not as another button group. */
        .kb-nav__langs {
          display: flex;
          align-items: center;
          gap: 0.1rem;
        }

        .kb-nav__lang {
          position: relative;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.06em;
          padding: 0.42rem 0.45rem 0.6rem;
          border: none;
          background: transparent;
          color: var(--text-faint);
          cursor: pointer;
          transition: color var(--dur-base) var(--ease-out);
        }

        .kb-nav__lang[data-active='true'] {
          color: var(--text);
        }

        .kb-nav__lang[data-active='true']::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0.22rem;
          width: 3px;
          height: 3px;
          margin-left: -1.5px;
          border-radius: 50%;
          background: var(--verde-ink);
        }

        .kb-nav__lang:hover[data-active='false'] {
          color: var(--text-soft);
        }

        .kb-nav__lang--lg {
          font-size: 0.72rem;
          padding: 0.5rem 0.7rem 0.7rem;
        }

        .kb-nav__mark-mobile,
        .kb-nav__burger {
          display: none;
        }

        .kb-nav__burger {
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-pill);
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          color: var(--text-soft);
          cursor: pointer;
        }

        /* ── Mobile menu ── */
        .kb-menu {
          position: fixed;
          inset: 0;
          z-index: var(--z-overlay);
          background: var(--bg);
          display: flex;
          flex-direction: column;
          padding: 1.4rem var(--container-pad) 2.2rem;
          animation: kbMenuIn 0.32s var(--ease-out);
          pointer-events: auto;
        }

        .kb-menu__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kb-menu__mark {
          font-size: 1.3rem;
          color: var(--text);
        }

        .kb-menu__close {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          color: var(--text-soft);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .kb-menu__nav {
          display: flex;
          flex-direction: column;
          margin-top: 3rem;
        }

        .kb-menu__link {
          font-size: clamp(1.9rem, 8.5vw, 2.8rem);
          font-style: italic;
          color: var(--text);
          padding: 0.7rem 0;
          border-bottom: 1px solid var(--line-soft);
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          animation: kbItemIn 0.42s var(--ease-out) both;
        }

        .kb-menu__foot {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .kb-menu__foot-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .kb-menu__portal {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--verde-ink);
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          border-radius: var(--radius-pill);
          padding: 0.6rem 1.1rem;
        }

        @keyframes kbMenuIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes kbItemIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1080px) {
          .kb-nav__side--left,
          .kb-nav__side--right {
            display: none;
          }
          .kb-nav__inner {
            grid-template-columns: 1fr auto;
            padding: 0 1.1rem;
          }
          .kb-nav__mark {
            display: none;
          }
          .kb-nav__mark-mobile {
            display: block;
            font-size: 1.18rem;
            color: var(--text);
          }
          .kb-nav__burger {
            display: inline-flex;
          }
        }

        @media (max-width: 420px) {
          .kb-nav__mark-mobile {
            font-size: 1.02rem;
          }
        }
      `}</style>
    </header>
  );
}
