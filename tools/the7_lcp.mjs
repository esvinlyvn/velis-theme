// Phần tử LCP + tài nguyên chặn hiển thị (CSS / JS đồng bộ trong <head>) + ảnh đầu trang (loading / fetchpriority / cỡ tải so cỡ hiện).
// Khung điện thoại 412×823 (như Lighthouse mobile), không tham số chống cache. CHỈ ĐỌC. Dùng: node tools/the7_lcp.mjs <base> /a/ …
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const [base, ...paths] = process.argv.slice(2);
const b = await chromium.launch();
for (const u of paths) {
  const ctx = await b.newContext({ ...devices['Moto G4'], viewport: { width: 412, height: 823 } }); const p = await ctx.newPage();
  await p.addInitScript(() => { window.__lcp = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp.push(e); }).observe({ type: 'largest-contentful-paint', buffered: true }); });
  await p.goto(base + u, { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const e = window.__lcp.at(-1); const el = e?.element;
    const img = el?.tagName === 'IMG' ? el : el?.querySelector?.('img');
    const res = (url) => performance.getEntriesByName(url)[0];
    const head = [...document.head.querySelectorAll('link[rel=stylesheet], script[src]')].filter((x) => x.tagName === 'LINK' ? (!x.media || x.media === 'all') : !(x.defer || x.async || x.type === 'module'))
      .map((x) => { const url = x.href || x.src; const t = res(url); return `${x.tagName === 'LINK' ? 'CSS' : 'JS'} ${url.replace(location.origin, '').slice(0, 70)} ${t ? Math.round(t.transferSize / 1024) + 'KB ' + Math.round(t.responseEnd) + 'ms' : ''}`; });
    const preload = [...document.head.querySelectorAll('link[rel=preload]')].map((x) => `${x.as}:${(x.href || x.getAttribute('imagesrcset') || '').replace(location.origin, '').slice(0, 60)}${x.fetchPriority ? ' fp=' + x.fetchPriority : ''}`);
    const t = img ? res(img.currentSrc) : null;
    return { lcp_ms: Math.round(e?.startTime || 0), lcp_el: el ? `${el.tagName}.${(el.className || '').toString().slice(0, 60)} "${(el.textContent || '').trim().slice(0, 50)}"` : '?',
      anh: img ? { src: img.currentSrc.replace(location.origin, ''), loading: img.loading, fp: img.fetchPriority, tai: `${img.naturalWidth}×${img.naturalHeight}`, hien: `${Math.round(img.getBoundingClientRect().width)}×${Math.round(img.getBoundingClientRect().height)}`, kb: t ? Math.round(t.transferSize / 1024) : null, bat_dau_ms: t ? Math.round(t.startTime) : null, xong_ms: t ? Math.round(t.responseEnd) : null, sizes: img.sizes } : null,
      chan: head, preload };
  });
  console.log('=====', u, '| LCP', r.lcp_ms, 'ms |', r.lcp_el); if (r.anh) console.log('  ảnh LCP:', JSON.stringify(r.anh)); console.log('  preload:', r.preload.join(' ; ')); console.log('  chặn hiển thị:\n   ', r.chan.join('\n    '));
  await ctx.close();
}
await b.close();
