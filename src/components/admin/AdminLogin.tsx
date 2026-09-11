import { useEffect, useRef, useState } from 'react';

/**
 * Cinematic terminal login.
 *
 * IMPORTANT: this component is presentation only. Credentials are posted to
 * the existing server-side endpoint (/api/admin/login), which performs the
 * real authentication and sets the signed httpOnly session cookie. No secret,
 * token or credential is ever held in client-side code.
 */

type Phase = 'boot' | 'form' | 'authenticating' | 'granted';

const BOOT_LINES = [
  'krishna@system ~ % session --init',
  'Authentication required.',
];

const AUTH_LINES = [
  '> initializing secure session...',
  '> verifying credentials...',
  '> establishing connection...',
];

export default function AdminLogin() {
  const [phase, setPhase] = useState<Phase>('boot');
  const [bootStep, setBootStep] = useState(0);
  const [authStep, setAuthStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  // Boot sequence — two short lines, then the prompt appears.
  useEffect(() => {
    if (phase !== 'boot') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBootStep(BOOT_LINES.length);
      setPhase('form');
      return;
    }

    if (bootStep >= BOOT_LINES.length) {
      const t = window.setTimeout(() => setPhase('form'), 420);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => setBootStep((s) => s + 1), 520);
    return () => window.clearTimeout(t);
  }, [phase, bootStep]);

  // Focus the first field once the prompt is live.
  useEffect(() => {
    if (phase === 'form') emailRef.current?.focus();
  }, [phase]);

  // Authentication sequence — purely presentational pacing.
  useEffect(() => {
    if (phase !== 'authenticating') return;

    if (authStep >= AUTH_LINES.length) {
      const t = window.setTimeout(() => setPhase('granted'), 520);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => setAuthStep((s) => s + 1), 460);
    return () => window.clearTimeout(t);
  }, [phase, authStep]);

  // Hand off to the admin interface.
  useEffect(() => {
    if (phase !== 'granted') return;
    const t = window.setTimeout(() => {
      window.location.href = '/admin';
    }, 1100);
    return () => window.clearTimeout(t);
  }, [phase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);
    setPhase('authenticating');
    setAuthStep(0);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        setPhase('form');
        setIsSubmitting(false);
        setError(result?.message || 'Authentication failed.');
        return;
      }

      // Success — let the sequence finish, then redirect.
      setAuthStep(AUTH_LINES.length);
    } catch {
      setPhase('form');
      setIsSubmitting(false);
      setError('Unable to reach the authentication service.');
    }
  };

  const showForm = phase === 'form' || phase === 'authenticating';

  return (
    <main className="term">
      <div className="term__window glass-2 radius-lg">
        {/* Window chrome */}
        <div className="term__chrome">
          <span className="term__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="term__chrome-title">krishna@system — secure shell</span>
          <span className="term__chrome-spacer" />
        </div>

        <div className="term__body">
          {/* Identity */}
          <p className="term__brand font-name--bounded">Krishna Bihari</p>
          <div className="term__rule" aria-hidden="true" />

          {/* Boot lines */}
          <div className="term__lines">
            {BOOT_LINES.slice(0, bootStep).map((line) => (
              <p key={line} className="term__line">
                <span className="term__prompt">krishna@system ~ %</span>
                <span>{line.replace('krishna@system ~ % ', '')}</span>
              </p>
            ))}
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="term__form" autoComplete="off">
              <label className="term__field">
                <span className="term__label">Username</span>
                <span className="term__input-row">
                  <span className="term__caret" aria-hidden="true">
                    &gt;
                  </span>
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={phase === 'authenticating'}
                    autoComplete="username"
                    spellCheck={false}
                    className="term__input"
                  />
                </span>
              </label>

              <label className="term__field">
                <span className="term__label">Password</span>
                <span className="term__input-row">
                  <span className="term__caret" aria-hidden="true">
                    &gt;
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={phase === 'authenticating'}
                    autoComplete="current-password"
                    className="term__input"
                  />
                </span>
              </label>

              {error && (
                <p role="alert" className="term__error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={phase === 'authenticating'}
                className="term__submit"
              >
                {phase === 'authenticating' ? 'authenticating…' : '> authenticate'}
              </button>
            </form>
          )}

          {/* Authentication sequence */}
          {phase !== 'form' && phase !== 'boot' && (
            <div className="term__lines term__lines--auth" aria-live="polite">
              {AUTH_LINES.slice(0, authStep).map((line) => (
                <p key={line} className="term__line term__line--muted">
                  {line}
                </p>
              ))}

              {phase === 'granted' && (
                <>
                  <p className="term__line term__line--granted">ACCESS TO SYSTEM ACCEPTED.</p>
                  <p className="term__line term__line--welcome">Welcome, Krishna.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .term {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: clamp(1.5rem, 5vw, 3rem) var(--container-pad);
        }

        .term__window {
          width: 100%;
          max-width: 620px;
          overflow: hidden;
          animation: termIn 700ms var(--ease-out) both;
        }

        @keyframes termIn {
          from { opacity: 0; transform: translateY(14px) scale(0.99); filter: blur(8px); }
          to   { opacity: 1; transform: none; filter: blur(0); }
        }

        .term__chrome {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--line-soft);
        }

        .term__dots {
          display: inline-flex;
          gap: 0.4rem;
        }

        .term__dots i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--line);
          display: block;
        }

        .term__chrome-title {
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.1em;
          color: var(--text-faint);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .term__chrome-spacer {
          flex: 1;
        }

        .term__body {
          padding: clamp(1.75rem, 4vw, 2.75rem);
        }

        .term__brand {
          font-size: clamp(1.6rem, 4.2vw, 2.1rem);
          color: var(--text);
        }

        .term__rule {
          height: 1px;
          background: var(--line-soft);
          margin: 1.25rem 0 1.75rem;
        }

        .term__lines {
          display: grid;
          gap: 0.55rem;
          margin-bottom: 1.75rem;
        }

        .term__lines--auth {
          margin-bottom: 0;
        }

        .term__line {
          display: flex;
          gap: 0.7rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          line-height: 1.6;
          color: var(--text-soft);
          animation: termLine 420ms var(--ease-out) both;
        }

        @keyframes termLine {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }

        .term__prompt {
          color: var(--verde-ink);
          flex-shrink: 0;
        }

        .term__line--muted {
          color: var(--text-faint);
        }

        .term__line--granted {
          color: var(--verde-ink);
          letter-spacing: 0.08em;
        }

        .term__line--welcome {
          color: var(--text);
        }

        .term__form {
          display: grid;
          gap: 1.25rem;
        }

        .term__field {
          display: grid;
          gap: 0.5rem;
        }

        .term__label {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        .term__input-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-sm);
          background: var(--glass-1);
          padding: 0.75rem 0.95rem;
          transition: border-color var(--dur-base) var(--ease-out);
        }

        .term__input-row:focus-within {
          border-color: var(--verde-ink);
        }

        .term__caret {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--verde-ink);
          flex-shrink: 0;
        }

        .term__input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 0.88rem;
          letter-spacing: 0.02em;
        }

        .term__input:disabled {
          opacity: 0.5;
        }

        .term__error {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: #e0a0a0;
          border-left: 2px solid #a05050;
          padding-left: 0.75rem;
        }

        .term__submit {
          justify-self: start;
          margin-top: 0.25rem;
          padding: 0.7rem 1.5rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--verde-soft);
          background: var(--verde);
          color: var(--on-accent);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition:
            background var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            transform var(--dur-fast) var(--ease-out);
        }

        .term__submit:hover:not(:disabled) {
          background: var(--verde-soft);
          border-color: var(--verde-bright);
          transform: translateY(-1px);
        }

        .term__submit:disabled {
          opacity: 0.6;
          cursor: default;
        }

        @media (max-width: 520px) {
          .term__chrome-title {
            display: none;
          }

          .term__line {
            font-size: 0.74rem;
          }
        }
      `}</style>
    </main>
  );
}
