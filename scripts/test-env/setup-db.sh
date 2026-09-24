#!/usr/bin/env bash
# Local end-to-end test environment for the Client Portal.
#
# Starts a throwaway PostgreSQL instance, applies the real schema migrations,
# and prints connection details for the PostgREST shim.
#
# Usage: bash scripts/test-env/setup-db.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PGDATA="${PGDATA:-/tmp/kb-portal-test-pgdata}"
PGPORT="${PGPORT:-54329}"
PGSOCKET="${PGSOCKET:-/tmp/kb-portal-test-socket}"

mkdir -p "$PGSOCKET"

if [ ! -d "$PGDATA" ]; then
  initdb -D "$PGDATA" -U postgres --auth=trust >/dev/null 2>&1
fi

if ! pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
  pg_ctl -D "$PGDATA" -o "-p $PGPORT -k $PGSOCKET -c listen_addresses=127.0.0.1" -l "$PGDATA/server.log" start >/dev/null 2>&1
fi

export PGHOST="$PGSOCKET"
export PGPORT="$PGPORT"
export PGUSER=postgres

psql -v ON_ERROR_STOP=1 -c "select 1" >/dev/null 2>&1 || {
  echo "postgres did not come up" >&2
  exit 1
}

psql -v ON_ERROR_STOP=1 <<'SQL' >/dev/null
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin;
  end if;
end
$$;

create schema if not exists storage;

create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null references storage.buckets(id),
  name text not null,
  owner uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_accessed_at timestamptz,
  metadata jsonb
);
SQL

for migration in \
  "$ROOT/supabase/migrations/20260909_client_portal_management_schema.sql" \
  "$ROOT/supabase/migrations/20260823_phase1_project_category.sql" \
  "$ROOT/supabase/migrations/20260909_portfolio_projects.sql" \
  "$ROOT/supabase/migrations/20260909_rls_security_hardening.sql" \
  "$ROOT/supabase/migrations/20260909_storage_bucket.sql" \
  "$ROOT/supabase/migrations/20260912_fix_table_privileges.sql"; do
  psql -v ON_ERROR_STOP=1 -f "$migration" >/dev/null
done

echo "db-ready"
echo "PGHOST=$PGSOCKET"
echo "PGPORT=$PGPORT"
echo "PGUSER=postgres"
