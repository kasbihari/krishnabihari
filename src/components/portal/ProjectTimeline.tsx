import { motion } from 'framer-motion';

type TimelineItem = {
  readonly title: string;
  readonly description: string;
  readonly status:
    | 'completed'
    | 'active'
    | 'upcoming';
  readonly date: string;
};

type ProjectTimelineProps = {
  readonly items: readonly TimelineItem[];
};

const statusStyles: Record<
  'completed' | 'active' | 'upcoming',
  {
    readonly dot: string;
    readonly ring: string;
    readonly label: string;
  }
> = {
  completed: {
    dot: 'var(--forest-bright)',
    ring: 'rgba(74, 124, 106, 0.22)',
    label: 'Completed',
  },

  active: {
    dot: 'var(--sand-light)',
    ring: 'rgba(200, 184, 154, 0.22)',
    label: 'In progress',
  },

  upcoming: {
    dot: 'rgba(255,255,255,0.2)',
    ring: 'rgba(255,255,255,0.05)',
    label: 'Upcoming',
  },
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

export default function ProjectTimeline({
  items,
}: ProjectTimelineProps) {
  return (
    <motion.section
      data-reveal
      className="project-timeline"
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
          '1px solid var(--border-mid)',
        background:
          'rgba(21, 15, 10, 0.78)',
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
            'radial-gradient(120% 100% at 0% 0%, rgba(74, 124, 106, 0.05), transparent 60%)',
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
            color: 'var(--sand)',
            marginBottom: '1.25rem',
          }}
        >
          Timeline
        </motion.p>

        {items.length === 0 ? (
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
              delay: 0.1,
            }}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border:
                '1px solid rgba(255,255,255,0.05)',
              background:
                'rgba(255,255,255,0.018)',
              color: 'var(--muted)',
              fontSize: '0.84rem',
              lineHeight: 1.7,
            }}
          >
            No timeline items have been added yet.
          </motion.div>
        ) : (
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
                  staggerChildren: 0.075,
                  delayChildren: 0.1,
                },
              },
            }}
            style={{
              display: 'grid',
              gap: '0.8rem',
            }}
          >
            {items.map((item, index) => {
              const style =
                statusStyles[item.status];

              const isActive =
                item.status === 'active';

              const isLast =
                index === items.length - 1;

              return (
                <motion.div
                  key={`${item.title}-${index}`}
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
                    x: 2,
                    transition: {
                      duration: 0.18,
                      ease,
                    },
                  }}
                  className="project-timeline__item"
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns:
                      '20px minmax(0, 1fr) auto',
                    gap: '0.9rem',
                    alignItems: 'start',
                    padding:
                      '0.85rem 0',
                    borderBottom: isLast
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.05)',
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
                          0.2 +
                          index * 0.06,
                      }}
                      style={{
                        position:
                          'absolute',
                        left: '7px',
                        top: '1.65rem',
                        bottom: '-0.7rem',
                        width: '1px',
                        background:
                          'rgba(255,255,255,0.07)',
                        transformOrigin:
                          'top center',
                      }}
                    />
                  )}

                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.78,
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
                      delay:
                        0.16 +
                        index * 0.06,
                    }}
                    animate={
                      isActive
                        ? {
                            boxShadow: [
                              `0 0 0 0 ${style.ring}`,
                              `0 0 0 4px ${style.ring}`,
                              `0 0 0 0 ${style.ring}`,
                            ],
                          }
                        : undefined
                    }
                    style={{
                      position:
                        'relative',
                      zIndex: 1,
                      width: '16px',
                      height: '16px',
                      borderRadius:
                        '50%',
                      background:
                        style.dot,
                      boxShadow: `0 0 0 6px ${style.ring}`,
                      marginTop:
                        '0.25rem',
                    }}
                  />

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems:
                          'baseline',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        marginBottom:
                          '0.3rem',
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize:
                            '1.02rem',
                          color: isActive
                            ? 'var(--soft-white)'
                            : 'var(--off-white)',
                          overflowWrap:
                            'anywhere',
                          lineHeight: 1.25,
                        }}
                      >
                        {item.title}
                      </h4>

                      <motion.span
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
                          duration: 0.3,
                          ease,
                          delay:
                            0.25 +
                            index * 0.06,
                        }}
                        style={{
                          fontSize:
                            '0.62rem',
                          letterSpacing:
                            '0.12em',
                          textTransform:
                            'uppercase',
                          color: isActive
                            ? 'var(--sand-light)'
                            : 'var(--muted-light)',
                          whiteSpace:
                            'nowrap',
                        }}
                      >
                        {style.label}
                      </motion.span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color:
                          'var(--muted)',
                        fontSize:
                          '0.86rem',
                        lineHeight: 1.6,
                        overflowWrap:
                          'anywhere',
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div
                    style={{
                      fontSize:
                        '0.68rem',
                      color:
                        'var(--muted-light)',
                      letterSpacing:
                        '0.08em',
                      textTransform:
                        'uppercase',
                      whiteSpace:
                        'nowrap',
                      paddingTop:
                        '0.2rem',
                    }}
                  >
                    {item.date}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <style>{`
        .project-timeline {
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

        .project-timeline:hover {
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

        .project-timeline__item {
          transition:
            background-color 200ms ease,
            padding-left 200ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              );
        }

        .project-timeline__item:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.012
            );
        }

        @media (max-width: 640px) {
          .project-timeline__item {
            grid-template-columns:
              20px minmax(0, 1fr);
          }

          .project-timeline__item
            > div:last-child {
            grid-column: 2;
            padding-top: 0;
          }
        }

        @media (max-width: 460px) {
          .project-timeline__item
            > div:last-child {
            font-size: 0.6rem;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .project-timeline,
          .project-timeline__item {
            transition: none;
          }
        }
      `}</style>
    </motion.section>
  );
}