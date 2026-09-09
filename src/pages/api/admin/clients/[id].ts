import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  cleanString,
  jsonResponse,
  parseJsonBody,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../../lib/server/admin-guard';
import { deleteClient, updateClient } from '../../../../lib/server/client-admin';

export const prerender = false;

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const id = params.id;
  if (!id) return badRequestResponse('Missing client id.');

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const input: { name?: string; company?: string; client_code?: string } = {};
  if (body.name !== undefined) {
    const name = cleanString(body.name);
    if (!name) return badRequestResponse('Client name cannot be empty.');
    input.name = name;
  }
  if (body.company !== undefined) {
    const company = cleanString(body.company);
    if (!company) return badRequestResponse('Company cannot be empty.');
    input.company = company;
  }
  if (body.client_code !== undefined) {
    const code = cleanString(body.client_code);
    if (!code) return badRequestResponse('Client code cannot be empty.');
    input.client_code = code;
  }

  const result = await updateClient(id, input);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const id = params.id;
  if (!id) return badRequestResponse('Missing client id.');

  const result = await deleteClient(id);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};
