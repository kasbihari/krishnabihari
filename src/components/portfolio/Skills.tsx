import { useState } from 'react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

/**
 * Capabilities are organised around what Krishna actually builds, not around
 * a wall of frameworks. Technologies are secondary information, revealed on
 * interaction.
 */
type Capability = {
  key: 'web' | 'ai' | 'automation' | 'saas';
  index: string;
  stack: string[];
};

const capabilities: Capability[] = [
  {
    key: 'web',
    index: '01',
    stack: ['React', 'Next.js', 'Astro', 'TypeScript', 'Tailwind CSS', 'Symfony', 'Node.js', 'REST APIs'],
  },
  {
    key: 'ai',
    index: '02',
    stack: ['OpenAI API', 'ElevenLabs', 'LangChain', 'Prompt Engineering', 'Vector Search'],
  },
  {
    key: 'automation',
    index: '03',
    stack: ['Twilio', 'Webhook Flows', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'WebSocket'],
  },
  {
    key: 'saas',
    index: '04',
    stack: ['Supabase', 'MySQL', 'PostgreSQL', 'Vercel', 'GitHub Actions', 'Stripe-ready'],
  },
];

export default function Skills({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const s = t.skills;
  const [openKey, setOpenKey] = useState<string | null>(null);

  const copy: Record<Capability['key'], { title: string; body: string }> = {
    web: { title: s.webTitle, body: s.webBody },
    ai: { title: s.aiTitle, body: s.aiBody },
    automation: { title: s.automationTitle, body: s.automationBody },
    saas: { title: s.saasTitle, body: s.saasBody },
  };

  return (
    <section id="skills" className="section-padding">
      <div className="container-main">
        {/* Header — centered on the axis */}
        <div className="cap-header">
          <p data-reveal className="section-label section-label--center">
            {s.label}
          </p>

          <h2 data-reveal data-delay="100" className="text-section-title cap-header__title">
            {s.headingPart1}{' '}
            <em className="cap-header__accent">{s.headingPart2}</em>
          </h2>

          <p data-reveal data-delay="200" className="cap-header__body">
            {s.body}
          </p>
        </div>

        {/* Capabilities — four statements, not a technology wall */}
        <div className="cap-list">
          {capabilities.map((cap, i) => {
            const isOpen = openKey === cap.key;
            const c = copy[cap.key];

            return (
              <div
                key={cap.key}
                className="cap-item"
                data-open={isOpen ? 'true' : 'false'}
                data-reveal
                data-delay={i < 4 ? ((i * 100) as 0 | 100 | 200 | 300) : 0}
              >
                <button
                  type="button"
                  className="cap-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`cap-panel-${cap.key}`}
                  onClick={() => setOpenKey(isOpen ? null : cap.key)}
                >
                  <span className="cap-index">{cap.index}</span>

                  <span className="cap-main">
                    <span className="cap-title">{c.title}</span>
                    <span className="cap-body">{c.body}</span>
                  </span>

                  <span className="cap-toggle" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                <div id={`cap-panel-${cap.key}`} className="cap-panel" data-open={isOpen ? 'true' : 'false'}>
                  <div className="cap-panel__inner">
                    {cap.stack.map((tech) => (
                      <span key={tech} className="cap-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet closing statement */}
        <blockquote data-reveal className="cap-quote">
          <p className="cap-quote__text">“{s.quote}”</p>
        </blockquote>
      </div>

      <style>{`
        .cap-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: clamp(3.5rem, 7vw, 5.5rem);
        }

        .cap-header__title {
          margin-top: 1.5rem;
          max-width: 20ch;
        }

        .cap-header__accent {
          font-style: italic;
          color: var(--text-faint);
        }

        .cap-header__body {
          margin-top: 1.5rem;
          max-width: 52ch;
          font-size: var(--fs-lead);
          line-height: 1.75;
          color: var(--text-faint);
        }

        .cap-list {
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
        }

        .cap-item {
          border-top: 1px solid var(--line-soft);
        }

        .cap-item:last-child {
          border-bottom: 1px solid var(--line-soft);
        }

        .cap-trigger {
          width: 100%;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: clamp(1.25rem, 3vw, 2.5rem);
          padding: clamp(1.5rem, 3vw, 2.25rem) 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: inherit;
        }

        .cap-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          color: var(--text-faint);
          align-self: flex-start;
          padding-top: 0.5rem;
        }

        .cap-main {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 0;
        }

        .cap-title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3.2vw, 2.1rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--text);
          transition: color var(--dur-base) var(--ease-out);
        }

        .cap-item[data-open='false'] .cap-trigger:hover .cap-title {
          color: var(--verde-ink);
        }

        .cap-body {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--text-faint);
          max-width: 58ch;
        }

        .cap-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--glass-border);
          background: var(--glass-1);
          color: var(--text-faint);
          transition:
            transform var(--dur-base) var(--ease-out),
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out);
        }

        .cap-item[data-open='true'] .cap-toggle {
          transform: rotate(45deg);
          color: var(--verde-ink);
          border-color: var(--glass-border-hover);
        }

        .cap-panel {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition:
            max-height var(--dur-slow) var(--ease-out),
            opacity var(--dur-slow) var(--ease-out);
        }

        .cap-panel[data-open='true'] {
          max-height: 400px;
          opacity: 1;
        }

        .cap-panel__inner {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0 0 clamp(1.5rem, 3vw, 2.25rem) clamp(2rem, 5vw, 3.5rem);
        }

        .cap-chip {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.05em;
          padding: 0.32rem 0.75rem;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-pill);
          color: var(--text-faint);
          white-space: nowrap;
        }

        .cap-quote {
          max-width: 640px;
          margin: clamp(3.5rem, 7vw, 5.5rem) auto 0;
          padding-left: 1.5rem;
          border-left: 1px solid var(--bronze);
          text-align: left;
        }

        .cap-quote__text {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          line-height: 1.65;
          color: var(--text-soft);
        }

        @media (max-width: 640px) {
          .cap-trigger {
            grid-template-columns: auto 1fr;
            gap: 1rem;
          }

          .cap-toggle {
            display: none;
          }

          .cap-panel__inner {
            padding-left: 0;
          }
        }
      `}</style>
    </section>
  );
}
