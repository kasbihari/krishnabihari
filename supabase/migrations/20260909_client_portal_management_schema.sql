-- Client-portal management schema.
--
-- Ensures the tables/columns the admin management layer and the client
-- portal expect actually exist. All statements are idempotent and
-- non-destructive: existing data is preserved.

-- ── clients ───────────────────────────────────────────────────
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  client_code text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── projects ──────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  project_code text not null unique default '',
  name text not null,
  description text not null default '',
  type text not null default 'Project',
  category text not null default 'web-development',
  status text not null default 'Active',
  phase text not null default 'Planning',
  progress integer not null default 0,
  expected_launch text,
  live_demo_url text,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Backfill a project_code for any existing rows that lack one.
update projects
set project_code = 'PROJ-' || upper(substr(replace(id::text, '-', ''), 1, 8))
where project_code is null or trim(project_code) = '';

-- ── project_timeline ──────────────────────────────────────────
create table if not exists project_timeline (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'upcoming'
    check (status in ('completed', 'active', 'upcoming')),
  timeline_date text,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── project_hours ─────────────────────────────────────────────
create table if not exists project_hours (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  hours_allocated integer not null default 0,
  hours_used integer not null default 0,
  updated_at timestamptz default now(),
  unique (project_id)
);

-- ── project_updates ───────────────────────────────────────────
create table if not exists project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  update_type text not null default 'progress',
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── project_milestones ────────────────────────────────────────
create table if not exists project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'upcoming'
    check (status in ('completed', 'active', 'upcoming')),
  milestone_date text,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── project_progress_history ──────────────────────────────────
create table if not exists project_progress_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  progress integer not null default 0,
  phase text,
  note text,
  recorded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ── indexes ───────────────────────────────────────────────────
create index if not exists projects_client_id_idx on projects (client_id);
create index if not exists project_timeline_project_idx on project_timeline (project_id, sort_order);
create index if not exists project_milestones_project_idx on project_milestones (project_id, sort_order);
create index if not exists project_updates_project_idx on project_updates (project_id, created_at desc);
create index if not exists project_progress_history_project_idx on project_progress_history (project_id, recorded_at);
