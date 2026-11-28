// Tạo chuyển hướng 301 (Rank Math → Chuyển hướng → Thêm mới; so khớp Exact) cho chuyên mục cũ – bảng BANG của tools/the7_chuyen_muc_cu.py
// (REST updateRedirection của Rank Math trả "đã tạo" nhưng không tạo cho chuyên mục). Bỏ qua nguồn đã có chuyển hướng.
// Dùng: node tools/the7_rankmath_chuyen_huong.mjs <url site> [--that]   (không --that = chỉ liệt kê). Site thật: kiem_site_that() trước.
import { createRequire } from 'node:module';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
export const BANG = [['du-an-bds', '/du-an/'], ['du-an-bds/du-an-vinhomes', '/du-an/vinhomes/'], ['du-an-bds/du-an-gamuda-land', '/du-an/gamuda-land/'],
  ['du-an-bds/du-an-masterise-homes', '/du-an/masterise-homes/'], ['du-an-bds/du-an-sungroup', '/du-an/sun-group/'],
  ['du-an-bds/du-an-vinhomes/du-an-vinhomes-saigon-park', '/vinhomes-saigon-park/'], ['du-an-bds/du-an-gamuda-land/du-an-spring-ville', '/spring-ville/']];
const [site] = process.argv.slice(2); const that = process.argv.includes('--that'); const o = new URL(site).origin;
const b = await chromium.launch();
try {
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); await wpAdminLogin(p, o);
  for (const [nguon, dich] of BANG) {
    await p.goto(`${o}/wp-admin/admin.php?page=rank-math-redirections&s=${encodeURIComponent(nguon)}`, { waitUntil: 'networkidle', timeout: 120000 });
    const co = await p.evaluate((n) => [...document.querySelectorAll('#the-list tr')].some((tr) => tr.innerText.split(/\s*\n\s*|\s+/).map((x) => x.replace(/^\/|\/$/g, '')).includes(n)), nguon);
    if (co) { console.log('đã có', nguon); continue; }
    if (!that) { console.log('sẽ tạo', nguon, '→', dich); continue; }
    await p.locator('.wrap a.rank-math-add-new-redirection').first().click(); await p.waitForTimeout(1500);
    await p.locator('input#sources_0_pattern').fill(nguon); await p.locator('input#url_to').fill(o + dich);  // Exact / 301 / Activate là mặc định
    if ((await p.locator('select#sources_0_comparison').inputValue()) !== 'exact') throw new Error('so khớp không phải Exact');
    // chỉ bấm "Add Redirection" – KHÔNG bấm "Sync to .htaccess" ngay cạnh
    await Promise.all([p.waitForLoadState('networkidle'), p.locator('button[type=submit]:has-text("Add Redirection")').click()]);
    await p.waitForTimeout(1500);
    console.log('tạo', nguon, '→', dich, '|', '');
  }
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
