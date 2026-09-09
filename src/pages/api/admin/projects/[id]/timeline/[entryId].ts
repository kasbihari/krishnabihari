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
} from '../../../../../../lib/server/admin-guard';
import { deleteTimelineEntry, updateTimelineEntry } from '../../../../../../lib/server/client-admin';

export const prerender = false;

const VALID_STATUS = new Set(['completed', 'active', 'upcoming']);

export const PUT: APIRoute = async ({ request, cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const entryId = params.entryId;
  if (!entryId) return badRequestResponse('Missing timeline entry id.');

  const body = await parseJsonBody(request);
  if (!body) return badRequestResponse('Invalid JSON body.');

  const input: Record<string, unknown> = {};
  if (body.title !== undefined) {
    const title = cleanString(body.title);
    if (!title) return badRequestResponse('Timeline title cannot be empty.');
    input.title = title;
  }
  if (body.description !== undefined) input.description = cleanString(body.description);
  if (body.status !== undefined) {
    const status = cleanString(body.status);
    if (!VALID_STATUS.has(status)) {
      return badRequestResponse('Status must be completed, active, or upcoming.');
    }
    input.status = status;
  }
  if (body.timeline_date !== undefined) input.timeline_date = cleanNullableString(body.timeline_date);
  if (body.sort_order !== undefined) input.sort_order = cleanNumber(body.sort_order);

  const result = await updateTimelineEntry(entryId, input);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const session = requireAdminSession(cookies);
  if (!session) return unauthorizedResponse();

  const entryId = params.entryId;
  if (!entryId) return badRequestResponse('Missing timeline entry id.');

  const result = await deleteTimelineEntry(entryId);
  if ('error' in result) return serverErrorResponse(result.error);

  return jsonResponse({ ok: true });
};
