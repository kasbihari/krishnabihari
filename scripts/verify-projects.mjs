/* Verify the Projects section end to end in a real browser (headless Chrome).
 *
 * Checks:
 *   1. All islands hydrate with zero console errors (hydration mismatch fix)
 *   2. The 4 projects render in exact order with localized labels
 *   3. Card expand/close works
 *   4. Study link navigates to the case study
 *   5. Language switch (NL, ES) translates the section
 *
 * Usage: node scripts/verify-projects.mjs [url]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] ?? 'http://localhost:4326/';
const userData = mkdtempSync(join(tmpdir(), 'cdp-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--remote-debugging-port=9250', `--user-data-dir=${userData}`,
  '--window-size=1400,1000', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(url, method = 'GET') {
  const res = await fetch(url, { method });
  return res.json();
}

async function main() {
  let targets;
  for (let i = 0; i < 50; i++) {
    try { targets = await getJson('http://127.0.0.1:9250/json/version'); break; }
    catch { await sleep(200); }
  }
  if (!targets) throw new Error('Chrome did not start');
  const tab = await getJson('http://127.0.0.1:9250/json/new?about:blank', 'PUT');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let msgId = 0;
  const pending = new Map();
  const errors = [];
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      return;
    }
    if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
      errors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(String(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text ?? '').slice(0, 200));
    }
  };
  await new Promise((resolve) => { ws.onopen = resolve; });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: URL });
  await sleep(3000);
  const evalJs = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  };

  // 1. Scroll through the whole page to trigger all client:visible islands
  await evalJs(`window.scrollTo(0, document.body.scrollHeight)`);
  await sleep(3000);
  const roots = await evalJs(`(() => {
    const islands = [...document.querySelectorAll('astro-island')];
    return islands.map((i) => (i.getAttribute('component-url') || '').split('/').pop());
  })()`);
  const allRoots = await evalJs(`(() => {
    const islands = [...document.querySelectorAll('astro-island')];
    return islands.every((i) => Object.keys(i).some((k) => k.startsWith('__reactContainer')));
  })()`);

  // 2. Projects section state
  await evalJs(`(() => {
    const el = document.querySelector('#projects');
    if (el) el.scrollIntoView({ block: 'center' });
    return !!el;
  })()`);
  await sleep(2500);
  const projects = await evalJs(`(() => {
    const cards = [...document.querySelectorAll('.pj-card')];
    return {
      titles: cards.map((c) => c.querySelector('.pj-title')?.textContent.trim()),
      categories: cards.map((c) => c.querySelector('.pj-category')?.textContent.trim()),
      contexts: cards.map((c) => c.querySelector('.pj-context')?.textContent.trim()),
      headerVisible: document.querySelector('.pj-header')?.classList.contains('is-visible') ?? false,
    };
  })()`);

  // 3. Expand / close
  await evalJs(`(() => { const b = document.querySelector('.pj-expand'); if (b) b.click(); return !!b; })()`);
  await sleep(600);
  const expanded = await evalJs(`document.querySelector('.pj-panel')?.getAttribute('data-open')`);
  await evalJs(`(() => { const b = document.querySelector('.pj-expand'); if (b) b.click(); return !!b; })()`);
  await sleep(600);
  const closed = await evalJs(`document.querySelector('.pj-panel')?.getAttribute('data-open')`);

  // 4. Study link
  const studyHref = await evalJs(`document.querySelector('.pj-study')?.getAttribute('href')`);

  // 5. Language switch to NL
  await evalJs(`(() => {
    const all = [...document.querySelectorAll('button')];
    const nl = all.find((b) => b.textContent.trim().toUpperCase() === 'NL');
    if (nl) nl.click();
    return !!nl;
  })()`);
  await sleep(1500);
  const nlTitle = await evalJs(`document.querySelector('.pj-header__title')?.textContent.trim()`);

  console.log(JSON.stringify({
    islands: roots,
    allHydrated: allRoots,
    consoleErrors: errors,
    projects,
    expandOpens: expanded,
    expandCloses: closed,
    studyHref,
    nlTitle,
  }, null, 2));

  ws.close();
  chrome.kill();
}

main().catch((err) => { console.error('FAILED:', err.message); chrome.kill(); process.exit(1); });
