import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  cleanNumber,
  cleanNullableString,
  cleanString,
  jsonResponse,
  parseJsonBody,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../../lib/server/admin-guard';
import { createMilestone } from '../../../../../lib/server/client-admin';

export const prerender = false;

const VALID_STATUS = new Set(['completed', 'active', 'upcoming']);

export const POST: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const project_id = params.id;
  if (!project_id) return badRequestResponse('Missing project id.');

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const title = cleanString(body.title);
  if (!title) return badRequestResponse('Milestone title is required.');

  const status = cleanString(body.status) || 'upcoming';
  if (!VALID_STATUS.has(status)) {
    return badRequestResponse('Status must be completed, active, or upcoming.');
  }

  const result = await createMilestone({
    project_id,
    title,
    description: cleanString(body.description),
    status: status as 'completed' | 'active' | 'upcoming',
    milestone_date: cleanNullableString(body.milestone_date) ?? undefined,
    sort_order: cleanNumber(body.sort_order),
  });
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ id: result.id }, 201);
};
