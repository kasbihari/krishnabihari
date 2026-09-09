import type { APIRoute } from 'astro';

import {
supabaseAdmin,
} from '../../../lib/server/supabase-admin';

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

const normalized = rawCode
  .trim()
  .toUpperCase();

if (!normalized) {
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

const {
  data: projectData,
  error: projectError,
} = await supabaseAdmin
  .from('projects')
  .select('id, project_code')
  .eq('project_code', normalized)
  .maybeSingle();

if (projectError || !projectData) {
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
  typeof projectData.project_code === 'string'
    ? projectData.project_code
        .trim()
        .toUpperCase()
    : normalized;

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