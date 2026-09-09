import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../lib/server/admin-guard';
import {
  deletePortfolioProject,
  sanitizePortfolioInput,
  updatePortfolioProject,
} from '../../../../lib/server/portfolio';

export const prerender = false;

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) {
    return unauthorizedResponse();
  }

  const id = params.id;
  if (!id) {
    return badRequestResponse('Missing project id.');
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

  const updated = await updatePortfolioProject(id, result.data);
  if ('error' in updated) {
    return serverErrorResponse(updated.error);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) {
    return unauthorizedResponse();
  }

  const id = params.id;
  if (!id) {
    return badRequestResponse('Missing project id.');
  }

  const deleted = await deletePortfolioProject(id);
  if ('error' in deleted) {
    return serverErrorResponse(deleted.error);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
