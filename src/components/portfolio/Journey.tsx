import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

export default function Journey({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const j = t.journey;

  return (
    <section id="journey" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-main">
        <div data-reveal>
          <p className="section-label">
            <span style={{ width: 26, height: 1, background: 'var(--sand)', display: 'inline-block' }} />
            {j.label}
          </p>
        </div>

        <div
          data-reveal
          data-delay="100"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '1.2rem',
            maxWidth: '860px',
          }}
        >
          <h2 className="text-section-title">
            {j.headingPart1}{' '}
            <em style={{ color: 'var(--pine-ink)', fontStyle: 'italic' }}>{j.headingPart2}</em>
          </h2>
          <p
            style={{
              maxWidth: '560px',
              color: 'var(--text-soft)',
              fontSize: '1.05rem',
              lineHeight: 1.75,
            }}
          >
            {j.intro}
          </p>
        </div>

        <div style={{ marginTop: '4.5rem', display: 'grid', gap: '0' }}>
          {j.chapters.map((chapter, i) => (
            <article
              key={chapter.year + chapter.title}
              data-reveal
              data-delay={String(Math.min(i * 100, 400))}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '2rem',
                padding: '2.2rem 0',
                borderTop: '1px solid var(--line-soft)',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    letterSpacing: '0.08em',
                    color: 'var(--pine-ink)',
                  }}
                >
                  {chapter.year}
                </p>
                <p
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                  }}
                >
                  {chapter.place}
                </p>
              </div>
              <div style={{ maxWidth: '620px' }}>
                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.25rem, 2.2vw, 1.7rem)',
                    fontStyle: 'italic',
                    color: 'var(--text)',
                    marginBottom: '0.7rem',
                  }}
                >
                  {chapter.title}
                </h3>
                <p style={{ color: 'var(--text-soft)', lineHeight: 1.75, fontSize: '0.98rem' }}>
                  {chapter.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Beyond the screen */}
        <div
          data-reveal
          style={{
            marginTop: '4.5rem',
            padding: '3rem 0 0',
            borderTop: '1px solid var(--line-soft)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '1rem',
            }}
          >
            <p className="section-label" style={{ marginBottom: 0 }}>
              <span style={{ width: 26, height: 1, background: 'var(--sand)', display: 'inline-block' }} />
              {j.beyondTitle}
            </p>
            <div>
              <p
                className="font-display"
                style={{
                  fontSize: 'clamp(1.3rem, 2.6vw, 1.9rem)',
                  fontStyle: 'italic',
                  color: 'var(--text-soft)',
                  maxWidth: '620px',
                  lineHeight: 1.5,
                }}
              >
                {j.beyondIntro}
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1rem' }}>
              {j.pills.map((pill) => (
                <span
                  key={pill}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.04em',
                    color: 'var(--text-soft)',
                    border: '1px solid var(--line)',
                    borderRadius: '999px',
                    padding: '0.45rem 0.95rem',
                    background: 'var(--surface)',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
