-- Security hardening: Row Level Security for all tables.
--
-- The client portal authenticates via a project code exchanged for a
-- signed httpOnly cookie (server-side). The public site and admin panel
-- read/write through the service-role client, which bypasses RLS.
-- These policies therefore protect the tables from direct anon access
-- (e.g. someone hitting the Supabase REST API with the anon key).

-- ── portfolio_projects ─────────────────────────────────────────
-- Public site reads published projects through the service role, so no
-- anon policy is needed. Lock the table down entirely.
alter table portfolio_projects enable row level security;

drop policy if exists "portfolio_projects_anon_read" on portfolio_projects;
create policy "portfolio_projects_anon_read"
  on portfolio_projects for select
  to anon
  using (published = true);

-- ── clients ────────────────────────────────────────────────────
alter table clients enable row level security;

-- A client may read only their own profile row, matched by client_code.
drop policy if exists "clients_anon_select_own" on clients;
create policy "clients_anon_select_own"
  on clients for select
  to anon
  using (
    client_code = coalesce(
      current_setting('request.jwt.claims', true)::json->>'client_code',
      ''
    )
  );

-- ── projects ───────────────────────────────────────────────────
alter table projects enable row level security;

-- A client may read only projects belonging to their own client row.
drop policy if exists "projects_anon_select_own" on projects;
create policy "projects_anon_select_own"
  on projects for select
  to anon
  using (
    client_id in (
      select id from clients
      where client_code = coalesce(
        current_setting('request.jwt.claims', true)::json->>'client_code',
        ''
      )
    )
  );

-- ── project_timeline ───────────────────────────────────────────
alter table project_timeline enable row level security;

drop policy if exists "project_timeline_anon_select_own" on project_timeline;
create policy "project_timeline_anon_select_own"
  on project_timeline for select
  to anon
  using (
    project_id in (
      select p.id from projects p
      join clients c on c.id = p.client_id
      where c.client_code = coalesce(
        current_setting('request.jwt.claims', true)::json->>'client_code',
        ''
      )
    )
  );

-- ── project_hours ──────────────────────────────────────────────
alter table project_hours enable row level security;

drop policy if exists "project_hours_anon_select_own" on project_hours;
create policy "project_hours_anon_select_own"
  on project_hours for select
  to anon
  using (
    project_id in (
      select p.id from projects p
      join clients c on c.id = p.client_id
      where c.client_code = coalesce(
        current_setting('request.jwt.claims', true)::json->>'client_code',
        ''
      )
    )
  );

-- ── project_updates ────────────────────────────────────────────
alter table project_updates enable row level security;

drop policy if exists "project_updates_anon_select_own" on project_updates;
create policy "project_updates_anon_select_own"
  on project_updates for select
  to anon
  using (
    project_id in (
      select p.id from projects p
      join clients c on c.id = p.client_id
      where c.client_code = coalesce(
        current_setting('request.jwt.claims', true)::json->>'client_code',
        ''
      )
    )
  );

-- ── project_milestones ─────────────────────────────────────────
alter table project_milestones enable row level security;

drop policy if exists "project_milestones_anon_select_own" on project_milestones;
create policy "project_milestones_anon_select_own"
  on project_milestones for select
  to anon
  using (
    project_id in (
      select p.id from projects p
      join clients c on c.id = p.client_id
      where c.client_code = coalesce(
        current_setting('request.jwt.claims', true)::json->>'client_code',
        ''
      )
    )
  );

-- ── project_progress_history ───────────────────────────────────
alter table project_progress_history enable row level security;

drop policy if exists "project_progress_history_anon_select_own" on project_progress_history;
create policy "project_progress_history_anon_select_own"
  on project_progress_history for select
  to anon
  using (
    project_id in (
      select p.id from projects p
      join clients c on c.id = p.client_id
      where c.client_code = coalesce(
        current_setting('request.jwt.claims', true)::json->>'client_code',
        ''
      )
    )
  );

-- ── updated_at triggers ────────────────────────────────────────
-- Keep updated_at current on rows that carry it.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists portfolio_projects_set_updated_at on portfolio_projects;
create trigger portfolio_projects_set_updated_at
  before update on portfolio_projects
  for each row execute function set_updated_at();

drop trigger if exists clients_set_updated_at on clients;
create trigger clients_set_updated_at
  before update on clients
  for each row execute function set_updated_at();

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();
