// Kiểm GA4 chỉ tải sau khi đồng ý (2026-11-27). Yêu cầu gửi số liệu (collect) bị CHẶN và chỉ ghi lại → không làm bẩn số liệu GA.
//  (1) chưa chọn → 0 yêu cầu googletagmanager / google-analytics;  (2) bấm "Đồng ý" → tải gtag.js + gửi page_view;
//  (3) tải lại → GA4 tải ngay (không cần bấm);  (4) "Từ chối" rồi tải lại → 0 yêu cầu.
// Dùng: node tools/the7_kiem_ga.mjs <base> [đường dẫn=/]   (staging tự thêm ?velis_ga_thu=1; STAGING_VIEW_PASSWORD)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, duong = '/'] = process.argv.slice(2); const st = base.includes('staging.'); const url = base + duong + (st ? '?velis_ga_thu=1' : '');
const b = await chromium.launch(); const kq = [];
async function phien() {
  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 } }); const p = await ctx.newPage(); const yc = [];
  await ctx.route(/google-analytics\.com|analytics\.google\.com|\/g\/collect/, (r) => { yc.push(r.request().url()); r.abort(); });
  p.on('request', (r) => { if (/googletagmanager\.com/.test(r.url())) yc.push(r.url()); });
  if (st) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  return { p, yc, ctx };
}
const pv = (yc) => yc.some((u) => /collect/.test(u) && /en=page_view/.test(u));
const gtm = (yc) => yc.some((u) => /googletagmanager\.com\/gtag\/js\?id=G-QSJ8EH9CWB/.test(u));
let { p, yc, ctx } = await phien();
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(4000);
kq.push(['Chưa chọn: 0 yêu cầu Google', yc.length === 0, yc.length + ' yêu cầu']);
yc.length = 0; await p.locator('.velis-dong-y [data-dong-y="1"]').click(); await p.waitForTimeout(5000);
kq.push(['Bấm Đồng ý: tải gtag.js + page_view', gtm(yc) && pv(yc), `gtag.js ${gtm(yc)} · page_view ${pv(yc)}`]);
yc.length = 0; await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(5000);
kq.push(['Tải lại sau đồng ý: GA4 tải ngay', gtm(yc) && pv(yc) && !(await p.locator('.velis-dong-y').isVisible()), `gtag.js ${gtm(yc)} · page_view ${pv(yc)} · hộp ẩn`]);
await ctx.close();
({ p, yc, ctx } = await phien());
await p.goto(url, { waitUntil: 'load' }); await p.locator('.velis-dong-y [data-dong-y="0"]').click(); await p.waitForTimeout(1500); await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(4000);
kq.push(['Từ chối rồi tải lại: 0 yêu cầu Google', yc.length === 0, yc.length + ' yêu cầu']);
await b.close();
console.log('| Kiểm GA4 (' + base + duong + ') | Kết quả | Chi tiết |\n|---|---|---|\n' + kq.map(([a, o, c]) => `| ${a} | ${o ? 'đạt' : 'TRƯỢT'} | ${c} |`).join('\n'));
if (kq.some((x) => !x[1])) process.exitCode = 1;
