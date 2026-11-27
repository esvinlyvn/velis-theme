// Kiểm GA4 tải muộn (2026-11-27, bỏ hộp đồng ý cookie). Yêu cầu gửi số liệu (collect) bị CHẶN và chỉ ghi lại → không làm bẩn số liệu GA.
//  (1) mở trang, không tương tác, trong 2 giây sau khi tải xong → 0 yêu cầu googletagmanager / google-analytics;
//  (2) cuộn → tải gtag.js + gửi page_view;  (3) không tương tác → sau 4 giây (+ lúc rảnh) có page_view;  (4) cuộn + chờ hết 4 giây → gtag.js chỉ tải 1 lần.
// Dùng: node tools/the7_kiem_ga.mjs <base> [đường dẫn=/]   (staging tự thêm ?velis_ga_thu=1; STAGING_VIEW_PASSWORD) – thoát 1 nếu có mục trượt
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [base, duong = '/'] = process.argv.slice(2); const st = base.includes('staging.'); const url = base + duong + (st ? '?velis_ga_thu=1' : '');
const b = await chromium.launch(); const kq = [];
async function phien() {
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const yc = [];
  await ctx.route(/google-analytics\.com|analytics\.google\.com|\/g\/collect/, (r) => { yc.push(r.request().url()); r.abort(); });
  p.on('request', (r) => { if (/googletagmanager\.com/.test(r.url())) yc.push(r.url()); });
  if (st) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  return { p, yc, ctx };
}
const pv = (yc) => yc.some((u) => /collect/.test(u) && /en=page_view/.test(u));
const gtm = (yc) => yc.filter((u) => /googletagmanager\.com\/gtag\/js\?id=G-QSJ8EH9CWB/.test(u)).length;
let { p, yc, ctx } = await phien();
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(2000);
kq.push(['Mở trang, chưa tương tác (2 giây sau khi tải): 0 yêu cầu Google', yc.length === 0, yc.length + ' yêu cầu']);
await p.mouse.wheel(0, 600); await p.evaluate(() => scrollBy(0, 600)); await p.waitForTimeout(3000);
kq.push(['Cuộn: tải gtag.js + page_view', gtm(yc) === 1 && pv(yc), `gtag.js ×${gtm(yc)} · page_view ${pv(yc)}`]);
await p.waitForTimeout(4000);
kq.push(['Cuộn rồi chờ hết 4 giây: gtag.js chỉ tải 1 lần', gtm(yc) === 1, `gtag.js ×${gtm(yc)}`]);
await ctx.close();
({ p, yc, ctx } = await phien());
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(3000); const truoc4 = yc.length; await p.waitForTimeout(5000);
kq.push(['Không tương tác: sau 4 giây có page_view (trước đó 0)', truoc4 === 0 && pv(yc) && gtm(yc) === 1, `3 giây: ${truoc4} yêu cầu · 8 giây: gtag.js ×${gtm(yc)}, page_view ${pv(yc)}`]);
kq.push(['Không còn hộp đồng ý cookie', !(await p.locator('.velis-dong-y').count()), '']);
await b.close();
console.log('| Kiểm GA4 (' + base + duong + ') | Kết quả | Chi tiết |\n|---|---|---|\n' + kq.map(([a, o, c]) => `| ${a} | ${o ? 'đạt' : 'TRƯỢT'} | ${c} |`).join('\n'));
if (kq.some((x) => !x[1])) process.exitCode = 1;
