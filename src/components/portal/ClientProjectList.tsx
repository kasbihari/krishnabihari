import { motion } from 'framer-motion';

import type {
  ClientRecord,
  ClientProjectSummary,
} from '../../lib/client/types';

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

const viewport = {
  once: true,
  amount: 0.12,
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease,
    },
  },
};

function initials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'CL';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] + parts[1][0]
  ).toUpperCase();
}

type ClientProjectListProps = {
  readonly client: ClientRecord;
  readonly projects: ClientProjectSummary[];
  readonly error?: string;
  readonly onOpenProject: (
    projectId: string,
  ) => void;
  readonly onLogout: () => void;
};

export default function ClientProjectList({
  client,
  projects,
  error,
  onOpenProject,
  onLogout,
}: ClientProjectListProps) {
  const clientName =
    client.name?.trim() || 'Client';

  const company =
    client.company?.trim() || '';

  const clientCode =
    client.client_code?.trim() || '';

  return (
    <>
      <style>{`
.client-projects {
width: 100%;
min-height: 100svh;
padding:
clamp(1rem, 3vw, 2rem)
clamp(0.85rem, 3vw, 1.25rem)
4rem;
}

    .client-projects__container {
      width: 100%;
      max-width: 1180px;
      margin: 0 auto;
    }

    .client-projects__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
      padding:
        clamp(1rem, 2.5vw, 1.2rem)
        clamp(1rem, 2.5vw, 1.25rem);
      border: 1px solid var(--line);
      border-radius: 18px;
      background: rgba(10, 10, 10, 0.78);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.14);
    }

    .client-projects__identity {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .client-projects__avatar {
      width: 46px;
      height: 46px;
      flex: 0 0 46px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      border: 1px solid var(--line);
      background: rgba(200, 184, 154, 0.08);
      color: var(--bronze-soft);
      font-weight: 600;
      font-size: 0.72rem;
      letter-spacing: 0.03em;
    }

    .client-projects__identity-copy {
      min-width: 0;
    }

    .client-projects__eyebrow {
      margin-bottom: 0.18rem;
      overflow: hidden;
      color: var(--bronze);
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-overflow: ellipsis;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .client-projects__title {
      margin: 0;
      color: var(--text);
      font-size: clamp(1.45rem, 4vw, 2.25rem);
      line-height: 1.08;
      overflow-wrap: anywhere;
    }

    .client-projects__meta {
      margin-top: 0.3rem;
      color: var(--text-faint);
      font-size: 0.78rem;
      overflow-wrap: anywhere;
    }

    .client-projects__code {
      color: var(--bronze-soft);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.04em;
    }

    .client-projects__logout {
      flex: 0 0 auto;
      min-height: 44px;
      min-width: 90px;
    }

    .client-projects__section-heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin: 0 0 1rem;
    }

    .client-projects__section-title {
      margin: 0;
      color: var(--text);
      font-size: clamp(1.15rem, 3vw, 1.5rem);
      letter-spacing: -0.01em;
    }

    .client-projects__section-count {
      color: var(--text-faint);
      font-size: 0.8rem;
    }

    .client-projects__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
      gap: 1.1rem;
    }

    .client-projects__card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      padding: clamp(1.1rem, 2.5vw, 1.4rem);
      border: 1px solid var(--line);
      border-radius: 18px;
      background: rgba(10, 10, 10, 0.78);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.14);
      text-align: left;
      cursor: pointer;
      overflow: hidden;
      transition:
        border-color 0.25s ease,
        transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 0.25s ease;
    }

    .client-projects__card:hover {
      border-color: rgba(200, 184, 154, 0.28);
      transform: translateY(-3px);
      box-shadow: 0 26px 55px rgba(0, 0, 0, 0.22);
    }

    .client-projects__card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .client-projects__card-name {
      margin: 0;
      color: var(--text);
      font-size: 1.12rem;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    .client-projects__card-code {
      margin-top: 0.35rem;
      color: var(--text-faint);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.64rem;
      letter-spacing: 0.04em;
      overflow-wrap: anywhere;
    }

    .client-projects__status {
      flex: 0 0 auto;
      padding: 0.3rem 0.6rem;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: rgba(200, 184, 154, 0.07);
      color: var(--bronze-soft);
      font-size: 0.62rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .client-projects__description {
      margin: 0;
      color: var(--text-faint);
      font-size: 0.88rem;
      line-height: 1.65;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .client-projects__progress-row {
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }

    .client-projects__progress-track {
      flex: 1;
      height: 6px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.06);
    }

    .client-projects__progress-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--verde-ink), var(--bronze-soft));
    }

    .client-projects__progress-value {
      flex: 0 0 auto;
      color: var(--text-soft);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
    }

    .client-projects__card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 0.35rem;
    }

    .client-projects__phase {
      color: var(--text-faint);
      font-size: 0.78rem;
    }

    .client-projects__open {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--bronze);
      font-size: 0.8rem;
      transition: gap 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .client-projects__card:hover .client-projects__open {
      gap: 0.6rem;
    }

    .client-projects__empty {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border: 1px dashed var(--line);
      border-radius: 18px;
      color: var(--text-faint);
      text-align: center;
      line-height: 1.8;
    }

    .client-projects__error {
      margin-bottom: 1rem;
      padding: 0.9rem 1.1rem;
      border: 1px solid rgba(255, 107, 107, 0.28);
      border-radius: 12px;
      background: rgba(255, 107, 107, 0.06);
      color: #ff6b6b;
      font-size: 0.85rem;
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .client-projects {
        padding-inline: 0.85rem;
        padding-bottom: 2.5rem;
      }

      .client-projects__header {
        align-items: stretch;
        flex-direction: column;
        gap: 1rem;
      }

      .client-projects__identity {
        width: 100%;
      }

      .client-projects__logout {
        width: 100%;
      }

      .client-projects__grid {
        gap: 0.85rem;
      }
    }

    @media (max-width: 430px) {
      .client-projects__avatar {
        width: 42px;
        height: 42px;
        flex-basis: 42px;
      }

      .client-projects__identity {
        gap: 0.7rem;
      }

      .client-projects__eyebrow {
        font-size: 0.58rem;
      }

      .client-projects__title {
        font-size: clamp(1.3rem, 7vw, 1.75rem);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .client-projects__card {
        transition: none;
      }
    }
  `}</style>

      <main className="client-projects">
        <div className="client-projects__container">
          <motion.header
            className="client-projects__header"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease,
            }}
          >
            <motion.div
              className="client-projects__identity"
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                ease,
                delay: 0.08,
              }}
            >
              <motion.div
                className="client-projects__avatar"
                initial={{
                  opacity: 0,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.45,
                  ease,
                  delay: 0.12,
                }}
              >
                {initials(clientName)}
              </motion.div>

              <div className="client-projects__identity-copy">
                <div className="client-projects__eyebrow">
                  Client workspace
                </div>

                <h1 className="client-projects__title">
                  {clientName}
                </h1>

                <div className="client-projects__meta">
                  {company && (
                    <span>{company} · </span>
                  )}

                  <span className="client-projects__code">
                    {clientCode}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={onLogout}
              className="btn-secondary client-projects__logout"
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                ease,
                delay: 0.18,
              }}
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.99,
              }}
              style={{
                background: 'transparent',
                border: '1px solid var(--line)',
                color: 'var(--text)',
              }}
            >
              Log out
            </motion.button>
          </motion.header>

          <motion.div
            className="client-projects__section-heading"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              ease,
              delay: 0.14,
            }}
          >
            <h2 className="client-projects__section-title">
              Projects
            </h2>

            <span className="client-projects__section-count">
              {projects.length}{' '}
              {projects.length === 1
                ? 'project'
                : 'projects'}
            </span>
          </motion.div>

          {error && (
            <motion.div
              role="alert"
              className="client-projects__error"
              initial={{
                opacity: 0,
                y: -4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                ease,
              }}
            >
              {error}
            </motion.div>
          )}

          {projects.length === 0 ? (
            <motion.div
              className="client-projects__empty"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                ease,
                delay: 0.18,
              }}
            >
              No projects are linked to this
              client yet. Please check back
              soon.
            </motion.div>
          ) : (
            <motion.div
              className="client-projects__grid"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {projects.map((project) => {
                const progress = Math.min(
                  Math.max(
                    typeof project.progress ===
                      'number'
                      ? project.progress
                      : 0,
                    0,
                  ),
                  100,
                );

                const status =
                  project.status?.trim() ||
                  'Active';

                const phase =
                  project.phase?.trim() ||
                  'Planning';

                const description =
                  project.description?.trim() ||
                  '';

                return (
                  <motion.button
                    key={project.id}
                    type="button"
                    className="client-projects__card"
                    variants={cardVariants}
                    onClick={() =>
                      onOpenProject(
                        project.id,
                      )
                    }
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    transition={{
                      duration: 0.2,
                      ease,
                    }}
                  >
                    <div className="client-projects__card-top">
                      <div>
                        <h3 className="client-projects__card-name">
                          {project.name}
                        </h3>

                        <div className="client-projects__card-code">
                          {project.project_code}
                        </div>
                      </div>

                      <span className="client-projects__status">
                        {status}
                      </span>
                    </div>

                    {description && (
                      <p className="client-projects__description">
                        {description}
                      </p>
                    )}

                    <div className="client-projects__progress-row">
                      <div className="client-projects__progress-track">
                        <div
                          className="client-projects__progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <span className="client-projects__progress-value">
                        {progress}%
                      </span>
                    </div>

                    <div className="client-projects__card-footer">
                      <span className="client-projects__phase">
                        {phase}
                      </span>

                      <span className="client-projects__open">
                        Open workspace
                        <span aria-hidden="true">
                          →
                        </span>
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
