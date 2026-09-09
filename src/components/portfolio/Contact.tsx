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
  padding: '0.85rem 1.05rem',
  borderRadius: '4px',
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-body)',
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-faint)',
  marginBottom: '0.5rem',
};

function Field({ id, label, error, children }: { id: string; label: string; error?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
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
    <section id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-main">
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <p data-reveal className="section-label">
            <span style={{ width: 26, height: 1, background: 'var(--sand)', display: 'inline-block' }} />
            {c.label}
          </p>
          <h2 data-reveal data-delay="100" className="text-section-title" style={{ maxWidth: '760px' }}>
            {c.headingPart1}{' '}
            <em style={{ color: 'var(--pine-ink)', fontStyle: 'italic' }}>{c.headingPart2}</em>
          </h2>
          <p data-reveal data-delay="200" className="text-body-lg" style={{ marginTop: '1.4rem', maxWidth: '600px' }}>
            {c.intro}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Sidebar details */}
          <div data-reveal style={{ display: 'grid', gap: '1.1rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--pine-ink)',
                border: '1px solid var(--pine-ink)',
                borderRadius: '999px',
                padding: '0.5rem 1rem',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: 'var(--pine-ink)',
                  display: 'inline-block',
                }}
              />
              {c.available}
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-soft)' }}>
              <span style={{ color: 'var(--pine-ink)' }}>✓</span> {c.responseTime}
            </p>

            <div style={{ display: 'grid', gap: '0.25rem', marginTop: '0.75rem' }}>
              {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.65rem 0.25rem',
                    borderBottom: '1px solid var(--line-soft)',
                    color: 'var(--text-soft)',
                    fontSize: '0.92rem',
                    transition: 'color 0.25s, border-color 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--pine-ink)';
                    e.currentTarget.style.borderColor = 'var(--pine-ink)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-soft)';
                    e.currentTarget.style.borderColor = 'var(--line-soft)';
                  }}
                >
                  <Icon size={16} strokeWidth={1.75} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>{value}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div data-reveal data-delay="150">
            {state.succeeded ? (
              <div
                role="status"
                style={{
                  border: '1px solid var(--pine-ink)',
                  borderRadius: '8px',
                  background: 'color-mix(in srgb, var(--pine-ink) 7%, var(--surface))',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                }}
              >
                <p className="font-display" style={{ fontSize: '1.8rem', fontStyle: 'italic', color: 'var(--text)' }}>
                  {c.successTitle}
                </p>
                <p style={{ marginTop: '0.7rem', color: 'var(--text-soft)' }}>{c.successBody}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: 'grid',
                  gap: '1.4rem',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  padding: '2.2rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
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

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="btn-primary"
                  style={{ justifySelf: 'start' }}
                >
                  {state.submitting ? c.sending : c.send}
                  {!state.submitting && <ArrowRight size={16} strokeWidth={1.75} />}
                </button>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>{c.privacy}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
