import { useState } from 'react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';

type ProjectStatus = 'done' | 'in-progress';

type ProjectCategory =
  | 'web-development'
  | 'web-redesign'
  | 'saas'
  | 'ai-tool'
  | 'ai-automation';

type FilterValue = 'all' | ProjectStatus;

type Project = {
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

const fallbackProjects: Project[] = [
  {
    id: '01',
    category: 'AI Receptionist & Automation',
    projectCategory: 'ai-automation',
    title: 'Veyro Agent',
    tagline:
      'AI-powered voice automation for inbound, outbound, and customer communication personalised at scale.',
    description:
      'Node.js and React platform for building AI-powered business receptionists and voice automations. Handles inbound and outbound calls through Twilio and ElevenLabs with configurable conversation flows, dynamic customer context, appointment scheduling, SMS actions, human handoff, call routing, and real-time monitoring. Designed as a reusable automation platform that can adapt to different businesses, workflows, and communication requirements.',
    outcome:
      'AI receptionist platform automating inbound and outbound business communication with real-time voice interaction, scheduling, customer actions, and workflow automation — active development.',
    architecture: [
      'Node.js',
      'React',
      'Twilio Voice API',
      'ElevenLabs Conversational AI',
      'WebSocket',
      'PostgreSQL',
      'Prisma ORM',
      'REST API',
    ],
    stack: [
      'Node.js',
      'React',
      'TypeScript',
      'Twilio',
      'ElevenLabs',
      'PostgreSQL',
      'Prisma',
    ],
    link: 'https://github.com/kasbihari/Veyro-Agent',
    accent: 'var(--verde-ink)',
    status: 'in-progress',
    images: 'empty',
  },

  {
    id: '02',
    category: 'Full-Stack Web App',
    projectCategory: 'web-development',
    title: 'Budget Buddy',
    tagline:
      'Personal finance manager with a premium dashboard, smart categorisation, and a full reporting engine.',
    description:
      'End-to-end finance platform built with Symfony 6 and Chart.js. Handles transaction management, budget categorisation, role-based user and admin access, and rich data visualisation all delivered through a clean, premium interface. Designed with real users in mind: fast, secure, and intuitive.',
    outcome:
      'Full production deployment with secure authentication, real-time reporting, and granular admin controls.',
    architecture: [
      'Symfony 6',
      'Twig',
      'Doctrine ORM',
      'Chart.js',
      'MySQL',
      'REST API',
      'Role-based access control',
    ],
    stack: [
      'Symfony',
      'PHP',
      'Twig',
      'Chart.js',
      'MySQL',
      'Doctrine ORM',
    ],
    link: 'https://github.com/kasbihari/Budget-Buddy',
    accent: 'var(--bronze-soft)',
    status: 'done',
    images: 'empty',
  },

  {
    id: '03',
    category: 'Full-Stack Data Platform',
    projectCategory: 'web-development',
    title: 'SDG Dashboard',
    tagline:
      'Real-time UN Sustainable Development Goals tracker with live KPI visualisation.',
    description:
      'Comprehensive data platform built with Next.js 14 and TypeScript. Tracks live SDG KPIs through interactive charts, includes full user authentication, and supports CSV data export all backed by MySQL with Prisma ORM. Built to demonstrate how API-keys can make complex data accessible and actionable.',
    outcome:
      'Complete full-stack system: authentication, live KPI tracking, and a full data export pipeline.',
    architecture: [
      'Next.js 14',
      'TypeScript',
      'Prisma ORM',
      'MySQL',
      'NextAuth',
      'Recharts',
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'Prisma',
      'MySQL',
      'NextAuth',
    ],
    link: 'https://github.com/kasbihari/SDG-Dashboard',
    accent: 'var(--bronze-soft)',
    status: 'done',
    images: 'empty',
  },
];

function StatusBadge({
  status,
  label,
}: Readonly<{ status: ProjectStatus; label: string }>) {
  const isDone = status === 'done';

  return (
    <span className="pj-badge" data-status={isDone ? 'done' : 'progress'}>
      <span className="pj-badge__dot" />
      {label}
    </span>
  );
}

export default function Projects({
  projects,
  lang: initialLang = 'en',
}: {
  projects?: Project[];
  lang?: Lang;
}) {
  const { t } = useI18n(initialLang);
  const w = t.work;

  const filters: { label: string; value: FilterValue }[] = [
    { label: w.all, value: 'all' },
    { label: w.shipped, value: 'done' },
    { label: w.inProgress, value: 'in-progress' },
  ];

  const [activeProject, setActiveProject] = useState<string | null>(
    null,
  );

  const [filter, setFilter] =
    useState<FilterValue>('all');

  const [slideIndexes, setSlideIndexes] = useState<
    Record<string, number>
  >({});

  const visibleProjects =
    projects && projects.length > 0
      ? projects
      : fallbackProjects;

  const filtered =
    filter === 'all'
      ? visibleProjects
      : visibleProjects.filter(
          (project) =>
            project.status === filter,
        );

  const nextSlide = (
    projectId: string,
    total: number,
  ) => {
    if (total <= 0) return;

    setSlideIndexes((prev) => ({
      ...prev,
      [projectId]:
        ((prev[projectId] ?? 0) + 1) %
        total,
    }));
  };

  const prevSlide = (
    projectId: string,
    total: number,
  ) => {
    if (total <= 0) return;

    setSlideIndexes((prev) => ({
      ...prev,
      [projectId]:
        ((prev[projectId] ?? 0) - 1 + total) %
        total,
    }));
  };

  const toggleProject = (
    projectId: string,
    isOpen: boolean,
  ) => {
    setActiveProject(
      isOpen ? null : projectId,
    );
  };

  return (
    <section id="projects" className="section-padding">
      <div className="container-wide">
        {/* Header — centered on the axis */}
        <div className="pj-header" data-reveal>
          <p className="section-label section-label--center">{w.label}</p>

          <h2 className="text-section-title pj-header__title">
            {w.headingPart1}{' '}
            <em className="pj-header__accent">{w.headingPart2}</em>
          </h2>

          <div className="pj-filters" role="group" aria-label={w.label}>
            {filters.map(({ label, value }) => {
              const active = filter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFilter(value);
                    setActiveProject(null);
                  }}
                  aria-pressed={active}
                  className="pj-filter"
                  data-active={active ? 'true' : 'false'}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects — responsive card grid */}
        <div className="pj-grid">
          {filtered.length === 0 && <div className="pj-empty">{w.empty}</div>}

          {filtered.map((project) => {
            const isOpen = activeProject === project.id;

            const images = project.images === 'empty' ? [] : project.images;
            const hasImages = images.length > 0;

            const currentSlide = hasImages
              ? Math.min(slideIndexes[project.id] ?? 0, images.length - 1)
              : 0;

            return (
              <article
                key={project.id}
                className="pj-card"
                data-open={isOpen ? 'true' : 'false'}
                data-reveal
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`project-panel-${project.id}`}
                  onClick={() => toggleProject(project.id, isOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleProject(project.id, isOpen);
                    }
                  }}
                  className="pj-trigger"
                >
                  {/* Cover — real screenshot when one exists, otherwise a
                      typographic plate so the grid keeps a consistent rhythm. */}
                  <div className="pj-cover" data-empty={hasImages ? 'false' : 'true'}>
                    {hasImages ? (
                      <img
                        src={images[currentSlide]}
                        alt={`${project.title} screenshot ${currentSlide + 1}`}
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

                    <span className="pj-cover__badge">
                      <StatusBadge
                        status={project.status}
                        label={project.status === 'done' ? w.shippedBadge : w.inProgressBadge}
                      />
                    </span>
                  </div>

                  {/* Body */}
                  <div className="pj-card__body">
                    <div className="pj-meta">
                      <span className="pj-number">{project.id}</span>
                      <span className="pj-rule" aria-hidden="true" />
                      <span className="pj-category" style={{ color: project.accent }}>
                        {project.category}
                      </span>
                    </div>

                    <h3 className="pj-title">{project.title}</h3>

                    <p className="pj-tagline">{project.tagline}</p>

                    <div className="pj-stack-preview" aria-hidden="true">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="pj-stack-chip">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="pj-explore">
                      {isOpen ? w.close : w.explore}
                      <span className="pj-plus" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 4v12M4 10h12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </span>
                  </div>
                </div>

                {/* Expanded panel */}
                <div
                  id={`project-panel-${project.id}`}
                  className="pj-panel"
                  data-open={isOpen ? 'true' : 'false'}
                >
                  <div className="pj-panel__inner">
                    {/* Slideshow — only when there is more than the cover */}
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
                            prevSlide(project.id, images.length);
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
                            nextSlide(project.id, images.length);
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
                                setSlideIndexes((prev) => ({
                                  ...prev,
                                  [project.id]: i,
                                }));
                              }}
                              className="pj-slides__dot"
                              data-active={currentSlide === i ? 'true' : 'false'}
                            />
                          ))}
                        </div>
                      </div>
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

                    {/* Stack */}
                    <div className="pj-stack">
                      {project.stack.map((tech) => (
                        <span key={tech} className="pj-stack-chip">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pj-actions">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-secondary"
                      >
                        GitHub
                      </a>

                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="btn-primary"
                        >
                          Live Site
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .pj-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: clamp(3.5rem, 7vw, 6rem);
        }

        .pj-header__title {
          margin-top: 1.75rem;
          max-width: 22ch;
        }

        .pj-header__accent {
          font-style: italic;
          color: var(--text-faint);
        }

        .pj-filters {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 2.5rem;
        }

        .pj-filter {
          padding: 0.45rem 1.1rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line-soft);
          background: transparent;
          color: var(--text-faint);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          transition:
            color var(--dur-base) var(--ease-out),
            border-color var(--dur-base) var(--ease-out),
            background var(--dur-base) var(--ease-out);
        }

        .pj-filter[data-active='true'] {
          border-color: var(--glass-border-hover);
          background: var(--glass-2);
          color: var(--text);
        }

        .pj-filter:hover[data-active='false'] {
          color: var(--text-soft);
          border-color: var(--line);
        }

        /* ── Grid ──
           Mobile 1 · small tablet 2 · desktop 3 · wide 4.
           auto-fit with a min track keeps the columns honest at every
           width without a stack of breakpoints. */
        .pj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: clamp(1.25rem, 2.5vw, 2rem);
          align-items: start;
        }

        .pj-empty {
          grid-column: 1 / -1;
          padding: 4rem 0;
          text-align: center;
          color: var(--text-faint);
          font-size: 0.9rem;
        }

        /* ── Card ── */
        .pj-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          background: var(--glass-1);
          -webkit-backdrop-filter: blur(var(--glass-blur-1));
          backdrop-filter: blur(var(--glass-blur-1));
          overflow: hidden;
          transition:
            border-color var(--dur-base) var(--ease-out),
            transform var(--dur-base) var(--ease-out);
        }

        .pj-card:hover {
          border-color: var(--glass-border-hover);
          transform: translateY(-3px);
        }

        .pj-card[data-open='true'] {
          border-color: var(--glass-border-hover);
        }

        .pj-trigger {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          flex: 1;
        }

        /* ── Cover ── */
        .pj-cover {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: var(--surface);
          border-bottom: 1px solid var(--glass-border);
        }

        .pj-cover__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform var(--dur-slow) var(--ease-out);
        }

        .pj-card:hover .pj-cover__img {
          transform: scale(1.03);
        }

        /* Typographic plate for projects without a screenshot. */
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

        .pj-cover__badge {
          position: absolute;
          top: 0.85rem;
          right: 0.85rem;
        }

        .pj-cover__badge .pj-badge {
          background: var(--glass-2);
          -webkit-backdrop-filter: blur(var(--glass-blur-1));
          backdrop-filter: blur(var(--glass-blur-1));
        }

        /* ── Card body ── */
        .pj-card__body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: clamp(1.25rem, 2vw, 1.6rem);
        }

        .pj-meta {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          flex-wrap: wrap;
          margin-bottom: 0.9rem;
        }

        .pj-number {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          color: var(--text-faint);
        }

        .pj-rule {
          width: 18px;
          height: 1px;
          background: var(--line);
        }

        .pj-category {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .pj-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.22rem 0.6rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line-soft);
          color: var(--text-faint);
          white-space: nowrap;
        }

        .pj-badge__dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
        }

        .pj-badge[data-status='done'] {
          color: var(--verde-ink);
          border-color: color-mix(in srgb, var(--verde-ink) 32%, transparent);
        }

        .pj-badge[data-status='progress'] {
          color: var(--bronze-soft);
          border-color: color-mix(in srgb, var(--bronze-soft) 32%, transparent);
        }

        .pj-title {
          font-family: var(--font-display);
          font-size: clamp(1.35rem, 2vw, 1.7rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 0.7rem;
          transition: color var(--dur-base) var(--ease-out);
        }

        .pj-card:hover .pj-title {
          color: var(--verde-ink);
        }

        .pj-tagline {
          color: var(--text-faint);
          font-size: 0.9rem;
          line-height: 1.65;
          /* Keep every card's footer aligned regardless of copy length. */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pj-stack-preview {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 1.1rem;
          opacity: 0.6;
          transition: opacity var(--dur-base) var(--ease-out);
        }

        .pj-card:hover .pj-stack-preview {
          opacity: 1;
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

        .pj-explore {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 1.4rem;
          font-size: 0.64rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-faint);
          transition: color var(--dur-base) var(--ease-out);
        }

        .pj-card:hover .pj-explore {
          color: var(--verde-ink);
        }

        .pj-plus {
          display: inline-flex;
          transition: transform var(--dur-base) var(--ease-out);
        }

        .pj-card[data-open='true'] .pj-plus {
          transform: rotate(45deg);
        }

        /* ── Panel ── */
        .pj-panel {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition:
            max-height var(--dur-slow) var(--ease-out),
            opacity var(--dur-slow) var(--ease-out);
        }

        .pj-panel[data-open='true'] {
          max-height: 3200px;
          opacity: 1;
        }

        .pj-panel__inner {
          padding: clamp(1.25rem, 2vw, 1.6rem);
          border-top: 1px solid var(--glass-border);
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

        .pj-actions {
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
        }

        /* ── Column counts ──
           auto-fit already collapses to one column on phones; these
           breakpoints pin the intended 2 / 3 / 4 progression. */
        @media (min-width: 640px) {
          .pj-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .pj-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1440px) {
          .pj-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
}