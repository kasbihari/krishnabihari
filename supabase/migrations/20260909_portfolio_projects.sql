-- Portfolio projects: the public "Selected Work" section.
-- Managed from the /admin/portfolio panel. Distinct from the
-- client-portal `projects` table (which tracks active client work).

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'web-development'
    check (category in ('web-development', 'web-redesign', 'saas', 'ai-tool', 'ai-automation')),
  category_label text,
  tagline text not null default '',
  description text not null default '',
  outcome text not null default '',
  architecture text[] not null default '{}',
  stack text[] not null default '{}',
  github_url text,
  live_url text,
  accent text not null default 'var(--sand-light)',
  status text not null default 'done'
    check (status in ('done', 'in-progress')),
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_projects_published_sort_idx
  on portfolio_projects (published, sort_order);

-- Seed the two existing public projects so nothing is lost when the
-- portfolio switches to database-backed rendering.
insert into portfolio_projects
  (title, category, category_label, tagline, description, outcome,
   architecture, stack, github_url, accent, status, published, featured, sort_order)
values
  (
    'Budget Buddy',
    'web-development',
    'Full-Stack Web App',
    'Personal finance manager with a premium dashboard, smart categorisation, and a full reporting engine.',
    'End-to-end finance platform built with Symfony 6 and Chart.js. Handles transaction management, budget categorisation, role-based user and admin access, and rich data visualisation all delivered through a clean, premium interface. Designed with real users in mind: fast, secure, and intuitive.',
    'Full production deployment with secure authentication, real-time reporting, and granular admin controls.',
    array['Symfony 6','Twig','Doctrine ORM','Chart.js','MySQL','REST API','Role-based access control'],
    array['Symfony','PHP','Twig','Chart.js','MySQL','Doctrine ORM'],
    'https://github.com/kasbihari/Budget-Buddy',
    'var(--sand-light)',
    'done',
    true,
    true,
    1
  ),
  (
    'SDG Dashboard',
    'web-development',
    'Full-Stack Data Platform',
    'Real-time UN Sustainable Development Goals tracker with live KPI visualisation.',
    'Comprehensive data platform built with Next.js 14 and TypeScript. Tracks live SDG KPIs through interactive charts, includes full user authentication, and supports CSV data export all backed by MySQL with Prisma ORM. Built to demonstrate how API-keys can make complex data accessible and actionable.',
    'Complete full-stack system: authentication, live KPI tracking, and a full data export pipeline.',
    array['Next.js 14','TypeScript','Prisma ORM','MySQL','NextAuth','Recharts'],
    array['Next.js','TypeScript','Prisma','MySQL','NextAuth'],
    'https://github.com/kasbihari/SDG-Dashboard',
    'var(--forest-bright)',
    'done',
    true,
    false,
    2
  )
on conflict do nothing;
