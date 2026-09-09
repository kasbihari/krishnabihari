import crypto from 'node:crypto';
import { supabaseAdmin } from './supabase-admin';
import { deleteAllManagedImages, deleteOrphanedImages } from './storage';

/**
 * Generate a human-friendly, unique-ish project code, e.g. "PROJ-ACME-3F9K".
 * The random suffix guards against collisions for same-named projects.
 */
export function generateProjectCode(name: string): string {
  const slug = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 12);
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  const base = slug.length > 0 ? slug : 'PROJ';
  return `PROJ-${base}-${suffix}`;
}

/* =========================================================
   Types — mirror the client-portal schema
   ========================================================= */

export type ClientRow = {
  id: string;
  name: string;
  company: string;
  client_code: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectRow = {
  id: string;
  client_id: string;
  project_code: string;
  name: string;
  description: string | null;
  type: string | null;
  category: string | null;
  status: string | null;
  phase: string | null;
  progress: number | null;
  expected_launch: string | null;
  live_demo_url: string | null;
  images: string[] | null;
  created_at?: string;
  updated_at?: string;
};

export type TimelineRow = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'completed' | 'active' | 'upcoming';
  timeline_date: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type MilestoneRow = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'completed' | 'active' | 'upcoming';
  milestone_date: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type HoursRow = {
  id: string;
  project_id: string;
  hours_allocated: number | null;
  hours_used: number | null;
  updated_at?: string;
};

export type UpdateRow = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  update_type: string | null;
  published: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type ProgressHistoryRow = {
  id: string;
  project_id: string;
  progress: number;
  phase: string | null;
  note: string | null;
  recorded_at: string;
  created_at?: string;
};

export type ProjectDetail = {
  project: ProjectRow;
  client: ClientRow | null;
  timeline: TimelineRow[];
  milestones: MilestoneRow[];
  hours: HoursRow | null;
  updates: UpdateRow[];
  progressHistory: ProgressHistoryRow[];
};

/* =========================================================
   Fetch helpers
   ========================================================= */

export async function fetchClientById(id: string): Promise<ClientRow | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.from('clients').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as ClientRow;
}

export async function fetchProjectById(id: string): Promise<ProjectRow | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.from('projects').select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as ProjectRow;
}

export async function fetchProjectDetail(projectId: string): Promise<ProjectDetail | null> {
  if (!supabaseAdmin) return null;

  const project = await fetchProjectById(projectId);
  if (!project) return null;

  const client = project.client_id ? await fetchClientById(project.client_id) : null;

  const [timelineRes, milestonesRes, hoursRes, updatesRes, historyRes] = await Promise.all([
    supabaseAdmin.from('project_timeline').select('*').eq('project_id', projectId).order('sort_order', { ascending: true }),
    supabaseAdmin.from('project_milestones').select('*').eq('project_id', projectId).order('sort_order', { ascending: true }),
    supabaseAdmin.from('project_hours').select('*').eq('project_id', projectId).maybeSingle(),
    supabaseAdmin.from('project_updates').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    supabaseAdmin.from('project_progress_history').select('*').eq('project_id', projectId).order('recorded_at', { ascending: true }),
  ]);

  return {
    project,
    client,
    timeline: (timelineRes.data ?? []) as TimelineRow[],
    milestones: (milestonesRes.data ?? []) as MilestoneRow[],
    hours: (hoursRes.data as HoursRow | null) ?? null,
    updates: (updatesRes.data ?? []) as UpdateRow[],
    progressHistory: (historyRes.data ?? []) as ProgressHistoryRow[],
  };
}

/* =========================================================
   Clients
   ========================================================= */

export type ClientInput = {
  name: string;
  company: string;
  client_code: string;
};

export async function createClient(input: ClientInput): Promise<{ id: string } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabaseAdmin
    .from('clients')
    .insert({ name: input.name, company: input.company, client_code: input.client_code.trim().toUpperCase() })
    .select('id')
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) payload.name = input.name;
  if (input.company !== undefined) payload.company = input.company;
  if (input.client_code !== undefined) payload.client_code = input.client_code.trim().toUpperCase();
  const { error } = await supabaseAdmin.from('clients').update(payload).eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteClient(id: string): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { error } = await supabaseAdmin.from('clients').delete().eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

/* =========================================================
   Projects
   ========================================================= */

export type ProjectInput = {
  client_id: string;
  name: string;
  project_code?: string;
  description?: string;
  type?: string;
  category?: string;
  status?: string;
  phase?: string;
  progress?: number;
  expected_launch?: string;
  live_demo_url?: string;
  images?: string[];
};

export async function createProject(input: ProjectInput): Promise<{ id: string } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const projectCode = input.project_code?.trim().toUpperCase() || generateProjectCode(input.name);
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({
      client_id: input.client_id,
      project_code: projectCode,
      name: input.name,
      description: input.description ?? '',
      type: input.type ?? 'Project',
      category: input.category ?? 'web-development',
      status: input.status ?? 'Active',
      phase: input.phase ?? 'Planning',
      progress: Math.min(100, Math.max(0, input.progress ?? 0)),
      expected_launch: input.expected_launch ?? null,
      live_demo_url: input.live_demo_url ?? null,
      images: input.images ?? [],
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.client_id !== undefined) payload.client_id = input.client_id;
  if (input.name !== undefined) payload.name = input.name;
  if (input.description !== undefined) payload.description = input.description;
  if (input.type !== undefined) payload.type = input.type;
  if (input.category !== undefined) payload.category = input.category;
  if (input.status !== undefined) payload.status = input.status;
  if (input.phase !== undefined) payload.phase = input.phase;
  if (input.progress !== undefined) payload.progress = Math.min(100, Math.max(0, input.progress));
  if (input.expected_launch !== undefined) payload.expected_launch = input.expected_launch;
  if (input.live_demo_url !== undefined) payload.live_demo_url = input.live_demo_url;
  if (input.images !== undefined) payload.images = input.images;

  // Capture previously stored images for orphan cleanup after the update.
  const { data: existing } = await supabaseAdmin
    .from('projects')
    .select('images')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabaseAdmin.from('projects').update(payload).eq('id', id);
  if (error) return { error: error.message };

  if (input.images !== undefined) {
    const previous = Array.isArray(existing?.images)
      ? (existing.images as string[])
      : [];
    await deleteOrphanedImages(previous, input.images);
  }

  return { ok: true };
}

export async function deleteProject(id: string): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };

  const { data: existing } = await supabaseAdmin
    .from('projects')
    .select('images')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };

  if (Array.isArray(existing?.images)) {
    await deleteAllManagedImages(existing.images as string[]);
  }

  return { ok: true };
}

/* =========================================================
   Timeline
   ========================================================= */

export type TimelineInput = {
  project_id: string;
  title: string;
  description?: string;
  status?: 'completed' | 'active' | 'upcoming';
  timeline_date?: string;
  sort_order?: number;
};

export async function createTimelineEntry(input: TimelineInput): Promise<{ id: string } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabaseAdmin
    .from('project_timeline')
    .insert({
      project_id: input.project_id,
      title: input.title,
      description: input.description ?? '',
      status: input.status ?? 'upcoming',
      timeline_date: input.timeline_date ?? null,
      sort_order: input.sort_order ?? 0,
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function updateTimelineEntry(id: string, input: Partial<TimelineInput>): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.status !== undefined) payload.status = input.status;
  if (input.timeline_date !== undefined) payload.timeline_date = input.timeline_date;
  if (input.sort_order !== undefined) payload.sort_order = input.sort_order;
  const { error } = await supabaseAdmin.from('project_timeline').update(payload).eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteTimelineEntry(id: string): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { error } = await supabaseAdmin.from('project_timeline').delete().eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

/* =========================================================
   Milestones
   ========================================================= */

export type MilestoneInput = {
  project_id: string;
  title: string;
  description?: string;
  status?: 'completed' | 'active' | 'upcoming';
  milestone_date?: string;
  sort_order?: number;
};

export async function createMilestone(input: MilestoneInput): Promise<{ id: string } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabaseAdmin
    .from('project_milestones')
    .insert({
      project_id: input.project_id,
      title: input.title,
      description: input.description ?? '',
      status: input.status ?? 'upcoming',
      milestone_date: input.milestone_date ?? null,
      sort_order: input.sort_order ?? 0,
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function updateMilestone(id: string, input: Partial<MilestoneInput>): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.status !== undefined) payload.status = input.status;
  if (input.milestone_date !== undefined) payload.milestone_date = input.milestone_date;
  if (input.sort_order !== undefined) payload.sort_order = input.sort_order;
  const { error } = await supabaseAdmin.from('project_milestones').update(payload).eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteMilestone(id: string): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { error } = await supabaseAdmin.from('project_milestones').delete().eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

/* =========================================================
   Hours
   ========================================================= */

export type HoursInput = {
  project_id: string;
  hours_allocated?: number;
  hours_used?: number;
};

export async function upsertHours(input: HoursInput): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { error } = await supabaseAdmin.from('project_hours').upsert(
    {
      project_id: input.project_id,
      hours_allocated: Math.max(0, input.hours_allocated ?? 0),
      hours_used: Math.max(0, input.hours_used ?? 0),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'project_id' },
  );
  if (error) return { error: error.message };
  return { ok: true };
}

/* =========================================================
   Updates
   ========================================================= */

export type UpdateInput = {
  project_id: string;
  title: string;
  description?: string;
  update_type?: string;
  published?: boolean;
};

export async function createUpdate(input: UpdateInput): Promise<{ id: string } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { data, error } = await supabaseAdmin
    .from('project_updates')
    .insert({
      project_id: input.project_id,
      title: input.title,
      description: input.description ?? '',
      update_type: input.update_type ?? 'progress',
      published: input.published ?? true,
    })
    .select('id')
    .single();
  if (error) return { error: error.message };
  return { id: data.id };
}

export async function updateUpdate(id: string, input: Partial<UpdateInput>): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) payload.title = input.title;
  if (input.description !== undefined) payload.description = input.description;
  if (input.update_type !== undefined) payload.update_type = input.update_type;
  if (input.published !== undefined) payload.published = input.published;
  const { error } = await supabaseAdmin.from('project_updates').update(payload).eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function deleteUpdate(id: string): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) return { error: 'Supabase is not configured.' };
  const { error } = await supabaseAdmin.from('project_updates').delete().eq('id', id);
  if (error) return { error: error.message };
  return { ok: true };
}
