import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../../lib/client/i18n-store";
import type { Lang } from "../../i18n";

export default function Hero({
  lang: initialLang = "en",
}: {
  lang?: Lang;
}) {
  const { t } = useI18n(initialLang);

  /* ---------------------------------------------------------------
     General UI state
  ---------------------------------------------------------------- */

  const [
    roleIndex,
    setRoleIndex,
  ] = useState(0);

  const [
    displayed,
    setDisplayed,
  ] = useState("");

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    isPaused,
    setIsPaused,
  ] = useState(false);

  /* ---------------------------------------------------------------
     Typewriter
  ---------------------------------------------------------------- */

  // When the language changes, restart the role typewriter cleanly.
  useEffect(() => {
    setDisplayed("");
    setIsDeleting(false);
    setIsPaused(false);
    setRoleIndex(0);
  }, [t]);

  useEffect(() => {
    const currentRole =
      t.hero.roles[roleIndex % t.hero.roles.length];

    if (isPaused) {
      const timeout =
        window.setTimeout(
          () => {
            setIsPaused(false);
            setIsDeleting(true);
          },
          1800,
        );

      return () =>
        window.clearTimeout(
          timeout,
        );
    }

    if (!isDeleting) {
      if (
        displayed.length <
        currentRole.length
      ) {
        const timeout =
          window.setTimeout(
            () => {
              setDisplayed(
                currentRole.slice(
                  0,
                  displayed.length +
                    1,
                ),
              );
            },
            60,
          );

        return () =>
          window.clearTimeout(
            timeout,
          );
      }

      setIsPaused(true);

      return;
    }

    if (displayed.length > 0) {
      const timeout =
        window.setTimeout(
          () => {
            setDisplayed(
              displayed.slice(
                0,
                -1,
              ),
            );
          },
          35,
        );

      return () =>
        window.clearTimeout(
          timeout,
        );
    }

    setIsDeleting(false);

    setRoleIndex(
      (current) =>
        (current + 1) %
        t.hero.roles.length,
    );
  }, [
    displayed,
    isDeleting,
    isPaused,
    roleIndex,
    t,
  ]);

  return (
    <section
      id="home"
      className="hero-section"
    >
      {/* Grain */}
      <div
        aria-hidden="true"
        className="hero-grain"
      />

      <div className="hero-content">
        <div className="hero-copy">
          <p className="hero-availability hero-animate hero-delay-1">
            <span className="hero-status-dot"/>
            {t.hero.availability}
          </p>

          <h1 className="hero-title hero-animate hero-delay-2">
            <span className="font-name hero-name">Krishna Bihari</span>
            <span className="hero-title-line">
              <span className="hero-title-accent">{t.hero.headlinePart1}</span>{" "}
              {t.hero.headlinePart2}
            </span>
          </h1>

          <div className="hero-role hero-animate hero-delay-3">
            <span>
              {displayed}
              <span className="hero-cursor" />
            </span>
          </div>

          <p className="hero-description hero-animate hero-delay-4">
            {t.hero.description}
          </p>

          <div className="hero-actions hero-animate hero-delay-5">
            <a
              href="#projects"
              className="btn-primary"
            >
              {t.hero.viewWork}
            </a>

            <a
              href="/client"
              className="btn-secondary"
            >
              {t.hero.clientPortal}
            </a>

            <a
              href="#contact"
              className="hero-link"
            >
              {t.hero.getInTouch}
              <ArrowRight
                size={14}
                strokeWidth={1.75}
              />
            </a>
          </div>

          <div className="hero-proof hero-animate hero-delay-6">
            <div className="hero-proof__stat">
              <span className="hero-proof__value">3+</span>
              <span className="hero-proof__label">{t.hero.statsYears}</span>
            </div>
            <div className="hero-proof__stat">
              <span className="hero-proof__value">2</span>
              <span className="hero-proof__label">{t.hero.statsProjects}</span>
            </div>
            <div className="hero-proof__stat">
              <span className="hero-proof__value">4</span>
              <span className="hero-proof__label">{t.hero.statsStacks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div
        aria-hidden="true"
        className="hero-scroll"
      >
        <span>Scroll</span>

        <div className="hero-scroll-line" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          /* Height-aware: short laptops compress, tall displays open up. */
          padding:
            clamp(7rem, 13vh, 11rem)
            var(--container-pad)
            clamp(7rem, 15vh, 12rem);
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.03;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /* The composition sits on one centred axis. The measure is generous
           on large displays so the wordmark is never boxed in. */
        .hero-content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: min(1440px, 100%);
          margin: 0 auto;
        }

        .hero-copy {
          width: 100%;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-availability {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          margin: 0 0 clamp(2.25rem, 5.5vh, 4rem);
          color: var(--text-faint);
          font-size: 0.66rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .hero-status-dot {
          display: block;
          width: 5px;
          min-width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--verde-ink);
          box-shadow: 0 0 10px var(--verde-ink);
          animation: heroPulse 3.4s var(--ease-inout) infinite;
        }

        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        /* ── Typography: two deliberately separate layers ────────── */

        .hero-title {
          margin: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.25rem, 3vw, 2.75rem);
        }

        /*
          Layer A — the name. Amsterdam Four, and nothing else.

          This face has extreme vertical metrics. Measured from the font
          tables, its glyphs reach 1.6152em above and 0.8428em below the
          baseline while its declared line box is 3.1919em tall. At a
          normal line-height the flourishes therefore overflow into
          whatever follows — which is precisely what used to collide
          with the Playfair headline.

          Curing that with line-height alone would need ~2.9em and inject
          a large block of dead space. Instead the line box stays tight
          (1em) and the real glyph overflow is absorbed by explicit
          padding, derived from those metrics:

            top    = 1.6152 - 2.2148 + (3.1919 - 1) / 2 = 0.4964em -> 0.53em
            bottom = 0.8428 + 2.2148 - (3.1919 - 1) / 2 - 1 = 0.9616em -> 1em

          The box now bounds the glyphs exactly: no waste, no clipping,
          and no possibility of collision. Separation from layer B is the
          flex gap above — never a negative margin.

          Sizing: "Krishna Bihari" measures 6.7783em wide, so the fluid
          size is jointly capped by viewport height as well as width.
          Height-capping keeps the hero composed on short laptop screens
          rather than merely tall ones.
        */
        .hero-name {
          display: block;
          font-family: var(--font-name);
          font-size: clamp(2.25rem, min(11.5vw, 13.5vh), 10.5rem);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.005em;
          color: var(--text);
          text-align: center;
          max-width: 100%;
          padding: 0.53em 0.02em 1em;
          overflow: visible;
        }

        /* Layer B — the statement. Playfair, its own size, its own layer. */
        .hero-title-line {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 3.1vw, 2.85rem);
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: -0.015em;
          color: var(--text-soft);
          max-width: 28ch;
          text-wrap: balance;
        }

        .hero-title-accent {
          color: var(--text);
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
        }

        .hero-role {
          min-height: 1.9rem;
          margin: clamp(1.75rem, 4vh, 2.75rem) 0 clamp(1.5rem, 3.5vh, 2.25rem);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-faint);
          font-family: var(--font-mono);
          font-size: clamp(0.72rem, 1.15vw, 0.84rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero-cursor {
          display: inline-block;
          width: 1px;
          height: 1.05em;
          margin-left: 4px;
          vertical-align: text-bottom;
          background: var(--verde-ink);
          animation:
            heroBlink
            1.1s
            step-end
            infinite;
        }

        .hero-description {
          max-width: 46ch;
          margin: 0 0 clamp(2.25rem, 5vh, 3.5rem);
          color: var(--text-faint);
          font-size: clamp(0.95rem, 1.15vw, 1.08rem);
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(0.75rem, 1.5vw, 1.15rem);
        }

        /* The third path is a quiet text link, not a third button —
           three competing buttons is what made this read as a landing page. */
        .hero-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.8rem 0.35rem;
          font-size: 0.875rem;
          color: var(--text-faint);
          white-space: nowrap;
          transition:
            color var(--dur-base) var(--ease-out),
            gap var(--dur-base) var(--ease-out);
        }

        .hero-link:hover {
          color: var(--text);
          gap: 0.7rem;
        }

        /* ── Proof strip — real facts, no invented numbers ── */
        .hero-proof {
          display: flex;
          justify-content: center;
          gap: clamp(1.75rem, 4vw, 3.25rem);
          margin-top: clamp(2.25rem, 5vh, 3.5rem);
          padding-top: clamp(1.5rem, 3vh, 2rem);
          border-top: 1px solid var(--line-soft);
        }

        .hero-proof__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .hero-proof__value {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          line-height: 1;
          color: var(--text);
        }

        .hero-proof__label {
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-faint);
          text-align: center;
          max-width: 15ch;
        }

        .hero-scroll {
          position: absolute;
          left: 50%;
          bottom: 2.25rem;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          transform:
            translateX(-50%);
          pointer-events: none;
        }

        .hero-scroll span {
          color: var(--text-faint);
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero-scroll-line {
          width: 1px;
          height: 52px;
          background:
            linear-gradient(
              to bottom,
              var(--line-strong),
              transparent
            );
          animation:
            heroScrollPulse
            3.2s
            var(--ease-inout)
            infinite;
        }

        .hero-animate {
          opacity: 0;
          transform:
            translateY(16px);
          filter: blur(8px);
          animation:
            heroReveal
            1100ms
            var(--ease-out)
            forwards;
        }

        .hero-delay-1 {
          animation-delay: 120ms;
        }

        .hero-delay-2 {
          animation-delay: 320ms;
        }

        .hero-delay-3 {
          animation-delay: 620ms;
        }

        .hero-delay-4 {
          animation-delay: 820ms;
        }

        .hero-delay-5 {
          animation-delay: 1020ms;
        }

        .hero-delay-6 {
          animation-delay: 1220ms;
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform:
              translateY(16px);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
            filter: blur(0);
          }
        }

        @keyframes heroBlink {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }
        }

        @keyframes heroScrollPulse {
          0%,
          100% {
            opacity: 0.3;
            transform:
              scaleY(1);
          }

          50% {
            opacity: 1;
            transform:
              scaleY(1.15);
          }
        }

        /* ── Short laptop displays ──
           Compose rather than overflow: tighten the rhythm and pull the
           wordmark back so the hero still resolves within the viewport. */
        @media (min-width: 1024px) and (max-height: 800px) {
          .hero-section {
            padding-top: clamp(6rem, 10vh, 7.5rem);
            padding-bottom: clamp(5rem, 9vh, 7rem);
          }

          .hero-name {
            font-size: clamp(2.25rem, min(10vw, 11.5vh), 7.5rem);
          }

          .hero-availability {
            margin-bottom: clamp(1.5rem, 3.5vh, 2.5rem);
          }

          .hero-role {
            margin-top: clamp(1.25rem, 2.5vh, 1.75rem);
            margin-bottom: clamp(1rem, 2vh, 1.5rem);
          }

          .hero-description {
            margin-bottom: clamp(1.5rem, 3vh, 2.25rem);
          }
        }

        @media (max-width: 767px) {
          .hero-section {
            padding-top: clamp(7rem, 14vh, 9rem);
            padding-bottom: clamp(7rem, 15vh, 12rem);
          }

          .hero-title-line {
            max-width: 20ch;
          }

          .hero-description {
            max-width: 40ch;
          }

          .hero-scroll {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .hero-role {
            letter-spacing: 0.16em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-animate {
            opacity: 1;
            transform: none;
            animation: none;
          }

          .hero-cursor,
          .hero-scroll-line {
            animation: none;
          }
        }
      ` }} />
    </section>
  );
}