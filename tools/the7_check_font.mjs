// Đo font / CSS / JS một trang (CHỈ ĐỌC): số tệp, yêu cầu tới fonts.googleapis / fonts.gstatic / cache/fvm/fonts (phải 0), lỗi console, font đã tải.
// Dùng: node tools/the7_check_font.mjs <url> <out-prefix> [m]   (staging: VIEW_PASSWORD_FILE)
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync } from 'node:fs';
const [url, out, mob] = process.argv.slice(2);
const b = await chromium.launch(); const c = await b.newContext(mob ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' } : { viewport: { width: 1920, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36' });
const p = await c.newPage(); const req = []; const cons = [];
p.on('console', m => { if (m.type() === 'error') cons.push(m.text().slice(0, 160)); });
p.on('response', async r => { const u = r.url(); const t = r.request().resourceType(); if (['font', 'stylesheet', 'script'].includes(t)) req.push({ t, u, s: r.status() }); });
if (url.includes('staging.')) { await p.goto('https://staging.velisrealty.vn/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } req.length = 0; cons.length = 0; }
await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 }); await p.mouse.wheel(0, 2000); await p.waitForTimeout(3000); await p.evaluate(() => document.fonts.ready);
const used = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight));
writeFileSync(out + '.json', JSON.stringify({ req, used, cons }, null, 1));
const n = t => req.filter(x => x.t === t).length;
console.log(url, 'css', n('stylesheet'), 'js', n('script'), 'font', n('font'), '| google', req.filter(x => /fonts\.(googleapis|gstatic)/.test(x.u)).length, '| fvm-font', req.filter(x => /cache\/fvm\/fonts/.test(x.u)).length, '| console err', cons.length);
for (const x of req.filter(x => x.t === 'font')) console.log('  font', x.u.slice(0, 140));
await b.close();
