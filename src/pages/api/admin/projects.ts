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
} from '../../../lib/server/admin-guard';
import { createProject } from '../../../lib/server/client-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const client_id = cleanString(body.client_id);
  const name = cleanString(body.name);

  if (!client_id) return badRequestResponse('A client must be assigned.');
  if (!name) return badRequestResponse('Project name is required.');

  const result = await createProject({
    client_id,
    name,
    description: cleanString(body.description),
    /*
     * `type`, `status` and `phase` are enum-backed, with their labels defined
     * in the database. Leave them undefined when the caller did not supply a
     * value so `createProject` omits the column and PostgreSQL applies its
     * own default — sending a hardcoded 'Active' is what produced
     * `invalid input value for enum project_status: "Active"`.
     */
    type: cleanString(body.type) || undefined,
    category: cleanString(body.category) || 'web-development',
    status: cleanString(body.status) || undefined,
    phase: cleanString(body.phase) || undefined,
    progress: Math.min(100, Math.max(0, cleanNumber(body.progress))),
    expected_launch: cleanNullableString(body.expected_launch) ?? undefined,
    live_demo_url: cleanNullableString(body.live_demo_url) ?? undefined,
    images: cleanStringArray(body.images),
  });
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ id: result.id }, 201);
};
