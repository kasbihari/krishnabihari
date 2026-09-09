import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  cleanNumber,
  jsonResponse,
  parseJsonBody,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../../lib/server/admin-guard';
import { upsertHours } from '../../../../../lib/server/client-admin';

export const prerender = false;

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const project_id = params.id;
  if (!project_id) return badRequestResponse('Missing project id.');

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const result = await upsertHours({
    project_id,
    hours_allocated: Math.max(0, cleanNumber(body.hours_allocated)),
    hours_used: Math.max(0, cleanNumber(body.hours_used)),
  });
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};
