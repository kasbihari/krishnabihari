import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

export default function Journey({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const j = t.journey;

  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // The progression line fills as the timeline moves through the viewport.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.25;
      const total = rect.height + (start - end);
      const travelled = start - rect.top;
      setProgress(Math.max(0, Math.min(1, travelled / total)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="journey" className="section-padding jr">
      <div className="container-main">
        {/* Header — centered on the axis */}
        <div className="jr-header">
          <p data-reveal className="section-label section-label--center">
            {j.label}
          </p>

          <h2 data-reveal data-delay="100" className="text-section-title jr-header__title">
            {j.headingPart1} <em className="jr-header__accent">{j.headingPart2}</em>
          </h2>

          <p data-reveal data-delay="200" className="jr-header__intro">
            {j.intro}
          </p>
        </div>

        {/* Progression */}
        <div className="jr-track" ref={trackRef}>
          <div className="jr-rail" aria-hidden="true">
            <div className="jr-rail__fill" style={{ transform: `scaleY(${progress})` }} />
          </div>

          {j.chapters.map((chapter, i) => (
            <article
              key={chapter.year + chapter.title}
              className="jr-chapter"
              data-reveal
              data-delay={String(Math.min(i * 100, 400))}
            >
              <span className="jr-node" aria-hidden="true" />

              <div className="jr-chapter__meta">
                <p className="jr-year">{chapter.year}</p>
                <p className="jr-place">{chapter.place}</p>
              </div>

              <div className="jr-chapter__body">
                <h3 className="jr-title">{chapter.title}</h3>
                <p className="jr-text">{chapter.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Beyond the screen */}
        <div className="jr-beyond" data-reveal>
          <p className="section-label section-label--center">{j.beyondTitle}</p>

          <p className="jr-beyond__intro">{j.beyondIntro}</p>

          <div className="jr-pills">
            {j.pills.map((pill) => (
              <span key={pill} className="jr-pill">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .jr-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: clamp(3.5rem, 7vw, 5.5rem);
        }

        .jr-header__title {
          margin-top: 1.5rem;
          max-width: 20ch;
        }

        .jr-header__accent {
          font-style: italic;
          color: var(--text-faint);
        }

        .jr-header__intro {
          margin-top: 1.5rem;
          max-width: 52ch;
          color: var(--text-faint);
          font-size: var(--fs-lead);
          line-height: 1.75;
        }

        /* ── Progression track ── */
        .jr-track {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding-left: clamp(1.75rem, 5vw, 3.5rem);
        }

        .jr-rail {
          position: absolute;
          top: 0.6rem;
          bottom: 0.6rem;
          left: 0;
          width: 1px;
          background: var(--line-soft);
          overflow: hidden;
        }

        .jr-rail__fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, var(--verde-ink), var(--bronze));
          transform-origin: top;
          transform: scaleY(0);
          transition: transform 120ms linear;
        }

        .jr-chapter {
          position: relative;
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: clamp(1.25rem, 3vw, 2.5rem);
          padding: clamp(2.25rem, 4.5vw, 3.5rem) 0;
        }

        .jr-node {
          position: absolute;
          left: calc(-1 * clamp(1.75rem, 5vw, 3.5rem));
          top: calc(clamp(2.25rem, 4.5vw, 3.5rem) + 0.45rem);
          width: 7px;
          height: 7px;
          margin-left: -3px;
          border-radius: 50%;
          background: var(--bg);
          border: 1px solid var(--line-strong);
        }

        .jr-chapter__meta {
          padding-top: 0.15rem;
        }

        .jr-year {
          font-family: var(--font-display);
          font-size: clamp(1.2rem, 2vw, 1.7rem);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--text);
        }

        .jr-place {
          margin-top: 0.5rem;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
          line-height: 1.6;
        }

        .jr-chapter__body {
          max-width: 620px;
        }

        .jr-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.25rem, 2.4vw, 1.75rem);
          line-height: 1.25;
          color: var(--text);
          margin-bottom: 0.75rem;
        }

        .jr-text {
          color: var(--text-faint);
          line-height: 1.8;
          font-size: 0.96rem;
        }

        /* ── Beyond ── */
        .jr-beyond {
          margin-top: clamp(4rem, 8vw, 6rem);
          padding-top: clamp(3rem, 6vw, 4.5rem);
          border-top: 1px solid var(--line-soft);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .jr-beyond__intro {
          margin-top: 1.75rem;
          max-width: 46ch;
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(1.25rem, 2.6vw, 1.85rem);
          line-height: 1.5;
          color: var(--text-soft);
        }

        .jr-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          justify-content: center;
          margin-top: 2.25rem;
        }

        .jr-pill {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          color: var(--text-faint);
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-pill);
          padding: 0.45rem 1rem;
          background: transparent;
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out);
        }

        .jr-pill:hover {
          color: var(--text);
          border-color: var(--line);
        }

        @media (max-width: 720px) {
          .jr-chapter {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }

          .jr-chapter__meta {
            display: flex;
            align-items: baseline;
            gap: 0.9rem;
            flex-wrap: wrap;
          }

          .jr-place {
            margin-top: 0;
          }
        }
      `}</style>
    </section>
  );
}
