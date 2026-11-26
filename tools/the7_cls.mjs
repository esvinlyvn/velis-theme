// CLS (máy tính / điện thoại): N lần / trang, trung vị + chi tiết cú xô (phần tử, khung trước → sau, thời điểm). Khách xem, CHỈ ĐỌC.
// Dùng (staging: STAGING_VIEW_PASSWORD): node tools/the7_cls.mjs <base> <rộng,…> <N> /a/ …  [--chi-tiet]   (không thêm tham số chống cache)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const a = process.argv.slice(2); const ct = a.includes('--chi-tiet'); const [base, ws, n, ...paths] = a.filter((x) => x !== '--chi-tiet');
const b = await chromium.launch(); const kq = [];
for (const w of ws.split(',').map(Number)) for (const u of paths) {
  const ds = [];
  for (let i = 0; i < +n; i++) {
    const m = w < 768;
    const ctx = await b.newContext({ viewport: { width: w, height: m ? 823 : (w >= 1900 ? 1080 : 768) }, isMobile: m, deviceScaleFactor: m ? 1.75 : 1 }); const p = await ctx.newPage();
    if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
    await p.addInitScript(() => { window.__s = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__s.push({ v: e.value, t: Math.round(e.startTime), src: e.sources.map((s) => { const n = s.node; const id = n ? (n.id ? '#' + n.id : '') + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.') : n.nodeName) : '?'; return `${id} ${Math.round(s.previousRect.y)}→${Math.round(s.currentRect.y)} h${Math.round(s.previousRect.height)}→${Math.round(s.currentRect.height)}`; }) }); }).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto(base + u, { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(3000);
    const s = await p.evaluate(() => window.__s); ds.push(s.reduce((x, e) => x + e.v, 0));
    if (ct && i === 0) for (const e of s.filter((e) => e.v > 0.005)) console.log(`   ${w} ${u} t=${e.t} v=${e.v.toFixed(3)}`, e.src.join(' | '));
    await ctx.close();
  }
  const sx = [...ds].sort((x, y) => x - y); const tv = sx[Math.floor(sx.length / 2)];
  kq.push({ w, u, tv, ds }); console.log(`${w} ${u.padEnd(28)} CLS trung vị ${tv.toFixed(3)} [${ds.map((x) => x.toFixed(3)).join(', ')}]`);
}
await b.close();
