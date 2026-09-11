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

const NAV = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export default function Footer({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const year = new Date().getFullYear();

  return (
    <footer className="kb-footer">
      <div className="container-main kb-footer__inner">
        <p className="font-name--bounded kb-footer__mark">Krishna Bihari</p>
        <p className="kb-footer__role">{t.footer.role}</p>

        <nav aria-label="Footer" className="kb-footer__nav">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className="kb-footer__link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="kb-footer__socials">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
              aria-label={label}
              className="kb-footer__social"
            >
              <Icon size={16} strokeWidth={1.6} />
            </a>
          ))}
        </div>

        <a href="#home" className="kb-footer__top">
          Back to top
          <ArrowUp size={13} strokeWidth={1.7} />
        </a>

        <div className="kb-footer__base">
          <p>© {year} Krishna Bihari</p>
          <span aria-hidden="true" className="kb-footer__dot" />
          <p>{t.footer.builtWith}</p>
        </div>
      </div>

      <style>{`
        .kb-footer {
          position: relative;
          padding: var(--section-y-tight) 0 2.5rem;
          border-top: 1px solid var(--line-soft);
        }

        .kb-footer__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .kb-footer__mark {
          font-size: clamp(1.9rem, 5.5vw, 2.9rem);
          color: var(--text);
        }

        .kb-footer__role {
          margin-top: 0.7rem;
          font-size: 0.74rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        .kb-footer__nav {
          display: flex;
          align-items: center;
          gap: 1.9rem;
          margin-top: 2.6rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .kb-footer__link {
          font-size: 0.74rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-faint);
          transition: color var(--dur-base) var(--ease-out);
        }

        .kb-footer__link:hover {
          color: var(--text);
        }

        .kb-footer__socials {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 2.2rem;
        }

        .kb-footer__social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line-soft);
          background: transparent;
          color: var(--text-faint);
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out),
            transform var(--dur-base) var(--ease-out);
        }

        .kb-footer__social:hover {
          color: var(--text);
          border-color: var(--glass-border-hover);
          background: var(--glass-2);
          transform: translateY(-2px);
        }

        .kb-footer__top {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-top: 2.6rem;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-faint);
          transition: color var(--dur-base) var(--ease-out);
        }

        .kb-footer__top:hover {
          color: var(--verde-ink);
        }

        .kb-footer__base {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          flex-wrap: wrap;
          margin-top: 3.4rem;
          padding-top: 1.8rem;
          border-top: 1px solid var(--line-soft);
          width: 100%;
          font-size: 0.76rem;
          color: var(--text-faint);
        }

        .kb-footer__dot {
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.5;
        }

        @media (max-width: 640px) {
          .kb-footer__nav {
            gap: 1.4rem;
          }
          .kb-footer__base {
            gap: 0.6rem;
          }
        }
      `}</style>
    </footer>
  );
}
