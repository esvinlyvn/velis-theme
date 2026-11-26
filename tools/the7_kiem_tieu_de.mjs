// Thang tiêu đề trong nội dung (2026-11-26): cỡ chữ thân bài (cỡ phổ biến nhất của <p>/<li> trong nội dung, tính theo số ký tự) và mọi
// h2–h6 trong nội dung; SAI khi tiêu đề nhỏ hơn chữ thân, hoặc tiêu đề đoạn văn dưới ngưỡng (máy tính 32/24/thân+1, điện thoại 26/21/thân+1).
// Tiêu đề của thành phần (câu hỏi Hỏi đáp, ô giá trị, nút mở / đóng) chỉ cần ≥ chữ thân – không phải tiêu đề mục của bài.
// Khách xem, CHỈ ĐỌC. Dùng: node tools/the7_kiem_tieu_de.mjs <base> <out.json> [rộng,…=1920,390] [đường dẫn …]  (không đường dẫn = toàn sitemap;
// staging không có sitemap → SITEMAP_BASE=https://velisrealty.vn lấy danh sách đường dẫn của site thật)
// Tự kiểm: node tools/the7_kiem_tieu_de.mjs --test
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
const nguong = (tag, than, m) => ({ h2: m ? 26 : 32, h3: m ? 21 : 24, h4: than + 1, h5: than, h6: than })[tag];
export const loi = (hs, than, m) => hs.filter((h) => h.px < than || (!h.tp && (h.px < nguong(h.tag, than, m) || (h.tag === 'h4' && h.w < 600))));
if (process.argv[2] === '--test') {
  const t = [{ tag: 'h2', px: 32, w: 600 }, { tag: 'h3', px: 24, w: 600 }, { tag: 'h4', px: 21, w: 600 }, { tag: 'h5', px: 20, w: 600 }];
  console.assert(loi(t, 20, false).length === 0, 'chuẩn máy tính');
  console.assert(loi([{ tag: 'h4', px: 17, w: 600 }], 20, false).length === 1, 'h4 < thân');
  console.assert(loi([{ tag: 'h4', px: 21, w: 400 }], 20, false).length === 1, 'h4 mảnh');
  console.assert(loi([{ tag: 'h3', px: 20, w: 600, tp: true }], 20, false).length === 0 && loi([{ tag: 'h3', px: 18, w: 600, tp: true }], 20, false).length === 1, 'thành phần');
  console.assert(loi([{ tag: 'h2', px: 28, w: 600 }], 18, true).length === 0 && loi([{ tag: 'h2', px: 24, w: 600 }], 18, true).length === 1, 'h2 điện thoại');
  console.log('the7_kiem_tieu_de: ok'); process.exit(0);
}
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, out, ws = '1920,390', ...ds] = process.argv.slice(2);
const CAM = /\/(check-can-the-prive|check-sdt|cmgd|lucky-lead|meta-check|tao-qr-bank|thi)\b/;
async function sitemap(p) {
  const sb = process.env.SITEMAP_BASE || base; const goc = await (await p.request.get(sb + '/sitemap_index.xml')).text(); const urls = [];
  for (const sm of [...goc.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1])) urls.push(...[...(await (await p.request.get(sm)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]).filter((u) => !/\.(jpe?g|png|webp)$/i.test(u)));
  return [...new Set(urls)].map((u) => new URL(u).pathname).filter((u) => !CAM.test(u));
}
const b = await chromium.launch(); const kq = [];
for (const w of ws.split(',').map(Number)) {
  const m = w < 768; const p = await (await b.newContext({ viewport: { width: w, height: m ? 844 : 1080 }, isMobile: m })).newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  const list = ds.length ? ds : await sitemap(p);
  if (!list.length) throw new Error('sitemap rỗng – đặt SITEMAP_BASE');
  for (const u of list) {
    const r = await p.goto(base + u, { waitUntil: 'domcontentloaded' }); await p.waitForLoadState('load').catch(() => {});
    const d = await p.evaluate(() => {
      const vung = [...document.querySelectorAll('#content .entry-content, #content .wpb-content-wrapper')].filter((e) => !e.parentElement.closest('.entry-content, .wpb-content-wrapper'));
      const dem = {}; const hs = [];
      for (const v of vung) {
        for (const e of v.querySelectorAll('p, li')) { if (e.closest('nav, form, .velis-eyebrow, [class*="velis-stat"], .post-content, .dt-css-grid')) continue; const n = e.textContent.trim().length; if (n < 40) continue; const s = parseFloat(getComputedStyle(e).fontSize); dem[s] = (dem[s] || 0) + n; }
        for (const h of v.querySelectorAll('h2, h3, h4, h5, h6')) { if (!h.offsetParent || h.closest('form, .post-content, .dt-css-grid, .owl-carousel')) continue; const c = getComputedStyle(h); hs.push({ tag: h.tagName.toLowerCase(), tp: !!h.closest('.velis-hoi-dap__muc, .velis-values, .vc_toggle_title'), px: parseFloat(c.fontSize), w: +c.fontWeight, cls: (h.className || '') + ' < ' + (h.parentElement.closest('[class*="velis-"]')?.className.match(/velis-[\w-]+/)?.[0] || ''), text: h.textContent.trim().slice(0, 50) }); }
      }
      const than = +(Object.entries(dem).sort((a, b) => b[1] - a[1])[0]?.[0] || 0);
      return { than, hs };
    });
    const sai = d.than ? loi(d.hs, d.than, m) : [];
    kq.push({ w, u, ma: r.status(), than: d.than, tieu_de: d.hs, sai });
    const theo = {}; for (const h of d.hs) (theo[h.tag] ||= new Set()).add(h.px);
    console.log(w, u.padEnd(50), 'thân', d.than, Object.entries(theo).map(([t, s]) => `${t}:${[...s].join('/')}`).join(' '), sai.length ? `SAI ${sai.length}: ` + sai.slice(0, 3).map((h) => `${h.tag} ${h.px} "${h.text}" [${h.cls}]`).join('; ') : 'ĐẠT');
  }
}
await b.close(); writeFileSync(out, JSON.stringify(kq, null, 1));
const n = kq.filter((k) => k.sai.length).length; console.log(`Tổng: ${kq.length} lượt, SAI ${n}`); process.exit(n ? 1 : 0);
