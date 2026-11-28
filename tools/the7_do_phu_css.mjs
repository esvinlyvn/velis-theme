// Đo độ phủ CSS (Coverage) từng nguồn (2026-11-27): mở trang bản CHƯA gộp (?LSCWP_CTRL=before_optm) ở 412 + 1366, cuộn hết, mở menu điện thoại,
// gom byte được dùng của từng tệp CSS (hợp các trang). In bảng nguồn · KB · % dùng. CHỈ ĐỌC. (staging: STAGING_VIEW_PASSWORD)
// Dùng: node tools/the7_do_phu_css.mjs <base> <out.json> /a/ /b/ …
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, out, ...ds] = process.argv.slice(2); const b = await chromium.launch(); const nguon = {};
for (const [w, m] of [[412, true], [1366, false]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: m ? 915 : 900 }, isMobile: m }); const p = await ctx.newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  for (const u of ds) {
    await p.coverage.startCSSCoverage({ resetOnNavigation: false });
    await p.goto(base + u + (u.includes('?') ? '&' : '?') + 'LSCWP_CTRL=before_optm', { waitUntil: 'load', timeout: 120000 });
    for (let y = 0; y < 20000; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
    if (m) { await p.locator('.dt-mobile-menu-icon').first().click().catch(() => {}); await p.waitForTimeout(500); }
    const cov = await p.coverage.stopCSSCoverage();
    for (const c of cov) { if (!c.url) continue; const k = c.url.split('?')[0].replace(/^https?:\/\/[^/]+/, ''); const n = nguon[k] ||= { kb: c.text.length / 1024, dung: new Set(), len: c.text.length };
      for (const r of c.ranges) for (let i = r.start; i < r.end; i += 64) n.dung.add(Math.floor(i / 64)); }
    console.log(w, u);
  }
  await ctx.close();
}
await b.close();
const rows = Object.entries(nguon).map(([k, v]) => ({ nguon: k, kb: +v.kb.toFixed(1), dung: +(Math.min(100, (v.dung.size * 64) / v.len * 100)).toFixed(1) })).sort((a, b) => b.kb - a.kb);
writeFileSync(out, JSON.stringify(rows, null, 1));
console.log('| Nguồn | KB | % dùng |\n|---|---|---|\n' + rows.map((r) => `| ${r.nguon} | ${r.kb} | ${r.dung} |`).join('\n') + `\n| TỔNG | ${rows.reduce((a, r) => a + r.kb, 0).toFixed(0)} | |`);
