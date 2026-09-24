import type { APIRoute } from 'astro';

import {
  getClientPortalSession,
} from '../../../lib/server/session';

import {
  supabaseAdmin,
} from '../../../lib/server/supabase-admin';

type ClientRow = {
  id: string;
  name: string;
  company: string;
  client_code: string;
};

type ProjectRow = {
  id: string;
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

export const GET: APIRoute = async ({
  cookies,
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
     * Authorization is based entirely on the signed httpOnly client session.
     *
     * The browser does not supply clientId or clientCode to this endpoint.
     * Project discovery is scoped by the session's client id: every project
     * whose `client_id` equals the authenticated client is returned.
     */
    const [
      clientResult,
      projectsResult,
    ] = await Promise.all([
      supabaseAdmin
        .from('clients')
        .select(
          'id, name, company, client_code',
        )
        .eq('id', session.clientId)
        .maybeSingle(),

      supabaseAdmin
        .from('projects')
        .select(
          [
            'id',
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
        .eq('client_id', session.clientId)
        .order('created_at', {
          ascending: true,
        }),
    ]);

    if (clientResult.error) {
      console.error(
        '[client-projects] client lookup failed:',
        {
          clientId: session.clientId,
          error: clientResult.error.message,
          details: clientResult.error.details,
          hint: clientResult.error.hint,
          code: clientResult.error.code,
        },
      );

      return json(
        {
          success: false,
          message:
            'The client workspace could not be found.',
        },
        403,
      );
    }

    if (projectsResult.error) {
      console.error(
        '[client-projects] project lookup failed:',
        {
          clientId: session.clientId,
          error: projectsResult.error.message,
          details: projectsResult.error.details,
          hint: projectsResult.error.hint,
          code: projectsResult.error.code,
        },
      );

      return json(
        {
          success: false,
          message:
            'Unable to load your projects.',
        },
        500,
      );
    }

    const client =
      clientResult.data as unknown as
        | ClientRow
        | null;

    if (!client) {
      return json(
        {
          success: false,
          message:
            'The client workspace could not be found.',
        },
        403,
      );
    }

    const projects =
      (projectsResult.data ??
        []) as unknown as ProjectRow[];

    return json({
      success: true,

      client: {
        id: client.id,
        name:
          typeof client.name ===
            'string' &&
          client.name.trim().length > 0
            ? client.name.trim()
            : 'Client',
        company:
          typeof client.company ===
            'string'
            ? client.company.trim()
            : '',
        client_code:
          client.client_code
            .trim()
            .toUpperCase(),
      },

      projects: projects.map(
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
          images:
            normalizeImages(
              project.images,
            ),
          created_at:
            project.created_at,
          updated_at:
            project.updated_at,
        }),
      ),
    });
  } catch (error) {
    console.error(
      '[client-projects] unexpected error:',
      error,
    );

    return json(
      {
        success: false,
        message:
          'Unable to load your projects.',
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
