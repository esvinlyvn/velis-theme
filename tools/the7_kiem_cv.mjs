// Kiểm content-visibility (2026-11-27): so CÓ / TẮT content-visibility (chèn *{content-visibility:visible!important} để đối chiếu)
//  (1) bấm từng link mục lục (Velis · Mục lục / Easy TOC) → vị trí H2 đích sau khi dừng cuộn, lệch ≤ 8 px so với bản tắt;
//  (2) điện thoại: "Xem thêm" có hiện + bấm mở hết khối;  (3) Ctrl+F: tools/the7_kiem_ctrlf.mjs;
//  (4) cuộn nhanh xuống / lên: chiều cao trang + vị trí cuộn không nhảy (lệch lớn nhất). CHỈ ĐỌC.
// Dùng: node tools/the7_kiem_cv.mjs <base> [đường dẫn …]   (staging: STAGING_VIEW_PASSWORD) – thoát 1 nếu có mục trượt
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, ...ds] = process.argv.slice(2); const b = await chromium.launch(); const kq = []; let truot = 0;
const TAT = '*{content-visibility:visible!important}';
const ghi = (u, ten, ok, ct) => { if (!ok) truot++; kq.push(`| ${u} | ${ten} | ${ok ? 'đạt' : 'TRƯỢT'} | ${ct} |`); };
async function mo(w, m, tat) {
  const ctx = await b.newContext({ viewport: { width: w, height: m ? 915 : 900 }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
  if (tat) await ctx.addInitScript((c) => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = c; document.head.appendChild(s); }), TAT);
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  return { ctx, p };
}
async function viTriMucLuc(w, m, u, tat) {
  const { ctx, p } = await mo(w, m, tat); await p.goto(base + u, { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const links = await p.locator('details.velis-muc-luc a[href^="#"], #ez-toc-container a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  const out = {};
  for (const h of links) {
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(200);
    const d = p.locator('details.velis-muc-luc'); if (await d.count()) await d.first().evaluate((x) => { x.open = true; });
    await p.locator(`details.velis-muc-luc a[href="${h}"], #ez-toc-container a[href="${h}"]`).first().evaluate((a) => a.click());
    await p.waitForTimeout(1500);
    out[h] = await p.evaluate((id) => { const e = document.getElementById(decodeURIComponent(id.slice(1))); return e ? Math.round(e.getBoundingClientRect().top) : null; }, h);
  }
  await ctx.close(); return out;
}
for (const u of ds.length ? ds : ['/can-ho-the-prive/', '/du-an/gamuda-land/', '/can-ho-persa-place/', '/gia-ban-the-prive-quan-2-2026/', '/']) {
  for (const [w, m] of [[412, true], [1366, false]]) {
    const co = await viTriMucLuc(w, m, u, false), khong = await viTriMucLuc(w, m, u, true);
    // link mục lục trỏ tới id không có (cả khi TẮT content-visibility) = lỗi nội dung sẵn có, không do content-visibility → báo riêng
    const hong = Object.keys(khong).filter((h) => khong[h] == null && co[h] == null); if (hong.length) kq.push(`| ${u} | Mục lục ${w}: link trỏ id không tồn tại (sẵn có) | ghi chú | ${hong.map((h) => decodeURIComponent(h).slice(0, 30)).join('; ')} |`);
    const lech = Object.keys(khong).filter((h) => !hong.includes(h)).map((h) => co[h] == null || khong[h] == null ? 999 : Math.abs(co[h] - khong[h]));
    const xau = Object.keys(khong).filter((h) => !hong.includes(h)).filter((h, i) => lech[i] > 8).map((h) => `${h.slice(0, 24)} có ${co[h]} / tắt ${khong[h]}`);
    if (lech.length) ghi(u, `Mục lục ${w} (${lech.length} link)`, Math.max(...lech) <= 8, 'lệch lớn nhất ' + Math.max(...lech) + ' px' + (xau.length ? ' · ' + xau.join('; ') : ''));
    const { ctx, p } = await mo(w, m, false); await p.goto(base + u, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    if (m) { const xt = p.locator('.velis-xem-them').first();
      if (await xt.count()) { await xt.scrollIntoViewIfNeeded(); const r = await xt.evaluate((b) => { const g = b.closest('.velis-khoi'); const h0 = g.getBoundingClientRect().height; b.click();
          return new Promise((ok) => setTimeout(() => ok([h0, g.getBoundingClientRect().height, g.classList.contains('velis-thu')]), 500)); });
        ghi(u, 'Xem thêm (412)', r[1] > r[0] + 100 && !r[2], `cao ${Math.round(r[0])} → ${Math.round(r[1])}`); } }
    // Tìm chữ (Ctrl+F): kiểm riêng bằng phím thật – tools/the7_kiem_ctrlf.mjs (window.find / cây trợ năng không thấy khối chưa dựng)
    // cuộn nhanh: mỗi 30 ms nhảy 1.500 px; vị trí sau 150 ms lệch so với vị trí đặt = trang tự kéo (neo cuộn) / nhảy
    const nhay = await p.evaluate(async () => { const H = document.documentElement.scrollHeight; let max = 0; const hs = new Set();
      for (const dir of [1, -1]) for (let y = dir > 0 ? 0 : H; dir > 0 ? y < H : y > 0; y += dir * 1500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); const dat = scrollY; await new Promise((r) => setTimeout(r, 150)); max = Math.max(max, Math.abs(scrollY - dat)); hs.add(document.documentElement.scrollHeight); }
      return { max, hMin: Math.min(...hs), hMax: Math.max(...hs) }; });
    ghi(u, `Cuộn nhanh ${w}`, nhay.max <= 8, `vị trí tự dịch lớn nhất ${nhay.max} px · cao trang ${nhay.hMin}–${nhay.hMax}`);
    await ctx.close();
  }
}
await b.close();
console.log('| Trang | Kiểm | Kết quả | Chi tiết |\n|---|---|---|---|\n' + kq.join('\n') + `\n\ntrượt ${truot}`); if (truot) process.exitCode = 1;
