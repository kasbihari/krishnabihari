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

  return (
    <section
      id="client-portal"
      className="section-padding"
      style={{ position: 'relative' }}
    >
      <div className="container-main">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
            gap: '4.5rem',
            alignItems: 'center',
          }}
        >
          {/* Copy */}
          <div data-reveal>
            <p className="section-label">
              <span
                style={{
                  width: 26,
                  height: 1,
                  background: 'var(--sand)',
                  display: 'inline-block',
                }}
              />
              {c.label}
            </p>
            <h2 className="text-section-title" style={{ maxWidth: '560px' }}>
              {c.heading}
            </h2>
            <p
              className="text-body-lg"
              style={{
                marginTop: '1.4rem',
                maxWidth: '540px',
              }}
            >
              {c.body}
            </p>

            <a
              href="/client"
              className="btn-primary"
              style={{ marginTop: '2.2rem' }}
            >
              {c.cta}
              <ArrowRight size={16} strokeWidth={1.75} />
            </a>
          </div>

          {/* Portal preview card */}
          <div data-reveal data-delay="150">
            <div
              role="img"
              aria-label="Client portal preview"
              style={{
                position: 'relative',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                background: 'var(--surface)',
                boxShadow: '0 30px 80px -40px rgba(60, 40, 20, 0.35)',
                overflow: 'hidden',
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.3rem',
                  borderBottom: '1px solid var(--line-soft)',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                  }}
                >
                  <Lock size={12} strokeWidth={2} style={{ color: 'var(--pine-ink)' }} />
                  {c.eyebrow}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--pine-ink)',
                    border: '1px solid var(--pine-ink)',
                    borderRadius: '999px',
                    padding: '0.28rem 0.7rem',
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: 'var(--pine-ink)',
                      display: 'inline-block',
                    }}
                  />
                  {c.previewBadge}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: '1.6rem 1.3rem 1.8rem', display: 'grid', gap: '1.1rem' }}>
                <p
                  className="font-display"
                  style={{
                    fontSize: '1.5rem',
                    fontStyle: 'italic',
                    color: 'var(--text)',
                  }}
                >
                  {c.previewTitle}
                </p>

                {/* Skeleton rows (decorative) */}
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div
                    style={{
                      height: 8,
                      width: '100%',
                      borderRadius: 99,
                      background: 'var(--line-soft)',
                    }}
                  />
                  <div
                    style={{
                      height: 8,
                      width: '72%',
                      borderRadius: 99,
                      background: 'var(--line-soft)',
                    }}
                  />
                </div>

                {/* Progress row */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-faint)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span>{c.progress}</span>
                    <span>{c.launch}</span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 99,
                      background: 'var(--line-soft)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: '62%',
                        borderRadius: 99,
                        background: 'linear-gradient(90deg, var(--pine-deep), var(--pine-ink))',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Decorative corner seal */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-34px',
                  right: '-34px',
                  width: 110,
                  height: 110,
                  borderRadius: 999,
                  background: 'radial-gradient(circle at 40% 40%, var(--glow-1), transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
