type ClientItem = {
  id: string;
  name: string;
  company: string;
  client_code: string;
  project_count: number;
};

type AdminClientsProps = {
  clients: ClientItem[];
};

export default function AdminClients({ clients }: AdminClientsProps) {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '0.5rem' }}>
            Workspace
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: 'var(--soft-white)' }}>
            Clients
          </h1>
        </header>

        {clients.length === 0 ? (
          <div style={{ border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(10, 10, 10, 0.7)', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8 }}>
              No clients found. Add your first client to get started.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {clients.map((client) => (
              <div key={client.id} style={{ border: '1px solid var(--border-mid)', borderRadius: '18px', background: 'rgba(10, 10, 10, 0.7)', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '0.35rem' }}>
                    {client.company}
                  </div>
                  <h2 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: 'var(--soft-white)' }}>
                    {client.name}
                  </h2>
                  <div style={{ color: 'var(--muted-light)', fontSize: '0.85rem' }}>
                    Code: <span style={{ fontFamily: 'monospace', color: 'var(--sand-light)' }}>{client.client_code}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--sand-light)', lineHeight: 1 }}>
                    {client.project_count}
                  </div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-light)' }}>
                    {client.project_count === 1 ? 'Project' : 'Projects'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
