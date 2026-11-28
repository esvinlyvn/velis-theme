// Bước 13 (2026-11-13) – đo phần cuối trang trên staging (khách xem, mật khẩu xem ở VIEW_PASSWORD_FILE, Chrome UA thật):
// (a) khoảng trống từ khối nội dung cuối tới khối liên hệ cuối / footer ≤ 96 px (đệm nền của section rộng hết khung tính là trống);
// (b) 0 link gạch chân trong footer; (c) vùng bấm ≥ 44 × 44 cho link / nút ở khối liên hệ cuối + footer (trừ link nằm giữa câu);
// (d) tương phản chữ footer ≥ 4,5:1 (chữ lớn ≥ 3:1); (e) mỗi trang tối đa 1 form tư vấn đang hiện;
// (f) cuộn tới đáy: nút lên đầu trang không đè chữ của footer / dòng dưới cùng.
// Dùng: node tools/the7_check_footer.mjs out.json      node tools/the7_check_footer.mjs --test
import { createRequire } from 'node:module'; import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const B = 'https://staging.velisrealty.vn';
const UA = { d: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
  m: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' };
const PAGES = ['/', '/du-an/', '/chu-dau-tu/', '/du-an/vinhomes/', '/can-ho-the-prive/', '/spring-ville/',
  '/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/', '/blog/', '/gioi-thieu/', '/tuyen-dung/', '/lien-he/', '/?s=the+prive', '/trang-khong-ton-tai-velis/'];
const WIDTHS = [390, 768, 1024, 1366, 1536, 1920];
export const MAX_GAP = 96;

// Chạy trong trang (đã cuộn tới đáy). Trả về số đo thô; judge() chấm.
export function measure() {
  const vis = e => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return [0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]), m[3] ?? 1]; };
  const bgOf = e => { for (let x = e; x; x = x.parentElement) { const c = getComputedStyle(x).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && lum(c)[1] > 0.5) return c; } return 'rgb(255, 255, 255)'; };
  const ratio = (a, b) => { const [x] = lum(a), [y] = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const end = document.querySelector('.velis-prefoot-wrap') || document.querySelector('#footer'); const endTop = end.getBoundingClientRect().top + scrollY;
  // (a) khối nội dung cuối: phần tử thấy được có chữ / ảnh / khung riêng (nền, viền, bóng) – nền tràn hết khung nhìn (≥ 98 %) không tính
  let last = 0, lastEl = '';
  for (const e of document.querySelectorAll('#main *')) {
    if (!vis(e)) continue; const r = e.getBoundingClientRect(), s = getComputedStyle(e), bot = r.bottom + scrollY; if (bot > endTop + 1 || bot <= last) continue;
    const own = e.matches('img, iframe, video, svg, input, button, select, textarea, hr') || [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
      || ((!/rgba\(0, 0, 0, 0\)/.test(s.backgroundColor) || s.boxShadow !== 'none' || parseFloat(s.borderBottomWidth) > 0) && r.width < innerWidth * 0.98);
    if (own) { last = bot; lastEl = e.tagName.toLowerCase() + '.' + [...e.classList].slice(0, 2).join('.'); }
  }
  const zone = [...document.querySelectorAll('#footer, .velis-prefoot-wrap')];
  const inZone = sel => zone.flatMap(z => [...z.querySelectorAll(sel)]).filter(vis);
  const underline = inZone('a').filter(a => !a.closest('.velis-prefoot-wrap') && getComputedStyle(a).textDecorationLine.includes('underline')).map(a => a.textContent.trim().slice(0, 30));
  const inSentence = a => getComputedStyle(a).display === 'inline' && [...a.parentElement.childNodes].some(n => n !== a && (n.nodeType === 3 ? n.textContent.trim() : n.tagName !== 'BR'));
  const small = inZone('a, button, input[type=submit], [role=button]').filter(a => !inSentence(a)).map(a => { const r = a.getBoundingClientRect(); return { t: (a.textContent || a.value || a.getAttribute('aria-label') || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter(x => x.w < 44 || x.h < 43.5);
  const lowContrast = [];
  for (const z of document.querySelectorAll('#footer')) { const tw = document.createTreeWalker(z, NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())) { const e = n.parentElement; if (!n.textContent.trim() || !vis(e) || e.closest('.screen-reader-text, select, .menu-select')) continue;
      const s = getComputedStyle(e), big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700); const cr = ratio(s.color, bgOf(e));
      if (cr < (big ? 3 : 4.5)) lowContrast.push({ t: n.textContent.trim().slice(0, 30), cr: +cr.toFixed(2) }); } }
  const forms = [...document.querySelectorAll('.wpcf7 form')].filter(vis).length;
  // (f) nút lên đầu trang (khi đang hiện) đè dòng chữ nào của footer
  const st = document.querySelector('.scroll-top'); let overlap = [];
  if (st && vis(st)) { const b = st.getBoundingClientRect(); const tw = document.createTreeWalker(document.querySelector('#footer'), NodeFilter.SHOW_TEXT); let n;
    while ((n = tw.nextNode())) { if (!n.textContent.trim() || !vis(n.parentElement)) continue; const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) if (r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top) { overlap.push(n.textContent.trim().slice(0, 30)); break; } } }
  return { gap: Math.round(endTop - last), lastEl, prefoot: !!document.querySelector('.velis-prefoot-wrap'), underline, small, lowContrast, forms, overlap };
}

export function judge(m) {
  const bad = [];
  if (m.gap > MAX_GAP) bad.push(`trống ${m.gap} px > ${MAX_GAP} (sau ${m.lastEl})`);
  if (m.underline.length) bad.push(`gạch chân: ${m.underline.join(', ')}`);
  for (const s of m.small) bad.push(`vùng bấm ${s.w}×${s.h}: ${s.t}`);
  for (const c of m.lowContrast) bad.push(`tương phản ${c.cr}: ${c.t}`);
  if (m.forms > 1) bad.push(`${m.forms} form tư vấn`);
  for (const t of m.overlap) bad.push(`nút lên đầu đè: ${t}`);
  return bad;
}

async function selfTest() {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1200, height: 800 } })).newPage();
  await p.setContent(`<style>body{margin:0;font:16px Arial}#main{padding-bottom:150px}#footer{background:#141414;color:#B9B9B9;padding:20px}
    .bad{color:#444}#footer a{color:#ddd;text-decoration:none}#footer u a{text-decoration:underline}.scroll-top{position:fixed;right:0;bottom:0;width:44px;height:44px;background:red}</style>
    <div id="main"><p>Khối cuối</p><div class="wpcf7"><form><input></form></div></div>
    <footer id="footer"><a href="#" style="display:block;height:44px">Đủ</a><u><a href="#" style="display:inline-block;height:20px">Nhỏ</a></u>
      <p>Gọi <a href="#">0911</a> ngay</p><p class="bad">Mờ</p><div class="wpcf7"><form><input></form></div>
      <p style="position:fixed;right:0;bottom:10px;margin:0">Bị đè</p></footer><a class="scroll-top" href="#"></a>`);
  const m = await p.evaluate(measure); const bad = judge(m); await b.close();
  const want = ['trống', 'gạch chân: Nhỏ', 'vùng bấm', 'tương phản', '2 form', 'nút lên đầu đè: Bị đè'];
  const ok = want.every(w => bad.some(x => x.includes(w))) && !bad.some(x => x.includes('0911') || x.includes('Đủ'));
  console.assert(ok, 'self-test', bad); if (!ok) { console.log(JSON.stringify({ m, bad }, null, 1)); process.exit(1); }
  console.log('self-test ok');
}

if (process.argv[2] === '--test') await selfTest();
else if (process.argv[2]) {
  const out = process.argv[2]; const res = {}; let n = 0;
  const b = await chromium.launch(); const c0 = await b.newContext(); const lp = await c0.newPage(); await lp.goto(B + '/', { timeout: 120000 });
  if (await lp.$('input[type=password]')) { await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]); }
  const st = await c0.storageState(); await c0.close();
  for (const w of WIDTHS) {
    const mob = w < 1024; const c = await b.newContext({ viewport: { width: w, height: mob ? 844 : 900 }, storageState: st, userAgent: mob ? UA.m : UA.d, isMobile: mob, hasTouch: mob }); const p = await c.newPage();
    for (const u of PAGES) {
      await p.goto(B + u, { timeout: 180000, waitUntil: 'load' });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, document.body.scrollHeight); });
      await p.waitForTimeout(900);
      const m = await p.evaluate(measure), bad = judge(m); res[`${u} @${w}`] = { ...m, bad }; n += bad.length;
      console.log(w, u, 'trống', m.gap, 'khối cuối', m.prefoot ? 'có' : '–', 'form', m.forms, bad.length ? 'LỖI ' + bad.slice(0, 3).join(' | ') : 'ok');
    }
    await c.close();
  }
  writeFileSync(out, JSON.stringify(res, null, 1)); await b.close(); console.log('TỔNG lỗi', n);
}
