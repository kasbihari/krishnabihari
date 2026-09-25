import type { Project } from '../components/portfolio/ProjectCard';

/**
 * Static fallback projects used when Supabase is not configured or the
 * published-projects query fails. Shared by the Projects section and the
 * case-study pages so both resolve the same data in every environment.
 */
export const fallbackProjects: Project[] = [
  {
    id: '01',
    category: 'AI Employee & Automation',
    projectCategory: 'ai-automation',
    title: 'Veyxo',
    tagline:
      'AI employee platform that handles customer communication and business workflows across voice and digital channels.',
    description:
      'Veyxo is an AI employee platform that acts as a 24/7 fixed contact point for businesses. It handles customer communication — calls, SMS, appointments and routine questions — and connects to business workflows such as CRM updates, calendar management, notifications and follow-ups, with human handoff when needed. Built as a reusable platform that adapts to each business.',
    outcome:
      'Production-oriented AI employee platform handling customer communication and business workflows — active development.',
    architecture: [
      'AI conversation',
      'Voice & messaging channels',
      'Business integrations',
      'Workflow automation',
      'Human handoff',
    ],
    stack: [
      'TypeScript',
      'Node.js',
      'AI',
      'Voice AI',
      'APIs',
      'Databases',
      'Automation',
    ],
    link: 'https://github.com/kasbihari/Veyro-Agent',
    accent: 'var(--verde-ink)',
    status: 'in-progress',
    images: 'empty',
  },

  {
    id: '02',
    category: 'Full-Stack Web App',
    projectCategory: 'web-development',
    title: 'Budget Buddy',
    tagline:
      'Personal finance manager with a premium dashboard, smart categorisation, and a full reporting engine.',
    description:
      'End-to-end finance platform built with Symfony 6 and Chart.js. Handles transaction management, budget categorisation, role-based user and admin access, and rich data visualisation all delivered through a clean, premium interface. Designed with real users in mind: fast, secure, and intuitive.',
    outcome:
      'Full production deployment with secure authentication, real-time reporting, and granular admin controls.',
    architecture: [
      'Symfony 6',
      'Twig',
      'Doctrine ORM',
      'Chart.js',
      'MySQL',
      'REST API',
      'Role-based access control',
    ],
    stack: [
      'Symfony',
      'PHP',
      'Twig',
      'Chart.js',
      'MySQL',
      'Doctrine ORM',
    ],
    link: 'https://github.com/kasbihari/Budget-Buddy',
    accent: 'var(--bronze-soft)',
    status: 'done',
    images: 'empty',
  },

  {
    id: '03',
    category: 'Full-Stack Data Platform',
    projectCategory: 'web-development',
    title: 'SDG Dashboard',
    tagline:
      'Real-time UN Sustainable Development Goals tracker with live KPI visualisation.',
    description:
      'Comprehensive data platform built with Next.js 14 and TypeScript. Tracks live SDG KPIs through interactive charts, includes full user authentication, and supports CSV data export all backed by MySQL with Prisma ORM. Built to demonstrate how API-keys can make complex data accessible and actionable.',
    outcome:
      'Complete full-stack system: authentication, live KPI tracking, and a full data export pipeline.',
    architecture: [
      'Next.js 14',
      'TypeScript',
      'Prisma ORM',
      'MySQL',
      'NextAuth',
      'Recharts',
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'Prisma',
      'MySQL',
      'NextAuth',
    ],
    link: 'https://github.com/kasbihari/SDG-Dashboard',
    accent: 'var(--bronze-soft)',
    status: 'done',
    images: 'empty',
  },
];
