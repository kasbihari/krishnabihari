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

        {/* Projects — large cinematic presentations */}
        <div className="pj-list">
          {filtered.length === 0 && <div className="pj-empty">{w.empty}</div>}

          {filtered.map((project, index) => {
            const isOpen = activeProject === project.id;

            const images = project.images === 'empty' ? [] : project.images;
            const hasImages = images.length > 0;

            const currentSlide = hasImages
              ? Math.min(slideIndexes[project.id] ?? 0, images.length - 1)
              : 0;

            const isLead = index === 0;

            return (
              <article
                key={project.id}
                className="pj-item"
                data-lead={isLead ? 'true' : 'false'}
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
                  {/* Number + category */}
                  <div className="pj-meta">
                    <span className="pj-number">{project.id}</span>
                    <span className="pj-rule" aria-hidden="true" />
                    <span className="pj-category" style={{ color: project.accent }}>
                      {project.category}
                    </span>
                    <StatusBadge
                      status={project.status}
                      label={project.status === 'done' ? w.shippedBadge : w.inProgressBadge}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="pj-title">{project.title}</h3>

                  {/* Tagline */}
                  <p className="pj-tagline">{project.tagline}</p>

                  {/* Stack preview — secondary info, revealed on interaction */}
                  <div className="pj-stack-preview" aria-hidden="true">
                    {project.stack.slice(0, 4).map((tech) => (
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

                {/* Expanded panel */}
                <div
                  id={`project-panel-${project.id}`}
                  className="pj-panel"
                  data-open={isOpen ? 'true' : 'false'}
                >
                  <div className="pj-panel__inner">
                    {/* Slideshow */}
                    {hasImages && (
                      <div className="pj-slides">
                        <img
                          src={images[currentSlide]}
                          alt={`${project.title} screenshot ${currentSlide + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="pj-slides__img"
                        />

                        {images.length > 1 && (
                          <>
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
                          </>
                        )}
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
          margin-bottom: clamp(4.5rem, 9vw, 8rem);
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

        .pj-list {
          display: flex;
          flex-direction: column;
        }

        .pj-empty {
          padding: 4rem 0;
          text-align: center;
          color: var(--text-faint);
          font-size: 0.9rem;
        }

        /* ── One project = one case study, given real room ──
           No rules or separators: spacing and scale do the structuring. */
        .pj-item {
          position: relative;
        }

        .pj-trigger {
          position: relative;
          padding: clamp(3.5rem, 8vw, 6.5rem) 0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: opacity var(--dur-slow) var(--ease-out);
        }

        .pj-item:first-child .pj-trigger {
          padding-top: 0;
        }

        .pj-item[data-open='false'] .pj-trigger:hover {
          opacity: 0.82;
        }

        .pj-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .pj-number {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--text-faint);
        }

        .pj-rule {
          width: 22px;
          height: 1px;
          background: var(--line);
        }

        .pj-category {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .pj-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.22rem 0.6rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--line-soft);
          color: var(--text-faint);
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
          font-size: clamp(2.2rem, 6vw, 4.2rem);
          font-weight: 400;
          line-height: 1.04;
          letter-spacing: -0.028em;
          color: var(--text);
          margin-bottom: 1.25rem;
          transition: color var(--dur-slow) var(--ease-out);
        }

        /* The flagship gets a genuinely different scale, not a bigger card. */
        .pj-item[data-lead='true'] .pj-title {
          font-size: clamp(2.8rem, 9vw, 6.5rem);
          letter-spacing: -0.035em;
        }

        .pj-tagline {
          max-width: 50ch;
          color: var(--text-faint);
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          line-height: 1.7;
        }

        .pj-stack-preview {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 1.75rem;
          opacity: 0.55;
          transition: opacity var(--dur-slow) var(--ease-out);
        }

        .pj-item[data-open='false'] .pj-trigger:hover .pj-stack-preview {
          opacity: 1;
        }

        .pj-stack-chip {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.06em;
          padding: 0.28rem 0.65rem;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius-pill);
          color: var(--text-faint);
          white-space: nowrap;
        }

        .pj-explore {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-faint);
          transition: color var(--dur-base) var(--ease-out);
        }

        .pj-item[data-open='false'] .pj-trigger:hover .pj-explore {
          color: var(--verde-ink);
        }

        .pj-plus {
          display: inline-flex;
          transition: transform var(--dur-base) var(--ease-out);
        }

        .pj-item[data-open='true'] .pj-plus {
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
          padding: 0 0 clamp(2.5rem, 5vw, 4rem);
          max-width: 900px;
          margin: 0 auto;
        }

        .pj-slides {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--glass-border);
          background: var(--surface);
          margin-bottom: 2.5rem;
        }

        .pj-slides__img {
          width: 100%;
          height: clamp(240px, 46vw, 520px);
          object-fit: cover;
          display: block;
        }

        .pj-slides__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid var(--glass-border);
          background: var(--glass-2);
          -webkit-backdrop-filter: blur(var(--glass-blur-1));
          backdrop-filter: blur(var(--glass-blur-1));
          color: var(--text);
          cursor: pointer;
          font-size: 1rem;
        }

        .pj-slides__nav--prev { left: 1rem; }
        .pj-slides__nav--next { right: 1rem; }

        .pj-slides__dots {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
        }

        .pj-slides__dot {
          width: 7px;
          height: 7px;
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: clamp(1.75rem, 4vw, 3rem);
          margin-bottom: 2.25rem;
        }

        .pj-panel__label {
          font-size: 0.64rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--bronze);
          margin-bottom: 0.85rem;
        }

        .pj-panel__body {
          color: var(--text-soft);
          line-height: 1.8;
          font-size: 0.94rem;
        }

        .pj-panel__body--soft {
          color: var(--text-faint);
        }

        .pj-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2.25rem;
        }

        .pj-actions {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .pj-trigger {
            padding: 2rem 0;
          }

          .pj-stack-preview {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}