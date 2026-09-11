import { motion } from 'framer-motion';

import type { ProjectUpdateRecord } from '../../lib/client/types';

type ProjectUpdatesProps = {
  readonly updates: readonly ProjectUpdateRecord[];
};

const UPDATE_TYPE_LABELS: Record<
  string,
  string
> = {
  progress: 'Progress',
  milestone: 'Milestone',
  design: 'Design',
  development: 'Development',
  testing: 'Testing',
  launch: 'Launch',
  general: 'Update',
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

function getUpdateTypeLabel(
  updateType: string,
): string {
  const normalized = updateType
    .trim()
    .toLowerCase();

  return (
    UPDATE_TYPE_LABELS[normalized] ||
    updateType.trim() ||
    'Update'
  );
}

function formatUpdateDate(
  value?: string,
): string {
  if (!value) {
    return 'Recently';
  }

  const parsedDate = new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return 'Recently';
  }

  const now = new Date();

  const diffMs =
    now.getTime() -
    parsedDate.getTime();

  const diffMinutes = Math.floor(
    diffMs / (1000 * 60),
  );

  const diffHours = Math.floor(
    diffMs /
      (1000 * 60 * 60),
  );

  const diffDays = Math.floor(
    diffMs /
      (1000 * 60 * 60 * 24),
  );

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min${
      diffMinutes === 1
        ? ''
        : 's'
    } ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${
      diffHours === 1
        ? ''
        : 's'
    } ago`;
  }

  if (diffDays < 7) {
    return `${diffDays} day${
      diffDays === 1
        ? ''
        : 's'
    } ago`;
  }

  return parsedDate.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year:
        parsedDate.getFullYear() !==
        now.getFullYear()
          ? 'numeric'
          : undefined,
    },
  );
}

function getUpdateAccent(
  updateType: string,
): {
  readonly dot: string;
  readonly border: string;
  readonly background: string;
} {
  switch (
    updateType.trim().toLowerCase()
  ) {
    case 'milestone':
      return {
        dot: 'var(--verde-ink)',
        border:
          'rgba(74, 124, 106, 0.22)',
        background:
          'rgba(74, 124, 106, 0.06)',
      };

    case 'development':
      return {
        dot: 'var(--bronze-soft)',
        border:
          'rgba(200, 184, 154, 0.2)',
        background:
          'rgba(200, 184, 154, 0.06)',
      };

    case 'design':
      return {
        dot: 'var(--bronze)',
        border:
          'rgba(200, 184, 154, 0.16)',
        background:
          'rgba(200, 184, 154, 0.04)',
      };

    case 'testing':
      return {
        dot: 'var(--verde-ink)',
        border:
          'rgba(74, 124, 106, 0.18)',
        background:
          'rgba(74, 124, 106, 0.05)',
      };

    case 'launch':
      return {
        dot: 'var(--text)',
        border:
          'var(--line)',
        background:
          'var(--glass-2)',
      };

    default:
      return {
        dot: 'var(--text-soft)',
        border:
          'var(--glass-border)',
        background:
          'var(--glass-1)',
      };
  }
}

export default function ProjectUpdates({
  updates,
}: ProjectUpdatesProps) {
  const visibleUpdates =
    updates
      .filter(
        (update) =>
          update.published !== false &&
          update.title.trim()
            .length > 0,
      )
      .slice(0, 6);

  return (
    <>
      <motion.section
        data-reveal
        className="project-updates portal-card-hover"
        initial={{
          opacity: 0,
          y: 10,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.12,
        }}
        transition={{
          duration: 0.55,
          ease,
        }}
        style={{
          position: 'relative',
          width: '100%',
          minWidth: 0,
          overflow: 'hidden',
          border:
            '1px solid var(--line)',
          borderRadius: '18px',
          background:
            'var(--glass-2)',
          padding:
            'clamp(1.1rem, 3vw, 1.5rem)',
          boxShadow:
            '0 20px 45px rgba(0, 0, 0, 0.16)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(120% 100% at 0% 0%, rgba(200, 184, 154, 0.06), transparent 58%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            className="project-updates__header"
            initial={{
              opacity: 0,
              y: 6,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.4,
              ease,
              delay: 0.06,
            }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent:
                'space-between',
              gap: '1rem',
              marginBottom:
                '1.35rem',
            }}
          >
            <div>
              <div
                style={{
                  marginBottom:
                    '0.45rem',
                  fontSize: '0.65rem',
                  letterSpacing:
                    '0.14em',
                  textTransform:
                    'uppercase',
                  color: 'var(--bronze)',
                }}
              >
                Project updates
              </div>

              <h3
                style={{
                  margin: 0,
                  color:
                    'var(--text)',
                  fontSize:
                    'clamp(1.35rem, 3vw, 1.75rem)',
                  lineHeight: 1.1,
                }}
              >
                Latest activity
              </h3>
            </div>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.35,
                ease,
                delay: 0.12,
              }}
              style={{
                flex: '0 0 auto',
                fontSize: '0.65rem',
                color:
                  'var(--text-soft)',
                letterSpacing:
                  '0.1em',
                textTransform:
                  'uppercase',
              }}
            >
              {visibleUpdates.length}{' '}
              {visibleUpdates.length ===
              1
                ? 'Update'
                : 'Updates'}
            </motion.div>
          </motion.div>

          {visibleUpdates.length ===
          0 ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 6,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.45,
                ease,
                delay: 0.16,
              }}
              style={{
                padding: '1rem',
                borderRadius:
                  '12px',
                border:
                  '1px solid var(--glass-1)',
                background:
                  'var(--glass-1)',
              }}
            >
              <div
                style={{
                  marginBottom:
                    '0.35rem',
                  color:
                    'var(--text)',
                  fontSize:
                    '0.92rem',
                }}
              >
                No project updates
                yet.
              </div>

              <div
                style={{
                  color:
                    'var(--text-faint)',
                  fontSize:
                    '0.84rem',
                  lineHeight: 1.7,
                }}
              >
                New project activity
                will appear here as
                your workspace
                progresses.
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="project-updates__list"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.075,
                    delayChildren: 0.14,
                  },
                },
              }}
              style={{
                display: 'grid',
                gap: '0.8rem',
              }}
            >
              {visibleUpdates.map(
                (
                  update,
                  index,
                ) => {
                  const accent =
                    getUpdateAccent(
                      update.update_type,
                    );

                  const isLatest =
                    index === 0;

                  return (
                    <motion.article
                      key={update.id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 8,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration:
                              0.42,
                            ease,
                          },
                        },
                      }}
                      whileHover={{
                        y: -2,
                        transition: {
                          duration:
                            0.2,
                          ease,
                        },
                      }}
                      className={
                        isLatest
                          ? 'project-updates__item project-updates__item--latest'
                          : 'project-updates__item'
                      }
                      style={{
                        position:
                          'relative',
                        display: 'grid',
                        gridTemplateColumns:
                          '34px minmax(0, 1fr)',
                        gap: '0.85rem',
                        padding:
                          '0.9rem 1rem',
                        borderRadius:
                          '12px',
                        border: `1px solid ${
                          isLatest
                            ? accent.border
                            : 'var(--glass-1)'
                        }`,
                        background:
                          isLatest
                            ? accent.background
                            : 'var(--glass-1)',
                      }}
                    >
                      <motion.div
                        initial={{
                          scale: 0.8,
                          opacity: 0,
                        }}
                        whileInView={{
                          scale: 1,
                          opacity: 1,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration:
                            0.35,
                          ease,
                          delay:
                            0.2 +
                            index *
                              0.06,
                        }}
                        aria-hidden="true"
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'grid',
                          placeItems:
                            'center',
                          borderRadius:
                            '50%',
                          border: `1px solid ${accent.border}`,
                          background:
                            'var(--glass-1)',
                          marginTop:
                            '0.1rem',
                        }}
                      >
                        <motion.span
                          animate={
                            isLatest
                              ? {
                                  scale: [
                                    1,
                                    1.08,
                                    1,
                                  ],
                                }
                              : undefined
                          }
                          transition={
                            isLatest
                              ? {
                                  duration:
                                    2.4,
                                  ease: 'easeInOut',
                                  repeat:
                                    Infinity,
                                }
                              : undefined
                          }
                          style={{
                            width:
                              '7px',
                            height:
                              '7px',
                            borderRadius:
                              '50%',
                            background:
                              accent.dot,
                            boxShadow: `0 0 0 5px ${accent.background}`,
                          }}
                        />
                      </motion.div>

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >
                        <div
                          className="project-updates__item-header"
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'baseline',
                            justifyContent:
                              'space-between',
                            gap: '0.75rem',
                            flexWrap:
                              'wrap',
                            marginBottom:
                              '0.35rem',
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap:
                                '0.55rem',
                              minWidth:
                                0,
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                color:
                                  'var(--text)',
                                fontSize:
                                  '0.96rem',
                                lineHeight:
                                  1.35,
                                overflowWrap:
                                  'anywhere',
                              }}
                            >
                              {update.title}
                            </h4>

                            {isLatest && (
                              <motion.span
                                initial={{
                                  opacity: 0,
                                  scale: 0.9,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                transition={{
                                  duration:
                                    0.3,
                                  ease,
                                  delay:
                                    0.35,
                                }}
                                style={{
                                  flex:
                                    '0 0 auto',
                                  padding:
                                    '0.2rem 0.45rem',
                                  borderRadius:
                                    '999px',
                                  border:
                                    '1px solid rgba(200,184,154,0.16)',
                                  background:
                                    'rgba(200,184,154,0.05)',
                                  color:
                                    'var(--bronze-soft)',
                                  fontSize:
                                    '0.52rem',
                                  letterSpacing:
                                    '0.1em',
                                  textTransform:
                                    'uppercase',
                                }}
                              >
                                Latest
                              </motion.span>
                            )}
                          </div>

                          <time
                            dateTime={
                              update.created_at
                            }
                            style={{
                              flex:
                                '0 0 auto',
                              color:
                                'var(--text-soft)',
                              fontSize:
                                '0.62rem',
                              letterSpacing:
                                '0.05em',
                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            {formatUpdateDate(
                              update.created_at,
                            )}
                          </time>
                        </div>

                        <motion.div
                          initial={{
                            opacity: 0,
                          }}
                          whileInView={{
                            opacity: 1,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration:
                              0.35,
                            ease,
                            delay:
                              0.28 +
                              index *
                                0.06,
                          }}
                          style={{
                            marginBottom:
                              '0.5rem',
                            color:
                              accent.dot,
                            fontSize:
                              '0.58rem',
                            fontWeight: 500,
                            letterSpacing:
                              '0.1em',
                            textTransform:
                              'uppercase',
                          }}
                        >
                          {getUpdateTypeLabel(
                            update.update_type,
                          )}
                        </motion.div>

                        {update.description
                          .trim() && (
                          <p
                            style={{
                              margin: 0,
                              color:
                                'var(--text-faint)',
                              fontSize:
                                '0.84rem',
                              lineHeight:
                                1.7,
                              overflowWrap:
                                'anywhere',
                            }}
                          >
                            {
                              update.description
                            }
                          </p>
                        )}
                      </div>
                    </motion.article>
                  );
                },
              )}
            </motion.div>
          )}
        </div>

        <style>{`
          .project-updates__item {
            transition:
              border-color 220ms
                cubic-bezier(
                  0.16,
                  1,
                  0.3,
                  1
                ),
              background 220ms
                cubic-bezier(
                  0.16,
                  1,
                  0.3,
                  1
                ),
              box-shadow 220ms
                cubic-bezier(
                  0.16,
                  1,
                  0.3,
                  1
                );
          }

          .project-updates__item:hover {
            border-color:
              rgba(
                255,
                255,
                255,
                0.1
              ) !important;

            box-shadow:
              0 12px 32px
              rgba(
                0,
                0,
                0,
                0.12
              );
          }

          .project-updates__item--latest:hover {
            border-color:
              rgba(
                200,
                184,
                154,
                0.28
              ) !important;
          }

          .project-updates__item-header time {
            text-align: right;
          }

          @media (max-width: 560px) {
            .project-updates__header {
              align-items:
                flex-start !important;
              flex-direction:
                column;
            }

            .project-updates__item-header {
              align-items:
                flex-start !important;
              flex-direction:
                column;
              gap:
                0.45rem !important;
            }

            .project-updates__item-header time {
              text-align:
                left;
            }
          }

          @media (max-width: 380px) {
            .project-updates {
              border-radius:
                15px !important;
            }
          }

          @media (
            prefers-reduced-motion: reduce
          ) {
            .project-updates__item {
              transition: none;
            }
          }
        `}</style>
      </motion.section>
    </>
  );
}