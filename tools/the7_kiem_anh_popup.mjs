// Kiểm bấm ảnh trong nội dung mở cửa sổ ảnh (lightbox The7), KHÔNG chuyển trang. Khách xem, CHỈ ĐỌC.
// Mỗi trang: đếm link bọc ảnh trỏ thẳng tệp ảnh; bấm ảnh đầu tiên → địa chỉ trang phải giữ nguyên và cửa sổ ảnh hiện; Esc đóng.
// Dùng: node tools/the7_kiem_anh_popup.mjs <base> <rộng=1920,390> /duong-dan/ …   (staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, ws, ...paths] = process.argv.slice(2);
const b = await chromium.launch(); let sai = 0;
for (const w of ws.split(',').map(Number)) {
  const m = w < 768;
  const p = await (await b.newContext({ viewport: { width: w, height: m ? 844 : 1000 }, isMobile: m, hasTouch: m })).newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  for (const u of paths) {
    const url = base + u + '?nc=' + Date.now();
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    const sel = '.wpb-content-wrapper a:has(img)[href*="/wp-content/uploads/"]';
    const n = await p.locator(sel).count();
    if (!n) { console.log('–', w, u, '0 ảnh có link'); continue; }
    const a = p.locator(sel).first(); await a.scrollIntoViewIfNeeded(); await a.click(); await p.waitForTimeout(1500);
    const doi = p.url() !== url;
    const pop = await p.evaluate(() => [...document.querySelectorAll('.pswp, .pp_pic_holder, .mfp-wrap, [class*="lightbox"]')].some((e) => { const r = e.getBoundingClientRect(); return r.width > 200 && r.height > 200 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none' && getComputedStyle(e).opacity !== '0'; }));
    let dong = '-'; if (pop) { await p.keyboard.press('Escape'); await p.waitForTimeout(800); dong = !(await p.evaluate(() => [...document.querySelectorAll('.pswp--open, .pp_pic_holder')].some((e) => e.offsetParent))); }
    const dat = !doi && pop; if (!dat) sai++;
    console.log(dat ? 'ĐẠT' : 'SAI', w, u, n, 'ảnh có link | chuyển trang:', doi, '| cửa sổ ảnh:', pop, '| Esc đóng:', dong);
    if (doi) await p.goto(url);
  }
}
await b.close(); process.exitCode = sai ? 1 : 0;
