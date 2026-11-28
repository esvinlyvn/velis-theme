// Tắt tự cập nhật: plugin nào đang bật (link "Tắt cập nhật tự động" ở Plugin) + WordPress lõi chỉ tự cập nhật bản bảo trì / bảo mật
// (update-core: core-major-auto-updates-settings = disable). In trạng thái trước / sau. Site thật: kiem_site_that() trước, ghi nhật ký.
// Dùng: node tools/the7_tu_cap_nhat.mjs <url site> [--chi-xem]
import { createRequire } from 'node:module';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site, co] = process.argv.slice(2); const o = new URL(site).origin; const xem = co === '--chi-xem';
const b = await chromium.launch();
try {
  const p = await (await b.newContext()).newPage(); await wpAdminLogin(p, o); console.log('Sau đăng nhập:', p.url());
  const plugin = async () => { await p.goto(o + '/wp-admin/plugins.php'); return p.evaluate(() => [...document.querySelectorAll('#the-list tr[data-plugin]')].map((t) => ({ n: t.querySelector('.plugin-title strong')?.textContent, bat: !!t.querySelector('a[href*="action=disable-auto-update"]'), href: t.querySelector('a[href*="action=disable-auto-update"]')?.getAttribute('href') })).filter((x) => x.n)); };
  const loi = async () => { await p.goto(o + '/wp-admin/update-core.php'); return p.evaluate(() => ({ chu: (document.querySelector('.auto-update-status')?.innerText || '').trim().slice(0, 160), tat: document.querySelector('a[href*="core-major-auto-updates-settings"][href*="value=disable"]')?.getAttribute('href') })); };
  let pl = await plugin(); console.log('Plugin đang BẬT tự cập nhật (trước):', pl.filter((x) => x.bat).map((x) => x.n).join(', ') || '(không)');
  let c = await loi(); console.log('Lõi (trước):', c.chu);
  if (!xem) {
    for (const x of pl.filter((x) => x.bat)) await p.goto(new URL(x.href, o + '/wp-admin/').href, { waitUntil: 'load' });
    if (c.tat) await p.goto(new URL(c.tat, o + '/wp-admin/').href, { waitUntil: 'load' });
    pl = await plugin(); console.log('Plugin đang BẬT tự cập nhật (sau):', pl.filter((x) => x.bat).map((x) => x.n).join(', ') || '(không)');
    c = await loi(); console.log('Lõi (sau):', c.chu);
  }
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
