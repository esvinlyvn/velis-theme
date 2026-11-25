// Kiểm ô số điện thoại form CF7 (theme con velis_vn_phone). Khách xem, Chrome thật.
// Chạy khô (mặc định): ô họ tên để TRỐNG → CF7 trả validation_failed, KHÔNG gửi mail; ghi ô sdt có bị báo lỗi không
// và số chỗ đang hiện lỗi (lời nhắc dưới ô + dòng thông báo chung). --that "<tên>" "<số>": gửi thật đúng 1 lần.
// Dùng: node tools/the7_kiem_form_sdt.mjs <url trang có form> [--that "<tên>" "<số>"]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [url, co, ten, soThat] = process.argv.slice(2);
const SO = [['+84 911 237 979', true], ['84911237979', true], ['091 123 7979', true], ['12345', false]];
const b = await chromium.launch();
const ctx = await b.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
const p = await ctx.newPage(); const o = new URL(url).origin;
if (o.includes('staging.')) { await p.goto(o + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
async function gui(tenVal, so) {
  await p.goto(url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
  const f = p.locator('form.wpcf7-form').first();
  await f.locator('[name=ten]').fill(tenVal); await f.locator('[name=sdt]').fill(so);
  await f.evaluate((el) => el.querySelectorAll('input[type=checkbox][name="dong-y"]').forEach((c) => { if (!c.checked) c.click(); })); // ô đồng ý được The7 tô lại, check() không bấm được
  const [r] = await Promise.all([p.waitForResponse((x) => x.url().includes('/contact-form-7/v1/contact-forms/') && x.url().includes('/feedback'), { timeout: 60000 }), f.locator('[type=submit]').click()]);
  const j = await r.json(); await p.waitForTimeout(500);
  const hien = await f.evaluate((el) => [...el.querySelectorAll('.wpcf7-not-valid-tip, .wpcf7-response-output')].filter((e) => e.offsetParent && e.textContent.trim()).map((e) => e.className.includes('tip') ? 'nhắc: ' + e.textContent.trim() : 'chung: ' + e.textContent.trim()));
  return { status: j.status, loiSdt: (j.invalid_fields || []).some((x) => x.field === 'sdt'), hien, message: j.message };
}
let sai = 0;
try {
  if (co === '--that') {
    const k = await gui(ten, soThat); console.log('GỬI THẬT', JSON.stringify(k)); if (k.status !== 'mail_sent') sai++;
  } else for (const [so, ok] of SO) {
    const k = await gui('', so);
    const dat = k.status === 'validation_failed' && k.loiSdt === !ok;
    if (!dat) sai++;
    console.log(dat ? 'ĐẠT' : 'SAI', JSON.stringify(so), ok ? 'phải nhận' : 'phải báo lỗi', '→', k.status, 'lỗi sdt:', k.loiSdt, '| hiện:', k.hien.join(' / '));
  }
} finally { await b.close(); }
process.exitCode = sai ? 1 : 0;
