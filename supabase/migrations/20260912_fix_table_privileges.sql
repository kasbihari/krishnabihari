-- =============================================================
-- 20260912_fix_table_privileges.sql
--
-- Fixes: ERROR 42501  "permission denied for table projects"
--
-- ── Root cause of the error ──────────────────────────────────
-- 20260909_rls_security_hardening.sql enabled Row Level Security on the
-- application tables but never granted table-level privileges to the
-- Supabase API roles. GRANT and RLS are two independent layers:
--
--   * GRANT decides whether a role may touch the table at all.
--   * RLS decides which rows that role may see once it is allowed in.
--
-- Enabling RLS without a matching GRANT does not raise an RLS error — it
-- raises "permission denied for table <name>" (SQLSTATE 42501), which is
-- exactly what the admin panel and the client portal were hitting.
-- Critically, the service-role key bypasses RLS but does NOT bypass GRANTs,
-- so every server-side query in this application failed.
--
-- ── Scope: written against the ACTUAL production schema ──────
-- This migration references only tables that exist in production:
--
--   admin_users
--   clients
--   projects
--   project_hours
--   project_milestones
--   project_progress_history
--   project_timeline
--   project_updates
--
-- HISTORICAL NOTE (comment only — nothing here executes): an earlier
-- revision of this file also referenced a portfolio table that is defined
-- by 20260909_portfolio_projects.sql but was never applied to production.
-- That reference made this migration abort with 42P01 before it could grant
-- anything. That table is a separate, public-facing "Selected Work" table —
-- it is not part of the client-portal schema and is deliberately OUT OF
-- SCOPE here. The RLS block below skips any absent table instead of
-- aborting, so a partial schema can never break this migration again.
--
-- ── Security model ───────────────────────────────────────────
-- This application does NOT use Supabase Auth. It authenticates with its
-- own HMAC-signed httpOnly cookies (src/lib/server/session.ts) and performs
-- every read and write server-side through the service-role client
-- (src/lib/server/supabase-admin.ts).
--
-- The browser-side anon client (src/lib/client/supabase.ts) is unreferenced
-- dead code — no module imports it and nothing queries a table from the
-- browser. Therefore:
--
--   service_role   → full CRUD. Server-side only.
--   anon           → no table access whatsoever.
--   authenticated  → no table access whatsoever.
--
-- Private client-portal data (clients, projects, hours, milestones,
-- timeline, updates, progress history) is never publicly readable.
-- Public image delivery does not read these tables at all: it reads the
-- public `project-images` Storage bucket directly by URL.
--
-- ── Safety ───────────────────────────────────────────────────
-- Every statement is idempotent and non-destructive. No data is modified.
-- No table is created, renamed, copied, or dropped. Re-running is safe.
-- =============================================================


-- =============================================================
-- 1 · Schema usage and table privileges
-- =============================================================

-- Without USAGE on the schema, no table privilege is usable.
grant usage on schema public to anon, authenticated, service_role;

-- service_role is the application's own server-side identity and needs full
-- CRUD. This is the grant whose absence produced the reported error.
grant select, insert, update, delete on all tables in schema public to service_role;

-- anon / authenticated have no legitimate reads: every dataset in this app
-- is fetched server-side and scoped by the server, never by the browser.
-- Revoking removes any grant Supabase may have applied by default and
-- guarantees private client data is unreachable with the public anon key.
revoke all privileges on all tables in schema public from anon, authenticated;


-- =============================================================
-- 2 · Sequences
-- =============================================================
-- Every primary key in this schema is `uuid default gen_random_uuid()`,
-- which is a function call, not a sequence. There are therefore NO
-- sequences backing the application tables today. The grants below are
-- future-proofing only and are harmless while no sequences exist.

grant usage, select on all sequences in schema public to service_role;
revoke all privileges on all sequences in schema public from anon, authenticated;


-- =============================================================
-- 3 · Default privileges for future objects
-- =============================================================
-- Applies the same model to objects created later, so a future migration
-- cannot silently reintroduce the missing-grant bug.
--
-- Note: ALTER DEFAULT PRIVILEGES affects objects created by the role that
-- runs it. Run this migration as the same role that owns the schema
-- (the `postgres` role in the Supabase SQL Editor) for full effect.

alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;

alter default privileges in schema public
  grant usage, select on sequences to service_role;

alter default privileges in schema public
  revoke all privileges on tables from anon, authenticated;

alter default privileges in schema public
  revoke all privileges on sequences from anon, authenticated;


-- =============================================================
-- 4 · Row Level Security
-- =============================================================
-- Applied to exactly the tables that exist in production. The DO block
-- checks to_regclass() first and skips any table that is absent, so this
-- can never abort on a missing relation.

do $$
declare
  tbl text;
  app_tables constant text[] := array[
    'admin_users',
    'clients',
    'projects',
    'project_hours',
    'project_milestones',
    'project_progress_history',
    'project_timeline',
    'project_updates'
  ];
begin
  foreach tbl in array app_tables loop

    if to_regclass(format('public.%I', tbl)) is null then
      raise notice 'Skipping public.% - table does not exist.', tbl;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', tbl);

    -- service_role: unrestricted access for the server-side application.
    -- Defensive: service_role holds BYPASSRLS in Supabase, but this policy
    -- keeps access working if that attribute is ever removed.
    execute format(
      'drop policy if exists %I on public.%I',
      tbl || '_service_role_all', tbl
    );
    execute format(
      'create policy %I on public.%I for all to service_role using (true) with check (true)',
      tbl || '_service_role_all', tbl
    );

    -- anon / authenticated: explicit deny. Belt-and-braces alongside the
    -- REVOKE in section 1, so these tables stay unreadable even if a table
    -- grant is re-added by hand later.
    execute format(
      'drop policy if exists %I on public.%I',
      tbl || '_public_deny', tbl
    );
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (false)',
      tbl || '_public_deny', tbl
    );

  end loop;
end $$;


-- =============================================================
-- 5 · Storage — preserve public-read / server-write
-- =============================================================
-- Image uploads use the public-read `project-images` bucket so stored URLs
-- work directly as <img src> in the public portfolio and the client portal.
-- Writes happen only through the admin-authenticated API routes using the
-- service-role client, which needs an explicit storage.objects policy.
--
-- The service-role key is never exposed to the browser, and anon /
-- authenticated get read-only access — never write.
--
-- Wrapped so that a Storage hiccup cannot abort the table-privilege fix
-- above; any problem is surfaced as a warning instead.

do $$
begin
  insert into storage.buckets (id, name, public)
  values ('project-images', 'project-images', true)
  on conflict (id) do update set public = excluded.public;
exception when others then
  raise warning 'Could not ensure the project-images bucket: %', sqlerrm;
end $$;

do $$
begin
  execute 'drop policy if exists "project_images_public_read" on storage.objects';
  execute 'create policy "project_images_public_read" on storage.objects '
       || 'for select to anon, authenticated '
       || 'using (bucket_id = ''project-images'')';

  execute 'drop policy if exists "project_images_service_all" on storage.objects';
  execute 'create policy "project_images_service_all" on storage.objects '
       || 'for all to service_role '
       || 'using (bucket_id = ''project-images'') '
       || 'with check (bucket_id = ''project-images'')';
exception when others then
  raise warning 'Could not (re)create project-images storage policies: %', sqlerrm;
end $$;


-- =============================================================
-- 6 · Verification
-- =============================================================
-- Run this after applying. Expected result:
--   rls_enabled            = true for every row
--   service_can_*          = true for every row
--   anon_can_select        = false for every row
--   authenticated_can_select = false for every row

select
  c.relname                                             as table_name,
  c.relrowsecurity                                      as rls_enabled,
  has_table_privilege('service_role', c.oid, 'SELECT')  as service_can_select,
  has_table_privilege('service_role', c.oid, 'INSERT')  as service_can_insert,
  has_table_privilege('service_role', c.oid, 'UPDATE')  as service_can_update,
  has_table_privilege('service_role', c.oid, 'DELETE')  as service_can_delete,
  has_table_privilege('anon', c.oid, 'SELECT')          as anon_can_select,
  has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_can_select
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;
