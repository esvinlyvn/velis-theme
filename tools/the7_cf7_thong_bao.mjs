// Đổi một thông báo của form CF7 (tab "Thông báo") qua wp-admin, ghi giá trị cũ / mới; đọc lại sau khi lưu.
// Site thật: kiem_site_that() trước (tools/wp_cred.py), ghi docs/the7/NHAT-KY-SITE-THAT.md.
// Dùng: node tools/the7_cf7_thong_bao.mjs <url site> <khóa, vd invalid_tel> "<câu mới>" <id form> [id …] [--kho]
import { createRequire } from 'node:module';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const a = process.argv.slice(2); const kho = a.includes('--kho'); const [site, khoa, cau, ...ids] = a.filter((x) => x !== '--kho');
const o = new URL(site).origin; const b = await chromium.launch();
try {
  const p = await (await b.newContext()).newPage(); await wpAdminLogin(p, o);
  for (const id of ids) {
    await p.goto(`${o}/wp-admin/admin.php?page=wpcf7&post=${id}&action=edit`);
    const o_nhap = p.locator(`[name="wpcf7-messages[${khoa}]"]`);
    if (!(await o_nhap.count())) throw new Error(`form ${id}: không thấy ô ${khoa}`);
    const ten = await p.locator('#title').inputValue(); const cu = await o_nhap.inputValue();
    if (kho || cu === cau) { console.log(id, ten, '| cũ:', cu, kho ? '(chạy khô)' : '(đã đúng)'); continue; }
    await p.locator('#messages-panel-tab').first().click(); // ô nằm trong tab "Thông báo" đang ẩn
    await o_nhap.fill(cau);
    await Promise.all([p.waitForNavigation({ timeout: 90000 }), p.locator('[name="wpcf7-save"]:visible').first().click()]);
    await p.goto(`${o}/wp-admin/admin.php?page=wpcf7&post=${id}&action=edit`);
    const moi = await p.locator(`[name="wpcf7-messages[${khoa}]"]`).inputValue();
    console.log(id, ten, '| cũ:', cu, '| mới (đọc lại):', moi, moi === cau ? 'ĐÚNG' : 'SAI');
    if (moi !== cau) process.exitCode = 1;
  }
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
