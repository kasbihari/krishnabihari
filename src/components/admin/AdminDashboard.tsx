type AdminSummary = {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
  totalHoursUsed: number;
};

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: '20px',
        padding: '1.2rem',
        background: 'var(--glass-1)',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--bronze)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '2.2rem',
          marginTop: '0.7rem',
          color: 'var(--text)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboard({ summary }: { summary: AdminSummary }) {
  return (
    <main style={{ minHeight: '100svh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--bronze)',
                marginBottom: '0.5rem',
              }}
            >
              Developer access
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
              }}
            >
              Admin dashboard
            </h1>
          </div>

          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '999px',
              padding: '0.7rem 1rem',
              color: 'var(--text-soft)',
              background: 'var(--glass-1)',
            }}
          >
            Live workspace
          </div>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard label="Clients" value={String(summary.totalClients)} />
          <StatCard label="Projects" value={String(summary.totalProjects)} />
          <StatCard label="Active projects" value={String(summary.activeProjects)} />
          <StatCard label="Completed" value={String(summary.completedProjects)} />
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '1rem',
          }}
        >
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '22px',
              background: 'var(--glass-1)',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--bronze)',
                marginBottom: '1rem',
              }}
            >
              Delivery overview
            </div>
            <div style={{ display: 'grid', gap: '0.9rem' }}>
              <div style={{ color: 'var(--text)', fontSize: '1.1rem' }}>Average project progress: {summary.averageProgress}%</div>
              <div style={{ color: 'var(--text-faint)', lineHeight: 1.8 }}>
                Total tracked hours: {summary.totalHoursUsed}h across the current project set.
              </div>
            </div>
          </div>

          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '22px',
              background: 'var(--glass-1)',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--bronze)',
                marginBottom: '1rem',
              }}
            >
              Operations
            </div>
            <ul style={{ color: 'var(--text)', lineHeight: 1.9, margin: 0, paddingLeft: '1.1rem' }}>
              <li><a href="/admin/clients" style={{ color: 'var(--text)', textDecoration: 'none' }}>Manage clients</a></li>
              <li><a href="/admin/projects" style={{ color: 'var(--text)', textDecoration: 'none' }}>Manage projects</a></li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
