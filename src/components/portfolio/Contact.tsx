import { useRef, useState, type FormEvent } from 'react';
import { useForm } from '@formspree/react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang, TranslationDict } from '../../i18n';

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

const PROJECT_TYPE_OPTIONS = [
  'freelance',
  'ai-automation',
  'web-app',
  'saas',
  'collaboration',
  'other',
] as const;

const BUDGET_OPTIONS = ['1-3k', '3-5k', '5-10k', '10k-plus', 'unsure'] as const;

type ProjectType = (typeof PROJECT_TYPE_OPTIONS)[number];
type Budget = (typeof BUDGET_OPTIONS)[number];

type FormValues = {
  name: string;
  email: string;
  projectType: ProjectType | '';
  budget: Budget | '';
  message: string;
};

type FieldName = 'name' | 'email' | 'projectType' | 'message';
type FormErrors = Partial<Record<FieldName, string>>;

const EMPTY_VALUES: FormValues = {
  name: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

function validate(values: FormValues, c: TranslationDict['contact']): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = c.errors.nameRequired;
  }

  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = c.errors.emailInvalid;
  }

  if (!values.projectType) {
    errors.projectType = c.errors.projectTypeRequired;
  }

  const message = values.message.trim();
  if (!message) {
    errors.message = c.errors.messageRequired;
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = c.errors.messageTooShort;
  }

  return errors;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ct-field">
      <label className="ct-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="ct-field__error">
          {error}
        </p>
      )}
    </div>
  );
}

function Segmented({
  id,
  label,
  optional,
  options,
  value,
  onChange,
  error,
  groupRef,
}: {
  id: string;
  label: string;
  optional?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  groupRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="ct-field">
      <div className="ct-field__head">
        <span className="ct-field__label" id={`${id}-label`}>
          {label}
        </span>
        {optional && <span className="ct-field__optional">{optional}</span>}
      </div>

      <div
        ref={groupRef}
        className="ct-seg"
        role="group"
        aria-labelledby={`${id}-label`}
        aria-invalid={error ? true : undefined}
      >
        {options.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className="ct-seg__item"
              data-active={active ? 'true' : 'false'}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="ct-field__error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const c = t.contact;
  const [state, handleSubmit, reset] = useForm('mbdwvkgq');

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as FieldName];
        return next;
      });
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors = validate(values, c);
    setErrors(nextErrors);

    const firstError = (['name', 'email', 'projectType', 'message'] as FieldName[]).find(
      (key) => nextErrors[key],
    );

    if (firstError) {
      if (firstError === 'name') nameRef.current?.focus();
      else if (firstError === 'email') emailRef.current?.focus();
      else if (firstError === 'projectType') typeRef.current?.querySelector('button')?.focus();
      else messageRef.current?.focus();
      return;
    }

    handleSubmit(e);
  };

  const resetForm = () => {
    reset();
    setValues(EMPTY_VALUES);
    setErrors({});
  };

  const serverError = state.errors !== null;

  return (
    <section id="contact" className="section-padding ct">
      <div className="container-wide">
        <div className="ct-grid">
          {/* Editorial introduction */}
          <div className="ct-intro">
            <p data-reveal className="section-label">
              {c.label}
            </p>

            <h2 data-reveal data-delay="100" className="ct-title">
              {c.headingPart1} <em className="ct-title__accent">{c.headingPart2}</em>
            </h2>

            <p data-reveal data-delay="200" className="ct-statement">
              {c.intro}
            </p>

            <div data-reveal data-delay="300" className="ct-meta">
              <div className="ct-available">
                <span className="ct-available__dot" />
                {c.available}
              </div>

              <p className="ct-response">
                <span aria-hidden="true">✓</span> {c.responseTime}
              </p>

              <p className="ct-location">Amsterdam, NL</p>
            </div>

            <div data-reveal data-delay="400" className="ct-links">
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
          <div data-reveal data-delay="150" className="ct-form-col">
            {state.succeeded ? (
              <div role="status" className="ct-success">
                <span className="ct-success__rule" aria-hidden="true" />
                <p className="ct-success__title">{c.successTitle}</p>
                <p className="ct-success__body">{c.successBody}</p>
                <button type="button" onClick={resetForm} className="btn-ghost ct-success__again">
                  {c.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="ct-form">
                {serverError && (
                  <div role="alert" className="ct-banner">
                    <p className="ct-banner__title">{c.errorTitle}</p>
                    <p className="ct-banner__body">{c.errorBody}</p>
                  </div>
                )}

                <div className="ct-form__row">
                  <Field id="contact-name" label={c.name} error={errors.name}>
                    <input
                      ref={nameRef}
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={c.namePlaceholder}
                      value={values.name}
                      onChange={(e) => setField('name', e.target.value)}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className="ct-input"
                    />
                  </Field>

                  <Field id="contact-email" label={c.email} error={errors.email}>
                    <input
                      ref={emailRef}
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={c.emailPlaceholder}
                      value={values.email}
                      onChange={(e) => setField('email', e.target.value)}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className="ct-input"
                    />
                  </Field>
                </div>

                <Segmented
                  id="contact-type"
                  label={c.projectType}
                  options={PROJECT_TYPE_OPTIONS.map((value, i) => ({
                    value,
                    label: c.projectTypeOptions[i],
                  }))}
                  value={values.projectType}
                  onChange={(value) => setField('projectType', value as ProjectType)}
                  error={errors.projectType}
                  groupRef={typeRef}
                />

                <Segmented
                  id="contact-budget"
                  label={c.budget}
                  optional={c.budgetOptional}
                  options={BUDGET_OPTIONS.map((value, i) => ({
                    value,
                    label: c.budgetOptions[i],
                  }))}
                  value={values.budget}
                  onChange={(value) => setField('budget', value as Budget)}
                />

                <Field id="contact-message" label={c.message} error={errors.message}>
                  <textarea
                    ref={messageRef}
                    id="contact-message"
                    name="message"
                    rows={6}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder={c.messagePlaceholder}
                    value={values.message}
                    onChange={(e) => setField('message', e.target.value)}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className="ct-input ct-input--area"
                  />
                </Field>

                {/* Honeypot — invisible to humans, catches naive bots. Formspree
                    discards submissions where this field has a value. */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="ct-honeypot"
                />

                <input
                  type="hidden"
                  name="_subject"
                  value={
                    values.name.trim()
                      ? `New inquiry — ${values.name.trim()}`
                      : 'New portfolio inquiry'
                  }
                />
                <input type="hidden" name="projectType" value={values.projectType} />
                <input type="hidden" name="budget" value={values.budget} />

                <div className="ct-form__foot">
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="btn-primary ct-submit"
                  >
                    {state.submitting ? c.sending : c.send}
                    {!state.submitting && <ArrowRight size={16} strokeWidth={1.75} />}
                  </button>

                  <p className="ct-form__privacy">{c.privacy}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ct-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(2.5rem, 6vw, 5.5rem);
          align-items: start;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ── Editorial introduction ── */
        .ct-intro {
          display: grid;
          gap: 1.5rem;
          align-content: start;
        }

        .ct-title {
          font-size: var(--fs-display);
          line-height: 1.08;
          letter-spacing: -0.02em;
          max-width: 12ch;
          margin-top: 1.5rem;
        }

        .ct-title__accent {
          font-style: italic;
          color: var(--text-faint);
        }

        .ct-statement {
          color: var(--text-soft);
          font-size: var(--fs-lead);
          line-height: 1.75;
          max-width: 44ch;
        }

        .ct-meta {
          display: grid;
          gap: 0.9rem;
          margin-top: 0.5rem;
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

        .ct-location {
          font-size: 0.9rem;
          color: var(--text-faint);
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

        /* ── Form column ── */
        .ct-form-col {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-self: stretch;
        }

        .ct-form {
          display: grid;
          gap: 1.6rem;
        }

        .ct-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }

        .ct-field {
          display: grid;
          gap: 0.55rem;
        }

        .ct-field__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
        }

        .ct-field__label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        .ct-field__optional {
          font-size: 0.64rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-faint);
          opacity: 0.7;
        }

        .ct-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.95rem 1.1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--line-soft);
          background: var(--glass-1);
          color: var(--text);
          font-size: 0.95rem;
          font-family: var(--font-body);
          transition:
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out),
            box-shadow var(--dur-base) var(--ease-out);
        }

        .ct-input::placeholder {
          color: var(--text-faint);
          opacity: 0.75;
        }

        .ct-input:hover {
          border-color: var(--line);
        }

        .ct-input:focus,
        .ct-input:focus-visible {
          outline: none;
          border-color: var(--verde-ink);
          background: var(--glass-2);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--verde-ink) 16%, transparent);
        }

        .ct-input[aria-invalid='true'] {
          border-color: rgba(200, 80, 80, 0.5);
        }

        .ct-input[aria-invalid='true']:focus,
        .ct-input[aria-invalid='true']:focus-visible {
          box-shadow: 0 0 0 3px rgba(200, 80, 80, 0.14);
        }

        .ct-input--area {
          min-height: 170px;
          resize: vertical;
          line-height: 1.6;
        }

        .ct-field__error {
          font-size: 0.8rem;
          color: #e08a8a;
          line-height: 1.5;
        }

        /* ── Segmented selection ── */
        .ct-seg {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .ct-seg__item {
          padding: 0.55rem 1.05rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line-soft);
          background: transparent;
          color: var(--text-faint);
          font-family: var(--font-body);
          font-size: 0.78rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out);
        }

        .ct-seg__item:hover {
          color: var(--text-soft);
          border-color: var(--line);
        }

        .ct-seg__item[data-active='true'] {
          color: var(--text);
          border-color: var(--glass-border-hover);
          background: var(--glass-2);
        }

        .ct-seg__item:focus-visible {
          outline: none;
          border-color: var(--verde-ink);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--verde-ink) 16%, transparent);
        }

        /* ── Server error banner ── */
        .ct-banner {
          border: 1px solid rgba(200, 80, 80, 0.3);
          background: rgba(200, 80, 80, 0.08);
          border-radius: var(--radius-md);
          padding: 0.9rem 1.1rem;
        }

        .ct-banner__title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #e08a8a;
        }

        .ct-banner__body {
          font-size: 0.82rem;
          color: var(--text-soft);
          margin-top: 0.25rem;
        }

        /* ── Form footer ── */
        .ct-form__foot {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-top: 0.25rem;
        }

        .ct-submit {
          padding: 0.95rem 2.1rem;
        }

        .ct-form__privacy {
          font-size: 0.76rem;
          color: var(--text-faint);
          max-width: 30ch;
        }

        /* ── Honeypot ── */
        .ct-honeypot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        /* ── Success state ── */
        .ct-success {
          flex: 1;
          display: grid;
          gap: 1rem;
          justify-items: start;
          align-content: center;
          padding: clamp(2rem, 4vw, 3rem);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-lg);
          background: var(--bg-soft);
        }

        .ct-success__rule {
          width: 42px;
          height: 1px;
          background: var(--verde-ink);
        }

        .ct-success__title {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          font-style: italic;
          color: var(--text);
        }

        .ct-success__body {
          color: var(--text-faint);
          font-size: 0.95rem;
        }

        .ct-success__again {
          margin-top: 0.75rem;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ct-grid {
            grid-template-columns: 1fr;
            gap: clamp(2.5rem, 6vw, 3.5rem);
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
