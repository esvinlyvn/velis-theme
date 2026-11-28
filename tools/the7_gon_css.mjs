// CSS gọn (2026-11-27, người dùng duyệt "920 KB → ≤ 250 KB"): lọc bỏ quy tắc CSS không khớp phần tử nào của The7 / WPBakery / plugin.
//  1) --quet <base> <dung.json>   quét toàn sitemap (SITEMAP_BASE, thêm trang danh sách / 404 / tìm kiếm / phân trang) ở 412 (điện thoại) + 1366,
//     mỗi trang qua nhiều trạng thái (cuộn, menu điện thoại + menu con, rê menu máy tính, cửa sổ ảnh, lọc /du-an/, Hỏi đáp, form trống – CHỈ staging),
//     ghi bộ chọn đã khớp (bỏ :hover/::before… → bộ chọn rộng hơn = giữ dư, an toàn) + danh sách tệp CSS gặp.
//  2) --sinh <base> <dung.json>   tải từng tệp nguồn của <base> (GET công khai), giữ nguyên văn quy tắc còn dùng (+ @font-face, @keyframes, :root,
//     bộ chọn trạng thái do JS thêm – GIU), đổi url() tương đối → /wp-content/…, ghi the7-child/dt-the7-child/gon/<tên miền>/ + bang.json (md5 nguồn).
//     Theme con chỉ dùng bản gọn khi md5 tệp nguồn trên máy chủ còn khớp (đổi Theme Options / cập nhật plugin → tự về tệp gốc tới khi sinh lại).
//  --test: tự kiểm bộ tách CSS + lọc. CHỈ ĐỌC trên site (form trống chỉ bấm ở staging; email staging đã tắt).
import { createRequire } from 'node:module'; import { writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs'; import { createHash } from 'node:crypto';

// ── bộ tách CSS tối giản: giữ nguyên văn, xử lý chú thích / chuỗi / ngoặc lồng ─────────────────────────────────────────────────────────
export function tach(css) {
  const out = []; let i = 0; const n = css.length;
  const bo = () => { for (;;) { while (i < n && /\s/.test(css[i])) i++; if (css.startsWith('/*', i)) { const e = css.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; } else break; } };
  const den = (stop) => { let s = i; let d = 0; while (i < n) { const c = css[i];
    if (c === '"' || c === "'") { i++; while (i < n && css[i] !== c) { if (css[i] === '\\') i++; i++; } i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '(') d++; else if (c === ')') d--; else if (!d && stop.includes(c)) break; i++; } return css.slice(s, i); };
  const khoi = () => { let d = 1; const s = ++i; while (i < n && d) { const c = css[i];
    if (c === '"' || c === "'") { i++; while (i < n && css[i] !== c) { if (css[i] === '\\') i++; i++; } i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '{') d++; else if (c === '}') d--; i++; } return css.slice(s, i - 1); };
  for (;;) { bo(); if (i >= n) break; if (css[i] === '}') { i++; continue; }
    const dau = den(';{').trim(); if (i >= n) { if (dau) out.push({ t: 'raw', s: dau }); break; }
    if (css[i] === ';') { i++; out.push({ t: 'raw', s: dau + ';' }); continue; }
    const than = khoi();
    if (/^@(media|supports|container|layer|document|-moz-document)\b/i.test(dau)) out.push({ t: 'nhom', dau, con: tach(than) });
    else if (dau.startsWith('@')) out.push({ t: 'raw', s: dau + '{' + than + '}' });
    else out.push({ t: 'qt', dau, than });
  }
  return out;
}
export const tachChon = (sel) => { const p = []; let d = 0, c = '', q = ''; for (const ch of sel) { if (q) { if (ch === q) q = ''; c += ch; continue; } if (ch === '"' || ch === "'") q = ch;
  if (ch === '(' || ch === '[') d++; if (ch === ')' || ch === ']') d--; if (ch === ',' && !d) { p.push(c.trim()); c = ''; } else c += ch; } p.push(c.trim()); return p.filter(Boolean); };
// bỏ mọi giả lớp / giả phần tử (kể cả :not(...)) → bộ chọn rộng hơn bản gốc: khớp bản rộng = có thể khớp bản gốc → giữ (dư, không thiếu)
export function rong(s) {
  let o = '', i = 0, q = '';
  while (i < s.length) { const c = s[i];
    if (q) { o += c; if (c === q) q = ''; i++; continue; }
    if (c === '"' || c === "'") { q = c; o += c; i++; continue; }
    if (c === '[') { const e = s.indexOf(']', i); o += s.slice(i, e + 1); i = e + 1; continue; }
    if (c === '\\') { o += s.slice(i, i + 2); i += 2; continue; }
    if (c === ':') { i++; if (s[i] === ':') i++; while (i < s.length && /[\w-]/.test(s[i])) i++; if (s[i] === '(') { let d = 0; do { if (s[i] === '(') d++; else if (s[i] === ')') d--; i++; } while (i < s.length && d); } continue; }
    o += c; i++; }
  o = o.replace(TT, '').replace(/([>+~])\s*(?=[>+~]|$)/g, '$1 * ').replace(/^\s*([>+~])/, '* $1').trim();
  return o || '*';
}
// lớp TRẠNG THÁI do JS / trình duyệt thêm (mở menu, dính đầu trang, Safari, iOS, form đã gửi…): bỏ khi thử khớp như giả lớp → bộ chọn rộng hơn
// (vd. ".is-safari .x.act" thử bằng ".x") → giữ được quy tắc của trạng thái mà lần quét không gặp, miễn phần tử gốc có trên site
const TT = /\.(?:act|active|open|opened|show|shown|visible|on|off|hover|hovered|dt-hovered|is-[\w-]+|loading|loaded|lazy-loaded|animate[\w-]*|start-animation|animation-[\w-]+|sticky-[\w-]+|phantom-[\w-]+|closed|current[\w-]*|selected|disabled|focus[\w-]*|playing|paused|ready|transition[\w-]*|sent|invalid|failed|spam|aborted|submitting|unaccepted|resetting|payment-required|wpcf7-not-valid[\w-]*|mobile-true|mobile-false|touchevents|no-touchevents|ios|android|firefox|edge|old-ie|safari|ie|chrome|menu-open|dt-menu-open|show-mobile-menu|show-overlay|hide-overlay|dt-open[\w-]*|mfp-[\w-]+|pswp--[\w-]+)(?![\w-])/g;
// luôn giữ: cửa sổ ảnh (chỉ sinh khi mở) + LỚP TÙY CHỌN người soạn chọn trong WPBakery / The7 (căn lề, ẩn hiện theo thiết bị, cột…) – lần quét chỉ thấy
// lựa chọn đang dùng; bỏ phần còn lại thì đổi lựa chọn trong trình soạn sẽ không có CSS (2026-11-28: btn-align-right / align-left bị lọc mất – DESIGN.md)
export const GIU = /\.(pswp|mfp-|btn-align-|vc_align_|vc_btn3-(?:left|center|right|inline|align|size|shape|style|color|icon)|align-(?:left|right|center|centre)\b|text-(?:left|right|center)\b|vc_hidden|vc_col-(?:xs|sm|md|lg)-\d+\b(?!-)|vc_txt_align_|vc_separator_align_|vc_icon_element-align-|vc_single_image-|vc_box_|wpb_align|dt-text-|content-align-|title-align-|vc_row-o-|vc_row-flex|vc_column-gap-)/;
export function loc(css, dung) {
  const viet = (ds) => ds.map((x) => {
    if (x.t === 'raw') return x.s;
    if (x.t === 'nhom') { const c = viet(x.con); return c ? x.dau + '{' + c + '}' : ''; }
    const p = tachChon(x.dau); return p.some((s) => /^(:root|html|body|\*)\b/.test(s) || GIU.test(s) || dung.has(rong(s))) ? x.dau + '{' + x.than + '}' : '';
  }).join('');
  return viet(tach(css));
}
export const chonCua = (css) => { const s = new Set(); const di = (ds) => ds.forEach((x) => { if (x.t === 'nhom') di(x.con); else if (x.t === 'qt') tachChon(x.dau).forEach((c) => s.add(rong(c))); }); di(tach(css)); return s; };
export const doiUrl = (css, path) => css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, v) => /^(data:|#|https?:|\/)/.test(v) ? m : `url("${new URL(v, 'https://x' + path).pathname}${new URL(v, 'https://x' + path).search}${new URL(v, 'https://x' + path).hash}")`);

const KHONG_LOC = /\/velis\.css$/; // velis.css = nguồn sửa tay (dọn thẳng trong tệp)
const BIEN = /\/the7-css\/css-vars\.css$/; // biến :root của The7 – lọc theo biến còn được nhắc tới (CSS gọn, velis.css, HTML + JS trang)
const THEM = ['/wp-includes/blocks/social-links/style.min.css', '/wp-includes/blocks/paragraph/style.min.css']; // khối core in nội tuyến (đọc theo 'path')
const CAM = /\/(check-can-the-prive|check-sdt|cmgd|lucky-lead|meta-check|tao-qr-bank|thi)\b/;

const TRANG_BIEN = ['/', '/du-an/', '/chu-dau-tu/', '/can-ho-the-prive/', '/du-an/gamuda-land/', '/gia-ban-the-prive-quan-2-2026/', '/blog/', '/blog/the-prive/', '/gioi-thieu/', '/lien-he/', '/tuyen-dung/', '/?s=the+prive', '/khong-co-trang-nay-404/', '/chuyen-gia/vu-xuan/'];
const daJs = new Set();
// giữ khai báo --x khi tên được nhắc tới ngoài định nghĩa của chính nó (var(--x), JS đọc / đặt '--x'); lặp tới khi ổn định (biến dùng biến)
export function locBien(css, nguon) {
  const dinh = (t) => t.replace(/(^|[;{\s])--[\w-]+\s*:/g, '$1'); let co = new Set((dinh(nguon).match(/--[\w-]+/g) || []));
  const ds = tach(css); const decl = (than) => { const o = []; let d = 0, c = '', q = ''; for (const ch of than) { if (q) { c += ch; if (ch === q) q = ''; continue; } if (ch === '"' || ch === "'") q = ch; if (ch === '(') d++; if (ch === ')') d--; if (ch === ';' && !d) { o.push(c); c = ''; } else c += ch; } o.push(c); return o.filter((x) => x.trim()); };
  const tat = []; const di = (xs) => xs.forEach((x) => { if (x.t === 'nhom') di(x.con); else if (x.t === 'qt') decl(x.than).forEach((v) => tat.push(v)); }); di(ds);
  for (let doi = true; doi;) { doi = false; for (const v of tat) { const m = v.match(/^\s*(--[\w-]+)\s*:/); if (m && co.has(m[1])) for (const r of v.slice(m[0].length).match(/--[\w-]+/g) || []) if (!co.has(r)) { co.add(r); doi = true; } } }
  const viet = (xs) => xs.map((x) => { if (x.t === 'raw') return x.s; if (x.t === 'nhom') { const c = viet(x.con); return c ? x.dau + '{' + c + '}' : ''; }
    const g = decl(x.than).filter((v) => { const m = v.match(/^\s*(--[\w-]+)\s*:/); return !m || co.has(m[1]); }); return g.length ? x.dau + '{' + g.map((v) => v.trim()).join(';') + '}' : ''; }).join('');
  return viet(ds);
}

async function moKhach(b, base, w, m) {
  const ctx = await b.newContext({ viewport: { width: w, height: m ? 915 : 900 }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  return { ctx, p };
}

async function quet(base, out) {
  const { chromium } = createRequire(import.meta.url)('playwright'); const b = await chromium.launch();
  const { ctx: c0, p: p0 } = await moKhach(b, base, 1366, false);
  const sb = process.env.SITEMAP_BASE || base; const goc = await (await p0.request.get(sb + '/sitemap_index.xml')).text(); let ds = [];
  for (const sm of [...goc.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1])) ds.push(...[...(await (await p0.request.get(sm)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]).filter((u) => !/\.(jpe?g|png|webp)$/i.test(u)));
  ds = [...new Set(ds.map((u) => new URL(u).pathname))].filter((u) => !CAM.test(u));
  ds.push('/khong-co-trang-nay-404/', '/?s=the+prive', '/blog/page/2/', '/du-an/?loc=thu-thiem', '/chuyen-gia/vu-xuan/');
  await c0.close(); console.log(ds.length, 'đường dẫn');
  const tep = new Set(); const da = new Set(); const nguonTxt = {}; let con = null; // con = bộ chọn rộng chưa khớp
  const lay = async (p) => { const hs = await p.evaluate(() => [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href).filter((h) => h.startsWith(location.origin)).map((h) => new URL(h).pathname));
    for (const h of [...hs, ...THEM]) if (!tep.has(h)) { tep.add(h); const r = await p.request.get(base + h); if (r.ok()) { nguonTxt[h] = await r.text(); for (const s of chonCua(nguonTxt[h])) if (!da.has(s)) (con ||= new Set()).add(s); } } };
  const kiem = async (p) => { if (!con?.size) return; const ks = await p.evaluate((ls) => ls.filter((s) => { try { return !!document.querySelector(s); } catch { return true; } }), [...con]); ks.forEach((s) => { da.add(s); con.delete(s); }); };
  const lam = async (p, m, u) => {
    await p.goto(base + u + (u.includes('?') ? '&' : '?') + 'LSCWP_CTRL=before_optm', { waitUntil: 'load', timeout: 120000 }).catch(() => {}); await p.waitForTimeout(800);
    await lay(p); await kiem(p);
    for (let y = 0; y < 30000; y += 700) { const h = await p.evaluate((y) => { scrollTo(0, y); return document.documentElement.scrollHeight; }, y); await p.waitForTimeout(40); if (y > h) break; }
    await p.waitForTimeout(300); await kiem(p); await p.evaluate(() => scrollTo(0, 0));
    const bam = async (sel, sau = 400) => { const l = p.locator(sel).first(); if (await l.count() && await l.isVisible().catch(() => false)) { await l.click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(sau); await kiem(p); return true; } return false; };
    if (m) { if (await bam('.dt-mobile-menu-icon', 700)) { await bam('.dt-mobile-header .next-level-button'); await p.keyboard.press('Escape'); await bam('.dt-close-mobile-menu-icon'); } }
    else for (const li of await p.locator('#primary-menu > li.has-children, .main-nav > li.has-children').all()) { await li.hover().catch(() => {}); await p.waitForTimeout(250); await kiem(p); }
    await bam('.velis-hoi-dap summary, details summary'); await bam('.mini-search .submit, .searchform .submit');
    if (/\/du-an\/$/.test(u)) for (const a of (await p.locator('.filter-categories a, .velis-loc a').all()).slice(0, 3)) { await a.click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(600); await kiem(p); }
    if (await bam('a.dt-pswp-item, a.rollover-click-target[data-dt-img-description], .wpb_single_image a[data-dt-img-description], a.dt-gallery-pswp', 900)) { await p.keyboard.press('Escape'); await p.waitForTimeout(300); }
    if (base.includes('staging.') && await p.locator('.wpcf7 form').count()) { await p.locator('.wpcf7 form [type=submit]').first().click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(1500); await kiem(p); }
  };
  const viec = []; for (const [w, m] of [[412, true], [1366, false]]) for (let k = 0; k < 2; k++) viec.push([w, m, ds.filter((x, i) => i % 2 === k)]);
  let xong = 0;
  await Promise.all(viec.map(async ([w, m, list]) => { const { ctx, p } = await moKhach(b, base, w, m);
    for (const u of list) { await lam(p, m, u); if (++xong % 25 === 0) console.log(xong, '/', ds.length * 2, '· chưa khớp', con?.size); }
    await ctx.close(); }));
  await b.close();
  writeFileSync(out, JSON.stringify({ base, ngay: new Date().toISOString(), trang: ds.length, tep: [...tep], dung: [...da] }));
  console.log('khớp', da.size, '· không khớp', con?.size, '· tệp', tep.size);
}

async function sinh(base, f) {
  const d = JSON.parse(readFileSync(f, 'utf8')); const dung = new Set(d.dung); const host = new URL(base).host;
  const dir = new URL(`../the7-child/dt-the7-child/gon/${host}/`, import.meta.url).pathname; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const { request } = createRequire(import.meta.url)('playwright'); const rq = await request.newContext(); const bang = {}; let t0 = 0, t1 = 0, bien = null, gom = '';
  for (const h of [...new Set([...d.tep, ...THEM])]) {
    if (KHONG_LOC.test(h) || !/\.css$/.test(h)) continue;
    const r = await rq.get(base + h); if (!r.ok()) { console.log('bỏ (HTTP', r.status() + ')', h); continue; }
    const goc = await r.body(); if (BIEN.test(h)) { bien = [h, goc]; continue; } const css = doiUrl(loc(goc.toString('utf8'), dung), h); gom += css;
    const ten = h.replace(/^\/wp-(content|includes)\//, '').replace(/[^\w.-]+/g, '_');
    writeFileSync(dir + ten, css); bang[h] = { tep: ten, md5: createHash('md5').update(goc).digest('hex'), kb: +(goc.length / 1024).toFixed(1), kb_gon: +(css.length / 1024).toFixed(1) };
    t0 += goc.length; t1 += css.length; console.log(h, bang[h].kb, '→', bang[h].kb_gon, 'KB');
  }
  if (bien) { // biến: giữ biến được nhắc tới ở CSS gọn + velis.css + HTML / JS của các trang mẫu (site thật, công khai) – bắc cầu qua giá trị biến
    gom += readFileSync(new URL('../the7-child/dt-the7-child/velis.css', import.meta.url), 'utf8');
    for (const u of TRANG_BIEN) { const r = await rq.get('https://velisrealty.vn' + u); const html = await r.text(); gom += html;
      for (const js of [...html.matchAll(/<script[^>]+src=["'](https:\/\/velisrealty\.vn\/[^"']+\.js)[^"']*["']/g)].map((x) => x[1])) if (!daJs.has(js)) { daJs.add(js); gom += await (await rq.get(js)).text(); } }
    const [h, goc] = bien; const css = locBien(goc.toString('utf8'), gom); const ten = h.replace(/^\/wp-(content|includes)\//, '').replace(/[^\w.-]+/g, '_');
    writeFileSync(dir + ten, css); bang[h] = { tep: ten, md5: createHash('md5').update(goc).digest('hex'), kb: +(goc.length / 1024).toFixed(1), kb_gon: +(css.length / 1024).toFixed(1) };
    t0 += goc.length; t1 += css.length; console.log(h, bang[h].kb, '→', bang[h].kb_gon, 'KB');
  }
  writeFileSync(dir + 'bang.json', JSON.stringify(bang, null, 1));
  console.log('TỔNG', (t0 / 1024).toFixed(0), '→', (t1 / 1024).toFixed(0), 'KB ·', dir);
}

const [lenh, ...a] = process.argv.slice(2);
if (lenh === '--test') {
  const css = '@charset "x";/*c{}*/a:hover,.b::before{color:red}@media (max-width:9px){.c>:first-child{x:1}.dd{y:"}"}}@font-face{src:url(f.woff)}@keyframes k{0%{a:1}}.e:not(.f){z:1}.is-ios .q{a:1}:root{--a:1}.g[data-x="a,b"]{b:1}.pswp__bg{c:1}';
  assert(tach(css).length === 10, 'tach'); assert(rong('.is-safari .x.act > a:hover') === '.x > a' && rong('.act > a') === '* > a' || console.log(rong('.act > a')), 'tt'); assert(rong('a:hover') === 'a' && rong('.c>:first-child') === '.c> *' && rong('.e:not(.f, .g)') === '.e' && rong('::selection') === '*', 'rong ' + rong('.c>:first-child'));
  assert(JSON.stringify(tachChon('.g[data-x="a,b"], .h:is(.i,.j)')) === '[".g[data-x=\\"a,b\\"]",".h:is(.i,.j)"]', 'tachChon');
  const o = loc(css, new Set(['.b', '.c> *', '.q'])); assert(loc('.btn-align-right{text-align:right}.vc_align_right{x:1}.khac{y:1}', new Set()) === '.btn-align-right{text-align:right}.vc_align_right{x:1}', 'GIU tuy chon');
  assert(o === '@charset "x";a:hover,.b::before{color:red}@media (max-width:9px){.c>:first-child{x:1}}@font-face{src:url(f.woff)}@keyframes k{0%{a:1}}.is-ios .q{a:1}:root{--a:1}.pswp__bg{c:1}', 'loc ' + o);
  assert(doiUrl('a{b:url(../i/x.png?v=1)}c{d:url("data:x")}', '/wp-content/themes/t/css/m.css') === 'a{b:url("/wp-content/themes/t/i/x.png?v=1")}c{d:url("data:x")}', 'doiUrl');
  const lb = locBien(':root{--a:1;--b:var(--c);--c:2;--d:3}@media (x){:root{--d:4;--e:5}}', '.x{color:var(--b)} el.style.setProperty("--e",1)');
  assert(lb === ':root{--b:var(--c);--c:2}@media (x){:root{--e:5}}', 'locBien ' + lb);
  console.log('test ok');
} else if (lenh === '--quet') await quet(...a); else if (lenh === '--sinh') await sinh(...a);
else console.log('dùng: --quet <base> <dung.json> | --sinh <base> <dung.json> | --test');
function assert(c, m) { if (!c) { console.error('LỖI', m); process.exit(1); } }
