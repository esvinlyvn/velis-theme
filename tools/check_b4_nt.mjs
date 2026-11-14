#!/usr/bin/env node
// Step 4 – NT codes not covered by the suite / check_ui / interactions, measured once on STAGING (read-only, guest view):
// NT-61 table of contents ≥ 5 items fully visible at 1366×768 before scrolling past the side column top · NT-62 project card in
// a post's side column carries the project name · NT-63 author box link left-aligned with its box text · NT-65 post lead image
// not lazy + fetchpriority high · NT-92 first-screen image bytes ≤ 400 KB (M1, M2, M5) · NT-93 whole home image bytes ≤ 1 MB
// (M1, M2) · NT-95 LCP-candidate image ≤ 150 KB on mobile (home, TGC, a post, /du-an/).
// Usage: VIEW_PASSWORD_FILE=… node tools/check_b4_nt.mjs out.md
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = 'https://staging.velisrealty.vn';
const POSTS = ['/blog/the-prive/loi-suat-cho-thue-the-prive/', '/blog/vinhomes/he-sinh-thai-vingroup-tien-loi-toi-da-hay-chiec-long-vang/', '/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/', '/blog/spring-ville/thiet-ke-biophilic-persa-place-thu-hut-gioi-tri-thuc/', '/blog/ansana-by-kita/he-thong-tien-ich-ansana-by-kita-one-stop-living-hub/'];
const M = { M1: [1366, 768, 1], M2: [1536, 864, 1.25], M5: [390, 844, 2] };
export const kb = (n) => Math.round(n / 1024);
console.assert(kb(2048) === 2 && kb(1535) === 1, 'kb');

const b = await chromium.launch();
const lc = await b.newContext(), lp = await lc.newPage();
await lp.goto(BASE + '/'); await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
const state = await lc.storageState(); await lc.close();
const rows = [];
const row = (code, what, val, ok) => { rows.push(`| ${code} | ${what} | ${val} | ${ok ? 'đạt' : '**không đạt**'} |`); console.log(code, what, val, ok); };
// image bytes received, by response (only image/* content types)
async function imageBytes(path, [w, h, dpr], scroll) {
	const ctx = await b.newContext({ storageState: state, viewport: { width: w, height: h }, deviceScaleFactor: dpr });
	const p = await ctx.newPage(); const got = {};
	p.on('response', async (r) => { if (/^image\//.test(r.headers()['content-type'] || '')) { try { got[r.url()] = (await r.body()).length; } catch {} } });
	await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 }); await p.waitForTimeout(1500);
	if (scroll) { await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } }); await p.waitForTimeout(1500); }
	const lcp = await p.evaluate(() => new Promise((res) => { let last = null; new PerformanceObserver((l) => { const e = l.getEntries().at(-1); last = e?.element?.currentSrc || e?.url || null; }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => res(last), 300); }));
	// NT-92 counts the images ON the first screen; lazy images the browser fetches ahead (below the fold) are reported apart
	const vis = scroll ? null : await p.evaluate(() => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight; }).map((i) => i.currentSrc));
	const all = Object.values(got).reduce((a, n) => a + n, 0), bytes = vis ? Object.entries(got).filter(([u]) => vis.includes(u)).reduce((a, [, n]) => a + n, 0) : all;
	await ctx.close(); return { bytes, all, lcp };
}
for (const path of ['/', '/du-an/the-global-city/', POSTS[0], '/du-an/']) for (const m of ['M1', 'M2', 'M5']) {
	const r = await imageBytes(path, M[m], false);
	row('NT-92', `${path} ${m} ảnh trong màn đầu`, `${kb(r.bytes)} KB (cả ảnh trình duyệt tải trước dưới màn đầu: ${kb(r.all)} KB)`, r.bytes <= 400 * 1024);
	if (m === 'M5' && r.lcp) {
		const head = await (await b.newContext({ storageState: state })).request.get(r.lcp); const n = (await head.body()).length;
		row('NT-95', `${path} M5 ảnh LCP ${r.lcp.split('/').pop()}`, `${kb(n)} KB`, n <= 150 * 1024);
	}
}
for (const m of ['M1', 'M2']) { const r = await imageBytes('/', M[m], true); row('NT-93', `trang chủ ${m} cả trang`, `${kb(r.bytes)} KB`, r.bytes <= 1024 * 1024); }
const ctx = await b.newContext({ storageState: state, viewport: { width: 1366, height: 768 } });
for (const path of POSTS) {
	const p = await ctx.newPage(); await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
	const r = await p.evaluate(() => {
		const side = document.querySelector('.page__side'), toc = side?.querySelector('[data-toc]');
		const total = toc ? toc.querySelectorAll('li').length : 0;
		const vis = toc ? [...toc.querySelectorAll('li')].filter((li) => { const b = li.getBoundingClientRect(); return b.height && b.top >= 0 && b.bottom <= innerHeight; }).length : null;
		const card = side?.querySelector('.advisor'), name = card?.querySelector('.pricecard__title, .advisor__who, h3, b')?.textContent.trim();
		const img = document.querySelector('.page__main header .pic img');
		const au = document.querySelector('[aria-label="Tác giả"]'), link = au?.querySelector('.btn--text');
		return { toc: !!toc, vis, total, open: toc?.open, name, lazy: img?.loading, fp: img?.getAttribute('fetchpriority'), dx: au && link ? Math.round(link.getBoundingClientRect().left - au.querySelector('.eyebrow').getBoundingClientRect().left) : null };
	});
	if (r.toc) row('NT-61', `${path} mục lục`, `${r.vis}/${r.total} mục thấy trọn`, r.vis >= Math.min(5, r.total)); // a TOC shorter than 5 items: all of them
	row('NT-62', `${path} thẻ cột phải`, r.name || '–', !!r.name);
	row('NT-63', `${path} link "Tất cả bài của …"`, `lệch ${r.dx} px`, r.dx !== null && Math.abs(r.dx) <= 1);
	row('NT-65', `${path} ảnh đầu bài`, `loading=${r.lazy} fetchpriority=${r.fp}`, r.lazy !== 'lazy' && r.fp === 'high');
	await p.close();
}
await b.close();
const bad = rows.filter((r) => r.includes('không đạt')).length;
writeFileSync(process.argv[2] || 'nt-b4.md', `# NT đo riêng ở bước 4 – ${new Date().toISOString().slice(0, 10)} (staging, chỉ đọc)\n\n| Mã | Đo | Giá trị | Kết quả |\n|---|---|---|---|\n${rows.join('\n')}\n\n**Không đạt: ${bad}**\n`);
console.log('không đạt', bad);
