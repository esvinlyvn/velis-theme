// Kiểm ảnh bị ẩn chờ JS (2026-11-28): TẮT JavaScript, mở trang, mọi <img> trong nội dung không được có tổ tiên opacity ≈ 0 / visibility hidden
// (vd. hiệu ứng fadeInFromNone của lưới The7 chạy lại khi JS khởi tạo). Bỏ qua header / menu điện thoại / cửa sổ ảnh. CHỈ ĐỌC.
// Dùng: node tools/the7_kiem_anh_an.mjs <base> [đường dẫn …]   (staging: STAGING_VIEW_PASSWORD) – thoát 1 nếu còn ảnh bị ẩn
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, ...arg] = process.argv.slice(2);
const ds = arg.length ? arg : ['/', '/du-an/', '/chu-dau-tu/', '/can-ho-the-prive/', '/du-an/gamuda-land/', '/gia-ban-the-prive-quan-2-2026/', '/tieu-chuan-ban-giao-persa-place-gamuda-land/', '/blog/', '/blog/the-prive/', '/gioi-thieu/', '/lien-he/', '/tuyen-dung/', '/can-ho-persa-place/', '/the-global-city/', '/chuyen-gia/vu-xuan/'];
const b = await chromium.launch(); let truot = 0;
for (const [w, m] of [[412, true], [1366, false]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: m });
  if (base.includes('staging.')) { const q = await ctx.newPage(); await q.goto(base + '/'); if (await q.locator('input[type=password]').count()) { await q.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([q.waitForNavigation(), q.locator('input[type=submit], button[type=submit]').first().click()]); } await q.close(); }
  const kj = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: m, javaScriptEnabled: false, storageState: await ctx.storageState() }); const p = await kj.newPage(); let tong = 0; const an = [];
  for (const u of ds) { await p.goto(base + u, { waitUntil: 'load' }); await p.waitForTimeout(300);
    const r = await p.evaluate(() => { const o = []; let n = 0; for (const i of document.images) { if (i.closest('.masthead, .dt-mobile-header, .mobile-header-bar, #phantom, .pswp, .dt-close-mobile-menu-icon')) continue; n++; let e = i, why = '';
      while (e && e !== document.documentElement) { const s = getComputedStyle(e); if (+s.opacity < 0.05) { why = 'opacity 0: ' + e.className; break; } if (s.visibility === 'hidden') { why = 'ẩn: ' + e.className; break; } e = e.parentElement; }
      if (why) o.push((i.currentSrc || i.src).split('/').pop().slice(0, 40) + ' ← ' + String(why).slice(0, 60)); } return { n, o }; });
    tong += r.n; an.push(...r.o.map((x) => u + ' ' + x)); }
  truot += an.length; console.log(`${w}: ${tong} ảnh · bị ẩn khi chưa chạy JS: ${an.length}`); an.slice(0, 10).forEach((x) => console.log('   ', x)); await kj.close(); await ctx.close();
}
await b.close(); process.exitCode = truot ? 1 : 0;
