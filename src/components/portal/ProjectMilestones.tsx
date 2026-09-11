import { motion } from 'framer-motion';

import type {
  ProjectMilestoneRecord,
} from '../../lib/client/types';

type ProjectMilestonesProps = {
  readonly milestones: readonly ProjectMilestoneRecord[];
};

const STATUS_CONFIG: Record<
  ProjectMilestoneRecord['status'],
  {
    readonly label: string;
    readonly color: string;
    readonly background: string;
    readonly border: string;
  }
> = {
  completed: {
    label: 'Completed',
    color: 'var(--verde-ink)',
    background:
      'rgba(74, 124, 106, 0.06)',
    border:
      'rgba(74, 124, 106, 0.18)',
  },

  active: {
    label: 'In progress',
    color: 'var(--bronze-soft)',
    background:
      'rgba(200, 184, 154, 0.06)',
    border:
      'rgba(200, 184, 154, 0.18)',
  },

  upcoming: {
    label: 'Upcoming',
    color: 'var(--text-soft)',
    background:
      'var(--glass-1)',
    border:
      'var(--glass-2)',
  },
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

function formatDate(
  value?: string,
): string {
  if (!value?.trim()) {
    return '';
  }

  const parsed = new Date(
    `${value}T00:00:00`,
  );

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return value;
  }

  return parsed.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );
}

export default function ProjectMilestones({
  milestones,
}: ProjectMilestonesProps) {
  const orderedMilestones =
    [...milestones].sort(
      (a, b) => a.order - b.order,
    );

  return (
    <motion.section
      data-reveal
      className="project-milestones portal-card-hover"
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
            'radial-gradient(120% 100% at 100% 0%, rgba(74, 124, 106, 0.06), transparent 58%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
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
            duration: 0.4,
            ease,
            delay: 0.06,
          }}
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'flex-end',
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
                color:
                  'var(--bronze)',
                fontSize:
                  '0.65rem',
                letterSpacing:
                  '0.14em',
                textTransform:
                  'uppercase',
              }}
            >
              Delivery
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
              Milestones
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
              color:
                'var(--text-soft)',
              fontSize:
                '0.62rem',
              letterSpacing:
                '0.1em',
              textTransform:
                'uppercase',
            }}
          >
            {orderedMilestones.length}{' '}
            {orderedMilestones.length ===
            1
              ? 'Milestone'
              : 'Milestones'}
          </motion.div>
        </motion.div>

        {orderedMilestones.length ===
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
              duration: 0.4,
              ease,
              delay: 0.14,
            }}
            style={{
              padding: '1rem',
              borderRadius:
                '12px',
              border:
                '1px solid var(--glass-1)',
              background:
                'var(--glass-1)',
              color:
                'var(--text-faint)',
              fontSize:
                '0.84rem',
              lineHeight: 1.7,
            }}
          >
            No milestones have
            been added to this
            project yet.
          </motion.div>
        ) : (
          <motion.div
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
              gap: '0.75rem',
            }}
          >
            {orderedMilestones.map(
              (
                milestone,
                index,
              ) => {
                const config =
                  STATUS_CONFIG[
                    milestone.status
                  ];

                const formattedDate =
                  formatDate(
                    milestone.date,
                  );

                const isLast =
                  index ===
                  orderedMilestones.length -
                    1;

                const isActive =
                  milestone.status ===
                  'active';

                return (
                  <motion.article
                    key={milestone.id}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 8,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.42,
                          ease,
                        },
                      },
                    }}
                    whileHover={{
                      y: -2,
                      transition: {
                        duration: 0.2,
                        ease,
                      },
                    }}
                    style={{
                      position:
                        'relative',
                      display: 'grid',
                      gridTemplateColumns:
                        '42px minmax(0, 1fr)',
                      gap: '0.8rem',
                      padding:
                        '0.85rem 0',
                    }}
                  >
                    {!isLast && (
                      <motion.span
                        aria-hidden="true"
                        initial={{
                          scaleY: 0,
                          opacity: 0,
                        }}
                        whileInView={{
                          scaleY: 1,
                          opacity: 1,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.45,
                          ease,
                          delay:
                            0.18 +
                            index *
                              0.06,
                        }}
                        style={{
                          position:
                            'absolute',
                          left: '20px',
                          top: '46px',
                          bottom: '-10px',
                          width: '1px',
                          background:
                            'var(--glass-3)',
                          transformOrigin:
                            'top center',
                        }}
                      />
                    )}

                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.82,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.38,
                        ease,
                        delay:
                          0.16 +
                          index *
                            0.06,
                      }}
                      animate={
                        isActive
                          ? {
                              boxShadow: [
                                `0 0 0 0 ${config.background}`,
                                `0 0 0 5px ${config.background}`,
                                `0 0 0 0 ${config.background}`,
                              ],
                            }
                          : undefined
                      }
                      style={{
                        position:
                          'relative',
                        zIndex: 1,
                        width: '38px',
                        height: '38px',
                        display: 'grid',
                        placeItems:
                          'center',
                        borderRadius:
                          '50%',
                        border: `1px solid ${config.border}`,
                        background:
                          config.background,
                        color:
                          config.color,
                        fontSize:
                          '0.7rem',
                        fontWeight: 500,
                        alignSelf:
                          'start',
                      }}
                    >
                      {milestone.status ===
                      'completed'
                        ? '✓'
                        : String(
                            index + 1,
                          ).padStart(
                            2,
                            '0',
                          )}
                    </motion.div>

                    <div
                      style={{
                        minWidth: 0,
                        paddingBottom:
                          isLast
                            ? 0
                            : '0.35rem',
                      }}
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'flex-start',
                          gap: '0.75rem',
                          marginBottom:
                            '0.35rem',
                          flexWrap:
                            'wrap',
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            minWidth: 0,
                            color:
                              'var(--text)',
                            fontSize:
                              '0.95rem',
                            lineHeight:
                              1.35,
                            overflowWrap:
                              'anywhere',
                          }}
                        >
                          {
                            milestone.title
                          }
                        </h4>

                        {formattedDate && (
                          <time
                            dateTime={
                              milestone.date
                            }
                            style={{
                              flex:
                                '0 0 auto',
                              color:
                                'var(--text-soft)',
                              fontSize:
                                '0.6rem',
                              letterSpacing:
                                '0.05em',
                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            {
                              formattedDate
                            }
                          </time>
                        )}
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
                          duration: 0.32,
                          ease,
                          delay:
                            0.28 +
                            index *
                              0.06,
                        }}
                        style={{
                          marginBottom:
                            milestone
                              .description
                              .trim()
                              ? '0.45rem'
                              : 0,
                          color:
                            config.color,
                          fontSize:
                            '0.58rem',
                          fontWeight: 500,
                          letterSpacing:
                            '0.1em',
                          textTransform:
                            'uppercase',
                        }}
                      >
                        {
                          config.label
                        }
                      </motion.div>

                      {milestone.description
                        .trim() && (
                        <p
                          style={{
                            margin: 0,
                            color:
                              'var(--text-faint)',
                            fontSize:
                              '0.82rem',
                            lineHeight:
                              1.7,
                            overflowWrap:
                              'anywhere',
                          }}
                        >
                          {
                            milestone.description
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
        .project-milestones {
          transition:
            border-color 220ms
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
              ),
            transform 220ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );
        }

        .project-milestones:hover {
          border-color:
            rgba(
              255,
              255,
              255,
              0.1
            );

          box-shadow:
            0 24px 55px
            rgba(
              0,
              0,
              0,
              0.18
            );
        }

        @media (max-width: 520px) {
          .project-milestones time {
            flex-basis: 100% !important;
          }
        }

        @media (max-width: 380px) {
          .project-milestones {
            border-radius: 15px !important;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .project-milestones {
            transition: none;
          }
        }
      `}</style>
    </motion.section>
  );
}