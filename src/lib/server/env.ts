/**
 * Runtime access to server-side environment variables.
 *
 * ── Why this exists ──────────────────────────────────────────
 * Astro/Vite statically replace `import.meta.env.SOME_VAR` at BUILD time:
 * the value is read once while bundling and the literal is baked into the
 * server bundle. It is never consulted again at runtime.
 *
 * On a serverless platform such as Vercel that is a trap. A variable which
 * happens to be unset during the build is frozen into the bundle as
 * `undefined`, and the deployed function will keep seeing that frozen value
 * even after the variable is configured for the deployment. Rotating a
 * secret likewise has no effect until the project is rebuilt.
 *
 * That is exactly what broke admin login: `import.meta.env.ADMIN_EMAIL`
 * was compiled to `("")` and `import.meta.env.ADMIN_PASSWORD` to `""`, so
 * the credential check could never match and every sign-in attempt was
 * rejected with "Invalid email or password".
 *
 * `process.env` is populated by the platform at runtime, so it always
 * reflects the variables actually configured for the running deployment.
 *
 * ── Precedence ───────────────────────────────────────────────
 *   1. `process.env`         — runtime value (authoritative in production)
 *   2. `import.meta.env`     — development fallback so `.env` keeps working
 *
 * The development fallback uses a dynamic key on purpose: Vite can only
 * statically replace a literal `import.meta.env.FOO`, so a dynamic lookup
 * survives bundling and still resolves in dev.
 */

function readFromProcessEnv(name: string): string {
  const value = process.env?.[name];
  return typeof value === 'string' && value.length > 0 ? value : '';
}

function readFromImportMetaEnv(name: string): string {
  const env = (import.meta as { env?: Record<string, unknown> }).env;
  const value = env?.[name];
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/**
 * Read a server-side environment variable at runtime.
 *
 * Returns an empty string when the variable is not configured, so callers
 * can treat "missing" and "empty" identically.
 */
export function serverEnv(name: string): string {
  return readFromProcessEnv(name) || readFromImportMetaEnv(name);
}

/**
 * Names of the environment variables a given list is missing.
 * Used for diagnostics — never returns or logs values.
 */
export function missingServerEnv(names: readonly string[]): string[] {
  return names.filter((name) => serverEnv(name).length === 0);
}
