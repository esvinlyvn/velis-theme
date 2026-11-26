// Đặt ô cài đặt LiteSpeed (radio / select / checkbox / text) trên một trang, lưu, đọc lại; so .htaccess trước / sau (in phần khác).
// Site thật: kiem_site_that() + tools/the7_litespeed_saoluu.mjs trước; ghi nhật ký. Không purge (làm riêng: tools/wp_tai_theme.mjs x --chi-purge).
// Dùng: node tools/the7_litespeed_dat.mjs <url site> <trang, vd litespeed-img_optm> <tab hoặc -> "khóa=giá trị;khóa=giá trị" <thư mục lưu .htaccess>
import { createRequire } from 'node:module'; import { writeFileSync } from 'node:fs';
import { wpAdminLogin } from './wp_admin_login.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const [site, pg, tab, dat, dir] = process.argv.slice(2); const o = new URL(site).origin;
const muon = Object.fromEntries(dat.split(';').filter(Boolean).map((x) => [x.slice(0, x.indexOf('=')), x.slice(x.indexOf('=') + 1)]));
const b = await chromium.launch();
try {
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); await wpAdminLogin(p, o);
  const ht = async () => { await p.goto(o + '/wp-admin/admin.php?page=litespeed-toolbox', { waitUntil: 'networkidle' }); return (await p.evaluate(() => [...document.querySelectorAll('textarea')].map((t) => t.value))).find((v) => v.includes('# BEGIN LSCACHE')) || ''; };
  const mo = async () => { await p.goto(`${o}/wp-admin/admin.php?page=${pg}`, { waitUntil: 'networkidle' }); if (tab !== '-') { await p.locator(`[data-litespeed-tab="${tab}"]`).first().click(); await p.waitForTimeout(800); } };
  const doc = () => p.evaluate((ks) => Object.fromEntries(ks.map((k) => { const e = document.querySelector(`[name="${k}"]`); if (!e) return [k, '(không có ô)']; const v = e.type === 'radio' ? document.querySelector(`input[name="${k}"]:checked`)?.value : e.type === 'checkbox' ? String(e.checked) : e.value; return [k, v]; })), Object.keys(muon));
  const ht0 = await ht(); await mo(); const truoc = await doc(); console.log('trước:', JSON.stringify(truoc));
  for (const [k, v] of Object.entries(muon)) {
    const e = p.locator(`[name="${k}"]`).first(); const type = await e.getAttribute('type'); const tag = await e.evaluate((x) => x.tagName);
    if (type === 'radio') await p.evaluate(([k, v]) => { const r = document.querySelector(`input[name="${k}"][value="${v}"]`); if (!r) throw new Error('không có giá trị ' + v + ' cho ' + k); r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }, [k, v]); // radio được tô lại bằng CSS
    else if (type === 'checkbox') await (v === 'true' || v === '1' ? e.check({ force: true }) : e.uncheck({ force: true }));
    else if (tag === 'SELECT') await e.selectOption(v);
    else await e.fill(v);
  }
  const form = p.locator(`form:has([name="${Object.keys(muon)[0]}"])`).first();
  await Promise.all([p.waitForLoadState('networkidle'), form.locator('[name="litespeed-submit"], input[type=submit]').first().click()]); await p.waitForTimeout(1500);
  await mo(); const sau = await doc(); console.log('sau (đọc lại):', JSON.stringify(sau));
  const lech = Object.entries(muon).filter(([k, v]) => String(sau[k]) !== String(v)); console.log(lech.length ? 'LỆCH ' + JSON.stringify(lech) : 'đúng như đặt');
  const ht1 = await ht();
  if (ht1 === ht0) console.log('.htaccess: KHÔNG ĐỔI');
  else { writeFileSync(`${dir}/htaccess-sau-${pg}-${Date.now()}.txt`, ht1); const a = ht0.split('\n'), c = ht1.split('\n'); console.log('.htaccess ĐỔI:\n- ' + a.filter((x) => !c.includes(x)).join('\n- ') + '\n+ ' + c.filter((x) => !a.includes(x)).join('\n+ ')); }
  if (lech.length) process.exitCode = 1;
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await b.close(); }
