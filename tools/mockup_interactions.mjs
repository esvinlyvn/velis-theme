#!/usr/bin/env node
// Step-2 mockup interactions (local server, read-only): NT-57, NT-72, NT-75, NT-76, NT-77, NT-79, NT-87, home area tabs + form. One line per check.
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
await p.click('.mk [data-mk-tam="1"]');
const tg = await p.evaluate(() => ({ shown: getComputedStyle(document.querySelector('.tmp')).display !== 'none', hash: location.hash, same: window.__same === 1 }));
check('Công tắc mockup: bật nhãn ảnh tạm tại chỗ (mặc định ẩn, 1.8), ghi #tam-1', tg.shown && tg.same && /tam-1/.test(tg.hash), tg);
await p.reload();
const rd = await p.evaluate(() => ({ a: !!document.querySelector('.hero.hero--a'), tam: document.documentElement.dataset.tam, pressed: document.querySelector('.mk-float [data-mk-hero="a"]').getAttribute('aria-pressed') }));
check('Công tắc mockup: mở lại đọc trạng thái từ #hash (A, nhãn hiện)', rd.a && rd.tam === '1' && rd.pressed === 'true', rd);
await p.click('.mk-float summary'); await p.click('.mk-float [data-mk-hero="b"]');
check('Công tắc nổi góc dưới phải: đổi về hero B', await p.evaluate(() => !!document.querySelector('.hero.hero--b') && location.hash.startsWith('#hero-b')));
await p.context().close();

// home (round 5): split hero, no hero switch, "ảnh tạm" hidden by default, one-at-a-time area tabs, dark form with the CF7 hidden fields
p = await open('/trang-chu.html?utm_source=thu&utm_medium=mockup');
check('Trang chủ: hero tràn 0.9.8 (.hero--home), không có công tắc hero A/B, nhãn ảnh tạm mặc định ẩn', await p.evaluate(() => !!document.querySelector('.hero.hero--home > img.hero__img') && !document.querySelector('.hero--a, .hero--b, [data-mk-hero]') && document.documentElement.dataset.tam === '0' && [...document.querySelectorAll('.tmp')].every((t) => getComputedStyle(t).display === 'none')));
const st = await p.evaluate(async () => { const ul = document.querySelector('.feats ul'), [prev, next] = document.querySelectorAll('.feats__nav button'), x0 = ul.scrollLeft, d0 = prev.disabled; next.click(); await new Promise((r) => setTimeout(r, 600)); return { x0, x1: ul.scrollLeft, d0, d1: prev.disabled }; });
check('Dải "Dự án nổi bật": mũi tên sau trượt dải, mũi tên trước tắt ở đầu rồi bật, không tự chạy', st.x0 === 0 && st.x1 > 0 && st.d0 && !st.d1, st);
await p.evaluate(() => { document.querySelector('.feats ul').scrollLeft = 0; });
const tabs = (v) => p.click(v ? `.ftabs [value="${v}"]` : '.ftabs [data-clear]');
const fs = () => p.evaluate(() => ({ n: document.querySelector('#du-an .grid').dataset.n, vis: [...document.querySelectorAll('#du-an .grid > *')].filter((c) => c.getClientRects().length).length, w: Math.round(Math.max(0, ...[...document.querySelectorAll('#du-an .grid > *')].filter((c) => c.getClientRects().length).map((c) => c.getBoundingClientRect().width))), frame: Math.round(document.querySelector('#du-an .grid').getBoundingClientRect().width), shown: [...document.querySelectorAll('#du-an .grid > *')].filter((c) => c.getClientRects().length).map((c) => c.querySelector('.card__title')).map((t) => t.textContent).sort().join(', '), pressed: [...document.querySelectorAll('.ftabs [aria-pressed="true"]')].map((x) => x.textContent.trim()), count: document.querySelector('#du-an [data-count]').textContent }));
await tabs('khu-dong'); const f1 = await fs();
check('Tab khu vực: Khu Đông → 3 dự án (Palm City, The Global City, The Privé), chỉ 1 tab được chọn', f1.n === '3' && f1.vis === 3 && f1.shown === 'Palm City, The Global City, The Privé' && f1.pressed.join() === 'Khu Đông', f1);
await tabs('khu-tay'); const f2 = await fs();
check('Tab khu vực: Khu Tây → đúng 1 thẻ hiện (Ansana by Kita), thẻ dọc rộng 1/3 khung (không thẻ ngang), Khu Đông tự bỏ chọn', f2.n === '1' && f2.vis === 1 && f2.w < f2.frame / 2 && f2.shown === 'Ansana by Kita' && f2.pressed.join() === 'Khu Tây', f2);
await tabs(); const f3 = await fs();
check('Tab khu vực: Tất cả → 6 dự án, tab "Tất cả" được chọn', f3.n === '6' && f3.pressed.join() === 'Tất cả' && /6\/6/.test(f3.count), f3);
const hid = await p.evaluate(() => [...document.querySelectorAll('#tu-van form [type=hidden]')].map((i) => i.name).sort().join(','));
check('Form tư vấn: trường ẩn interest, page-url, utm như CF7', hid === 'interest,page-url,utm', hid);
let req = 0; p.on('request', (r) => { if (!r.url().startsWith('data:') && !r.url().startsWith('http://127.0.0.1')) req++; });
const tf = '#tu-van form';
await p.fill(`${tf} [name=ten]`, 'Nguyễn Văn Thử'); await p.fill(`${tf} [name=sdt]`, '0900000000'); await p.check(`${tf} [type=checkbox]`);
await p.click(`${tf} [type=submit]`);
const sent = JSON.parse(await p.evaluate((s) => document.querySelector(s).dataset.sent || '{}', tf));
check('Form tư vấn: gửi thử cục bộ đủ trường ẩn (URL trang, utm), không gọi mạng', /trang-chu\.html\?utm_source=thu/.test(sent['page-url']) && sent.utm === 'utm_source=thu&utm_medium=mockup' && req === 0, { sent, req });
await p.context().close();

p = await open('/the-global-city.html');
await p.click('.tabs a[href="#vi-tri"]'); await p.waitForTimeout(300);
const vt = await p.evaluate(() => ({ top: Math.round(document.getElementById('vi-tri').getBoundingClientRect().top), cur: document.querySelector('.tabs a[aria-current="true"]')?.textContent }));
check('NT-72 thanh mục: bấm cuộn tới Vị trí, tô mục đang xem', vt.top >= 0 && vt.top < 200 && /Vị trí/.test(vt.cur), vt);
const c0 = await p.textContent('.gallery__count');
await p.click('.gallery [data-next]'); await p.waitForTimeout(400);
const c1 = await p.textContent('.gallery__count');
check('NT-75 thư viện: nút "ảnh sau" đổi bộ đếm, không tự chạy', c0.startsWith('1/') && c1.startsWith('2/'), `${c0} → ${c1}`);
const clamp = await p.evaluate(() => { const el = document.querySelector('.clamp'); const h = el.clientHeight; el.nextElementSibling.click(); return [h, el.clientHeight, document.querySelectorAll('.clamp').length]; });
check('NT-57 "Đọc tiếp" mở toàn bộ đoạn dài (1 vùng thu gọn / trang)', clamp[0] > 0 && clamp[1] > clamp[0] && clamp[2] === 1, clamp);
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
