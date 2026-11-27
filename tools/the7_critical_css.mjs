// Critical CSS tự làm (2026-11-27, người dùng chốt – không phụ thuộc QUIC.cloud): với mỗi LOẠI TRANG, mở trang mẫu trên staging ở 412 (điện thoại)
// + 1366 + 1920, lấy mọi quy tắc CSS (của tệp CSS ngoài – khối <style> nội tuyến vốn đã nằm trong HTML) khớp phần tử nằm trong 1,5 màn đầu
// (và tổ tiên của chúng), giữ đúng thứ tự gốc + @media, @font-face của font đang dùng; đường dẫn url() đổi về dạng /wp-content/… (chạy cả 2 site).
// Ghi the7-child/dt-the7-child/critical/<loại>.css → theme con in nội tuyến vào <head>, CSS gộp còn lại tải bất đồng bộ (functions.php).
// SINH LẠI mỗi khi CSS đổi (velis.css / Theme Options / plugin): node tools/the7_critical_css.mjs [loại …]   (STAGING_VIEW_PASSWORD) – rồi đóng gói theme.
import { createRequire } from 'node:module'; import { writeFileSync, mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = 'https://staging.velisrealty.vn'; const DIR = new URL('../the7-child/dt-the7-child/critical/', import.meta.url).pathname;
export const LOAI = { 'trang-chu': ['/'], 'danh-sach': ['/du-an/', '/chu-dau-tu/'], 'du-an': ['/can-ho-the-prive/', '/du-an/gamuda-land/'], bai: ['/gia-ban-the-prive-quan-2-2026/'],
  'chuyen-muc': ['/blog/the-prive/', '/blog/'], trang: ['/gioi-thieu/', '/lien-he/', '/tuyen-dung/'] };
const KHO = [[412, 915, true], [1366, 768, false], [1920, 1080, false]];
const chon = process.argv.slice(2).filter((x) => LOAI[x]); mkdirSync(DIR, { recursive: true });
const b = await chromium.launch();
async function mo(w, h, m) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, deviceScaleFactor: m ? 2 : 1 }); const p = await ctx.newPage();
  await p.goto(B + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); }
  return { ctx, p };
}
for (const [loai, urls] of Object.entries(LOAI)) {
  if (chon.length && !chon.includes(loai)) continue;
  const giu = new Map(); let css = '';
  for (const u of urls) for (const [w, h, m] of KHO) {
    const { ctx, p } = await mo(w, h, m);
    await p.goto(B + u, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(1500);
    const ids = await p.evaluate(() => {
      const H = innerHeight * 1.5; const els = new Set([document.documentElement, document.body]);
      for (const e of document.body.querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (r.top < H && r.bottom > -1 && (r.width || r.height)) { let x = e; while (x && !els.has(x)) { els.add(x); x = x.parentElement; } } }
      for (const e of document.querySelectorAll('.dt-mobile-header, .dt-mobile-header *, .velis-cta-bar, .velis-cta-bar *, .velis-dong-y, .velis-dong-y *, .masthead, .masthead *')) els.add(e);
      // khung bố cục (con của #page / #main) dù nằm dưới màn đầu: thiếu grid-area / display của chúng thì chân trang lọt lên đầu (CLS 0,9 – 2026-11-27)
      for (const e of document.querySelectorAll('#page > *, #main > *, #main > * > *, #main .wf-container-main, #content, #sidebar, #footer, #footer > *, #bottom-bar, .velis-prefoot-wrap, .page-title, .page-title > *, .scroll-top')) els.add(e);
      const list = [...els]; const SACH = /::?(hover|focus-visible|focus-within|focus|active|visited|before|after|placeholder|selection|marker|first-letter|first-line|-webkit-[\w-]+|-moz-[\w-]+|-ms-[\w-]+)(\([^)]*\))?/g;
      const tach = (sel) => { const p = []; let d = 0, c = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { p.push(c); c = ''; } else c += ch; } p.push(c); return p; };
      const khop = (parts) => parts.map((s, j) => { let t = s.replace(SACH, '').trim(); if (!t || /[>+~]$/.test(t)) t = (t.replace(/[>+~]\s*$/, '').trim() || '*'); try { return list.some((e) => e.matches(t)) ? j : -1; } catch { return -1; } }).filter((j) => j >= 0);
      const dung = new Set([...els].map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()));
      const url = (t, base) => t.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, v) => { if (/^(data:|#)/.test(v)) return m; const a = new URL(v, base); return `url("${a.origin === location.origin ? a.pathname + a.search : a.href}")`; });
      const out = []; let n = 0;
      const di = (rules, media, base) => { for (const r of rules) { n++;
        if (r instanceof CSSStyleRule) { const parts = tach(r.selectorText); const k = r.selectorText.startsWith(':root') ? parts.map((x, i) => i) : khop(parts);
          if (k.length && r.style.cssText) out.push({ id: media + '{' + r.selectorText + '{' + r.style.cssText, media, parts, k, style: url(r.style.cssText, base), idx: n }); }
        else if (r instanceof CSSMediaRule) { if (!matchMedia(r.conditionText).matches && !/max-width|min-width/.test(r.conditionText)) continue; di(r.cssRules, (media ? media + ' and ' : '') + r.conditionText, base); }
        else if (r instanceof CSSSupportsRule) di(r.cssRules, media, base);
        else if (r instanceof CSSFontFaceRule) { if (dung.has(r.style.getPropertyValue('font-family').replace(/["']/g, '').trim())) out.push({ id: '@ff' + r.cssText, media: '', ff: url(r.cssText, base), idx: n }); } } };
      for (const sh of document.styleSheets) { if (!sh.href) continue; try { di(sh.cssRules, '', sh.href); } catch {} }
      return out;
    });
    for (const r of ids) { const c = giu.get(r.id); if (c) (r.k || []).forEach((j) => c.k.add(j)); else giu.set(r.id, { ...r, k: new Set(r.k || []) }); }
    console.log(loai, u, w, ids.length, 'quy tắc');
    await ctx.close();
  }
  // tuần tự hóa theo thứ tự gốc (idx của lần gặp đầu) – nhóm các quy tắc liền nhau cùng @media
  let cur = null;
  for (const r of [...giu.values()].sort((a, b) => a.idx - b.idx)) {
    const t = r.ff ? r.ff : r.parts.filter((x, i) => r.k.has(i)).join(',') + '{' + r.style + '}';
    if (r.media !== cur) { if (cur) css += '}'; if (r.media) css += '@media ' + r.media + '{'; cur = r.media || null; }
    css += t;
  }
  if (cur) css += '}';
  css = css.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').replace(/;\s+/g, ';').replace(/\{\s+/g, '{').replace(/\s+\}/g, '}').replace(/:\s+(?=[^{}]*[;}])/g, ':');
  writeFileSync(DIR + loai + '.css', '/* critical ' + loai + ' – sinh bằng tools/the7_critical_css.mjs, không sửa tay */\n' + css + '\n');
  console.log('→', loai + '.css', (css.length / 1024).toFixed(1), 'KB');
}
await b.close();
