import { supabaseAdmin } from './supabase-admin';
import { deleteAllManagedImages, deleteOrphanedImages } from './storage';

export const PORTFOLIO_CATEGORIES = [
  'web-development',
  'web-redesign',
  'saas',
  'ai-tool',
  'ai-automation',
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export type PortfolioStatus = 'done' | 'in-progress';

/**
 * Sanitized input accepted by the admin create/update endpoints.
 * All fields are optional on update; required fields are enforced on create.
 */
export type PortfolioProjectInput = {
  title?: string;
  category?: PortfolioCategory;
  category_label?: string | null;
  tagline?: string;
  description?: string;
  outcome?: string;
  architecture?: string[];
  stack?: string[];
  github_url?: string | null;
  live_url?: string | null;
  accent?: string;
  status?: PortfolioStatus;
  published?: boolean;
  featured?: boolean;
  sort_order?: number;
  images?: string[];
};

const CATEGORY_SET = new Set<string>(PORTFOLIO_CATEGORIES);
const STATUS_SET = new Set<string>(['done', 'in-progress']);

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanNullableString(value: unknown): string | null {
  const cleaned = cleanString(value);
  return cleaned.length > 0 ? cleaned : null;
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

/**
 * Validates and normalizes raw JSON body input into a safe update payload.
 * Returns { error } when a field fails validation.
 */
export function sanitizePortfolioInput(
  raw: Record<string, unknown>,
): { data: PortfolioProjectInput } | { error: string } {
  const data: PortfolioProjectInput = {};

  if (raw.title !== undefined) {
    const title = cleanString(raw.title);
    if (!title) return { error: 'Title is required.' };
    data.title = title;
  }

  if (raw.category !== undefined) {
    const category = cleanString(raw.category);
    if (!CATEGORY_SET.has(category)) {
      return { error: `Category must be one of: ${PORTFOLIO_CATEGORIES.join(', ')}.` };
    }
    data.category = category as PortfolioCategory;
  }

  if (raw.category_label !== undefined) {
    data.category_label = cleanNullableString(raw.category_label);
  }

  if (raw.tagline !== undefined) data.tagline = cleanString(raw.tagline);
  if (raw.description !== undefined) data.description = cleanString(raw.description);
  if (raw.outcome !== undefined) data.outcome = cleanString(raw.outcome);

  if (raw.architecture !== undefined) data.architecture = cleanStringArray(raw.architecture);
  if (raw.stack !== undefined) data.stack = cleanStringArray(raw.stack);

  if (raw.github_url !== undefined) data.github_url = cleanNullableString(raw.github_url);
  if (raw.live_url !== undefined) data.live_url = cleanNullableString(raw.live_url);
  if (raw.accent !== undefined) data.accent = cleanString(raw.accent) || 'var(--sand-light)';

  if (raw.status !== undefined) {
    const status = cleanString(raw.status);
    if (!STATUS_SET.has(status)) {
      return { error: 'Status must be "done" or "in-progress".' };
    }
    data.status = status as PortfolioStatus;
  }

  if (raw.published !== undefined) data.published = Boolean(raw.published);
  if (raw.featured !== undefined) data.featured = Boolean(raw.featured);

  if (raw.sort_order !== undefined) {
    const order = Number(raw.sort_order);
    if (!Number.isFinite(order)) return { error: 'sort_order must be a number.' };
    data.sort_order = Math.max(0, Math.floor(order));
  }

  if (raw.images !== undefined) data.images = cleanStringArray(raw.images);

  return { data };
}

export async function createPortfolioProject(
  input: PortfolioProjectInput,
): Promise<{ id: string } | { error: string }> {
  const title = input.title?.trim();
  if (!title) return { error: 'Title is required.' };

  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabaseAdmin
    .from('portfolio_projects')
    .insert({
      title,
      category: input.category ?? 'web-development',
      category_label: input.category_label ?? null,
      tagline: input.tagline ?? '',
      description: input.description ?? '',
      outcome: input.outcome ?? '',
      architecture: input.architecture ?? [],
      stack: input.stack ?? [],
      github_url: input.github_url ?? null,
      live_url: input.live_url ?? null,
      accent: input.accent ?? 'var(--sand-light)',
      status: input.status ?? 'done',
      published: input.published ?? false,
      featured: input.featured ?? false,
      sort_order: input.sort_order ?? 0,
      images: input.images ?? [],
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}

export async function updatePortfolioProject(
  id: string,
  input: PortfolioProjectInput,
): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  // Capture the previously stored images so we can clean up any managed
  // storage objects that are no longer referenced after the update.
  const { data: existing } = await supabaseAdmin
    .from('portfolio_projects')
    .select('images')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabaseAdmin
    .from('portfolio_projects')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };

  if (input.images !== undefined) {
    const previous = Array.isArray(existing?.images)
      ? (existing.images as string[])
      : [];
    await deleteOrphanedImages(previous, input.images);
  }

  return { ok: true };
}

export async function deletePortfolioProject(
  id: string,
): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  const { data: existing } = await supabaseAdmin
    .from('portfolio_projects')
    .select('images')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabaseAdmin
    .from('portfolio_projects')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  if (Array.isArray(existing?.images)) {
    await deleteAllManagedImages(existing.images as string[]);
  }

  return { ok: true };
}

export async function setPortfolioProjectPublished(
  id: string,
  published: boolean,
): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  const { error } = await supabaseAdmin
    .from('portfolio_projects')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  return { ok: true };
}

export async function setPortfolioProjectFeatured(
  id: string,
  featured: boolean,
): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  const { error } = await supabaseAdmin
    .from('portfolio_projects')
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  return { ok: true };
}

export async function reorderPortfolioProjects(
  orderedIds: string[],
): Promise<{ ok: true } | { error: string }> {
  if (!supabaseAdmin) {
    return { error: 'Supabase is not configured.' };
  }

  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index + 1,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from('portfolio_projects')
    .upsert(updates);

  if (error) return { error: error.message };
  return { ok: true };
}

/**
 * Shape consumed by the public portfolio Projects component.
 * Mirrors the fields the component renders.
 */
export type PortfolioProject = {
  id: string;
  category: string;
  projectCategory: PortfolioCategory;
  title: string;
  tagline: string;
  description: string;
  outcome: string;
  architecture: string[];
  stack: string[];
  link: string;
  accent: string;
  live?: string;
  status: PortfolioStatus;
  images: string[] | 'empty';
};

/**
 * Full row shape used by the admin panel (includes management fields).
 */
export type PortfolioProjectRow = {
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

function toPublicProject(row: PortfolioProjectRow): PortfolioProject {
  return {
    id: row.id,
    category: row.category_label ?? row.category,
    projectCategory: row.category,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    outcome: row.outcome,
    architecture: row.architecture ?? [],
    stack: row.stack ?? [],
    link: row.github_url ?? '',
    accent: row.accent,
    live: row.live_url ?? undefined,
    status: row.status,
    images: row.images && row.images.length > 0 ? row.images : 'empty',
  };
}

/**
 * Fetch published portfolio projects for the public site, ordered by
 * sort_order then creation time. Returns [] when Supabase is not
 * configured or the query fails (callers fall back to static data).
 */
export async function fetchPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.error('Failed to fetch published portfolio projects:', error?.message);
      return [];
    }

    return (data as PortfolioProjectRow[]).map(toPublicProject);
  } catch (error) {
    console.error('Error in fetchPublishedPortfolioProjects:', error);
    return [];
  }
}

/**
 * Fetch all portfolio projects (published + drafts) for the admin panel.
 */
export async function fetchAdminPortfolioProjects(): Promise<PortfolioProjectRow[]> {
  if (!supabaseAdmin) {
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('portfolio_projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.error('Failed to fetch admin portfolio projects:', error?.message);
      return [];
    }

    return data as PortfolioProjectRow[];
  } catch (error) {
    console.error('Error in fetchAdminPortfolioProjects:', error);
    return [];
  }
}
