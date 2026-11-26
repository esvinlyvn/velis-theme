// Chụp màn hình đầu lúc vừa tải (~1 s, sau khi có nội dung) và lúc tải xong; đo CLS; thử menu điện thoại / hỏi đáp / form (chặn yêu cầu).
// Dùng: node tools/the7_chup_tai.mjs <base> <thư mục> <tiền tố> <rộng,…> /a/ /b/ …   (khách xem, CHỈ ĐỌC; không thêm tham số chống cache)
import { createRequire } from 'node:module'; import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, dir, pre, ws, ...paths] = process.argv.slice(2); mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const w of ws.split(',').map(Number)) {
  const m = w < 768;
  for (const u of paths) {
    const ctx = await b.newContext({ viewport: { width: w, height: m ? 844 : 1000 }, isMobile: m, hasTouch: m, deviceScaleFactor: 1 });
    const p = await ctx.newPage(); const loi = [];
    if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
    p.on('pageerror', (e) => loi.push(e.message.slice(0, 80)));
    await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    const ten = (u.replace(/\//g, '_') || '_') + '-' + w;
    p.goto(base + u, { timeout: 90000 }).catch(() => {});
    await p.waitForEvent('domcontentloaded', { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(1000);
    await p.screenshot({ path: `${dir}/${pre}-1s${ten}.jpg`, type: 'jpeg', quality: 60 });
    await p.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(1500);
    await p.screenshot({ path: `${dir}/${pre}-xong${ten}.jpg`, type: 'jpeg', quality: 60 });
    const cls = await p.evaluate(() => window.__cls);
    let menu = '-', hd = '-';
    if (m && await p.locator('.dt-mobile-menu-icon').count()) { await p.locator('.dt-mobile-menu-icon').first().click(); await p.waitForTimeout(800); menu = await p.evaluate(() => { const e = document.querySelector('.dt-mobile-header'); const r = e?.getBoundingClientRect(); return !!r && r.right > 100 && getComputedStyle(e).visibility !== 'hidden'; }); await p.keyboard.press('Escape'); }
    const d = p.locator('.velis-hoi-dap__muc, .vc_toggle').first();
    if (await d.count()) { await p.reload({ waitUntil: 'networkidle' }); await d.scrollIntoViewIfNeeded(); await d.locator('summary, .vc_toggle_title').first().click(); await p.waitForTimeout(600); hd = await d.evaluate((e) => (e.open ?? e.classList.contains('vc_toggle_active')) ? 'mở' : 'KHÔNG'); }
    console.log(pre, w, u.padEnd(34), 'CLS', cls.toFixed(3), '| menu', menu, '| hỏi đáp', hd, '| lỗi JS', loi.length, loi.slice(0, 1).join(''));
    await ctx.close();
  }
}
await b.close();
