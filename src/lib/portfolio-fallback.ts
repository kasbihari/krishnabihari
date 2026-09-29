import type { Project } from '../components/portfolio/ProjectCard';

/**
 * Static fallback projects used when Supabase is not configured or the
 * published-projects query fails. Shared by the Projects section and the
 * case-study pages so both resolve the same data in every environment.
 *
 * The order is intentional: own commercial product → personal product →
 * school work → school work. It is a progression, not a ranking.
 */
export const fallbackProjects: Project[] = [
  {
    id: '01',
    category: 'AI Employee & Automation',
    categoryKey: 'ai-employee-automation',
    projectCategory: 'ai-automation',
    title: 'Heyvelai',
    context: 'Own product · 2026',
    contextKey: 'own-product',
    tagline:
      'An AI-powered automation product designed to help businesses automate customer communication and repetitive workflows.',
    description:
      'An AI-powered automation product designed to help businesses automate customer communication and repetitive workflows.',
    outcome:
      'Commercial product in active development — AI-powered automation for customer communication and business workflows.',
    architecture: [
      'AI conversation',
      'Communication channels',
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
    link: '',
    accent: 'var(--verde-ink)',
    status: 'in-progress',
    images: 'empty',
  },

  {
    id: '02',
    category: 'Personal System & Web App',
    categoryKey: 'personal-system',
    projectCategory: 'web-development',
    title: 'Project BLACKOUT',
    context: 'Personal project · 2026',
    contextKey: 'personal-project',
    tagline:
      'A personal web application built around discipline, progress, journaling and a gamified progression system.',
    description:
      'A personal web application built around discipline, progress, journaling and a gamified progression system.',
    outcome:
      'Personal project in active development — a system for making consistency visible.',
    architecture: [
      'Discipline tracking',
      'Progress system',
      'Journaling',
      'Gamified progression',
    ],
    stack: [],
    link: '',
    accent: 'var(--bronze-soft)',
    status: 'in-progress',
    images: 'empty',
  },

  {
    id: '03',
    category: 'Full-Stack Web App',
    categoryKey: 'full-stack-web',
    projectCategory: 'web-development',
    title: 'Budget Buddy',
    context: 'School project · ROC Mondriaan',
    contextKey: 'school-roc',
    tagline:
      'A full-stack application for tracking, understanding and managing personal finances.',
    description:
      'A full-stack application for tracking, understanding and managing personal finances.',
    outcome:
      'Complete full-stack application delivered for the school project.',
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
    id: '04',
    category: 'Full-Stack Data Platform',
    categoryKey: 'data-platform',
    projectCategory: 'web-development',
    title: 'SDG Dashboard',
    context: 'School project · ROC Mondriaan',
    contextKey: 'school-roc',
    tagline:
      'A data dashboard designed to make Sustainable Development Goals more accessible through data and interactive visualizations.',
    description:
      'A data dashboard designed to make Sustainable Development Goals more accessible through data and interactive visualizations.',
    outcome:
      'Complete full-stack dashboard delivered for the school project.',
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
