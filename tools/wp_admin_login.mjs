// Đăng nhập wp-admin (Playwright) theo tên miền, không in mật khẩu (chốt 2026-11-25):
//   staging.velisrealty.vn → WP_USER + WP_ADMIN_PASSWORD (cổng xem khách: STAGING_VIEW_PASSWORD)
//   velisrealty.vn         → WP_LIVE_USER + WP_LIVE_ADMIN_PASSWORD (trước khi GHI site thật: kiem_site_that() trong tools/wp_cred.py)
// Màn "Xác minh email quản trị" (?action=confirm_admin_email) → bấm "Địa chỉ email này chính xác".
// Sai mật khẩu → ném lỗi kèm thông báo của trang; KHÔNG thử lại.
// Dùng: import { wpAdminLogin } from './wp_admin_login.mjs'   |   node tools/wp_admin_login.mjs <url>   |   --test
import { createRequire } from 'node:module';

const BIEN = { 'staging.velisrealty.vn': ['WP_USER', 'WP_ADMIN_PASSWORD'], 'velisrealty.vn': ['WP_LIVE_USER', 'WP_LIVE_ADMIN_PASSWORD'] };

export function credFor(url) {
  const host = new URL(url).hostname.replace(/^www\.(?=velisrealty\.vn$)/, '');
  const k = BIEN[host];
  if (!k) throw new Error(`Không gửi thông tin đăng nhập tới ${host} – dừng`);
  const [u, p] = k.map((n) => process.env[n]);
  if (!u || !p) throw new Error(`Thiếu biến ${k.join(' / ')}`);
  return { origin: `https://${new URL(url).hostname}`, user: u, pass: p };
}

// Phân loại trang sau khi bấm Đăng nhập.
export function trangThai(url, coLoi) {
  const u = new URL(url);
  if (u.pathname.endsWith('/wp-login.php')) return u.searchParams.get('action') === 'confirm_admin_email' ? 'xac-minh-email' : coLoi ? 'loi' : 'chua-ro';
  return u.pathname.includes('/wp-admin') ? 'vao' : 'chua-ro';
}

async function congXem(page, origin) {
  // Plugin khóa trang staging: ô mật khẩu duy nhất, không có #user_login.
  if (!origin.includes('staging.')) return;
  if (await page.locator('#user_login').count() || !(await page.locator('input[type=password]').count())) return;
  if (!process.env.STAGING_VIEW_PASSWORD) throw new Error('Thiếu STAGING_VIEW_PASSWORD');
  await page.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD);
  await Promise.all([page.waitForNavigation(), page.locator('input[type=submit], button[type=submit]').first().click()]);
}

/** Đăng nhập trên `page`; trả về địa chỉ trang sau đăng nhập (wp-admin). */
export async function wpAdminLogin(page, url) {
  const { origin, user, pass } = credFor(url);
  await page.goto(origin + '/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await congXem(page, origin);
  if (!(await page.locator('#user_login').count())) await page.goto(origin + '/wp-login.php', { waitUntil: 'domcontentloaded' });
  await page.fill('#user_login', user);
  await page.fill('#user_pass', pass);
  await Promise.all([page.waitForNavigation({ timeout: 90000 }), page.click('#wp-submit')]);
  const loi = async () => (await page.locator('#login_error').count()) ? (await page.locator('#login_error').innerText()).trim() : '';
  let tt = trangThai(page.url(), await loi());
  if (tt === 'xac-minh-email') {
    await Promise.all([page.waitForNavigation(), page.click('#correct-admin-email')]);
    tt = trangThai(page.url(), await loi());
  }
  if (tt !== 'vao') throw new Error(`Đăng nhập không thành công (${page.url().replace(/\?.*/, '')}): ${(await loi()) || 'không rõ thông báo'} – DỪNG, không thử lại`);
  return page.url();
}

if (process.argv[1]?.endsWith('wp_admin_login.mjs')) {
  const arg = process.argv[2];
  if (arg === '--test') {
    const assert = (c, m) => { if (!c) throw new Error(m); };
    Object.assign(process.env, { WP_USER: 's', WP_ADMIN_PASSWORD: 'sp', WP_LIVE_USER: 'l', WP_LIVE_ADMIN_PASSWORD: 'lp' });
    assert(credFor('https://staging.velisrealty.vn/x').user === 's', 'staging');
    assert(credFor('https://velisrealty.vn/').pass === 'lp' && credFor('https://www.velisrealty.vn/').user === 'l', 'live');
    for (const bad of ['https://velisrealty.vn.evil.com/', 'https://example.com/', 'http://localhost/']) {
      let ok = false; try { credFor(bad); } catch { ok = true; } assert(ok, bad);
    }
    assert(trangThai('https://velisrealty.vn/wp-login.php?action=confirm_admin_email&wp_lang=vi', '') === 'xac-minh-email', 'email');
    assert(trangThai('https://velisrealty.vn/wp-login.php', 'Lỗi: mật khẩu') === 'loi', 'lỗi');
    assert(trangThai('https://velisrealty.vn/wp-admin/', '') === 'vao', 'vào');
    console.log('self-test ok');
  } else if (arg) {
    const { chromium } = createRequire(import.meta.url)('playwright');
    const b = await chromium.launch();
    try { console.log('Sau đăng nhập:', await wpAdminLogin(await (await b.newContext()).newPage(), arg)); }
    catch (e) { console.error(e.message); process.exitCode = 1; }
    finally { await b.close(); }
  } else console.log('Dùng: node tools/wp_admin_login.mjs <url> | --test');
}
