#!/usr/bin/env node
// Step 3, round 2 – before / after evidence for items 2.1–2.16 on STAGING (guest view behind the staging password).
// Each shot: [id, path, selector | null (first screen), screens]. A selector crops the page to that element (full
// viewport width, at most 2400 px tall); sticky header / CTA hidden so they do not cover the crop.
// Usage: VIEW_PASSWORD_FILE=… node tools/shots_b3r2.mjs <out-dir> [id-prefix]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { login } from './shots_b3.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const BASE = process.env.STAGING || 'https://staging.velisrealty.vn';
const SCR = { M1: [1366, 768, 1], M5: [390, 844, 2] };
const TGC = '/du-an/the-global-city/', MPP = '/du-an/the-global-city/masteri-park-place/', POST = '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/';
export const SHOTS = [
	['2-01-cot-tgc', TGC, '.page', ['M1']],
	['2-01-cot-bai', POST, '.page', ['M1']],
	['2-01-cot-gioi-thieu', '/gioi-thieu/', 'main', ['M1']],
	['2-01-cot-tuyen-dung', '/tuyen-dung/', 'main', ['M1']],
	['2-02-anh-dau-bai', POST, '.page__main', ['M1', 'M5']],
	['2-02-thuoc-phan-khu-mpp', MPP, '#tong-quan', ['M1', 'M5']],
	['2-03-tieu-de-tgc', TGC, '#tong-quan', ['M1']],
	['2-04-doc-tiep-tgc', TGC, '.page__main', ['M1']],
	['2-05-luoi-du-an', '/du-an/', 'main', ['M1']],
	['2-05-hero-dong', '/du-an/spring-ville/nha-pho/', null, ['M1', 'M5']],
	['2-06-loc-du-an', '/du-an/', '[data-filter]', ['M1', 'M5']],
	['2-07-hero-trang-chu', '/', null, ['M1']],
	['2-07-hero-du-an', '/du-an/', null, ['M1']],
	['2-07-hero-gioi-thieu', '/gioi-thieu/', null, ['M1']],
	['2-08-gia-tri', '/', '#ve-velis', ['M1']],
	['2-09-doi-tac', '/', '.partners', ['M1', 'M5']],
	['2-10-chu-dau-tu', '/chu-dau-tu/', 'main', ['M1']],
	['2-11-tu-van-tgc', TGC, '.page__side', ['M1']],
	['2-11-tu-van-mpp', MPP, '.page__side', ['M1']],
	['2-11-tu-van-mobile-tgc', TGC, '.advisor-inline', ['M5']],
	['2-11-cau-vai-tro-tgc', TGC, '.page__side .advisor', ['M1']],
	['2-11-cau-vai-tro-tgc', TGC, '.advisor-inline .advisor', ['M5']],
	['2-11-cau-vai-tro-mpp', MPP, '.page__side .advisor', ['M1']],
	['2-11-cau-vai-tro-mpp', MPP, '.advisor-inline .advisor', ['M5']],
	['2-11-cau-vai-tro-dong', '/du-an/spring-ville/nha-pho/', '.page__side .advisor', ['M1']],
	['2-11-cau-vai-tro-dong', '/du-an/spring-ville/nha-pho/', '.advisor-inline .advisor', ['M5']],
	['2-12-so-sanh', TGC, '#so-sanh', ['M1', 'M5']],
	['2-13-tuyen-dung', '/tuyen-dung/', null, ['M1', 'M5']],
	['2-14-404', '/khong-ton-tai-xyz/', null, ['M1', 'M5']],
	['2-15-dai-noi-bat', '/', '.feats', ['M5']],
	['2-15-footer', '/', 'footer', ['M5']],
	['2-15-the-bai', '/blog/', 'main', ['M5']],
	['2-16-tab-du-an', TGC, '.tabs', ['M5']],
	['2-16-tab-khu-vuc', '/', '#du-an', ['M5']],
];

if (import.meta.url === `file://${process.argv[1]}`) {
	const [dir, only = ''] = process.argv.slice(2);
	mkdirSync(dir, { recursive: true });
	const b = await chromium.launch(), state = await login(b);
	for (const [m, [w, h, dpr]] of Object.entries(SCR)) {
		const ctx = await b.newContext({ storageState: state, viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
		for (const [id, path, sel, screens] of SHOTS) {
			if (!screens.includes(m) || !id.startsWith(only)) continue;
			const p = await ctx.newPage();
			try {
				await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
				if (sel) {
					await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } scrollTo(0, 0); });
					await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
					await p.addStyleTag({ content: '.header, .cta { position: static !important; } .cta { display: none !important; }' });
				} else {
					await p.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight).every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
				}
				await p.waitForTimeout(300);
				const box = sel ? await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { y: r.top + scrollY, h: r.height }; }, sel) : null;
				const path_ = `${dir}/${id}-${m}.jpg`;
				if (sel && !box) { console.log(`${id} ${m}: không thấy ${sel}`); await p.close(); continue; }
				await p.screenshot(box ? { path: path_, type: 'jpeg', quality: 72, fullPage: true, clip: { x: 0, y: Math.max(0, box.y - 8), width: w, height: Math.min(box.h + 16, 2400) } } : { path: path_, type: 'jpeg', quality: 72 });
				console.log(`${id} ${m}: ok`);
			} catch (e) { console.log(`${id} ${m}: lỗi ${e.message.split('\n')[0]}`); }
			await p.close();
		}
		await ctx.close();
	}
	await b.close();
}
