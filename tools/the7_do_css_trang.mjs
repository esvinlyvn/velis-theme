// Tổng CSS mỗi trang (trước nén) như khách nhận – tệp CSS ngoài (đúng nội dung tải về, kể cả bản gộp LiteSpeed) + khối <style> nội tuyến. CHỈ ĐỌC.
// Dùng: node tools/the7_do_css_trang.mjs <base> [đường dẫn …]   (staging: STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, ...ds] = process.argv.slice(2); const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, isMobile: true }); const p = await ctx.newPage();
if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
const kq = [];
for (const u of ds.length ? ds : ['/', '/du-an/', '/can-ho-the-prive/', '/gia-ban-the-prive-quan-2-2026/', '/blog/the-prive/', '/gioi-thieu/']) {
  const tep = new Map(); const nghe = async (r) => { if (r.request().resourceType() === 'stylesheet' && r.url().startsWith(base)) tep.set(r.url(), (await r.body().catch(() => Buffer.alloc(0))).length); };
  p.on('response', nghe); await p.goto(base + u, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(1500); p.off('response', nghe);
  const inl = await p.evaluate(() => [...document.querySelectorAll('style')].reduce((a, s) => a + s.textContent.length, 0));
  const ngoai = [...tep.values()].reduce((a, x) => a + x, 0);
  kq.push(`| ${u} | ${(ngoai / 1024).toFixed(0)} (${tep.size} tệp) | ${(inl / 1024).toFixed(0)} | **${((ngoai + inl) / 1024).toFixed(0)}** |`);
}
await b.close();
console.log('| Trang | CSS tệp ngoài KB | Nội tuyến KB | Tổng KB |\n|---|---|---|---|\n' + kq.join('\n'));
