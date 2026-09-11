import { useState } from 'react';

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--line)',
  background: 'var(--glass-1)',
  color: 'var(--text)',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.68rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-soft)',
  marginBottom: '0.35rem',
};

export default function AdminClients({ clients: initialClients }: AdminClientsProps) {
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', company: '', client_code: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', company: '', client_code: '' });
    setError('');
    setCreating(true);
  };

  const openEdit = (client: ClientItem) => {
    setCreating(false);
    setEditingId(client.id);
    setForm({ name: client.name, company: client.company, client_code: client.client_code });
    setError('');
  };

  const closeEditor = () => {
    setCreating(false);
    setEditingId(null);
    setError('');
  };

  const save = async () => {
    if (!form.name.trim() || !form.company.trim() || !form.client_code.trim()) {
      setError('Name, company and code are all required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (creating) {
        const res = await fetch('/api/admin/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to create client.');
          return;
        }
        flash('Client created.');
        window.location.reload();
      } else if (editingId) {
        const res = await fetch(`/api/admin/clients/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to update client.');
          return;
        }
        setClients((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)),
        );
        flash('Client updated.');
        closeEditor();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (client: ClientItem) => {
    if (!window.confirm(`Delete "${client.name}"? This also deletes their projects.`)) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to delete client.');
        return;
      }
      setClients((prev) => prev.filter((c) => c.id !== client.id));
      flash('Client deleted.');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const editorOpen = creating || editingId !== null;

  return (
    <main style={{ minHeight: '100svh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bronze)', marginBottom: '0.5rem' }}>
              Workspace
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, color: 'var(--text)' }}>
              Clients
            </h1>
            <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {clients.length} {clients.length === 1 ? 'client' : 'clients'}
            </div>
          </div>

          <button
            onClick={openCreate}
            style={{
              padding: '0.7rem 1.2rem',
              borderRadius: '10px',
              border: '1px solid rgba(92,158,131,0.4)',
              background: 'rgba(92,158,131,0.15)',
              color: 'var(--verde-ink)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + New client
          </button>
        </header>

        {notice && (
          <div style={{ border: '1px solid rgba(92,158,131,0.3)', background: 'rgba(92,158,131,0.1)', color: 'var(--verde-ink)', borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {notice}
          </div>
        )}

        {error && (
          <div style={{ border: '1px solid rgba(200,80,80,0.3)', background: 'rgba(200,80,80,0.1)', color: '#e08a8a', borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {editorOpen && (
          <div style={{ border: '1px solid var(--line)', borderRadius: '18px', background: 'rgba(21,15,10,0.7)', padding: '1.5rem', marginBottom: '1.5rem', display: 'grid', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>
              {creating ? 'New client' : 'Edit client'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label htmlFor="client-name" style={labelStyle}>Name *</label>
                <input id="client-name" style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contact name" />
              </div>
              <div>
                <label htmlFor="client-company" style={labelStyle}>Company *</label>
                <input id="client-company" style={inputStyle} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" />
              </div>
              <div>
                <label htmlFor="client-code" style={labelStyle}>Client code *</label>
                <input id="client-code" style={inputStyle} value={form.client_code} onChange={(e) => setForm({ ...form, client_code: e.target.value })} placeholder="e.g. ACME" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={closeEditor} style={{ padding: '0.7rem 1.2rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-soft)', cursor: 'pointer', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button onClick={save} disabled={busy} style={{ padding: '0.7rem 1.4rem', borderRadius: '10px', border: '1px solid rgba(92,158,131,0.4)', background: 'rgba(92,158,131,0.2)', color: 'var(--verde-ink)', cursor: busy ? 'default' : 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: busy ? 0.6 : 1 }}>
                {busy ? 'Saving…' : creating ? 'Create client' : 'Save changes'}
              </button>
            </div>
          </div>
        )}

        {clients.length === 0 ? (
          <div style={{ border: '1px solid var(--line)', borderRadius: '18px', background: 'var(--glass-1)', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-faint)', fontSize: '1rem', lineHeight: 1.8 }}>
              No clients found. Add your first client to get started.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {clients.map((client) => (
              <div key={client.id} style={{ border: '1px solid var(--line)', borderRadius: '18px', background: 'var(--glass-1)', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bronze)', marginBottom: '0.35rem' }}>
                    {client.company}
                  </div>
                  <h2 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: 'var(--text)' }}>
                    {client.name}
                  </h2>
                  <div style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>
                    Code: <span style={{ fontFamily: 'monospace', color: 'var(--bronze-soft)' }}>{client.client_code}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--bronze-soft)', lineHeight: 1 }}>
                      {client.project_count}
                    </div>
                    <div style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
                      {client.project_count === 1 ? 'Project' : 'Projects'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => openEdit(client)}
                      style={{
                        padding: '0.45rem 0.7rem',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        background: 'var(--glass-1)',
                        color: 'var(--text-soft)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(client)}
                      style={{
                        padding: '0.45rem 0.7rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(200,80,80,0.3)',
                        background: 'rgba(200,80,80,0.08)',
                        color: '#e08a8a',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Delete
                    </button>
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
