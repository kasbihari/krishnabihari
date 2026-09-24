#!/usr/bin/env node
// Admin -> Client roundtrip test.
//
// Verifies the exact scenario from the task: an admin creates a client and a
// project through the real admin API, and the client then discovers that
// project through the Client Portal using only their client code.
//
// Usage:
//   node scripts/test-env/test-admin-client-roundtrip.mjs <dev-server-origin>
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
        if (name === 'admin_workspace_session' || name === 'client_portal_session') {
          cookies = pair;
        }
      }
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

async function main() {
  const adminJar = makeCookieJar();

  // ── Admin login ─────────────────────────────────────────────────────
  const login = await api('/api/admin/login', {
    method: 'POST',
    body: { email: 'admin@test.local', password: 'test-admin-password-123' },
    jar: adminJar,
  });
  adminJar.absorb(login.res);
  report('admin login succeeds', login.res.status === 200 && login.data?.success === true, `status ${login.res.status}`);

  // ── Admin creates a client ──────────────────────────────────────────
  const clientCode = `RT-${Date.now().toString(36).toUpperCase()}`;
  const createClient = await api('/api/admin/clients', {
    method: 'POST',
    body: { name: 'Roundtrip BV', company: 'Roundtrip BV', client_code: clientCode },
    jar: adminJar,
  });
  report('admin creates client', createClient.res.status === 201 && createClient.data?.id, `status ${createClient.res.status}`);
  const clientId = createClient.data?.id;

  // ── Admin creates a project assigned to that client ─────────────────
  const createProject = await api('/api/admin/projects', {
    method: 'POST',
    body: {
      client_id: clientId,
      name: 'AI Receptionist',
      type: 'AI Tool',
      category: 'ai-tool',
      status: 'Active',
      phase: 'Development',
      progress: 15,
      description: 'Roundtrip project',
    },
    jar: adminJar,
  });
  report('admin creates project', createProject.res.status === 201 && createProject.data?.id, `status ${createProject.res.status}`);
  const projectId = createProject.data?.id;

  // ── Verify the persisted relationship in the database ───────────────
  const persisted = (
    await pool.query(`select client_id, project_code from projects where id = $1`, [projectId])
  ).rows[0];
  report(
    'persisted project.client_id equals the client id',
    persisted?.client_id === clientId,
    `client_id ${persisted?.client_id}`,
  );

  // ── Client logs in with ONLY the client code and finds the project ──
  const clientJar = makeCookieJar();
  const clientLogin = await api('/api/client/login', {
    method: 'POST',
    body: { clientCode },
    jar: clientJar,
  });
  clientJar.absorb(clientLogin.res);
  report('client logs in with client code', clientLogin.res.status === 200, `status ${clientLogin.res.status}`);

  const list = await api('/api/client/projects', { jar: clientJar });
  const names = (list.data?.projects ?? []).map((p) => p.name);
  report(
    'client discovers the newly created project',
    list.res.status === 200 && names.includes('AI Receptionist'),
    JSON.stringify(names),
  );

  const found = (list.data?.projects ?? []).find((p) => p.name === 'AI Receptionist');
  report('discovered project id matches', found?.id === projectId, `id ${found?.id}`);

  // ── Workspace data loads for the discovered project ─────────────────
  const workspace = await api(`/api/client/project?projectId=${projectId}`, { jar: clientJar });
  report(
    'workspace loads with full data',
    workspace.res.status === 200 &&
      workspace.data?.project?.id === projectId &&
      Array.isArray(workspace.data?.timeline) &&
      Array.isArray(workspace.data?.updates) &&
      Array.isArray(workspace.data?.milestones) &&
      Array.isArray(workspace.data?.progressHistory) &&
      workspace.data?.hours !== null,
    `status ${workspace.res.status}`,
  );

  // ── Cleanup ─────────────────────────────────────────────────────────
  await pool.query(`delete from clients where id = $1`, [clientId]);
  await pool.end();

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
