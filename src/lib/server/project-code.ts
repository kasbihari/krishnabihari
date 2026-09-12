/**
 * Canonicalisation and matching for project codes.
 *
 * A project code is entered by a human and looked up against
 * `projects.project_code`. The database is the source of truth for the value
 * it holds, and that value is not guaranteed to be upper-case: rows backfilled
 * by the schema migration, or codes written directly, can be stored in any
 * case.
 *
 * The portal previously canonicalised everywhere to upper-case but compared
 * with exact equality:
 *
 *     .eq('project_code', input.trim().toUpperCase())
 *
 * That only ever finds a row whose stored value is already upper-case. Any
 * other casing is unreachable, and because the admin UI renders the code with
 * a CSS `text-transform: uppercase`, the operator reads a string that does not
 * exist in the database — the displayed code and the stored code disagree and
 * the portal rejects the very value it showed.
 *
 * These helpers give every caller one shared definition: the input is trimmed
 * and upper-cased to form a comparison key, matching against the stored value
 * is case-insensitive, and the stored value itself is never rewritten.
 */

/** The comparison key for a project code: trimmed, upper-cased. */
export function canonicalProjectCode(value: string): string {
  return value.trim().toUpperCase();
}

/**
 * Turn a comparison key into a literal pattern for PostgREST's `ilike`.
 *
 * `ilike` performs a pattern match, so the LIKE metacharacters `%` and `_`
 * (and the escape character itself) are escaped. Without this a code
 * containing `%` or `_` would widen the search instead of matching itself.
 *
 * `*` is deliberately left alone: PostgREST treats it as a wildcard and
 * whether a preceding backslash escapes it is not dependable. Unescaped, `*`
 * can only widen the search — an over-match is rejected by
 * `projectCodeMatches()` — while an escaped `*` could be read as a literal
 * `%` and lose the row entirely.
 */
export function projectCodeLikePattern(canonical: string): string {
  return canonical.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/**
 * True when a stored code equals the comparison key, ignoring case.
 *
 * Applied to the rows a case-insensitive lookup returns so that only a real
 * case-insensitive equality match is accepted — a pattern that over-matched
 * can never be mistaken for the requested project.
 */
export function projectCodeMatches(
  stored: unknown,
  canonical: string,
): boolean {
  return (
    typeof stored === 'string' &&
    canonicalProjectCode(stored) === canonical
  );
}
