// Lấy JSON-LD (trải phẳng @graph) + breadcrumb microdata của từng trang → ldfull.json cho tools/the7_check_schema.mjs. Khách xem, CHỈ ĐỌC.
// Dùng: node tools/the7_lay_ld.mjs <base> <ra.json> /a/ /b/ …   (staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, out, ...paths] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage(); const kq = {};
if (base.includes('staging.')) { await p.goto(base + '/'); await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); }
for (const u of paths) {
  await p.goto(base + u + '?nc=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 90000 });
  kq[base + u] = await p.evaluate(() => {
    const ld = [];
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) { try { const j = JSON.parse(s.textContent); for (const n of [].concat(j['@graph'] || j)) ld.push(n); } catch { ld.push({ '@type': 'PARSE_ERROR' }); } }
    const crumbs = [...document.querySelectorAll('[itemtype*="schema.org/BreadcrumbList"]')].map((l) => [...l.querySelectorAll('[itemprop="itemListElement"]')].map((li) => ({ name: li.querySelector('[itemprop="name"]')?.textContent.trim() || '', item: li.querySelector('[itemprop="item"]')?.getAttribute('href') || null, pos: li.querySelector('[itemprop="position"]')?.getAttribute('content') || '' })));
    return { ld, crumbs };
  });
}
await b.close(); writeFileSync(out, JSON.stringify(kq, null, 1)); console.log('lấy', Object.keys(kq).length, 'trang →', out);
