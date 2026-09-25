import type { Project } from '../components/portfolio/ProjectCard';

/**
 * Static fallback projects used when Supabase is not configured or the
 * published-projects query fails. Shared by the Projects section and the
 * case-study pages so both resolve the same data in every environment.
 */
export const fallbackProjects: Project[] = [
  {
    id: '01',
    category: 'AI Receptionist & Automation',
    projectCategory: 'ai-automation',
    title: 'Veyro Agent',
    tagline:
      'AI-powered voice automation for inbound, outbound, and customer communication personalised at scale.',
    description:
      'Node.js and React platform for building AI-powered business receptionists and voice automations. Handles inbound and outbound calls through Twilio and ElevenLabs with configurable conversation flows, dynamic customer context, appointment scheduling, SMS actions, human handoff, call routing, and real-time monitoring. Designed as a reusable automation platform that can adapt to different businesses, workflows, and communication requirements.',
    outcome:
      'AI receptionist platform automating inbound and outbound business communication with real-time voice interaction, scheduling, customer actions, and workflow automation — active development.',
    architecture: [
      'Node.js',
      'React',
      'Twilio Voice API',
      'ElevenLabs Conversational AI',
      'WebSocket',
      'PostgreSQL',
      'Prisma ORM',
      'REST API',
    ],
    stack: [
      'Node.js',
      'React',
      'TypeScript',
      'Twilio',
      'ElevenLabs',
      'PostgreSQL',
      'Prisma',
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
