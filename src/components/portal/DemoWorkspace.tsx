import { motion } from 'framer-motion';
import type { ProjectRecord } from '../../lib/client/types';

import ProjectGallery from './ProjectGallery';

type DemoWorkspaceProps = {
  readonly project: ProjectRecord;
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

const isValidUrl = (
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

export default function DemoWorkspace({
  project,
}: DemoWorkspaceProps) {
  const projectCode =
    project.project_code?.trim() ||
    'Project';

  const projectName =
    project.name?.trim() ||
    'Demo Project';

  const projectDescription =
    project.description?.trim() ||
    'A project preview is currently available.';

  const images = Array.isArray(project.images)
    ? project.images.filter(
        (
          image,
        ): image is string =>
          typeof image === 'string' &&
          image.trim().length > 0,
      )
    : [];

  const liveDemoUrl = isValidUrl(
    project.live_demo_url,
  )
    ? project.live_demo_url.trim()
    : null;

  return (
    <motion.section
      className="demo-workspace"
      data-reveal
      initial={{
        opacity: 0,
        y: 12,
        scale: 0.992,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.08,
      }}
      transition={{
        duration: 0.6,
        ease,
      }}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.22,
          ease,
        },
      }}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        border:
          '1px solid var(--line)',
        borderRadius: '20px',
        background:
          'var(--glass-2)',
        boxShadow:
          '0 20px 45px rgba(0, 0, 0, 0.16)',
      }}
    >
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
          duration: 0.8,
          ease,
          delay: 0.08,
        }}
        className="demo-workspace__glow"
      />

      <div className="demo-workspace__content">
        <motion.div
          className="demo-workspace__header"
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
              },
            },
          }}
        >
          <motion.div
            className="demo-workspace__identity"
            variants={{
              hidden: {
                opacity: 0,
                y: 8,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.45,
                  ease,
                },
              },
            }}
          >
            <motion.p
              className="demo-workspace__eyebrow"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.35,
                ease,
                delay: 0.05,
              }}
            >
              Demo workspace
            </motion.p>

            <h1 className="demo-workspace__title">
              {projectName}
            </h1>

            <div className="demo-workspace__code">
              {projectCode}
            </div>
          </motion.div>

          <motion.div
            className="demo-workspace__badge"
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.96,
              },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.4,
                  ease,
                },
              },
            }}
          >
            <span
              className="demo-workspace__badge-dot"
              aria-hidden="true"
            />
            Demo
          </motion.div>
        </motion.div>

        <motion.p
          className="demo-workspace__description"
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
            amount: 0.08,
          }}
          transition={{
            duration: 0.45,
            ease,
            delay: 0.13,
          }}
        >
          {projectDescription}
        </motion.p>

        {liveDemoUrl && (
          <motion.div
            className="demo-workspace__actions"
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
              amount: 0.08,
            }}
            transition={{
              duration: 0.45,
              ease,
              delay: 0.18,
            }}
          >
            <motion.a
              href={liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary demo-workspace__action"
              aria-label={`Open live demo for ${projectName}`}
              whileHover={{
                y: -1,
                scale: 1.01,
                transition: {
                  duration: 0.16,
                  ease,
                },
              }}
              whileTap={{
                scale: 0.985,
              }}
            >
              View Live Demo

              <span aria-hidden="true">
                ↗
              </span>
            </motion.a>
          </motion.div>
        )}

        <motion.div
          className="demo-workspace__section"
          initial={{
            opacity: 0,
            y: 9,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.08,
          }}
          transition={{
            duration: 0.5,
            ease,
            delay: 0.23,
          }}
        >
          <div className="demo-workspace__section-label">
            Project preview
          </div>

          {images.length > 0 ? (
            <motion.div
              className="demo-workspace__preview"
              whileHover={{
                y: -2,
                transition: {
                  duration: 0.2,
                  ease,
                },
              }}
            >
              <motion.img
                src={images[0]}
                alt={`${projectName} preview`}
                loading="eager"
                initial={{
                  opacity: 0,
                  scale: 1.015,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                transition={{
                  duration: 0.7,
                  ease,
                  delay: 0.08,
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              className="demo-workspace__empty"
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
              }}
            >
              No project preview is available yet.
            </motion.div>
          )}
        </motion.div>

        {images.length > 1 && (
          <motion.div
            className="demo-workspace__gallery"
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
              amount: 0.06,
            }}
            transition={{
              duration: 0.5,
              ease,
              delay: 0.28,
            }}
          >
            <ProjectGallery
              images={images}
              projectName={projectName}
            />
          </motion.div>
        )}
      </div>

      <style>{`
        .demo-workspace {
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
              );
        }

        .demo-workspace:hover {
          border-color:
            rgba(
              255,
              255,
              255,
              0.1
            );

          box-shadow:
            0 26px 60px
            rgba(
              0,
              0,
              0,
              0.18
            );
        }

        .demo-workspace__glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              110% 100% at 0% 0%,
              rgba(
                200,
                184,
                154,
                0.09
              ),
              transparent 58%
            );
        }

        .demo-workspace__content {
          position: relative;
          z-index: 1;
          padding:
            clamp(
              1.2rem,
              3vw,
              2rem
            );
        }

        .demo-workspace__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .demo-workspace__identity {
          min-width: 0;
          flex: 1 1 280px;
        }

        .demo-workspace__eyebrow {
          margin: 0 0 0.55rem;
          color: var(--bronze);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .demo-workspace__title {
          margin: 0;
          color: var(--text);
          font-size:
            clamp(
              1.8rem,
              4vw,
              2.8rem
            );
          line-height: 1.08;
          overflow-wrap: anywhere;
        }

        .demo-workspace__code {
          margin-top: 0.5rem;
          color: var(--text-faint);
          font-family:
            'JetBrains Mono',
            monospace;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          overflow-wrap: anywhere;
        }

        .demo-workspace__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
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
          color:
            var(--bronze-soft);
          font-size: 0.66rem;
          letter-spacing: 0.1em;
          text-transform:
            uppercase;
          white-space: nowrap;
          transition:
            transform 180ms
              cubic-bezier(
                0.16,
                1,
                0.3,
                1
              ),
            border-color 180ms ease,
            background-color 180ms ease;
        }

        .demo-workspace__badge:hover {
          transform:
            translateY(-1px);
          border-color:
            rgba(
              200,
              184,
              154,
              0.26
            );
          background:
            rgba(
              200,
              184,
              154,
              0.08
            );
        }

        .demo-workspace__badge-dot {
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
        }

        .demo-workspace__description {
          max-width: 72ch;
          margin:
            0 0
            1.5rem;
          color: var(--text-faint);
          font-size: 0.98rem;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .demo-workspace__actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.75rem;
        }

        .demo-workspace__action {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .demo-workspace__section {
          margin-top: 1.5rem;
        }

        .demo-workspace__section-label {
          margin-bottom: 0.8rem;
          color: var(--text-soft);
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .demo-workspace__preview {
          overflow: hidden;
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.06
            );
          border-radius: 16px;
          background:
            rgba(
              255,
              255,
              255,
              0.02
            );
          transition:
            border-color 200ms ease,
            box-shadow 200ms ease;
        }

        .demo-workspace__preview:hover {
          border-color:
            rgba(
              255,
              255,
              255,
              0.1
            );

          box-shadow:
            0 18px 45px
            rgba(
              0,
              0,
              0,
              0.16
            );
        }

        .demo-workspace__preview img {
          display: block;
          width: 100%;
          height: auto;
          max-height: 640px;
          object-fit: contain;
          transform-origin:
            center center;
        }

        .demo-workspace__empty {
          display: grid;
          place-items: center;
          min-height: 240px;
          padding: 2rem;
          border:
            1px dashed
            rgba(
              255,
              255,
              255,
              0.08
            );
          border-radius: 16px;
          background:
            rgba(
              255,
              255,
              255,
              0.015
            );
          color: var(--text-faint);
          text-align: center;
          line-height: 1.7;
        }

        .demo-workspace__gallery {
          margin-top: 1.5rem;
        }

        @media (max-width: 640px) {
          .demo-workspace__content {
            padding: 1rem;
          }

          .demo-workspace__header {
            gap: 0.8rem;
          }

          .demo-workspace__badge {
            width: 100%;
            justify-content: center;
          }

          .demo-workspace__actions {
            width: 100%;
          }

          .demo-workspace__action {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .demo-workspace,
          .demo-workspace * {
            transition: none !important;
          }
        }
      `}</style>
    </motion.section>
  );
}