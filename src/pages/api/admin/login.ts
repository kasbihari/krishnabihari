import type { APIRoute } from 'astro';
import { createAdminSession, setAdminSessionCookie } from '../../../lib/server/session';
import { safeEqual, createRateLimiter, clientIp } from '../../../lib/server/security';
import { serverEnv } from '../../../lib/server/env';

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

  /*
   * Read the configured credentials at REQUEST time, not at module scope.
   *
   * `import.meta.env.ADMIN_EMAIL` is statically replaced by Vite during the
   * build, so the value is frozen into the server bundle and never re-read.
   * When these were unset at build time the check compiled down to
   * `if ("" && "") ...` and every sign-in was rejected with
   * "Invalid email or password" regardless of the credentials entered.
   * See src/lib/server/env.ts.
   */
  const configuredEmail = serverEnv('ADMIN_EMAIL').trim().toLowerCase();
  const configuredPassword = serverEnv('ADMIN_PASSWORD');

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
    } else {
      // Misconfiguration, not a bad password. Log a clear reason (never a
      // value) so the cause is obvious in the deployment logs.
      console.error(
        '[admin-login] ADMIN_EMAIL and/or ADMIN_PASSWORD are not configured for this ' +
          'deployment, so no sign-in can succeed. Set them in the hosting ' +
          'environment (they are read at runtime).',
      );
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
