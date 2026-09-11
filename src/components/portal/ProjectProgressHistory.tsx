import {
  motion,
} from 'framer-motion';

import type {
  ProjectProgressHistoryRecord,
} from '../../lib/client/types';

type ProjectProgressHistoryProps = {
  readonly history:
    readonly ProjectProgressHistoryRecord[];
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
    },
  );
}

function formatLongDate(
  value: string,
): string {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );
}

export default function ProjectProgressHistory({
  history,
}: ProjectProgressHistoryProps) {
  const points = [...history]
    .filter(
      (item) =>
        Number.isFinite(
          item.progress,
        ),
    )
    .sort(
      (a, b) =>
        new Date(
          a.recorded_at,
        ).getTime() -
        new Date(
          b.recorded_at,
        ).getTime(),
    );

  const latest =
    points.at(-1) ?? null;

  const previous =
    points.length > 1
      ? points.at(-2) ?? null
      : null;

  const progressDelta =
    latest && previous
      ? latest.progress -
        previous.progress
      : 0;

  const width = 760;
  const height = 260;

  const paddingX = 28;
  const paddingY = 24;

  const chartWidth =
    width - paddingX * 2;

  const chartHeight =
    height - paddingY * 2;

  const coordinatePoints =
    points.map(
      (point, index) => {
        const x =
          points.length === 1
            ? width / 2
            : paddingX +
              (index /
                (points.length - 1)) *
                chartWidth;

        const y =
          paddingY +
          ((100 -
            point.progress) /
            100) *
            chartHeight;

        return {
          ...point,
          x,
          y,
        };
      },
    );

  const path =
    coordinatePoints
      .map(
        (point, index) =>
          `${
            index === 0
              ? 'M'
              : 'L'
          } ${point.x} ${point.y}`,
      )
      .join(' ');

  const areaPath =
    coordinatePoints.length > 0
      ? `${path} L ${
          coordinatePoints.at(
            -1,
          )?.x ?? paddingX
        } ${
          height - paddingY
        } L ${
          coordinatePoints[0]?.x ??
          paddingX
        } ${
          height - paddingY
        } Z`
      : '';

  return (
    <motion.section
      className="project-progress-history portal-card-hover"
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
            'radial-gradient(100% 90% at 100% 0%, rgba(74, 124, 106, 0.07), transparent 62%)',
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
            duration: 0.45,
            ease,
            delay: 0.08,
          }}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent:
              'space-between',
            gap: '1rem',
            marginBottom: '1.2rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                marginBottom: '0.45rem',
                color: 'var(--bronze)',
                fontSize: '0.65rem',
                letterSpacing:
                  '0.14em',
                textTransform:
                  'uppercase',
              }}
            >
              Performance
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
              Progress history
            </h3>
          </div>

          {latest && (
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
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontSize:
                    '0.58rem',
                  letterSpacing:
                    '0.11em',
                  textTransform:
                    'uppercase',
                  color:
                    'var(--text-soft)',
                  marginBottom:
                    '0.25rem',
                }}
              >
                Current progress
              </div>

              <div
                style={{
                  color:
                    'var(--text)',
                  fontSize:
                    'clamp(1.7rem, 5vw, 2.4rem)',
                  lineHeight: 1,
                }}
              >
                {latest.progress}%
              </div>
            </motion.div>
          )}
        </motion.div>

        {points.length === 0 ? (
          <div
            className="portal-hover-item"
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border:
                '1px solid var(--glass-1)',
              background:
                'var(--glass-1)',
              color:
                'var(--text-faint)',
              fontSize: '0.84rem',
              lineHeight: 1.7,
            }}
          >
            Progress history will appear
            here as the project advances.
          </div>
        ) : (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.4,
                ease,
                delay: 0.12,
              }}
              style={{
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                role="img"
                aria-label="Project progress history chart"
                style={{
                  display: 'block',
                  overflow: 'visible',
                }}
              >
                {[0, 25, 50, 75, 100].map(
                  (value) => {
                    const y =
                      paddingY +
                      ((100 - value) /
                        100) *
                        chartHeight;

                    return (
                      <g key={value}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={
                            width -
                            paddingX
                          }
                          y2={y}
                          stroke="var(--glass-2)"
                          strokeWidth="1"
                        />

                        <text
                          x="0"
                          y={y + 4}
                          fill="var(--text-soft)"
                          fontSize="10"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  },
                )}

                {areaPath && (
                  <motion.path
                    d={areaPath}
                    fill="rgba(74,124,106,0.08)"
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
                      duration: 0.7,
                      ease,
                      delay: 0.55,
                    }}
                  />
                )}

                {path && (
                  <motion.path
                    d={path}
                    fill="none"
                    stroke="var(--verde-ink)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{
                      pathLength: 0,
                    }}
                    whileInView={{
                      pathLength: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 1.3,
                      ease,
                      delay: 0.2,
                    }}
                  />
                )}

                {coordinatePoints.map(
                  (
                    point,
                    index,
                  ) => (
                    <motion.g
                      key={point.id}
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        ease,
                        delay:
                          0.5 +
                          index * 0.08,
                      }}
                      style={{
                        transformOrigin:
                          `${point.x}px ${point.y}px`,
                      }}
                    >
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="rgba(21,15,10,0.95)"
                        stroke="var(--bronze-soft)"
                        strokeWidth="2"
                      />

                      <title>
                        {`${point.progress}% · ${point.phase} · ${formatLongDate(point.recorded_at)}`}
                      </title>
                    </motion.g>
                  ),
                )}
              </svg>
            </motion.div>

            <div
              className="progress-history__labels"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  `repeat(${Math.max(
                    points.length,
                    1,
                  )}, minmax(0, 1fr))`,
                gap: '0.4rem',
                marginTop: '0.25rem',
              }}
            >
              {points.map(
                (point) => (
                  <div
                    key={`${point.id}-label`}
                    style={{
                      color:
                        'var(--text-soft)',
                      fontSize:
                        '0.58rem',
                      textAlign:
                        'center',
                      whiteSpace:
                        'nowrap',
                    }}
                  >
                    {formatDate(
                      point.recorded_at,
                    )}
                  </div>
                ),
              )}
            </div>

            <motion.div
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
                duration: 0.5,
                ease,
                delay: 0.7,
              }}
              className="progress-history__summary"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3, minmax(0, 1fr))',
                gap: '0.7rem',
                marginTop: '1.2rem',
              }}
            >
              <div
                className="progress-history__metric portal-hover-item"
                style={{
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border:
                    '1px solid var(--glass-1)',
                  background:
                    'var(--glass-1)',
                }}
              >
                <div
                  style={{
                    marginBottom:
                      '0.3rem',
                    color:
                      'var(--text-soft)',
                    fontSize:
                      '0.58rem',
                    letterSpacing:
                      '0.1em',
                    textTransform:
                      'uppercase',
                  }}
                >
                  Current
                </div>

                <div
                  style={{
                    color:
                      'var(--text)',
                    fontSize:
                      '1.15rem',
                  }}
                >
                  {latest?.progress ?? 0}%
                </div>
              </div>

              <div
                className="progress-history__metric portal-hover-item"
                style={{
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border:
                    '1px solid var(--glass-1)',
                  background:
                    'var(--glass-1)',
                }}
              >
                <div
                  style={{
                    marginBottom:
                      '0.3rem',
                    color:
                      'var(--text-soft)',
                    fontSize:
                      '0.58rem',
                    letterSpacing:
                      '0.1em',
                    textTransform:
                      'uppercase',
                  }}
                >
                  Change
                </div>

                <div
                  style={{
                    color:
                      progressDelta >= 0
                        ? 'var(--verde-ink)'
                        : '#c8a050',
                    fontSize:
                      '1.15rem',
                  }}
                >
                  {progressDelta >= 0
                    ? '+'
                    : ''}
                  {progressDelta}%
                </div>
              </div>

              <div
                className="progress-history__metric portal-hover-item"
                style={{
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border:
                    '1px solid var(--glass-1)',
                  background:
                    'var(--glass-1)',
                }}
              >
                <div
                  style={{
                    marginBottom:
                      '0.3rem',
                    color:
                      'var(--text-soft)',
                    fontSize:
                      '0.58rem',
                    letterSpacing:
                      '0.1em',
                    textTransform:
                      'uppercase',
                  }}
                >
                  Latest phase
                </div>

                <div
                  style={{
                    color:
                      'var(--text)',
                    fontSize:
                      '0.9rem',
                    overflowWrap:
                      'anywhere',
                  }}
                >
                  {latest?.phase ??
                    'Project'}
                </div>
              </div>
            </motion.div>

            {latest?.note && (
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
                  duration: 0.45,
                  ease,
                  delay: 0.82,
                }}
                style={{
                  marginTop:
                    '0.8rem',
                  color:
                    'var(--text-faint)',
                  fontSize:
                    '0.78rem',
                  lineHeight: 1.7,
                }}
              >
                {latest.note}
              </motion.div>
            )}
          </>
        )}
      </div>

      <style>{`
        .progress-history__labels {
          min-width: 0;
        }

        @media (max-width: 620px) {
          .progress-history__summary {
            grid-template-columns:
              1fr !important;
          }
        }

        @media (max-width: 380px) {
          .project-progress-history {
            border-radius:
              15px !important;
          }
        }
      `}</style>
    </motion.section>
  );
}