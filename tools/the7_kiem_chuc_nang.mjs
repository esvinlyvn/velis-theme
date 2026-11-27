// Kiểm chức năng sau khi đổi CSS (2026-11-27): menu điện thoại mở + menu con, menu thả xuống máy tính khi rê chuột, Hỏi đáp mở/đóng,
// lọc /du-an/ đổi số thẻ hiện, form CF7 bấm gửi trống hiện lỗi từng ô (CHỈ staging), hộp đồng ý cookie hiện. Cửa sổ ảnh: tools/the7_kiem_anh_popup.mjs.
// Dùng: node tools/the7_kiem_chuc_nang.mjs <base>   (staging: STAGING_VIEW_PASSWORD) – in bảng, thoát 1 nếu có mục trượt.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2]; const b = await chromium.launch(); const kq = [];
const mo = async (w, m) => { const ctx = await b.newContext({ viewport: { width: w, height: m ? 915 : 900 }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  return p; };
const ghi = (ten, ok, ct) => kq.push(`| ${ten} | ${ok ? 'đạt' : 'TRƯỢT'} | ${ct} |`);
let p = await mo(412, true);
await p.goto(base + '/'); await p.waitForTimeout(1000);
ghi('Hộp đồng ý cookie hiện (chưa chọn)', await p.locator('.velis-dong-y').isVisible(), '');
await p.locator('.dt-mobile-menu-icon').first().click(); await p.waitForTimeout(800);
const mm = await p.locator('.mobile-main-nav > li > a').evaluateAll((as) => as.filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth; }).length);
ghi('Menu điện thoại mở', mm > 2, mm + ' mục hiện trong khung');
const nl = p.locator('.mobile-main-nav .next-level-button').first();
if (await nl.count()) { await nl.click(); await p.waitForTimeout(600); const sub = await p.locator('.mobile-main-nav .sub-nav').first().evaluate((e) => e.getBoundingClientRect().height); ghi('Menu con điện thoại mở', sub > 20, 'cao ' + Math.round(sub)); }
await p.goto(base + '/can-ho-the-prive/'); await p.waitForTimeout(800);
const d = p.locator('.velis-hoi-dap__muc').first();
if (await d.count()) { const h0 = await d.evaluate((e) => e.getBoundingClientRect().height); await d.locator('summary').click(); await p.waitForTimeout(300); const h1 = await d.evaluate((e) => e.getBoundingClientRect().height); ghi('Hỏi đáp mở', h1 > h0 + 10 && await d.evaluate((e) => e.open), `cao ${Math.round(h0)} → ${Math.round(h1)}`); } else ghi('Hỏi đáp mở', false, 'không thấy .velis-hoi-dap__muc');
p = await mo(1366, false);
await p.goto(base + '/'); await p.waitForTimeout(800);
const li = p.locator('#primary-menu > li.has-children, .main-nav > li.has-children').first();
if (await li.count()) { await li.hover(); await p.waitForTimeout(700); const v = await li.locator('.sub-nav').first().evaluate((e) => { const s = getComputedStyle(e); return s.visibility !== 'hidden' && +s.opacity > 0.5 && e.getBoundingClientRect().height > 20; }); ghi('Menu thả xuống máy tính', v, ''); }
await p.goto(base + '/du-an/'); await p.waitForTimeout(1500);
const dem = () => p.locator('.wf-cell').evaluateAll((cs) => cs.filter((c) => c.getBoundingClientRect().height > 0 && getComputedStyle(c).opacity !== '0' && getComputedStyle(c).display !== 'none').length);
const n0 = await dem(); const nut = p.locator('.filter-categories a:not(.show-all)').first();
if (await nut.count()) { await nut.click(); await p.waitForTimeout(1500); const n1 = await dem(); ghi('Lọc /du-an/', n1 > 0 && n1 < n0, `${n0} → ${n1} thẻ (${(await nut.innerText()).trim()})`); }
if (base.includes('staging.')) { await p.goto(base + '/lien-he/'); await p.waitForTimeout(800); const f = p.locator('.wpcf7 form').first(); await f.locator('[type=submit]').click(); await p.waitForTimeout(2500);
  const tip = await f.locator('.wpcf7-not-valid-tip').evaluateAll((t) => t.filter((x) => x.getBoundingClientRect().height > 0).length); ghi('Form CF7 báo lỗi ô trống', tip > 0, tip + ' lỗi hiện'); }
await b.close();
console.log('| Chức năng | Kết quả | Chi tiết |\n|---|---|---|\n' + kq.join('\n')); if (kq.some((x) => x.includes('TRƯỢT'))) process.exitCode = 1;
