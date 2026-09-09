import type { APIRoute } from 'astro';
import { createAdminSession, setAdminSessionCookie } from '../../../lib/server/session';
import { safeEqual, createRateLimiter, clientIp } from '../../../lib/server/security';

const configuredEmail = (import.meta.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const configuredPassword = import.meta.env.ADMIN_PASSWORD ?? '';

// Best-effort per-instance throttle on the login endpoint.
const loginLimiter = createRateLimiter({ windowMs: 60_000, max: 10 });

export const POST: APIRoute = async ({ request, cookies }) => {
  const ip = clientIp(request);
  if (!loginLimiter.allow(`admin-login:${ip}`)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Too many attempts. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    const devFallbackAllowed = import.meta.env.DEV && (!configuredEmail || !configuredPassword);

    let isValidAdmin = false;
    if (configuredEmail && configuredPassword) {
      isValidAdmin = safeEqual(email, configuredEmail) && safeEqual(password, configuredPassword);
    } else if (devFallbackAllowed) {
      isValidAdmin = safeEqual(email, 'admin@localhost') && safeEqual(password, 'admin');
    }

    if (!isValidAdmin) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = createAdminSession(email);
    setAdminSessionCookie(cookies, session);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Unable to sign in.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
