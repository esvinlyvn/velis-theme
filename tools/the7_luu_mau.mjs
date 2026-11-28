// Lưu lại "Mẫu của tôi" WPBakery từ tệp nguồn (2026-11-27): xóa mẫu cũ cùng tên (AJAX vc_delete_template) rồi lưu bản mới (vc_save_template),
// đúng các lệnh trình sửa WPBakery dùng (nonce vcAdminNonce của màn soạn). Site thật: kiem_site_that() trước, ghi nhật ký.
// Dùng: node tools/the7_luu_mau.mjs <url site> "<Tên mẫu>" <tệp nguồn> [--ghi]
import { createRequire } from 'node:module'; import { readFileSync } from 'node:fs';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site, ten, tep, co] = process.argv.slice(2); const o = new URL(site).origin; const noiDung = readFileSync(tep, 'utf8');
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const b = await chromium.launch();
try {
  const p = await (await b.newContext()).newPage(); await wpAdminLogin(p, o);
  const ds = async () => { await p.goto(o + '/wp-admin/post-new.php', { waitUntil: 'domcontentloaded' }); await p.waitForFunction(() => typeof window.vcAdminNonce === 'string', null, { timeout: 60000 });
    return p.evaluate(() => [...document.querySelectorAll('[data-template_type="my_templates"][data-template_id]')].map((e) => e.getAttribute('data-template_id'))); };
  const truoc = await ds(); const cu = truoc.filter((id) => id.replace(/_\d+$/, '') === slug(ten)); console.log('mẫu hiện có:', truoc.join(', '), '| trùng tên:', cu.join(', ') || '(không)');
  if (co === '--ghi') {
    const r = await p.evaluate(async ([cu, ten, nd]) => { const f = (d) => fetch(ajaxurl, { method: 'POST', credentials: 'same-origin', body: new URLSearchParams({ ...d, _vcnonce: window.vcAdminNonce }) }).then((x) => x.text());
      const out = []; for (const id of cu) out.push('xóa ' + id + ': ' + (await f({ action: 'vc_delete_template', template_id: id, template_type: 'my_templates' })).slice(0, 40));
      out.push('lưu: ' + (await f({ action: 'vc_save_template', template_name: ten, template: nd })).slice(0, 80)); return out; }, [cu, ten, noiDung]);
    console.log(r.join('\n')); const sau = await ds(); console.log('mẫu sau:', sau.join(', '));
    if (!sau.some((id) => id.replace(/_\d+$/, '') === slug(ten))) process.exitCode = 1;
  }
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
