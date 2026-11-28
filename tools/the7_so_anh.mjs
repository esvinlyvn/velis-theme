// So ảnh trước / sau (2026-11-27, làm gọn CSS): chụp khách xem ở 412 (điện thoại) + 1366 + 1920, rồi so từng điểm ảnh (lệch kênh > 24 và không khớp điểm nào trong vòng 1 px = khác).
// Chụp từng màn hình khi cuộn (tên-<rộng>-<số>.png). --tat-cv: tắt content-visibility để có ảnh đối chiếu trên cùng bản.
// Dùng: node tools/the7_so_anh.mjs --chup <base> <thư mục> [--tat-cv] [đường dẫn …]   |   --so <thư mục trước> <thư mục sau> [ngưỡng % = 0.5]   (staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module'; import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
export const TRANG = ['/', '/du-an/', '/chu-dau-tu/', '/can-ho-the-prive/', '/du-an/gamuda-land/', '/gia-ban-the-prive-quan-2-2026/', '/tieu-chuan-ban-giao-persa-place-gamuda-land/', '/blog/', '/blog/the-prive/',
  '/blog/page/2/', '/gioi-thieu/', '/lien-he/', '/tuyen-dung/', '/chinh-sach-bao-mat/', '/?s=the+prive', '/khong-co-trang-nay-404/', '/chuyen-gia/vu-xuan/'];
const KHO = [[412, 915, true], [1366, 768, false], [1920, 1080, false]].filter((k) => !process.env.KHO_CHI || process.env.KHO_CHI.split(',').includes(String(k[0])));
const ten = (u, w) => (u.replace(/[^\w]+/g, '_').replace(/^_|_$/g, '') || 'trang-chu') + '-' + w + '.png';
const TAT_CV = process.argv.includes('--tat-cv'); const [lenh, a1, a2, ...ds] = process.argv.slice(2).filter((x) => x !== '--tat-cv'); const b = await chromium.launch();
if (lenh === '--chup') {
  mkdirSync(a2, { recursive: true });
  for (const [w, h, m] of KHO) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, deviceScaleFactor: 1 }); const p = await ctx.newPage();
    if (TAT_CV) await ctx.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(s); }));
    if (a1.includes('staging.')) { await p.goto(a1 + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
    for (const u of ds.length ? ds : TRANG) {
      await p.goto(a1 + u, { waitUntil: 'load', timeout: 120000 }).catch(() => {});
      for (let y = 0; y < 30000; y += 800) { const H = await p.evaluate((y) => { scrollTo(0, y); return document.documentElement.scrollHeight; }, y); await p.waitForTimeout(60); if (y > H) break; }
      await p.evaluate(() => scrollTo(0, 0));
      // chờ mọi ảnh tải xong (ảnh lười tải về muộn làm lệch so sánh – 2026-11-27)
      await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 30000 }).catch(() => {}); await p.waitForTimeout(1500);
      // chụp từng màn hình khi cuộn (content-visibility: ảnh cả trang không vẽ khối ngoài khung nhìn – 2026-11-27)
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let k = 0, y = 0; y < H; k++, y += h) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(350);
        await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 10000 }).catch(() => {});
        await p.screenshot({ path: a2 + '/' + ten(u, w).replace('.png', '-' + String(k).padStart(2, '0') + '.png'), animations: 'disabled', caret: 'hide' }); }
      console.log(w, u);
    }
    await ctx.close();
  }
} else if (lenh === '--so') {
  const nguong = +(ds[0] || 0.5); const p = await b.newPage(); const kq = []; let truot = 0;
  for (const f of readdirSync(a1).filter((x) => x.endsWith('.png'))) {
    if (!existsSync(a2 + '/' + f)) { kq.push(`| ${f} | thiếu ảnh sau | TRƯỢT |`); truot++; continue; }
    const r = await p.evaluate(async ([x, y]) => {
      const img = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); return i; };
      const [A, B] = [await img(x), await img(y)]; const W = Math.max(A.width, B.width), H = Math.max(A.height, B.height);
      const px = (I) => { const c = new OffscreenCanvas(W, H); const g = c.getContext('2d'); g.fillStyle = '#f0f'; g.fillRect(0, 0, W, H); g.drawImage(I, 0, 0); return g.getImageData(0, 0, W, H).data; };
      // điểm khác = lệch kênh > 24 VÀ không có điểm khớp trong vòng 1 px ở ảnh kia (bỏ khử răng cưa chữ lệch < 1 px – như pixelmatch)
      const [a, b] = [px(A), px(B)]; const lech = (x, i, y, j) => Math.abs(x[i] - y[j]) > 24 || Math.abs(x[i + 1] - y[j + 1]) > 24 || Math.abs(x[i + 2] - y[j + 2]) > 24;
      const gan = (x, y, i) => { const px0 = (i / 4) % W, py0 = Math.floor(i / 4 / W); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = px0 + dx, Y = py0 + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; if (!lech(x, i, y, (Y * W + X) * 4)) return true; } return false; };
      let khac = 0; for (let i = 0; i < a.length; i += 4) if (lech(a, i, b, i) && !gan(a, b, i) && !gan(b, a, i)) khac++;
      return { pct: khac / (W * H) * 100, h: [A.height, B.height] };
    }, [readFileSync(a1 + '/' + f).toString('base64'), readFileSync(a2 + '/' + f).toString('base64')]);
    const ok = r.pct <= nguong; if (!ok) truot++;
    kq.push(`| ${f} | ${r.pct.toFixed(3)} % | cao ${r.h[0]} → ${r.h[1]} | ${ok ? 'đạt' : 'TRƯỢT'} |`);
  }
  console.log('| Ảnh | Khác | Chiều cao | Kết quả |\n|---|---|---|---|\n' + kq.filter((x) => !x.includes('| 0.000 %')).join('\n') + `\n\n${kq.length} ảnh · trượt ${truot} (ngưỡng ${nguong} %)`);
} else console.log('dùng: --chup <base> <thư mục> [đường dẫn …] | --so <trước> <sau> [ngưỡng]');
await b.close();
