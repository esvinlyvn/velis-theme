// Đổi "Bài viết liên quan → chọn chuyên mục" (meta box The7 _dt_post_options_related_categories) của một bài dự án / phân khu:
// bỏ chuyên mục <bo>, chọn <them>, bấm Cập nhật (trình sửa cổ điển – nội dung gửi lại nguyên văn). In trạng thái trước / sau + revision mới.
// Site thật: kiem_site_that() trước, ghi nhật ký. Dùng: node tools/the7_lien_quan_cm.mjs <url site> <ID bài> <ID bỏ> <ID chọn>
import { createRequire } from 'node:module';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site, id, bo, them] = process.argv.slice(2); const o = new URL(site).origin;
const b = await chromium.launch();
try {
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); await wpAdminLogin(p, o);
  const mo = async () => { await p.goto(`${o}/wp-admin/post.php?post=${id}&action=edit`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('#publish'); await p.waitForTimeout(2500); };
  const doc = () => p.evaluate(() => [...document.querySelectorAll('input[name="_dt_post_options_related_categories[]"]:checked')].map((e) => e.value).join(','));
  await mo(); const truoc = await doc(); console.log('trước:', truoc);
  const nd0 = await p.evaluate(() => document.querySelector('#content')?.value || '');
  await p.evaluate(([bo, them]) => { const q = (v) => document.querySelector(`input[name="_dt_post_options_related_categories[]"][value="${v}"]`); if (!q(them)) throw new Error('không có chuyên mục ' + them); if (q(bo)) q(bo).checked = false; q(them).checked = true; }, [bo, them]);
  p.on('dialog', (d) => d.accept()); // trình sửa có thể hỏi "rời trang?"
  await Promise.all([p.waitForNavigation({ timeout: 120000 }), p.evaluate(() => document.querySelector('#post').requestSubmit(document.querySelector('#publish')))]);
  await mo(); const sau = await doc(); const nd1 = await p.evaluate(() => document.querySelector('#content')?.value || '');
  console.log('sau:', sau, '| nội dung', nd0 === nd1 ? 'không đổi' : 'ĐỔI (' + nd0.length + ' → ' + nd1.length + ')');
  if (sau.split(',').includes(bo) || !sau.split(',').includes(them) || nd0 !== nd1) process.exitCode = 1;
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
