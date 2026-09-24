import type { APIRoute } from 'astro';

import {
  supabaseAdmin,
  reportSupabaseError,
} from '../../../lib/server/supabase-admin';

import {
  canonicalCode,
  codeLikePattern,
  codeMatches,
} from '../../../lib/server/code';

import {
  createClientPortalSession,
  setClientPortalSessionCookie,
} from '../../../lib/server/session';

import {
  createRateLimiter,
  clientIp,
} from '../../../lib/server/security';

// Best-effort per-instance throttle on the client-code login endpoint.
const loginLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 20,
});

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      error: 'Method not allowed.',
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const POST: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  const ip = clientIp(request);
  if (!loginLimiter.allow(`client-login:${ip}`)) {
    return new Response(
      JSON.stringify({
        success: false,
        message:
          'Too many attempts. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  try {
    const body = await request.json();

    const rawCode =
      typeof body?.clientCode === 'string'
        ? body.clientCode
        : '';

    const canonical =
      canonicalCode(rawCode);

    if (!canonical) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Client code is required.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (!supabaseAdmin) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Portal is not configured for production access.',
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    /*
     * Case-insensitive exact match on the client code.
     *
     * The stored code is the source of truth and may not be upper-case, so a
     * literal `.eq()` on the canonical key would miss it. `ilike` with an
     * escaped pattern matches without regard to case, and the rows it returns
     * are then re-checked for true equality — so a pattern that over-matched
     * can never be accepted as the requested client.
     *
     * The id and code are the only columns read, and the result is capped at
     * two rows, so a broad pattern cannot be used to enumerate clients.
     */
    const {
      data: clientCandidates,
      error: clientError,
    } = await supabaseAdmin
      .from('clients')
      .select('id, client_code')
      .ilike(
        'client_code',
        codeLikePattern(canonical),
      )
      .order('created_at', {
        ascending: true,
      })
      .limit(2);

    if (clientError) {
      /*
       * A failed query is not an invalid code. Reporting it as one is what
       * made this issue hard to diagnose, so the two are separated and the
       * real error is recorded server-side. The response stays generic.
       */
      reportSupabaseError(
        'client-login/client lookup',
        clientError,
      );

      return new Response(
        JSON.stringify({
          success: false,
          message:
            'Unable to validate the client code.',
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const candidates =
      clientCandidates ?? [];

    if (candidates.length > 1) {
      console.warn(
        '[client-login] more than one client shares this code; using the oldest.',
      );
    }

    const clientData =
      candidates.find((row) =>
        codeMatches(
          row.client_code,
          canonical,
        ),
      );

    if (!clientData) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'That client code is invalid.',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const clientCode =
      typeof clientData.client_code ===
      'string'
        ? canonicalCode(
            clientData.client_code,
          )
        : canonical;

    const session =
      createClientPortalSession(
        clientData.id,
        clientCode,
      );

    setClientPortalSessionCookie(
      cookies,
      session,
    );

    return new Response(
      JSON.stringify({
        success: true,
        client: {
          id: clientData.id,
          client_code: clientCode,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error(
      '[client-login] Unexpected error:',
      error,
    );

    return new Response(
      JSON.stringify({
        success: false,
        message:
          'Unable to validate the client code.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};
