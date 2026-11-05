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

let p = await open('/the-global-city.html');
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
