import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../lib/server/admin-guard';
import {
  createPortfolioProject,
  sanitizePortfolioInput,
} from '../../../lib/server/portfolio';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = requireAdminSession(cookies);
  if (!session) {
    return unauthorizedResponse();
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequestResponse('Invalid JSON body.');
  }

  const result = sanitizePortfolioInput(body);
  if ('error' in result) {
    return badRequestResponse(result.error);
  }

  if (!result.data.title) {
    return badRequestResponse('Title is required.');
  }

  const created = await createPortfolioProject(result.data);
  if ('error' in created) {
    return serverErrorResponse(created.error);
  }

  return new Response(JSON.stringify({ id: created.id }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
