// 31 interaction checks on STAGING (34 of round 8 − header hide/show ×2 − "Theo loại sản phẩm" table, dropped 2026-11-06) (guest view behind the staging password) – rewritten in round 8 from the list of
// round 6/7 (screenshots/phase4-r7/tuong-tac.txt). The form check intercepts the CF7 request in the
// browser and answers it locally: nothing is submitted to staging (decision 2026-11-06).
// Usage: VIEW_PASSWORD_FILE=… node tools/interactions.mjs <out-file>
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const PW = createRequire(import.meta.url)('playwright');
const chromium = process.env.BROWSER === 'webkit' ? PW.webkit : PW.chromium; // BROWSER=webkit: Safari engine (bước 4)

const BASE = 'https://staging.velisrealty.vn';
const out = process.argv[2] || 'tuong-tac.txt';
const lines = [];
// SKIP = a feature removed in step 3 (B3-2a, listed for approval): not counted as a pass
const skip = (name, why) => { lines.push(`SKIP ${name} – ${why}`); console.log(lines.at(-1)); };
const check = (name, ok, detail = '') => { lines.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail !== '' ? ' – ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : ''}`); console.log(lines.at(-1)); };
const settle = (p) => p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } scrollTo(0, 0); });

const b = await chromium.launch();
const login = await b.newContext();
const lp = await login.newPage();
await lp.goto(BASE + '/');
await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
const storageState = await login.storageState();
const desk = await b.newContext({ storageState, viewport: { width: 1366, height: 900 } });
const mob = await b.newContext({ storageState, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
// wait until a smooth scroll has stopped (long pages take more than a second)
const still = async (pg) => { let y = -1; for (let i = 0; i < 40; i++) { const n = await pg.evaluate(() => scrollY); if (n === y) return; y = n; await pg.waitForTimeout(150); } };
const open = async (ctx, path) => { const p = await ctx.newPage(); await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 }); return p; };

// 1–5 header drop-downs (rebuilt 2026-11-06, replace the old mega menu checks): hover, click, keyboard, mobile sub-items
let p = await open(desk, '/du-an/the-prive/');
const sub = (name) => p.evaluate((n) => { const li = [...document.querySelectorAll('[data-sub]')].find((x) => x.querySelector('.header__toggle').textContent.trim() === n); const u = li?.querySelector('.header__sub'); return { open: !!u && getComputedStyle(u).display !== 'none', expanded: li?.querySelector('.header__toggle').getAttribute('aria-expanded'), links: u ? [...u.querySelectorAll('a')].map((a) => a.textContent.trim()) : [] }; }, name);
await p.hover('.header__toggle >> text=Dự án'); await p.waitForTimeout(150);
const h1 = await sub('Dự án');
check('NT-70 menu thả xuống "Dự án" mở khi rê chuột: 6 dự án + "Tất cả dự án"', h1.open && h1.expanded === 'true' && h1.links.length === 7 && h1.links.at(-1) === 'Tất cả dự án', h1);
await p.mouse.move(5, 500); await p.waitForTimeout(400);
check('NT-70 menu thả xuống đóng sau ~200 ms khi rời chuột', !(await sub('Dự án')).open);
await p.click('.header__toggle >> text=Về Velis'); await p.waitForTimeout(150);
const vv = await sub('Về Velis');
check('NT-70 menu "Về Velis" mở khi bấm: Giới thiệu, Tuyển dụng (Liên hệ là mục riêng – 2026-11-11)', vv.open && vv.links.join() === 'Giới thiệu,Tuyển dụng', vv);
await p.mouse.click(5, 500); await p.waitForTimeout(150);
await p.focus('.header__toggle >> text=Dự án'); await p.keyboard.press('Enter'); await p.keyboard.press('ArrowDown'); await p.waitForTimeout(100);
const k1 = await p.evaluate(() => document.activeElement.closest('.header__sub') ? document.activeElement.textContent.trim() : '');
await p.keyboard.press('Escape'); await p.waitForTimeout(100);
const k2 = await p.evaluate(() => ({ cls: document.activeElement.className, open: document.querySelector('[data-sub].is-open') !== null }));
check('NT-70 menu thả xuống bằng bàn phím: Enter mở, ↓ vào mục đầu, Esc đóng và trả focus', !!k1 && k2.cls.includes('header__toggle') && !k2.open, { k1, k2 });
const mm = await open(mob, '/');
await mm.click('[data-menu-open]'); await mm.waitForTimeout(200);
const ms = await mm.evaluate(() => [...document.querySelectorAll('#menu .menu__sub')].map((u) => u.querySelectorAll('a').length));
check('NT-70 menu thả xuống trên mobile: "Dự án" (7) và "Về Velis" (2) là mục con trong menu', ms.join() === '7,2', ms);
await mm.close();

// 6–9 product tabs + price button
const tabs = await p.evaluate(() => [...document.querySelectorAll('[role=tab]')].map((t) => { const pane = document.getElementById(t.getAttribute('aria-controls')); return { id: t.id || '', name: t.textContent.trim(), data: !!pane?.querySelector('.facts__list, dl, table'), plan: !!pane?.querySelector('.pic img, [data-zoom] img'), btn: !!pane?.querySelector('.btn') }; }));
const full = tabs.find((t) => t.data && t.plan);
check('NT-73 tab có dữ liệu: bảng thông số + mặt bằng', !!full, full?.name || 'không có');
const bare = tabs.find((t) => !t.data);
check('NT-73 tab chưa có dữ liệu: câu hướng dẫn + nút', !bare || bare.btn, bare ? bare.name : 'mọi tab đều có dữ liệu');
await p.locator('[role=tab]', { hasText: full?.name || '' }).first().click(); await p.waitForTimeout(200);
const priceBtn = p.locator('[role=tabpanel]:not([hidden]) a[data-interest]').first();
const want = await priceBtn.getAttribute('data-interest');
await priceBtn.click(); await p.waitForTimeout(300); await still(p);
const formTop = await p.evaluate(() => Math.round(document.querySelector('#tu-van').getBoundingClientRect().top));
check('NT-74 "Nhận bảng giá" cuộn tới form', formTop >= 0 && formTop < 300, `top=${formTop}`);
const interest = await p.evaluate(() => document.querySelector('#tu-van [name=interest]')?.value || '');
check('NT-74 "Nhận bảng giá" điền sẵn dòng sản phẩm', interest === want, interest);

// 10–11 section nav
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
await p.locator('[data-secnav] a[href="#vi-tri"]').first().click(); await p.waitForTimeout(300); await still(p);
const vt = await p.evaluate(() => { const n = document.querySelector('[data-secnav]').getBoundingClientRect(); const s = document.querySelector('#vi-tri').getBoundingClientRect(); return { gap: Math.round(s.top - n.bottom) }; });
check('NT-72 thanh điều hướng mục: bấm cuộn tới Vị trí', vt.gap >= -2 && vt.gap < 120, vt);
const cur = await p.evaluate(() => document.querySelector('[data-secnav] a[aria-current]')?.textContent.trim() || '');
check('NT-72 thanh điều hướng mục: tô mục đang xem', /Vị trí/.test(cur), cur);

// 12–15 gallery
await settle(p);
const g = p.locator('[data-gallery]').first();
await g.scrollIntoViewIfNeeded();
const c0 = await g.locator('[data-counter]').textContent();
await g.locator('[data-next]').click(); await p.waitForTimeout(700);
const c1 = await g.locator('[data-counter]').textContent();
check('NT-75 thư viện ảnh: nút "ảnh sau"', c0.startsWith('1/') && c1.startsWith('2/'), `${c0} → ${c1}`);
await g.locator('.gallery__track button').nth(1).click(); await p.waitForTimeout(400);
check('NT-75 thư viện ảnh: phóng to (lightbox)', await p.evaluate(() => !!document.querySelector('dialog.lightbox[open]')));
await p.keyboard.press('Escape'); await p.waitForTimeout(200);
await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
const brokenPrive = await p.evaluate(() => [...document.images].filter((i) => i.getBoundingClientRect().width > 0 && i.complete && !i.naturalWidth).length);
check('NT-20 không còn ảnh vỡ hiển thị (The Privé)', brokenPrive === 0, `${brokenPrive}`);
const box = await g.boundingBox();
const y0 = await p.evaluate(() => scrollY);
await p.mouse.move(box.x + box.width / 2, box.y + 40); await p.mouse.wheel(0, 400); await p.waitForTimeout(600);
const y1 = await p.evaluate(() => scrollY);
check('NT-75 lăn chuột trên thư viện ảnh vẫn cuộn trang', y1 > y0, `${Math.round(y0)} → ${Math.round(y1)}`);

// 18 form validation
let sent = 0;
p.on('request', (r) => { if (r.url().includes('contact-form-7') && r.method() === 'POST') sent++; });
await p.locator('#tu-van [type=submit]').first().click(); await p.waitForTimeout(500);
const errs = await p.evaluate(() => [...document.querySelectorAll('#tu-van .field__error')].filter((e) => !e.hidden && e.textContent.trim()).length);
check('NT-76 form báo lỗi khi bỏ trống, không gửi đi', errs >= 3 && sent === 0, `${errs} ô lỗi, ${sent} lần gửi`);
await p.close();

// 19–20, 34 /du-an/
p = await open(desk, '/du-an/');
await p.locator('.zfilter [data-key=khu][value=khu-dong]').click(); await p.waitForTimeout(400);
const cnt = (await p.locator('.zfilter [data-count]').textContent()).trim();
const urlKhu = new URL(p.url()).searchParams.get('khu');
check('NT-77 bộ lọc dự án: lọc Khu Đông (ghi ?khu= lên URL)', /Hiển thị \d+\/\d+/.test(cnt) && !/Hiển thị (\d+)\/\1 /.test(cnt + ' ') && urlKhu === 'khu-dong', `${cnt} · ?khu=${urlKhu}`);
await settle(p); await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
const brokenList = await p.evaluate(() => [...document.images].filter((i) => i.getBoundingClientRect().width > 0 && i.complete && !i.naturalWidth).length);
check('NT-20 không còn ảnh vỡ (/du-an/)', brokenList === 0, `${brokenList}`);
// the home area tabs link here: /du-an/?khu=khu-tay opens pre-filtered
await p.goto(BASE + '/du-an/?khu=khu-tay'); await p.waitForTimeout(400);
const pre = await p.evaluate(() => ({ pressed: document.querySelector('.zfilter [data-key=khu][value=khu-tay]')?.getAttribute('aria-pressed'), count: document.querySelector('.zfilter [data-count]')?.textContent.trim() }));
// (recorded at the end, keeps the original numbering)

// 21–22, 33 The Global City
const t = await open(desk, '/du-an/the-global-city/');
await t.locator('[data-filter] .chip', { hasText: 'Biệt thự' }).first().click(); await t.waitForTimeout(400);
const zc = (await t.locator('[data-count]').first().textContent()).trim();
check('NT-77 lọc phân khu theo loại (chip)', /Hiển thị \d+\/5/.test(zc) && !/5\/5/.test(zc), zc);
const cmp = await t.evaluate(() => { const w = document.querySelector('#so-sanh .table-wrap'); return w ? { sw: w.scrollWidth, cw: w.clientWidth } : null; });

// 23 search
const s = await open(desk, '/?s=' + encodeURIComponent('căn hộ palm river'));
const first = (await s.locator('main .card__title').first().textContent()).trim();
check('NT-78 tìm "căn hộ palm river" ra Palm River đầu tiên', /Palm River/.test(first), first);

// 24–29 mobile
const m = await open(mob, '/du-an/the-prive/');
const ctaAtTop = await m.evaluate(async () => { await new Promise((r) => setTimeout(r, 600)); const c = document.querySelector('.cta'); const b = document.querySelector('.hero .actions').getBoundingClientRect(); return { on: c.classList.contains('is-on'), heroBtnBottom: Math.round(b.bottom), vh: innerHeight }; });
await m.locator('[data-menu-open]').first().click(); await m.waitForTimeout(300);
check('NT-79 mobile: menu mở', await m.evaluate(() => !!document.querySelector('dialog.menu[open]')));
await m.locator('[data-menu-close]').first().click(); await m.waitForTimeout(300);
const sn = await m.evaluate(() => { const u = document.querySelector('[data-secnav] ul'); return { sw: u.scrollWidth, cw: u.clientWidth, ox: getComputedStyle(u).overflowX }; });
check('NT-72 mobile: thanh điều hướng mục cuộn ngang', sn.sw > sn.cw && /auto|scroll/.test(sn.ox), sn);
const ctaShown = async () => { await m.waitForTimeout(400); return m.evaluate(() => document.querySelector('.cta').classList.contains('is-on')); };
check('NT-79 mobile: thanh CTA đáy ẩn ở đầu trang', !ctaAtTop.on, ctaAtTop);
await m.evaluate(() => scrollTo(0, 1400)); await m.waitForTimeout(600);
check('NT-79 mobile: thanh CTA đáy hiện sau khi cuộn qua nút hero', await ctaShown());
await m.evaluate(() => scrollTo(0, 0)); await m.waitForTimeout(600);
check('NT-79 mobile: về đầu trang thì thanh CTA ẩn lại', !(await ctaShown()));
await m.goto(BASE + '/du-an/vinhomes-saigon-park/ivy-park/nha-pho/');
const bc = await m.evaluate(() => { const items = [...document.querySelectorAll('.crumbs li')]; const rg = document.createRange(); const tops = new Set(); items.forEach((li) => { rg.selectNodeContents(li); [...rg.getClientRects()].filter((x) => x.width > 0).forEach((x) => tops.add(Math.round(x.top))); }); return tops.size; });
check('NT-80 mobile: breadcrumb tối đa 2 dòng', bc >= 1 && bc <= 2, `${bc} dòng`);

// 30–32 read more, side card mini form, test submission
const r = await open(desk, '/du-an/the-global-city/?utm_source=kiemthu'); // utm is read from the address on load
// 1.0: every long section of a project page is clamped – check the one whose button is clicked
const before = await r.evaluate(() => Math.round(document.querySelector('.clamp.is-clamped')?.getBoundingClientRect().height || 0));
await r.evaluate(() => document.querySelector('.clamp.is-clamped').setAttribute('data-test-clamp', ''));
await r.locator('[data-test-clamp] + .clamp__more').click();
await r.waitForTimeout(400);
const opened = await r.evaluate(() => !document.querySelector('[data-test-clamp]').classList.contains('is-clamped'));
check('NT-57 "Đọc tiếp" mở toàn bộ đoạn dài', before > 0 && opened, `${before}px → ${opened ? 'mở' : 'vẫn thu'}`);
await r.evaluate(() => scrollTo(0, 900)); await r.waitForTimeout(300);
await r.locator('.page__side [data-open-form]').filter({ visible: true }).first().click(); await r.waitForTimeout(300);
check('NT-74 thẻ cột phải: "Nhận bảng giá" mở form gọn tại chỗ', await r.locator('.page__side [data-mini-form]').filter({ visible: true }).count() === 1);
// NT-76: the form request is intercepted in the browser and answered locally – nothing reaches staging (vòng sửa 2026-11-06:
// no submission this round); the check reads the multipart body the theme would send to CF7.
{
const side = r.locator('.page__side [data-mini-form]').filter({ visible: true }).first();
let body = '', reached = 0;
r.on('request', (x) => { if (x.url().includes('contact-form-7') && x.method() === 'POST') reached++; });
await r.route('**/contact-form-7/**', (route) => { body = route.request().postData() || ''; route.fulfill({ status: 200, contentType: 'application/json', body: '{"status":"mail_sent","message":"ok"}' }); });
await side.locator('[name=your-name]').fill('Kiểm thử hệ thống');
await side.locator('[name=your-phone]').fill('0900000000');
await side.locator('input[type=checkbox]').first().check();
await side.locator('[type=submit]').click(); await r.waitForTimeout(800);
const field = (n) => (body.match(new RegExp('name="' + n + '"\\r?\\n\\r?\\n([^\\r\\n]*)')) || [])[1] || '';
const hid = { interest: field('interest'), pageUrl: field('page-url'), utm: field('utm') };
check('NT-76 form (chặn yêu cầu, không gửi): đủ trường ẩn dự án, URL trang, utm', /The Global City/.test(hid.interest) && /the-global-city/.test(hid.pageUrl) && /kiemthu/.test(hid.utm) && reached === 1, hid);
await r.unroute('**/contact-form-7/**');
}

check('NT-53 bảng so sánh full-width, không cuộn ngang', !!cmp && cmp.sw <= cmp.cw + 1, cmp);
check('NT-77 /du-an/?khu= mở sẵn bộ lọc (liên kết tab khu vực trang chủ)', pre.pressed === 'true' && /Hiển thị \d+\//.test(pre.count || ''), pre);

await b.close();
writeFileSync(out, lines.join('\n') + '\n');
console.log(`${lines.filter((l) => l.startsWith('PASS')).length}/${lines.filter((l) => !l.startsWith('SKIP')).length} đạt · ${lines.filter((l) => l.startsWith('SKIP')).length} bỏ (tính năng đã bỏ – chờ duyệt)`);
