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
    accent: 'var(--sand-light)',
    status: 'done',
    images: 'empty',
  },

  {
    id: '02',
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
    accent: 'var(--forest-bright)',
    status: 'done',
    images: 'empty',
  },

  // {
  //   id: '03',
  //   category: 'AI Automation',
  //   projectCategory: 'ai-automation',
  //   title: 'Veyro Agent',
  //   tagline:
  //     'AI-powered voice automation for inbound, outbound, and customer communication personalised at scale.',
  //   description:
  //     'Node.js and React platform for building AI-powered business receptionists and voice automations. Handles inbound and outbound calls through Twilio and ElevenLabs with configurable conversation flows, dynamic customer context, appointment scheduling, SMS actions, human handoff, call routing, and real-time monitoring. Designed as a reusable automation platform that can adapt to different businesses, workflows, and communication requirements.',
  //   outcome:
  //     'AI receptionist platform automating inbound and outbound business communication with real-time voice interaction, scheduling, customer actions, and workflow automation — active development.',
  //   architecture: [
  //     'Node.js',
  //     'React',
  //     'Twilio Voice API',
  //     'ElevenLabs Conversational AI',
  //     'WebSocket',
  //     'PostgreSQL',
  //     'Prisma ORM',
  //     'REST API',
  //   ],
  //   stack: [
  //     'Node.js',
  //     'React',
  //     'TypeScript',
  //     'Twilio',
  //     'ElevenLabs',
  //     'PostgreSQL',
  //     'Prisma',
  //   ],
  //   link: 'https://github.com/kasbihari/Veyro-Agent',
  //   accent: 'var(--muted-light)',
  //   status: 'in-progress',
  //   images: 'empty',
  // },
];

function StatusBadge({
  status,
  label,
}: Readonly<{ status: ProjectStatus; label: string }>) {
  const isDone = status === 'done';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.68rem',
        fontWeight: 500,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        padding: '0.2rem 0.55rem',
        borderRadius: '3px',
        border: `1px solid ${
          isDone
            ? 'color-mix(in srgb, var(--pine-ink) 45%, transparent)'
            : 'color-mix(in srgb, var(--brown) 45%, transparent)'
        }`,
        color: isDone
          ? 'var(--pine-ink)'
          : 'var(--brown)',
        background: isDone
          ? 'color-mix(in srgb, var(--pine-ink) 10%, transparent)'
          : 'color-mix(in srgb, var(--brown) 10%, transparent)',
      }}
    >
      <span
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: isDone
            ? 'var(--pine-ink)'
            : 'var(--brown)',
        }}
      />

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
    <section
      id="projects"
      className="section-padding"
    >
      <div className="container-main">

        {/* Header */}
        <div
          style={{
            marginBottom: '3rem',
            display: 'flex',
            justifyContent:
              'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <p className="section-label">
              {w.label}
            </p>

            <h2 className="text-section-title">
              {w.headingPart1}{' '}
              <em style={{ color: 'var(--pine-ink)', fontStyle: 'italic' }}>
                {w.headingPart2}
              </em>
            </h2>
          </div>

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {filters.map(
              ({ label, value }) => {
                const active =
                  filter === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setFilter(value);
                      setActiveProject(null);
                    }}
                    style={{
                      padding:
                        '0.45rem 1rem',
                      borderRadius:
                        '999px',
                      border: active
                        ? '1px solid var(--line-strong)'
                        : '1px solid var(--line-soft)',
                      background: active
                        ? 'var(--surface-2)'
                        : 'transparent',
                      color: active
                        ? 'var(--text)'
                        : 'var(--muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      textTransform:
                        'uppercase',
                      letterSpacing:
                        '0.05em',
                    }}
                  >
                    {label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Projects */}
        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
          }}
        >
          {filtered.length === 0 && (
            <div
              style={{
                padding: '3rem 0',
                textAlign: 'center',
                color: 'var(--muted-light)',
                fontSize: '0.9rem',
              }}
            >
              {w.empty}
            </div>
          )}

          {filtered.map((project) => {
            const isOpen =
              activeProject ===
              project.id;

            /*
             * Always turn the value into an array.
             * This keeps TypeScript happy and makes
             * the rest of the component much cleaner.
             */
            const images =
              project.images === 'empty'
                ? []
                : project.images;

            const hasImages =
              images.length > 0;

            const currentSlide =
              hasImages
                ? Math.min(
                    slideIndexes[
                      project.id
                    ] ?? 0,
                    images.length - 1,
                  )
                : 0;

            return (
              <div
                key={project.id}
              >
                <div
                  style={{
                    height: '1px',
                    background:
                      'var(--line-soft)',
                  }}
                />

                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={
                    isOpen
                  }
                  aria-controls={`project-panel-${project.id}`}
                  onClick={() =>
                    toggleProject(
                      project.id,
                      isOpen,
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                        'Enter' ||
                      e.key === ' '
                    ) {
                      e.preventDefault();

                      toggleProject(
                        project.id,
                        isOpen,
                      );
                    }
                  }}
                  style={{
                    padding: '2rem 0',
                    cursor: 'pointer',
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr auto',
                    gap: '1rem',
                  }}
                >
                  <div>

                    {/* Top */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems:
                          'center',
                        gap: '0.7rem',
                        flexWrap:
                          'wrap',
                        marginBottom:
                          '0.5rem',
                      }}
                    >
                      <p
                        style={{
                          fontSize:
                            '0.7rem',
                          textTransform:
                            'uppercase',
                          letterSpacing:
                            '0.1em',
                          color:
                            project.accent,
                          margin: 0,
                        }}
                      >
                        {
                          project.category
                        }
                      </p>

                      <StatusBadge
                        status={
                          project.status
                        }
                        label={
                          project.status === 'done'
                            ? w.shippedBadge
                            : w.inProgressBadge
                        }
                      />
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize:
                          'clamp(1.4rem, 3vw, 2.2rem)',
                        color:
                          'var(--soft-white)',
                        marginBottom:
                          '0.4rem',
                        lineHeight:
                          1.1,
                      }}
                    >
                      {
                        project.title
                      }
                    </h3>

                    {/* Tagline */}
                    <p
                      style={{
                        color:
                          'var(--muted-light)',
                        maxWidth:
                          '620px',
                        lineHeight:
                          1.7,
                      }}
                    >
                      {
                        project.tagline
                      }
                    </p>

                    {/* Expanded content */}
                    <div
                      id={`project-panel-${project.id}`}
                      style={{
                        overflow:
                          'hidden',
                        maxHeight:
                          isOpen
                            ? '3000px'
                            : '0',
                        opacity:
                          isOpen
                            ? 1
                            : 0,
                        transition:
                          'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      <div
                        style={{
                          paddingTop:
                            '2rem',
                        }}
                      >

                        {/* Slideshow */}
                        {hasImages && (
                          <div
                            style={{
                              position:
                                'relative',
                              width:
                                '100%',
                              borderRadius:
                                '18px',
                              overflow:
                                'hidden',
                              border:
                                '1px solid var(--line-soft)',
                              background:
                                'var(--bg-soft)',
                              marginBottom:
                                '2rem',
                            }}
                          >
                            <img
                              src={
                                images[
                                  currentSlide
                                ]
                              }
                              alt={`${project.title} screenshot ${
                                currentSlide + 1
                              }`}
                              loading="lazy"
                              decoding="async"
                              style={{
                                width:
                                  '100%',
                                height:
                                  '520px',
                                objectFit:
                                  'cover',
                                display:
                                  'block',
                              }}
                            />

                            {/* Previous button */}
                            {images.length >
                              1 && (
                              <button
                                type="button"
                                aria-label={w.prevImage}
                                onClick={(
                                  e,
                                ) => {
                                  e.stopPropagation();

                                  prevSlide(
                                    project.id,
                                    images.length,
                                  );
                                }}
                                style={{
                                  position:
                                    'absolute',
                                  top: '50%',
                                  left: '1rem',
                                  transform:
                                    'translateY(-50%)',
                                  width:
                                    '42px',
                                  height:
                                    '42px',
                                  borderRadius:
                                    '50%',
                                  border:
                                    '1px solid rgba(255,255,255,0.1)',
                                  background:
                                    'rgba(0,0,0,0.45)',
                                  color:
                                    'white',
                                  cursor:
                                    'pointer',
                                  backdropFilter:
                                    'blur(8px)',
                                  fontSize:
                                    '1rem',
                                }}
                              >
                                ←
                              </button>
                            )}

                            {/* Next button */}
                            {images.length >
                              1 && (
                              <button
                                type="button"
                                aria-label={w.nextImage}
                                onClick={(
                                  e,
                                ) => {
                                  e.stopPropagation();

                                  nextSlide(
                                    project.id,
                                    images.length,
                                  );
                                }}
                                style={{
                                  position:
                                    'absolute',
                                  top: '50%',
                                  right: '1rem',
                                  transform:
                                    'translateY(-50%)',
                                  width:
                                    '42px',
                                  height:
                                    '42px',
                                  borderRadius:
                                    '50%',
                                  border:
                                    '1px solid rgba(255,255,255,0.1)',
                                  background:
                                    'rgba(0,0,0,0.45)',
                                  color:
                                    'white',
                                  cursor:
                                    'pointer',
                                  backdropFilter:
                                    'blur(8px)',
                                  fontSize:
                                    '1rem',
                                }}
                              >
                                →
                              </button>
                            )}

                            {/* Dots */}
                            {images.length >
                              1 && (
                              <div
                                style={{
                                  position:
                                    'absolute',
                                  bottom:
                                    '1rem',
                                  left:
                                    '50%',
                                  transform:
                                    'translateX(-50%)',
                                  display:
                                    'flex',
                                  gap:
                                    '0.5rem',
                                }}
                              >
                                {images.map(
                                  (
                                    image,
                                    index,
                                  ) => (
                                    <button
                                      key={`${project.id}-${image}`}
                                      type="button"
                                      aria-label={`${w.goToImage} ${
                                        index + 1
                                      }`}
                                      onClick={(
                                        e,
                                      ) => {
                                        e.stopPropagation();

                                        setSlideIndexes(
                                          (
                                            prev,
                                          ) => ({
                                            ...prev,
                                            [project.id]:
                                              index,
                                          }),
                                        );
                                      }}
                                      style={{
                                        width:
                                          '8px',
                                        height:
                                          '8px',
                                        padding:
                                          0,
                                        borderRadius:
                                          '50%',
                                        border:
                                          'none',
                                        cursor:
                                          'pointer',
                                        background:
                                          currentSlide ===
                                          index
                                            ? 'white'
                                            : 'rgba(255,255,255,0.4)',
                                      }}
                                    />
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        <p
                          style={{
                            color:
                              'var(--muted-light)',
                            lineHeight:
                              1.8,
                            marginBottom:
                              '1.5rem',
                          }}
                        >
                          {
                            project.description
                          }
                        </p>

                        {/* Stack */}
                        <div
                          style={{
                            display:
                              'flex',
                            flexWrap:
                              'wrap',
                            gap: '0.5rem',
                            marginBottom:
                              '2rem',
                          }}
                        >
                          {project.stack.map(
                            (tech) => (
                              <span
                                key={
                                  tech
                                }
                                style={{
                                  padding:
                                    '0.3rem 0.7rem',
                                  border:
                                    '1px solid var(--line-soft)',
                                  borderRadius:
                                    '5px',
                                  fontSize:
                                    '0.75rem',
                                  color:
                                    'var(--muted-light)',
                                  fontFamily:
                                    'JetBrains Mono, monospace',
                                }}
                              >
                                {tech}
                              </span>
                            ),
                          )}
                        </div>

                        {/* Buttons */}
                        <div
                          style={{
                            display:
                              'flex',
                            gap:
                              '0.8rem',
                            flexWrap:
                              'wrap',
                          }}
                        >
                          <a
                            href={
                              project.link
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(
                              e,
                            ) =>
                              e.stopPropagation()
                            }
                            className="btn-secondary"
                          >
                            GitHub
                          </a>

                          {project.live && (
                            <a
                              href={
                                project.live
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(
                                e,
                              ) =>
                                e.stopPropagation()
                              }
                              className="btn-primary"
                            >
                              Live Site
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plus icon */}
                  <div
                    style={{
                      transform:
                        isOpen
                          ? 'rotate(45deg)'
                          : 'rotate(0deg)',
                      transition:
                        '0.3s',
                      color:
                        'var(--muted)',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}