import { useI18n } from '../../lib/client/i18n-store';
import { hasCaseStudy, slugify } from '../../lib/case-studies';
import type { Lang } from '../../i18n';

export type ProjectStatus = 'done' | 'in-progress';

/**
 * i18n keys for the localized category and context labels shown on the
 * project cards. The keys must exist in every language dictionary under
 * `work.projectCategories` / `work.projectContexts`.
 */
export type ProjectCategoryKey =
  | 'ai-employee-automation'
  | 'personal-system'
  | 'full-stack-web'
  | 'data-platform';

export type ProjectContextKey =
  | 'own-product'
  | 'personal-project'
  | 'school-roc';

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
 *
 * `categoryKey` / `contextKey` are optional i18n keys used to localize the
 * category and context labels. When absent (e.g. admin-managed projects),
 * the raw `category` / `context` strings are shown as-is.
 */
export type Project = {
  id: string;
  category: string;
  categoryKey?: ProjectCategoryKey;
  projectCategory: ProjectCategory;
  title: string;
  context?: string;
  contextKey?: ProjectContextKey;
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
  const studySlug = slugify(project.title);
  const hasStudy = hasCaseStudy(studySlug);

  // Localized labels — fall back to the raw data strings for projects
  // without i18n keys (e.g. admin-managed projects).
  const category = project.categoryKey
    ? (w.projectCategories[project.categoryKey] ?? project.category)
    : project.category;
  const context = project.contextKey
    ? (w.projectContexts[project.contextKey] ?? project.context)
    : project.context;

  return (
    <article
      className="pj-card"
      data-open={isOpen ? 'true' : 'false'}
      data-reveal
    >
      {/* Tile — the square cover with the caption overlaid on it. The tile
          is the positioning context for the caption, so the caption stays
          anchored to the cover when the detail panel below expands. */}
      <div className="pj-tile">
        {/* Cover — clicking it toggles the detail panel. */}
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
          className="pj-cover"
          data-empty={hasImages ? 'false' : 'true'}
        >
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
        </div>

        {/* Caption — name, category, context, short description and the
            clear path into the case study. Sits over the cover as a sibling
            so the study link is never nested inside the toggle. */}
        <div className="pj-caption">
          <div className="pj-caption__meta">
            <span className="pj-category">{category}</span>
            {context && <span className="pj-context">{context}</span>}
          </div>

          <h3 className="pj-title">{project.title}</h3>

          <p className="pj-desc">{project.description}</p>

          <div className="pj-caption__row">
            {hasStudy && (
              <a
                href={`/work/${studySlug}`}
                className="pj-study"
              >
                {w.readCaseStudy}
                <span className="pj-study__arrow" aria-hidden="true">→</span>
              </a>
            )}

            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`project-panel-${project.id}`}
              aria-label={isOpen ? w.close : w.explore}
              onClick={() => onToggle(project.id, isOpen)}
              className="pj-expand"
            >
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4v12M4 10h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded detail — slideshow, overview, outcome, links */}
      <div
        id={`project-panel-${project.id}`}
        className="pj-panel"
        data-open={isOpen ? 'true' : 'false'}
      >
        <div className="pj-panel__inner">
          <div className="pj-panel__content">
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

          <div className="pj-actions">
            {hasStudy && (
              <a
                href={`/work/${studySlug}`}
                onClick={(e) => e.stopPropagation()}
                className="btn-primary"
              >
                {t.caseStudy.label}
              </a>
            )}

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
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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

        /* ── Square tile — cover + caption ──
           The tile reserves the square (aspect-ratio) before the image
           arrives, so the grid never shifts. It is the positioning context
           for the caption: when the detail panel below expands, the caption
           stays anchored to the cover instead of sliding down over the
           panel content. */
        .pj-tile {
          position: relative;
          aspect-ratio: 1 / 1;
        }

        .pj-cover {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: var(--surface);
          cursor: pointer;
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

        /* Typographic plate for projects without media. The mark sits in
           the upper area so the caption below never covers it. */
        .pj-cover[data-empty='true'] {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 16%;
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

        /* ── Caption — name, category, context, description, study link.
           Always visible; the gradient scrim keeps it readable over media. */
        .pj-caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
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

        .pj-caption__meta {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          min-width: 0;
        }

        .pj-category {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--on-accent);
          opacity: 0.66;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pj-context {
          flex: none;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--on-accent);
          opacity: 0.5;
          white-space: nowrap;
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

        .pj-desc {
          color: var(--on-accent);
          opacity: 0.78;
          font-size: 0.8rem;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pj-caption__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-top: 0.35rem;
        }

        .pj-study {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--on-accent);
          opacity: 0.85;
          transition:
            opacity var(--dur-base) var(--ease-out),
            gap var(--dur-base) var(--ease-out);
        }

        .pj-study:hover {
          opacity: 1;
          gap: 0.6rem;
        }

        .pj-study__arrow {
          transition: transform var(--dur-base) var(--ease-out);
        }

        .pj-study:hover .pj-study__arrow {
          transform: translateX(3px);
        }

        .pj-expand {
          display: inline-flex;
          flex: none;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(8, 8, 8, 0.35);
          color: var(--on-accent);
          cursor: pointer;
          transition:
            transform var(--dur-base) var(--ease-out),
            background-color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out);
        }

        .pj-expand:hover {
          background: rgba(8, 8, 8, 0.55);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .pj-card[data-open='true'] .pj-expand {
          transform: rotate(45deg);
        }

        /* ── Detail panel ──
           grid-template-rows 0fr → 1fr animates the height smoothly without
           a magic max-height. The inner fades in/out with the border. The
           padding and border live on a nested content wrapper so the row can
           collapse to a true 0 height when closed (padding on the animated
           element itself would leave a visible tail). */
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
          opacity: 0;
          transition: opacity var(--dur-base) var(--ease-out);
        }

        .pj-panel[data-open='true'] .pj-panel__inner {
          opacity: 1;
        }

        .pj-panel__content {
          padding: clamp(1.25rem, 2vw, 1.6rem);
          border-top: 1px solid var(--glass-border);
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

        .pj-actions {
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
        }

        /* ── Small tiles ──
           On phones the tiles are narrow; keep the caption readable by
           tightening the rhythm and letting the description breathe. */
        @media (max-width: 480px) {
          .pj-caption {
            gap: 0.35rem;
            padding: 0.9rem;
          }

          .pj-desc {
            -webkit-line-clamp: 1;
          }

          .pj-context {
            display: none;
          }

          .pj-expand {
            width: 26px;
            height: 26px;
          }
        }
      `}} />
    </article>
  );
}
