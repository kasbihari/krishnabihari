import { useState } from 'react';
import { useI18n } from '../../lib/client/i18n-store';
import { fallbackProjects } from '../../lib/portfolio-fallback';
import type { Lang } from '../../i18n';
import ProjectCard, {
  type Project,
  type ProjectStatus,
} from './ProjectCard';

type FilterValue = 'all' | ProjectStatus;

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
