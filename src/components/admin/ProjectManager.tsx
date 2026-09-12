import { cloneElement, isValidElement, useId, useState } from 'react';
import ImageUploader from './ImageUploader';
import type {
  HoursRow,
  MilestoneRow,
  ProjectDetail,
  ProjectRow,
  TimelineRow,
  UpdateRow,
} from '../../lib/server/client-admin';
import type { AdminClientsView } from '../../lib/server/admin-data';
import type { ProjectStatusOption } from '../../lib/server/project-enums';

const STATUS_OPTIONS = ['completed', 'active', 'upcoming'] as const;
type EntryStatus = (typeof STATUS_OPTIONS)[number];

const STATUS_LABELS: Record<EntryStatus, string> = {
  completed: 'Completed',
  active: 'Active',
  upcoming: 'Upcoming',
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
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

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: '1px solid var(--line)',
        borderRadius: '20px',
        background: 'rgba(21,15,10,0.7)',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text)' }}>{title}</h2>
          {subtitle && (
            <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {subtitle}
            </div>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Notice({ kind, children }: { kind: 'success' | 'error'; children: React.ReactNode }) {
  const isError = kind === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      style={{
        border: `1px solid ${isError ? 'rgba(200,80,80,0.3)' : 'rgba(92,158,131,0.3)'}`,
        background: isError ? 'rgba(200,80,80,0.1)' : 'rgba(92,158,131,0.1)',
        color: isError ? '#e08a8a' : 'var(--verde-ink)',
        borderRadius: '10px',
        padding: '0.8rem 1rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
      }}
    >
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: EntryStatus }) {
  const color =
    status === 'completed'
      ? 'var(--verde-ink)'
      : status === 'active'
        ? 'var(--bronze)'
        : 'var(--text-soft)';
  const bg =
    status === 'completed'
      ? 'rgba(92,158,131,0.12)'
      : status === 'active'
        ? 'rgba(200,184,154,0.1)'
        : 'var(--glass-2)';
  const border =
    status === 'completed'
      ? 'rgba(92,158,131,0.3)'
      : status === 'active'
        ? 'rgba(200,184,154,0.25)'
        : 'var(--glass-border)';
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
        background: bg,
        border: `1px solid ${border}`,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function smallButton(disabled = false): React.CSSProperties {
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

export default function ProjectManager({
  detail,
  clients,
  statusOptions = [],
}: {
  detail: ProjectDetail;
  clients: AdminClientsView[];
  statusOptions?: ProjectStatusOption[];
}) {
  const [project, setProject] = useState<ProjectRow>(detail.project);
  const [timeline, setTimeline] = useState<TimelineRow[]>(detail.timeline);
  const [milestones, setMilestones] = useState<MilestoneRow[]>(detail.milestones);
  const [hours, setHours] = useState<HoursRow | null>(detail.hours);
  const [updates, setUpdates] = useState<UpdateRow[]>(detail.updates);

  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [overview, setOverview] = useState({
    name: detail.project.name,
    client_id: detail.project.client_id,
    description: detail.project.description ?? '',
    type: detail.project.type ?? '',
    category: detail.project.category ?? '',
    status: detail.project.status ?? '',
    phase: detail.project.phase ?? '',
    progress: detail.project.progress ?? 0,
    expected_launch: detail.project.expected_launch ?? '',
    live_demo_url: detail.project.live_demo_url ?? '',
    images: detail.project.images ?? [],
  });

  const [timelineDraft, setTimelineDraft] = useState<{
    title: string;
    description: string;
    status: EntryStatus;
    timeline_date: string;
  } | null>(null);
  const [timelineEditId, setTimelineEditId] = useState<string | null>(null);

  const [milestoneDraft, setMilestoneDraft] = useState<{
    title: string;
    description: string;
    status: EntryStatus;
    milestone_date: string;
  } | null>(null);
  const [milestoneEditId, setMilestoneEditId] = useState<string | null>(null);

  const [hoursDraft, setHoursDraft] = useState<{
    hours_allocated: string;
    hours_used: string;
  } | null>(null);

  const [updateDraft, setUpdateDraft] = useState<{
    title: string;
    description: string;
    update_type: string;
    published: boolean;
  } | null>(null);
  const [updateEditId, setUpdateEditId] = useState<string | null>(null);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const setOverviewField = <K extends keyof typeof overview>(
    key: K,
    value: (typeof overview)[K],
  ) => {
    setOverview((prev) => ({ ...prev, [key]: value }));
  };

  const saveOverview = async () => {
    if (!overview.name.trim()) {
      setError('Project name is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: overview.name,
          client_id: overview.client_id,
          description: overview.description,
          type: overview.type,
          category: overview.category,
          status: overview.status,
          phase: overview.phase,
          progress: Number(overview.progress),
          expected_launch: overview.expected_launch,
          live_demo_url: overview.live_demo_url,
          images: overview.images,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to save project.');
        return;
      }
      setProject((prev) => ({ ...prev, ...overview, progress: Number(overview.progress) }));
      flash('Project saved.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const saveTimeline = async () => {
    if (!timelineDraft) return;
    if (!timelineDraft.title.trim()) {
      setError('Timeline title is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (timelineEditId) {
        const res = await fetch(`/api/admin/projects/${project.id}/timeline/${timelineEditId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(timelineDraft),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to update timeline entry.');
          return;
        }
        setTimeline((prev) =>
          prev.map((t) => (t.id === timelineEditId ? { ...t, ...timelineDraft } : t)),
        );
        flash('Timeline entry updated.');
      } else {
        const res = await fetch(`/api/admin/projects/${project.id}/timeline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...timelineDraft, sort_order: timeline.length + 1 }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to create timeline entry.');
          return;
        }
        setTimeline((prev) => [
          ...prev,
          { id: data.id, project_id: project.id, ...timelineDraft, sort_order: prev.length + 1 },
        ]);
        flash('Timeline entry added.');
      }
      setTimelineDraft(null);
      setTimelineEditId(null);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const deleteTimeline = async (id: string) => {
    if (!window.confirm('Delete this timeline entry?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/projects/${project.id}/timeline/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to delete timeline entry.');
        return;
      }
      setTimeline((prev) => prev.filter((t) => t.id !== id));
      flash('Timeline entry deleted.');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const saveMilestone = async () => {
    if (!milestoneDraft) return;
    if (!milestoneDraft.title.trim()) {
      setError('Milestone title is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (milestoneEditId) {
        const res = await fetch(`/api/admin/projects/${project.id}/milestones/${milestoneEditId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(milestoneDraft),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to update milestone.');
          return;
        }
        setMilestones((prev) =>
          prev.map((m) => (m.id === milestoneEditId ? { ...m, ...milestoneDraft } : m)),
        );
        flash('Milestone updated.');
      } else {
        const res = await fetch(`/api/admin/projects/${project.id}/milestones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...milestoneDraft, sort_order: milestones.length + 1 }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to create milestone.');
          return;
        }
        setMilestones((prev) => [
          ...prev,
          { id: data.id, project_id: project.id, ...milestoneDraft, sort_order: prev.length + 1 },
        ]);
        flash('Milestone added.');
      }
      setMilestoneDraft(null);
      setMilestoneEditId(null);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const deleteMilestone = async (id: string) => {
    if (!window.confirm('Delete this milestone?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/projects/${project.id}/milestones/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to delete milestone.');
        return;
      }
      setMilestones((prev) => prev.filter((m) => m.id !== id));
      flash('Milestone deleted.');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const saveHours = async () => {
    if (!hoursDraft) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/projects/${project.id}/hours`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hours_allocated: Number(hoursDraft.hours_allocated) || 0,
          hours_used: Number(hoursDraft.hours_used) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to save hours.');
        return;
      }
      setHours({
        id: hours?.id ?? `hours-${project.id}`,
        project_id: project.id,
        hours_allocated: Number(hoursDraft.hours_allocated) || 0,
        hours_used: Number(hoursDraft.hours_used) || 0,
      });
      setHoursDraft(null);
      flash('Hours saved.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const saveUpdate = async () => {
    if (!updateDraft) return;
    if (!updateDraft.title.trim()) {
      setError('Update title is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (updateEditId) {
        const res = await fetch(`/api/admin/projects/${project.id}/updates/${updateEditId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateDraft),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to update update.');
          return;
        }
        setUpdates((prev) =>
          prev.map((u) => (u.id === updateEditId ? { ...u, ...updateDraft } : u)),
        );
        flash('Update saved.');
      } else {
        const res = await fetch(`/api/admin/projects/${project.id}/updates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateDraft),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to create update.');
          return;
        }
        setUpdates((prev) => [
          { id: data.id, project_id: project.id, ...updateDraft, created_at: new Date().toISOString() },
          ...prev,
        ]);
        flash('Update published.');
      }
      setUpdateDraft(null);
      setUpdateEditId(null);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const deleteUpdate = async (id: string) => {
    if (!window.confirm('Delete this update?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/projects/${project.id}/updates/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to delete update.');
        return;
      }
      setUpdates((prev) => prev.filter((u) => u.id !== id));
      flash('Update deleted.');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const clientName =
    clients.find((c) => c.id === project.client_id)?.name ??
    detail.client?.name ??
    'Unknown client';

  return (
    <main style={{ minHeight: '100svh', padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
        <header>
          <a
            href="/admin/projects"
            style={{
              color: 'var(--bronze)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '0.75rem',
            }}
          >
            ← Back to projects
          </a>
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--bronze)',
              marginBottom: '0.5rem',
            }}
          >
            {clientName} · {project.project_code}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.1,
              color: 'var(--text)',
            }}
          >
            {project.name}
          </h1>
        </header>

        {notice && <Notice kind="success">{notice}</Notice>}
        {error && <Notice kind="error">{error}</Notice>}

        <SectionCard title="Project details" subtitle="Core project information shown to the client.">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Project name *">
                <input
                  style={inputStyle}
                  value={overview.name}
                  onChange={(e) => setOverviewField('name', e.target.value)}
                />
              </Field>
              <Field label="Client">
                <select
                  style={inputStyle}
                  value={overview.client_id}
                  onChange={(e) => setOverviewField('client_id', e.target.value)}
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.company}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={overview.description}
                onChange={(e) => setOverviewField('description', e.target.value)}
              />
            </Field>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
              }}
            >
              <Field label="Type">
                <input
                  style={inputStyle}
                  value={overview.type}
                  onChange={(e) => setOverviewField('type', e.target.value)}
                />
              </Field>
              <Field label="Category">
                <input
                  style={inputStyle}
                  value={overview.category}
                  onChange={(e) => setOverviewField('category', e.target.value)}
                />
              </Field>
              <Field label="Status">
                {statusOptions.length > 0 ? (
                  <select
                    style={inputStyle}
                    value={overview.status}
                    onChange={(e) => setOverviewField('status', e.target.value)}
                  >
                    {/* A stored value that is not in the sampled list still
                        has to be selectable, otherwise saving would silently
                        rewrite the project's current status. */}
                    {overview.status &&
                      !statusOptions.some((option) => option.value === overview.status) && (
                        <option value={overview.status}>{overview.status}</option>
                      )}
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  // No stored values to learn the enum labels from yet — fall
                  // back to free text rather than inventing a list.
                  <input
                    style={inputStyle}
                    value={overview.status}
                    onChange={(e) => setOverviewField('status', e.target.value)}
                    placeholder="Status"
                  />
                )}
              </Field>
              <Field label="Phase">
                <input
                  style={inputStyle}
                  value={overview.phase}
                  onChange={(e) => setOverviewField('phase', e.target.value)}
                />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Progress (%)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  style={inputStyle}
                  value={overview.progress}
                  onChange={(e) => setOverviewField('progress', Number(e.target.value))}
                />
              </Field>
              <Field label="Expected launch">
                <input
                  style={inputStyle}
                  value={overview.expected_launch}
                  onChange={(e) => setOverviewField('expected_launch', e.target.value)}
                  placeholder="e.g. September 2026"
                />
              </Field>
            </div>

            <Field label="Live demo URL">
              <input
                style={inputStyle}
                value={overview.live_demo_url}
                onChange={(e) => setOverviewField('live_demo_url', e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <Field label="Project images">
              <ImageUploader
                scope="client"
                entityId={project.id}
                images={overview.images}
                onChange={(next) => setOverviewField('images', next)}
              />
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={saveOverview}
                disabled={busy}
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(92,158,131,0.4)',
                  background: 'rgba(92,158,131,0.2)',
                  color: 'var(--verde-ink)',
                  cursor: busy ? 'default' : 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  opacity: busy ? 0.6 : 1,
                }}
              >
                {busy ? 'Saving…' : 'Save project'}
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Timeline"
          subtitle="Phases of the project shown to the client."
          action={
            <button
              onClick={() => {
                setTimelineEditId(null);
                setTimelineDraft({ title: '', description: '', status: 'upcoming', timeline_date: '' });
              }}
              style={smallButton()}
            >
              + Add entry
            </button>
          }
        >
          {timelineDraft && (
            <div
              style={{
                border: '1px solid rgba(92,158,131,0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="Title *">
                  <input
                    style={inputStyle}
                    value={timelineDraft.title}
                    onChange={(e) => setTimelineDraft({ ...timelineDraft, title: e.target.value })}
                  />
                </Field>
                <Field label="Date">
                  <input
                    style={inputStyle}
                    value={timelineDraft.timeline_date}
                    onChange={(e) =>
                      setTimelineDraft({ ...timelineDraft, timeline_date: e.target.value })
                    }
                    placeholder="e.g. Mar 2026"
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={timelineDraft.description}
                  onChange={(e) =>
                    setTimelineDraft({ ...timelineDraft, description: e.target.value })
                  }
                />
              </Field>
              <Field label="Status">
                <select
                  style={inputStyle}
                  value={timelineDraft.status}
                  onChange={(e) =>
                    setTimelineDraft({ ...timelineDraft, status: e.target.value as EntryStatus })
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </Field>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setTimelineDraft(null);
                    setTimelineEditId(null);
                  }}
                  style={smallButton()}
                >
                  Cancel
                </button>
                <button
                  onClick={saveTimeline}
                  disabled={busy}
                  style={{ ...smallButton(), color: 'var(--verde-ink)', borderColor: 'rgba(92,158,131,0.4)' }}
                >
                  {busy ? 'Saving…' : timelineEditId ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          )}

          {timeline.length === 0 && !timelineDraft ? (
            <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
              No timeline entries yet. Add the first phase.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {timeline.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    border: '1px solid var(--glass-2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'grid',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <StatusPill status={entry.status} />
                        {entry.timeline_date && (
                          <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                            {entry.timeline_date}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          color: 'var(--text)',
                          fontWeight: 500,
                          marginTop: '0.4rem',
                        }}
                      >
                        {entry.title}
                      </div>
                      {entry.description && (
                        <div style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          {entry.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setTimelineEditId(entry.id);
                          setTimelineDraft({
                            title: entry.title,
                            description: entry.description ?? '',
                            status: entry.status,
                            timeline_date: entry.timeline_date ?? '',
                          });
                        }}
                        style={smallButton()}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTimeline(entry.id)}
                        style={{ ...smallButton(), color: '#e08a8a', borderColor: 'rgba(200,80,80,0.3)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Milestones"
          subtitle="Key milestones and their completion state."
          action={
            <button
              onClick={() => {
                setMilestoneEditId(null);
                setMilestoneDraft({ title: '', description: '', status: 'upcoming', milestone_date: '' });
              }}
              style={smallButton()}
            >
              + Add milestone
            </button>
          }
        >
          {milestoneDraft && (
            <div
              style={{
                border: '1px solid rgba(92,158,131,0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="Title *">
                  <input
                    style={inputStyle}
                    value={milestoneDraft.title}
                    onChange={(e) => setMilestoneDraft({ ...milestoneDraft, title: e.target.value })}
                  />
                </Field>
                <Field label="Date">
                  <input
                    style={inputStyle}
                    value={milestoneDraft.milestone_date}
                    onChange={(e) =>
                      setMilestoneDraft({ ...milestoneDraft, milestone_date: e.target.value })
                    }
                    placeholder="e.g. Jun 2026"
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={milestoneDraft.description}
                  onChange={(e) =>
                    setMilestoneDraft({ ...milestoneDraft, description: e.target.value })
                  }
                />
              </Field>
              <Field label="Status">
                <select
                  style={inputStyle}
                  value={milestoneDraft.status}
                  onChange={(e) =>
                    setMilestoneDraft({ ...milestoneDraft, status: e.target.value as EntryStatus })
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </Field>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setMilestoneDraft(null);
                    setMilestoneEditId(null);
                  }}
                  style={smallButton()}
                >
                  Cancel
                </button>
                <button
                  onClick={saveMilestone}
                  disabled={busy}
                  style={{ ...smallButton(), color: 'var(--verde-ink)', borderColor: 'rgba(92,158,131,0.4)' }}
                >
                  {busy ? 'Saving…' : milestoneEditId ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          )}

          {milestones.length === 0 && !milestoneDraft ? (
            <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
              No milestones yet. Add the first one.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {milestones.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    border: '1px solid var(--glass-2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'grid',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <StatusPill status={entry.status} />
                        {entry.milestone_date && (
                          <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                            {entry.milestone_date}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          color: 'var(--text)',
                          fontWeight: 500,
                          marginTop: '0.4rem',
                        }}
                      >
                        {entry.title}
                      </div>
                      {entry.description && (
                        <div style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          {entry.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setMilestoneEditId(entry.id);
                          setMilestoneDraft({
                            title: entry.title,
                            description: entry.description ?? '',
                            status: entry.status,
                            milestone_date: entry.milestone_date ?? '',
                          });
                        }}
                        style={smallButton()}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMilestone(entry.id)}
                        style={{ ...smallButton(), color: '#e08a8a', borderColor: 'rgba(200,80,80,0.3)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Hours" subtitle="Allocated and used hours for this project.">
          {hoursDraft ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="Hours allocated">
                  <input
                    type="number"
                    min={0}
                    style={inputStyle}
                    value={hoursDraft.hours_allocated}
                    onChange={(e) => setHoursDraft({ ...hoursDraft, hours_allocated: e.target.value })}
                  />
                </Field>
                <Field label="Hours used">
                  <input
                    type="number"
                    min={0}
                    style={inputStyle}
                    value={hoursDraft.hours_used}
                    onChange={(e) => setHoursDraft({ ...hoursDraft, hours_used: e.target.value })}
                  />
                </Field>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => setHoursDraft(null)} style={smallButton()}>
                  Cancel
                </button>
                <button
                  onClick={saveHours}
                  disabled={busy}
                  style={{ ...smallButton(), color: 'var(--verde-ink)', borderColor: 'rgba(92,158,131,0.4)' }}
                >
                  {busy ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
                    Allocated
                  </div>
                  <div style={{ fontSize: '1.6rem', color: 'var(--text)', fontWeight: 600 }}>
                    {hours?.hours_allocated ?? 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
                    Used
                  </div>
                  <div style={{ fontSize: '1.6rem', color: 'var(--bronze)', fontWeight: 600 }}>
                    {hours?.hours_used ?? 0}
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  setHoursDraft({
                    hours_allocated: String(hours?.hours_allocated ?? 0),
                    hours_used: String(hours?.hours_used ?? 0),
                  })
                }
                style={smallButton()}
              >
                Edit hours
              </button>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Updates"
          subtitle="Progress notes shown to the client."
          action={
            <button
              onClick={() => {
                setUpdateEditId(null);
                setUpdateDraft({ title: '', description: '', update_type: 'progress', published: true });
              }}
              style={smallButton()}
            >
              + New update
            </button>
          }
        >
          {updateDraft && (
            <div
              style={{
                border: '1px solid rgba(92,158,131,0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="Title *">
                  <input
                    style={inputStyle}
                    value={updateDraft.title}
                    onChange={(e) => setUpdateDraft({ ...updateDraft, title: e.target.value })}
                  />
                </Field>
                <Field label="Type">
                  <input
                    style={inputStyle}
                    value={updateDraft.update_type}
                    onChange={(e) => setUpdateDraft({ ...updateDraft, update_type: e.target.value })}
                    placeholder="e.g. progress, milestone, note"
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                  value={updateDraft.description}
                  onChange={(e) => setUpdateDraft({ ...updateDraft, description: e.target.value })}
                />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={updateDraft.published}
                  onChange={(e) => setUpdateDraft({ ...updateDraft, published: e.target.checked })}
                />
                Published
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setUpdateDraft(null);
                    setUpdateEditId(null);
                  }}
                  style={smallButton()}
                >
                  Cancel
                </button>
                <button
                  onClick={saveUpdate}
                  disabled={busy}
                  style={{ ...smallButton(), color: 'var(--verde-ink)', borderColor: 'rgba(92,158,131,0.4)' }}
                >
                  {busy ? 'Saving…' : updateEditId ? 'Save' : 'Publish'}
                </button>
              </div>
            </div>
          )}

          {updates.length === 0 && !updateDraft ? (
            <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
              No updates yet. Publish the first progress note.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {updates.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    border: '1px solid var(--glass-2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'grid',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {entry.published ? (
                          <StatusPill status="completed" />
                        ) : (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.66rem',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              fontWeight: 500,
                              color: 'var(--text-soft)',
                              background: 'var(--glass-2)',
                              border: '1px solid var(--glass-border)',
                            }}
                          >
                            Draft
                          </span>
                        )}
                        {entry.update_type && (
                          <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>{entry.update_type}</span>
                        )}
                        {entry.created_at && (
                          <span style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          color: 'var(--text)',
                          fontWeight: 500,
                          marginTop: '0.4rem',
                        }}
                      >
                        {entry.title}
                      </div>
                      {entry.description && (
                        <div style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          {entry.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setUpdateEditId(entry.id);
                          setUpdateDraft({
                            title: entry.title,
                            description: entry.description ?? '',
                            update_type: entry.update_type ?? 'progress',
                            published: entry.published ?? true,
                          });
                        }}
                        style={smallButton()}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUpdate(entry.id)}
                        style={{ ...smallButton(), color: '#e08a8a', borderColor: 'rgba(200,80,80,0.3)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </main>
  );
}
