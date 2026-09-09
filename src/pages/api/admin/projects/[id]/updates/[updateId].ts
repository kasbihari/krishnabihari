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
} from '../../../../../../lib/server/admin-guard';
import { deleteUpdate, updateUpdate } from '../../../../../../lib/server/client-admin';

export const prerender = false;

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const updateId = params.updateId;
  if (!updateId) return badRequestResponse('Missing update id.');

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const input: Record<string, unknown> = {};
  if (body.title !== undefined) {
    const title = cleanString(body.title);
    if (!title) return badRequestResponse('Update title cannot be empty.');
    input.title = title;
  }
  if (body.description !== undefined) input.description = cleanString(body.description);
  if (body.update_type !== undefined) input.update_type = cleanString(body.update_type);
  if (body.published !== undefined) input.published = cleanBoolean(body.published);

  const result = await updateUpdate(updateId, input);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const updateId = params.updateId;
  if (!updateId) return badRequestResponse('Missing update id.');

  const result = await deleteUpdate(updateId);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};
