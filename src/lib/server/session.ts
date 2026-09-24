import crypto from 'node:crypto';

import type { AstroCookies } from 'astro';

import { serverEnv } from './env';

/* =========================================================
   CLIENT PORTAL SESSION
   ========================================================= */

export type ClientPortalSession = {
  clientId: string;
  clientCode: string;
  expiresAt: number;
};

const CLIENT_SESSION_COOKIE_NAME =
  'client_portal_session';

const CLIENT_SESSION_TTL_MS =
  1000 * 60 * 60 * 8;

function getClientSessionSecret(): string {
  const devFallback =
    'local-dev-client-session-secret';

  // Read at runtime — import.meta.env would freeze the build-time value
  // into the bundle. See src/lib/server/env.ts.
  const configuredSecret =
    serverEnv('CLIENT_SESSION_SECRET');

  if (
    configuredSecret &&
    configuredSecret.length >= 32
  ) {
    return configuredSecret;
  }

  if (import.meta.env.DEV) {
    return devFallback;
  }

  throw new Error(
    'CLIENT_SESSION_SECRET must be at least 32 characters in production.',
  );
}

function serializeClientSession(
  session: ClientPortalSession,
): string {
  return JSON.stringify({
    clientId: session.clientId,
    clientCode: session.clientCode,
    expiresAt: session.expiresAt,
  });
}

export function createClientPortalSession(
  clientId: string,
  clientCode: string,
): ClientPortalSession {
  return {
    clientId,
    clientCode: clientCode.trim().toUpperCase(),
    expiresAt:
      Date.now() + CLIENT_SESSION_TTL_MS,
  };
}

export function signClientSessionPayload(
  session: ClientPortalSession,
): string {
  const payload =
    serializeClientSession(session);

  const signature = crypto
    .createHmac(
      'sha256',
      getClientSessionSecret(),
    )
    .update(payload)
    .digest('hex');

  return `${Buffer.from(
    payload,
    'utf8',
  ).toString('base64url')}.${signature}`;
}

export function verifyClientSessionPayload(
  rawValue: string,
): ClientPortalSession | null {
  if (!rawValue.includes('.')) {
    return null;
  }

  const [payloadB64, signature] =
    rawValue.split('.');

  if (!payloadB64 || !signature) {
    return null;
  }

  if (signature.length !== 64) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(
      payloadB64,
      'base64url',
    ).toString('utf8');

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        getClientSessionSecret(),
      )
      .update(payloadJson)
      .digest('hex');

    const receivedSignatureBuffer =
      Buffer.from(signature, 'utf8');

    const expectedSignatureBuffer =
      Buffer.from(expectedSignature, 'utf8');

    if (
      receivedSignatureBuffer.length !==
      expectedSignatureBuffer.length
    ) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        receivedSignatureBuffer,
        expectedSignatureBuffer,
      )
    ) {
      return null;
    }

    const parsed =
      JSON.parse(
        payloadJson,
      ) as ClientPortalSession;

    if (
      !parsed.clientId ||
      !parsed.clientCode ||
      !parsed.expiresAt
    ) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return {
      clientId: parsed.clientId,
      clientCode: parsed.clientCode
        .trim()
        .toUpperCase(),
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function setClientPortalSessionCookie(
  cookies: AstroCookies,
  session: ClientPortalSession,
): void {
  cookies.set(
    CLIENT_SESSION_COOKIE_NAME,
    signClientSessionPayload(session),
    {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD,
      maxAge: Math.max(
        1,
        Math.floor(
          (session.expiresAt - Date.now()) /
            1000,
        ),
      ),
    },
  );
}

export function clearClientPortalSessionCookie(
  cookies: AstroCookies,
): void {
  cookies.delete(
    CLIENT_SESSION_COOKIE_NAME,
    {
      path: '/',
    },
  );
}

export function getClientPortalSession(
  cookies: AstroCookies,
): ClientPortalSession | null {
  const raw = cookies.get(
    CLIENT_SESSION_COOKIE_NAME,
  )?.value;

  if (!raw) {
    return null;
  }

  return verifyClientSessionPayload(raw);
}

/* =========================================================
   ADMIN SESSION
   ========================================================= */

export type AdminSession = {
  email: string;
  role: 'admin';
  expiresAt: number;
};

const ADMIN_SESSION_COOKIE_NAME =
  'admin_workspace_session';

const ADMIN_SESSION_TTL_MS =
  1000 * 60 * 60 * 8;

function getAdminSessionSecret(): string {
  // Read at runtime — import.meta.env would freeze the build-time value
  // into the bundle. See src/lib/server/env.ts.
  const configuredSecret =
    serverEnv('ADMIN_SESSION_SECRET') ||
    serverEnv('CLIENT_SESSION_SECRET');

  if (
    configuredSecret &&
    configuredSecret.length >= 32
  ) {
    return configuredSecret;
  }

  if (import.meta.env.DEV) {
    return 'local-dev-admin-session-secret';
  }

  throw new Error(
    'ADMIN_SESSION_SECRET must be at least 32 characters in production.',
  );
}

function serializeAdminSession(
  session: AdminSession,
): string {
  return JSON.stringify({
    email: session.email,
    role: session.role,
    expiresAt: session.expiresAt,
  });
}

export function createAdminSession(
  email: string,
): AdminSession {
  return {
    email: email.trim().toLowerCase(),
    role: 'admin',
    expiresAt:
      Date.now() + ADMIN_SESSION_TTL_MS,
  };
}

export function signAdminSessionPayload(
  session: AdminSession,
): string {
  const payload =
    serializeAdminSession(session);

  const signature = crypto
    .createHmac(
      'sha256',
      getAdminSessionSecret(),
    )
    .update(payload)
    .digest('hex');

  return `${Buffer.from(
    payload,
    'utf8',
  ).toString('base64url')}.${signature}`;
}

export function verifyAdminSessionPayload(
  rawValue: string,
): AdminSession | null {
  if (!rawValue.includes('.')) {
    return null;
  }

  const [payloadB64, signature] =
    rawValue.split('.');

  if (!payloadB64 || !signature) {
    return null;
  }

  if (signature.length !== 64) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(
      payloadB64,
      'base64url',
    ).toString('utf8');

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        getAdminSessionSecret(),
      )
      .update(payloadJson)
      .digest('hex');

    const receivedSignatureBuffer =
      Buffer.from(signature, 'utf8');

    const expectedSignatureBuffer =
      Buffer.from(expectedSignature, 'utf8');

    if (
      receivedSignatureBuffer.length !==
      expectedSignatureBuffer.length
    ) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        receivedSignatureBuffer,
        expectedSignatureBuffer,
      )
    ) {
      return null;
    }

    const parsed =
      JSON.parse(
        payloadJson,
      ) as AdminSession;

    if (
      !parsed.email ||
      parsed.role !== 'admin' ||
      !parsed.expiresAt
    ) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return {
      email: parsed.email.trim().toLowerCase(),
      role: 'admin',
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(
  cookies: AstroCookies,
  session: AdminSession,
): void {
  cookies.set(
    ADMIN_SESSION_COOKIE_NAME,
    signAdminSessionPayload(session),
    {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD,
      maxAge: Math.max(
        1,
        Math.floor(
          (session.expiresAt - Date.now()) /
            1000,
        ),
      ),
    },
  );
}

export function clearAdminSessionCookie(
  cookies: AstroCookies,
): void {
  cookies.delete(
    ADMIN_SESSION_COOKIE_NAME,
    {
      path: '/',
    },
  );
}

export function getAdminSession(
  cookies: AstroCookies,
): AdminSession | null {
  const raw = cookies.get(
    ADMIN_SESSION_COOKIE_NAME,
  )?.value;

  if (!raw) {
    return null;
  }

  return verifyAdminSessionPayload(raw);
}