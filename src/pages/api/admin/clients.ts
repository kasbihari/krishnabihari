import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  cleanString,
  jsonResponse,
  parseJsonBody,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../lib/server/admin-guard';
import { createClient } from '../../../lib/server/client-admin';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const name = cleanString(body.name);
  const company = cleanString(body.company);
  const client_code = cleanString(body.client_code);

  if (!name) return badRequestResponse('Client name is required.');
  if (!company) return badRequestResponse('Company is required.');
  if (!client_code) return badRequestResponse('Client code is required.');

  const result = await createClient({ name, company, client_code });
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ id: result.id }, 201);
};
