import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  cleanBoolean,
  cleanString,
  jsonResponse,
  parseJsonBody,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../../lib/server/admin-guard';
import { createUpdate } from '../../../../../lib/server/client-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const project_id = params.id;
  if (!project_id) return badRequestResponse('Missing project id.');

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const title = cleanString(body.title);
  if (!title) return badRequestResponse('Update title is required.');

  const result = await createUpdate({
    project_id,
    title,
    description: cleanString(body.description),
    update_type: cleanString(body.update_type) || 'progress',
    published: body.published === undefined ? true : cleanBoolean(body.published),
  });
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ id: result.id }, 201);
};
