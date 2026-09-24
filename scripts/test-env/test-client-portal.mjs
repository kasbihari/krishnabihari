#!/usr/bin/env node
// End-to-end test of the Client Portal flow against a real database.
//
// Prerequisites (see setup-db.sh and pgrst-shim.mjs):
//   - a local PostgreSQL with the real migrations applied
//   - the PostgREST shim running on PGRST_PORT
//   - the Astro dev server running with PUBLIC_SUPABASE_URL /
//     SUPABASE_SERVICE_ROLE_KEY / CLIENT_SESSION_SECRET set
//
// Usage:
//   node scripts/test-env/test-client-portal.mjs <dev-server-origin>
import pg from 'pg';

const ORIGIN = process.argv[2] || 'http://127.0.0.1:4321';
const PGHOST = process.env.PGHOST || '/tmp/kb-portal-test-socket';
const PGPORT = Number(process.env.PGPORT || 54329);

const pool = new pg.Pool({
  host: PGHOST,
  port: PGPORT,
  user: 'postgres',
  database: 'postgres',
  max: 3,
});

let passed = 0;
let failed = 0;

function report(name, ok, detail = '') {
  if (ok) {
    passed += 1;
    console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function makeCookieJar() {
  let cookies = '';
  return {
    get header() {
      return cookies;
    },
    absorb(res) {
      const setCookie = res.headers.getSetCookie?.() ?? [];
      for (const raw of setCookie) {
        const [pair] = raw.split(';');
        const [name] = pair.split('=');
        if (name === 'client_portal_session') {
          cookies = pair;
        }
      }
    },
    clear() {
      cookies = '';
    },
  };
}

async function api(path, { method = 'GET', body, jar } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (jar?.header) {
    headers.Cookie = jar.header;
  }
  const res = await fetch(`${ORIGIN}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual',
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON body
  }
  return { res, data };
}

async function login(clientCode) {
  const jar = makeCookieJar();
  const { res, data } = await api('/api/client/login', {
    method: 'POST',
    body: { clientCode },
    jar,
  });
  jar.absorb(res);
  return { jar, res, data };
}

async function listProjects(jar) {
  return api('/api/client/projects', { jar });
}

async function openProject(jar, projectId) {
  return api(`/api/client/project?projectId=${encodeURIComponent(projectId)}`, { jar });
}

async function main() {
  // ── Seed data (service role, bypasses RLS like production) ──────────
  const clientA = (
    await pool.query(
      `insert into clients (name, company, client_code) values ($1, $2, $3) returning id`,
      ['Acme BV', 'Acme BV', 'ACM-4821'],
    )
  ).rows[0];

  const clientB = (
    await pool.query(
      `insert into clients (name, company, client_code) values ($1, $2, $3) returning id`,
      ['Beta GmbH', 'Beta GmbH', 'BETA-77'],
    )
  ).rows[0];

  const clientC = (
    await pool.query(
      `insert into clients (name, company, client_code) values ($1, $2, $3) returning id`,
      ['Solo Studio', 'Solo Studio', 'SOLO-1'],
    )
  ).rows[0];

  const projectA1 = (
    await pool.query(
      `insert into projects (client_id, project_code, name, type, category, status, phase, progress)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, project_code`,
      [clientA.id, 'PRJ-A1', 'AI Receptionist', 'AI Tool', 'ai-tool', 'Active', 'Development', 40],
    )
  ).rows[0];

  const projectA2 = (
    await pool.query(
      `insert into projects (client_id, project_code, name, type, category, status, phase, progress)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, project_code`,
      [clientA.id, 'PRJ-A2', 'Website', 'Web Application', 'web-development', 'Active', 'Design', 25],
    )
  ).rows[0];

  const projectA3 = (
    await pool.query(
      `insert into projects (client_id, project_code, name, type, category, status, phase, progress)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, project_code`,
      [clientA.id, 'PRJ-A3', 'Maintenance', 'Web Application', 'web-development', 'Completed', 'Launch', 100],
    )
  ).rows[0];

  const projectB1 = (
    await pool.query(
      `insert into projects (client_id, project_code, name, type, category, status, phase, progress)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, project_code`,
      [clientB.id, 'PRJ-B1', 'Analytics', 'SaaS', 'saas', 'Active', 'Development', 60],
    )
  ).rows[0];

  const projectB2 = (
    await pool.query(
      `insert into projects (client_id, project_code, name, type, category, status, phase, progress)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, project_code`,
      [clientB.id, 'PRJ-B2', 'Mobile App', 'Web Application', 'web-development', 'Paused', 'Planning', 10],
    )
  ).rows[0];

  const projectC1 = (
    await pool.query(
      `insert into projects (client_id, project_code, name, type, category, status, phase, progress)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, project_code`,
      [clientC.id, 'PRJ-C1', 'Solo Project', 'Web Application', 'web-development', 'Active', 'Development', 50],
    )
  ).rows[0];

  try {
    // ── Test 1: Client A (single project view via Client C) ───────────
    {
      const { jar, res, data } = await login('SOLO-1');
      report('T1 login with client code SOLO-1', res.status === 200 && data?.success === true, `status ${res.status}`);
      const list = await listProjects(jar);
      const names = (list.data?.projects ?? []).map((p) => p.name);
      report(
        'T1 client code returns its single project',
        list.res.status === 200 && names.length === 1 && names[0] === 'Solo Project',
        JSON.stringify(names),
      );
    }

    // ── Test 2: Client A with three projects ──────────────────────────
    {
      const { jar, res } = await login('ACM-4821');
      report('T2 login with client code ACM-4821', res.status === 200, `status ${res.status}`);
      const list = await listProjects(jar);
      const names = (list.data?.projects ?? []).map((p) => p.name).sort();
      report(
        'T2 client code returns all three projects',
        list.res.status === 200 &&
          names.length === 3 &&
          names[0] === 'AI Receptionist' &&
          names[1] === 'Maintenance' &&
          names[2] === 'Website',
        JSON.stringify(names),
      );
    }

    // ── Test 3: cross-client isolation on discovery ───────────────────
    {
      const a = await login('ACM-4821');
      const aList = await listProjects(a.jar);
      const aNames = (aList.data?.projects ?? []).map((p) => p.name).sort();
      const aOnly = aNames.length === 3 && !aNames.includes('Analytics') && !aNames.includes('Mobile App');

      const b = await login('BETA-77');
      const bList = await listProjects(b.jar);
      const bNames = (bList.data?.projects ?? []).map((p) => p.name).sort();
      const bOnly = bNames.length === 2 && !bNames.includes('AI Receptionist') && !bNames.includes('Website') && !bNames.includes('Maintenance');

      report(
        'T3 A code returns ONLY A projects',
        aOnly,
        JSON.stringify(aNames),
      );
      report(
        'T3 B code returns ONLY B projects',
        bOnly,
        JSON.stringify(bNames),
      );
    }

    // ── Test 4: invalid client code ───────────────────────────────────
    {
      const { res, data } = await login('NOPE-999');
      report(
        'T4 invalid client code rejected',
        res.status === 401 && data?.success === false,
        `status ${res.status}`,
      );
    }

    // ── Test 5: project id / code tampering cannot cross clients ──────
    {
      const a = await login('ACM-4821');

      const own = await openProject(a.jar, projectA1.id);
      report(
        'T5 own project opens',
        own.res.status === 200 && own.data?.project?.id === projectA1.id,
        `status ${own.res.status}`,
      );

      const other = await openProject(a.jar, projectB1.id);
      report(
        'T5 other client project id rejected',
        other.res.status === 403,
        `status ${other.res.status}`,
      );

      const bogus = await openProject(a.jar, '00000000-0000-0000-0000-000000000000');
      report(
        'T5 nonexistent project id rejected',
        bogus.res.status === 403,
        `status ${bogus.res.status}`,
      );

      const missing = await openProject(a.jar, '');
      report(
        'T5 missing project id rejected',
        missing.res.status === 400,
        `status ${missing.res.status}`,
      );

      // Tampering with the project_code query parameter must not help.
      const codeTamper = await api(
        `/api/client/project?projectId=${projectB1.id}&project_code=${encodeURIComponent(projectB1.project_code)}`,
        { jar: a.jar },
      );
      report(
        'T5 project_code tampering cannot expose another client project',
        codeTamper.res.status === 403,
        `status ${codeTamper.res.status}`,
      );
    }

    // ── Test 6: casing / whitespace tolerance ─────────────────────────
    {
      const { jar, res } = await login('  acm-4821  ');
      report(
        'T6 lowercase + whitespace client code accepted',
        res.status === 200,
        `status ${res.status}`,
      );
      const list = await listProjects(jar);
      report(
        'T6 session from normalized code lists projects',
        list.res.status === 200 && (list.data?.projects ?? []).length === 3,
        `count ${(list.data?.projects ?? []).length}`,
      );
    }

    // ── Test 7: unauthenticated access rejected ───────────────────────
    {
      const anon = await api('/api/client/projects');
      report(
        'T7 no session -> projects endpoint 401',
        anon.res.status === 401,
        `status ${anon.res.status}`,
      );
      const anonProject = await api(`/api/client/project?projectId=${projectA1.id}`);
      report(
        'T7 no session -> project endpoint 401',
        anonProject.res.status === 401,
        `status ${anonProject.res.status}`,
      );
    }
  } finally {
    // ── Cleanup (cascade removes projects) ────────────────────────────
    await pool.query(`delete from clients where id in ($1, $2, $3)`, [
      clientA.id,
      clientB.id,
      clientC.id,
    ]);
    await pool.end();
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
