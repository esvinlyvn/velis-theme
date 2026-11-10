#!/usr/bin/env node
// Vòng bố cục + ổn định: ảnh trước / sau cho từng lỗi người soát nêu (2026-11-10), STAGING chỉ đọc (cookie mật khẩu xem).
// Mỗi ca: [tên, đường dẫn, màn (d = 1536×864 @1,25 | m = 390×844 @2), thao tác]. Ghi kèm chiều cao trang (lỗi độ dài).
// Usage: VIEW_PASSWORD_FILE=… node tools/shots_on_dinh.mjs screenshots/on-dinh/truoc
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = 'https://staging.velisrealty.vn';
export const CASES = [
	['loc-trang-chu-khu-tay', '/', 'd', 'tab:Khu Tây'],
	['loc-du-an-khu-vuc', '/du-an/', 'd', 'chip:khu'],
	['hai-cot-50-50-the-global-city', '/du-an/the-global-city/', 'd', 'top'],
	['do-dai-the-global-city', '/du-an/the-global-city/', 'd', 'height'],
	['do-dai-vinhomes-saigon-park', '/du-an/vinhomes-saigon-park/', 'd', 'height'],
	['do-dai-palm-river', '/du-an/palm-city/palm-river/', 'd', 'height'],
	['do-dai-persa-place', '/du-an/spring-ville/persa-place/', 'd', 'height'],
	['blog-khong-phan-trang', '/blog/', 'd', 'bottom'],
	['phan-dau-nua-trai-gioi-thieu', '/gioi-thieu/', 'd', 'top'],
	['the-khong-thong-nhat-chu-dau-tu', '/chu-dau-tu/', 'd', 'full'],
	['khoi-trong-cdt-0-du-an', '/chu-dau-tu/sun-group/', 'd', 'full'],
	['tac-gia-thieu-anh', '/chuyen-gia/vu-xuan/', 'd', 'top'],
	['khung-phong-anh-the-prive', '/du-an/the-prive/', 'd', 'zoom'],
	['khung-phong-anh-mobile', '/du-an/the-prive/', 'm', 'zoom'],
	['lo-tai-khoan-claude-bot', '/chuyen-gia/claude-bot/', 'd', 'top'],
	['style-guide-cong-khai', '/velis-style-guide/', 'd', 'top'],
	['breadcrumb-cum', '/blog/the-prive/', 'd', 'top'],
	['tim-kiem-prive', '/?s=prive', 'd', 'top'],
	['footer-mang-xa-hoi', '/lien-he/', 'd', 'footer'],
];
const SCREEN = { d: [1536, 864, 1.25], m: [390, 844, 2] };

export async function login(b) {
	const c = await b.newContext(); const p = await c.newPage();
	await p.goto(BASE + '/');
	await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
	const s = await c.storageState(); await c.close(); return s;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const dir = process.argv[2]; mkdirSync(dir, { recursive: true });
	const b = await chromium.launch(), state = await login(b), info = {};
	for (const [name, path, scr, act] of CASES) {
		const [w, h, dpr] = SCREEN[scr];
		const ctx = await b.newContext({ storageState: state, viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
		const p = await ctx.newPage();
		const res = await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
		await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
		const shot = { path: `${dir}/${name}.jpg`, type: 'jpeg', quality: 60 };
		let extra = {};
		if (act.startsWith('tab:')) { await p.getByRole('button', { name: act.slice(4), exact: true }).first().click(); await p.locator('#du-an').scrollIntoViewIfNeeded(); await p.locator('#du-an').screenshot(shot); }
		else if (act === 'chip:khu') { await p.locator('button[data-key="khu"]').first().click(); await p.waitForTimeout(200); await p.locator('main').screenshot(shot); }
		else if (act === 'zoom') { await p.locator('[data-zoom]').first().click(); await p.waitForTimeout(600); await p.screenshot(shot); }
		else if (act === 'bottom') { await p.evaluate(() => scrollTo(0, document.body.scrollHeight - innerHeight * 1.8)); await p.waitForTimeout(300); await p.screenshot(shot); }
		else if (act === 'footer') { await p.locator('footer').screenshot(shot); }
		else if (act === 'full') { await p.screenshot({ ...shot, fullPage: true }); }
		else if (act !== 'height') { await p.screenshot(shot); }
		if (act.startsWith('tab:') || act === 'chip:khu') extra = await p.evaluate(() => { const g = document.querySelector('#du-an .grid, #du-an-luoi'); const cards = [...g.children]; return { dem: document.querySelector('[data-count]')?.textContent, the_hien: cards.filter((c) => c.getBoundingClientRect().height > 0).length, rong_the_dau: Math.round(cards.find((c) => c.getBoundingClientRect().height > 0)?.getBoundingClientRect().width || 0) }; });
		info[name] = { status: res.status(), cao: await p.evaluate(() => document.documentElement.scrollHeight), ...extra };
		await ctx.close();
	}
	await b.close();
	writeFileSync(`${dir}/so-lieu.json`, JSON.stringify(info, null, 1));
	console.log(JSON.stringify(info));
}
