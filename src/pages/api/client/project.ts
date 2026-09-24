import type { APIRoute } from 'astro';

import {
  getClientPortalSession,
} from '../../../lib/server/session';

import {
  supabaseAdmin,
} from '../../../lib/server/supabase-admin';

type ProjectRow = {
id: string;
client_id: string;
project_code: string;
name: string;
description: string | null;
type: string | null;
category: string | null;
status: string | null;
phase: string | null;
progress: number | null;
expected_launch: string | null;
live_demo_url: string | null;
images: unknown;
created_at?: string;
updated_at?: string;
};

type TimelineRow = {
id: string;
project_id: string;
title: string;
description: string | null;
status:
| 'completed'
| 'active'
| 'upcoming';
timeline_date: string | null;
sort_order: number;
created_at?: string;
updated_at?: string;
};

type HoursRow = {
id: string;
project_id: string;
hours_allocated: number | null;
hours_used: number | null;
updated_at?: string;
};

type ProjectUpdateRow = {
id: string;
project_id: string;
title: string;
description: string | null;
update_type: string | null;
published: boolean | null;
created_at: string | null;
updated_at: string | null;
};

type ProjectMilestoneRow = {
id: string;
project_id: string;
title: string;
description: string | null;
status:
| 'completed'
| 'active'
| 'upcoming';
milestone_date: string | null;
sort_order: number;
created_at: string | null;
updated_at: string | null;
};

type ProjectProgressHistoryRow = {
id: string;
project_id: string;
progress: number;
phase: string | null;
note: string | null;
recorded_at: string;
created_at: string | null;
};

function json(
body: unknown,
status = 200,
): Response {
return new Response(
JSON.stringify(body),
{
status,
headers: {
'Content-Type': 'application/json',
'Cache-Control': 'no-store',
},
},
);
}

function normalizeImages(
value: unknown,
): string[] {
if (!Array.isArray(value)) {
return [];
}

return value.filter(
(image): image is string =>
typeof image === 'string' &&
image.trim().length > 0,
);
}

function normalizeUpdateType(
value: string | null,
): string {
if (
typeof value !== 'string' ||
value.trim().length === 0
) {
return 'progress';
}

return value.trim();
}

function normalizeProgress(
value: number | null,
): number {
return Math.min(
Math.max(
typeof value === 'number'
? value
: 0,
0,
),
100,
);
}

export const GET: APIRoute = async ({
  cookies,
  url,
}) => {
  const session =
    getClientPortalSession(cookies);

  if (!session) {
    return json(
      {
        success: false,
        message:
          'Client session is invalid or expired.',
      },
      401,
    );
  }

  if (!supabaseAdmin) {
    return json(
      {
        success: false,
        message:
          'Portal is not configured for production access.',
      },
      503,
    );
  }

  try {
    /*
     * Authorization is based entirely on the
     * signed httpOnly client session.
     *
     * The browser supplies only the project id it
     * wants to open; the project is accepted only
     * when it belongs to the authenticated client
     * (`projects.client_id = session.clientId`).
     * A project id from another client can never
     * resolve to a row here.
     */

    const projectId =
      url.searchParams.get('projectId');

    if (!projectId) {
      return json(
        {
          success: false,
          message:
            'A project id is required.',
        },
        400,
      );
    }

    const {
      data: projectData,
      error: projectError,
    } = await supabaseAdmin
      .from('projects')
      .select(
        [
          'id',
          'client_id',
          'project_code',
          'name',
          'description',
          'type',
          'category',
          'status',
          'phase',
          'progress',
          'expected_launch',
          'live_demo_url',
          'images',
          'created_at',
          'updated_at',
        ].join(', '),
      )
      .eq(
        'id',
        projectId,
      )
      .eq(
        'client_id',
        session.clientId,
      )
      .maybeSingle();

    if (
      projectError ||
      !projectData
    ) {
      console.error(
        '[project-debug] project lookup failed:',
        {
          projectId,
          clientId: session.clientId,
          error: projectError?.message,
          details: projectError?.details,
          hint: projectError?.hint,
          code: projectError?.code,
          projectData,
        },
      );

      return json(
        {
          success: false,
          message:
            'The requested project workspace could not be found.',
        },
        403,
      );
    }

const project =
  projectData as unknown as ProjectRow;

/*
 * Load all project-scoped workspace data.
 */
const [
  timelineResult,
  hoursResult,
  updatesResult,
  milestonesResult,
  progressHistoryResult,
] = await Promise.all([
  supabaseAdmin
    .from('project_timeline')
    .select(
      [
        'id',
        'project_id',
        'title',
        'description',
        'status',
        'timeline_date',
        'sort_order',
        'created_at',
        'updated_at',
      ].join(', '),
    )
    .eq(
      'project_id',
      project.id,
    )
    .order(
      'sort_order',
      {
        ascending: true,
      },
    ),

  supabaseAdmin
    .from('project_hours')
    .select(
      [
        'id',
        'project_id',
        'hours_allocated',
        'hours_used',
        'updated_at',
      ].join(', '),
    )
    .eq(
      'project_id',
      project.id,
    )
    .maybeSingle(),

  supabaseAdmin
    .from('project_updates')
    .select(
      [
        'id',
        'project_id',
        'title',
        'description',
        'update_type',
        'published',
        'created_at',
        'updated_at',
      ].join(', '),
    )
    .eq(
      'project_id',
      project.id,
    )
    .eq(
      'published',
      true,
    )
    .order(
      'created_at',
      {
        ascending: false,
      },
    ),

  supabaseAdmin
    .from('project_milestones')
    .select(
      [
        'id',
        'project_id',
        'title',
        'description',
        'status',
        'milestone_date',
        'sort_order',
        'created_at',
        'updated_at',
      ].join(', '),
    )
    .eq(
      'project_id',
      project.id,
    )
    .order(
      'sort_order',
      {
        ascending: true,
      },
    ),

  supabaseAdmin
    .from('project_progress_history')
    .select(
      [
        'id',
        'project_id',
        'progress',
        'phase',
        'note',
        'recorded_at',
        'created_at',
      ].join(', '),
    )
    .eq(
      'project_id',
      project.id,
    )
    .order(
      'recorded_at',
      {
        ascending: true,
      },
    ),
]);


if (timelineResult.error) {
  return json(
    {
      success: false,
      message:
        'Unable to load project timeline.',
    },
    500,
  );
}

if (hoursResult.error) {
  return json(
    {
      success: false,
      message:
        'Unable to load project hours.',
    },
    500,
  );
}

if (updatesResult.error) {
  return json(
    {
      success: false,
      message:
        'Unable to load project updates.',
    },
    500,
  );
}

if (milestonesResult.error) {
  return json(
    {
      success: false,
      message:
        'Unable to load project milestones.',
    },
    500,
  );
}

if (
  progressHistoryResult.error
) {
  return json(
    {
      success: false,
      message:
        'Unable to load project progress history.',
    },
    500,
  );
}

const timeline =
  (timelineResult.data ??
    []) as unknown as TimelineRow[];

const hours =
  hoursResult.data as unknown as
    | HoursRow
    | null;

const updates =
  (updatesResult.data ??
    []) as unknown as ProjectUpdateRow[];

const milestones =
  (milestonesResult.data ??
    []) as unknown as ProjectMilestoneRow[];

const progressHistory =
  (progressHistoryResult.data ??
    []) as unknown as ProjectProgressHistoryRow[];

const progress =
  normalizeProgress(
    project.progress,
  );

return json({
  success: true,

  project: {
    id: project.id,

    /*
     * Kept in the response for compatibility
     * with the existing client contract.
     */
    client_id:
      project.client_id,

    project_code:
      project.project_code
        .trim()
        .toUpperCase(),

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
        ? project.category.trim()
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

    progress,

    expected_launch:
      typeof project.expected_launch ===
        'string'
        ? project.expected_launch.trim()
        : '',

    live_demo_url:
      typeof project.live_demo_url ===
        'string' &&
      project.live_demo_url.trim().length > 0
        ? project.live_demo_url.trim()
        : null,

    images:
      normalizeImages(
        project.images,
      ),

    created_at:
      project.created_at,

    updated_at:
      project.updated_at,
  },

  timeline: timeline
    .filter(
      (item) =>
        typeof item.title ===
          'string' &&
        item.title.trim()
          .length > 0,
    )
    .map((item) => ({
      id: item.id,
      project_id:
        item.project_id,
      title:
        item.title.trim(),
      description:
        item.description
          ?.trim() ?? '',
      status:
        item.status,
      date:
        item.timeline_date ??
        '',
      order:
        item.sort_order,
      created_at:
        item.created_at,
      updated_at:
        item.updated_at,
    })),

  hours: {
    id:
      hours?.id ??
      `hours-${project.id}`,

    project_id:
      project.id,

    hours_allocated:
      Math.max(
        hours?.hours_allocated ??
          0,
        0,
      ),

    hours_used:
      Math.max(
        hours?.hours_used ??
          0,
        0,
      ),

    updated_at:
      hours?.updated_at,
  },

  updates: updates
    .filter(
      (item) =>
        item.published !== false &&
        typeof item.title ===
          'string' &&
        item.title.trim()
          .length > 0,
    )
    .map((item) => ({
      id: item.id,
      project_id:
        item.project_id,
      title:
        item.title.trim(),
      description:
        item.description
          ?.trim() ?? '',
      update_type:
        normalizeUpdateType(
          item.update_type,
        ),
      published: true,
      created_at:
        item.created_at,
      updated_at:
        item.updated_at,
    })),

  milestones: milestones
    .filter(
      (item) =>
        typeof item.title ===
          'string' &&
        item.title.trim()
          .length > 0,
    )
    .map((item) => ({
      id: item.id,
      project_id:
        item.project_id,
      title:
        item.title.trim(),
      description:
        item.description
          ?.trim() ?? '',
      status:
        item.status,
      date:
        item.milestone_date ??
        '',
      order:
        item.sort_order,
      created_at:
        item.created_at,
      updated_at:
        item.updated_at,
    })),

  progressHistory:
    progressHistory
      .filter(
        (item) =>
          Number.isFinite(
            item.progress,
          ) &&
          typeof item.recorded_at ===
            'string' &&
          item.recorded_at.trim()
            .length > 0,
      )
      .map((item) => ({
        id: item.id,
        project_id:
          item.project_id,
        progress:
          Math.min(
            Math.max(
              item.progress,
              0,
            ),
            100,
          ),
        phase:
          item.phase?.trim() ||
          'Project',
        note:
          item.note?.trim() ||
          '',
        recorded_at:
          item.recorded_at,
        created_at:
          item.created_at,
      })),
});
} catch (error) {
console.error(
'[project-debug] unexpected error:',
error,
);

return json(
  {
    success: false,
    message:
      'Unable to load the project workspace.',
  },
  500,
);
}
};

export const POST: APIRoute = () =>
json(
{
error: 'Method not allowed.',
},
405,
);

export const PUT: APIRoute = () =>
json(
{
error: 'Method not allowed.',
},
405,
);

export const DELETE: APIRoute = () =>
json(
{
error: 'Method not allowed.',
},
405,
);