import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

const CHAR_SPEED = 28; // ms per character
const LINE_PAUSE = 600; // pause after each line completes
const CHAPTER_PAUSE = 1200;

/**
 * Resolves the visual color for a chapter tab.
 */
function getChapterTabColor(isCurrent: boolean, isPast: boolean): string {
  if (isCurrent) return 'var(--sand)';
  if (isPast) return 'var(--text-faint)';
  return 'var(--text-faint)';
}

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
          CINEMATIC TYPEWRITER SCREEN
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={sectionRef}
        style={{
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow left */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '25%',
            left: '-12%',
            width: '620px',
            height: '620px',
            background: 'radial-gradient(ellipse, var(--glow-1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container-main"
          style={{ position: 'relative', zIndex: 1, paddingTop: '8rem', paddingBottom: '6rem' }}
        >
          {/* Section label */}
          <p
            data-reveal
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--sand)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '4rem',
            }}
          >
            <span style={{ width: 26, height: 1, background: 'var(--sand)', display: 'inline-block' }} />
            {s.label}
          </p>

          {/* Chapter tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
            {chapters.map((ch, i) => {
              const isPast = i < chapterIdx;
              const isCurrent = i === chapterIdx && started;
              return (
                <span
                  key={ch.id}
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '5px 14px',
                    borderRadius: '100px',
                    border: isCurrent ? '1px solid var(--sand)' : '1px solid var(--line-soft)',
                    color: getChapterTabColor(isCurrent, isPast),
                    background: isCurrent ? 'color-mix(in srgb, var(--sand) 8%, transparent)' : 'transparent',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {ch.label}
                </span>
              );
            })}
          </div>

          {/* Story text */}
          <div style={{ maxWidth: '700px' }}>
            {!started && (
              <p
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                  color: 'var(--text-faint)',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {s.scrollToBegin}
              </p>
            )}

            {chapters.map((ch, cIdx) => {
              if (cIdx > chapterIdx) return null;
              const isCurrentChapter = cIdx === chapterIdx;

              return (
                <div key={ch.id} style={{ marginBottom: isCurrentChapter ? 0 : '2.5rem' }}>
                  {ch.lines.map((line, lIdx) => {
                    const isPastLine = cIdx < chapterIdx || lIdx < revealedLines;
                    const isTypingLine = isCurrentChapter && lIdx === revealedLines;
                    const isFutureLine = !isPastLine && !isTypingLine;

                    if (isFutureLine) return null;

                    const displayText = isTypingLine ? line.slice(0, charCount) : line;

                    return (
                      <p
                        key={`${ch.id}-${line.slice(0, 24)}`}
                        style={{
                          fontSize: 'clamp(1.2rem, 2.6vw, 1.8rem)',
                          fontWeight: 400,
                          lineHeight: 1.45,
                          letterSpacing: '-0.01em',
                          marginBottom: '0.55rem',
                          color: isPastLine ? 'var(--text-faint)' : 'var(--soft-white)',
                          transition: 'color 0.5s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        {/* Active bar */}
                        {isTypingLine && (
                          <span
                            aria-hidden="true"
                            style={{
                              display: 'inline-block',
                              flexShrink: 0,
                              width: '3px',
                              height: '1em',
                              borderRadius: '2px',
                              background: 'var(--sand)',
                            }}
                          />
                        )}
                        {displayText}
                        {/* Blinking cursor */}
                        {isTypingLine && (
                          <span
                            aria-hidden="true"
                            style={{
                              display: 'inline-block',
                              width: '2px',
                              height: '1.1em',
                              background: 'var(--pine-ink)',
                              borderRadius: '1px',
                              animation: 'kb-blink 0.9s step-end infinite',
                              verticalAlign: 'middle',
                              marginLeft: '1px',
                            }}
                          />
                        )}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Progress + controls */}
          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '160px',
                height: '1px',
                background: 'var(--line-soft)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, var(--sand-dark), var(--sand-light))',
                  transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
              />
            </div>

            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: 'var(--muted)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {progressPct}%
            </span>

            {done && (
              <button
                type="button"
                onClick={start}
                aria-label={s.replay}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-soft)',
                  background: 'none',
                  border: '1px solid var(--line)',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  padding: '5px 14px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--sand)';
                  e.currentTarget.style.borderColor = 'var(--sand)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-soft)';
                  e.currentTarget.style.borderColor = 'var(--line)';
                }}
              >
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

      <div className="divider" />

      {/* ══════════════════════════════════════════════════════════
          DETAILS: HOW I WORK + TRAITS
      ══════════════════════════════════════════════════════════ */}
      <div className="section-padding">
        <div className="container-main">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '5rem',
            }}
          >
            {/* LEFT — how I work */}
            <div>
              <p
                data-reveal
                className="section-label"
                style={{ marginBottom: '1.5rem' }}
              >
                {s.howIWorkTitle}
              </p>

              <p
                data-reveal
                data-delay="100"
                style={{
                  color: 'var(--text-soft)',
                  lineHeight: 1.85,
                  marginBottom: '1.5rem',
                  fontSize: '0.98rem',
                }}
              >
                {s.howIWork1}
              </p>

              <p
                data-reveal
                data-delay="150"
                style={{
                  color: 'var(--text-faint)',
                  lineHeight: 1.85,
                  fontSize: '0.92rem',
                }}
              >
                {s.howIWork2}
              </p>
            </div>

            {/* RIGHT — traits + journey link */}
            <div>
              <p data-reveal className="section-label" style={{ marginBottom: '1.5rem' }}>
                {s.traitsTitle}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {traitRows.map((row, i) => (
                  <div
                    key={row.label}
                    data-reveal
                    data-delay={`${100 + i * 80}`}
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'flex-start',
                      padding: '1.15rem 0',
                      borderBottom: i < 3 ? '1px solid var(--line-soft)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--pine-ink)',
                        minWidth: '110px',
                        paddingTop: '2px',
                        fontWeight: 600,
                      }}
                    >
                      {row.label}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)', lineHeight: 1.65 }}>
                      {row.sub}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#journey"
                className="btn-secondary"
                data-reveal
                data-delay="300"
                style={{ marginTop: '2.5rem' }}
              >
                {s.readTheJourney}
                <ArrowDown size={15} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Blink keyframe */}
      <style>{`
        @keyframes kb-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
