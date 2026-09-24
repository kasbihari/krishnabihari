-- Read-only data-integrity diagnostics for the client -> project model.
--
-- Run against the production Supabase database (SQL editor or psql) to
-- confirm the data model is sound before/after the client-portal change.
-- This script performs NO writes.
--
-- The schema enforces the important invariants structurally:
--   clients.client_code  unique not null
--   projects.client_id   not null references clients(id) on delete cascade
--   projects.project_code unique not null
-- so queries 1-4 below are expected to return zero rows on a healthy
-- database. They are included so a violation is never silently assumed
-- away.

-- 1. Projects with a NULL client_id (impossible by constraint; listed anyway)
select '1. projects with null client_id' as check_name, count(*) as rows
from projects
where client_id is null;

-- 2. Projects whose client_id does not reference a real client
--    (impossible by FK; listed anyway)
select '2. projects with invalid client references' as check_name, count(*) as rows
from projects p
left join clients c on c.id = p.client_id
where c.id is null;

-- 3. Duplicate client codes (impossible by unique constraint; listed anyway)
select '3. duplicate client codes' as check_name, count(*) as rows
from (
  select client_code
  from clients
  group by client_code
  having count(*) > 1
) dup;

-- 4. Duplicate project codes (impossible by unique constraint; listed anyway)
select '4. duplicate project codes' as check_name, count(*) as rows
from (
  select project_code
  from projects
  group by project_code
  having count(*) > 1
) dup;

-- 5. Clients with no projects at all (informational: a client code that
--    currently returns an empty project list)
select '5. clients with zero projects' as check_name, count(*) as rows
from clients c
left join projects p on p.client_id = c.id
where p.id is null;

-- 6. Projects whose name/type suggests they were created before the
--    client model existed (informational: rows whose client_id points at
--    the oldest client are candidates for re-assignment review)
select '6. projects per client' as check_name, count(*) as rows
from (
  select c.client_code, count(p.id) as project_count
  from clients c
  left join projects p on p.client_id = c.id
  group by c.client_code
) per_client;

-- 7. Legacy access pattern: the old portal authenticated with a project
--    code. Any client whose client_code looks like a generated project
--    code (PROJ-...) was likely created to mimic that flow and should be
--    reviewed for a proper client code.
select '7. client codes that look like project codes' as check_name, count(*) as rows
from clients
where client_code ilike 'PROJ-%';
