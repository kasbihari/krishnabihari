import { useForm, ValidationError } from '@formspree/react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

const CONTACT_LINKS = [
  { label: 'GitHub', value: 'github.com/kasbihari', href: 'https://github.com/kasbihari', icon: Github },
  {
    label: 'LinkedIn',
    value: 'in/krishna-bihari',
    href: 'https://www.linkedin.com/in/krishna-bihari/',
    icon: Linkedin,
  },
  { label: 'Email', value: 'kas.bihari@gmail.com', href: 'mailto:kas.bihari@gmail.com', icon: Mail },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.9rem 1.1rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--line-soft)',
  background: 'var(--glass-1)',
  color: 'var(--text)',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-body)',
  transition: 'border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--text-faint)',
  marginBottom: '0.55rem',
};

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      {children}
      {error}
    </div>
  );
}

export default function Contact({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const c = t.contact;
  const [state, handleSubmit] = useForm('mbdwvkgq');

  return (
    <section id="contact" className="section-padding ct">
      <div className="container-main">
        {/* Header — centered on the axis */}
        <div className="ct-head">
          <p data-reveal className="section-label section-label--center">
            {c.label}
          </p>

          <h2 data-reveal data-delay="100" className="text-section-title ct-head__title">
            {c.headingPart1} <em className="ct-head__accent">{c.headingPart2}</em>
          </h2>

          <p data-reveal data-delay="200" className="ct-head__intro">
            {c.intro}
          </p>
        </div>

        <div className="ct-grid">
          {/* Sidebar details */}
          <div data-reveal className="ct-side">
            <div className="ct-available">
              <span className="ct-available__dot" />
              {c.available}
            </div>

            <p className="ct-response">
              <span aria-hidden="true">✓</span> {c.responseTime}
            </p>

            <div className="ct-links">
              {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  className="ct-link"
                >
                  <Icon size={16} strokeWidth={1.75} className="ct-link__icon" />
                  <span className="ct-link__value">{value}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div data-reveal data-delay="150">
            {state.succeeded ? (
              <div role="status" className="ct-success glass-2 radius-lg">
                <p className="ct-success__title">{c.successTitle}</p>
                <p className="ct-success__body">{c.successBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="ct-form radius-lg">
                <div className="ct-form__row">
                  <Field id="contact-name" label={c.name}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder={c.namePlaceholder}
                      style={inputStyle}
                    />
                  </Field>
                  <Field id="contact-email" label={c.email}>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder={c.emailPlaceholder}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <ValidationError prefix={c.name} field="name" errors={state.errors} />
                <ValidationError prefix={c.email} field="email" errors={state.errors} />

                <Field id="contact-message" label={c.message}>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    placeholder={c.messagePlaceholder}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '150px' }}
                  />
                </Field>

                <button type="submit" disabled={state.submitting} className="btn-primary ct-form__submit">
                  {state.submitting ? c.sending : c.send}
                  {!state.submitting && <ArrowRight size={16} strokeWidth={1.75} />}
                </button>

                <p className="ct-form__privacy">{c.privacy}</p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ct-head {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: clamp(3rem, 6vw, 4.5rem);
        }

        .ct-head__title {
          margin-top: 1.5rem;
          max-width: 24ch;
        }

        .ct-head__accent {
          font-style: italic;
          color: var(--text-faint);
        }

        .ct-head__intro {
          margin-top: 1.5rem;
          max-width: 58ch;
          font-size: var(--fs-lead);
          line-height: 1.75;
          color: var(--text-faint);
        }

        .ct-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
          max-width: 1040px;
          margin: 0 auto;
        }

        .ct-side {
          display: grid;
          gap: 1.1rem;
          align-content: start;
        }

        .ct-available {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          gap: 0.55rem;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--verde-ink);
          border: 1px solid color-mix(in srgb, var(--verde-ink) 30%, transparent);
          border-radius: var(--radius-pill);
          padding: 0.5rem 1rem;
        }

        .ct-available__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: ctPulse 3.4s var(--ease-inout) infinite;
        }

        @keyframes ctPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .ct-response {
          font-size: 0.9rem;
          color: var(--text-faint);
        }

        .ct-response span {
          color: var(--verde-ink);
        }

        .ct-links {
          display: grid;
          gap: 0.25rem;
          margin-top: 0.75rem;
        }

        .ct-link {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.7rem 0.25rem;
          border-bottom: 1px solid var(--line-soft);
          color: var(--text-soft);
          font-size: 0.92rem;
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out);
        }

        .ct-link:hover {
          color: var(--verde-ink);
          border-color: var(--glass-border-hover);
        }

        .ct-link__icon {
          color: var(--text-faint);
          flex-shrink: 0;
        }

        .ct-link__value {
          font-family: var(--font-mono);
          font-size: 0.82rem;
        }

        .ct-form {
          display: grid;
          gap: 1.4rem;
          padding: clamp(1.5rem, 3.5vw, 2.25rem);
          border: 1px solid var(--line-soft);
          background: var(--bg-soft);
        }

        .ct-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .ct-form__submit {
          justify-self: start;
        }

        .ct-form__privacy {
          font-size: 0.76rem;
          color: var(--text-faint);
        }

        .ct-success {
          padding: clamp(2.5rem, 6vw, 3.5rem) 2rem;
          text-align: center;
        }

        .ct-success__title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-style: italic;
          color: var(--text);
        }

        .ct-success__body {
          margin-top: 0.8rem;
          color: var(--text-faint);
        }

        @media (max-width: 860px) {
          .ct-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .ct-form__row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
