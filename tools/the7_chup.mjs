// Chụp cả trang (khách xem, Chrome UA thật) cho báo cáo: <thư mục>/<tên>-<rộng>.jpg. CHỈ ĐỌC.
// Dùng: VIEW_PASSWORD_FILE=… node tools/the7_chup.mjs <base> <thư mục> [rộng=1920,390] [tên,...]   (tên trang: PAGES của the7_check_bocuc.mjs)
import { createRequire } from 'node:module'; import { readFileSync, mkdirSync } from 'node:fs';
import { PAGES } from './the7_check_bocuc.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, dir, ws = '1920,390', names] = process.argv.slice(2);
if (!dir) { console.error('Dùng: node tools/the7_chup.mjs <base> <thư mục> [rộng] [tên,...]'); process.exit(1); }
mkdirSync(dir, { recursive: true });
const UA = { 1: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  0: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1' };
const b = await chromium.launch();
for (const w of ws.split(',').map(Number)) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : 1080 }, userAgent: UA[+(w >= 768)], isMobile: w < 768, hasTouch: w < 768 });
  const p = await ctx.newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', (process.env.STAGING_VIEW_PASSWORD || readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim())); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  for (const [n, path] of Object.entries(PAGES).filter(([n]) => !names || names.split(',').includes(n))) {
    await p.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 });
    // cuộn hết trang để ảnh lười nạp hiện, rồi về đầu
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
    await p.waitForTimeout(800); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `${dir}/${n}-${w}.jpg`, fullPage: true, type: 'jpeg', quality: 70 });
    console.log(n, w);
  }
  await ctx.close();
}
await b.close();
