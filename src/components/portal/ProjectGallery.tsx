import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import { useEffect, useState } from 'react';

type ProjectGalleryProps = {
  readonly images: string[];
  readonly projectName: string;
};

const ease = [
  0.16,
  1,
  0.3,
  1,
] as const;

export default function ProjectGallery({
  images,
  projectName,
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const validImages = images.filter(
    (image) =>
      typeof image === 'string' &&
      image.trim().length > 0,
  );

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }

      if (
        event.key === 'ArrowRight' &&
        validImages.length > 1
      ) {
        setActiveIndex(
          (current) =>
            (current + 1) %
            validImages.length,
        );
      }

      if (
        event.key === 'ArrowLeft' &&
        validImages.length > 1
      ) {
        setActiveIndex(
          (current) =>
            (current - 1 +
              validImages.length) %
            validImages.length,
        );
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    lightboxOpen,
    validImages.length,
  ]);

  if (validImages.length === 0) {
    return (
      <motion.section
        data-reveal
        className="project-gallery-empty portal-card-hover"
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
          padding: '1.5rem',
          minHeight: '180px',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        <div>
          <div
            style={{
              marginBottom:
                '0.5rem',
              fontSize: '0.65rem',
              letterSpacing:
                '0.14em',
              textTransform:
                'uppercase',
              color: 'var(--bronze)',
            }}
          >
            Project media
          </div>

          <div
            style={{
              color:
                'var(--text)',
              marginBottom:
                '0.35rem',
            }}
          >
            No project visuals yet
          </div>

          <div
            style={{
              color:
                'var(--text-faint)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
            }}
          >
            Project screenshots will
            appear here when they are
            available.
          </div>
        </div>
      </motion.section>
    );
  }

  const activeImage =
    validImages[
      Math.min(
        activeIndex,
        validImages.length - 1,
      )
    ];

  const nextImage = () => {
    setActiveIndex(
      (current) =>
        (current + 1) %
        validImages.length,
    );
  };

  const previousImage = () => {
    setActiveIndex(
      (current) =>
        (current - 1 +
          validImages.length) %
        validImages.length,
    );
  };

  return (
    <>
      <motion.section
        data-reveal
        className="project-gallery portal-card-hover"
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
          amount: 0.1,
        }}
        transition={{
          duration: 0.55,
          ease,
        }}
        style={{
          position: 'relative',
          border:
            '1px solid var(--line)',
          borderRadius: '18px',
          overflow: 'hidden',
          background:
            'var(--glass-2)',
          boxShadow:
            '0 20px 45px rgba(0, 0, 0, 0.16)',
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
            padding:
              '1.15rem clamp(1rem, 2.5vw, 1.4rem)',
            borderBottom:
              '1px solid var(--glass-1)',
          }}
        >
          <div
            style={{
              fontSize: '0.65rem',
              letterSpacing:
                '0.14em',
              textTransform:
                'uppercase',
              color: 'var(--bronze)',
              marginBottom:
                '0.3rem',
            }}
          >
            Project media
          </div>

          <div
            style={{
              color:
                'var(--text)',
              fontSize: '1.05rem',
            }}
          >
            Visual progress
          </div>
        </motion.div>

        <div
          style={{
            position: 'relative',
            background:
              'var(--glass-1)',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setLightboxOpen(true)
            }
            aria-label={`Open ${projectName} image in fullscreen`}
            style={{
              display: 'block',
              position: 'relative',
              width: '100%',
              padding: 0,
              border: 0,
              background:
                'transparent',
              cursor: 'zoom-in',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={`${projectName} screenshot ${activeIndex + 1}`}
                initial={{
                  opacity: 0,
                  scale: 1.025,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.99,
                }}
                transition={{
                  duration: 0.4,
                  ease,
                }}
                whileHover={{
                  scale: 1.012,
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  height:
                    'clamp(220px, 45vw, 520px)',
                  objectFit: 'cover',
                  willChange:
                    'transform, opacity',
                }}
              />
            </AnimatePresence>
          </button>

          {validImages.length > 1 && (
            <>
              <motion.button
                type="button"
                onClick={previousImage}
                aria-label="Previous project image"
                whileHover={{
                  scale: 1.06,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                transition={{
                  duration: 0.2,
                  ease,
                }}
                style={{
                  position:
                    'absolute',
                  top: '50%',
                  left: '1rem',
                  transform:
                    'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius:
                    '50%',
                  border:
                    '1px solid var(--glass-border)',
                  background:
                    'rgba(0,0,0,0.48)',
                  color:
                    'var(--text)',
                  cursor: 'pointer',
                  backdropFilter:
                    'blur(10px)',
                  fontSize: '1.1rem',
                  zIndex: 2,
                }}
              >
                ←
              </motion.button>

              <motion.button
                type="button"
                onClick={nextImage}
                aria-label="Next project image"
                whileHover={{
                  scale: 1.06,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                transition={{
                  duration: 0.2,
                  ease,
                }}
                style={{
                  position:
                    'absolute',
                  top: '50%',
                  right: '1rem',
                  transform:
                    'translateY(-50%)',
                  width: '42px',
                  height: '42px',
                  borderRadius:
                    '50%',
                  border:
                    '1px solid var(--glass-border)',
                  background:
                    'rgba(0,0,0,0.48)',
                  color:
                    'var(--text)',
                  cursor: 'pointer',
                  backdropFilter:
                    'blur(10px)',
                  fontSize: '1.1rem',
                  zIndex: 2,
                }}
              >
                →
              </motion.button>

              <motion.div
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
                  duration: 0.4,
                  ease,
                  delay: 0.22,
                }}
                style={{
                  position:
                    'absolute',
                  left: '50%',
                  bottom: '1rem',
                  transform:
                    'translateX(-50%)',
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: '0.5rem',
                  padding:
                    '0.45rem 0.7rem',
                  borderRadius:
                    '999px',
                  background:
                    'rgba(0,0,0,0.45)',
                  backdropFilter:
                    'blur(10px)',
                  zIndex: 2,
                }}
              >
                {validImages.map(
                  (
                    image,
                    index,
                  ) => (
                    <motion.button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setActiveIndex(
                          index,
                        )
                      }
                      aria-label={`Show image ${index + 1}`}
                      aria-current={
                        activeIndex ===
                        index
                      }
                      animate={{
                        scale:
                          activeIndex ===
                          index
                            ? 1
                            : 0.85,
                        opacity:
                          activeIndex ===
                          index
                            ? 1
                            : 0.55,
                      }}
                      transition={{
                        duration: 0.22,
                        ease,
                      }}
                      whileHover={{
                        scale: 1.1,
                        opacity: 1,
                      }}
                      style={{
                        width: '7px',
                        height: '7px',
                        padding: 0,
                        border: 0,
                        borderRadius:
                          '50%',
                        background:
                          'var(--text)',
                        cursor:
                          'pointer',
                      }}
                    />
                  ),
                )}
              </motion.div>
            </>
          )}
        </div>

        {validImages.length > 1 && (
          <motion.div
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
              duration: 0.4,
              ease,
              delay: 0.18,
            }}
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(90px, 1fr))',
              gap: '0.55rem',
              padding: '0.75rem',
              borderTop:
                '1px solid var(--glass-1)',
            }}
          >
            {validImages.map(
              (
                image,
                index,
              ) => (
                <motion.button
                  key={`thumb-${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      index,
                    )
                  }
                  aria-label={`Select image ${index + 1}`}
                  whileHover={{
                    y: -2,
                    opacity: 1,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.2,
                    ease,
                  }}
                  style={{
                    position:
                      'relative',
                    padding: 0,
                    aspectRatio:
                      '16 / 10',
                    overflow:
                      'hidden',
                    borderRadius:
                      '8px',
                    border:
                      activeIndex ===
                      index
                        ? '1px solid var(--bronze-soft)'
                        : '1px solid var(--glass-2)',
                    background:
                      'var(--glass-1)',
                    cursor:
                      'pointer',
                    opacity:
                      activeIndex ===
                      index
                        ? 1
                        : 0.6,
                  }}
                >
                  <motion.img
                    src={image}
                    alt=""
                    aria-hidden="true"
                    animate={{
                      scale:
                        activeIndex ===
                        index
                          ? 1.025
                          : 1,
                    }}
                    transition={{
                      duration: 0.3,
                      ease,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit:
                        'cover',
                      display:
                        'block',
                    }}
                  />
                </motion.button>
              ),
            )}
          </motion.div>
        )}
      </motion.section>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${projectName} project gallery`}
            onClick={() =>
              setLightboxOpen(false)
            }
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.28,
              ease,
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'grid',
              placeItems:
                'center',
              padding: '1rem',
              background:
                'rgba(0,0,0,0.88)',
              backdropFilter:
                'blur(16px)',
            }}
          >
            <motion.button
              type="button"
              aria-label="Close gallery"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxOpen(false);
              }}
              whileHover={{
                scale: 1.06,
              }}
              whileTap={{
                scale: 0.94,
              }}
              transition={{
                duration: 0.2,
                ease,
              }}
              style={{
                position:
                  'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 2,
                width: '42px',
                height: '42px',
                borderRadius:
                  '50%',
                border:
                  '1px solid var(--glass-border)',
                background:
                  'var(--glass-2)',
                color:
                  'var(--text)',
                cursor:
                  'pointer',
                fontSize: '1.2rem',
              }}
            >
              ×
            </motion.button>

            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={`${projectName} screenshot ${activeIndex + 1}`}
                onClick={(event) =>
                  event.stopPropagation()
                }
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.985,
                }}
                transition={{
                  duration: 0.38,
                  ease,
                }}
                style={{
                  maxWidth:
                    'min(1400px, 94vw)',
                  maxHeight:
                    '88vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit:
                    'contain',
                  borderRadius:
                    '12px',
                  boxShadow:
                    '0 30px 100px rgba(0,0,0,0.5)',
                }}
              />
            </AnimatePresence>

            {validImages.length > 1 && (
              <>
                <motion.button
                  type="button"
                  aria-label="Previous fullscreen image"
                  onClick={(event) => {
                    event.stopPropagation();
                    previousImage();
                  }}
                  whileHover={{
                    scale: 1.06,
                    x: 2,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  transition={{
                    duration: 0.2,
                    ease,
                  }}
                  style={{
                    position:
                      'fixed',
                    top: '50%',
                    left: '1rem',
                    transform:
                      'translateY(-50%)',
                    width: '46px',
                    height: '46px',
                    borderRadius:
                      '50%',
                    border:
                      '1px solid var(--glass-border)',
                    background:
                      'var(--glass-2)',
                    color:
                      'var(--text)',
                    cursor:
                      'pointer',
                    fontSize:
                      '1.15rem',
                  }}
                >
                  ←
                </motion.button>

                <motion.button
                  type="button"
                  aria-label="Next fullscreen image"
                  onClick={(event) => {
                    event.stopPropagation();
                    nextImage();
                  }}
                  whileHover={{
                    scale: 1.06,
                    x: -2,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  transition={{
                    duration: 0.2,
                    ease,
                  }}
                  style={{
                    position:
                      'fixed',
                    top: '50%',
                    right: '1rem',
                    transform:
                      'translateY(-50%)',
                    width: '46px',
                    height: '46px',
                    borderRadius:
                      '50%',
                    border:
                      '1px solid var(--glass-border)',
                    background:
                      'var(--glass-2)',
                    color:
                      'var(--text)',
                    cursor:
                      'pointer',
                    fontSize:
                      '1.15rem',
                  }}
                >
                  →
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .project-gallery button {
          -webkit-tap-highlight-color:
            transparent;
        }

        @media (max-width: 520px) {
          .project-gallery button[aria-label^="Previous project"],
          .project-gallery button[aria-label^="Next project"] {
            width: 38px !important;
            height: 38px !important;
          }
        }

        @media (max-width: 380px) {
          .project-gallery,
          .project-gallery-empty {
            border-radius:
              15px !important;
          }
        }

        @media (
          prefers-reduced-motion: reduce
        ) {
          .project-gallery img {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}