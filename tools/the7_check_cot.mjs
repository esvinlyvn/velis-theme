// Bước 12b (2026-11-13) – 2 phép đo bố cục trên staging (khách xem, mật khẩu xem ở VIEW_PASSWORD_FILE, Chrome UA thật):
// (a) logo: số ảnh logo đang hiện trong vùng nhìn (không tính chân trang / nội dung) = 1 ở 360/390/768/1024,
//     3 trạng thái: đầu trang, đang dính (đã cuộn), menu điện thoại mở;
// (b) cột đọc: trên trang sản phẩm ở 1366/1536/1920, mọi khối chữ (đoạn, H2/H3, bảng – kể cả bảng trong "Xem thêm" / hỏi đáp, mục lục, hỏi đáp, chữ phần đầu
//     trừ nhãn + H1) cùng mép trái/phải ±1 px, rộng ≤ 760 px, trống trái/phải lệch ≤ 2 px so với khung nội dung.
// Dùng: node tools/the7_check_cot.mjs out.json [logo|cot|all]      node tools/the7_check_cot.mjs --test
import { createRequire } from 'node:module'; import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = 'https://staging.velisrealty.vn';
const UA = { d: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
  m: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' };
export const SAN_PHAM = ['/can-ho-palm-river/', '/can-ho-the-prive/', '/the-global-city/', '/can-ho-persa-place/', '/ansana-by-kita/', '/spring-ville/',
  '/vinhomes-saigon-park/', '/du-an/vinhomes/', '/du-an/masterise-homes/', '/du-an/gamuda-land/', '/du-an/sun-group/', '/chu-dau-tu/'];
const LOGO_PAGES = ['/', '/can-ho-the-prive/', '/blog/', '/chu-dau-tu/'];
export const COT = 760;

// (a) Chạy trong trang: ảnh logo thấy được (trong khung nhìn, không bị ẩn bởi display/visibility/opacity của tổ tiên).
export function logos() {
  const seen = el => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
  return [...document.images].filter(i => /logo/i.test(i.src + ' ' + i.className) && !i.closest('footer, #footer, #content, .footer'))
    .filter(i => { const r = i.getBoundingClientRect(); return r.width > 1 && r.height > 1 && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight && seen(i); })
    .map(i => { const r = i.getBoundingClientRect(); return { src: i.src.split('/').pop(), in: (i.closest('[class]')?.className || '').slice(0, 50), x: Math.round(r.left), y: Math.round(r.top) }; });
}

// (b) Chạy trong trang: các khối chữ và mép của chúng. Khối rộng hết khung (không xét): breadcrumb, nhãn, H1, ảnh, Inner Row
// (lưới thông tin, thư viện ảnh), lưới bài / thẻ, khối CTA, bài liên quan; danh sách (ul/ol) chỉ xét mép phải (thụt lề trái là chủ ý).
export function cot() {
  const content = document.querySelector('#content .wpb-content-wrapper, #content .entry-content, #content'); const c = content.getBoundingClientRect();
  const skip = '.velis-cta, .vc_inner, .velis-devs, .single-related-posts, .blog-shortcode, .articles-list, .dt-breadcrumbs-shortcode, .velis-eyebrow, h1, figure, .wpb_single_image, .wpb_video_widget, .vc_toggle_content, .post-meta, .wpcf7, .velis-specs';
  const sel = 'p, h2, h3, h4, ul, ol, table, [id^="ez-toc-container"], .ez-toc-v2_0_89, .vc_toggle, .dt-btn';
  const blocks = [...content.querySelectorAll(sel)].filter(e => !e.closest(skip) && !e.parentElement.closest('p, li, table, .vc_toggle, [id^="ez-toc-container"], .ez-toc-v2_0_89'))
    .filter(e => { const r = e.getBoundingClientRect(); return r.height > 0 && r.width > 0 && (e.innerText || '').trim(); })
    .map(e => { const r = e.getBoundingClientRect(); return { el: e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : ''),
      t: e.innerText.trim().slice(0, 30).replace(/\s+/g, ' '), list: /^(UL|OL)$/.test(e.tagName), btn: e.classList.contains('dt-btn'), l: r.left, r: r.right, w: r.width }; });
  // bước 14: bảng trong khối "Xem thêm" / hỏi đáp (runner mở sẵn) cũng phải rộng đúng cột
  for (const t of content.querySelectorAll('.vc_toggle_content table')) { if (t.closest(skip.replace('.vc_toggle_content, ', ''))) continue; const r = t.getBoundingClientRect();
    if (r.width > 0) blocks.push({ el: 'table(toggle)', t: (t.innerText || '').trim().slice(0, 30).replace(/\s+/g, ' '), list: false, btn: false, l: r.left, r: r.right, w: r.width }); }
  return { frame: { l: c.left, r: c.right }, blocks };
}

// Đánh giá (b): mép chung = mép của khối đoạn văn nhiều nhất.
export function judge({ frame, blocks }, cotW = COT) {
  const bad = [], mode = k => { const n = {}; for (const b of blocks.filter(b => !b.list && !b.btn)) n[Math.round(b[k])] = (n[Math.round(b[k])] || 0) + 1; return +Object.entries(n).sort((a, b) => b[1] - a[1])[0]?.[0]; };
  if (!blocks.length) return { L: null, R: null, bad: ['không có khối chữ'] };
  const L = mode('l'), R = mode('r');
  for (const b of blocks) {
    if (b.btn) { if (b.l < L - 1 || b.r > R + 1) bad.push(`${b.el} "${b.t}" nút ra ngoài cột`); continue; } // nút: trái cột hoặc giữa cột đều được
    if (!b.list && Math.abs(b.l - L) > 1) bad.push(`${b.el} "${b.t}" mép trái ${Math.round(b.l)} ≠ ${L}`);
    if (!b.btn && Math.abs(b.r - R) > 1 && !(b.list && b.r < R + 1)) bad.push(`${b.el} "${b.t}" mép phải ${Math.round(b.r)} ≠ ${R}`);
  }
  if (R - L > cotW + 1) bad.push(`cột rộng ${Math.round(R - L)} > ${cotW}`);
  const gl = L - frame.l, gr = frame.r - R; if (Math.abs(gl - gr) > 2) bad.push(`trống trái ${Math.round(gl)} ≠ phải ${Math.round(gr)}`);
  return { L, R, w: Math.round(R - L), gl: Math.round(gl), gr: Math.round(gr), bad };
}

async function selfTest() {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1536, height: 900 } })).newPage();
  await p.setContent(`<style>*{box-sizing:border-box}body{margin:0;font:16px Arial}#content{width:1200px;margin:0 auto}.k{max-width:760px;margin:0 auto}</style>
    <header><img class="logo" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="100" height="30" alt="">
      <img class="mobile-logo" style="display:none" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="100" height="30" alt="">
      <span style="opacity:0"><img class="logo" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="100" height="30" alt=""></span></header>
    <div id="content"><h1>Tiêu đề rộng hết khung</h1><p class="k">Đoạn trong cột</p><h2 class="k">H2 trong cột</h2><ul class="k"><li>mục</li></ul>
      <div class="vc_inner"><p>Lưới thông tin rộng hết khung</p></div><p>Đoạn lệch trái rộng hết khung</p>
      <div class="vc_toggle k"><p class="vc_toggle_title">Xem thêm</p><div class="vc_toggle_content"><table style="width:98.7%"><tr><td>Bảng hẹp hơn cột</td></tr></table></div></div></div>`);
  const lg = await p.evaluate(logos), r = judge(await p.evaluate(cot));
  await b.close();
  const ok = lg.length === 1 && r.bad.length === 3 && r.bad.filter(s => s.includes('Đoạn lệch')).length === 2 && r.bad.some(s => s.startsWith('table(toggle)')) && r.w === 760 && r.gl === r.gr;
  console.assert(lg.length === 1, 'logo: chỉ đếm ảnh thấy được (bỏ display:none, opacity:0)', lg);
  console.assert(ok, 'cột: bắt đoạn lệch (mép trái + phải) + bảng trong toggle hẹp hơn cột, bỏ H1 và Inner Row', r);
  if (!ok) { console.log(JSON.stringify({ lg, r }, null, 1)); process.exit(1); }
  console.log('self-test ok');
}

if (process.argv[2] === '--test') await selfTest();
else if (process.argv[2]) {
  const [out, what = 'all'] = process.argv.slice(2); const res = { logo: {}, cot: {} }; let nLogo = 0, nCot = 0;
  const b = await chromium.launch(); const c0 = await b.newContext(); const lp = await c0.newPage(); await lp.goto(B + '/', { timeout: 120000 });
  if (await lp.$('input[type=password]')) { await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]); }
  const st = await c0.storageState(); await c0.close();
  if (what !== 'cot') for (const u of LOGO_PAGES) for (const w of [360, 390, 768, 1024]) {
    const c = await b.newContext({ viewport: { width: w, height: 800 }, storageState: st, userAgent: UA.m, isMobile: true, hasTouch: true }); const p = await c.newPage();
    await p.goto(B + u, { timeout: 180000, waitUntil: 'load' }); await p.waitForTimeout(800);
    const top = await p.evaluate(logos);
    await p.mouse.wheel(0, 900); await p.waitForTimeout(400); await p.mouse.wheel(0, 900); await p.waitForTimeout(1200);
    const dinh = await p.evaluate(logos);
    const icon = p.locator('.mobile-header-bar .dt-mobile-menu-icon:visible, .dt-mobile-menu-icon:visible').first();
    let mo = null; if (await icon.count()) { await icon.click(); await p.waitForTimeout(1200); mo = await p.evaluate(logos); }
    const r = { top, dinh, mo }; res.logo[`${u} @${w}`] = r;
    const n = [top, dinh, mo].filter(x => x && x.length !== 1).length; nLogo += n;
    console.log('logo', u, w, 'đầu', top.length, 'dính', dinh.length, 'menu', mo ? mo.length : '–', n ? 'LỖI' : 'ok');
    await c.close();
  }
  if (what !== 'logo') for (const u of SAN_PHAM) for (const w of [1366, 1536, 1920]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, storageState: st, userAgent: UA.d }); const p = await c.newPage();
    await p.goto(B + u, { timeout: 180000, waitUntil: 'load' }); await p.waitForTimeout(800);
    await p.$$eval('.vc_toggle_content', cs => cs.forEach(c => { c.style.display = 'block'; })); // mở "Xem thêm" / hỏi đáp để đo bảng bên trong
    const r = judge(await p.evaluate(cot)); res.cot[`${u} @${w}`] = r; nCot += r.bad.length;
    console.log('cột', u, w, 'mép', r.L, r.R, 'rộng', r.w, 'trống', r.gl, r.gr, 'lỗi', r.bad.length, r.bad.slice(0, 2).join(' | '));
    await c.close();
  }
  writeFileSync(out, JSON.stringify(res, null, 1)); await b.close(); console.log('TỔNG logo lỗi', nLogo, 'cột lỗi', nCot);
}
