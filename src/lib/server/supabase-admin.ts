import { createClient } from '@supabase/supabase-js';
import { serverEnv } from './env';

// Read at runtime — import.meta.env would freeze the build-time values into
// the server bundle, so a variable configured only on the deployment would
// never be seen. See src/lib/server/env.ts.
const supabaseUrl = serverEnv('PUBLIC_SUPABASE_URL');
const serviceRoleKey = serverEnv('SUPABASE_SERVICE_ROLE_KEY');

export const hasSupabaseAdminConfig = Boolean(
  supabaseUrl && serviceRoleKey,
);

export const supabaseAdmin = hasSupabaseAdminConfig
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * PostgreSQL error code for "permission denied for table <name>".
 *
 * This is a GRANT-level failure, not an RLS failure: the role is not
 * allowed to touch the table at all. It is distinct from an RLS rejection
 * (42501 is privilege, 42P01 is missing table, and an RLS violation on a
 * write surfaces as 42501 only for the policy check).
 */
const INSUFFICIENT_PRIVILEGE = '42501';

export type SupabaseErrorLike = {
  message?: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
} | null;

/**
 * True when a Supabase/PostgREST error is a table-privilege failure.
 *
 * The service-role key bypasses RLS but does NOT bypass GRANTs, so a
 * missing `grant ... to service_role` makes every server-side query fail
 * with "permission denied for table <name>". Detecting it lets callers
 * report an actionable message instead of silently returning empty data.
 */
export function isPermissionDeniedError(error: SupabaseErrorLike): boolean {
  if (!error) return false;
  if (error.code === INSUFFICIENT_PRIVILEGE) return true;
  const message = (error.message ?? '').toLowerCase();
  return message.includes('permission denied');
}

/**
 * Log a Supabase error with an actionable hint when it is a privilege
 * failure. Returns true when the error was a permission problem.
 */
export function reportSupabaseError(
  context: string,
  error: SupabaseErrorLike,
): boolean {
  if (!error) return false;

  if (isPermissionDeniedError(error)) {
    console.error(
      `[supabase] ${context}: permission denied. The database role is missing ` +
        `table privileges. Apply supabase/migrations/20260912_fix_table_privileges.sql ` +
        `(it grants SELECT/INSERT/UPDATE/DELETE to service_role and SELECT to anon).`,
      { message: error.message, code: error.code, hint: error.hint },
    );
    return true;
  }

  console.error(`[supabase] ${context}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
  return false;
}