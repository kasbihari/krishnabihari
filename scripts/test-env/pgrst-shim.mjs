#!/usr/bin/env node
// Minimal PostgREST-compatible shim for local end-to-end testing.
//
// Implements exactly the subset of the PostgREST HTTP API that the
// application's supabase-js calls use, backed by a real PostgreSQL
// database with the real schema migrations applied. The connection uses
// the postgres superuser, which bypasses RLS exactly like the Supabase
// service_role key does in production.
//
// Supported:
//   GET    /table?select=a,b&col=eq.v&col=ilike.*p*&order=col.asc&limit=n
//   POST   /table  (Prefer: return=representation)
//   PATCH  /table?col=eq.v  (Prefer: return=representation)
//   DELETE /table?col=eq.v  (Prefer: return=representation)
//   Accept: application/vnd.pgrst.object+json  -> maybeSingle semantics
import http from 'node:http';
import pg from 'pg';

const PORT = Number(process.env.PGRST_PORT || 54330);
const PGHOST = process.env.PGHOST || '/tmp/kb-portal-test-socket';
const PGPORT = Number(process.env.PGPORT || 54329);
const PGUSER = process.env.PGUSER || 'postgres';

const pool = new pg.Pool({
  host: PGHOST,
  port: PGPORT,
  user: PGUSER,
  database: 'postgres',
  max: 5,
});

const TABLE_RE = /^\/(?:rest\/v1\/)?([a-z_]+)\/?$/;

function parseFilters(url) {
  const filters = [];
  for (const [key, rawValue] of url.searchParams) {
    if (key === 'select' || key === 'order' || key === 'limit' || key === 'offset') {
      continue;
    }
    const dot = rawValue.indexOf('.');
    if (dot === -1) {
      continue;
    }
    const operator = rawValue.slice(0, dot);
    let value = rawValue.slice(dot + 1);
    if (operator === 'ilike') {
      // PostgREST: * is the wildcard; backslash escapes are preserved.
      value = value.replace(/\*/g, '%');
      filters.push({ column: key, operator, value });
    } else if (operator === 'eq') {
      filters.push({ column: key, operator, value });
    } else {
      filters.push({ column: key, operator, value });
    }
  }
  return filters;
}

function buildWhere(filters) {
  if (filters.length === 0) {
    return { sql: '', params: [] };
  }
  const clauses = [];
  const params = [];
  for (const f of filters) {
    params.push(f.value);
    const idx = params.length;
    if (f.operator === 'ilike') {
      clauses.push(`${f.column} ilike $${idx}`);
    } else if (f.operator === 'eq') {
      clauses.push(`${f.column} = $${idx}`);
    } else {
      clauses.push(`${f.column} ${f.operator} $${idx}`);
    }
  }
  return { sql: ` where ${clauses.join(' and ')}`, params };
}

function parseOrder(url) {
  const order = url.searchParams.get('order');
  if (!order) {
    return '';
  }
  const parts = order.split(',').map((part) => {
    const [column, direction] = part.trim().split('.');
    return `${column} ${direction === 'desc' ? 'desc' : 'asc'}`;
  });
  return ` order by ${parts.join(', ')}`;
}

function parseSelect(url) {
  const select = url.searchParams.get('select');
  if (!select || select === '*' || select === '') {
    return '*';
  }
  return select
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ');
}

function json(res, status, body) {
  const payload = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function pgrstError(res, status, code, message, details = '', hint = '') {
  json(res, status, { code, message, details, hint });
}

async function handleGet(req, res, url, table) {
  const select = parseSelect(url);
  const where = buildWhere(parseFilters(url));
  const order = parseOrder(url);
  const limit = url.searchParams.get('limit');
  const limitSql = limit ? ` limit ${Number(limit)}` : '';
  const wantsSingle = (req.headers.accept || '').includes('vnd.pgrst.object+json');

  const sql = `select ${select} from ${table}${where.sql}${order}${limitSql}`;
  try {
    const result = await pool.query(sql, where.params);
    const rows = result.rows;
    if (wantsSingle) {
      if (rows.length > 1) {
        return pgrstError(res, 406, 'PGRST116', 'JSON object requested, multiple (or no) rows returned');
      }
      if (rows.length === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end();
      }
      return json(res, 200, rows[0]);
    }
    return json(res, 200, rows);
  } catch (err) {
    return pgrstError(res, 400, 'PGRST100', err.message);
  }
}

async function handleWrite(req, res, url, table, method) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  let body = {};
  if (chunks.length > 0) {
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return pgrstError(res, 400, 'PGRST100', 'Invalid JSON body');
    }
  }

  const where = buildWhere(parseFilters(url));
  const prefer = req.headers.prefer || '';
  const returnRepresentation = prefer.includes('return=representation');
  const wantsSingle = (req.headers.accept || '').includes('vnd.pgrst.object+json');

  const respond = (status, rows) => {
    if (!returnRepresentation) {
      return json(res, status, []);
    }
    if (wantsSingle) {
      if (rows.length > 1) {
        return pgrstError(res, 406, 'PGRST116', 'JSON object requested, multiple (or no) rows returned');
      }
      if (rows.length === 0) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        return res.end();
      }
      return json(res, status, rows[0]);
    }
    return json(res, status, rows);
  };

  try {
    if (method === 'POST') {
      const columns = Object.keys(body);
      const values = Object.values(body);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const sql = `insert into ${table} (${columns.join(', ')}) values (${placeholders}) returning *`;
      const result = await pool.query(sql, values);
      return respond(201, result.rows);
    }

    if (method === 'PATCH') {
      const columns = Object.keys(body);
      const values = Object.values(body);
      const sets = columns.map((c, i) => `${c} = $${i + 1}`).join(', ');
      const params = [...values, ...where.params];
      const sql = `update ${table} set ${sets}${where.sql} returning *`;
      const result = await pool.query(sql, params);
      return respond(200, result.rows);
    }

    if (method === 'DELETE') {
      const sql = `delete from ${table}${where.sql} returning *`;
      const result = await pool.query(sql, where.params);
      return respond(200, result.rows);
    }
  } catch (err) {
    return pgrstError(res, 400, 'PGRST100', err.message);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const match = TABLE_RE.exec(url.pathname);
  if (!match) {
    return pgrstError(res, 404, 'PGRST103', 'Not found');
  }
  const table = match[1];

  try {
    if (req.method === 'GET') {
      return await handleGet(req, res, url, table);
    }
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') {
      return await handleWrite(req, res, url, table, req.method);
    }
    return pgrstError(res, 405, 'PGRST102', 'Method not allowed');
  } catch (err) {
    return pgrstError(res, 500, 'PGRST101', err.message);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`pgrst-shim listening on http://127.0.0.1:${PORT}`);
});
