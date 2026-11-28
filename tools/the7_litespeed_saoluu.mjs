// Sao lưu trước khi đổi LiteSpeed (site thật): .htaccess (Toolbox → Edit .htaccess) + xuất cài đặt (Toolbox → Import/Export → Export). CHỈ ĐỌC.
// Dùng: node tools/the7_litespeed_saoluu.mjs <url site> <thư mục ra> <nhãn>
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site, dir, nhan] = process.argv.slice(2); const o = new URL(site).origin;
const b = await chromium.launch();
try {
  const ctx = await b.newContext({ acceptDownloads: true }); const p = await ctx.newPage(); await wpAdminLogin(p, o);
  await p.goto(o + '/wp-admin/admin.php?page=litespeed-toolbox', { waitUntil: 'networkidle' });
  const ht = (await p.evaluate(() => [...document.querySelectorAll('textarea')].map((t) => t.value))).find((v) => v.includes('# BEGIN LSCACHE'));
  if (!ht) throw new Error('không đọc được .htaccess');
  writeFileSync(`${dir}/htaccess-${nhan}.txt`, ht); console.log('.htaccess', ht.length, 'byte');
  // chỉ link xuất (litespeed_type=export) – KHÔNG bấm "Khôi phục cài đặt" (litespeed_type=reset) ngay cạnh
  const href = await p.locator('a[href*="litespeed_type=export"]').first().getAttribute('href');
  if (!/litespeed_type=export/.test(href || '')) throw new Error('không thấy link xuất');
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 60000 }), p.evaluate((h) => { location.href = h; }, href)]);
  await dl.saveAs(`${dir}/litespeed-cai-dat-${nhan}.data`); console.log('cài đặt LiteSpeed →', `${dir}/litespeed-cai-dat-${nhan}.data`);
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
