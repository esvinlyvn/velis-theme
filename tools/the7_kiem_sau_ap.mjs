// Kiểm sau khi áp bản 2.x (2026-11-26), khách xem, CHỈ ĐỌC – chạy được cả staging (STAGING_VIEW_PASSWORD) và site thật:
//   xem_them: nút "Xem thêm" (velis-clamp) đang hiện ở máy tính (≥ 1024) – phải 0
//   sidebar: trang sản phẩm có cột phải (#sidebar hiện) – phải không
//   nen: trang chủ – màu nền các dải lớn liên tiếp không trùng nhau (nền xen kẽ)
//   h2: khoảng trống trên H2 nội dung – phải ≥ thang (64 máy tính / 48 điện thoại) trừ H2 mở đầu khung có đệm
// Dùng: node tools/the7_kiem_sau_ap.mjs <base> <out.json>
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, out] = process.argv.slice(2);
const SP = ['/can-ho-the-prive/', '/the-global-city/', '/can-ho-persa-place/', '/ansana-by-kita/', '/spring-ville/', '/vinhomes-saigon-park/', '/can-ho-palm-river/',
  '/du-an/vinhomes/', '/du-an/sun-group/', '/du-an/masterise-homes/', '/du-an/gamuda-land/', '/chu-dau-tu/'];
const b = await chromium.launch(); const kq = []; let sai = 0;
for (const w of [1920, 390]) {
  const m = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: m ? 844 : 1080 }, isMobile: m, hasTouch: m, userAgent: m ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const p = await ctx.newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  for (const u of ['/', '/gioi-thieu/', ...SP]) {
    const res = await p.goto(base + u + '?nc=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
    const r = await p.evaluate((W) => {
      const vis = (e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none'; };
      const xem = [...document.querySelectorAll('.velis-xem-them')].filter(vis).length;
      const sb = [...document.querySelectorAll('#sidebar')].filter(vis).length;
      const dai = [...document.querySelectorAll('.wpb-content-wrapper > :is(.vc_row, .vc_section)')].filter((e) => vis(e) && e.getBoundingClientRect().height > 200)
        .map((e) => { let c = getComputedStyle(e).backgroundColor; if (c === 'rgba(0, 0, 0, 0)') c = 'trong'; return c; });
      const h2 = [...document.querySelectorAll('.wpb-content-wrapper h2')].filter((h) => vis(h) && !h.closest('.velis-nbg, .velis-cta, form, .velis-home-hero')).map((h) => {
        let e = h, prev = null;
        while (e && !e.matches('.wpb-content-wrapper')) { let s = e.previousElementSibling; while (s && !vis(s)) s = s.previousElementSibling; if (s) { prev = s; break; } e = e.parentElement; }
        return prev ? Math.round(h.getBoundingClientRect().top - prev.getBoundingClientRect().bottom) : null; }).filter((x) => x !== null);
      return { xem, sb, dai, h2 };
    }, w);
    const can = w < 768 ? 48 : 64;
    const loi = res.status() === 200 ? [] : ['HTTP ' + res.status()];
    if (w >= 1024 && r.xem) loi.push('Xem thêm hiện ' + r.xem);
    if (SP.includes(u) && r.sb) loi.push('có cột phải');
    if (u === '/') { const trung = r.dai.filter((c, i) => i && c === r.dai[i - 1] && c !== 'trong').length; if (trung) loi.push('nền 2 dải liền nhau trùng màu ×' + trung); }
    const h2hep = r.h2.filter((x) => x < can - 1); if (h2hep.length) loi.push('H2 cách < ' + can + ': ' + h2hep.join(','));
    if (loi.length) sai++;
    kq.push({ w, u, ...r, loi }); console.log(loi.length ? 'SAI' : 'ĐẠT', w, u.padEnd(26), loi.join(' | ') || (u === '/' ? 'nền: ' + r.dai.join(' → ') : ''));
  }
  await ctx.close();
}
await b.close(); writeFileSync(out, JSON.stringify(kq, null, 1)); process.exitCode = sai ? 1 : 0;
