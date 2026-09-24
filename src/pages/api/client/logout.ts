import type { APIRoute } from 'astro';

import {
  clearClientPortalSessionCookie,
} from '../../../lib/server/session';

export const GET: APIRoute = () =>
  new Response(
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

export const POST: APIRoute = async ({
  cookies,
}) => {
  clearClientPortalSessionCookie(cookies);

  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};