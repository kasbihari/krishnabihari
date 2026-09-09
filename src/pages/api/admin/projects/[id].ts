import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  cleanNumber,
  cleanNullableString,
  cleanString,
  cleanStringArray,
  jsonResponse,
  parseJsonBody,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../lib/server/admin-guard';
import { deleteProject, updateProject } from '../../../../lib/server/client-admin';

export const prerender = false;

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const id = params.id;
  if (!id) return badRequestResponse('Missing project id.');

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const input: Record<string, unknown> = {};
  if (body.client_id !== undefined) {
    const client_id = cleanString(body.client_id);
    if (!client_id) return badRequestResponse('A client must be assigned.');
    input.client_id = client_id;
  }
  if (body.name !== undefined) {
    const name = cleanString(body.name);
    if (!name) return badRequestResponse('Project name cannot be empty.');
    input.name = name;
  }
  if (body.description !== undefined) input.description = cleanString(body.description);
  if (body.type !== undefined) input.type = cleanString(body.type);
  if (body.category !== undefined) input.category = cleanString(body.category);
  if (body.status !== undefined) input.status = cleanString(body.status);
  if (body.phase !== undefined) input.phase = cleanString(body.phase);
  if (body.progress !== undefined) input.progress = Math.min(100, Math.max(0, cleanNumber(body.progress)));
  if (body.expected_launch !== undefined) input.expected_launch = cleanNullableString(body.expected_launch);
  if (body.live_demo_url !== undefined) input.live_demo_url = cleanNullableString(body.live_demo_url);
  if (body.images !== undefined) input.images = cleanStringArray(body.images);

  const result = await updateProject(id, input);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const id = params.id;
  if (!id) return badRequestResponse('Missing project id.');

  const result = await deleteProject(id);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};
