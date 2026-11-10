#!/usr/bin/env node
// Vòng sửa trang chủ (2026-11-11): ảnh trước / sau cho từng mục, STAGING chỉ đọc (cookie mật khẩu xem).
// Mỗi ca: [tên, đường dẫn, màn, thao tác]. Màn: d 1536×864@1,25 · f 1920×1080 · i iPhone 14 · w 1366×768 · x 2560×1440.
// Thao tác: top (màn đầu) · full · el:<selector> · hover:<selector> · menu (mở menu mobile) · body (cuộn tới nội dung cột chính).
// Usage: VIEW_PASSWORD_FILE=… node tools/shots_trang_chu.mjs screenshots/on-dinh/trang-chu-truoc
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { login } from './shots_on_dinh.mjs';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const BASE = 'https://staging.velisrealty.vn';
const PERSA = '/blog/spring-ville/thiet-ke-biophilic-persa-place-thu-hut-gioi-tri-thuc/';
const W4 = ['w', 'd', 'f', 'x'];
export const CASES = [
	// 1 header + menu
	...['d', 'f', 'i'].map((s) => ['1-header', '/', s, 'el:header']),
	['1-menu-mobile', '/', 'i', 'menu'],
	['1-menu-ve-velis', '/', 'd', 'hover:.nav [data-dd]:last-of-type, .nav li:has(> ul):last-of-type'],
	// 1b link: breadcrumb, footer, đoạn bài có link (thường + rê chuột)
	...['d', 'i'].map((s) => ['1b-breadcrumb', PERSA, s, 'el:.crumbs']),
	...['d', 'i'].map((s) => ['1b-footer', '/', s, 'el:footer']),
	['1b-link-trong-bai', PERSA, 'd', 'el:.prose p:has(a)'],
	['1b-link-trong-bai-hover', PERSA, 'd', 'hover:.prose p a'],
	// 2 khung 2 cột ở 4 bề rộng
	...W4.flatMap((s) => [['2-persa', PERSA, s, 'body'], ['2-the-global-city', '/du-an/the-global-city/', s, 'body'], ['2-gioi-thieu', '/gioi-thieu/', s, 'body'], ['2-blog', '/blog/', s, 'body']]),
	['2-chinh-sach', '/chinh-sach-bao-mat/', 'x', 'body'],
	// 3 trang chủ
	...['d', 'f', 'i'].flatMap((s) => [['3-doi-tac', '/', s, 'el:.partners-band, section:has(.partners)'], ['3-khoi-velis', '/', s, 'el:#ve-velis'], ['3-form-footer-trang-chu', '/', s, 'el:#tu-van']]),
	...['d', 'i'].flatMap((s) => [['3-form-du-an', '/du-an/the-global-city/', s, 'el:#tu-van'], ['3-form-bai', PERSA, s, 'el:#tu-van']]),
	// 4 danh sách bài
	...['d', 'f', 'i'].flatMap((s) => [['4-blog', '/blog/', s, 'full'], ['4-blog-trang-2', '/blog/page/2/', s, 'top'], ['4-cum', '/blog/the-global-city/', s, 'full'], ['4-tac-gia', '/chuyen-gia/vu-xuan/', s, 'full'], ['4-tim-kiem', '/?s=prive', s, 'full']]),
	// 5 chủ đầu tư
	...['d', 'i'].flatMap((s) => [['5-gamuda-land', '/chu-dau-tu/gamuda-land/', s, 'full'], ['5-masterise-homes', '/chu-dau-tu/masterise-homes/', s, 'full']]),
];
const SCREEN = { d: { viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.25 }, f: { viewport: { width: 1920, height: 1080 } }, w: { viewport: { width: 1366, height: 768 } }, x: { viewport: { width: 2560, height: 1440 } } };

if (import.meta.url === `file://${process.argv[1]}`) {
	const dir = process.argv[2]; mkdirSync(dir, { recursive: true });
	const b = await chromium.launch(), state = await login(b);
	let ok = 0, miss = [];
	for (const [name, path, scr, act] of CASES) {
		const ctx = await b.newContext({ storageState: state, reducedMotion: 'reduce', ...(scr === 'i' ? devices['iPhone 14'] : SCREEN[scr]) });
		const p = await ctx.newPage();
		await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
		await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); } scrollTo(0, 0); document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }); });
		await p.waitForTimeout(300);
		const file = { path: `${dir}/${name}-${scr}.jpg`, type: 'jpeg', quality: 55 };
		try {
			if (act === 'full') await p.screenshot({ ...file, fullPage: true });
			else if (act === 'top') await p.screenshot(file);
			else if (act === 'menu') { await p.locator('.header__menu, [aria-controls="menu"]').first().click(); await p.waitForTimeout(400); await p.screenshot(file); }
			else if (act === 'body') { await p.evaluate(() => { const m = document.querySelector('.page__main, main .prose, main'); scrollTo(0, (m?.getBoundingClientRect().top || 0) + scrollY - 120); }); await p.waitForTimeout(300); await p.screenshot(file); }
			else if (act.startsWith('hover:')) { const l = p.locator(act.slice(6)).first(); await l.scrollIntoViewIfNeeded(); await l.hover(); await p.waitForTimeout(300); const box = await l.boundingBox(); await p.screenshot({ ...file, clip: { x: 0, y: Math.max(0, box.y - 200), width: p.viewportSize().width, height: 480 } }); }
			else { const l = p.locator(act.slice(3)).first(); await l.scrollIntoViewIfNeeded(); await l.screenshot(file); }
			ok++;
		} catch (e) { miss.push(`${name}-${scr}: ${e.message.split('\n')[0]}`); }
		await ctx.close();
	}
	await b.close();
	console.log(`ảnh: ${ok}/${CASES.length}`); miss.forEach((m) => console.log('thiếu', m));
}
