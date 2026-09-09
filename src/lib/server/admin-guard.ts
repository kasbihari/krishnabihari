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

export function notFoundResponse(message = 'Not found.'): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function serverErrorResponse(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Parse a JSON request body, returning null on malformed input. */
export async function parseJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      return body as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

/** Coerce an unknown value to a trimmed non-empty string, or null. */
export function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function cleanNullableString(value: unknown): string | null {
  const cleaned = cleanString(value);
  return cleaned.length > 0 ? cleaned : null;
}

export function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

export function cleanNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function cleanBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}
