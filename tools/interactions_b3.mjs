#!/usr/bin/env node
// Step 3 – the mockup's 24 interaction checks (tools/mockup_interactions.mjs) re-targeted to STAGING (theme 1.0, mockup
// markup). The 4 review-switch checks of the mockup become their staging equivalents (?velis_hero=a|b, no "ảnh tạm" tag).
// The form check never sends: the CF7 request is answered locally by page.route (the one real test submission of the round
// is check 32 of tools/interactions.mjs).
// Usage: VIEW_PASSWORD_FILE=… node tools/interactions_b3.mjs out.txt
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const PW = createRequire(import.meta.url)('playwright');
const chromium = process.env.BROWSER === 'webkit' ? PW.webkit : PW.chromium; // BROWSER=webkit: Safari engine (bước 4)
const BASE = 'https://staging.velisrealty.vn', TGC = '/du-an/the-global-city/', MPP = '/du-an/the-global-city/masteri-park-place/';
const rows = [];
const check = (name, ok, info = '') => { rows.push(`${ok ? 'PASS' : 'FAIL'} ${name}${info !== '' ? ' – ' + JSON.stringify(info) : ''}`); console.log(rows.at(-1)); };
const b = await chromium.launch();
const lc = await b.newContext(), lp = await lc.newPage();
await lp.goto(BASE + '/'); await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
const storageState = await lc.storageState(); await lc.close();
const open = async (path, w = 1366, h = 768) => { const p = await (await b.newContext({ storageState, viewport: { width: w, height: h }, reducedMotion: 'reduce' })).newPage(); await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 }); return p; };

// 1–4: staging equivalents of the mockup switches
let p = await open(MPP + '?velis_hero=a');
check('Ép hero A bằng ?velis_hero=a (chỉ staging)', await p.evaluate(() => !!document.querySelector('.hero.hero--a')));
await p.goto(BASE + MPP + '?velis_hero=b');
check('Ép hero B bằng ?velis_hero=b (chỉ staging)', await p.evaluate(() => !!document.querySelector('.hero.hero--b')));
check('Không có nhãn "ảnh tạm" / công tắc mockup trên trang thật (1.8)', await p.evaluate(() => !document.querySelector('.tmp, .mk, .mk-float, .draft')));
await p.goto(BASE + MPP);
check('Không tham số: kiểu hero theo cỡ file (X-02)', await p.evaluate(() => !!document.querySelector('.hero.hero--a, .hero.hero--b')));
await p.context().close();

// 5–12: home
p = await open('/?utm_source=thu&utm_medium=b3');
check('Trang chủ: hero tràn 0.9.8 (.hero--home), không công tắc A/B', await p.evaluate(() => !!document.querySelector('.hero.hero--home > img.hero__img') && !document.querySelector('.hero--a, .hero--b, [data-mk-hero]')));
const st = await p.evaluate(async () => { const ul = document.querySelector('.feats ul'), [prev, next] = document.querySelectorAll('.feats__nav button'), x0 = ul.scrollLeft, d0 = prev.disabled; next.click(); await new Promise((r) => setTimeout(r, 900)); return { x0, x1: ul.scrollLeft, d0, d1: prev.disabled }; });
check('Dải "Dự án nổi bật": mũi tên sau trượt dải, mũi tên trước tắt ở đầu rồi bật, không tự chạy', st.x0 === 0 && st.x1 > 0 && st.d0 && !st.d1, st);
const tabs = (v) => p.click(v ? `.ftabs [value="${v}"]` : '.ftabs [data-clear]');
const fs = () => p.evaluate(() => ({ n: document.querySelector('#du-an .grid').dataset.n, shown: [...document.querySelectorAll('#du-an .card:not([hidden]) .card__title')].map((t) => t.textContent.trim()).sort().join(', '), pressed: [...document.querySelectorAll('.ftabs [aria-pressed="true"]')].map((x) => x.textContent.trim()), count: document.querySelector('#du-an [data-count]')?.textContent || '', all: document.querySelector('#du-an .more-center a')?.getAttribute('href') || '' }));
await tabs('khu-dong'); const f1 = await fs();
check('Tab khu vực: Khu Đông → 3 dự án (Palm City, The Global City, The Privé), chỉ 1 tab được chọn, "Xem tất cả" mở /du-an/?khu=khu-dong', f1.n === '3' && f1.shown === 'Palm City, The Global City, The Privé' && f1.pressed.join() === 'Khu Đông' && /\/du-an\/\?khu=khu-dong/.test(f1.all), f1);
await tabs('khu-tay'); const f2 = await fs();
check('Tab khu vực: Khu Tây → 1 dự án (Ansana by Kita) thành thẻ rộng, Khu Đông tự bỏ chọn', f2.n === '1' && f2.shown === 'Ansana by Kita' && f2.pressed.join() === 'Khu Tây', f2);
await tabs(); const f3 = await fs();
check('Tab khu vực: Tất cả → 6 dự án, tab "Tất cả" được chọn', f3.n === '6' && f3.pressed.join() === 'Tất cả', f3);
const hid = await p.evaluate(() => [...document.querySelectorAll('#tu-van form [type=hidden]')].map((i) => i.name).sort().join(','));
check('Form tư vấn: trường ẩn interest, page-url, utm như CF7', hid === 'interest,page-url,utm', hid);
let body = '';
await p.route(/contact-form-7\/v1\/contact-forms\/\d+\/feedback/, (r) => { body = r.request().postData() || ''; r.fulfill({ status: 200, contentType: 'application/json', body: '{"status":"mail_sent","message":"ok"}' }); });
const tf = '#tu-van form';
await p.fill(`${tf} [name=your-name]`, 'Nguyễn Văn Thử'); await p.fill(`${tf} [name=your-phone]`, '0900000000'); await p.check(`${tf} [type=checkbox]`);
await p.click(`${tf} [type=submit]`); await p.waitForTimeout(1500);
const okShown = await p.evaluate((s) => !document.querySelector(s + ' .form__ok, ' + s + ' [role=status]')?.hidden, tf);
check('Form tư vấn: yêu cầu CF7 có đủ trường ẩn (URL trang, utm) – chặn tại máy, không gửi thật', /page-url/.test(body) && /utm_source=thu/.test(decodeURIComponent(body)) && okShown, { len: body.length, okShown });
await p.context().close();

// 13–18: project page (desktop)
p = await open(TGC);
await p.click('.tabs a[href="#vi-tri"]'); await p.waitForTimeout(1200);
const vt = await p.evaluate(() => ({ top: Math.round(document.getElementById('vi-tri').getBoundingClientRect().top), cur: document.querySelector('.tabs a[aria-current="true"]')?.textContent }));
check('NT-72 thanh mục: bấm cuộn tới Vị trí, tô mục đang xem', vt.top >= 0 && vt.top < 220 && /Vị trí/.test(vt.cur || ''), vt);
const c0 = await p.textContent('.gallery__count');
await p.click('.gallery [data-next]'); await p.waitForTimeout(600);
const c1 = await p.textContent('.gallery__count');
check('NT-75 thư viện: nút "ảnh sau" đổi bộ đếm, không tự chạy', c0.startsWith('1/') && c1.startsWith('2/'), `${c0} → ${c1}`);
// 2.4: the one collapsed block is the longest one on the page, wherever it is
const clamp = await p.evaluate(() => { const el = document.querySelector('.clamp.is-clamped') || document.querySelector('.clamp'); const h = el.clientHeight; el.nextElementSibling.click(); return [h, el.clientHeight]; });
check('NT-57 "Đọc tiếp" mở toàn bộ đoạn dài', clamp[0] > 0 && clamp[1] > clamp[0], clamp);
await p.click('[data-filter] button[value="biet-thu"]'); await p.waitForTimeout(300);
const zc = await p.textContent('#phan-khu [data-count]');
const shownN = await p.evaluate(() => [...document.querySelectorAll('.zones')].map((g) => g.dataset.n + '/' + [...g.children].filter((c) => !c.hidden).length));
check('NT-77 lọc phân khu theo loại (chip), lưới theo số thẻ còn lại', /Hiển thị 1\/5/.test(zc) && shownN.every((x) => x.split('/')[0] === x.split('/')[1]), { zc, shownN });
await p.click('#tu-van form button[type=submit]');
const errs = await p.evaluate(() => document.querySelectorAll('#tu-van form .is-error').length);
const focused = await p.evaluate(() => document.activeElement.name);
check('NT-76 form báo lỗi khi bỏ trống, không gửi, focus ô lỗi đầu', errs === 3 && focused === 'your-name', { errs, focused });
await p.keyboard.press('Tab');
const ring = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth);
check('NT-87 viền focus khi dùng bàn phím', /solid 2px/.test(ring), ring);
await p.context().close();

// 19–24: phân khu page (phone)
p = await open(MPP, 390, 844);
await p.click('.header__menu');
check('NT-79 mobile: menu mở', await p.evaluate(() => document.getElementById('menu').open));
await p.click('[data-menu-close]');
check('NT-79 mobile: menu đóng', !(await p.evaluate(() => document.getElementById('menu').open)));
const ctaOn = () => p.evaluate(() => getComputedStyle(document.querySelector('.cta')).visibility === 'visible');
check('NT-79 mobile: thanh CTA đáy ẩn ở đầu trang', !(await ctaOn()));
await p.evaluate(() => scrollTo(0, 1400)); await p.waitForTimeout(600);
check('NT-79 mobile: thanh CTA đáy hiện sau khi cuộn qua nút hero', await ctaOn());
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
check('NT-79 mobile: về đầu trang thì thanh CTA ẩn lại', !(await ctaOn()));
const sn = await p.evaluate(() => { const u = document.querySelector('.tabs ul'); return { sw: u.scrollWidth, cw: u.clientWidth, ox: getComputedStyle(u).overflowX }; });
check('NT-72 mobile: thanh mục cuộn ngang khi dài hơn khung', sn.sw <= sn.cw || /auto|scroll/.test(sn.ox), sn);
const bc = await p.evaluate(() => new Set([...document.querySelectorAll('.crumbs li')].map((l) => Math.round(l.getBoundingClientRect().top))).size);
check('NT-80 mobile: breadcrumb ≤ 2 dòng', bc <= 2, `${bc} dòng`);
await p.context().close();
await b.close();
const bad = rows.filter((r) => r.startsWith('FAIL')).length;
rows.push(`${rows.length - bad}/${rows.length} đạt`);
writeFileSync(process.argv[2] || 'tuong-tac-b3.txt', rows.join('\n') + '\n');
console.log(rows.at(-1));
process.exit(bad ? 1 : 0);
