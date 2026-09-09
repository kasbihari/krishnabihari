import crypto from 'node:crypto';

import type { AstroCookies } from 'astro';

/* =========================================================
   PROJECT PORTAL SESSION
   ========================================================= */

export type ProjectPortalSession = {
  projectId: string;
  projectCode: string;
  expiresAt: number;
};

const PROJECT_SESSION_COOKIE_NAME =
  'project_portal_session';

const PROJECT_SESSION_TTL_MS =
  1000 * 60 * 60 * 8;

function getProjectSessionSecret(): string {
  const devFallback =
    'local-dev-project-session-secret';

  const configuredSecret =
    import.meta.env.CLIENT_SESSION_SECRET;

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

function serializeProjectSession(
  session: ProjectPortalSession,
): string {
  return JSON.stringify({
    projectId: session.projectId,
    projectCode: session.projectCode,
    expiresAt: session.expiresAt,
  });
}

export function createProjectPortalSession(
  projectId: string,
  projectCode: string,
): ProjectPortalSession {
  return {
    projectId,
    projectCode: projectCode.trim().toUpperCase(),
    expiresAt:
      Date.now() + PROJECT_SESSION_TTL_MS,
  };
}

export function signProjectSessionPayload(
  session: ProjectPortalSession,
): string {
  const payload =
    serializeProjectSession(session);

  const signature = crypto
    .createHmac(
      'sha256',
      getProjectSessionSecret(),
    )
    .update(payload)
    .digest('hex');

  return `${Buffer.from(
    payload,
    'utf8',
  ).toString('base64url')}.${signature}`;
}

export function verifyProjectSessionPayload(
  rawValue: string,
): ProjectPortalSession | null {
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
        getProjectSessionSecret(),
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
      ) as ProjectPortalSession;

    if (
      !parsed.projectId ||
      !parsed.projectCode ||
      !parsed.expiresAt
    ) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return {
      projectId: parsed.projectId,
      projectCode: parsed.projectCode
        .trim()
        .toUpperCase(),
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export function setProjectPortalSessionCookie(
  cookies: AstroCookies,
  session: ProjectPortalSession,
): void {
  cookies.set(
    PROJECT_SESSION_COOKIE_NAME,
    signProjectSessionPayload(session),
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

export function clearProjectPortalSessionCookie(
  cookies: AstroCookies,
): void {
  cookies.delete(
    PROJECT_SESSION_COOKIE_NAME,
    {
      path: '/',
    },
  );
}

export function getProjectPortalSession(
  cookies: AstroCookies,
): ProjectPortalSession | null {
  const raw = cookies.get(
    PROJECT_SESSION_COOKIE_NAME,
  )?.value;

  if (!raw) {
    return null;
  }

  return verifyProjectSessionPayload(raw);
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
  const configuredSecret =
    import.meta.env.ADMIN_SESSION_SECRET ??
    import.meta.env.CLIENT_SESSION_SECRET;

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