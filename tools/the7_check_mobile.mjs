// Đo bản điện thoại (bước 15). Khách xem staging (mật khẩu xem ở VIEW_PASSWORD_FILE), UA Android Chrome thật.
// Mỗi trang ở mỗi khung (< 768): chiều dài trang (so mục tiêu), vùng bấm < 44×44 (trừ link nằm trong đoạn văn),
// chữ < 14 px ngoài nhãn chữ hoa / chú thích, tràn ngang, ô nhập < 16 px, thứ tự form (ô đồng ý trước nút gửi),
// nút lên đầu trang phải ẩn, link "Bỏ qua tới nội dung" khi focus đủ 44 px. Bước 15b: trong mỗi form CF7 các ô nhập một dòng cùng viền
// (độ dày, kiểu, màu) và cùng cao, và khung ô thấy được trên nền (viền hoặc nền ô tương phản ≥ 1,3 với nền quanh form) (đo cả khung máy tính, vd. 1536: khung ≥ 768 dùng UA máy tính, chỉ tính mục này + tràn ngang).
// Dùng: node tools/the7_check_mobile.mjs out.json [w1,w2,…] [đường_dẫn…]      node tools/the7_check_mobile.mjs --test
import { createRequire } from 'node:module'; import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = 'https://staging.velisrealty.vn';
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36';
export const BAI = ['/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/', '/tieu-chuan-ban-giao-persa-place-gamuda-land/'];
export const PAGES = ['/', '/du-an/', '/can-ho-the-prive/', '/the-global-city/', '/chu-dau-tu/', '/blog/', '/blog/the-prive/', ...BAI,
  '/gioi-thieu/', '/lien-he/', '/tuyen-dung/', '/?s=vinhomes', '/khong-ton-tai-xyz/'];
// Mục tiêu chiều dài ở 390 px (người dùng 2026-11-16). Bài: giảm ≥ 15 % so với mốc trước bước 15 (đo 2026-11-16).
export const TARGET = { '/': 6500, '/can-ho-the-prive/': 9500, '/blog/': 4500 };
export const BAI_TRUOC = { '/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/': 11919, '/tieu-chuan-ban-giao-persa-place-gamuda-land/': 11693 };
// Chữ nhỏ được phép: nhãn chữ hoa (text-transform uppercase) và chú thích.
export const SMALL_OK = 'figcaption, .wp-caption-text, caption, .velis-bb-note, small';

// Chạy trong trang.
export function scan(SMALL_OK) {
  const out = { tap: [], small: [], input: [], order: [], field: [], over: document.documentElement.scrollWidth > innerWidth + 1, h: document.documentElement.scrollHeight };
  const name = e => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = [...e.classList].slice(0, 2).join('.'); if (c) s += '.' + c; return s; };
  const path = e => { const a = []; for (let x = e; x && x !== document.body && a.length < 3; x = x.parentElement) a.unshift(name(x)); return a.join(' > '); };
  const shown = e => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; }
    return !e.closest('[aria-hidden="true"], .screen-reader-text, #wpadminbar, [hidden], .dt-mobile-header:not(.show-mobile-header), .mobile-sticky-header-overlay'); };
  // link nội dòng trong đoạn văn: cha gần nhất là p/li/td có chữ ngoài link
  const inline = a => { const p = a.closest('p, li, td, dd'); if (!p || a.closest('nav, .menu, .widget_nav_menu, .velis-post-list, .post-meta, .entry-meta')) return false;
    return p.textContent.replace(a.textContent, '').trim().length > 3; };
  const seen = new Set();
  // vùng bấm thật: link có ::after phủ thẻ (position absolute, inset 0) → khung của tổ tiên định vị gần nhất (cả thẻ là link)
  const hit = e => { const a = getComputedStyle(e, '::after'); if (a.content !== 'none' && a.position === 'absolute') { for (let x = e.parentElement; x; x = x.parentElement) if (getComputedStyle(x).position !== 'static') return x.getBoundingClientRect(); } return e.getBoundingClientRect(); };
  for (let e of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, label[for], [role=button], .vc_tta-panel-heading, .vc_toggle_title')) {
    if (e.matches('input[type=checkbox], input[type=radio]')) e = e.closest('label') || e;
    if (e.matches('label[for]') && document.getElementById(e.htmlFor)?.matches('input:not([type=checkbox], [type=radio]), textarea, select')) continue; // nhãn chữ của ô nhập: đích bấm là ô
    if (seen.has(e) || !shown(e) || (e.tagName === 'A' && inline(e)) || getComputedStyle(e).pointerEvents === 'none') continue; seen.add(e);
    const r = hit(e); if (!r.width || !r.height || r.right <= 0 || r.left >= document.documentElement.scrollWidth) continue; // ô ẩn ngoài màn (checkbox của mục lục)
    if (r.width < 43.5 || r.height < 43.5) out.tap.push({ el: path(e), t: (e.textContent || e.value || e.getAttribute('aria-label') || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) });
  }
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.textContent.trim() ? 1 : 2 }); const sm = new Set();
  for (let n; (n = w.nextNode());) { const el = n.parentElement; if (!el || sm.has(el) || el.closest('script, style, noscript, option') || !shown(el)) continue;
    const s = getComputedStyle(el); if (parseFloat(s.fontSize) >= 13.95 || s.textTransform === 'uppercase' || el.closest(SMALL_OK)) continue;
    const r = el.getBoundingClientRect(); if (!r.width) continue; sm.add(el); out.small.push({ el: path(el), t: n.textContent.trim().slice(0, 30), fs: s.fontSize }); }
  for (const i of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=submit]), textarea, select'))
    if (shown(i) && parseFloat(getComputedStyle(i).fontSize) < 16) out.input.push({ el: path(i), fs: getComputedStyle(i).fontSize });
  for (const f of document.querySelectorAll('form.wpcf7-form')) { if (!shown(f)) continue;
    const a = f.querySelector('.wpcf7-acceptance'), s = f.querySelector('[type=submit]'); if (!a || !s) continue;
    if (a.getBoundingClientRect().bottom > s.getBoundingClientRect().top + 1) out.order.push(path(f)); }
  for (const f of document.querySelectorAll('form.wpcf7-form')) { if (!shown(f)) continue;
    const k = [...f.querySelectorAll('input:not([type=hidden], [type=checkbox], [type=radio], [type=submit], [type=button])')].filter(shown).map(i => { const s = getComputedStyle(i);
      return [s.borderTopWidth, s.borderTopStyle, s.borderTopColor, s.borderBottomColor, Math.round(i.getBoundingClientRect().height)].join(' '); });
    if (new Set(k).size > 1) out.field.push({ el: path(f), k });
    const rgb = c => (c.match(/[\d.]+/g) || []).map(Number), L = c => { const v = rgb(c).slice(0, 3).map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const bg = e => { for (let x = e.parentElement; x; x = x.parentElement) { const c = getComputedStyle(x).backgroundColor, a = rgb(c)[3]; if (a === undefined || a > 0.5) return c; } return 'rgb(255, 255, 255)'; };
    for (const i of f.querySelectorAll('input:not([type=hidden], [type=checkbox], [type=radio], [type=submit], [type=button])')) { if (!shown(i)) continue;
      const s = getComputedStyle(i), around = bg(i); if (cr(s.borderTopColor, around) < 1.3 && cr(s.backgroundColor, around) < 1.3) out.field.push({ el: path(i), an: 'khung ô không thấy', vien: s.borderTopColor, nen: around }); } }
  return out;
}

async function selfTest() {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 800 } })).newPage();
  await p.setContent(`<style>body{font:16px/24px Arial;margin:0}</style>
    <p>Đoạn có <a href="#">link nội dòng</a> nhỏ – không tính.</p>
    <a href="#" style="display:block;height:20px">Ngày 01/01</a>
    <button style="width:13px;height:13px"></button>
    <a href="#" style="display:block;height:48px">Đủ</a>
    <span style="font-size:12px">chữ nhỏ</span><span style="font-size:12px;text-transform:uppercase">nhãn</span><figcaption style="font-size:12px">chú thích</figcaption>
    <form class="wpcf7-form"><input type="text" style="font-size:15px;height:48px;width:200px"><input type="submit" value="Gửi" style="display:block;height:48px;width:100px">
      <span class="wpcf7-acceptance"><label style="display:block;height:48px"><input type="checkbox"> Đồng ý</label></span></form>
    <form class="wpcf7-form"><input type="text" style="font-size:16px;height:48px;border:1px solid #ccc"><input type="tel" style="font-size:16px;height:48px;border:1px solid #fff"></form>
    <form class="wpcf7-form"><input type="text" style="font-size:16px;height:48px;border:1px solid #ccc"><input type="tel" style="font-size:16px;height:48px;border:1px solid #ccc"></form>
    <div style="background:#222"><form class="wpcf7-form"><input type="text" style="font-size:16px;height:48px;border:1px solid #fff;background:#fff"></form></div>
    <form class="wpcf7-form"><input type="text" style="font-size:16px;height:48px;border:1px solid #fff;background:#fff"></form>
    <div style="position:relative;height:120px"><h3><a href="#" style="font-size:16px;line-height:18px">Thẻ</a></h3><style>h3 a::after{content:"";position:absolute;inset:0}</style></div>
    <a href="#" style="pointer-events:none;display:block;height:10px">không bấm</a><input type="checkbox" style="position:absolute;left:-9999px">
    <div style="width:500px">tràn</div>`);
  const r = await p.evaluate(scan, SMALL_OK); await b.close();
  const ok = r.tap.length === 2 && r.small.length === 1 && r.input.length === 1 && r.order.length === 1 && r.field.length === 3 && r.over;
  if (!ok) { console.log(JSON.stringify(r, null, 1)); console.error('self-test HỎNG'); process.exit(1); }
  console.log('self-test ok');
}

if (process.argv[2] === '--test') await selfTest();
else if (process.argv[2]) {
  const [out, ws = '360,390,430', ...pg] = process.argv.slice(2); const pages = pg.length ? pg : PAGES;
  const b = await chromium.launch(); const c0 = await b.newContext(); const lp = await c0.newPage(); await lp.goto(B + '/', { timeout: 120000 });
  if (await lp.$('input[type=password]')) { await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]); }
  const st = await c0.storageState(); await c0.close(); const res = {}; const sum = { tap: 0, small: 0, input: 0, order: 0, field: 0, over: 0, top: 0, skip: 0, len: 0, bar: 0 };
  for (const u of pages) for (const w of ws.split(',').map(Number)) {
    const m = w < 768, c = await b.newContext({ viewport: { width: w, height: m ? 844 : 900 }, storageState: st, ...(m ? { userAgent: UA, isMobile: true, hasTouch: true } : {}) });
    const p = await c.newPage(); await p.goto(B + u, { timeout: 180000, waitUntil: 'load' }); await p.mouse.wheel(0, 300); await p.waitForTimeout(1200);
    for (let y = 0; y < 40000; y += 700) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(30); if (y > await p.evaluate(() => document.documentElement.scrollHeight)) break; }
    await p.waitForTimeout(500);
    const top = await p.evaluate(() => [...document.querySelectorAll('.scroll-top')].some(e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0 && r.width > 0; }));
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
    const r = await p.evaluate(scan, SMALL_OK); r.topShown = top;
    if (!m) { res[`${u} @${w}`] = { field: r.field, over: r.over }; sum.field += r.field.length; sum.over += +r.over; console.log(u, w, 'ô form lệch', r.field.length, 'tràn', +r.over); await c.close(); continue; }
    await p.keyboard.press('Tab'); r.skip = await p.evaluate(() => { const a = document.activeElement; if (!a || !a.matches('.skip-link, [href="#content"]')) return null; const q = a.getBoundingClientRect(); return { w: Math.round(q.width), h: Math.round(q.height) }; });
    r.barOnFocus = await p.evaluate(async () => { const i = [...document.querySelectorAll('form.wpcf7-form input[type=text], form.wpcf7-form input[type=tel]')].find(x => x.offsetParent); const bar = document.querySelector('.velis-cta-bar');
      if (!i || !bar) return null; i.focus({ preventScroll: true }); await new Promise(f => setTimeout(f, 50)); const s = getComputedStyle(bar), shown = s.display !== 'none' && s.visibility !== 'hidden'; i.blur(); return shown; });
    const t = TARGET[u] ?? (BAI_TRUOC[u] ? Math.floor(BAI_TRUOC[u] * 0.85) : 0); r.target = w === 390 && t ? t : 0; r.longer = !!(r.target && r.h > r.target);
    res[`${u} @${w}`] = r;
    const skipBad = r.skip && (r.skip.w < 44 || r.skip.h < 44);
    sum.tap += r.tap.length; sum.small += r.small.length; sum.input += r.input.length; sum.order += r.order.length; sum.field += r.field.length; sum.over += +r.over; sum.top += +top; sum.skip += +!!skipBad; sum.len += +r.longer; sum.bar += +!!r.barOnFocus;
    console.log(u, w, 'dài', r.h + (r.target ? `/${r.target}` : ''), 'bấm<44', r.tap.length, 'chữ<14', r.small.length, 'ô<16', r.input.length, 'thứ tự form', r.order.length, 'ô form lệch', r.field.length, 'tràn', +r.over, 'nút lên đầu', +top, 'bỏ qua', r.skip ? `${r.skip.w}×${r.skip.h}` : '-', 'thanh khi gõ', r.barOnFocus);
    await c.close();
  }
  writeFileSync(out, JSON.stringify(res, null, 1)); await b.close(); console.log('TỔNG', JSON.stringify(sum));
}
