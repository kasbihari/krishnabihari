import type { AstroCookies } from 'astro';
import { getAdminSession } from './session';

/**
 * Returns the active admin session for an API route, or null when the
 * request is not authenticated. Callers should short-circuit with a 401
 * when this returns null.
 */
export function requireAdminSession(cookies: AstroCookies) {
  return getAdminSession(cookies);
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function badRequestResponse(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function serverErrorResponse(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
