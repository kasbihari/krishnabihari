/* Comprehensive ProjectCard expanded-state verification.
 *
 * For each viewport × each project card:
 *   - collapsed: panel height should be ~0 (no visible panel)
 *   - expanded: caption must NOT overlap the panel; panel grows naturally
 *   - closed again: back to collapsed
 * Also checks horizontal overflow (no layout shift) and runs in EN / NL / ES.
 *
 * Usage: node scripts/verify-expand.mjs [url]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = process.argv[2] ?? 'http://localhost:4326/';
const VIEWPORTS = [
  { w: 1440, h: 900, name: '1440' },
  { w: 1024, h: 768, name: '1024' },
  { w: 768, h: 1024, name: '768' },
  { w: 430, h: 932, name: '430' },
  { w: 390, h: 844, name: '390' },
  { w: 375, h: 812, name: '375' },
];
const LANGS = ['en', 'nl', 'es'];

const userData = mkdtempSync(join(tmpdir(), 'cdp-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--remote-debugging-port=9261', `--user-data-dir=${userData}`,
  '--window-size=1440,900', 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(url, method = 'GET') {
  const res = await fetch(url, { method });
  return res.json();
}

async function main() {
  let targets;
  for (let i = 0; i < 50; i++) {
    try { targets = await getJson('http://127.0.0.1:9261/json/version'); break; }
    catch { await sleep(200); }
  }
  if (!targets) throw new Error('Chrome did not start');
  const tab = await getJson('http://127.0.0.1:9261/json/new?about:blank', 'PUT');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let msgId = 0;
  const pending = new Map();
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
    }
  };
  await new Promise((resolve) => { ws.onopen = resolve; });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: URL });
  await sleep(3500);
  const evalJs = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  };

  const results = [];
  let failures = 0;

  for (const lang of LANGS) {
    // Switch language
    await evalJs(`(() => {
      const all = [...document.querySelectorAll('button')];
      const b = all.find((x) => x.textContent.trim().toUpperCase() === '${lang.toUpperCase()}');
      if (b) b.click();
      return !!b;
    })()`);
    await sleep(800);

    for (const vp of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: false,
      });
      await sleep(400);

      await evalJs(`(() => {
        const el = document.querySelector('#projects');
        if (el) el.scrollIntoView({ block: 'start' });
        return !!el;
      })()`);
      await sleep(1000);

      const cardCount = await evalJs(`document.querySelectorAll('.pj-card').length`);

      for (let i = 0; i < cardCount; i++) {
        // Expand card i
        await evalJs(`(() => {
          const btns = document.querySelectorAll('.pj-expand');
          if (btns[${i}]) btns[${i}].click();
          return true;
        })()`);
        await sleep(1100);

        const expanded = await evalJs(`(() => {
          const cards = document.querySelectorAll('.pj-card');
          const card = cards[${i}];
          const caption = card.querySelector('.pj-caption');
          const panel = card.querySelector('.pj-panel');
          const inner = card.querySelector('.pj-panel__inner');
          const r = (el) => {
            const b = el.getBoundingClientRect();
            return { top: Math.round(b.top), bottom: Math.round(b.bottom), height: Math.round(b.height) };
          };
          const cap = r(caption), p = r(panel), inn = r(inner);
          let overlap = null;
          const top = Math.max(cap.top, p.top);
          const bottom = Math.min(cap.bottom, p.bottom);
          if (bottom > top) overlap = bottom - top;
          // Panel content visible?
          const innerVisible = inn.height > 0;
          return {
            title: card.querySelector('.pj-title')?.textContent.trim(),
            caption: cap, panel: p, inner: inn,
            overlap, innerVisible,
            panelOpen: panel.getAttribute('data-open'),
          };
        })()`);

        // Close card i
        await evalJs(`(() => {
          const btns = document.querySelectorAll('.pj-expand');
          if (btns[${i}]) btns[${i}].click();
          return true;
        })()`);
        await sleep(1100);

        const collapsed = await evalJs(`(() => {
          const cards = document.querySelectorAll('.pj-card');
          const card = cards[${i}];
          const panel = card.querySelector('.pj-panel');
          const inner = card.querySelector('.pj-panel__inner');
          const b = panel.getBoundingClientRect();
          const ib = inner.getBoundingClientRect();
          return {
            panelHeight: Math.round(b.height),
            innerHeight: Math.round(ib.height),
            panelOpen: panel.getAttribute('data-open'),
          };
        })()`);

        const ok = !expanded.overlap && expanded.innerVisible && collapsed.panelHeight <= 2;
        if (!ok) failures++;
        results.push({
          lang, vp: vp.name, card: i, title: expanded.title,
          expandedOverlapPx: expanded.overlap,
          panelOpen: expanded.panelOpen,
          collapsedPanelHeight: collapsed.panelHeight,
          ok,
        });
      }

      // Horizontal overflow check (layout shift)
      const overflow = await evalJs(`(() => {
        const doc = document.documentElement;
        return { scrollW: doc.scrollWidth, clientW: doc.clientWidth };
      })()`);
      if (overflow.scrollW > overflow.clientW + 1) {
        failures++;
        results.push({ lang, vp: vp.name, card: 'ALL', overflow, ok: false });
      }
    }
  }

  console.log(JSON.stringify({ failures, results }, null, 2));
  ws.close();
  chrome.kill();
}

main().catch((err) => { console.error('FAILED:', err.message); chrome.kill(); process.exit(1); });
