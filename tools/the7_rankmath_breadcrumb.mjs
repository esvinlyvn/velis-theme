// Bật "Điều hướng trang" (breadcrumbs) của Rank Math → Rank Math thêm BreadcrumbList vào schema (2026-11-26). wp-admin, React.
// Cho khớp breadcrumb The7 đang hiển thị: nhãn trang chủ "Trang chủ", hiện chuyên mục cha (Blog › cụm).
// Dùng: node tools/the7_rankmath_breadcrumb.mjs <url site> [--that]   (không --that = chỉ đọc trạng thái). Site thật: kiem_site_that() trước.
import { createRequire } from 'node:module';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site] = process.argv.slice(2); const that = process.argv.includes('--that'); const o = new URL(site).origin;
const b = await chromium.launch();
try {
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1100 } })).newPage(); await wpAdminLogin(p, o);
  const mo = async () => { await p.goto(`${o}/wp-admin/admin.php?page=rank-math-options-general`, { waitUntil: 'networkidle', timeout: 120000 }); await p.locator('#tab-panel-0-breadcrumbs').click(); await p.waitForTimeout(1500); return p.locator('#breadcrumbs').isChecked(); };
  const doc = async () => ({ bat: await p.locator('#breadcrumbs').isChecked(), nhan: await p.locator('#breadcrumbs_home_label').inputValue().catch(() => null), cha: await p.locator('#breadcrumbs_ancestor_categories').isChecked().catch(() => null) });
  await mo(); const truoc = await doc(); console.log('trước:', JSON.stringify(truoc));
  if (that && (!truoc.bat || truoc.nhan !== 'Trang chủ' || !truoc.cha)) {
    if (!truoc.bat) { await p.locator('#breadcrumbs').check({ force: true }); await p.waitForTimeout(800); }
    await p.locator('#breadcrumbs_home_label').fill('Trang chủ');
    await p.locator('#breadcrumbs_ancestor_categories').check({ force: true }); await p.waitForTimeout(500);
    const nut = p.locator('button:has-text("Lưu thay đổi"), button:has-text("Save Changes")').first();
    const [r] = await Promise.all([p.waitForResponse((x) => /rankmath\/v1\/updateSettings/.test(x.url()), { timeout: 60000 }), nut.click()]);
    console.log('lưu:', r.status());
    await mo(); console.log('sau (đọc lại):', JSON.stringify(await doc()));
  }
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
