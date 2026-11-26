// Chụp vùng theo bộ chọn (vd. .velis-feats, .velis-projects) ở nhiều khổ – để so trước / sau từng điểm ảnh. Khách xem, CHỈ ĐỌC.
// Dùng: node tools/the7_chup_vung.mjs <base> <thư mục> <tiền tố> <rộng,…> <đường dẫn>:<bộ chọn> …   (staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module'; import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, dir, pre, ws, ...ds] = process.argv.slice(2); mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const w of ws.split(',').map(Number)) {
  const m = w < 768; const p = await (await b.newContext({ viewport: { width: w, height: m ? 844 : 1080 }, deviceScaleFactor: 1, isMobile: m })).newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); }
  for (const d of ds) {
    const [u, sel] = d.split(':');
    await p.goto(base + u, { waitUntil: 'networkidle' });
    for (let y = 0; y < 15000; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(80); }
    const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
    await p.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 5000); }))));
    const f = `${dir}/${pre}-${u.replace(/\//g, '_') || 'home'}-${sel.replace(/[^a-z]/gi, '')}-${w}.png`; await el.screenshot({ path: f }); console.log(f);
  }
}
await b.close();
