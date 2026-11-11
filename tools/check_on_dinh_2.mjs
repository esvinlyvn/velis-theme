#!/usr/bin/env node
// Vòng bố cục + ổn định, mục 2: kiểm trên STAGING với vai KHÁCH (chỉ cookie mật khẩu xem, không đăng nhập WordPress).
// Bộ lọc bấm thật (số thẻ hiện = số đếm, bề rộng thẻ 3 / 2 / 1 cột), blog / tìm kiếm phân trang, mã trả về của URL tài khoản
// + style guide, REST users, footer mạng xã hội. Usage: VIEW_PASSWORD_FILE=… [BROWSER=webkit] node tools/check_on_dinh_2.mjs [out.json]
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const pw = createRequire(import.meta.url)('playwright');
const BASE = 'https://staging.velisrealty.vn';
const engine = pw[process.env.BROWSER || 'chromium'];
const rows = []; const ok = (name, pass, info = '') => { rows.push({ name, pass, info }); console.log(`${pass ? 'ĐẠT' : 'LỖI'} ${name}${info !== '' ? ' – ' + JSON.stringify(info) : ''}`); };
const b = await engine.launch();
const lc = await b.newContext(); const lp = await lc.newPage();
await lp.goto(BASE + '/'); await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
const state = await lc.storageState(); await lc.close();

// grid state: visible cards, counter text, card widths vs frame
const grid = (sel) => (p) => p.evaluate((s) => {
	const g = document.querySelector(s); const vis = [...g.children].filter((c) => c.getClientRects().length);
	const fw = g.getBoundingClientRect().width, ws = vis.map((c) => Math.round(c.getBoundingClientRect().width));
	return { vis: vis.length, dem: (document.querySelector('[data-count]')?.textContent || '').trim(), w: Math.max(0, ...ws), wmin: Math.min(...ws), frame: Math.round(fw), empty: !!document.querySelector('[data-empty]:not([hidden])') };
}, sel);
const colsFor = (vw) => (vw >= 1024 ? 3 : vw >= 768 ? 2 : 1);
for (const [vw, vh] of [[1536, 864], [900, 900], [390, 844]]) {
	const ctx = await b.newContext({ storageState: state, viewport: { width: vw, height: vh } }); const p = await ctx.newPage();
	const cols = colsFor(vw), want = (fw) => Math.round((fw - 24 * (cols - 1)) / cols);
	await p.goto(BASE + '/', { waitUntil: 'load' });
	const home = grid('#du-an .grid');
	for (const t of await p.locator('.ftabs button').all()) {
		const label = (await t.textContent()).trim();
		if (!(await t.isVisible())) await t.scrollIntoViewIfNeeded();
		await t.click(); await p.waitForTimeout(150);
		const g = await home(p); const n = +(g.dem.match(/(\d+)\//) || [])[1];
		ok(`trang chủ ${vw}px tab "${label}": thẻ hiện = số đếm, ${cols} cột`, g.vis === n && Math.abs(g.w - want(g.frame)) <= 2 && Math.abs(g.wmin - g.w) <= 1, g);
	}
	await p.goto(BASE + '/du-an/', { waitUntil: 'load' });
	const dl = grid('#du-an-luoi');
	const chips = vw >= 768 ? await p.locator('.zfilter button.chip').all() : [];
	for (const c of chips) {
		const label = `${await c.getAttribute('data-key')}=${await c.getAttribute('value')}`;
		await c.click(); await p.waitForTimeout(150);
		const g = await dl(p); const n = +(g.dem.match(/(\d+)\//) || [])[1];
		ok(`/du-an/ ${vw}px chip ${label}: thẻ hiện = số đếm, ${cols} cột${n ? '' : ', 0 kết quả có thông báo'}`, g.vis === n && (n ? Math.abs(g.w - want(g.frame)) <= 2 : g.empty), g);
		await c.click(); await p.waitForTimeout(100); // back off
	}
	if (vw < 768) for (const s of await p.locator('select.zfilter__select').all()) {
		const vals = await s.locator('option').evaluateAll((o) => o.map((x) => x.value).filter(Boolean));
		for (const v of vals) { await s.selectOption(v); await p.waitForTimeout(150); const g = await dl(p); const n = +(g.dem.match(/(\d+)\//) || [])[1]; ok(`/du-an/ ${vw}px ô chọn ${await s.getAttribute('data-key')}=${v}: thẻ hiện = số đếm, 1 cột`, g.vis === n && (n ? Math.abs(g.w - g.frame) <= 2 : g.empty), g); }
		await s.selectOption('');
	}
	// 0 results: two chips that exclude each other (desktop)
	if (vw >= 768) {
		await p.goto(BASE + '/du-an/?khu=khu-tay&cdt=masterise-homes', { waitUntil: 'load' });
		const g = await dl(p); ok(`/du-an/ ${vw}px 0 kết quả: thông báo + "Xem tất cả dự án"`, g.vis === 0 && g.empty, g);
	}
	await ctx.close();
}
const ctx = await b.newContext({ storageState: state }); const p = await ctx.newPage();
const code = async (u) => (await p.request.get(BASE + u, { maxRedirects: 0 })).status();
ok('/chuyen-gia/claude-bot/ → 404', (await code('/chuyen-gia/claude-bot/')) === 404);
ok('/chuyen-gia/vu-xuan/ → 200 (có bài)', (await code('/chuyen-gia/vu-xuan/')) === 200);
for (const n of [1, 2, 3]) ok(`/?author=${n} → 404`, (await code(`/?author=${n}`)) === 404);
ok('/wp-json/wp/v2/users → 401', (await code('/wp-json/wp/v2/users')) === 401);
ok('/wp-json/wp/v2/users/1 → 401', (await code('/wp-json/wp/v2/users/1')) === 401);
ok('/velis-style-guide/ → 404', (await code('/velis-style-guide/')) === 404);
ok('/blog/page/2/ → 200', (await code('/blog/page/2/')) === 200);
ok('/blog/page/9/ → 200 (102 bài / 12)', (await code('/blog/page/9/')) === 200);
await p.goto(BASE + '/blog/page/2/', { waitUntil: 'load' });
ok('/blog/page/2/: 12 thẻ bài, có phân trang, hàng cụm dưới phần đầu', await p.evaluate(() => document.querySelectorAll('[data-chipgrid] .grid > .card').length === 12 && !!document.querySelector('nav[aria-label="Phân trang"]') && !!document.querySelector('nav[aria-label="Cụm bài viết"]')));
await p.goto(BASE + '/?s=prive', { waitUntil: 'load' });
const sr = await p.evaluate(() => ({ heads: [...document.querySelectorAll('.sechead h2')].map((h) => h.textContent.trim()), titles: [...document.querySelectorAll('.card__title')].map((t) => t.textContent.trim()), pages: !!document.querySelector('nav[aria-label="Phân trang"]') }));
ok('tìm "prive": trang The Privé + bài The Privé, nhóm theo loại, có phân trang', sr.titles.includes('The Privé') && sr.titles.filter((t) => /Privé/i.test(t)).length > 1 && sr.heads.includes('Dự án') && sr.heads.includes('Bài viết') && sr.pages, sr.heads);
await p.goto(BASE + '/?s=masteri', { waitUntil: 'load' });
ok('tìm "masteri": có nhóm phân khu', await p.evaluate(() => [...document.querySelectorAll('.sechead h2')].some((h) => /Phân khu/.test(h.textContent))));
await p.goto(BASE + '/blog/the-prive/', { waitUntil: 'load' });
ok('breadcrumb cụm: mục cuối là tên cụm, không "›" thừa', await p.evaluate(() => { const o = document.querySelector('.crumbs'); return o.lastElementChild.matches('[aria-current]') && getComputedStyle(o.lastElementChild, '::after').content === 'none' && !/›\s*$/.test(o.textContent); }));
const soc = await p.evaluate(() => [...document.querySelectorAll('.footer__social a')].map((a) => a.textContent.trim() + ' ' + a.href));
ok('footer: chỉ mạng có URL trong cài đặt Rank Math', soc.length === 7, soc);
let smap = '';
for (const u of ['/sitemap_index.xml', '/author-sitemap.xml', '/page-sitemap.xml']) smap += await (await p.request.get(BASE + u)).text().catch(() => '');
ok('sitemap (khách bị chặn trên staging; xem bản đăng nhập ở báo cáo) không chứa claude-bot / style guide', !/claude-bot|velis-style-guide/.test(smap));
await b.close();
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(rows, null, 1));
console.log(`${rows.filter((r) => r.pass).length}/${rows.length} đạt`);
process.exit(rows.every((r) => r.pass) ? 0 : 1);
