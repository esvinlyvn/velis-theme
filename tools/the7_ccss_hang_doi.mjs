// Theo dõi hàng đợi CCSS LiteSpeed (QUIC.cloud ẩn danh bị giới hạn tốc độ): mỗi N giây xem số URL chờ; nút "Chạy Hàng đợi CCSS Thủ công"
// hiện thì bấm. Dừng khi hàng đợi = 0 hoặc hết giờ. Site thật – chỉ bấm nút chạy hàng đợi (không đổi cài đặt).
// Dùng: node tools/the7_ccss_hang_doi.mjs <url site> <phút tối đa> [giây giữa 2 lần = 120]
import { createRequire } from 'node:module';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site, phut, cach = '120'] = process.argv.slice(2); const o = new URL(site).origin; const het = Date.now() + +phut * 60000;
const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); await wpAdminLogin(p, o);
const gio = () => new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
while (Date.now() < het) {
  await p.goto(o + '/wp-admin/admin.php?page=litespeed-page_optm', { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {});
  const t = await p.locator('#wpbody-content').innerText().catch(() => '');
  const con = +(t.match(/hàng đợi CCSS đang chờ cron \( (\d+) \)/)?.[1] || 0);
  const kd = t.match(/Khả dụng sau (\d+) giây/)?.[1];
  const nut = p.locator('a[href*="litespeed_type=gen_ccss"]');
  console.log(gio(), 'còn', con, kd ? `(khóa ${kd}s)` : '');
  if (!con) break;
  if (await nut.count()) { await p.goto(await nut.first().getAttribute('href'), { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {}); console.log(gio(), '  → bấm chạy hàng đợi'); }
  await p.waitForTimeout(+cach * 1000);
}
await b.close();
