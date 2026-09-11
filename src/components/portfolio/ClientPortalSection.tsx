import { ArrowRight, Lock } from 'lucide-react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

export default function ClientPortalSection({
  lang: initialLang = 'en',
}: {
  lang?: Lang;
}) {
  const { t } = useI18n(initialLang);
  const c = t.portalTeaser;

  const milestones = [
    { label: c.milestoneDiscovery, state: 'done' as const },
    { label: c.milestoneDesign, state: 'done' as const },
    { label: c.milestoneDevelopment, state: 'active' as const },
    { label: c.milestoneLaunch, state: 'todo' as const },
  ];

  return (
    <section id="client-portal" className="section-padding cp">
      <div className="container-main">
        {/* Copy — centered on the axis */}
        <div className="cp-head">
          <p data-reveal className="section-label section-label--center">
            {c.label}
          </p>

          <h2 data-reveal data-delay="100" className="text-section-title cp-head__title">
            {c.heading}
          </h2>

          <p data-reveal data-delay="200" className="cp-head__body">
            {c.body}
          </p>

          <a data-reveal data-delay="300" href="/client" className="btn-primary cp-head__cta">
            {c.cta}
            <ArrowRight size={16} strokeWidth={1.75} />
          </a>
        </div>

        {/* The workspace itself — one large glass composition */}
        <div className="cp-window glass-2 radius-xl" data-reveal="scale" data-delay="150">
          {/* Window chrome */}
          <div className="cp-chrome">
            <span className="cp-chrome__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>

            <span className="cp-chrome__title">
              <Lock size={11} strokeWidth={2} />
              {c.workspace}
            </span>

            <span className="cp-chrome__badge">
              <span className="cp-chrome__badge-dot" />
              {c.previewBadge}
            </span>
          </div>

          <div className="cp-body">
            {/* Project identity */}
            <div className="cp-project">
              <p className="cp-project__eyebrow">{c.eyebrow}</p>
              <p className="cp-project__name">{c.previewTitle}</p>
              <p className="cp-project__meta">{c.projectMeta}</p>
            </div>

            {/* Progress */}
            <div className="cp-progress">
              <div className="cp-progress__row">
                <span>{c.progress}</span>
                <span className="cp-progress__value">68%</span>
              </div>
              <div className="cp-progress__track">
                <div className="cp-progress__fill" />
              </div>
            </div>

            {/* Milestones */}
            <ul className="cp-milestones">
              {milestones.map((m) => (
                <li key={m.label} className="cp-milestone" data-state={m.state}>
                  <span className="cp-milestone__mark" aria-hidden="true">
                    {m.state === 'done' ? '✓' : m.state === 'active' ? '●' : '○'}
                  </span>
                  <span className="cp-milestone__label">{m.label}</span>
                </li>
              ))}
            </ul>

            {/* Decorative activity rows */}
            <div className="cp-rows" aria-hidden="true">
              <span style={{ width: '100%' }} />
              <span style={{ width: '68%' }} />
              <span style={{ width: '84%' }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cp-head {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: clamp(3rem, 6vw, 4.5rem);
        }

        .cp-head__title {
          margin-top: 1.5rem;
          max-width: 22ch;
        }

        .cp-head__body {
          margin-top: 1.5rem;
          max-width: 54ch;
          font-size: var(--fs-lead);
          line-height: 1.75;
          color: var(--text-faint);
        }

        .cp-head__cta {
          margin-top: 2.25rem;
        }

        /* ── Workspace window ── */
        .cp-window {
          max-width: 1040px;
          margin: 0 auto;
          overflow: hidden;
        }

        .cp-chrome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 1.35rem;
          border-bottom: 1px solid var(--line-soft);
        }

        .cp-chrome__dots {
          display: inline-flex;
          gap: 0.4rem;
        }

        .cp-chrome__dots i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--line);
          display: block;
        }

        .cp-chrome__title {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-faint);
        }

        .cp-chrome__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--verde-ink);
          border: 1px solid color-mix(in srgb, var(--verde-ink) 30%, transparent);
          border-radius: var(--radius-pill);
          padding: 0.28rem 0.7rem;
          white-space: nowrap;
        }

        .cp-chrome__badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .cp-body {
          padding: clamp(1.5rem, 4vw, 2.5rem);
          display: grid;
          gap: clamp(1.5rem, 3vw, 2.25rem);
        }

        .cp-project__eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--bronze);
          margin-bottom: 0.6rem;
        }

        .cp-project__name {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3.4vw, 2.2rem);
          font-style: italic;
          line-height: 1.15;
          color: var(--text);
        }

        .cp-project__meta {
          margin-top: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: var(--text-faint);
        }

        .cp-progress__row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.64rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: 0.7rem;
        }

        .cp-progress__value {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-soft);
          letter-spacing: 0.06em;
        }

        .cp-progress__track {
          height: 3px;
          border-radius: 99px;
          background: var(--line-soft);
          overflow: hidden;
        }

        .cp-progress__fill {
          height: 100%;
          width: 68%;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--verde), var(--verde-ink));
        }

        .cp-milestones {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.85rem;
        }

        .cp-milestone {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 0.9rem;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-sm);
          background: transparent;
        }

        .cp-milestone__mark {
          font-size: 0.7rem;
          line-height: 1;
          color: var(--text-faint);
        }

        .cp-milestone__label {
          font-size: 0.74rem;
          letter-spacing: 0.04em;
          color: var(--text-faint);
        }

        .cp-milestone[data-state='done'] .cp-milestone__mark,
        .cp-milestone[data-state='done'] .cp-milestone__label {
          color: var(--verde-ink);
        }

        .cp-milestone[data-state='active'] {
          border-color: color-mix(in srgb, var(--verde-ink) 32%, transparent);
        }

        .cp-milestone[data-state='active'] .cp-milestone__mark,
        .cp-milestone[data-state='active'] .cp-milestone__label {
          color: var(--text);
        }

        .cp-rows {
          display: grid;
          gap: 0.5rem;
        }

        .cp-rows span {
          display: block;
          height: 6px;
          border-radius: 99px;
          background: var(--line-soft);
        }

        @media (max-width: 640px) {
          .cp-chrome__title {
            display: none;
          }

          .cp-milestones {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
