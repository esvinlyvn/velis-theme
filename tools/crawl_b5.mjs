#!/usr/bin/env node
// Vòng bố cục + ổn định – máy quét toàn site STAGING (không chụp ảnh, chỉ đọc, mật khẩu xem staging):
// mọi URL nội bộ tới được từ trang chủ + sitemap (sitemap đọc bằng phiên quản trị nếu có STATE, vì staging chặn khách).
// Mỗi trang ở 1366 và 390 px: mã trả về, đúng 1 H1, tràn ngang, ảnh hỏng/chưa tải sau khi cuộn hết; mọi link nội bộ
// được kiểm mã (GET, không theo redirect quá 1 bước). Kèm title + meta description để soát nội dung.
// Loại trừ 7 ứng dụng + /meta-check.zip (CLAUDE.md). Usage: VIEW_PASSWORD_FILE=… [STATE=adm-state.json] node tools/crawl_b5.mjs out.json
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = 'https://staging.velisrealty.vn';
export const APPS = ['/check-can-the-prive', '/check-sdt', '/cmgd', '/lucky-lead', '/meta-check', '/tao-qr-bank', '/thi'];
export const excluded = (path) => APPS.some((a) => path === a || path.startsWith(a + '/') || path.startsWith(a + '?') || path.startsWith(a + '.')) || path.startsWith('/wp-') || /\.(pdf|zip|jpe?g|png|webp|svg|xml|kml)$/i.test(path);
console.assert(excluded('/thi/') && excluded('/meta-check.zip') && !excluded('/thiet-ke-nha/') && !excluded('/'), 'excluded() self-check');

if (import.meta.url === `file://${process.argv[1]}`) {
	const out = process.argv[2] || 'crawl.json';
	const b = await chromium.launch();
	const ctx = await b.newContext({ viewport: { width: 1366, height: 900 } });
	const lp = await ctx.newPage();
	await lp.goto(BASE + '/');
	await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
	const seeds = new Set(['/']);
	if (process.env.STATE) { // sitemap URLs via the admin session (read-only)
		const a = await b.newContext({ storageState: process.env.STATE }); const ap = await a.newPage();
		await ap.goto(BASE + '/sitemap_index.xml');
		const maps = [...(await ap.content()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
		for (const m of maps) { await ap.goto(m); for (const [, u] of (await ap.content()).matchAll(/<loc>([^<]+)<\/loc>/g)) if (u.startsWith(BASE) && !/\.(jpe?g|png|webp)$/.test(u)) seeds.add(new URL(u).pathname); }
		await a.close();
	}
	const queue = [...seeds], seen = new Set(queue), pages = [], linkStatus = new Map();
	const status = async (path) => {
		if (!linkStatus.has(path)) { const r = await ctx.request.get(BASE + path, { maxRedirects: 0, failOnStatusCode: false }); linkStatus.set(path, r.status()); }
		return linkStatus.get(path);
	};
	// K pages in parallel (env CRAWL_K, default 3): a single tab took > 50 min on staging with cache off
	let busy = 0; // pages being read: their links may still refill the queue
	const crawl = async (p) => { for (;;) {
		if (!queue.length) { if (!busy) return; await new Promise((r) => setTimeout(r, 300)); continue; }
		const path = queue.shift(); busy++;
		const row = { path, width: {} };
		for (const w of [1366, 390]) {
			await p.setViewportSize({ width: w, height: w > 500 ? 900 : 844 });
			const r = await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 }).catch(() => null);
			row.status = r ? r.status() : 0;
			await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((s) => setTimeout(s, 60)); } scrollTo(0, 0); });
			await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
			row.width[w] = await p.evaluate(() => ({
				h1: document.querySelectorAll('h1').length,
				overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				badImg: [...document.images].filter((i) => i.complete && i.getBoundingClientRect().width && !i.naturalWidth).map((i) => i.currentSrc || i.src).slice(0, 5),
			}));
			if (w === 1366) {
				Object.assign(row, await p.evaluate(() => ({ title: document.title, desc: document.querySelector('meta[name=description]')?.content || '' })));
				row.links = [...new Set(await p.evaluate((B) => [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(B)).map((h) => { const u = new URL(h); return u.pathname + u.search; }), BASE))];
			}
		}
		pages.push(row);
		for (const l of row.links || []) {
			const lp2 = l.split('#')[0];
			if (excluded(lp2)) continue;
			const s = await status(lp2);
			if (s === 200 && !seen.has(lp2) && !lp2.includes('?')) { seen.add(lp2); queue.push(lp2); }
		}
		busy--;
	} };
	const K = +(process.env.CRAWL_K || 3), runs = [];
	for (let k = 0; k < K; k++) runs.push(crawl(await ctx.newPage())); // idle workers wait while another page may refill the queue
	await Promise.all(runs);
	const brokenLinks = [...linkStatus].filter(([, s]) => s >= 400);
	const res = { pages: pages.length, links: linkStatus.size, brokenLinks, errors: pages.filter((r) => r.status !== 200 || Object.values(r.width).some((x) => x.h1 !== 1 || x.overflow > 0 || x.badImg.length)).map((r) => ({ path: r.path, status: r.status, width: r.width })), all: pages.map(({ path, status, title, desc }) => ({ path, status, title, desc })) };
	writeFileSync(out, JSON.stringify(res, null, 1));
	console.log(`trang ${res.pages} · link ${res.links} · link hỏng ${brokenLinks.length} · trang lỗi ${res.errors.length}`);
	await b.close();
}
