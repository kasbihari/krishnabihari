import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../../lib/server/admin-guard';
import {
  setPortfolioProjectFeatured,
  setPortfolioProjectPublished,
} from '../../../../../lib/server/portfolio';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) {
    return unauthorizedResponse();
  }

  const id = params.id;
  if (!id) {
    return badRequestResponse('Missing project id.');
  }

  let body: { published?: boolean; featured?: boolean };
  try {
    body = await request.json();
  } catch {
    return badRequestResponse('Invalid JSON body.');
  }

  if (typeof body.published === 'boolean') {
    const result = await setPortfolioProjectPublished(id, body.published);
    if ('error' in result) return serverErrorResponse(result.error);
  }

  if (typeof body.featured === 'boolean') {
    const result = await setPortfolioProjectFeatured(id, body.featured);
    if ('error' in result) return serverErrorResponse(result.error);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
