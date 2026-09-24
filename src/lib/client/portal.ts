import type {
  ClientPortalData,
  ClientProjectsData,
  ProjectMilestoneRecord,
  ProjectProgressHistoryRecord,
  ProjectRecord,
  ProjectUpdateRecord,
  TimelineRecord,
} from './types';

import {
  normalizeProjectCategory,
} from './types';

const fallbackProject: ProjectRecord = {
  id: 'demo-project-id',
  client_id: 'demo-client-id',
  project_code: 'PROJECT-2026-X7K9',
  name: 'Website Redesign',
  description:
    'A sanitized project demonstration showing progress, milestones, and delivery status.',
  type: 'Web Application',
  category: 'web-development',
  status: 'In Development',
  phase: 'Development',
  progress: 68,
  expected_launch: '',
  images: [],
  live_demo_url: null,
};

const fallbackPortalData: ClientPortalData = {
  project: fallbackProject,

  timeline: [
    {
      id: 'tl-1',
      project_id: 'demo-project-id',
      title: 'Discovery',
      description:
        'Project discovery, requirements and initial direction.',
      status: 'completed',
      date: '',
      order: 1,
    },
    {
      id: 'tl-2',
      project_id: 'demo-project-id',
      title: 'Design',
      description:
        'Visual direction, layout and interface design.',
      status: 'completed',
      date: '',
      order: 2,
    },
    {
      id: 'tl-3',
      project_id: 'demo-project-id',
      title: 'Development',
      description:
        'Implementation of the application and interactive experience.',
      status: 'active',
      date: '',
      order: 3,
    },
    {
      id: 'tl-4',
      project_id: 'demo-project-id',
      title: 'Testing',
      description:
        'Final testing, refinement and responsive QA.',
      status: 'upcoming',
      date: '',
      order: 4,
    },
    {
      id: 'tl-5',
      project_id: 'demo-project-id',
      title: 'Launch',
      description:
        'Production deployment and final delivery.',
      status: 'upcoming',
      date: '',
      order: 5,
    },
  ],

  hours: {
    id: 'hours-1',
    project_id: 'demo-project-id',
    hours_allocated: 0,
    hours_used: 0,
  },

  updates: [
    {
      id: 'update-1',
      project_id: 'demo-project-id',
      title: 'Development is underway',
      description:
        'The core project structure and initial implementation are now in place.',
      update_type: 'progress',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],

  milestones: [
    {
      id: 'milestone-1',
      project_id: 'demo-project-id',
      title: 'Project discovery completed',
      description:
        'Requirements, scope and initial project direction have been confirmed.',
      status: 'completed',
      date: '',
      order: 1,
    },
    {
      id: 'milestone-2',
      project_id: 'demo-project-id',
      title: 'Core development underway',
      description:
        'The main application structure and core functionality are currently being implemented.',
      status: 'active',
      date: '',
      order: 2,
    },
    {
      id: 'milestone-3',
      project_id: 'demo-project-id',
      title: 'Production launch',
      description:
        'Final QA, deployment and production handover.',
      status: 'upcoming',
      date: '',
      order: 3,
    },
  ],

  progressHistory: [
    {
      id: 'progress-1',
      project_id: 'demo-project-id',
      progress: 12,
      phase: 'Discovery',
      note: 'Project direction established.',
      recorded_at: '2026-06-04T00:00:00.000Z',
    },
    {
      id: 'progress-2',
      project_id: 'demo-project-id',
      progress: 28,
      phase: 'Design',
      note: 'Visual direction and core layouts completed.',
      recorded_at: '2026-06-14T00:00:00.000Z',
    },
    {
      id: 'progress-3',
      project_id: 'demo-project-id',
      progress: 46,
      phase: 'Development',
      note: 'Core implementation underway.',
      recorded_at: '2026-07-02T00:00:00.000Z',
    },
    {
      id: 'progress-4',
      project_id: 'demo-project-id',
      progress: 61,
      phase: 'Development',
      note: 'Primary project functionality connected.',
      recorded_at: '2026-07-28T00:00:00.000Z',
    },
    {
      id: 'progress-5',
      project_id: 'demo-project-id',
      progress: 68,
      phase: 'Development',
      note: 'Current project progress.',
      recorded_at: '2026-08-27T00:00:00.000Z',
    },
  ],
};

function getFallbackPortalData(): ClientPortalData | null {
  const demoEnabled =
    import.meta.env.DEV &&
    import.meta.env.PUBLIC_ENABLE_DEMO_PORTAL !== 'false';

  return demoEnabled ? fallbackPortalData : null;
}

function normalizeProject(
  project: ProjectRecord,
): ProjectRecord {
  return {
    ...project,

    name:
      typeof project.name === 'string' &&
      project.name.trim().length > 0
        ? project.name.trim()
        : 'Project',

    description:
      typeof project.description === 'string'
        ? project.description.trim()
        : '',

    type:
      typeof project.type === 'string' &&
      project.type.trim().length > 0
        ? project.type.trim()
        : 'Project',

    status:
      typeof project.status === 'string' &&
      project.status.trim().length > 0
        ? project.status.trim()
        : 'Active',

    phase:
      typeof project.phase === 'string' &&
      project.phase.trim().length > 0
        ? project.phase.trim()
        : 'Planning',

    progress: Math.min(
      Math.max(
        typeof project.progress === 'number'
          ? project.progress
          : 0,
        0,
      ),
      100,
    ),

    expected_launch:
      typeof project.expected_launch === 'string'
        ? project.expected_launch.trim()
        : '',

    images: Array.isArray(project.images)
      ? project.images.filter(
          (image): image is string =>
            typeof image === 'string' &&
            image.trim().length > 0,
        )
      : [],

    live_demo_url:
      typeof project.live_demo_url === 'string' &&
      project.live_demo_url.trim().length > 0
        ? project.live_demo_url.trim()
        : null,

    project_code:
      typeof project.project_code === 'string'
        ? project.project_code.trim().toUpperCase()
        : '',
  };
}

function mapTimeline(
  timelineData: Array<{
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    status: TimelineRecord['status'];
    timeline_date: string | null;
    sort_order: number;
  }>,
): TimelineRecord[] {
  return timelineData.map((item) => ({
    id: item.id,
    project_id: item.project_id,
    title: item.title.trim(),
    description: item.description?.trim() ?? '',
    status: item.status,
    date: item.timeline_date ?? '',
    order: item.sort_order,
  }));
}

function mapUpdates(
  updateData: Array<{
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    update_type: string | null;
    published: boolean | null;
    created_at: string | null;
    updated_at: string | null;
  }>,
): ProjectUpdateRecord[] {
  return updateData
    .filter(
      (item) =>
        item.published !== false &&
        typeof item.title === 'string' &&
        item.title.trim().length > 0,
    )
    .map((item) => ({
      id: item.id,
      project_id: item.project_id,
      title: item.title.trim(),
      description: item.description?.trim() ?? '',
      update_type:
        item.update_type?.trim() || 'progress',
      published: true,
      created_at: item.created_at ?? undefined,
      updated_at: item.updated_at ?? undefined,
    }));
}

function mapMilestones(
  milestoneData: Array<{
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    status: ProjectMilestoneRecord['status'];
    milestone_date: string | null;
    sort_order: number;
    created_at: string | null;
    updated_at: string | null;
  }>,
): ProjectMilestoneRecord[] {
  return milestoneData
    .filter(
      (item) =>
        typeof item.title === 'string' &&
        item.title.trim().length > 0,
    )
    .map((item) => ({
      id: item.id,
      project_id: item.project_id,
      title: item.title.trim(),
      description:
        item.description?.trim() ?? '',
      status: item.status,
      date: item.milestone_date ?? '',
      order: item.sort_order,
      created_at:
        item.created_at ?? undefined,
      updated_at:
        item.updated_at ?? undefined,
    }));
}

function mapProgressHistory(
  progressData: Array<{
    id: string;
    project_id: string;
    progress: number;
    phase: string | null;
    note: string | null;
    recorded_at: string;
    created_at: string | null;
  }>,
): ProjectProgressHistoryRecord[] {
  return [...progressData]
    .sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() -
        new Date(b.recorded_at).getTime(),
    )
    .filter(
      (item) =>
        Number.isFinite(item.progress),
    )
    .map((item) => ({
      id: item.id,
      project_id: item.project_id,
      progress: Math.min(
        Math.max(item.progress, 0),
        100,
      ),
      phase: item.phase?.trim() || 'Project',
      note: item.note?.trim() ?? '',
      recorded_at: item.recorded_at,
      created_at:
        item.created_at ?? undefined,
    }));
}

function normalizePortalData(
  data: ClientPortalData,
): ClientPortalData {
  return {
    project: normalizeProject(data.project),

    timeline: mapTimeline(
      data.timeline.map((item) => ({
        id: item.id,
        project_id: item.project_id,
        title: item.title,
        description: item.description,
        status: item.status,
        timeline_date: item.date,
        sort_order: item.order,
      })),
    ),

    hours: {
      id: data.hours.id,
      project_id: data.hours.project_id,
      hours_allocated:
        typeof data.hours.hours_allocated === 'number'
          ? Math.max(
              data.hours.hours_allocated,
              0,
            )
          : 0,
      hours_used:
        typeof data.hours.hours_used === 'number'
          ? Math.max(
              data.hours.hours_used,
              0,
            )
          : 0,
      updated_at: data.hours.updated_at,
    },

    updates: Array.isArray(data.updates)
      ? mapUpdates(
          data.updates.map((update) => ({
            id: update.id,
            project_id: update.project_id,
            title: update.title,
            description: update.description,
            update_type: update.update_type,
            published: update.published,
            created_at:
              update.created_at ?? null,
            updated_at:
              update.updated_at ?? null,
          })),
        )
      : [],

    milestones: Array.isArray(
      data.milestones,
    )
      ? mapMilestones(
          data.milestones.map(
            (milestone) => ({
              id: milestone.id,
              project_id:
                milestone.project_id,
              title: milestone.title,
              description:
                milestone.description,
              status: milestone.status,
              milestone_date:
                milestone.date || null,
              sort_order:
                milestone.order,
              created_at:
                milestone.created_at ??
                null,
              updated_at:
                milestone.updated_at ??
                null,
            }),
          ),
        )
      : [],

    progressHistory: Array.isArray(
      data.progressHistory,
    )
      ? mapProgressHistory(
          data.progressHistory.map(
            (item) => ({
              id: item.id,
              project_id:
                item.project_id,
              progress:
                item.progress,
              phase: item.phase,
              note: item.note,
              recorded_at:
                item.recorded_at,
              created_at:
                item.created_at ??
                null,
            }),
          ),
        )
      : [],
  };
}

export async function fetchPortalDataByProjectId(
  projectId: string,
): Promise<ClientPortalData | null> {
  try {
    const response = await fetch(
      `/api/client/project?projectId=${encodeURIComponent(projectId)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return null;
      }

      throw new Error(
        `Project workspace request failed with status ${response.status}.`,
      );
    }

    const data =
      (await response.json()) as Partial<ClientPortalData>;

    if (
      !data?.project ||
      !Array.isArray(data.timeline) ||
      !data.hours
    ) {
      throw new Error(
        'Invalid project workspace response.',
      );
    }

    return normalizePortalData({
      ...(data as ClientPortalData),
      updates: Array.isArray(data.updates)
        ? data.updates
        : [],
      milestones: Array.isArray(
        data.milestones,
      )
        ? data.milestones
        : [],
      progressHistory: Array.isArray(
        data.progressHistory,
      )
        ? data.progressHistory
        : [],
    });
  } catch {
    return getFallbackPortalData();
  }
}

export async function fetchClientProjects(): Promise<ClientProjectsData | null> {
  try {
    const response = await fetch(
      '/api/client/projects',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return null;
      }

      throw new Error(
        `Client projects request failed with status ${response.status}.`,
      );
    }

    const data =
      (await response.json()) as Partial<ClientProjectsData>;

    if (
      !data?.client ||
      !Array.isArray(data.projects)
    ) {
      throw new Error(
        'Invalid client projects response.',
      );
    }

    return {
      client: {
        id: data.client.id,
        name:
          typeof data.client.name ===
            'string' &&
          data.client.name.trim().length > 0
            ? data.client.name.trim()
            : 'Client',
        company:
          typeof data.client.company ===
            'string'
            ? data.client.company.trim()
            : '',
        client_code:
          typeof data.client.client_code ===
            'string'
            ? data.client.client_code
                .trim()
                .toUpperCase()
            : '',
      },
      projects: data.projects.map(
        (project) => ({
          id: project.id,
          project_code:
            typeof project.project_code ===
              'string'
              ? project.project_code
                  .trim()
                  .toUpperCase()
              : '',
          name:
            typeof project.name ===
              'string' &&
            project.name.trim().length > 0
              ? project.name.trim()
              : 'Project',
          description:
            typeof project.description ===
              'string'
              ? project.description.trim()
              : '',
          type:
            typeof project.type ===
              'string' &&
            project.type.trim().length > 0
              ? project.type.trim()
              : 'Project',
          category:
            typeof project.category ===
              'string' &&
            project.category.trim().length > 0
              ? normalizeProjectCategory(
                  project.category,
                )
              : 'web-development',
          status:
            typeof project.status ===
              'string' &&
            project.status.trim().length > 0
              ? project.status.trim()
              : 'Active',
          phase:
            typeof project.phase ===
              'string' &&
            project.phase.trim().length > 0
              ? project.phase.trim()
              : 'Planning',
          progress: Math.min(
            Math.max(
              typeof project.progress ===
                'number'
                ? project.progress
                : 0,
              0,
            ),
            100,
          ),
          expected_launch:
            typeof project.expected_launch ===
              'string'
              ? project.expected_launch.trim()
              : '',
          live_demo_url:
            typeof project.live_demo_url ===
              'string' &&
            project.live_demo_url.trim()
              .length > 0
              ? project.live_demo_url.trim()
              : null,
          images: Array.isArray(
            project.images,
          )
            ? project.images.filter(
                (
                  image,
                ): image is string =>
                  typeof image ===
                    'string' &&
                  image.trim().length > 0,
              )
            : [],
          created_at:
            project.created_at,
          updated_at:
            project.updated_at,
        }),
      ),
    };
  } catch {
    return null;
  }
}

export function getFallbackPortalDataSafe(): ClientPortalData | null {
  return getFallbackPortalData();
}