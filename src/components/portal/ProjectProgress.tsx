import { motion } from 'framer-motion';

import type { ProjectCategory } from '../../lib/client/types';

import { getProjectCategoryConfig } from './projectCategoryConfig';

type ProjectProgressProps = {
  readonly progress: number;
  readonly phase: string;
  readonly status: string;
  readonly category: ProjectCategory;
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

const normalizePhase = (
  phase: string,
) => phase.trim().toLowerCase();

function getActiveStageIndex(
  stages: readonly string[],
  phase: string,
): number {
  const normalizedPhase =
    normalizePhase(phase);

  const exactIndex =
    stages.findIndex(
      (stage) =>
        normalizePhase(stage) ===
        normalizedPhase,
    );

  if (exactIndex >= 0) {
    return exactIndex;
  }

  const keywordIndex =
    stages.findIndex((stage) => {
      const normalizedStage =
        normalizePhase(stage);

      return (
        normalizedPhase.includes(
          normalizedStage,
        ) ||
        normalizedStage.includes(
          normalizedPhase,
        )
      );
    });

  if (keywordIndex >= 0) {
    return keywordIndex;
  }

  return 0;
}

export default function ProjectProgress({
  progress,
  phase,
  status,
  category,
}: ProjectProgressProps) {
  const normalizedProgress = Math.min(
    Math.max(progress, 0),
    100,
  );

  const categoryConfig =
    getProjectCategoryConfig(category);

  const stages =
    categoryConfig.stages;

  const activeStageIndex =
    getActiveStageIndex(
      stages,
      phase,
    );

  const currentPhase =
    phase?.trim() ||
    'Not specified';

  const currentStatus =
    status?.trim() ||
    'Status unavailable';

  return (
    <motion.section
      className="project-progress portal-card-hover"
      initial={{
        opacity: 0,
        y: 14,
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
        overflow: 'hidden',
        width: '100%',
        minWidth: 0,
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
      {/* Ambient glow */}
      <motion.div
        aria-hidden="true"
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
          duration: 0.9,
          ease,
        }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 100% 0%, rgba(65, 105, 80, 0.10), transparent 58%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minWidth: 0,
        }}
      >
        {/* Header */}
        <motion.div
          className="project-progress__header"
          initial={{
            opacity: 0,
            y: 8,
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
            delay: 0.08,
          }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                marginBottom: '0.5rem',
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--bronze)',
              }}
            >
              Project progress
            </div>

            <div
              style={{
                color: 'var(--text)',
                fontSize: '1rem',
                overflowWrap: 'anywhere',
              }}
            >
              {categoryConfig.label}
            </div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 7,
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
              delay: 0.14,
            }}
            style={{
              flex: '0 0 auto',
              fontSize:
                'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1,
              color:
                'var(--text)',
              fontFamily:
                'var(--font-body)',
              whiteSpace: 'nowrap',
            }}
          >
            {normalizedProgress}%
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-label="Project progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            normalizedProgress
          }
          style={{
            width: '100%',
            height: '10px',
            overflow: 'hidden',
            borderRadius: '999px',
            background:
              'var(--glass-2)',
            marginBottom: '1.5rem',
          }}
        >
          <motion.div
            initial={{
              width: '0%',
            }}
            whileInView={{
              width: `${normalizedProgress}%`,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.05,
              ease,
              delay: 0.16,
            }}
            style={{
              height: '100%',
              borderRadius: 'inherit',
              background:
                'linear-gradient(90deg, var(--verde-ink), var(--bronze-soft))',
            }}
          />
        </div>

        {/* Current phase */}
        <motion.div
          className="project-progress__current portal-hover-item"
          initial={{
            opacity: 0,
            y: 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          whileHover={{
            y: -2,
          }}
          transition={{
            duration: 0.4,
            ease,
            delay: 0.24,
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            padding:
              '0.85rem 1rem',
            borderRadius: '12px',
            border:
              '1px solid var(--glass-1)',
            background:
              'var(--glass-1)',
          }}
        >
          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                marginBottom:
                  '0.25rem',
                fontSize: '0.62rem',
                letterSpacing:
                  '0.12em',
                textTransform:
                  'uppercase',
                color:
                  'var(--text-soft)',
              }}
            >
              Current phase
            </div>

            <div
              style={{
                color:
                  'var(--text)',
                fontSize: '0.95rem',
                overflowWrap:
                  'anywhere',
              }}
            >
              {currentPhase}
            </div>
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
              delay: 0.3,
            }}
            style={{
              flex: '0 0 auto',
              padding:
                '0.4rem 0.65rem',
              borderRadius: '999px',
              border:
                '1px solid rgba(200,184,154,0.15)',
              background:
                'rgba(200,184,154,0.05)',
              color:
                'var(--bronze-soft)',
              fontSize: '0.62rem',
              letterSpacing: '0.08em',
              textTransform:
                'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {currentStatus}
          </motion.div>
        </motion.div>

        {/* Delivery stages */}
        <div>
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
              delay: 0.3,
            }}
            style={{
              marginBottom: '0.8rem',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform:
                'uppercase',
              color:
                'var(--text-soft)',
            }}
          >
            Delivery stages
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0.34,
                },
              },
            }}
            style={{
              display: 'flex',
              flexDirection:
                'column',
              gap: '0.65rem',
            }}
          >
            {stages.map(
              (stage, index) => {
                const isCompleted =
                  normalizedProgress >=
                    100 ||
                  index <
                    activeStageIndex;

                const isActive =
                  !isCompleted &&
                  index ===
                    activeStageIndex;

                return (
                  <motion.div
                    key={stage}
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: -8,
                      },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.4,
                          ease,
                        },
                      },
                    }}
                    whileHover={{
                      x: isActive
                        ? 3
                        : 1,
                    }}
                    className={
                      isActive
                        ? 'portal-hover-item'
                        : undefined
                    }
                    style={{
                      display: 'flex',
                      alignItems:
                        'center',
                      gap: '0.8rem',
                      minWidth: 0,
                      borderRadius: '10px',
                      padding:
                        '0.15rem 0',
                    }}
                  >
                    {/* Stage indicator */}
                    <motion.div
                      initial={{
                        scale: 0.82,
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
                        duration: 0.35,
                        ease,
                        delay:
                          0.38 +
                          index *
                            0.07,
                        ...(isActive
                          ? {
                              boxShadow: {
                                duration: 2.4,
                                repeat:
                                  Infinity,
                                ease: 'easeInOut',
                              },
                            }
                          : {}),
                      }}
                      animate={
                        isActive
                          ? {
                              boxShadow: [
                                '0 0 0 0 rgba(200,184,154,0)',
                                '0 0 0 6px rgba(200,184,154,0.05)',
                                '0 0 0 0 rgba(200,184,154,0)',
                              ],
                            }
                          : undefined
                      }
                      style={{
                        width: '28px',
                        height: '28px',
                        flex:
                          '0 0 28px',
                        display: 'grid',
                        placeItems:
                          'center',
                        borderRadius:
                          '50%',
                        border:
                          isCompleted
                            ? '1px solid var(--verde-ink)'
                            : isActive
                              ? '1px solid var(--bronze-soft)'
                              : '1px solid var(--glass-border)',
                        background:
                          isCompleted
                            ? 'rgba(80,160,110,0.10)'
                            : isActive
                              ? 'rgba(200,184,154,0.08)'
                              : 'var(--glass-1)',
                        color:
                          isCompleted
                            ? 'var(--verde-ink)'
                            : isActive
                              ? 'var(--bronze-soft)'
                              : 'var(--text-faint)',
                        fontSize:
                          '0.7rem',
                      }}
                    >
                      {isCompleted
                        ? '✓'
                        : index + 1}
                    </motion.div>

                    {/* Stage content */}
                    <div
                      className="project-progress__stage-content"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display:
                          'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'space-between',
                        gap: '1rem',
                      }}
                    >
                      <span
                        style={{
                          minWidth: 0,
                          color:
                            isCompleted ||
                            isActive
                              ? 'var(--text)'
                              : 'var(--text-faint)',
                          fontSize:
                            '0.88rem',
                          overflowWrap:
                            'anywhere',
                        }}
                      >
                        {stage}
                      </span>

                      <span
                        style={{
                          flex:
                            '0 0 auto',
                          fontSize:
                            '0.58rem',
                          letterSpacing:
                            '0.1em',
                          textTransform:
                            'uppercase',
                          color:
                            isCompleted
                              ? 'var(--verde-ink)'
                              : isActive
                                ? 'var(--bronze-soft)'
                                : 'var(--text-faint)',
                          whiteSpace:
                            'nowrap',
                        }}
                      >
                        {isCompleted
                          ? 'Complete'
                          : isActive
                            ? 'Current'
                            : 'Upcoming'}
                      </span>
                    </div>
                  </motion.div>
                );
              },
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .project-progress {
          transition:
            border-color 280ms ease,
            box-shadow 280ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );
        }

        .project-progress:hover {
          border-color:
            rgba(
              255,
              255,
              255,
              0.10
            ) !important;

          box-shadow:
            0 28px 60px
            rgba(
              0,
              0,
              0,
              0.2
            ) !important;
        }

        .project-progress__current {
          transition:
            border-color 220ms ease,
            background-color 220ms ease;
        }

        .project-progress__current:hover {
          border-color:
            rgba(
              255,
              255,
              255,
              0.09
            ) !important;

          background:
            rgba(
              255,
              255,
              255,
              0.026
            ) !important;
        }

        @media (max-width: 480px) {
          .project-progress__header {
            align-items:
              flex-end;
          }

          .project-progress__current {
            align-items:
              flex-start;
          }

          .project-progress__stage-content {
            align-items:
              flex-start !important;

            flex-direction:
              column;

            gap:
              0.15rem !important;
          }
        }

        @media (max-width: 380px) {
          .project-progress {
            border-radius:
              15px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-progress,
          .project-progress__current {
            transition: none !important;
          }
        }
      `}</style>
    </motion.section>
  );
}