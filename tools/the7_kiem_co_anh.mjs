// Ảnh tải về đúng cỡ: mỗi <img> đã tải trong nội dung – độ rộng file (naturalWidth) ≤ 2 × độ rộng hiển thị × DPR. Cuộn hết trang. CHỈ ĐỌC.
// Dùng: node tools/the7_kiem_co_anh.mjs <base> <rộng:dpr,…> /a/ …   (vd 390:1.75,1920:1; staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, ws, ...paths] = process.argv.slice(2); const b = await chromium.launch(); let sai = 0;
for (const wd of ws.split(',')) {
  const [w, dpr] = wd.split(':').map(Number); const m = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: m ? 844 : 1000 }, deviceScaleFactor: dpr, isMobile: m }); const p = await ctx.newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); }
  for (const u of paths) {
    await p.goto(base + u, { waitUntil: 'networkidle', timeout: 90000 });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } });
    await p.waitForLoadState('networkidle').catch(() => {}); await p.waitForTimeout(1000);
    const r = await p.evaluate((dpr) => [...document.querySelectorAll('#main img, #content img')].filter((i) => i.complete && i.naturalWidth > 1 && i.getBoundingClientRect().width > 8 && !i.closest('.velis-hero-bg'))
      .map((i) => ({ f: i.currentSrc.split('/').pop().slice(0, 50), nat: i.naturalWidth, hien: Math.round(i.getBoundingClientRect().width), can: Math.round(i.getBoundingClientRect().width * dpr) })), dpr);
    const qua = r.filter((x) => x.nat > 2 * x.can);
    if (qua.length) sai++;
    console.log(qua.length ? 'SAI' : 'ĐẠT', `${w}@${dpr}`, u.padEnd(32), `${r.length} ảnh`, qua.length ? '| quá cỡ: ' + qua.slice(0, 5).map((x) => `${x.f} ${x.nat}px/khung ${x.hien}`).join('; ') : '');
  }
  await ctx.close();
}
await b.close(); process.exitCode = sai ? 1 : 0;
