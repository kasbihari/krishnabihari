import type { APIRoute } from 'astro';

import {
supabaseAdmin,
reportSupabaseError,
} from '../../../lib/server/supabase-admin';

import {
canonicalProjectCode,
projectCodeLikePattern,
projectCodeMatches,
} from '../../../lib/server/project-code';

import {
createProjectPortalSession,
setProjectPortalSessionCookie,
} from '../../../lib/server/session';

import {
createRateLimiter,
clientIp,
} from '../../../lib/server/security';

// Best-effort per-instance throttle on the project-code login endpoint.
const loginLimiter = createRateLimiter({
windowMs: 60_000,
max: 20,
});

export const GET: APIRoute = () => {
return new Response(
JSON.stringify({
error: 'Method not allowed.',
}),
{
status: 405,
headers: {
'Content-Type': 'application/json',
},
},
);
};

export const POST: APIRoute = async ({
request,
cookies,
}): Promise<Response> => {
const ip = clientIp(request);
if (!loginLimiter.allow(`client-login:${ip}`)) {
  return new Response(
    JSON.stringify({
      success: false,
      message:
        'Too many attempts. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

try {
const body = await request.json();


const rawCode =
  typeof body?.projectCode === 'string'
    ? body.projectCode
    : '';

const canonical =
  canonicalProjectCode(rawCode);

if (!canonical) {
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Project code is required.',
    }),
    {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

if (!supabaseAdmin) {
  return new Response(
    JSON.stringify({
      success: false,
      message:
        'Portal is not configured for production access.',
    }),
    {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

/*
 * Case-insensitive exact match.
 *
 * The stored code is the source of truth and may not be upper-case, so a
 * literal `.eq()` on the canonical key would miss it. `ilike` with an
 * escaped pattern matches without regard to case, and the rows it returns
 * are then re-checked for true equality — so a pattern that over-matched
 * can never be accepted as the requested project.
 *
 * The id and code are the only columns read, and the result is capped at
 * two rows, so a broad pattern cannot be used to enumerate projects.
 */
const {
  data: projectCandidates,
  error: projectError,
} = await supabaseAdmin
  .from('projects')
  .select('id, project_code')
  .ilike(
    'project_code',
    projectCodeLikePattern(canonical),
  )
  .order('created_at', {
    ascending: true,
  })
  .limit(2);

if (projectError) {
  /*
   * A failed query is not an invalid code. Reporting it as one is what made
   * this issue hard to diagnose, so the two are separated and the real error
   * is recorded server-side. The response stays generic.
   */
  reportSupabaseError(
    'client-login/project lookup',
    projectError,
  );

  return new Response(
    JSON.stringify({
      success: false,
      message:
        'Unable to validate the project code.',
    }),
    {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

const candidates =
  projectCandidates ?? [];

if (candidates.length > 1) {
  console.warn(
    '[client-login] more than one project shares this code; using the oldest.',
  );
}

const projectData =
  candidates.find((row) =>
    projectCodeMatches(
      row.project_code,
      canonical,
    ),
  );

if (!projectData) {
  return new Response(
    JSON.stringify({
      success: false,
      message: 'That project code is invalid.',
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

const projectCode =
  typeof projectData.project_code ===
  'string'
    ? canonicalProjectCode(
        projectData.project_code,
      )
    : canonical;

const session =
  createProjectPortalSession(
    projectData.id,
    projectCode,
  );

setProjectPortalSessionCookie(
  cookies,
  session,
);

return new Response(
  JSON.stringify({
    success: true,
    project: {
      id: projectData.id,
      project_code: projectCode,
    },
  }),
  {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  },
);


} catch (error) {
console.error(
'[client-login] Unexpected error:',
error,
);


return new Response(
  JSON.stringify({
    success: false,
    message:
      'Unable to validate the project code.',
  }),
  {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  },
);


}
};