type ProjectItem = {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  client_company: string;
  status: string;
  phase: string;
  progress: number;
  expected_launch: string;
};

type AdminProjectsProps = {
  projects: ProjectItem[];
};

function StatusBadge({ status }: { status: string }) {
  const lowerStatus = status.toLowerCase();
  const isActive = lowerStatus.includes('active') || lowerStatus.includes('development') || lowerStatus.includes('progress');
  const isCompleted = lowerStatus.includes('complete') || lowerStatus.includes('finished') || lowerStatus.includes('closed');

  const bgColor = isActive ? 'rgba(92, 158, 131, 0.15)' : isCompleted ? 'rgba(74, 124, 106, 0.15)' : 'rgba(255, 255, 255, 0.05)';
  const borderColor = isActive ? 'rgba(92, 158, 131, 0.3)' : isCompleted ? 'rgba(74, 124, 106, 0.3)' : 'rgba(255, 255, 255, 0.1)';
  const textColor = isActive ? 'var(--forest-bright)' : isCompleted ? 'var(--forest-mid)' : 'var(--muted-light)';

  return (
    <span style={{ display: 'inline-block', padding: '0.4rem 0.75rem', borderRadius: '8px', background: bgColor, border: `1px solid ${borderColor}`, color: textColor, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
      {status}
    </span>
  );
}

export default function AdminProjects({ projects }: AdminProjectsProps) {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '0.5rem' }}>
            Workspace
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: 'var(--soft-white)' }}>
            Projects
          </h1>
        </header>

        {projects.length === 0 ? (
          <div style={{ border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(10, 10, 10, 0.7)', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8 }}>
              No projects found. Create your first project to get started.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map((project) => (
              <div key={project.id} style={{ border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(10, 10, 10, 0.7)', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '0.35rem' }}>
                      {project.client_company}
                    </div>
                    <h2 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: 'var(--soft-white)' }}>
                      {project.name}
                    </h2>
                    <div style={{ color: 'var(--muted-light)', fontSize: '0.85rem' }}>
                      Client: {project.client_name}
                    </div>
                  </div>

                  <StatusBadge status={project.status} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-light)', marginBottom: '0.25rem' }}>
                      Phase
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--soft-white)' }}>
                      {project.phase}
                    </div>
                  </div>

                  <div style={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-light)', marginBottom: '0.25rem' }}>
                      Progress
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--soft-white)' }}>
                      {project.progress}%
                    </div>
                  </div>

                  <div style={{ border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-light)', marginBottom: '0.25rem' }}>
                      Launch
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--soft-white)' }}>
                      {project.expected_launch}
                    </div>
                  </div>
                </div>

                <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                  <div style={{ width: `${project.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--forest-bright), var(--sand-light))', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
