// Before/after crops for round 8 (selectors moved to the 1.0 markup in step 3) (items 1–16): full viewport width of the target, sticky header + section tabs hidden,
// real scroll with every picture loaded first. deviceScaleFactor 2, viewports 1366 and 390.
// Usage: VIEW_PASSWORD_FILE=… node tools/shots_r8.mjs <out-dir> [only-prefix]
//        … --first <out-dir>    first screen (no scroll) of 6 pages × 4 screens
//        … --badges <out-dir>   20 pictures that carry the printed VELIS badge, each cropped to its frame (item 2)
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const BASE = 'https://staging.velisrealty.vn';
const POST = '/blog/the-prive/loi-suat-cho-thue-the-prive/';
export const SHOTS = [
	['01a-hero-trang-chu', '/', '.hero'],
	['01b-hero-the-global-city', '/du-an/the-global-city/', '.hero'],
	['01c-anh-noi-dung', '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/', '.prose .wp-block-image'],
	['01d-the-du-an', '/du-an/', 'main .grid'],
	['02-huy-hieu-sau-nut-goi', '/du-an/the-global-city/', '.hero .hero__body'],
	['03-cot-phai-the-global-city', '/du-an/the-global-city/', '.page__side'],
	['06-mat-bang-the-prive', '/du-an/the-prive/', '[data-tabs] .pic'],
	['07-dai-du-an-noi-bat', '/', '.feats'],
	['08-khung-du-phong-the-global-city', '/du-an/the-global-city/', '#phan-khu'],
	['09-luoi-bai-vinhomes-saigon-park', '/du-an/vinhomes-saigon-park/', '#bai-viet'],
	['10-meta-the-bai', '/blog/', 'main .grid'],
	['11-vi-tri-the-prive', '/du-an/the-prive/', '#vi-tri'],
	['11b-vi-tri-persa-place', '/du-an/spring-ville/persa-place/', '#vi-tri'],
	['12-tien-do-the-prive', '/du-an/the-prive/', '#tien-do'],
	['13-thu-vien-the-prive', '/du-an/the-prive/', '#thu-vien'],
	['14-chip-hero-the-global-city', '/du-an/the-global-city/', '.hero__body'],
	['15-cot-phai-bai', POST, null], // viewport mid-article; header kept (the rule is about its position under the header)
	['16-hop-tac-gia', POST, '.page__main .advisor[aria-label="Tác giả"]'],
];

const FIRST = [['trang-chu', '/'], ['the-global-city', '/du-an/the-global-city/'], ['du-an', '/du-an/'], ['persa-place', '/du-an/spring-ville/persa-place/'],
	['bai-dai', '/blog/vinhomes/vinhomes-2026-bds-xanh-hay-greenwashing/'], ['gioi-thieu', '/gioi-thieu/']];
const SCREENS = [[1366, 768, 1], [1536, 864, 1.25], [1920, 1080, 1], [390, 844, 2]];
// [name, path, selector, index among matches] – the clipping frame (not the zoomed <img>, whose box spills past it) of a
// photo that has the badge in its source file
const BADGES = [
	['hero-trang-chu', '/', '.hero', 0], ['hero-the-global-city', '/du-an/the-global-city/', '.hero', 0],
	['hero-the-prive', '/du-an/the-prive/', '.hero', 0], ['hero-persa-place', '/du-an/spring-ville/persa-place/', '.hero', 0],
	['dai-noi-bat-1', '/', '.feats li', 0], ['dai-noi-bat-3', '/', '.feats li', 2],
	['the-du-an-1', '/du-an/', 'main .card__media', 0], ['the-du-an-2', '/du-an/', 'main .card__media', 1], ['the-du-an-3', '/du-an/', 'main .card__media', 2],
	['the-phan-khu-tgc', '/du-an/the-global-city/', '#phan-khu .card__media', 2], ['the-bai-blog', '/blog/', 'main .card__media', 1],
	['thu-vien-the-prive-1', '/du-an/the-prive/', '.gallery__track li', 0], ['thu-vien-the-prive-2', '/du-an/the-prive/', '.gallery__track li', 1],
	['ban-do-noi-dung-the-prive', '/du-an/the-prive/', '#vi-tri .pic, #vi-tri .prose img', 0], ['anh-noi-dung-tgc', '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/', '.prose .pic, .prose .wp-block-image', 0],
	['anh-dau-bai', '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/', '.page__main header .pic', 0], ['tien-do-the-prive', '/du-an/the-prive/', '#tien-do .grid .card', 0],
	['cot-phai-the-global-city', '/du-an/the-global-city/', '.page__side .advisor', 0], ['cot-phai-bai', '/blog/vinhomes/vinhomes-2026-bds-xanh-hay-greenwashing/', '.page__side .card__media, .page__side .advisor', 0],
	['nam-trong-persa-place', '/du-an/spring-ville/persa-place/', '.within__img', 0],
];

async function settle(p) {
	await p.evaluate(async () => {
		for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
		document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'));
	});
	await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
	await p.evaluate(() => scrollTo(0, 0));
	await p.waitForTimeout(300);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const [out, only = ''] = process.argv.slice(2);
	mkdirSync(out, { recursive: true });
	const b = await chromium.launch();
	const login = await b.newContext();
	const lp = await login.newPage();
	await lp.goto(BASE + '/');
	await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
	const state = await login.storageState();
	if (out === '--first' || out === '--badges') {
		const dir = only; mkdirSync(dir, { recursive: true });
		const hide = () => document.head.insertAdjacentHTML('beforeend', '<style>.header,.tabs,.cta{visibility:hidden!important}</style>');
		if (out === '--first') for (const [w, h, dpr] of SCREENS) {
			const ctx = await b.newContext({ storageState: state, deviceScaleFactor: dpr, viewport: { width: w, height: h } });
			for (const [name, path] of FIRST) {
				const p = await ctx.newPage();
				await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
				await p.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight && i.loading !== 'lazy').every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
				await p.waitForTimeout(600);
				await p.screenshot({ path: `${dir}/${name}-${w}x${h}-dpr${dpr}.jpg`, quality: 80 });
				console.log(name, w, dpr); await p.close();
			}
			await ctx.close();
		}
		else for (const w of [1366, 390]) {
			const ctx = await b.newContext({ storageState: state, deviceScaleFactor: 2, viewport: { width: w, height: w < 768 ? 844 : 900 } });
			for (const [name, path, sel, k] of BADGES) {
				const p = await ctx.newPage();
				await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
				await settle(p);
				await p.evaluate(hide);
				const el = p.locator(sel).nth(k);
				if (!(await el.count()) || !(await el.isVisible())) { console.log('không có', name, w); await p.close(); continue; }
				await el.evaluate((e) => { const t = e.closest('.gallery__track'); if (t) t.scrollLeft = e.offsetLeft - t.offsetLeft; e.scrollIntoView({ block: 'center' }); });
				await p.waitForTimeout(500);
				await el.screenshot({ path: `${dir}/${name}-${w}.jpg`, quality: 85 });
				console.log(name, w); await p.close();
			}
			await ctx.close();
		}
		await b.close();
		process.exit(0);
	}
	for (const w of [1366, 390]) {
		const ctx = await b.newContext({ storageState: state, deviceScaleFactor: 2, viewport: { width: w, height: w < 768 ? 844 : 900 } });
		for (const [name, path, sel] of SHOTS.filter(([n]) => n.startsWith(only))) {
			const p = await ctx.newPage();
			await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
			await settle(p);
			const file = `${out}/${name}-${w}.jpg`;
			if (!sel) {
				const y = await p.evaluate(() => { const a = document.querySelector('.page__main, main'); const r = a.getBoundingClientRect(); return Math.round(r.top + scrollY + r.height * 0.45); });
				await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(500);
				await p.screenshot({ path: file, quality: 80 });
			} else {
				const box = await p.evaluate((sel) => {
					const el = [...document.querySelectorAll(sel)].find((e) => e.getBoundingClientRect().height > 0);
					if (!el) return null;
					document.head.insertAdjacentHTML('beforeend', '<style>.header,.tabs,.cta{visibility:hidden!important}</style>');
					const r = el.getBoundingClientRect();
					return { y: Math.round(r.top + scrollY), h: Math.round(r.height) };
				}, sel);
				if (!box) { console.log('không có', name, w); await p.close(); continue; }
				await p.screenshot({ path: file, quality: 80, fullPage: true, clip: { x: 0, y: Math.max(0, box.y - 16), width: w, height: Math.min(box.h + 32, 4000) } });
			}
			console.log(file);
			await p.close();
		}
		await ctx.close();
	}
	await b.close();
}
