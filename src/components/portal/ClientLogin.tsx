import {
motion,
} from 'framer-motion';
import {
useState,
} from 'react';

const ease = [
0.16,
1,
0.3,
1,
] as const;

const fadeUp = (
delay: number,
) => ({
initial: {
opacity: 0,
y: 12,
},
animate: {
opacity: 1,
y: 0,
},
transition: {
duration: 0.55,
ease,
delay,
},
});

export default function ClientLogin() {
const [
projectCode,
setProjectCode,
] = useState('');

const [
isSubmitting,
setIsSubmitting,
] = useState(false);

const [
error,
setError,
] = useState('');

const handleSubmit = async (
event: React.SubmitEvent<HTMLFormElement>,
) => {
event.preventDefault();

setError('');

const normalized =
  projectCode
    .trim()
    .toUpperCase();

if (!normalized) {
  setError(
    'Please enter your project code.',
  );
  return;
}

setIsSubmitting(true);

try {
  const response =
    await fetch(
      '/api/client/login',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          projectCode:
            normalized,
        }),
      },
    );

  const result =
    await response
      .json()
      .catch(
        () => ({
          success: false,
          message:
            'Unable to validate the project code.',
        }),
      );

  if (
    !response.ok ||
    !result?.success
  ) {
    setError(
      result?.message ||
        'That project code is invalid. Please check the code and try again.',
    );
    return;
  }

  if (
    !result.project?.id ||
    !result.project?.project_code
  ) {
    setError(
      'The project workspace could not be initialized.',
    );
    return;
  }

  /*
   * The authenticated project is now represented
   * by the secure httpOnly cookie created by the
   * server-side login endpoint.
   *
   * We intentionally do not store the session
   * in localStorage/sessionStorage.
   */

  window.location.href =
    '/client/dashboard';
} catch {
  setError(
    'Unable to connect to the project portal. Please try again.',
  );
} finally {
  setIsSubmitting(false);
}
};

return (
<> <style>{`
.client-login-page {
position: relative;
min-height: 100svh;
display: grid;
place-items: center;
padding:
2rem 1.25rem;
overflow: hidden;
}

    .client-login-page::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(
          circle at 15% 15%,
          rgba(74, 124, 106, 0.055),
          transparent 32%
        ),
        radial-gradient(
          circle at 85% 85%,
          rgba(200, 184, 154, 0.04),
          transparent 34%
        );
    }

    .client-login-page::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(
          ellipse at center,
          transparent 50%,
          rgba(0, 0, 0, 0.14) 100%
        );
    }

    .client-login-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 980px;
      display: grid;
      grid-template-columns:
        repeat(
          auto-fit,
          minmax(
            min(100%, 460px),
            1fr
          )
        );
      overflow: hidden;
      border:
        1px solid
        var(--border-mid);
      border-radius: 24px;
      background:
        rgba(21, 15, 10, 0.82);
      box-shadow:
        0 24px 65px
        rgba(0, 0, 0, 0.24);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .client-login-intro {
      padding:
        clamp(2rem, 4vw, 4rem);
      background:
        radial-gradient(
          110% 100% at 0% 0%,
          rgba(
            200,
            184,
            154,
            0.07
          ),
          transparent 56%
        );
    }

    .client-login-brand {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 2rem;
    }

    .client-login-brand-mark {
      width: 46px;
      height: 46px;
      flex: 0 0 46px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      border:
        1px solid
        var(--border-mid);
      background:
        rgba(
          255,
          255,
          255,
          0.03
        );
      font-family:
        var(--font-name);
      font-size: 1.4rem;
      color:
        var(--sand-light);
    }

    .client-login-brand-name {
      font-size: 0.64rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--sand);
    }

    .client-login-brand-subtitle {
      font-size: 0.9rem;
      color: var(--muted);
    }

    .client-login-eyebrow {
      margin-bottom: 0.8rem;
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--sand);
    }

    .client-login-title {
      margin: 0 0 1.25rem;
      font-size:
        clamp(
          2.25rem,
          5vw,
          4rem
        );
      line-height: 1.05;
      letter-spacing: -0.03em;
      color:
        var(--soft-white);
    }

    .client-login-description {
      max-width: 44ch;
      margin-bottom: 2.25rem;
      color:
        var(--muted);
      font-size: 1rem;
      line-height: 1.8;
    }

    .client-login-features {
      display: grid;
      gap: 0.85rem;
      max-width: 420px;
    }

    .client-login-feature {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color:
        var(--off-white);
      font-size: 0.96rem;
    }

    .client-login-feature-dot {
      width: 8px;
      height: 8px;
      flex: 0 0 8px;
      border-radius: 50%;
      background:
        var(--forest-bright);
      box-shadow:
        0 0 10px
        rgba(
          74,
          124,
          106,
          0.55
        );
    }

    .client-login-form-panel {
      padding:
        clamp(1.5rem, 3vw, 2.5rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        rgba(
          255,
          255,
          255,
          0.015
        );
      border-top:
        1px solid
        var(--border-mid);
    }

    .client-login-form-container {
      width: 100%;
      max-width: 420px;
    }

    .client-login-back {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      margin-bottom: 1.75rem;
      color:
        var(--muted);
      font-size: 0.78rem;
      transition:
        color 0.2s ease,
        transform 0.2s
          cubic-bezier(
            0.16,
            1,
            0.3,
            1
          );
    }

    .client-login-back:hover {
      color:
        var(--soft-white);
      transform:
        translateX(-2px);
    }

    .client-login-form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .client-login-form-eyebrow {
      margin-bottom: 0.35rem;
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--sand);
    }

    .client-login-form-title {
      margin: 0;
      font-size: 1.65rem;
      color:
        var(--soft-white);
    }

    .client-login-form-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background:
        rgba(
          200,
          184,
          154,
          0.08
        );
      border:
        1px solid
        var(--border-mid);
      font-size: 0.7rem;
      color:
        var(--sand-light);
    }

    .client-login-label {
      display: block;
      margin-bottom: 0.55rem;
      color:
        var(--off-white);
      font-size: 0.82rem;
    }

    .client-login-input {
      width: 100%;
      padding:
        0.85rem 1rem;
      border-radius: 12px;
      border:
        1px solid
        var(--border-mid);
      background:
        rgba(
          255,
          255,
          255,
          0.03
        );
      color:
        var(--soft-white);
      font-size: 1rem;
      margin-bottom: 0.5rem;
      outline: none;
      box-sizing: border-box;
      letter-spacing: 0.04em;
      transition:
        border-color 200ms ease,
        background 200ms ease,
        box-shadow 200ms ease;
    }

    .client-login-input:focus {
      border-color:
        rgba(
          200,
          184,
          154,
          0.32
        );
      background:
        rgba(
          255,
          255,
          255,
          0.04
        );
      box-shadow:
        0 0 0 3px
        rgba(
          200,
          184,
          154,
          0.05
        );
    }

    .client-login-input:disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }

    .client-login-error {
      color:
        #ff6b6b;
      font-size: 0.82rem;
      margin-top: 0.25rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .client-login-button {
      width: 100%;
      min-height: 46px;
      border-radius: 12px;
      justify-content: center;
      padding: 0.85rem;
      border: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .client-login-button::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          105deg,
          transparent 30%,
          rgba(
            255,
            255,
            255,
            0.09
          ),
          transparent 70%
        );
      transform:
        translateX(-120%);
      transition:
        transform 550ms
          cubic-bezier(
            0.16,
            1,
            0.3,
            1
          );
    }

    .client-login-button:hover::after {
      transform:
        translateX(120%);
    }

    @media (max-width: 700px) {
      .client-login-page {
        padding:
          1rem 0.85rem;
      }

      .client-login-card {
        border-radius: 20px;
      }

      .client-login-form-panel {
        border-top:
          1px solid
          var(--border-mid);
      }
    }

    @media (max-width: 520px) {
      .client-login-intro {
        padding:
          1.75rem 1.35rem;
      }

      .client-login-form-panel {
        padding:
          1.35rem;
      }

      .client-login-title {
        font-size:
          clamp(
            2rem,
            10vw,
            3rem
          );
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .client-login-back,
      .client-login-input,
      .client-login-button {
        transition: none;
      }

      .client-login-button::after {
        display: none;
      }
    }
  `}</style>

  <main className="client-login-page">
    <motion.div
      className="client-login-card"
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.65,
        ease,
      }}
    >
      <section className="client-login-intro">
        <motion.div
          className="client-login-brand"
          {...fadeUp(0.12)}
        >
          <motion.div
            className="client-login-brand-mark"
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.45,
              ease,
              delay: 0.18,
            }}
          >
            K
          </motion.div>

          <div>
            <div className="client-login-brand-name">
              Krishna Bihari
            </div>

            <div className="client-login-brand-subtitle">
              Project Portal
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.2)}
        >
          <p className="client-login-eyebrow">
            Private access
          </p>

          <h1 className="client-login-title">
            Open your project workspace.
          </h1>
        </motion.div>

        <motion.p
          className="client-login-description"
          {...fadeUp(0.28)}
        >
          Use your unique project code to
          access project progress, milestones,
          timeline, visual updates, and
          delivery information.
        </motion.p>

        <div className="client-login-features">
          {[
            'Project progress and delivery milestones',
            'Current phase, timeline, and next steps',
            'Visual updates and live project access',
          ].map((item, index) => (
            <motion.div
              key={item}
              className="client-login-feature"
              {...fadeUp(
                0.36 +
                  index * 0.06,
              )}
            >
              <span
                aria-hidden="true"
                className="client-login-feature-dot"
              />

              {item}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="client-login-form-panel">
        <div className="client-login-form-container">
          <motion.a
            href="/"
            className="client-login-back"
            {...fadeUp(0.22)}
          >
            <span aria-hidden="true">
              ←
            </span>
            Back to portfolio
          </motion.a>

          <motion.div
            className="client-login-form-header"
            {...fadeUp(0.28)}
          >
            <div>
              <div className="client-login-form-eyebrow">
                Project access
              </div>

              <h2 className="client-login-form-title">
                Sign in
              </h2>
            </div>

            <motion.div
              aria-hidden="true"
              className="client-login-form-icon"
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.45,
                ease,
                delay: 0.34,
              }}
            >
              PC
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            noValidate
            {...fadeUp(0.34)}
          >
            <label
              htmlFor="project-code"
              className="client-login-label"
            >
              Project code
            </label>

            <motion.input
              id="project-code"
              type="text"
              value={projectCode}
              onChange={(event) =>
                setProjectCode(
                  event.target.value,
                )
              }
              disabled={isSubmitting}
              placeholder="PROJECT-2026-X7K9"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              aria-describedby={
                error
                  ? 'project-code-error'
                  : undefined
              }
              className="client-login-input"
              whileFocus={{
                scale: 1.002,
              }}
              transition={{
                duration: 0.18,
                ease,
              }}
            />

            {error && (
              <motion.p
                id="project-code-error"
                role="alert"
                className="client-login-error"
                initial={{
                  opacity: 0,
                  y: -4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease,
                }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary client-login-button"
              whileHover={
                isSubmitting
                  ? undefined
                  : {
                      y: -1,
                    }
              }
              whileTap={
                isSubmitting
                  ? undefined
                  : {
                      scale: 0.99,
                    }
              }
              transition={{
                duration: 0.18,
                ease,
              }}
              style={{
                opacity:
                  isSubmitting
                    ? 0.7
                    : 1,
              }}
            >
              {isSubmitting
                ? 'Verifying...'
                : 'Access Workspace'}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </motion.div>
  </main>
</>
);
}