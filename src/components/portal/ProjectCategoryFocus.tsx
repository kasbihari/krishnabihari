import { motion } from 'framer-motion';

import { getProjectCategoryConfig } from './projectCategoryConfig';

import type { ProjectCategory } from '../../lib/client/types';

type ProjectCategoryFocusProps = {
  readonly category: ProjectCategory;
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

export default function ProjectCategoryFocus({
  category,
}: ProjectCategoryFocusProps) {
  const config =
    getProjectCategoryConfig(category);

  return (
    <>
      <motion.section
        data-reveal
        className="project-category-focus portal-card-hover"
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
          border:
            '1px solid var(--line)',
          borderRadius: '18px',
          background:
            'var(--glass-2)',
          padding:
            'clamp(1.1rem, 3vw, 1.5rem)',
          boxShadow:
            '0 20px 45px rgba(0, 0, 0, 0.14)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(110% 100% at 0% 0%, rgba(200, 184, 154, 0.055), transparent 60%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minWidth: 0,
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
              delay: 0.08,
            }}
            style={{
              marginBottom: '1.25rem',
              minWidth: 0,
            }}
          >
            <div
              style={{
                marginBottom: '0.4rem',
                fontSize: '0.65rem',
                letterSpacing: '0.14em',
                textTransform:
                  'uppercase',
                color: 'var(--bronze)',
              }}
            >
              Project focus
            </div>

            <h3
              style={{
                margin: 0,
                color:
                  'var(--text)',
                fontSize: '1.15rem',
                lineHeight: 1.3,
                fontWeight: 500,
                overflowWrap:
                  'anywhere',
              }}
            >
              {config.label}
            </h3>

            <p
              style={{
                marginTop: '0.65rem',
                marginBottom: 0,
                color: 'var(--text-faint)',
                lineHeight: 1.7,
                maxWidth: '65ch',
                overflowWrap:
                  'anywhere',
              }}
            >
              {config.description}
            </p>
          </motion.div>

          <motion.div
            className="project-category-focus__grid"
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
                  delayChildren: 0.16,
                },
              },
            }}
          >
            {config.focusAreas.map(
              (area, index) => (
                <motion.div
                  key={area}
                  className="project-category-focus__item portal-hover-item"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 7,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        ease,
                      },
                    },
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  transition={{
                    duration: 0.2,
                    ease,
                  }}
                  style={{
                    minWidth: 0,
                    padding:
                      '0.85rem 1rem',
                    borderRadius: '12px',
                    border:
                      '1px solid var(--glass-1)',
                    background:
                      'var(--glass-1)',
                    color:
                      'var(--text)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    overflowWrap:
                      'anywhere',
                    wordBreak:
                      'break-word',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems:
                        'center',
                      gap: '0.65rem',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: '5px',
                        height: '5px',
                        flex:
                          '0 0 5px',
                        borderRadius:
                          '50%',
                        background:
                          'var(--verde-ink)',
                        boxShadow:
                          '0 0 0 4px rgba(74,124,106,0.08)',
                      }}
                    />

                    <span
                      style={{
                        minWidth: 0,
                      }}
                    >
                      {area}
                    </span>

                    <span
                      aria-hidden="true"
                      style={{
                        marginLeft:
                          'auto',
                        color:
                          'var(--text-faint)',
                        fontSize:
                          '0.7rem',
                        opacity: 0.7,
                      }}
                    >
                      {String(
                        index + 1,
                      ).padStart(2, '0')}
                    </span>
                  </div>
                </motion.div>
              ),
            )}
          </motion.div>
        </div>

        <style>{`
          .project-category-focus__grid {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
            gap: 0.75rem;
          }

          .project-category-focus__item {
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
                );
          }

          .project-category-focus__item:hover {
            border-color:
              rgba(
                255,
                255,
                255,
                0.1
              );

            background:
              rgba(
                255,
                255,
                255,
                0.03
              );
          }

          @media (max-width: 640px) {
            .project-category-focus__grid {
              grid-template-columns:
                1fr;
              gap: 0.65rem;
            }

            .project-category-focus__item {
              padding:
                0.8rem 0.9rem;
            }
          }

          @media (max-width: 380px) {
            .project-category-focus {
              border-radius:
                15px;
            }

            .project-category-focus__item {
              font-size:
                0.84rem;
            }
          }

          @media (
            prefers-reduced-motion: reduce
          ) {
            .project-category-focus__item {
              transition: none;
            }
          }
        `}</style>
      </motion.section>
    </>
  );
}