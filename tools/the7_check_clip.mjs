// Chữ bị cắt / dòng meta lệch (bước 12). Khách xem staging (mật khẩu xem ở VIEW_PASSWORD_FILE), Chrome UA thật.
// 1) cắt: chữ (Range.getClientRects từng nút chữ) vượt khung của tổ tiên gần nhất có overflow ≠ visible hoặc line-clamp
//    (chữ ... cố ý – text-overflow: ellipsis, line-clamp – ghi riêng "rút gọn", không tính lỗi);
// 2) lệch: trong một dòng meta (chuyên mục · ngày …), các mẩu chữ cùng dòng phải cùng đáy chữ (±1,5 px), cùng cỡ chữ và màu.
// Kèm bộ đo người đánh giá: tràn ngang, số H1, ảnh hỏng, lỗi console.
// Dùng: node tools/the7_check_clip.mjs out.json [w1,w2,…] [đường_dẫn…]      node tools/the7_check_clip.mjs --test
import { createRequire } from 'node:module'; import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = 'https://staging.velisrealty.vn';
const UA = { d: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
  m: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' };
export const PAGES = ['/', '/du-an/', '/can-ho-the-prive/', '/the-global-city/', '/can-ho-persa-place/', '/du-an/vinhomes/', '/du-an/gamuda-land/',
  '/chu-dau-tu/', '/blog/', '/blog/the-prive/', '/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/',
  '/tieu-chuan-ban-giao-persa-place-gamuda-land/', '/gioi-thieu/', '/lien-he/', '/tuyen-dung/', '/?s=vinhomes', '/khong-ton-tai-xyz/'];
export const META = '.entry-meta, .post-meta, .recent-posts .post-content, .widget_presscore-blog-posts .post-content, .related-item .post-content, .velis-meta';

// Chạy trong trang. Trả về { cut: [...], trunc: [...], skew: [...] }.
export function scan(META) {
  const T = 1.5, out = { cut: [], trunc: [], skew: [] };
  const name = e => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = [...e.classList].slice(0, 2).join('.'); if (c) s += '.' + c; return s; };
  const path = e => { const a = []; for (let x = e; x && x !== document.body && a.length < 4; x = x.parentElement) a.unshift(name(x)); return a.join(' > '); };
  const shown = e => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && !e.closest('[aria-hidden="true"], .screen-reader-text, #wpadminbar, .skip-link, .dt-mobile-header:not(.show-mobile-header), [hidden]'); };
  const clips = e => { const s = getComputedStyle(e); return s.overflowX !== 'visible' || s.overflowY !== 'visible' || (s.webkitLineClamp && s.webkitLineClamp !== 'none'); };
  const seen = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.textContent.trim() ? 1 : 2 });
  for (let n; (n = w.nextNode());) {
    const el = n.parentElement; if (!el || !shown(el) || el.closest('script, style, noscript, select, option, textarea')) continue;
    const r = document.createRange(); r.selectNodeContents(n); const rects = [...r.getClientRects()].filter(q => q.width > 0 && q.height > 0); if (!rects.length) continue;
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      if (!clips(a)) continue;
      const s = getComputedStyle(a), b = a.getBoundingClientRect(); if (b.width < 2 || b.height < 2) break; // ô ẩn / thu gọn cố ý
      const box = { top: b.top + a.clientTop, left: b.left + a.clientLeft, bottom: b.top + a.clientTop + a.clientHeight, right: b.left + a.clientLeft + a.clientWidth };
      const y = s.overflowY !== 'visible' || s.webkitLineClamp !== 'none', x = s.overflowX !== 'visible';
      const bad = rects.filter(q => (y && (q.top < box.top - T || q.bottom > box.bottom + T) && q.bottom > box.top && q.top < box.bottom) || (x && (q.left < box.left - T || q.right > box.right + T) && q.right > box.left && q.left < box.right));
      const scrolls = s.overflowY === 'auto' || s.overflowY === 'scroll' || s.overflowX === 'auto' || s.overflowX === 'scroll';
      if (bad.length && !scrolls) {
        const k = path(a) + '|' + path(el); if (seen.has(k)) break; seen.add(k);
        const intended = s.textOverflow === 'ellipsis' || getComputedStyle(el).textOverflow === 'ellipsis' || (s.webkitLineClamp && s.webkitLineClamp !== 'none');
        const q = bad[0];
        (intended ? out.trunc : out.cut).push({ text: n.textContent.trim().slice(0, 40), el: path(el), clip: path(a),
          over: { top: Math.round(box.top - q.top), bottom: Math.round(q.bottom - box.bottom), left: Math.round(box.left - q.left), right: Math.round(q.right - box.right) } });
      }
      break; // chỉ xét khung cắt gần nhất
    }
  }
  for (const m of document.querySelectorAll(META)) {
    if (!shown(m) || m.getBoundingClientRect().height === 0) continue;
    const bits = []; const tw = document.createTreeWalker(m, NodeFilter.SHOW_TEXT, { acceptNode: n => n.textContent.trim() ? 1 : 2 });
    for (let n; (n = tw.nextNode());) { const el = n.parentElement; if (!shown(el)) continue; const r = document.createRange(); r.selectNodeContents(n);
      for (const q of r.getClientRects()) if (q.width > 0) { const s = getComputedStyle(el); bits.push({ t: n.textContent.trim().slice(0, 24), top: q.top, bottom: q.bottom, fs: s.fontSize, c: s.color, base: q.bottom - (q.height - parseFloat(s.fontSize)) / 2 }); } }
    // gom theo dòng: mẩu chồng nhau theo chiều dọc
    const lines = []; for (const b of bits) { const L = lines.find(l => Math.min(l[0].bottom, b.bottom) - Math.max(l[0].top, b.top) > 0); L ? L.push(b) : lines.push([b]); }
    for (const l of lines) { if (l.length < 2) continue;
      const bs = l.map(b => b.base), d = Math.max(...bs) - Math.min(...bs), fs = new Set(l.map(b => b.fs)), col = new Set(l.map(b => b.c));
      if (d > T || fs.size > 1 || col.size > 1) out.skew.push({ meta: path(m), bits: l.map(b => b.t), baselineSpread: +d.toFixed(1), sizes: [...fs], colors: [...col] }); }
  }
  return out;
}

async function selfTest() {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 800, height: 600 } })).newPage();
  await p.setContent(`<style>body{font:16px/24px Arial}</style>
    <ul><li style="overflow:hidden;width:140px"><a style="display:inline-flex;align-items:center;min-height:44px;margin-block:-10px;vertical-align:middle">Ức chế dòng vốn đầu tư</a></li></ul>
    <div style="overflow:hidden;height:40px"><p>dòng 1</p></div>
    <p style="width:60px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Chữ dài cố ý rút gọn</p>
    <div class="entry-meta"><span style="font-size:13px"><a style="display:inline-flex;vertical-align:middle;min-height:44px;align-items:center">Palm City</a></span> · <a style="display:inline-flex;vertical-align:middle;min-height:44px;align-items:center"><time>29/07/2026</time></a></div>
    <div class="post-meta"><a>Palm City</a> · <time>29/07/2026</time></div>`);
  const r = await p.evaluate(scan, META);
  await b.close();
  console.assert(r.cut.length === 1 && r.cut[0].text.startsWith('Ức chế'), 'phải bắt đúng 1 chỗ cắt (lề âm trong li overflow:hidden)', r.cut);
  console.assert(r.trunc.length === 1, 'ellipsis cố ý tính là rút gọn, không phải lỗi', r.trunc);
  console.assert(r.skew.length === 1 && r.skew[0].meta.startsWith('div.entry-meta'), 'chỉ dòng meta inline-flex bị lệch', r.skew);
  if (r.cut.length !== 1 || r.trunc.length !== 1 || r.skew.length !== 1) { console.log(JSON.stringify(r, null, 1)); process.exit(1); }
  console.log('self-test ok');
}

if (process.argv[2] === '--test') await selfTest();
else if (process.argv[2]) {
  const [out, ws = '360,390,430,768,1024,1366,1536,1920', ...pg] = process.argv.slice(2); const pages = pg.length ? pg : PAGES;
  const b = await chromium.launch(); const c0 = await b.newContext(); const lp = await c0.newPage(); await lp.goto(B + '/', { timeout: 120000 });
  if (await lp.$('input[type=password]')) { await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]); }
  const st = await c0.storageState(); await c0.close(); const res = {}; let nCut = 0, nSkew = 0;
  for (const u of pages) for (const w of ws.split(',').map(Number)) {
    const mob = w < 1024; const c = await b.newContext({ viewport: { width: w, height: mob ? 844 : 900 }, storageState: st, userAgent: mob ? UA.m : UA.d, ...(mob ? { isMobile: true, hasTouch: true } : {}) });
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 120))); p.on('console', m => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push(m.text().slice(0, 120)));
    await p.goto(B + u, { timeout: 180000, waitUntil: 'load' }); await p.mouse.move(200, 300); await p.mouse.wheel(0, 300); await p.waitForTimeout(1200);
    for (let y = 0; y < 40000; y += 700) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(30); if (y > await p.evaluate(() => document.documentElement.scrollHeight)) break; }
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
    const r = await p.evaluate(scan, META);
    Object.assign(r, await p.evaluate(() => ({ over: document.documentElement.scrollWidth > innerWidth + 1, h1: document.querySelectorAll('h1').length, broken: [...document.images].filter(i => i.complete && i.src && !i.src.startsWith('data:') && i.naturalWidth === 0).length })), { errs });
    res[`${u} @${w}`] = r; nCut += r.cut.length; nSkew += r.skew.length;
    console.log(u, w, 'cắt', r.cut.length, 'rút gọn', r.trunc.length, 'lệch', r.skew.length, 'tràn', +r.over, 'h1', r.h1, 'ảnh hỏng', r.broken, 'lỗi js', errs.length);
    await c.close();
  }
  writeFileSync(out, JSON.stringify(res, null, 1)); await b.close(); console.log('TỔNG cắt', nCut, 'lệch', nSkew);
}
