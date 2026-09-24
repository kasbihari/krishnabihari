import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import DemoWorkspace from "./DemoWorkspace";
import ProjectGallery from "./ProjectGallery";
import ProjectOverview from "./ProjectOverview";
import ProjectProgress from "./ProjectProgress";
import ProjectProgressHistory from "./ProjectProgressHistory";
import ProjectTimeline from "./ProjectTimeline";
import ProjectHours from "./ProjectHours";
import ProjectCategoryFocus from "./ProjectCategoryFocus";
import ProjectUpdates from "./ProjectUpdates";
import ProjectMilestones from "./ProjectMilestones";
import ClientProjectList from "./ClientProjectList";

import {
  fetchClientProjects,
  fetchPortalDataByProjectId,
} from "../../lib/client/portal";

import type {
  ClientPortalData,
  ClientProjectsData,
} from "../../lib/client/types";

const ease = [0.16, 1, 0.3, 1] as const;

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 12,
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

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease,
    },
  },
};

const viewport = {
  once: true,
  amount: 0.12,
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function ClientDashboard() {
  const [clientData, setClientData] = useState<ClientProjectsData | null>(null);

  const [portalData, setPortalData] = useState<ClientPortalData | null>(null);

  const [view, setView] = useState<"list" | "workspace">("list");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        /*
         * Authorization is handled entirely server-side.
         *
         * The browser does not read or store the
         * client session. The API reads the signed
         * httpOnly cookie automatically and returns
         * every project whose client_id matches the
         * authenticated client.
         */
        const data = await fetchClientProjects();

        if (!data) {
          setError("We could not load your client workspace at the moment.");
          return;
        }

        setClientData(data);
        setView("list");
      } catch {
        setError("We could not load your client workspace at the moment.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [retryKey]);

  const openProject = async (projectId: string) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchPortalDataByProjectId(projectId);

      if (!data) {
        setError("We could not open this project workspace at the moment.");
        return;
      }

      setPortalData(data);
      setView("workspace");
    } catch {
      setError("We could not open this project workspace at the moment.");
    } finally {
      setLoading(false);
    }
  };

  const backToList = () => {
    setPortalData(null);
    setView("list");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/client/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore API errors and return to the login page.
    }

    window.location.href = "/client";
  };

  const handleRetry = () => {
    setClientData(null);
    setPortalData(null);
    setError("");
    setLoading(true);
    setRetryKey((value) => value + 1);
  };

  if (loading) {
    return (
      <>
        {" "}
        <style>{`
.portal-loading {
min-height: 100svh;
display: grid;
place-items: center;
padding: 1rem;
}

      .portal-loading-card {
        width:
          min(100%, 760px);
        padding:
          clamp(
            1.25rem,
            4vw,
            2rem
          );
        border:
          1px solid
          var(--line);
        border-radius: 18px;
        background:
          rgba(
            10,
            10,
            10,
            0.8
          );
        box-shadow:
          0 20px 55px
          rgba(
            0,
            0,
            0,
            0.2
          );
      }

      .portal-loading-label {
        margin-bottom: 1rem;
        font-size: 0.68rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color:
          var(--bronze);
      }

      .portal-loading-track {
        width: 100%;
        height: 10px;
        margin-bottom: 1rem;
        border-radius:
          999px;
        overflow: hidden;
        background:
          rgba(
            255,
            255,
            255,
            0.06
          );
      }

      .portal-loading-fill {
        width: 58%;
        height: 100%;
        border-radius:
          inherit;
        background:
          linear-gradient(
            90deg,
            var(--verde-ink),
            var(--bronze-soft)
          );
        animation:
          portal-loading
          1.4s
          ease-in-out
          infinite;
      }

      .portal-loading-copy {
        color:
          var(--text-faint);
        line-height: 1.8;
      }

      @keyframes portal-loading {
        0% {
          transform:
            translateX(-12%);
        }

        50% {
          transform:
            translateX(20%);
        }

        100% {
          transform:
            translateX(65%);
        }
      }

      @media (
        prefers-reduced-motion: reduce
      ) {
        .portal-loading-fill {
          animation: none;
        }
      }
    `}</style>
        <main className="portal-loading">
          <motion.div
            className="portal-loading-card"
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
            <div className="portal-loading-label">Loading</div>

            <div className="portal-loading-track">
              <div className="portal-loading-fill" />
            </div>

            <div className="portal-loading-copy">
              Authenticating and loading your client workspace...
            </div>
          </motion.div>
        </main>
      </>
    );
  }

  if (!portalData) {
    return (
      <>
        {" "}
        <style>{`
.portal-error {
min-height: 100svh;
display: grid;
place-items: center;
padding: 1rem;
}

      .portal-error-card {
        width:
          min(100%, 720px);
        padding:
          clamp(
            1.25rem,
            4vw,
            2rem
          );
        border:
          1px solid
          var(--line);
        border-radius: 18px;
        background:
          rgba(
            10,
            10,
            10,
            0.8
          );
        box-shadow:
          0 20px 55px
          rgba(
            0,
            0,
            0,
            0.2
          );
      }

      .portal-error-title {
        margin-bottom:
          0.75rem;
        color:
          var(--text);
        font-size:
          clamp(
            1.3rem,
            3vw,
            1.5rem
          );
        line-height: 1.25;
      }

      .portal-error-copy {
        color:
          var(--text-faint);
        line-height: 1.8;
      }

      .portal-error-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-top:
          1.25rem;
      }

      .portal-error-action {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 520px) {
        .portal-error-actions {
          flex-direction: column;
        }

        .portal-error-action {
          width: 100%;
        }
      }
    `}</style>
        <main className="portal-error">
          <motion.div
            className="portal-error-card"
            initial={{
              opacity: 0,
              y: 12,
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
            <div className="portal-error-title">
              Unable to open client workspace
            </div>

            <div className="portal-error-copy">
              {error || "Something went wrong while loading your workspace."}
            </div>

            <div className="portal-error-actions">
              <motion.button
                type="button"
                className="btn-secondary portal-error-action"
                onClick={handleRetry}
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.99,
                }}
              >
                Try again
              </motion.button>

              <motion.a
                href="/client"
                className="btn-secondary portal-error-action"
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.99,
                }}
              >
                Back to client login
              </motion.a>
            </div>
          </motion.div>
        </main>
      </>
    );
  }

  if (view === "list") {
    if (!clientData) {
      return (
        <>
          {" "}
          <style>{`
.portal-error {
min-height: 100svh;
display: grid;
place-items: center;
padding: 1rem;
}

      .portal-error-card {
        width:
          min(100%, 720px);
        padding:
          clamp(
            1.25rem,
            4vw,
            2rem
          );
        border:
          1px solid
          var(--line);
        border-radius: 18px;
        background:
          rgba(
            10,
            10,
            10,
            0.8
          );
        box-shadow:
          0 20px 55px
          rgba(
            0,
            0,
            0,
            0.2
          );
      }

      .portal-error-title {
        margin-bottom:
          0.75rem;
        color:
          var(--text);
        font-size:
          clamp(
            1.3rem,
            3vw,
            1.5rem
          );
        line-height: 1.25;
      }

      .portal-error-copy {
        color:
          var(--text-faint);
        line-height: 1.8;
      }

      .portal-error-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-top:
          1.25rem;
      }

      .portal-error-action {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 520px) {
        .portal-error-actions {
          flex-direction: column;
        }

        .portal-error-action {
          width: 100%;
        }
      }
    `}</style>
          <main className="portal-error">
            <motion.div
              className="portal-error-card"
              initial={{
                opacity: 0,
                y: 12,
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
              <div className="portal-error-title">
                Unable to open client workspace
              </div>

              <div className="portal-error-copy">
                {error ||
                  "Something went wrong while loading your workspace."}
              </div>

              <div className="portal-error-actions">
                <motion.button
                  type="button"
                  className="btn-secondary portal-error-action"
                  onClick={handleRetry}
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.99,
                  }}
                >
                  Try again
                </motion.button>

                <motion.a
                  href="/client"
                  className="btn-secondary portal-error-action"
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.99,
                  }}
                >
                  Back to client login
                </motion.a>
              </div>
            </motion.div>
          </main>
        </>
      );
    }

    return (
      <ClientProjectList
        client={clientData.client}
        projects={clientData.projects}
        error={error}
        onOpenProject={openProject}
        onLogout={handleLogout}
      />
    );
  }

  if (!portalData) {
    return (
      <>
        {" "}
        <style>{`
.portal-error {
min-height: 100svh;
display: grid;
place-items: center;
padding: 1rem;
}

      .portal-error-card {
        width:
          min(100%, 720px);
        padding:
          clamp(
            1.25rem,
            4vw,
            2rem
          );
        border:
          1px solid
          var(--line);
        border-radius: 18px;
        background:
          rgba(
            10,
            10,
            10,
            0.8
          );
        box-shadow:
          0 20px 55px
          rgba(
            0,
            0,
            0,
            0.2
          );
      }

      .portal-error-title {
        margin-bottom:
          0.75rem;
        color:
          var(--text);
        font-size:
          clamp(
            1.3rem,
            3vw,
            1.5rem
          );
        line-height: 1.25;
      }

      .portal-error-copy {
        color:
          var(--text-faint);
        line-height: 1.8;
      }

      .portal-error-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-top:
          1.25rem;
      }

      .portal-error-action {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      @media (max-width: 520px) {
        .portal-error-actions {
          flex-direction: column;
        }

        .portal-error-action {
          width: 100%;
        }
      }
    `}</style>
        <main className="portal-error">
          <motion.div
            className="portal-error-card"
            initial={{
              opacity: 0,
              y: 12,
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
            <div className="portal-error-title">
              Unable to open client workspace
            </div>

            <div className="portal-error-copy">
              {error || "Something went wrong while loading your workspace."}
            </div>

            <div className="portal-error-actions">
              <motion.button
                type="button"
                className="btn-secondary portal-error-action"
                onClick={handleRetry}
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.99,
                }}
              >
                Try again
              </motion.button>

              <motion.a
                href="/client"
                className="btn-secondary portal-error-action"
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.99,
                }}
              >
                Back to client login
              </motion.a>
            </div>
          </motion.div>
        </main>
      </>
    );
  }

  const project = portalData.project;

  const hours = portalData.hours;

  const projectImages = Array.isArray(project.images) ? project.images : [];

  const projectCode = project.project_code?.trim() || "Project";

  const isDemoProject = project.category === "demo";

  return (
    <>
      {" "}
      <style>{`
.portal-dashboard {
width: 100%;
min-height: 100svh;
padding:
clamp(1rem, 3vw, 2rem)
clamp(0.85rem, 3vw, 1.25rem)
4rem;
}

    .portal-dashboard__container {
      width: 100%;
      max-width: 1180px;
      margin:
        0 auto;
    }

    .portal-dashboard__header {
      display: flex;
      align-items: center;
      justify-content:
        space-between;
      gap: 1rem;
      margin-bottom:
        1.25rem;
      padding:
        clamp(
          1rem,
          2.5vw,
          1.2rem
        )
        clamp(
          1rem,
          2.5vw,
          1.25rem
        );
      border:
        1px solid
        var(--line);
      border-radius: 18px;
      background:
        rgba(
          10,
          10,
          10,
          0.78
        );
      box-shadow:
        0 20px 45px
        rgba(
          0,
          0,
          0,
          0.14
        );
    }

    .portal-dashboard__identity {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .portal-dashboard__avatar {
      width: 46px;
      height: 46px;
      flex:
        0 0 46px;
      display: grid;
      place-items:
        center;
      border-radius:
        50%;
      border:
        1px solid
        var(--line);
      background:
        rgba(
          200,
          184,
          154,
          0.08
        );
      color:
        var(--bronze-soft);
      font-weight: 600;
      font-size:
        0.72rem;
      letter-spacing:
        0.03em;
    }

    .portal-dashboard__identity-copy {
      min-width: 0;
    }

    .portal-dashboard__eyebrow {
      margin-bottom:
        0.18rem;
      overflow:
        hidden;
      color:
        var(--bronze);
      font-size:
        0.65rem;
      letter-spacing:
        0.12em;
      text-overflow:
        ellipsis;
      text-transform:
        uppercase;
      white-space:
        nowrap;
    }

    .portal-dashboard__title {
      margin: 0;
      color:
        var(--text);
      font-size:
        clamp(
          1.45rem,
          4vw,
          2.25rem
        );
      line-height:
        1.08;
      overflow-wrap:
        anywhere;
    }

    .portal-dashboard__project-code {
      margin-top:
        0.3rem;
      color:
        var(--text-faint);
      font-family:
        'JetBrains Mono',
        monospace;
      font-size:
        0.68rem;
      letter-spacing:
        0.04em;
      overflow-wrap:
        anywhere;
    }

    .portal-dashboard__actions {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .portal-dashboard__back,
    .portal-dashboard__logout {
      min-height: 44px;
    }

    .portal-dashboard__back {
      min-width: 120px;
    }

    .portal-dashboard__logout {
      min-width: 90px;
    }

    .portal-dashboard__primary-grid {
      display:
        grid;
      grid-template-columns:
        minmax(
          0,
          1.4fr
        )
        minmax(
          260px,
          0.9fr
        );
      gap:
        1.25rem;
      margin-bottom:
        1.25rem;
    }

    .portal-dashboard__secondary-grid {
      display:
        grid;
      grid-template-columns:
        minmax(
          0,
          1.2fr
        )
        minmax(
          260px,
          0.8fr
        );
      gap:
        1.25rem;
    }

    .portal-dashboard__gallery,
    .portal-dashboard__category-focus,
    .portal-dashboard__updates,
    .portal-dashboard__progress-history,
    .portal-dashboard__milestones {
      margin-bottom:
        1.25rem;
    }

    @media (max-width: 920px) {
      .portal-dashboard__primary-grid,
      .portal-dashboard__secondary-grid {
        grid-template-columns:
          1fr;
      }
    }

    @media (max-width: 640px) {
      .portal-dashboard {
        padding-inline:
          0.85rem;
        padding-bottom:
          2.5rem;
      }

      .portal-dashboard__header {
        align-items:
          stretch;
        flex-direction:
          column;
        gap: 1rem;
      }

      .portal-dashboard__identity {
        width: 100%;
      }

      .portal-dashboard__actions {
        width: 100%;
        flex-direction: column;
      }

      .portal-dashboard__back,
      .portal-dashboard__logout {
        width: 100%;
      }

      .portal-dashboard__primary-grid,
      .portal-dashboard__secondary-grid {
        gap:
          0.85rem;
      }

      .portal-dashboard__gallery,
      .portal-dashboard__category-focus,
      .portal-dashboard__updates,
      .portal-dashboard__progress-history,
      .portal-dashboard__milestones {
        margin-bottom:
          0.85rem;
      }
    }

    @media (max-width: 430px) {
      .portal-dashboard__avatar {
        width: 42px;
        height: 42px;
        flex-basis: 42px;
      }

      .portal-dashboard__identity {
        gap:
          0.7rem;
      }

      .portal-dashboard__eyebrow {
        font-size:
          0.58rem;
      }

      .portal-dashboard__title {
        font-size:
          clamp(
            1.3rem,
            7vw,
            1.75rem
          );
      }

      .portal-dashboard__project-code {
        font-size:
          0.6rem;
      }
    }

    @media (
      prefers-reduced-motion: reduce
    ) {
      *,
      *::before,
      *::after {
        scroll-behavior:
          auto !important;
        animation-duration:
          0.01ms !important;
        animation-iteration-count:
          1 !important;
        transition-duration:
          0.01ms !important;
      }
    }
  `}</style>
      <main className="portal-dashboard">
        <div className="portal-dashboard__container">
          <motion.header
            className="portal-dashboard__header"
            initial="hidden"
            animate="visible"
            variants={revealVariants}
          >
            <motion.div
              className="portal-dashboard__identity"
              variants={revealVariants}
            >
              <motion.div
                className="portal-dashboard__avatar"
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
                  delay: 0.08,
                }}
              >
                {isDemoProject ? "DM" : "PW"}
              </motion.div>

              <div className="portal-dashboard__identity-copy">
                <motion.div
                  className="portal-dashboard__eyebrow"
                  {...fadeUp(0.08)}
                >
                  {isDemoProject ? "Demo workspace" : "Project workspace"}
                </motion.div>

                <motion.h1
                  className="portal-dashboard__title"
                  {...fadeUp(0.12)}
                >
                  {project.name}
                </motion.h1>

                <motion.div
                  className="portal-dashboard__project-code"
                  {...fadeUp(0.16)}
                >
                  {projectCode}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="portal-dashboard__actions"
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
            >
              <motion.button
                type="button"
                onClick={backToList}
                className="btn-secondary portal-dashboard__back"
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                style={{
                  background: "transparent",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                }}
              >
                <span aria-hidden="true">
                  ←
                </span>
                All projects
              </motion.button>

              <motion.button
                type="button"
                onClick={handleLogout}
                className="btn-secondary portal-dashboard__logout"
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                style={{
                  background: "transparent",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                }}
              >
                Log out
              </motion.button>
            </motion.div>
          </motion.header>

          {isDemoProject ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              transition={{
                delay: 0.18,
              }}
            >
              <DemoWorkspace project={project} />
            </motion.div>
          ) : (
            <>
              <motion.div
                className="portal-dashboard__primary-grid"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={cardVariants}>
                  <ProjectOverview
                    project={{
                      name: project.name,
                      category: project.category,
                      type: project.type,
                      status: project.status,
                      phase: project.phase,
                      progress: project.progress,
                      expectedLaunch: project.expected_launch,
                      description: project.description,
                      liveDemoUrl: project.live_demo_url,
                    }}
                  />
                </motion.div>

                <motion.div variants={cardVariants}>
                  <ProjectProgress
                    progress={project.progress}
                    phase={project.phase}
                    status={project.status}
                    category={project.category}
                  />
                </motion.div>
              </motion.div>

              {projectImages.length > 0 && (
                <motion.div
                  className="portal-dashboard__gallery"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={revealVariants}
                >
                  <ProjectGallery
                    images={projectImages}
                    projectName={project.name}
                  />
                </motion.div>
              )}

              <motion.div
                className="portal-dashboard__category-focus"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={revealVariants}
              >
                <ProjectCategoryFocus category={project.category} />
              </motion.div>

              <motion.div
                className="portal-dashboard__updates"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={revealVariants}
              >
                <ProjectUpdates updates={portalData.updates} />
              </motion.div>

              <motion.div
                className="portal-dashboard__progress-history"
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.08,
                }}
                variants={revealVariants}
              >
                <ProjectProgressHistory history={portalData.progressHistory} />
              </motion.div>

              <motion.div
                className="portal-dashboard__milestones"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={revealVariants}
              >
                <ProjectMilestones milestones={portalData.milestones} />
              </motion.div>

              <motion.div
                className="portal-dashboard__secondary-grid"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={staggerContainer}
              >
                <motion.div variants={cardVariants}>
                  <ProjectTimeline
                    items={portalData.timeline.map((item) => ({
                      title: item.title,
                      description: item.description,
                      status: item.status,
                      date: item.date,
                    }))}
                  />
                </motion.div>

                <motion.div variants={cardVariants}>
                  <ProjectHours
                    hours={{
                      used: hours.hours_used,
                      allocated: hours.hours_allocated,
                      remaining: Math.max(
                        hours.hours_allocated - hours.hours_used,
                        0,
                      ),
                    }}
                  />
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function fadeUp(delay: number) {
  return {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: 0.45,
      ease,
      delay,
    },
  };
}
