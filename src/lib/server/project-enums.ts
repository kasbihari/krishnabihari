import { supabaseAdmin, reportSupabaseError } from './supabase-admin';

/**
 * Valid values for the enum-backed `projects.status` column.
 *
 * ── Why this is read from the database ───────────────────────
 * `projects.status` is a PostgreSQL enum (`project_status`). Its labels are
 * defined in the database and are NOT declared anywhere in this repository,
 * so any list hardcoded here would be a guess that could silently drift out
 * of sync with the real schema.
 *
 * Sending a value the enum does not define makes PostgreSQL reject the whole
 * statement with `invalid input value for enum project_status: "<value>"`.
 * That is how project creation broke: the API supplied a hardcoded default
 * ('Active') that the enum does not accept.
 *
 * Reading the labels back out of the table means every option offered by the
 * admin UI is a value the database has already accepted, so the enum can
 * never be contradicted.
 */

/** Upper bound on rows sampled when collecting distinct values. */
const SAMPLE_LIMIT = 500;

export type ProjectStatusOption = {
  /** Exact enum label — this is what gets sent to the database. */
  value: string;
  /** Human-friendly rendering, e.g. `in_development` → `In Development`. */
  label: string;
};

/**
 * Turn a raw enum label into something presentable without altering the
 * value itself: `in_development` → `In Development`, `on-hold` → `On Hold`.
 */
export function humanizeStatusLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

/**
 * Collect the distinct status values already stored on projects.
 *
 * Every returned value is guaranteed to be a valid `project_status` label.
 * `current` is always included so that editing a project can never lose or
 * misrepresent the value it already has, even if it is the only row using it.
 */
export async function fetchProjectStatusOptions(
  current = '',
): Promise<ProjectStatusOption[]> {
  const values = new Set<string>();

  const trimmedCurrent = current.trim();
  if (trimmedCurrent) {
    values.add(trimmedCurrent);
  }

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('status')
      .not('status', 'is', null)
      .limit(SAMPLE_LIMIT);

    if (error) {
      reportSupabaseError('fetchProjectStatusOptions', error);
    } else {
      for (const row of data ?? []) {
        const value = typeof row?.status === 'string' ? row.status.trim() : '';
        if (value) {
          values.add(value);
        }
      }
    }
  }

  return [...values]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: humanizeStatusLabel(value) }));
}
