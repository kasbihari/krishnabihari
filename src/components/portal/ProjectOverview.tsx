import type { ProjectCategory } from '../../lib/client/types';

type ProjectOverviewItem = {
  readonly name: string;
  readonly category: ProjectCategory;
  readonly type: string;
  readonly status: string;
  readonly phase: string;
  readonly progress: number;
  readonly expectedLaunch: string;
  readonly description: string;
  readonly liveDemoUrl?: string | null;
};

type ProjectOverviewProps = {
  readonly project: ProjectOverviewItem;
};

type CategoryConfig = {
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
};

const CATEGORY_CONFIG: Record<
  ProjectCategory,
  CategoryConfig
> = {
  'web-development': {
    label: 'Web Development',
    shortLabel: 'Web',
    description:
      'Custom website development and digital experiences.',
  },

  'web-redesign': {
    label: 'Web Redesign',
    shortLabel: 'Redesign',
    description:
      'A visual and functional redesign of an existing website.',
  },

  saas: {
    label: 'SaaS',
    shortLabel: 'SaaS',
    description:
      'A software product built for ongoing use and scalability.',
  },

  'ai-tool': {
    label: 'AI Tool',
    shortLabel: 'AI Tool',
    description:
      'An AI-powered product or intelligent software experience.',
  },

  'ai-automation': {
    label: 'AI Automation',
    shortLabel: 'AI Automation',
    description:
      'An automated workflow designed to reduce manual processes.',
  },

  demo: {
    label: 'Demo Workspace',
    shortLabel: 'Demo',
    description:
      'A demonstration project workspace used for testing and preview purposes.',
  },
};

const normalizeCategory = (
  category: ProjectCategory,
): ProjectCategory => {
  switch (category) {
    case 'web-development':
      return 'web-development';

    case 'web-redesign':
      return 'web-redesign';

    case 'saas':
      return 'saas';

    case 'ai-tool':
      return 'ai-tool';

    case 'ai-automation':
      return 'ai-automation';

    case 'demo':
      return 'demo';

    default:
      return 'web-development';
  }
};

const isValidDemoUrl = (
  value?: string | null,
): value is string => {
  if (!value?.trim()) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === 'https:' ||
      url.protocol === 'http:'
    );
  } catch {
    return false;
  }
};

export default function ProjectOverview({
  project,
}: ProjectOverviewProps) {
  const categoryKey = normalizeCategory(
    project.category,
  );

  const category =
    CATEGORY_CONFIG[categoryKey];

  const progress = Math.min(
    Math.max(project.progress, 0),
    100,
  );

  const expectedLaunch =
    project.expectedLaunch?.trim() ||
    'Not scheduled';

  const projectStatus =
    project.status?.trim() ||
    'Status unavailable';

  const projectPhase =
    project.phase?.trim() ||
    'Not specified';

  const projectDescription =
    project.description?.trim() ||
    'Project information is currently unavailable.';

  const showLiveDemo =
    isValidDemoUrl(project.liveDemoUrl);

  const metaItems = [
    {
      label: 'Category',
      value: category.label,
    },
    {
      label: 'Current phase',
      value: projectPhase,
    },
    {
      label: 'Current status',
      value: projectStatus,
    },
    {
      label: 'Expected launch',
      value: expectedLaunch,
    },
  ];

  return (
    <section
      data-portal-reveal
      className="project-overview"
    >
      <div
        className="project-overview__glow"
        aria-hidden="true"
      />

      <div className="project-overview__content">
        <div className="project-overview__header">
          <div className="project-overview__identity">
            <p className="project-overview__eyebrow">
              Project overview
            </p>

            <h3 className="project-overview__title">
              {project.name}
            </h3>
          </div>

          <div className="project-overview__badge">
            <span
              aria-hidden="true"
              className="project-overview__badge-dot"
            />

            <span>
              {category.label}
            </span>
          </div>
        </div>

        <div className="project-overview__meta-grid">
          {metaItems.map((item) => (
            <div
              key={item.label}
              className="project-overview__meta-item"
            >
              <div className="project-overview__meta-label">
                {item.label}
              </div>

              <div className="project-overview__meta-value">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="project-overview__category">
          <div className="project-overview__category-label">
            Project category
          </div>

          <div className="project-overview__category-description">
            {category.description}
          </div>
        </div>

        <div className="project-overview__progress-header">
          <div className="project-overview__progress-label">
            Overall progress
          </div>

          <div className="project-overview__progress-value">
            {progress}%
          </div>
        </div>

        <div
          role="progressbar"
          aria-label="Project progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="project-overview__progress-track"
        >
          <div
            className="project-overview__progress-fill"
            style={
              {
                '--progress-width': `${progress}%`,
              } as React.CSSProperties
            }
          />
        </div>

        <p className="project-overview__description">
          {projectDescription}
        </p>

        {showLiveDemo && (
          <div className="project-overview__actions">
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-overview__demo-button btn-primary"
              aria-label={`View live demo for ${project.name}`}
            >
              <span>
                View Live Demo
              </span>

              <span
                aria-hidden="true"
                className="project-overview__demo-icon"
              >
                ↗
              </span>
            </a>
          </div>
        )}
      </div>

      <style>{`
        /*
         * Main container
         *
         * IMPORTANT:
         * No transform on hover.
         * The entire card stays completely still.
         */
        .project-overview {
          position: relative;
          width: 100%;
          min-width: 0;
          overflow: hidden;
          border:
            1px solid
            var(--line);
          border-radius: 18px;
          background:
            var(--glass-2);
          box-shadow:
            0 20px 45px
            rgba(0, 0, 0, 0.18);
        }

        /*
         * Ambient glow remains static.
         */
        .project-overview__glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              120% 100% at 0% 0%,
              rgba(
                200,
                184,
                154,
                0.08
              ),
              transparent 58%
            );
          opacity: 0.75;
          transition:
            opacity 350ms ease;
        }

        /*
         * Only the glow reacts to interaction.
         * The card itself does not move.
         */
        .project-overview:hover
        .project-overview__glow {
          opacity: 1;
        }

        .project-overview__content {
          position: relative;
          z-index: 1;
          padding:
            clamp(
              1.1rem,
              3vw,
              1.5rem
            );
        }

        .project-overview__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .project-overview__identity {
          min-width: 0;
          flex: 1 1 260px;
        }

        .project-overview__eyebrow {
          margin: 0 0 0.75rem;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--bronze);
        }

        .project-overview__title {
          margin: 0;
          font-size:
            clamp(
              1.55rem,
              3vw,
              2.3rem
            );
          line-height: 1.1;
          color: var(--text);
          overflow-wrap: anywhere;
        }

        /*
         * Badge
         *
         * No movement.
         * Only color/background changes.
         */
        .project-overview__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding:
            0.5rem
            0.75rem;
          border:
            1px solid
            rgba(
              200,
              184,
              154,
              0.18
            );
          border-radius: 999px;
          background:
            rgba(
              200,
              184,
              154,
              0.06
            );
          color: var(--bronze-soft);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          transition:
            background-color 220ms ease,
            border-color 220ms ease;
        }

        .project-overview__badge:hover {
          background:
            rgba(
              200,
              184,
              154,
              0.09
            );

          border-color:
            rgba(
              200,
              184,
              154,
              0.25
            );
        }

        .project-overview__badge-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background:
            var(--bronze-soft);
          box-shadow:
            0 0 0 4px
            rgba(
              200,
              184,
              154,
              0.08
            );
          animation:
            project-overview-pulse
            2.8s
            ease-in-out
            infinite;
        }

        /*
         * Meta cards
         *
         * Slight lift is allowed here,
         * but NOT on the main container.
         */
        .project-overview__meta-grid {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .project-overview__meta-item {
          min-width: 0;
          padding:
            0.85rem
            1rem;
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.05
            );
          border-radius: 12px;
          background:
            rgba(
              255,
              255,
              255,
              0.02
            );
          transition:
            transform 200ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            border-color 200ms ease,
            background-color 200ms ease;
        }

        .project-overview__meta-item:hover {
          transform:
            translateY(-2px);

          border-color:
            rgba(
              255,
              255,
              255,
              0.09
            );

          background:
            rgba(
              255,
              255,
              255,
              0.028
            );
        }

        .project-overview__meta-label {
          margin-bottom: 0.35rem;
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-soft);
        }

        .project-overview__meta-value {
          font-size: 0.96rem;
          line-height: 1.45;
          color: var(--text);
          overflow-wrap: anywhere;
        }

        /*
         * Category information
         *
         * Again: no movement on the outer card.
         */
        .project-overview__category {
          margin-bottom: 1.5rem;
          padding:
            0.95rem
            1rem;
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.05
            );
          border-radius: 12px;
          background:
            rgba(
              255,
              255,
              255,
              0.018
            );
          transition:
            border-color 220ms ease,
            background-color 220ms ease;
        }

        .project-overview__category:hover {
          border-color:
            rgba(
              255,
              255,
              255,
              0.08
            );

          background:
            rgba(
              255,
              255,
              255,
              0.025
            );
        }

        .project-overview__category-label {
          margin-bottom: 0.35rem;
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-soft);
        }

        .project-overview__category-description {
          color: var(--text);
          font-size: 0.95rem;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .project-overview__progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .project-overview__progress-label {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-soft);
        }

        .project-overview__progress-value {
          font-size: 1.5rem;
          color: var(--text);
          font-family:
            var(--font-body);
          white-space: nowrap;
        }

        .project-overview__progress-track {
          width: 100%;
          height: 10px;
          margin-bottom: 1.1rem;
          border-radius: 999px;
          background:
            rgba(
              255,
              255,
              255,
              0.05
            );
          overflow: hidden;
        }

        .project-overview__progress-fill {
          width:
            var(--progress-width);
          height: 100%;
          transform-origin:
            left center;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              var(--verde-ink),
              var(--bronze-soft)
            );
          animation:
            project-overview-progress
            900ms
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            250ms
            both;
        }

        .project-overview__description {
          margin: 0;
          max-width: 60ch;
          color: var(--text-faint);
          font-size: 0.98rem;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .project-overview__actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .project-overview__demo-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
          text-decoration: none;
          transition:
            transform 220ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            box-shadow 220ms ease;
        }

        .project-overview__demo-button:hover {
          transform:
            translateY(-2px);
        }

        .project-overview__demo-icon {
          display: inline-block;
          transition:
            transform 220ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );
        }

        .project-overview__demo-button:hover
        .project-overview__demo-icon {
          transform:
            translate3d(
              2px,
              -2px,
              0
            );
        }

        @keyframes project-overview-progress {
          from {
            transform:
              scaleX(0);
          }

          to {
            transform:
              scaleX(1);
          }
        }

        @keyframes project-overview-pulse {
          0%,
          100% {
            opacity: 0.75;

            box-shadow:
              0 0 0 4px
              rgba(
                200,
                184,
                154,
                0.08
              );
          }

          50% {
            opacity: 1;

            box-shadow:
              0 0 0 6px
              rgba(
                200,
                184,
                154,
                0.04
              );
          }
        }

        @media (max-width: 560px) {
          .project-overview__meta-grid {
            grid-template-columns:
              1fr;

            gap: 0.7rem;
          }

          .project-overview__header {
            margin-bottom:
              1.2rem;
          }

          .project-overview__progress-header {
            align-items:
              flex-end;
          }

          .project-overview__actions {
            width: 100%;
          }

          .project-overview__demo-button {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .project-overview {
            border-radius:
              15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-overview__badge,
          .project-overview__meta-item,
          .project-overview__category,
          .project-overview__demo-button,
          .project-overview__demo-icon {
            transition: none !important;
          }

          .project-overview__badge-dot,
          .project-overview__progress-fill {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}