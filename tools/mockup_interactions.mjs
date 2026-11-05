#!/usr/bin/env node
// Step-2 mockup interactions (local server, read-only): NT-57, NT-72, NT-75, NT-76, NT-77, NT-79, NT-87. One line per check.
// Usage: node tools/mockup_interactions.mjs http://127.0.0.1:8765
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8765';
const rows = [];
const check = (name, ok, info = '') => { rows.push([name, ok]); console.log(`${ok ? 'ĐẠT ' : 'LỖI '} ${name}${info ? ' – ' + JSON.stringify(info) : ''}`); };
const b = await chromium.launch();
const open = async (path, w = 1366, h = 768) => { const p = await (await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })).newPage(); await p.goto(base + path); return p; };

// [mockup] switches change the page in place (no reload), state in the hash, read back on open
let p = await open('/masteri-park-place.html');
await p.evaluate(() => { window.__same = 1; });
await p.click('.mk [data-mk-hero="a"]');
const sw = await p.evaluate(() => ({ same: window.__same === 1, a: !!document.querySelector('.hero.hero--a'), hash: location.hash, search: location.search }));
check('Công tắc mockup: đổi hero A tại chỗ, không tải lại, ghi #hero-a', sw.same && sw.a && sw.hash === '#hero-a' && !sw.search, sw);
await p.click('.mk [data-mk-tam="0"]');
const tg = await p.evaluate(() => ({ hidden: getComputedStyle(document.querySelector('.tmp')).display === 'none', hash: location.hash, same: window.__same === 1 }));
check('Công tắc mockup: ẩn nhãn ảnh tạm tại chỗ, ghi #tam-0', tg.hidden && tg.same && /tam-0/.test(tg.hash), tg);
await p.reload();
const rd = await p.evaluate(() => ({ a: !!document.querySelector('.hero.hero--a'), tam: document.documentElement.dataset.tam, pressed: document.querySelector('.mk-float [data-mk-hero="a"]').getAttribute('aria-pressed') }));
check('Công tắc mockup: mở lại đọc trạng thái từ #hash (A, nhãn ẩn)', rd.a && rd.tam === '0' && rd.pressed === 'true', rd);
await p.click('.mk-float summary'); await p.click('.mk-float [data-mk-hero="b"]');
check('Công tắc nổi góc dưới phải: đổi về hero B', await p.evaluate(() => !!document.querySelector('.hero.hero--b') && location.hash.startsWith('#hero-b')));
await p.context().close();

// home (broker positioning): no hero A/B; short form in the first screen; find-by-need chips filter the project grid
p = await open('/trang-chu.html?utm_source=thu&utm_medium=mockup');
check('Trang chủ: không còn công tắc hero A/B', await p.evaluate(() => !document.querySelector('.hero') && !document.querySelector('[data-mk-hero]')));
const sf = 'form.advise__form';
await p.click(`${sf} [type=submit]`);
const se = await p.evaluate((s) => ({ errs: document.querySelectorAll(`${s} .is-error`).length, focus: document.activeElement.id, sent: document.querySelector(s).dataset.sent || '' }), sf);
check('Form ngắn: bỏ trống → báo lỗi từng trường, không gửi, focus ô đầu', se.errs === 3 && se.focus === 'n-ten' && !se.sent, se);
let req = 0; p.on('request', (r) => { if (!r.url().startsWith('data:') && !r.url().startsWith('http://127.0.0.1')) req++; });
await p.fill(`${sf} [name=ten]`, 'Nguyễn Văn Thử'); await p.fill(`${sf} [name=sdt]`, '0900000000');
await p.selectOption(`${sf} [name=interest]`, 'The Global City'); await p.check(`${sf} [type=checkbox]`);
await p.click(`${sf} [type=submit]`);
const sent = JSON.parse(await p.evaluate((s) => document.querySelector(s).dataset.sent || '{}', sf));
check('Form ngắn: gửi thử cục bộ đủ trường ẩn như form chính (dự án, URL trang, utm), không gọi mạng', sent.interest === 'The Global City' && /trang-chu\.html\?utm_source=thu/.test(sent['page-url']) && sent.utm === 'utm_source=thu&utm_medium=mockup' && req === 0, { sent, req });
const hid = await p.evaluate(() => [...document.querySelectorAll('#tu-van form [type=hidden]')].map((i) => i.name).sort().join(','));
check('Form chính: cùng trường ẩn interest, page-url, utm', hid === 'interest,page-url,utm', hid);
await p.click('.finder [data-key="khu"][value="khu-dong"]');
await p.click('.finder [data-key="loai"][value="biet-thu"]');
const fr = await p.evaluate(() => ({ count: document.querySelector('.finder [data-count]').textContent, n: document.querySelector('#du-an .grid').dataset.n, shown: [...document.querySelectorAll('#du-an .card:not([hidden]) .card__title')].map((t) => t.textContent) }));
check('Tìm theo nhu cầu: Khu Đông + Biệt thự → 1 dự án (The Global City), lưới theo số thẻ', fr.n === '1' && fr.shown.join() === 'The Global City' && /1\/6/.test(fr.count), fr);
await p.click('.finder [data-clear]');
check('Tìm theo nhu cầu: Xóa lọc → 6/6', await p.evaluate(() => document.querySelector('#du-an .grid').dataset.n === '6'));
await p.context().close();

p = await open('/the-global-city.html');
await p.click('.tabs a[href="#vi-tri"]'); await p.waitForTimeout(300);
const vt = await p.evaluate(() => ({ top: Math.round(document.getElementById('vi-tri').getBoundingClientRect().top), cur: document.querySelector('.tabs a[aria-current="true"]')?.textContent }));
check('NT-72 thanh mục: bấm cuộn tới Vị trí, tô mục đang xem', vt.top >= 0 && vt.top < 200 && /Vị trí/.test(vt.cur), vt);
const c0 = await p.textContent('.gallery__count');
await p.click('.gallery [data-next]'); await p.waitForTimeout(400);
const c1 = await p.textContent('.gallery__count');
check('NT-75 thư viện: nút "ảnh sau" đổi bộ đếm, không tự chạy', c0.startsWith('1/') && c1.startsWith('2/'), `${c0} → ${c1}`);
const clamp = await p.evaluate(() => { const el = document.querySelector('#tong-quan .clamp'); const h = el.clientHeight; el.nextElementSibling.click(); return [h, el.clientHeight]; });
check('NT-57 "Đọc tiếp" mở toàn bộ đoạn dài', clamp[0] > 0 && clamp[1] > clamp[0], clamp);
await p.click('[data-filter] button[value="biet-thu"]');
const zc = await p.textContent('[data-count]');
const shownN = await p.evaluate(() => [...document.querySelectorAll('.zones')].map((g) => g.dataset.n + '/' + [...g.children].filter((c) => !c.hidden).length));
check('NT-77 lọc phân khu theo loại (chip), lưới theo số thẻ còn lại', /Hiển thị 1\/5/.test(zc) && shownN.every((x) => x.split('/')[0] === x.split('/')[1]), { zc, shownN });
await p.click('form.form button[type=submit]');
const errs = await p.evaluate(() => document.querySelectorAll('form.form .is-error').length);
const focused = await p.evaluate(() => document.activeElement.id);
check('NT-76 form báo lỗi khi bỏ trống, không gửi, focus ô lỗi đầu', errs === 3 && focused === 'ten', { errs, focused });
await p.keyboard.press('Tab');
const ring = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth);
check('NT-87 viền focus khi dùng bàn phím', /solid 2px/.test(ring), ring);
await p.context().close();

p = await open('/masteri-park-place.html', 390, 844);
await p.click('.header__menu');
check('NT-79 mobile: menu mở', await p.evaluate(() => document.getElementById('menu').open));
await p.click('[data-menu-close]');
check('NT-79 mobile: menu đóng', !(await p.evaluate(() => document.getElementById('menu').open)));
const ctaOn = () => p.evaluate(() => getComputedStyle(document.querySelector('.cta')).visibility === 'visible');
check('NT-79 mobile: thanh CTA đáy ẩn ở đầu trang', !(await ctaOn()));
await p.evaluate(() => scrollTo(0, 1400)); await p.waitForTimeout(400);
check('NT-79 mobile: thanh CTA đáy hiện sau khi cuộn qua nút hero', await ctaOn());
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
check('NT-79 mobile: về đầu trang thì thanh CTA ẩn lại', !(await ctaOn()));
const sn = await p.evaluate(() => { const u = document.querySelector('.tabs ul'); return { sw: u.scrollWidth, cw: u.clientWidth, ox: getComputedStyle(u).overflowX }; });
check('NT-72 mobile: thanh mục cuộn ngang khi dài hơn khung', sn.sw <= sn.cw || /auto|scroll/.test(sn.ox), sn);
const bc = await p.evaluate(() => { const r = [...document.querySelectorAll('.crumbs li')].map((l) => Math.round(l.getBoundingClientRect().top)); return new Set(r).size; });
check('NT-80 mobile: breadcrumb ≤ 2 dòng', bc <= 2, `${bc} dòng`);
await p.context().close();
await b.close();
const bad = rows.filter(([, ok]) => !ok).length;
console.log(`${rows.length - bad}/${rows.length} đạt`);
process.exit(bad ? 1 : 0);
