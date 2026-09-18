import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

export type ProjectStatus = 'done' | 'in-progress';

export type ProjectCategory =
  | 'web-development'
  | 'web-redesign'
  | 'saas'
  | 'ai-tool'
  | 'ai-automation';

/**
 * Public portfolio project shape consumed by the Projects section.
 * `images` is the media list (JPG / PNG / WebP / GIF / AVIF); the first
 * entry is the square tile cover, the rest feed the detail slideshow.
 * `'empty'` means the project has no media yet.
 */
export type Project = {
  id: string;
  category: string;
  projectCategory: ProjectCategory;
  title: string;
  tagline: string;
  description: string;
  outcome: string;
  architecture: string[];
  stack: string[];
  link: string;
  accent: string;
  live?: string;
  status: ProjectStatus;
  images: string[] | 'empty';
};

type ProjectCardProps = {
  project: Project;
  index: number;
  isOpen: boolean;
  slideIndex: number;
  lang?: Lang;
  onToggle: (projectId: string, isOpen: boolean) => void;
  onNextSlide: (projectId: string, total: number) => void;
  onPrevSlide: (projectId: string, total: number) => void;
  onGoToSlide: (projectId: string, index: number) => void;
};

/**
 * A single square project tile. The media is the dominant element; the
 * caption (category + title) sits over a soft scrim at the bottom. Clicking
 * the tile expands the detail panel below it (slideshow, overview, stack,
 * links) without leaving the grid.
 */
export default function ProjectCard({
  project,
  index,
  isOpen,
  slideIndex,
  lang = 'en',
  onToggle,
  onNextSlide,
  onPrevSlide,
  onGoToSlide,
}: ProjectCardProps) {
  const { t } = useI18n(lang);
  const w = t.work;

  const images = project.images === 'empty' ? [] : project.images;
  const hasImages = images.length > 0;
  const cover = hasImages ? images[0] : null;
  const currentSlide = hasImages ? Math.min(slideIndex, images.length - 1) : 0;

  return (
    <article
      className="pj-card"
      data-open={isOpen ? 'true' : 'false'}
      data-reveal
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={`project-panel-${project.id}`}
        onClick={() => onToggle(project.id, isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(project.id, isOpen);
          }
        }}
        className="pj-trigger"
      >
        <div className="pj-cover" data-empty={hasImages ? 'false' : 'true'}>
          {cover ? (
            <img
              src={cover}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="pj-cover__img"
            />
          ) : (
            <span className="pj-cover__mark" aria-hidden="true">
              {project.title
                .split(' ')
                .map((word) => word.charAt(0))
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
          )}

          <span className="pj-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>

          <span
            className="pj-status"
            data-status={project.status}
            aria-hidden="true"
          />

          <div className="pj-caption">
            <span className="pj-category">{project.category}</span>
            <div className="pj-caption__row">
              <h3 className="pj-title">{project.title}</h3>
              <span className="pj-plus" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 4v12M4 10h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded detail — slideshow, overview, stack, links */}
      <div
        id={`project-panel-${project.id}`}
        className="pj-panel"
        data-open={isOpen ? 'true' : 'false'}
      >
        <div className="pj-panel__inner">
          {images.length > 1 && (
            <div className="pj-slides">
              <img
                src={images[currentSlide]}
                alt={`${project.title} screenshot ${currentSlide + 1}`}
                loading="lazy"
                decoding="async"
                className="pj-slides__img"
              />

              <button
                type="button"
                aria-label={w.prevImage}
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevSlide(project.id, images.length);
                }}
                className="pj-slides__nav pj-slides__nav--prev"
              >
                ←
              </button>

              <button
                type="button"
                aria-label={w.nextImage}
                onClick={(e) => {
                  e.stopPropagation();
                  onNextSlide(project.id, images.length);
                }}
                className="pj-slides__nav pj-slides__nav--next"
              >
                →
              </button>

              <div className="pj-slides__dots">
                {images.map((image, i) => (
                  <button
                    key={`${project.id}-${image}`}
                    type="button"
                    aria-label={`${w.goToImage} ${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onGoToSlide(project.id, i);
                    }}
                    className="pj-slides__dot"
                    data-active={currentSlide === i ? 'true' : 'false'}
                  />
                ))}
              </div>
            </div>
          )}

          {project.tagline && (
            <p className="pj-panel__lead">{project.tagline}</p>
          )}

          <div className="pj-panel__grid">
            <div>
              <p className="pj-panel__label">{w.overview}</p>
              <p className="pj-panel__body">{project.description}</p>
            </div>

            <div>
              <p className="pj-panel__label">{w.outcome}</p>
              <p className="pj-panel__body pj-panel__body--soft">{project.outcome}</p>
            </div>
          </div>

          {project.stack.length > 0 && (
            <div className="pj-stack">
              {project.stack.map((tech) => (
                <span key={tech} className="pj-stack-chip">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="pj-actions">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary"
              >
                {w.github}
              </a>
            )}

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-primary"
              >
                {w.liveSite}
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pj-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          overflow: hidden;
          transition:
            border-color var(--dur-base) var(--ease-out),
            transform var(--dur-base) var(--ease-out);
        }

        .pj-card:hover {
          border-color: var(--glass-border-hover);
          transform: translateY(-2px);
        }

        .pj-card[data-open='true'] {
          border-color: var(--glass-border-hover);
        }

        .pj-trigger {
          display: block;
          cursor: pointer;
        }

        /* ── Square cover — the tile ──
           aspect-ratio reserves the square before the image arrives, so the
           grid never shifts. The image is absolutely positioned inside it. */
        .pj-cover {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--surface);
        }

        .pj-cover__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform var(--dur-slow) var(--ease-out);
        }

        .pj-card:hover .pj-cover__img {
          transform: scale(1.04);
        }

        /* Typographic plate for projects without media. */
        .pj-cover[data-empty='true'] {
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              120% 120% at 50% 0%,
              color-mix(in srgb, var(--verde-ink) 12%, transparent),
              transparent 70%
            ),
            var(--surface);
        }

        .pj-cover__mark {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 3.75rem);
          font-style: italic;
          letter-spacing: -0.03em;
          color: var(--text-faint);
          opacity: 0.5;
        }

        /* ── Tile metadata ── */
        .pj-index {
          position: absolute;
          top: clamp(0.8rem, 2vw, 1rem);
          left: clamp(0.8rem, 2vw, 1rem);
          font-family: var(--font-mono);
          font-size: 0.64rem;
          letter-spacing: 0.16em;
          color: var(--on-accent);
          opacity: 0.7;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
        }

        .pj-status {
          position: absolute;
          top: clamp(0.9rem, 2.2vw, 1.1rem);
          right: clamp(0.9rem, 2.2vw, 1.1rem);
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--verde-ink);
          box-shadow: 0 0 0 3px rgba(8, 8, 8, 0.35);
        }

        .pj-status[data-status='in-progress'] {
          background: var(--bronze-soft);
        }

        /* ── Caption — always visible, refined on hover ── */
        .pj-caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: clamp(1.1rem, 2.2vw, 1.6rem);
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(8, 8, 8, 0.3) 45%,
            rgba(8, 8, 8, 0.64) 100%
          );
          transition: background var(--dur-base) var(--ease-out);
        }

        .pj-card:hover .pj-caption {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(8, 8, 8, 0.36) 45%,
            rgba(8, 8, 8, 0.72) 100%
          );
        }

        .pj-category {
          display: block;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--on-accent);
          opacity: 0.66;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pj-caption__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .pj-title {
          font-family: var(--font-display);
          font-size: clamp(1.05rem, 1.8vw, 1.4rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--on-accent);
          transition: color var(--dur-base) var(--ease-out);
        }

        .pj-card:hover .pj-title {
          color: color-mix(in srgb, var(--verde-ink) 55%, var(--on-accent));
        }

        .pj-plus {
          display: inline-flex;
          flex: none;
          color: var(--on-accent);
          opacity: 0.75;
          transition:
            transform var(--dur-base) var(--ease-out),
            opacity var(--dur-base) var(--ease-out);
        }

        .pj-card:hover .pj-plus {
          opacity: 1;
        }

        .pj-card[data-open='true'] .pj-plus {
          transform: rotate(45deg);
        }

        /* ── Detail panel ──
           grid-template-rows 0fr → 1fr animates the height smoothly without
           a magic max-height. The inner fades in/out with the border. */
        .pj-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows var(--dur-slow) var(--ease-out);
        }

        .pj-panel[data-open='true'] {
          grid-template-rows: 1fr;
        }

        .pj-panel__inner {
          overflow: hidden;
          min-height: 0;
          padding: clamp(1.25rem, 2vw, 1.6rem);
          border-top: 1px solid var(--glass-border);
          opacity: 0;
          transition: opacity var(--dur-base) var(--ease-out);
        }

        .pj-panel[data-open='true'] .pj-panel__inner {
          opacity: 1;
        }

        .pj-panel__lead {
          color: var(--text-soft);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          max-width: 52ch;
        }

        .pj-slides {
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--glass-border);
          background: var(--surface);
          margin-bottom: 1.5rem;
          display: grid;
          place-items: center;
        }

        .pj-slides__img {
          width: 100%;
          height: clamp(180px, 30vw, 340px);
          object-fit: contain;
          display: block;
        }

        .pj-slides__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: var(--glass-2);
          -webkit-backdrop-filter: blur(var(--glass-blur-1));
          backdrop-filter: blur(var(--glass-blur-1));
          color: var(--text);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .pj-slides__nav--prev { left: 0.6rem; }
        .pj-slides__nav--next { right: 0.6rem; }

        .pj-slides__dots {
          position: absolute;
          bottom: 0.7rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.45rem;
        }

        .pj-slides__dot {
          width: 6px;
          height: 6px;
          padding: 0;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: var(--line-strong);
        }

        .pj-slides__dot[data-active='true'] {
          background: var(--text);
        }

        .pj-panel__grid {
          display: grid;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .pj-panel__label {
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--bronze);
          margin-bottom: 0.6rem;
        }

        .pj-panel__body {
          color: var(--text-soft);
          line-height: 1.75;
          font-size: 0.88rem;
        }

        .pj-panel__body--soft {
          color: var(--text-faint);
        }

        .pj-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 1.5rem;
        }

        .pj-stack-chip {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.06em;
          padding: 0.24rem 0.6rem;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-pill);
          color: var(--text-faint);
          white-space: nowrap;
        }

        .pj-actions {
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
        }
      `}</style>
    </article>
  );
}
