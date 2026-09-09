import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { useI18n } from '../lib/client/i18n-store';
import type { Lang } from '../i18n';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/kasbihari', icon: Github },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/krishna-bihari-0811a7299',
    icon: Linkedin,
  },
  { label: 'Email', href: 'mailto:kas.bihari@gmail.com', icon: Mail },
] as const;

export default function Footer({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--line-soft)',
        background: 'color-mix(in srgb, var(--bg-soft) 60%, transparent)',
        padding: '4.5rem 0 2.5rem',
        position: 'relative',
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2.5rem',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3.5rem',
          }}
        >
          <div>
            <p className="font-name" style={{ fontSize: '2.4rem', color: 'var(--text)', lineHeight: 1.1 }}>
              Krishna Bihari
            </p>
            <p
              style={{
                marginTop: '0.6rem',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
              }}
            >
              {t.footer.role}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                aria-label={label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  border: '1px solid var(--line)',
                  color: 'var(--text-soft)',
                  transition: 'color 0.3s, border-color 0.3s, background 0.3s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--pine-ink)';
                  e.currentTarget.style.borderColor = 'var(--pine-ink)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-soft)';
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <Icon size={17} strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--line-soft)',
            paddingTop: '1.6rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
            © {year} Krishna Bihari. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
            {t.footer.builtWith}
          </p>
          <a
            href="#home"
            aria-label="Back to top"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-soft)',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pine-ink)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-soft)')}
          >
            Back to top
            <ArrowUp size={14} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
