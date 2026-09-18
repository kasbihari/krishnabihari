import { useState } from 'react';
import { useI18n } from '../../lib/client/i18n-store';
import type { Lang } from '../../i18n';
import ProjectCard, {
  type Project,
  type ProjectStatus,
} from './ProjectCard';

type FilterValue = 'all' | ProjectStatus;

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

  const [activeProject, setActiveProject] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterValue>('all');

  const [slideIndexes, setSlideIndexes] = useState<Record<string, number>>({});

  const visibleProjects =
    projects && projects.length > 0
      ? projects
      : fallbackProjects;

  const filtered =
    filter === 'all'
      ? visibleProjects
      : visibleProjects.filter(
          (project) => project.status === filter,
        );

  const nextSlide = (projectId: string, total: number) => {
    if (total <= 0) return;

    setSlideIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) + 1) % total,
    }));
  };

  const prevSlide = (projectId: string, total: number) => {
    if (total <= 0) return;

    setSlideIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) - 1 + total) % total,
    }));
  };

  const goToSlide = (projectId: string, index: number) => {
    setSlideIndexes((prev) => ({ ...prev, [projectId]: index }));
  };

  const toggleProject = (projectId: string, isOpen: boolean) => {
    setActiveProject(isOpen ? null : projectId);
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

        {/* Projects — square tile gallery.
            Mobile 2 · tablet 3 · desktop 4. The breakpoints are chosen so
            cards never shrink below a comfortable gallery size; wide
            displays keep 4 columns and grow the tiles instead. */}
        <div className="pj-grid">
          {filtered.length === 0 && <div className="pj-empty">{w.empty}</div>}

          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isOpen={activeProject === project.id}
              slideIndex={slideIndexes[project.id] ?? 0}
              lang={initialLang}
              onToggle={toggleProject}
              onNextSlide={nextSlide}
              onPrevSlide={prevSlide}
              onGoToSlide={goToSlide}
            />
          ))}
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
           2 columns from the smallest phone; 3 from tablet width; 4 from
           laptop width. Between breakpoints the tiles simply grow, so the
           square rhythm stays consistent on every screen. */
        .pj-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(0.9rem, 2.2vw, 2rem);
          align-items: start;
        }

        @media (min-width: 768px) {
          .pj-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 1200px) {
          .pj-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .pj-empty {
          grid-column: 1 / -1;
          padding: 4rem 0;
          text-align: center;
          color: var(--text-faint);
          font-size: 0.9rem;
        }
      `}</style>
    </section>
  );
}
