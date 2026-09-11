import { cloneElement, isValidElement, useId, useState } from 'react';
import ImageUploader from './ImageUploader';

type PortfolioCategory =
  | 'web-development'
  | 'web-redesign'
  | 'saas'
  | 'ai-tool'
  | 'ai-automation';

type PortfolioStatus = 'done' | 'in-progress';

type PortfolioProjectRow = {
  id: string;
  title: string;
  category: PortfolioCategory;
  category_label: string | null;
  tagline: string;
  description: string;
  outcome: string;
  architecture: string[];
  stack: string[];
  github_url: string | null;
  live_url: string | null;
  accent: string;
  status: PortfolioStatus;
  published: boolean;
  featured: boolean;
  sort_order: number;
  images: string[];
  created_at: string;
  updated_at: string;
};

const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  'web-development': 'Web Development',
  'web-redesign': 'Web Redesign',
  saas: 'SaaS',
  'ai-tool': 'AI Tool',
  'ai-automation': 'AI Automation',
};

type FormState = {
  title: string;
  category: PortfolioCategory;
  category_label: string;
  tagline: string;
  description: string;
  outcome: string;
  architecture: string;
  stack: string;
  github_url: string;
  live_url: string;
  accent: string;
  status: PortfolioStatus;
  published: boolean;
  featured: boolean;
  images: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  category: 'web-development',
  category_label: '',
  tagline: '',
  description: '',
  outcome: '',
  architecture: '',
  stack: '',
  github_url: '',
  live_url: '',
  accent: 'var(--bronze-soft)',
  status: 'done',
  published: false,
  featured: false,
  images: '',
};

function rowToForm(row: PortfolioProjectRow): FormState {
  return {
    title: row.title,
    category: row.category,
    category_label: row.category_label ?? '',
    tagline: row.tagline,
    description: row.description,
    outcome: row.outcome,
    architecture: row.architecture.join('\n'),
    stack: row.stack.join('\n'),
    github_url: row.github_url ?? '',
    live_url: row.live_url ?? '',
    accent: row.accent,
    status: row.status,
    published: row.published,
    featured: row.featured,
    images: row.images.join('\n'),
  };
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const child = isValidElement(children)
    ? cloneElement(children as React.ReactElement<{ id?: string }>, { id })
    : children;
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {child}
    </div>
  );
}

function Badge({
  children,
  color,
  background,
  border,
}: {
  children: React.ReactNode;
  color: string;
  background: string;
  border: string;
}) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.3rem 0.6rem',
        borderRadius: '6px',
        fontSize: '0.66rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color,
        background,
        border: `1px solid ${border}`,
      }}
    >
      {children}
    </span>
  );
}

export default function AdminPortfolio({
  projects: initialProjects,
}: {
  projects: PortfolioProjectRow[];
}) {
  const [projects, setProjects] = useState<PortfolioProjectRow[]>(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImagesList([]);
    setError('');
    setIsCreating(true);
  };

  const openEdit = (row: PortfolioProjectRow) => {
    setIsCreating(false);
    setEditingId(row.id);
    setForm(rowToForm(row));
    setImagesList(row.images);
    setError('');
  };

  const closeEditor = () => {
    setIsCreating(false);
    setEditingId(null);
    setError('');
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: form.title,
      category: form.category,
      category_label: form.category_label || null,
      tagline: form.tagline,
      description: form.description,
      outcome: form.outcome,
      architecture: splitLines(form.architecture),
      stack: splitLines(form.stack),
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      accent: form.accent,
      status: form.status,
      published: form.published,
      featured: form.featured,
      images: splitLines(form.images),
    };

    try {
      if (isCreating) {
        const res = await fetch('/api/admin/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to create project.');
          return;
        }
        showNotice('Project created.');
        window.location.reload();
      } else if (editingId) {
        const res = await fetch(`/api/admin/portfolio/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to update project.');
          return;
        }
        showNotice('Project updated.');
        window.location.reload();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: PortfolioProjectRow) => {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) {
      return;
    }
    setError('');
    try {
      const res = await fetch(`/api/admin/portfolio/${row.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to delete project.');
        return;
      }
      setProjects((prev) => prev.filter((p) => p.id !== row.id));
      showNotice('Project deleted.');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const handleToggleState = async (row: PortfolioProjectRow, key: 'published' | 'featured') => {
    const next = !row[key];
    setError('');
    try {
      const res = await fetch(`/api/admin/portfolio/${row.id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to update project.');
        return;
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === row.id ? { ...p, [key]: next } : p)),
      );
      showNotice(next ? 'Published.' : 'Unpublished.');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;

    const next = [...projects];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);

    setProjects(next);
    setError('');

    try {
      const res = await fetch('/api/admin/portfolio/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: next.map((p) => p.id) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to reorder projects.');
        return;
      }
      showNotice('Order saved.');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const editorOpen = isCreating || editingId !== null;

  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
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
              Public site
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: 1.1,
                color: 'var(--text)',
              }}
            >
              Portfolio projects
            </h1>
            <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} ·{' '}
              {projects.filter((p) => p.published).length} published
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
            + New project
          </button>
        </header>

        {notice && (
          <div
            style={{
              border: '1px solid rgba(92,158,131,0.3)',
              background: 'rgba(92,158,131,0.1)',
              color: 'var(--verde-ink)',
              borderRadius: '10px',
              padding: '0.8rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            style={{
              border: '1px solid rgba(200,80,80,0.3)',
              background: 'rgba(200,80,80,0.1)',
              color: '#e08a8a',
              borderRadius: '10px',
              padding: '0.8rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        {editorOpen && (
          <section
            style={{
              border: '1px solid var(--line)',
              borderRadius: '20px',
              background: 'rgba(21,15,10,0.7)',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text)' }}>
                {isCreating ? 'New project' : 'Edit project'}
              </h2>
              <button
                onClick={closeEditor}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-soft)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.8rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Cancel
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Title *">
                  <input
                    style={inputStyle}
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    placeholder="Project name"
                  />
                </Field>
                <Field label="Category">
                  <select
                    style={inputStyle}
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value as PortfolioCategory)}
                  >
                    {(Object.keys(CATEGORY_LABELS) as PortfolioCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Category label (shown on card)">
                <input
                  style={inputStyle}
                  value={form.category_label}
                  onChange={(e) => setField('category_label', e.target.value)}
                  placeholder="e.g. Full-Stack Web App"
                />
              </Field>

              <Field label="Tagline">
                <input
                  style={inputStyle}
                  value={form.tagline}
                  onChange={(e) => setField('tagline', e.target.value)}
                  placeholder="Short one-line summary"
                />
              </Field>

              <Field label="Description">
                <textarea
                  style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Longer project description"
                />
              </Field>

              <Field label="Outcome">
                <textarea
                  style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                  value={form.outcome}
                  onChange={(e) => setField('outcome', e.target.value)}
                  placeholder="What was delivered"
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="GitHub URL">
                  <input
                    style={inputStyle}
                    value={form.github_url}
                    onChange={(e) => setField('github_url', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </Field>
                <Field label="Live URL">
                  <input
                    style={inputStyle}
                    value={form.live_url}
                    onChange={(e) => setField('live_url', e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Architecture (one per line)">
                  <textarea
                    style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                    value={form.architecture}
                    onChange={(e) => setField('architecture', e.target.value)}
                    placeholder={'Symfony 6\nTwig\nMySQL'}
                  />
                </Field>
                <Field label="Stack (one per line)">
                  <textarea
                    style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                    value={form.stack}
                    onChange={(e) => setField('stack', e.target.value)}
                    placeholder={'Symfony\nPHP\nMySQL'}
                  />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Accent color">
                  <input
                    style={inputStyle}
                    value={form.accent}
                    onChange={(e) => setField('accent', e.target.value)}
                    placeholder="var(--bronze-soft)"
                  />
                </Field>
                <Field label="Status">
                  <select
                    style={inputStyle}
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value as PortfolioStatus)}
                  >
                    <option value="done">Shipped</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </Field>
              </div>

              <Field label="Images">
                <ImageUploader
                  scope="portfolio"
                  entityId={editingId ?? ''}
                  images={imagesList}
                  disabled={isCreating || !editingId}
                  onChange={(next) => {
                    setImagesList(next);
                    setField('images', next.join('\n'));
                  }}
                />
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-soft)', marginBottom: '0.35rem' }}>
                    Or paste image URLs (one per line)
                  </div>
                  <textarea
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                    value={form.images}
                    onChange={(e) => {
                      setField('images', e.target.value);
                      setImagesList(splitLines(e.target.value));
                    }}
                    placeholder={'https://.../shot-1.png\nhttps://.../shot-2.png'}
                  />
                </div>
              </Field>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setField('published', e.target.checked)}
                  />
                  Published
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setField('featured', e.target.checked)}
                  />
                  Featured
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  onClick={closeEditor}
                  style={{
                    padding: '0.7rem 1.2rem',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    background: 'transparent',
                    color: 'var(--text-soft)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '0.7rem 1.4rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(92,158,131,0.4)',
                    background: 'rgba(92,158,131,0.2)',
                    color: 'var(--verde-ink)',
                    cursor: saving ? 'default' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Saving…' : isCreating ? 'Create project' : 'Save changes'}
                </button>
              </div>
            </div>
          </section>
        )}

        {projects.length === 0 ? (
          <div
            style={{
              border: '1px solid var(--line)',
              borderRadius: '18px',
              background: 'rgba(21,15,10,0.7)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--text-faint)', fontSize: '1rem', lineHeight: 1.8 }}>
              No portfolio projects yet. Click “New project” to add your first one.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map((project, index) => (
              <div
                key={project.id}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '18px',
                  background: 'rgba(21,15,10,0.7)',
                  padding: '1.5rem',
                  display: 'grid',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <Badge color="var(--bronze)" background="rgba(200,184,154,0.08)" border="rgba(200,184,154,0.2)">
                        {CATEGORY_LABELS[project.category]}
                      </Badge>
                      {project.published ? (
                        <Badge color="var(--verde-ink)" background="rgba(92,158,131,0.12)" border="rgba(92,158,131,0.3)">
                          Published
                        </Badge>
                      ) : (
                        <Badge color="var(--text-soft)" background="var(--glass-2)" border="var(--glass-border)">
                          Draft
                        </Badge>
                      )}
                      {project.featured && (
                        <Badge color="#c8a050" background="rgba(200,160,80,0.1)" border="rgba(200,160,80,0.3)">
                          Featured
                        </Badge>
                      )}
                      <Badge color="var(--text-soft)" background="var(--glass-2)" border="var(--glass-border)">
                        {project.status === 'done' ? 'Shipped' : 'In Progress'}
                      </Badge>
                    </div>
                    <h2 style={{ margin: '0 0 0.4rem', fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: 'var(--text)' }}>
                      {project.title}
                    </h2>
                    {project.tagline && (
                      <div style={{ color: 'var(--text-soft)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {project.tagline}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      title="Move up"
                      aria-label="Move project up"
                      style={iconButtonStyle(index === 0)}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === projects.length - 1}
                      title="Move down"
                      aria-label="Move project down"
                      style={iconButtonStyle(index === projects.length - 1)}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleToggleState(project, 'published')}
                      title={project.published ? 'Unpublish' : 'Publish'}
                      style={iconButtonStyle(false)}
                    >
                      {project.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleToggleState(project, 'featured')}
                      title={project.featured ? 'Remove featured' : 'Mark featured'}
                      style={iconButtonStyle(false)}
                    >
                      {project.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button onClick={() => openEdit(project)} title="Edit" style={iconButtonStyle(false)}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      title="Delete"
                      style={{
                        ...iconButtonStyle(false),
                        color: '#e08a8a',
                        borderColor: 'rgba(200,80,80,0.3)',
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

function iconButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '0.45rem 0.7rem',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass-1)',
    color: 'var(--text-soft)',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: '0.75rem',
    opacity: disabled ? 0.4 : 1,
  };
}
