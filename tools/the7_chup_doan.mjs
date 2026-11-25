// Chụp từng đoạn (khối chứa tiêu đề có chữ cho trước) của một trang, khách xem, Chrome UA thật. CHỈ ĐỌC.
// Dùng: VIEW_PASSWORD_FILE=… node tools/the7_chup_doan.mjs <url> <thư mục> <tiền tố> <rộng,…> "<chữ tiêu đề>" ["<chữ>" …]
import { createRequire } from 'node:module'; import { readFileSync, mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [url, dir, pre, ws, ...heads] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const w of ws.split(',').map(Number)) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : 1080 }, isMobile: w < 768, hasTouch: w < 768,
    userAgent: w < 768 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const p = await ctx.newPage(); const o = new URL(url).origin;
  if (o.includes('staging.')) { await p.goto(o + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } scrollTo(0, 0); });
  await p.waitForTimeout(800);
  for (const [i, h] of heads.entries()) {
    const el = p.locator(`:is(h2, h3):has-text("${h}")`).first();
    if (!(await el.count())) { console.log('KHÔNG THẤY', h, w); continue; }
    const box = await el.evaluate((e) => { const k = e.closest('.velis-khoi, .vc_row') || e.parentElement; const r = k.getBoundingClientRect(); return { x: 0, y: r.top + scrollY - 16, width: innerWidth, height: Math.min(r.height + 32, 4000) }; });
    await p.screenshot({ path: `${dir}/${pre}-${i + 1}-${w}.jpg`, clip: box, fullPage: true, type: 'jpeg', quality: 75 });
    console.log(pre, i + 1, h, w, Math.round(box.height));
  }
  await ctx.close();
}
await b.close();
