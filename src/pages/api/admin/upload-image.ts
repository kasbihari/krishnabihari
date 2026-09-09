import type { APIRoute } from 'astro';
import {
  badRequestResponse,
  jsonResponse,
  requireAdminSession,
  unauthorizedResponse,
} from '../../../lib/server/admin-guard';
import { uploadImage, type ImageScope } from '../../../lib/server/storage';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequestResponse('Expected multipart form data.');
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return badRequestResponse('A file is required.');
  }

  const scope = form.get('scope');
  if (scope !== 'portfolio' && scope !== 'client') {
    return badRequestResponse('A valid scope is required.');
  }

  const entityId = typeof form.get('entityId') === 'string' ? (form.get('entityId') as string).trim() : '';
  if (!entityId) {
    return badRequestResponse('A project id is required.');
  }

  const result = await uploadImage(scope as ImageScope, entityId, file);
  if ('error' in result) {
    return badRequestResponse(result.error);
  }

  return jsonResponse({ url: result.url }, 201);
};
