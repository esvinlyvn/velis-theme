// GA4 chỉ tải sau khi đồng ý (2026-11-27): gỡ khối gtag.js khỏi Header and Footer Scripts (Cài đặt → Header and Footer Scripts, ô chèn vào <head>);
// giữ nguyên dòng xác minh Pinterest / Facebook. GA4 giờ do theme con nạp (inc/velis-tac-gia-dong-y.php, velisGA()).
// Dùng: node tools/the7_hfs_ga.mjs <base> [--ghi]   (không --ghi = chỉ đọc, in nội dung ô)  |  --test
// Site thật: trước --ghi chạy kiem_site_that(): python3 -I -c "import sys;sys.path.insert(0,'tools');import wp_cred;wp_cred.kiem_site_that()"
import { createRequire } from 'node:module';
export const MAU = /\s*<!--\s*Google tag \(gtag\.js\)\s*-->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-QSJ8EH9CWB"><\/script>\s*<script>[^<]*?gtag\('config', 'G-QSJ8EH9CWB'\);\s*<\/script>/;
export function bo(t) {
  if (!MAU.test(t)) throw new Error('không thấy đúng khối gtag.js chuẩn – dừng, không sửa');
  const m = t.replace(MAU, '');
  if (/googletagmanager|gtag\(/.test(m)) throw new Error('còn gtag sau khi gỡ – dừng');
  return m;
}
if (process.argv[2] === '--test') {
  const g = `<meta name="p:domain_verify" content="x"/>\n<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-QSJ8EH9CWB"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-QSJ8EH9CWB');\n</script>\n<meta name="facebook-domain-verification" content="y" />`;
  const m = bo(g); if (m !== '<meta name="p:domain_verify" content="x"/>\n<meta name="facebook-domain-verification" content="y" />') throw new Error('test: ' + m);
  let loi = false; try { bo('<meta>'); } catch { loi = true; } if (!loi) throw new Error('test: phải dừng khi không có khối');
  console.log('test ok'); process.exit();
}
const [base, ghi] = process.argv.slice(2);
const { wpAdminLogin } = await import('./wp_admin_login.mjs');
const { chromium } = createRequire(import.meta.url)('playwright'); const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
try {
  await wpAdminLogin(p, base);
  await p.goto(base + '/wp-admin/options-general.php'); const href = await p.locator('#adminmenu a', { hasText: 'Header and Footer Scripts' }).first().getAttribute('href');
  await p.goto(new URL(href, base + '/wp-admin/').href);
  const ta = p.locator('textarea').first(); const ten = await ta.getAttribute('name'); const cu = await ta.inputValue();
  console.log('ô', ten, '·', cu.length, 'ký tự\n' + cu);
  if (ghi === '--ghi') {
    // ô có thể bị trình soạn mã (CodeMirror) che – ghi qua CodeMirror nếu có, không thì gán thẳng giá trị ô (vẫn gửi theo form)
    const moi = bo(cu); const cach = await p.evaluate(([ten, v]) => { const t = document.querySelector(`textarea[name="${ten}"]`); const cm = t.nextElementSibling?.CodeMirror || document.querySelector('.CodeMirror')?.CodeMirror;
      if (cm) { cm.setValue(v); cm.save?.(); } t.value = v; return cm ? 'CodeMirror' : 'textarea'; }, [ten, moi]); console.log('ghi qua', cach);
    await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
    await p.reload(); const sau = await p.locator('textarea').first().inputValue();
    console.log(sau === moi ? 'ĐÃ LƯU' : 'LỆCH sau khi lưu – kiểm ngay', '·', sau.length, 'ký tự\n' + sau);
  }
} finally { await b.close(); }
