// The7 Theme Options qua wp-admin (Export/Import Options): xuất ra JSON / nhập JSON rồi xuất lại so khớp.
// Tệp xuất có contact_form_security_token → chỉ để trong scratchpad, KHÔNG commit. Site thật: kiem_site_that() trước, ghi nhật ký.
// Dùng: node tools/the7_options_wpadmin.mjs xuat <url site> <ra.json>   |   nhap <url site> <vào.json> <xuất-lại.json>
import { createRequire } from 'node:module'; import { readFileSync, writeFileSync } from 'node:fs';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [lenh, site, tep, tep2] = process.argv.slice(2); const o = new URL(site).origin;
const b = await chromium.launch();
try {
  const p = await (await b.newContext()).newPage(); await wpAdminLogin(p, o);
  const xuat = async () => { await p.goto(o + '/wp-admin/admin.php?page=of-importexport-menu'); return JSON.parse(await p.locator('#import_export').inputValue()); };
  if (lenh === 'xuat') { const j = await xuat(); writeFileSync(tep, JSON.stringify(j, null, 1)); console.log('xuất', Object.keys(j).length, 'khóa →', tep); }
  else if (lenh === 'nhap') {
    const vao = JSON.parse(readFileSync(tep, 'utf8'));
    await p.goto(o + '/wp-admin/admin.php?page=of-importexport-menu');
    await p.locator('#import_export').fill(JSON.stringify(vao));
    await p.locator('input[type=submit][name=update]').click(); // The7 có thể lưu không chuyển trang → chờ mạng yên, rồi xuất lại so
    await p.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {}); await p.waitForTimeout(3000);
    const lai = await xuat(); writeFileSync(tep2, JSON.stringify(lai, null, 1));
    const lech = Object.keys(vao).filter((k) => JSON.stringify(vao[k]) !== JSON.stringify(lai[k]));
    console.log('nhập', Object.keys(vao).length, 'khóa; xuất lại lệch:', lech.length, lech.slice(0, 20).join(', '));
    if (lech.length) process.exitCode = 1;
  } else console.log('Dùng: xuat <site> <ra.json> | nhap <site> <vào.json> <xuất-lại.json>');
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
