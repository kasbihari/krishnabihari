import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

const CHAR_SPEED = 28; // ms per character
const LINE_PAUSE = 600; // pause after each line completes
const CHAPTER_PAUSE = 1200;

export default function About({ lang: initialLang = 'en' }: { lang?: Lang }) {
  const { t } = useI18n(initialLang);
  const s = t.story;

  const chapters = [
    { id: 'origin', label: s.chapters.origin, lines: s.origin },
    { id: 'spark', label: s.chapters.spark, lines: s.spark },
    { id: 'craft', label: s.chapters.craft, lines: s.craft },
    { id: 'now', label: s.chapters.now, lines: s.now },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const [chapterIdx, setChapterIdx] = useState(0);
  const [revealedLines, setRevealedLines] = useState<number>(0);
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  // ── Core typewriter engine ────────────────────────────────────────────────
  const typeChar = useCallback(
    (cIdx: number, lIdx: number, chars: number) => {
      const ch = chapters[cIdx];
      const line = ch.lines[lIdx];

      if (chars < line.length) {
        setCharCount(chars + 1);
        timerRef.current = setTimeout(() => typeChar(cIdx, lIdx, chars + 1), CHAR_SPEED);
      } else {
        const nextLine = lIdx + 1;
        if (nextLine < ch.lines.length) {
          timerRef.current = setTimeout(() => {
            setRevealedLines(nextLine);
            setCharCount(0);
            typeChar(cIdx, nextLine, 0);
          }, LINE_PAUSE);
        } else {
          const nextChapter = cIdx + 1;
          if (nextChapter < chapters.length) {
            timerRef.current = setTimeout(() => {
              setChapterIdx(nextChapter);
              setRevealedLines(0);
              setCharCount(0);
              typeChar(nextChapter, 0, 0);
            }, CHAPTER_PAUSE);
          } else {
            timerRef.current = setTimeout(() => setDone(true), LINE_PAUSE);
          }
        }
      }
    },
    [chapters],
  );

  const start = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setChapterIdx(0);
    setRevealedLines(0);
    setCharCount(0);
    setDone(false);
    setStarted(true);
    typeChar(0, 0, 0);
  }, [typeChar]);

  // Auto-start on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          timerRef.current = setTimeout(start, 500);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [start]);

  const totalLines = chapters.reduce((sum, c) => sum + c.lines.length, 0);
  const completedLines =
    chapters.slice(0, chapterIdx).reduce((sum, c) => sum + c.lines.length, 0) +
    revealedLines;
  const progressPct = done ? 100 : Math.round((completedLines / totalLines) * 100);

  const traitRows = [
    { label: s.traits.strategy, sub: s.traits.strategySub },
    { label: s.traits.discipline, sub: s.traits.disciplineSub },
    { label: s.traits.craft, sub: s.traits.craftSub },
    { label: s.traits.momentum, sub: s.traits.momentumSub },
  ];

  return (
    <section id="about">
      {/* ══════════════════════════════════════════════════════════
          CINEMATIC TYPEWRITER SCREEN — the story unfolds
      ══════════════════════════════════════════════════════════ */}
      <div ref={sectionRef} className="about-stage">
        {/* Ambient light on the central axis */}
        <div aria-hidden="true" className="about-ambient" />

        <div className="container-main about-stage__inner">
          {/* Section label */}
          <p data-reveal className="section-label section-label--center about-label">
            {s.label}
          </p>

          {/* Chapter tabs */}
          <div className="about-tabs" data-reveal data-delay="100">
            {chapters.map((ch, i) => {
              const isPast = i < chapterIdx;
              const isCurrent = i === chapterIdx && started;
              return (
                <span
                  key={ch.id}
                  className="about-tab"
                  data-state={isCurrent ? 'current' : isPast ? 'past' : 'future'}
                >
                  {ch.label}
                </span>
              );
            })}
          </div>

          {/* Story text — the focus of the section */}
          <div className="about-story">
            {!started && <p className="about-idle">{s.scrollToBegin}</p>}

            {chapters.map((ch, cIdx) => {
              if (cIdx > chapterIdx) return null;
              const isCurrentChapter = cIdx === chapterIdx;

              return (
                <div key={ch.id} className={isCurrentChapter ? 'about-chapter' : 'about-chapter about-chapter--past'}>
                  {ch.lines.map((line, lIdx) => {
                    const isPastLine = cIdx < chapterIdx || lIdx < revealedLines;
                    const isTypingLine = isCurrentChapter && lIdx === revealedLines;
                    const isFutureLine = !isPastLine && !isTypingLine;

                    if (isFutureLine) return null;

                    const displayText = isTypingLine ? line.slice(0, charCount) : line;

                    return (
                      <p
                        key={`${ch.id}-${line.slice(0, 24)}`}
                        className="about-line"
                        data-state={isPastLine ? 'past' : 'active'}
                      >
                        {isTypingLine && <span aria-hidden="true" className="about-line-bar" />}
                        <span>{displayText}</span>
                        {isTypingLine && <span aria-hidden="true" className="about-caret" />}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Progress + replay */}
          <div className="about-progress">
            <div className="about-progress__track">
              <div className="about-progress__fill" style={{ width: `${progressPct}%` }} />
            </div>

            <span className="about-progress__value">{progressPct}%</span>

            {done && (
              <button type="button" onClick={start} aria-label={s.replay} className="about-replay">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8a6 6 0 1 0 1.5-3.9L2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 3v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {s.replay}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DETAILS: HOW I WORK + TRAITS
      ══════════════════════════════════════════════════════════ */}
      <div className="section-padding">
        <div className="container-main">
          <div className="about-details">
            {/* LEFT — how I work */}
            <div>
              <p data-reveal className="section-label about-details__label">
                {s.howIWorkTitle}
              </p>

              <p data-reveal data-delay="100" className="about-details__body">
                {s.howIWork1}
              </p>

              <p data-reveal data-delay="150" className="about-details__body about-details__body--soft">
                {s.howIWork2}
              </p>
            </div>

            {/* RIGHT — traits + journey link */}
            <div>
              <p data-reveal className="section-label about-details__label">
                {s.traitsTitle}
              </p>

              <div className="about-traits">
                {traitRows.map((row, i) => (
                  <div
                    key={row.label}
                    data-reveal
                    data-delay={`${100 + i * 80}`}
                    className="about-trait"
                    data-last={i === traitRows.length - 1 ? 'true' : 'false'}
                  >
                    <span className="about-trait__label">{row.label}</span>
                    <span className="about-trait__sub">{row.sub}</span>
                  </div>
                ))}
              </div>

              <a href="#journey" className="btn-secondary about-details__cta" data-reveal data-delay="300">
                {s.readTheJourney}
                <ArrowDown size={15} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Stage ── */
        .about-stage {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: clamp(7rem, 13vw, 10rem) 0 clamp(5rem, 10vw, 7rem);
        }

        .about-ambient {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(900px, 120vw);
          height: min(900px, 120vw);
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, var(--glow-1) 0%, transparent 62%);
          pointer-events: none;
        }

        .about-stage__inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .about-label {
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }

        /* ── Chapter tabs ── */
        .about-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }

        .about-tab {
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 6px 15px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line-soft);
          color: var(--text-faint);
          background: transparent;
          transition:
            color var(--dur-slow) var(--ease-out),
            border-color var(--dur-slow) var(--ease-out),
            background var(--dur-slow) var(--ease-out);
        }

        .about-tab[data-state='current'] {
          border-color: var(--glass-border-hover);
          background: var(--glass-2);
          color: var(--text);
        }

        .about-tab[data-state='past'] {
          color: var(--text-faint);
          opacity: 0.6;
        }

        /* ── Story ── */
        .about-story {
          max-width: 780px;
          min-height: 12rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .about-idle {
          font-family: var(--font-display);
          font-style: italic;
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-faint);
        }

        .about-chapter {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .about-chapter--past {
          margin-bottom: clamp(1.75rem, 3.5vw, 2.75rem);
        }

        .about-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3.4vw, 2.4rem);
          font-weight: 400;
          line-height: 1.4;
          letter-spacing: -0.015em;
          margin-bottom: 0.75rem;
          text-wrap: balance;
          transition: color var(--dur-slow) var(--ease-out);
        }

        .about-line[data-state='active'] {
          color: var(--text);
        }

        .about-line[data-state='past'] {
          color: var(--text-faint);
        }

        .about-line-bar {
          display: inline-block;
          flex-shrink: 0;
          width: 2px;
          height: 0.9em;
          border-radius: 2px;
          background: var(--verde-ink);
        }

        .about-caret {
          display: inline-block;
          width: 1px;
          height: 1.05em;
          background: var(--verde-ink);
          border-radius: 1px;
          animation: kb-blink 0.9s step-end infinite;
        }

        /* ── Progress ── */
        .about-progress {
          margin-top: clamp(2.5rem, 5vw, 3.5rem);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .about-progress__track {
          width: 170px;
          height: 1px;
          background: var(--line-soft);
          border-radius: 2px;
          overflow: hidden;
        }

        .about-progress__fill {
          height: 100%;
          background: var(--verde-ink);
          transition: width var(--dur-slow) var(--ease-out);
        }

        .about-progress__value {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.1em;
          color: var(--text-faint);
          font-variant-numeric: tabular-nums;
        }

        .about-replay {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
          background: none;
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-pill);
          cursor: pointer;
          padding: 6px 15px;
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out);
        }

        .about-replay:hover {
          color: var(--text);
          border-color: var(--glass-border-hover);
          background: var(--glass-1);
        }

        /* ── Details ── */
        .about-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: clamp(3rem, 7vw, 6rem);
        }

        .about-details__label {
          margin-bottom: 1.5rem;
        }

        .about-details__body {
          color: var(--text-soft);
          line-height: 1.85;
          margin-bottom: 1.5rem;
          font-size: 0.98rem;
        }

        .about-details__body--soft {
          color: var(--text-faint);
          font-size: 0.92rem;
          margin-bottom: 0;
        }

        .about-traits {
          display: flex;
          flex-direction: column;
        }

        .about-trait {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          padding: 1.15rem 0;
          border-bottom: 1px solid var(--line-soft);
        }

        .about-trait[data-last='true'] {
          border-bottom: none;
        }

        .about-trait__label {
          font-size: 0.64rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--verde-ink);
          min-width: 110px;
          padding-top: 3px;
          font-weight: 600;
        }

        .about-trait__sub {
          font-size: 0.85rem;
          color: var(--text-faint);
          line-height: 1.65;
        }

        .about-details__cta {
          margin-top: 2.5rem;
        }

        @media (max-width: 640px) {
          .about-trait {
            flex-direction: column;
            gap: 0.4rem;
          }

          .about-trait__label {
            min-width: 0;
          }
        }

        @keyframes kb-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
