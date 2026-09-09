import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  jsonResponse,
  requireAdminSession,
  serverErrorResponse,
  unauthorizedResponse,
} from '../../../lib/server/admin-guard';
import { deleteImageByUrl } from '../../../lib/server/storage';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequestResponse('Invalid JSON body.');
  }

  const url = typeof (body as { url?: unknown })?.url === 'string' ? (body as { url: string }).url.trim() : '';
  if (!url) {
    return badRequestResponse('An image url is required.');
  }

  const result = await deleteImageByUrl(url);
  if ('error' in result) {
    return serverErrorResponse(result.error);
  }

  return jsonResponse({ ok: true });
};
