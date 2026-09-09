import { useState } from 'react';

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

type ClientOption = {
  id: string;
  name: string;
  company: string;
};

type AdminProjectsProps = {
  projects: ProjectItem[];
  clients: ClientOption[];
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

export default function AdminProjects({ projects, clients }: AdminProjectsProps) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const createProject = async () => {
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    if (!clientId) {
      setError('Select a client.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, client_id: clientId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to create project.');
        return;
      }
      window.location.href = `/admin/projects/${data.id}`;
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-mid)',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--soft-white)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
  };

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '0.5rem' }}>
              Workspace
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: 'var(--soft-white)' }}>
              Projects
            </h1>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </div>
          </div>

          <button
            onClick={() => setCreating((v) => !v)}
            disabled={clients.length === 0}
            style={{
              padding: '0.7rem 1.2rem',
              borderRadius: '10px',
              border: '1px solid rgba(92,158,131,0.4)',
              background: 'rgba(92,158,131,0.15)',
              color: 'var(--forest-bright)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: clients.length === 0 ? 'not-allowed' : 'pointer',
              opacity: clients.length === 0 ? 0.5 : 1,
            }}
            title={clients.length === 0 ? 'Add a client first' : undefined}
          >
            + New project
          </button>
        </header>

        {error && (
          <div style={{ border: '1px solid rgba(200,80,80,0.3)', background: 'rgba(200,80,80,0.1)', color: '#e08a8a', borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {creating && (
          <div style={{ border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(21,15,10,0.7)', padding: '1.5rem', marginBottom: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--soft-white)' }}>New project</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="project-name" style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-light)', marginBottom: '0.35rem' }}>
                  Project name *
                </label>
                <input id="project-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
              </div>
              <div>
                <label htmlFor="project-client" style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-light)', marginBottom: '0.35rem' }}>
                  Client *
                </label>
                <select id="project-client" style={inputStyle} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setCreating(false)} style={{ padding: '0.7rem 1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--muted-light)', cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button onClick={createProject} disabled={busy} style={{ padding: '0.7rem 1.4rem', borderRadius: '10px', border: '1px solid rgba(92,158,131,0.4)', background: 'rgba(92,158,131,0.2)', color: 'var(--forest-bright)', cursor: busy ? 'default' : 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: busy ? 0.6 : 1 }}>
                {busy ? 'Creating…' : 'Create & manage'}
              </button>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div style={{ border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(21, 15, 10, 0.7)', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8 }}>
              No projects found. Create your first project to get started.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map((project) => (
              <div key={project.id} style={{ border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(21, 15, 10, 0.7)', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
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

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <StatusBadge status={project.status} />
                    <a
                      href={`/admin/projects/${project.id}`}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(92,158,131,0.4)',
                        background: 'rgba(92,158,131,0.12)',
                        color: 'var(--forest-bright)',
                        fontSize: '0.75rem',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Manage →
                    </a>
                  </div>
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
