import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../lib/server/admin-guard';
import { reorderPortfolioProjects } from '../../../../lib/server/portfolio';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = requireAdminSession(cookies);
  if (!session) {
    return unauthorizedResponse();
  }

  let body: { ids?: unknown };
  try {
    body = await request.json();
  } catch {
    return badRequestResponse('Invalid JSON body.');
  }

  if (!Array.isArray(body.ids) || body.ids.some((id) => typeof id !== 'string')) {
    return badRequestResponse('Expected an array of project ids.');
  }

  const result = await reorderPortfolioProjects(body.ids as string[]);
  if ('error' in result) {
    return serverErrorResponse(result.error);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
