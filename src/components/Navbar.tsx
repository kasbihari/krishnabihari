import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useI18n } from '../lib/client/i18n-store';
import { LANG_NAMES, LANGUAGES, type Lang } from '../i18n';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { key: 'story', href: '#about' },
  { key: 'journey', href: '#journey' },
  { key: 'work', href: '#projects' },
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

  return (
    <header
      className="kb-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        borderBottom: '1px solid var(--line-soft)',
        background: scrolled
          ? 'color-mix(in srgb, var(--surface) 82%, transparent)'
          : 'transparent',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <nav
        aria-label="Primary"
        className="container-main"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          height: '72px',
        }}
      >
        {/* Wordmark */}
        <a
          href="#home"
          aria-label="Krishna Bihari — home"
          className="font-name"
          style={{
            fontSize: '1.45rem',
            lineHeight: 1,
            color: 'var(--text)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          Krishna Bihari
        </a>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.2rem',
          }}
        >
          <div
            className="kb-nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.9rem',
            }}
          >
            {LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-soft)',
                  padding: '0.35rem 0',
                  borderBottom: '1px solid transparent',
                  transition: 'color 0.25s, border-color 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.borderColor = 'var(--pine-ink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-soft)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {linkLabel(link.key)}
              </a>
            ))}
          </div>

          <a
            href="/client"
            className="kb-nav-portal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.76rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--pine-ink)',
              border: '1px solid var(--pine-ink)',
              borderRadius: '2px',
              padding: '0.5rem 0.95rem',
              whiteSpace: 'nowrap',
              transition: 'background 0.3s, color 0.3s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--pine-deep)';
              e.currentTarget.style.color = 'var(--on-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--pine-ink)';
            }}
          >
            {t.nav.clientPortal}
            <ArrowUpRight size={13} strokeWidth={2} />
          </a>

          {/* Language + theme */}
          <div
            className="kb-nav-tools"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}
          >
            <div
              role="group"
              aria-label={t.nav.switchLanguage}
              style={{
                display: 'flex',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              {LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    letterSpacing: '0.06em',
                    padding: '0.42rem 0.6rem',
                    border: 'none',
                    background: lang === code ? 'var(--pine-deep)' : 'transparent',
                    color: lang === code ? 'var(--on-accent)' : 'var(--text-faint)',
                    cursor: 'pointer',
                    transition: 'background 0.25s, color 0.25s',
                  }}
                >
                  {LANG_NAMES[code]}
                </button>
              ))}
            </div>
            <ThemeToggle ariaLabel={t.nav.switchTheme} />
          </div>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          className="kb-nav-burger"
          onClick={() => setOpen(true)}
          aria-label={t.nav.openMenu}
          style={{
            display: 'none',
            width: 38,
            height: 38,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            color: 'var(--text-soft)',
            cursor: 'pointer',
          }}
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 1.5rem 2.5rem',
            animation: 'kbMenuIn 0.35s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span className="font-name" style={{ fontSize: '1.4rem', color: 'var(--text)' }}>
              Krishna Bihari
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.nav.closeMenu}
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--text-soft)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>

          <nav
            aria-label="Menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              marginTop: '3rem',
            }}
          >
            {LINKS.map((link, i) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display"
                style={{
                  fontSize: 'clamp(2rem, 9vw, 3rem)',
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  padding: '0.35rem 0',
                  borderBottom: '1px solid var(--line-soft)',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  animation: `kbItemIn 0.4s cubic-bezier(0.16,1,0.3,1) ${0.06 + i * 0.07}s both`,
                }}
              >
                {linkLabel(link.key)}
                <ArrowUpRight size={20} strokeWidth={1.5} style={{ color: 'var(--pine-ink)' }} />
              </a>
            ))}
          </nav>

          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              role="group"
              aria-label={t.nav.switchLanguage}
              style={{
                display: 'flex',
                border: '1px solid var(--line)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              {LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    padding: '0.5rem 0.85rem',
                    border: 'none',
                    background: lang === code ? 'var(--pine-deep)' : 'transparent',
                    color: lang === code ? 'var(--on-accent)' : 'var(--text-faint)',
                    cursor: 'pointer',
                  }}
                >
                  {LANG_NAMES[code]}
                </button>
              ))}
            </div>
            <ThemeToggle ariaLabel={t.nav.switchTheme} />
            <a
              href="/client"
              onClick={() => setOpen(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--pine-ink)',
                border: '1px solid var(--pine-ink)',
                borderRadius: '2px',
                padding: '0.6rem 1.1rem',
              }}
            >
              {t.nav.clientPortal}
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </div>

          <style>{`
            @keyframes kbMenuIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes kbItemIn {
              from { opacity: 0; transform: translateY(18px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .kb-nav-links, .kb-nav-portal, .kb-nav-tools {
            display: none !important;
          }
          .kb-nav-burger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
