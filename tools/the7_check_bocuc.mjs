// Đo HỆ BỐ CỤC + "unslop" (DESIGN.md "Hệ bố cục", "Làm bóng"; vòng sửa tổng 2026-11-25). CHỈ ĐỌC (GET bằng trình duyệt).
//   a mép: phần tử chữ / ảnh / nút trong cùng một cột: mép trái = mép cột ±1 px
//   b hẹp: phần tử chữ (p, h1–h4, ul/ol, bảng, trích) hẹp hơn cột chứa nó > 2 % (trừ nút, thẻ, ảnh nhỏ)
//   c tiêu đề: xuống dòng khi dòng 1 còn trống > 15 % cột và chữ đầu dòng 2 vừa chỗ trống
//   d 2 cột (≥ 1200, trang loại A): rãnh 48 ±2, cột trái bám mép trái khung, cột phải bám mép phải khung ±1
//   e danh sách bài: mép trên ảnh lệch mép trên nhãn / tiêu đề > 4 px
//   f "Xem thêm" đang hiện: máy tính (≥ 1024) phải 0, điện thoại ≤ 2; số form = 1
//   g đoạn văn > 90 ký tự / dòng      h <br> trong tiêu đề / nút / trích
//   + tràn ngang, số H1 (= 1)
//   unslop: nhãn chữ hoa / giãn chữ > 0,5 px; số cỡ chữ (≤ 7); số màu chữ (≤ 6); transition: all; khoảng cách không chia hết cho 4
// Dùng: node tools/the7_check_bocuc.mjs <base> <out.json> [widths=1366,1536,1920,390] [tên,...]   (staging: VIEW_PASSWORD_FILE)
//       node tools/the7_check_bocuc.mjs --test
import { createRequire } from 'node:module'; import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

export const PAGES = {
  'trang-chu': '/', 'du-an': '/du-an/', 'chu-dau-tu': '/chu-dau-tu/', 'cdt-gamuda-land': '/gamuda-land/',
  'the-prive': '/can-ho-the-prive/', 'spring-ville': '/spring-ville/', 'the-global-city': '/the-global-city/', 'persa-place': '/can-ho-persa-place/',
  'blog': '/blog/', 'cum-the-prive': '/blog/the-prive/', 'bai-dong-von': '/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/',
  'bai-gia-the-prive': '/gia-ban-the-prive-quan-2-2026/', 'gioi-thieu': '/gioi-thieu/', 'tuyen-dung': '/tuyen-dung/', 'lien-he': '/lien-he/', 'chinh-sach': '/chinh-sach-bao-mat/' };

// chạy trong trang
export function measure(W) {
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[hidden], .screen-reader-text, .assistive-text, .velis-thu .vc_toggle_content, .vc_toggle:not(.vc_toggle_active):not(.velis-more) .vc_toggle_content'); };
  const box = (e) => e.getBoundingClientRect();
  const SKIP = '#masthead, .masthead, .dt-mobile-header, #footer, #bottom-bar, .velis-cta-bar, .velis-prefoot-wrap, .scroll-top, .velis-feats, .blog-shortcode, .single-related-posts, .velis-cta, .velis-aside-card, .velis-cta-box, .velis-boxes, .velis-devs, .velis-logos, .velis-stats, .velis-values, .vc_toggle_title, .velis-facts, .velis-specs, .velis-home-hero, #ez-toc-container, .ez-toc-widget-container, nav, form, .widget, .post-meta, .velis-post-list, .velis-dark, .paginator, .velis-chips, .dt-breadcrumbs-shortcode';
  // cột = khung nội dung gần nhất
  const colOf = (e) => e.parentElement.closest((e.matches('.wpb_text_column') ? '' : '.wpb_text_column > .wpb_wrapper, ') + '.vc_column-inner > .wpb_wrapper, .vc_toggle_content, .entry-content, #content, .page-title .wf-wrap');
  const cbox = (c) => { const r = box(c); const s = getComputedStyle(c); return { l: r.left + parseFloat(s.paddingLeft), r: r.right - parseFloat(s.paddingRight) }; };
  // cột chứa = khung nội dung; nếu khung là lưới nhiều cột (phần đầu dự án 8/12 + 4/12): cột = các rãnh lưới phần tử phủ lên
  const bounds = (c, e) => { const b0 = cbox(c); const s = getComputedStyle(c); const t = s.display === 'grid' ? s.gridTemplateColumns.split(' ').map(parseFloat).filter(x => x > 0) : [];
    if (t.length < 2) return b0; const g = parseFloat(s.columnGap) || 0; const lines = []; let x = b0.l; for (const w of t) { lines.push([x, x + w]); x += w + g; }
    const r = box(e); const st = lines.filter(L => r.left >= L[0] - 2).pop() || lines[0]; const en = lines.find(L => r.right <= L[1] + 2) || lines[lines.length - 1]; return { l: st[0], r: en[1] }; };
  const out = { a: [], b: [], c: [], d: [], e: [], f: {}, g: [], h: 0, overflow: 0, h1: 0 };
  const label = (e) => (e.tagName + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : '') + ' "' + (e.textContent || '').trim().slice(0, 40) + '"');
  const main = document.querySelector('#main') || document.body;
  // a + b
  for (const e of main.querySelectorAll('h1, h2, h3, h4, p, ul, ol, table, blockquote, .wpb_text_column, .wpb_single_image, .dt-btn, .dt-breadcrumbs-shortcode, .page-title .breadcrumbs')) {
    if (!vis(e) || e.closest(SKIP.replace(', .dt-breadcrumbs-shortcode', '')) && !e.matches('.dt-breadcrumbs-shortcode')) continue;
    if (e.closest('li, td, th, blockquote') && !e.matches('ul, ol, table, blockquote')) continue;
    if (e.matches('ul ul, ol ol, ul ol, ol ul, p:empty')) continue;
    const c = colOf(e); if (!c || !vis(c) || parseInt(getComputedStyle(c).columnCount) > 1) continue; // cột chữ đôi (velis-cot2): mép theo từng cột chữ
    const cb = bounds(c, e); const r = box(e); const cw = cb.r - cb.l; if (cw < 200) continue;
    const ml = parseFloat(getComputedStyle(e).marginLeft) || 0;
    const L = e.matches('ul, ol') ? r.left : r.left - Math.max(0, ml);
    if (Math.abs(L - cb.l) > 1 && !e.matches('.dt-btn') ) out.a.push(`${label(e)} lệch ${Math.round(L - cb.l)} px`);
    if (e.matches('.dt-btn') && Math.abs(r.left - cb.l) > 1 && getComputedStyle(e.parentElement).textAlign !== 'center') out.a.push(`${label(e)} lệch ${Math.round(r.left - cb.l)} px`);
    const textual = e.matches('h1, h2, h3, h4, p, ul, ol, table, blockquote, .wpb_text_column');
    if (textual && !e.matches('.breadcrumbs, nav *') && (cw - r.width) / cw > 0.02 && !(e.matches('table') && r.width >= cw - 2)) out.b.push(`${label(e)} ${Math.round(r.width)}/${Math.round(cw)} px`);
  }
  // c: tiêu đề xuống dòng khi còn chỗ
  for (const h of main.querySelectorAll('h1, h2, h3')) {
    if (!vis(h) || h.closest('.blog-shortcode, .single-related-posts, .velis-feats, .widget, #footer')) continue;
    const rg = document.createRange(); rg.selectNodeContents(h); const rects = [...rg.getClientRects()].filter(x => x.width > 1);
    const lines = []; for (const x of rects) { const l = lines.find(y => Math.abs(y.top - x.top) < 4); if (l) { l.left = Math.min(l.left, x.left); l.right = Math.max(l.right, x.right); } else lines.push({ top: x.top, left: x.left, right: x.right }); }
    if (lines.length < 2) continue; lines.sort((p, q) => p.top - q.top);
    const hb = box(h); const s = getComputedStyle(h); const W0 = hb.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    const free = hb.left + parseFloat(s.paddingLeft) + W0 - lines[0].right;
    // chữ đầu dòng 2 đo trên chữ thật: ký tự đầu tiên nằm dưới dòng 1 → tới khoảng trắng thường kế tiếp (nbsp giữ chữ dính nhau)
    const tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT); const ch = []; let nd; while ((nd = tw.nextNode())) for (let i = 0; i < nd.length; i++) ch.push([nd, i]);
    const rr = document.createRange(); const rc = ([n, i]) => { rr.setStart(n, i); rr.setEnd(n, i + 1); return rr.getBoundingClientRect(); };
    let k = ch.findIndex(c => !/[ \t\n]/.test(c[0].data[c[1]]) && rc(c).top > lines[0].top + 4);
    let w2 = 0; if (k >= 0) { const x0 = rc(ch[k]).left; let x1 = x0; while (k < ch.length && !/[ \t\n]/.test(ch[k][0].data[ch[k][1]])) { x1 = Math.max(x1, rc(ch[k]).right); k++; } const cv = document.createElement('canvas').getContext('2d'); cv.font = s.font; w2 = x1 - x0 + cv.measureText(' ').width; }
    if (free / W0 > 0.15 && w2 && w2 < free - 1) out.c.push(`${label(h)} dòng 1 trống ${Math.round(free)} px / ${Math.round(W0)} (chữ sau ${Math.round(w2)} px)`);
  }
  // d: 2 cột
  const side = document.querySelector('#sidebar:not(.solid-bg-none) , #sidebar') ; const aside = document.querySelector('.velis-aside');
  if (W >= 1200) {
    const wrap = document.querySelector('#main > .wf-wrap') || document.querySelector('#main .wf-wrap');
    const wb = wrap && cbox(wrap);
    let L, R;
    if (side && vis(side)) { L = box(document.querySelector('#content')); R = box(side); }
    else if (aside && vis(aside)) { const m = aside.parentElement.querySelector('.velis-main > .vc_column-inner'); const ai = aside.querySelector(':scope > .vc_column-inner'); if (m && ai) { L = cbox(m); L = { left: L.l, right: L.r }; const a2 = cbox(ai); R = { left: a2.l, right: a2.r }; } }
    if (L && R && wb) {
      const gap = R.left - L.right;
      if (Math.abs(gap - 48) > 2) out.d.push(`rãnh ${Math.round(gap)} px`);
      if (Math.abs(L.left - wb.l) > 1) out.d.push(`cột trái lệch khung ${Math.round(L.left - wb.l)} px`);
      if (Math.abs(R.right - wb.r) > 1) out.d.push(`cột phải lệch khung ${Math.round(R.right - wb.r)} px`);
      out.cot = { trai: Math.round(L.right - L.left), phai: Math.round(R.right - R.left), ranh: Math.round(gap) };
    } else out.cot = null;
  }
  // e: danh sách bài
  for (const art of document.querySelectorAll('#content .blog-shortcode article.post, #content .articles-list article')) {
    if (!vis(art) || art.closest('.velis-feats')) continue; const img = art.querySelector('.post-thumbnail img, .post-thumbnail'); const t = art.querySelector('.entry-meta .category-link, .entry-title');
    if (!img || !t || !vis(img)) continue; const ti = [...art.querySelectorAll('.entry-meta, .entry-title')].filter(vis).map(x => box(x).top);
    const d = Math.min(...ti) - box(img).top; if (Math.abs(d) > 4 && box(img).right <= box(t).left) out.e.push(`"${art.querySelector('.entry-title')?.textContent.trim().slice(0, 30)}" lệch ${Math.round(d)} px`);
  }
  // trang sản phẩm (phần tử Velis): Widgetised Sidebar trong nội dung = 0; ô Thông tin dự án cùng hàng cùng mép trên ±1; chữ ↔ minh họa mép trên ±4 (≥ 1200)
  out.sp = [];
  out.sp.push(...[...document.querySelectorAll('.wpb-content-wrapper .wpb_widgetised_column')].map(() => 'Widgetised Sidebar trong nội dung'));
  for (const g of document.querySelectorAll('.velis-thong-tin')) { const rows = {}; for (const o of g.children) { const t = box(o).top; const k = Object.keys(rows).find(x => Math.abs(x - t) < 12) ?? t; (rows[k] ??= []).push(t); }
    for (const v of Object.values(rows)) if (Math.max(...v) - Math.min(...v) > 1) out.sp.push('Thông tin dự án: ô cùng hàng lệch ' + Math.round(Math.max(...v) - Math.min(...v)) + ' px'); }
  if (W >= 1200) for (const k of document.querySelectorAll('.velis-khoi')) { const c = k.querySelector('.velis-khoi__chu'), m = k.querySelector('.velis-khoi__minh-hoa'); if (c && m && vis(m) && Math.abs(box(c).top - box(m).top) > 4) out.sp.push(`Khối "${k.querySelector('.velis-khoi__tieu-de')?.textContent.slice(0, 30)}": chữ / minh họa lệch ${Math.round(box(m).top - box(c).top)} px`); }
  // f
  out.f.xemThem = [...document.querySelectorAll('.velis-more .vc_toggle_title, .velis-clamp-btn, .velis-xem-them')].filter(vis).length;
  out.f.form = [...document.querySelectorAll('form.wpcf7-form')].filter(vis).length;
  // g: ký tự / dòng
  for (const p of main.querySelectorAll('p')) {
    if (!vis(p) || p.closest('#footer, .widget, .velis-aside-card, .blog-shortcode')) continue;
    const s = getComputedStyle(p); const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.5; const n = Math.round(box(p).height / lh);
    const len = p.textContent.trim().length; if (n >= 3 && len / n > 90) out.g.push(`${label(p)} ${Math.round(len / n)} ký tự/dòng`);
  }
  out.h = document.querySelectorAll(':is(h1, h2, h3, h4, h5, h6, .dt-btn, button, blockquote, .velis-quote) br').length;
  out.overflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
  out.h1 = [...document.querySelectorAll('h1')].filter(vis).length;
  // unslop
  const own = [...document.querySelectorAll('body *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && vis(e) && !e.closest('script, style, .screen-reader-text, svg'));
  const up = own.filter(e => { const s = getComputedStyle(e); return s.textTransform === 'uppercase' || parseFloat(s.letterSpacing) > 0.5; });
  out.chuHoa = up.length; out.chuHoaVd = [...new Set(up.map(label))].slice(0, 8);
  out.coChu = [...new Set(own.map(e => getComputedStyle(e).fontSize))].sort((p, q) => parseFloat(p) - parseFloat(q));
  out.mauChu = [...new Set(own.map(e => getComputedStyle(e).color))];
  out.transitionAll = [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); return /(^|,\s*)all\b/.test(s.transitionProperty) && s.transitionDuration.split(',').some(d => parseFloat(d) > 0); }).length;
  const odd = new Set(); let oddN = 0;
  const oddVd = {};
  for (const e of document.querySelectorAll('#main *, .velis-prefoot-wrap *, .masthead *, #footer *, #bottom-bar *')) { if (!vis(e)) continue; const s = getComputedStyle(e); let bad = false;
    const stretch = e.matches('[data-vc-full-width]'); // căn giữa chính xác: hàng tràn nền (WPBakery tính đệm = (màn − khung) / 2)
    for (const k of ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'rowGap', 'columnGap']) { if (stretch && /Left|Right/.test(k)) continue; const v = parseFloat(s[k]); if (v > 0 && Math.abs(v - Math.round(v / 4) * 4) > 0.5) { const vv = Math.round(v * 10) / 10; odd.add(vv); bad = true; (oddVd[vv] ??= new Set()).add(e.tagName + '.' + (e.className.toString().split(' ')[0] || '') + ':' + k); } }
    oddN += bad; }
  out.khoangLe = oddN; out.khoangLeGiaTri = [...odd].sort((p, q) => p - q).slice(0, 20); out.khoangLeVd = Object.fromEntries(Object.entries(oddVd).map(([k, v]) => [k, [...v].slice(0, 4)]));
  // nền khối liền nhau (trang loại B): hàng / section cấp cao tràn nền cùng màu nền liền nhau
  const nen = (e) => { let x = e; while (x && x !== document.body) { const c = getComputedStyle(x).backgroundColor; if (c !== 'rgba(0, 0, 0, 0)') return c; x = x.parentElement; } return 'rgb(255, 255, 255)'; };
  const khoi = [...document.querySelectorAll('.wpb-content-wrapper > :is(.vc_row, .vc_section), #page > .velis-prefoot-wrap, #footer')].filter(x => vis(x) && !x.matches('.vc_row-full-width'));
  out.nenLien = []; if (!document.querySelector('#sidebar, .velis-body')) for (let i = 1; i < khoi.length; i++) { const a2 = nen(khoi[i - 1]), b2 = nen(khoi[i]); if (a2 === b2 && !khoi[i].matches('.velis-body, .velis-cta') && !khoi[i - 1].matches('.velis-body')) out.nenLien.push(`${khoi[i - 1].id || khoi[i - 1].className.toString().split(' ').slice(0, 2).join('.')} + ${khoi[i].id || khoi[i].className.toString().split(' ').slice(0, 2).join('.')} (${b2})`); }
  return out;
}

async function run(base, outFile, widths, only) {
  const b = await chromium.launch(); const res = {};
  for (const w of widths) {
    const mob = w < 768;
    const c = await b.newContext({ viewport: { width: w, height: mob ? 844 : 1000 }, isMobile: mob, hasTouch: mob, userAgent: mob ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36' });
    const p = await c.newPage();
    if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
    for (const [k, u] of Object.entries(PAGES)) { if (only && !only.includes(k)) continue;
      await p.goto(base + u, { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {});
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(500);
      (res[k] ??= {})[w] = await p.evaluate(measure, w);
    }
    await c.close();
  }
  await b.close(); writeFileSync(outFile, JSON.stringify(res, null, 1));
  // tóm tắt
  const sum = {}; let loi = 0;
  for (const [k, ws] of Object.entries(res)) for (const [w, m] of Object.entries(ws)) {
    const n = { sp: (m.sp || []).length, nen: (m.nenLien || []).length, a: m.a.length, b: m.b.length, c: m.c.length, d: m.d.length, e: m.e.length, f: (+w >= 1024 ? m.f.xemThem : Math.max(0, m.f.xemThem - 2)) + (m.f.form !== 1 ? 1 : 0), g: m.g.length, h: m.h, tran: m.overflow > 0 ? 1 : 0, h1: m.h1 !== 1 ? 1 : 0 };
    loi += Object.values(n).reduce((x, y) => x + y, 0);
    for (const [kk, v] of Object.entries(n)) sum[kk] = (sum[kk] || 0) + v;
    console.log(`${k.padEnd(18)} ${String(w).padStart(4)}  sp${n.sp} nền${n.nen} a${n.a} b${n.b} c${n.c} d${n.d} e${n.e} f${n.f}(xem thêm ${m.f.xemThem}, form ${m.f.form}) g${n.g} h${n.h} tràn${m.overflow} h1=${m.h1} | hoa ${m.chuHoa} · cỡ ${m.coChu.length} · màu ${m.mauChu.length} · tr-all ${m.transitionAll} · lẻ4 ${m.khoangLe}${m.cot ? ` · cột ${m.cot.trai}|${m.cot.ranh}|${m.cot.phai}` : ''}`);
  }
  console.log('TỔNG', JSON.stringify(sum), 'lỗi bố cục:', loi);
}

const ok = (c, ...m) => { if (!c) { console.error('FAIL', ...m); process.exitCode = 1; } };
async function test() {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.setContent(`<style>body{margin:0;font:18px/30px Arial} .wf-wrap{width:1200px;margin:0 auto;padding:0 50px;box-sizing:content-box;display:flex;gap:48px} #content{width:768px} #sidebar{width:384px}
    .narrow{max-width:400px} .lab{text-transform:uppercase;letter-spacing:2px;font-size:13px} .t{transition:all .2s} .m{margin-top:15px}</style>
    <div id="main"><div class="wf-wrap"><div id="content"><div class="entry-content"><h1>Tiêu đề</h1><p>Đoạn đủ rộng ${'chữ '.repeat(60)}</p><p class="narrow">Đoạn bị bóp ${'chữ '.repeat(10)}</p>
    <h2>Ngắn<br>xuống dòng</h2><p class="lab t m">Nhãn</p><div class="vc_toggle velis-more"><div class="vc_toggle_title">Xem thêm</div></div></div></div><aside id="sidebar">x</aside></div></div>`);
  const m = await p.evaluate(measure, 1400);
  ok(m.b.length === 1 && m.b[0].includes('Đoạn bị bóp'), 'b', m.b);
  ok(m.h === 1, 'h', m.h); ok(m.h1 === 1, 'h1');
  ok(m.chuHoa >= 1 && m.transitionAll >= 1 && m.khoangLe >= 1, 'unslop', m.chuHoa, m.transitionAll, m.khoangLe);
  ok(m.f.xemThem === 1, 'f', m.f);
  ok(m.d.length === 0 && m.cot && m.cot.ranh === 48, 'd', m.d, m.cot);
  // rãnh sai
  await p.addStyleTag({ content: '.wf-wrap{gap:72px}' }); const m2 = await p.evaluate(measure, 1400);
  ok(m2.d.some(x => x.startsWith('rãnh')), 'd2', m2.d);
  await b.close(); console.log(process.exitCode ? 'test: TRƯỢT' : 'test: OK');
}

const a = process.argv[1] && import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1]).href ? process.argv.slice(2) : null; // null: được import (lấy PAGES)
if (!a) ;
else if (a[0] === '--test') await test();
else if (a.length >= 2) await run(a[0].replace(/\/$/, ''), a[1], (a[2] || '1366,1536,1920,390').split(',').map(Number), a[3]?.split(','));
else console.log('Dùng: node tools/the7_check_bocuc.mjs <base> <out.json> [widths] [tên,...] | --test');
