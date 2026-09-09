# Supabase setup for the client portal

This project is prepared for a Supabase-backed client portal and portfolio. The frontend expects these environment variables:

```bash
PUBLIC_SUPABASE_URL=your-project-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> The service-role key is used **server-side only** (admin panel + client-portal
> API routes). Never expose it to the browser. See `.env.example` for the full
> list of variables, including the admin session secrets and login credentials.

## 0. Apply migrations

Run the SQL files in `supabase/migrations/` in order in the Supabase SQL editor:

1. `20260823_phase1_project_category.sql` — adds the `category` column to the client-portal `projects` table.
2. `20260909_portfolio_projects.sql` — creates the `portfolio_projects` table (the public "Selected Work" section) and seeds the two existing projects.
3. `20260909_rls_security_hardening.sql` — enables Row Level Security on every table and adds `updated_at` triggers.

The sections below describe the schema and demo data for reference.

## 1. Create a Supabase project

1. Go to https://supabase.com and create a new project.
2. Copy the project URL and anon key from the dashboard.
3. Add them to a local `.env` file in the project root.

## 2. Create the database schema

Run this in the Supabase SQL editor:

```sql
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  client_code text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  description text not null,
  type text not null,
  status text not null,
  phase text not null,
  progress integer not null default 0,
  expected_launch text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists project_timeline (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text not null,
  status text not null check (status in ('completed', 'active', 'upcoming')),
  date text not null,
  "order" integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists project_hours (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  hours_allocated integer not null default 0,
  hours_used integer not null default 0,
  updated_at timestamptz default now()
);
```

## 3. Enable Row Level Security

```sql
alter table clients enable row level security;
alter table projects enable row level security;
alter table project_timeline enable row level security;
alter table project_hours enable row level security;
```

Add policies so each client can only access their own project data. Example:

```sql
create policy "Clients can read their own profile"
on clients for select
using (true);

create policy "Clients can read own project"
on projects for select
using (
  client_id in (
    select id from clients where client_code = current_setting('request.jwt.claims', true)::json->>'client_code'
  )
);
```

For a production-ready setup, use an authenticated session model and verify the client code through a secure server-side endpoint or auth table instead of trusting the client alone.

## 4. Add demo seed data

```sql
insert into clients (name, company, client_code)
values ('Mila', 'WrapMotion', 'DEMO-2026')
on conflict (client_code) do nothing;

with demo_client as (
  select id from clients where client_code = 'DEMO-2026'
)
insert into projects (client_id, name, description, type, status, phase, progress, expected_launch)
select id, 'Website Redesign', 'A strategic redesign focused on premium positioning, stronger conversion flow, and a clearer product narrative across the full client journey.', 'Website Development', 'In Development', 'Development', 68, 'September 2026'
from demo_client
on conflict do nothing;

with demo_project as (
  select id from projects where name = 'Website Redesign'
)
insert into project_timeline (project_id, title, description, status, date, "order")
select id, 'Discovery', 'Research, positioning, and requirements alignment.', 'completed', 'Mar 2026', 1 from demo_project
union all
select id, 'Design', 'Wireframes, visual direction, and UX refinement.', 'completed', 'Apr 2026', 2 from demo_project
union all
select id, 'Development', 'Build and integration of the upcoming client experience.', 'active', 'Current phase', 3 from demo_project
union all
select id, 'Testing', 'QA, performance checks, and final polish.', 'upcoming', 'Jul 2026', 4 from demo_project
union all
select id, 'Launch', 'Deployment, final review, and handoff.', 'upcoming', 'Sep 2026', 5 from demo_project;

with demo_project as (
  select id from projects where name = 'Website Redesign'
)
insert into project_hours (project_id, hours_allocated, hours_used)
select id, 32, 21 from demo_project
on conflict do nothing;
```

## 5. Run the app

```bash
npm install
npm run dev
```

Then open:

- http://localhost:4321/
- http://localhost:4321/client
- http://localhost:4321/client/dashboard
