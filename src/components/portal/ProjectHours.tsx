import { motion } from 'framer-motion';

type ProjectHoursType = {
  readonly used: number;
  readonly allocated: number;
  readonly remaining: number;
};

type ProjectHoursProps = {
  readonly hours: ProjectHoursType;
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

export default function ProjectHours({
  hours,
}: ProjectHoursProps) {
  const usedPct =
    hours.allocated > 0
      ? Math.min(
          (hours.used /
            hours.allocated) *
            100,
          100,
        )
      : 0;

  const metrics = [
    {
      label: 'Hours used',
      value: `${hours.used}h`,
    },
    {
      label: 'Allocated',
      value: `${hours.allocated}h`,
    },
    {
      label: 'Remaining',
      value: `${hours.remaining}h`,
    },
  ];

  return (
    <motion.section
      data-reveal
      className="project-hours"
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
        background:
          'var(--glass-2)',
        borderRadius: '18px',
        padding:
          'clamp(1.1rem, 3vw, 1.5rem)',
        boxShadow:
          '0 20px 45px rgba(0, 0, 0, 0.14)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 100% 0%, rgba(200, 184, 154, 0.05), transparent 60%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.p
          initial={{
            opacity: 0,
            y: 5,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.35,
            ease,
            delay: 0.05,
          }}
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--bronze)',
            marginBottom: '1.25rem',
          }}
        >
          Hours overview
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.07,
                delayChildren: 0.08,
              },
            },
          }}
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(3, minmax(0, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          {metrics.map((item) => (
            <motion.div
              key={item.label}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 8,
                  scale: 0.985,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    ease,
                  },
                },
              }}
              whileHover={{
                y: -2,
                scale: 1.01,
                transition: {
                  duration: 0.18,
                  ease,
                },
              }}
              className="project-hours__metric"
              style={{
                minWidth: 0,
                border:
                  '1px solid var(--glass-1)',
                background:
                  'var(--glass-1)',
                borderRadius: '12px',
                padding: '0.8rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  textTransform:
                    'uppercase',
                  color:
                    'var(--text-soft)',
                  marginBottom: '0.25rem',
                  overflowWrap:
                    'anywhere',
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  fontSize: '1.2rem',
                  color:
                    'var(--text)',
                  lineHeight: 1.2,
                }}
              >
                {item.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.55rem',
            }}
          >
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing:
                  '0.1em',
                textTransform:
                  'uppercase',
                color:
                  'var(--text-soft)',
              }}
            >
              Usage
            </span>

            <span
              style={{
                fontSize: '0.68rem',
                color:
                  'var(--text-soft)',
                whiteSpace:
                  'nowrap',
              }}
            >
              {Math.round(usedPct)}%
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '10px',
              borderRadius: '999px',
              background:
                'var(--glass-2)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{
                width: 0,
              }}
              whileInView={{
                width: `${usedPct}%`,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.9,
                ease,
                delay: 0.18,
              }}
              style={{
                height: '100%',
                borderRadius:
                  'inherit',
                background:
                  'linear-gradient(90deg, var(--bronze-soft), var(--verde-ink))',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .project-hours {
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

        .project-hours:hover {
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

          transform:
            translateY(-1px);
        }

        .project-hours__metric {
          transition:
            border-color 180ms ease,
            background-color 180ms ease;
        }

        .project-hours__metric:hover {
          border-color:
            rgba(
              200,
              184,
              154,
              0.14
            );

          background:
            rgba(
              255,
              255,
              255,
              0.028
            );
        }

        @media (max-width: 640px) {
          .project-hours__metric {
            padding: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .project-hours > div {
            min-width: 0;
          }
        }

        @media (max-width: 400px) {
          .project-hours {
            border-radius: 15px;
          }

          .project-hours__metric {
            padding: 0.7rem;
          }

          .project-hours__metric
            > div:last-child {
            font-size: 1.05rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .project-hours,
          .project-hours__metric {
            transition: none;
          }
        }
      `}</style>
    </motion.section>
  );
}