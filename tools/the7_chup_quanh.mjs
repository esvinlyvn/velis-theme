// Chụp vùng QUANH phần tử (kèm ngữ cảnh trên / dưới) ở nhiều khổ, JPEG cho báo cáo – vd. ô Trả lời nhanh trong bài. Khách xem, CHỈ ĐỌC.
// Dùng: node tools/the7_chup_quanh.mjs <base> <thư mục> <rộng,…> <đường dẫn>:<bộ chọn>[:<thứ tự=0>] …   (staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module'; import { mkdirSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, dir, ws, ...ds] = process.argv.slice(2); mkdirSync(dir, { recursive: true }); const b = await chromium.launch();
for (const w of ws.split(',').map(Number)) {
  const m = w < 768; const p = await (await b.newContext({ viewport: { width: w, height: m ? 844 : 1080 }, isMobile: m, deviceScaleFactor: m ? 2 : 1 })).newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  for (const d of ds) {
    const [u, sel, i = '0'] = d.split(':');
    await p.goto(base + u, { waitUntil: 'networkidle' });
    const el = p.locator(sel).nth(+i); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
    const r = await el.boundingBox(); const top = Math.max(0, r.y - (m ? 160 : 240)); const h = Math.min(r.height + (m ? 320 : 480), m ? 1400 : 1600);
    const f = `${dir}/${(u.replace(/\//g, '') || 'home').slice(0, 30)}-${sel.replace(/[^a-z]/gi, '').slice(0, 24)}${i !== '0' ? i : ''}-${w}.jpg`;
    await p.screenshot({ path: f, type: 'jpeg', quality: 72, clip: { x: 0, y: top, width: w, height: h } }); console.log(f);
  }
}
await b.close();
