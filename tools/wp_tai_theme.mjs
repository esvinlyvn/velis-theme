// Tải theme zip qua wp-admin (Giao diện → Tải lên → "Thay thế bản hiện tại") rồi LiteSpeed → Xóa tất cả.
// Site thật: chạy `python3 -I tools/wp_cred.py`-kiem_site_that() trước, ghi docs/the7/NHAT-KY-SITE-THAT.md. Không in mật khẩu.
// Dùng: node tools/wp_tai_theme.mjs <url site> <tệp.zip> [--chi-purge]
import { createRequire } from 'node:module';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site, zip] = process.argv.slice(2);
const chiPurge = process.argv.includes('--chi-purge');
const o = new URL(site).origin;
const b = await chromium.launch();
try {
  const p = await (await b.newContext()).newPage();
  console.log('Đăng nhập:', (await wpAdminLogin(p, o)).replace(/\?.*/, ''));
  if (!chiPurge) {
    await p.goto(o + '/wp-admin/theme-install.php?browse=upload');
    if (!(await p.locator('#install-theme-submit').isVisible())) await p.click('.upload-view-toggle');
    await p.setInputFiles('#themezip', zip);
    await Promise.all([p.waitForNavigation({ timeout: 180000 }), p.click('#install-theme-submit')]);
    const thay = p.locator('a.update-from-upload-overwrite');
    if (!(await thay.count())) throw new Error('Không thấy nút "Thay thế": ' + (await p.locator('.wrap').innerText()).slice(0, 600));
    console.log((await p.locator('.update-from-upload-comparison').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400));
    await Promise.all([p.waitForNavigation({ timeout: 180000 }), thay.click()]);
    const kq = (await p.locator('.wrap').innerText()).replace(/\s+/g, ' ');
    console.log('Kết quả:', kq.slice(0, 500));
    if (!/thành công|successfully/i.test(kq)) throw new Error('Không thấy báo thành công');
  }
  await p.goto(o + '/wp-admin/');
  const purge = p.locator('#wp-admin-bar-litespeed-purge-all a').first();
  if (!(await purge.count())) throw new Error('Không thấy "Purge All" LiteSpeed trên thanh quản trị');
  await p.goto(await purge.getAttribute('href'));
  console.log('LiteSpeed:', (await p.locator('.notice, .updated, .litespeed-notice').allInnerTexts()).join(' | ').replace(/\s+/g, ' ').slice(0, 300));
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
